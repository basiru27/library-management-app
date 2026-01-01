package com.library.system.service;

import com.library.system.dto.BookDTO;
import com.library.system.exception.BusinessRuleException;
import com.library.system.exception.ResourceNotFoundException;
import com.library.system.model.Book;
import com.library.system.model.BorrowingStatus;
import com.library.system.repository.BookRepository;
import com.library.system.repository.BorrowingRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BorrowingRecordRepository borrowingRecordRepository;

    public BookService(BookRepository bookRepository, BorrowingRecordRepository borrowingRecordRepository) {
        this.bookRepository = bookRepository;
        this.borrowingRecordRepository = borrowingRecordRepository;
    }

    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return mapToDTO(book);
    }

    @Transactional
    public BookDTO addBook(BookDTO bookDTO) {
        if (bookRepository.existsByIsbn(bookDTO.getIsbn())) {
            throw new BusinessRuleException("Book with ISBN " + bookDTO.getIsbn() + " already exists");
        }
        Book book = new Book();
        book.setIsbn(bookDTO.getIsbn());
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setPublicationYear(bookDTO.getPublicationYear());
        book.setTotalCopies(bookDTO.getTotalCopies());
        book.setAvailableCopies(bookDTO.getTotalCopies()); // Initially available = total

        Book savedBook = bookRepository.save(book);
        return mapToDTO(savedBook);
    }

    @Transactional
    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setPublicationYear(bookDTO.getPublicationYear());

        // Handle copies update carefully
        int newTotal = bookDTO.getTotalCopies();
        int diff = newTotal - book.getTotalCopies();
        book.setTotalCopies(newTotal);
        book.setAvailableCopies(book.getAvailableCopies() + diff);

        if (book.getAvailableCopies() < 0) {
            throw new BusinessRuleException("Cannot reduce total copies below currently borrowed count");
        }

        Book updatedBook = bookRepository.save(book);
        return mapToDTO(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        // Rule 3: Prevent Deleting Books with Active Borrowings
        boolean hasActiveBorrowings = borrowingRecordRepository.existsByBookAndStatus(book, BorrowingStatus.BORROWED);
        if (hasActiveBorrowings) {
            throw new BusinessRuleException("Cannot delete book with active borrowings");
        }

        // Also check if there are OVERDUE books which are technically still active in
        // possession
        boolean hasOverdueBorrowings = borrowingRecordRepository.existsByBookAndStatus(book, BorrowingStatus.OVERDUE);
        if (hasOverdueBorrowings) {
            throw new BusinessRuleException("Cannot delete book with overdue borrowings");
        }

        bookRepository.delete(book);
    }

    public List<BookDTO> searchBooks(String title, String author) {
        if (title == null)
            title = "";
        if (author == null)
            author = "";
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(title, author)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BookDTO mapToDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setBookId(book.getBookId());
        dto.setIsbn(book.getIsbn());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setPublicationYear(book.getPublicationYear());
        dto.setTotalCopies(book.getTotalCopies());
        dto.setAvailableCopies(book.getAvailableCopies());
        return dto;
    }
}
