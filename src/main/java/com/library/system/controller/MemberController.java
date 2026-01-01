package com.library.system.controller;

import com.library.system.dto.BorrowingRecordDTO;
import com.library.system.dto.MemberDTO;
import com.library.system.dto.MemberRequestDTO;
import com.library.system.service.MemberService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberDTO> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<MemberDTO> registerMember(@RequestBody @Valid MemberRequestDTO request) {
        return ResponseEntity.ok(memberService.registerMember(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<MemberDTO> updateMember(@PathVariable Long id, @RequestBody @Valid MemberRequestDTO request) {
        return ResponseEntity.ok(memberService.updateMember(id, request));
    }

    @GetMapping("/{id}/borrowing-history")
    public ResponseEntity<List<BorrowingRecordDTO>> getBorrowingHistory(@PathVariable Long id) {
        // In a real app we'd check if the principal owns this member or is staff
        return ResponseEntity.ok(memberService.getBorrowingHistory(id));
    }
}
