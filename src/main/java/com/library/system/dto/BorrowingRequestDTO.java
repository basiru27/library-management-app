package com.library.system.dto;

import jakarta.validation.constraints.NotNull;

public class BorrowingRequestDTO {

    @NotNull(message = "Book ID is required")
    private Long bookId;

    private Long memberId; // Optional for admin to specify member

    public BorrowingRequestDTO() {
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }
}
