package com.library.system.repository;

import com.library.system.model.Book;
import com.library.system.model.BorrowingRecord;
import com.library.system.model.BorrowingStatus;
import com.library.system.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowingRecordRepository extends JpaRepository<BorrowingRecord, Long> {
    List<BorrowingRecord> findByMemberMemberId(Long memberId);

    List<BorrowingRecord> findByStatus(BorrowingStatus status);

    List<BorrowingRecord> findByMemberAndStatus(Member member, BorrowingStatus status);

    long countByMemberAndStatus(Member member, BorrowingStatus status);

    // Check if book is currently borrowed
    boolean existsByBookAndStatus(Book book, BorrowingStatus status);

    // Find overdue books (active borrow + due date passed)
    List<BorrowingRecord> findByStatusAndDueDateBefore(BorrowingStatus status, LocalDate date);
}
