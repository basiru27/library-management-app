package com.library.system.controller;

import com.library.system.dto.BorrowingRecordDTO;
import com.library.system.dto.BorrowingRequestDTO;
import com.library.system.dto.MemberDTO;
import com.library.system.service.BorrowingService;
import com.library.system.service.MemberService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/borrowing")
public class BorrowingController {

    private final BorrowingService borrowingService;
    private final MemberService memberService;

    public BorrowingController(BorrowingService borrowingService, MemberService memberService) {
        this.borrowingService = borrowingService;
        this.memberService = memberService;
    }

    @PostMapping("/borrow")
    @PreAuthorize("hasAnyRole('MEMBER', 'LIBRARIAN')")
    public ResponseEntity<BorrowingRecordDTO> borrowBook(
            @RequestBody @Valid BorrowingRequestDTO request,
            Authentication authentication) {
        boolean isLibrarian = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_LIBRARIAN"));

        Long memberIdToUse = request.getMemberId();

        if (!isLibrarian) {
            MemberDTO currentMember = memberService.getMemberByEmail(authentication.getName());
            memberIdToUse = currentMember.getMemberId();
        } else {
            if (memberIdToUse == null) {
                throw new IllegalArgumentException("Member ID is required for Librarian actions");
            }
        }

        return ResponseEntity.ok(borrowingService.borrowBook(memberIdToUse, request.getBookId()));
    }

    @PostMapping("/return/{recordId}")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<BorrowingRecordDTO> returnBook(@PathVariable Long recordId) {
        return ResponseEntity.ok(borrowingService.returnBook(recordId));
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<BorrowingRecordDTO>> getActiveBorrowings() {
        return ResponseEntity.ok(borrowingService.getActiveBorrowings());
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('LIBRARIAN')")
    public ResponseEntity<List<BorrowingRecordDTO>> getOverdueBorrowings() {
        return ResponseEntity.ok(borrowingService.getOverdueBorrowings());
    }
}
