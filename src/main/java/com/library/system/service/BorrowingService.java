package com.library.system.service;

import com.library.system.dto.BorrowingRecordDTO;
import com.library.system.exception.BusinessRuleException;
import com.library.system.exception.ResourceNotFoundException;
import com.library.system.model.Book;
import com.library.system.model.BorrowingRecord;
import com.library.system.model.BorrowingStatus;
import com.library.system.model.Member;
import com.library.system.repository.BookRepository;
import com.library.system.repository.BorrowingRecordRepository;
import com.library.system.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowingService {

    private final BorrowingRecordRepository borrowingRecordRepository;
    private final MemberRepository memberRepository;
    private final BookRepository bookRepository;

    public BorrowingService(BorrowingRecordRepository borrowingRecordRepository,
            MemberRepository memberRepository,
            BookRepository bookRepository) {
        this.borrowingRecordRepository = borrowingRecordRepository;
        this.memberRepository = memberRepository;
        this.bookRepository = bookRepository;
    }

    private static final int MAX_BORROW_LIMIT = 5;
    private static final BigDecimal LATE_FEE_PER_DAY = new BigDecimal("2.00");
    private static final int LOAN_PERIOD_DAYS = 14;

    @Transactional
    public BorrowingRecordDTO borrowBook(Long memberId, Long bookId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        if (!member.isActive()) {
            throw new BusinessRuleException("Member account is not active");
        }

        if (book.getAvailableCopies() <= 0) {
            throw new BusinessRuleException("Book is not available");
        }

        // Rule 1: Check active borrowings count
        long activeCount = borrowingRecordRepository.countByMemberAndStatus(member, BorrowingStatus.BORROWED);
        if (activeCount >= MAX_BORROW_LIMIT) {
            throw new BusinessRuleException("Member has reached maximum borrowing limit");
        }

        // Rule 1: Check for overdue books
        List<BorrowingRecord> activeRecords = borrowingRecordRepository.findByMemberAndStatus(member,
                BorrowingStatus.BORROWED);
        boolean hasOverdue = activeRecords.stream()
                .anyMatch(r -> r.getDueDate().isBefore(LocalDate.now()));

        if (hasOverdue) {
            throw new BusinessRuleException("Member has overdue books");
        }

        // Create Borrowing Record
        BorrowingRecord record = new BorrowingRecord();
        record.setMember(member);
        record.setBook(book);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(LOAN_PERIOD_DAYS));
        record.setStatus(BorrowingStatus.BORROWED);

        // Update Book Copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        return mapToDTO(borrowingRecordRepository.save(record));
    }

    @Transactional
    public BorrowingRecordDTO returnBook(Long recordId) {
        BorrowingRecord record = borrowingRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing record not found"));

        if (record.getStatus() != BorrowingStatus.BORROWED && record.getStatus() != BorrowingStatus.OVERDUE) {
            throw new BusinessRuleException("Book is already returned");
        }

        LocalDate returnDate = LocalDate.now();
        record.setReturnDate(returnDate);
        record.setStatus(BorrowingStatus.RETURNED);

        // Rule 2: Automatic Late Fee Calculation
        if (returnDate.isAfter(record.getDueDate())) {
            long overdueDays = ChronoUnit.DAYS.between(record.getDueDate(), returnDate);
            if (overdueDays > 0) {
                record.setLateFee(LATE_FEE_PER_DAY.multiply(BigDecimal.valueOf(overdueDays)));
            }
        }

        // Update Book Copies
        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return mapToDTO(borrowingRecordRepository.save(record));
    }

    public List<BorrowingRecordDTO> getActiveBorrowings() {
        return borrowingRecordRepository.findByStatus(BorrowingStatus.BORROWED).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BorrowingRecordDTO> getOverdueBorrowings() {
        // Logically overdue: Status=BORROWED and DueDate < Now
        // Note: We might also want to include status=OVERDUE if we had a batch job that
        // updates statuses.
        // For now we rely on calculation.
        return borrowingRecordRepository.findByStatusAndDueDateBefore(BorrowingStatus.BORROWED, LocalDate.now())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BorrowingRecordDTO mapToDTO(BorrowingRecord record) {
        BorrowingRecordDTO dto = new BorrowingRecordDTO();
        dto.setRecordId(record.getRecordId());
        dto.setMemberId(record.getMember().getMemberId());
        dto.setMemberName(record.getMember().getUser().getFullName());
        dto.setBookId(record.getBook().getBookId());
        dto.setBookTitle(record.getBook().getTitle());
        dto.setBorrowDate(record.getBorrowDate());
        dto.setDueDate(record.getDueDate());
        dto.setReturnDate(record.getReturnDate());
        dto.setStatus(record.getStatus());
        dto.setLateFee(record.getLateFee());
        dto.setNotes(record.getNotes());
        return dto;
    }
}
