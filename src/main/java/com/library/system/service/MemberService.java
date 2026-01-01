package com.library.system.service;

import com.library.system.dto.BorrowingRecordDTO;
import com.library.system.dto.MemberDTO;
import com.library.system.dto.MemberRequestDTO;
import com.library.system.exception.BusinessRuleException;
import com.library.system.exception.ResourceNotFoundException;
import com.library.system.model.Member;
import com.library.system.model.Role;
import com.library.system.model.User;
import com.library.system.repository.BorrowingRecordRepository;
import com.library.system.repository.MemberRepository;
import com.library.system.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final BorrowingRecordRepository borrowingRecordRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberRepository memberRepository,
            UserRepository userRepository,
            BorrowingRecordRepository borrowingRecordRepository,
            PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.borrowingRecordRepository = borrowingRecordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<MemberDTO> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public MemberDTO getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
        return mapToDTO(member);
    }

    public MemberDTO getMemberByEmail(String email) { // Helper
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Member member = memberRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found for user"));
        return mapToDTO(member);
    }

    @Transactional
    public MemberDTO registerMember(MemberRequestDTO request) {
        User user;

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found")); // Should not happen given
                                                                                         // exists check

            // Check if this user already has a member profile
            if (memberRepository.findByUserUserId(user.getUserId()).isPresent()) {
                throw new BusinessRuleException("User with this email already has a member profile.");
            }

        } else {
            // Create new user
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new BusinessRuleException("Username is already taken");
            }

            user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setFullName(request.getFullName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(Role.MEMBER);
            user = userRepository.save(user);
        }

        Member member = new Member();
        member.setUser(user);
        member.setMembershipNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase()); // Simple generator
        member.setPhoneNumber(request.getPhoneNumber());
        member.setAddress(request.getAddress());
        member.setMembershipType(request.getMembershipType());
        member.setMembershipStartDate(LocalDate.now());
        member.setMembershipEndDate(LocalDate.now().plusYears(1));
        member.setActive(true);

        Member savedMember = memberRepository.save(member);
        return mapToDTO(savedMember);
    }

    @Transactional
    public MemberDTO updateMember(Long id, MemberRequestDTO request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));

        member.setPhoneNumber(request.getPhoneNumber());
        member.setAddress(request.getAddress());
        member.setMembershipType(request.getMembershipType());

        return mapToDTO(memberRepository.save(member));
    }

    public List<BorrowingRecordDTO> getBorrowingHistory(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new ResourceNotFoundException("Member not found");
        }
        return borrowingRecordRepository.findByMemberMemberId(memberId).stream()
                .map(record -> {
                    BorrowingRecordDTO dto = new BorrowingRecordDTO();
                    dto.setRecordId(record.getRecordId());
                    dto.setMemberId(record.getMember().getMemberId());
                    dto.setBookId(record.getBook().getBookId());
                    dto.setBookTitle(record.getBook().getTitle());
                    dto.setBorrowDate(record.getBorrowDate());
                    dto.setDueDate(record.getDueDate());
                    dto.setReturnDate(record.getReturnDate());
                    dto.setStatus(record.getStatus());
                    dto.setLateFee(record.getLateFee());
                    dto.setNotes(record.getNotes());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private MemberDTO mapToDTO(Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setMemberId(member.getMemberId());
        dto.setUserId(member.getUser().getUserId());
        dto.setUsername(member.getUser().getUsername());
        dto.setFullName(member.getUser().getFullName());
        dto.setEmail(member.getUser().getEmail());
        dto.setMembershipNumber(member.getMembershipNumber());
        dto.setPhoneNumber(member.getPhoneNumber());
        dto.setAddress(member.getAddress());
        dto.setMembershipType(member.getMembershipType());
        dto.setMembershipStartDate(member.getMembershipStartDate());
        dto.setMembershipEndDate(member.getMembershipEndDate());
        dto.setActive(member.isActive());
        return dto;
    }
}
