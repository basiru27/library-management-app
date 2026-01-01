package com.library.system.service;

import com.library.system.dto.AuthRequest;
import com.library.system.dto.AuthResponse;
import com.library.system.dto.RegisterRequest;
import com.library.system.model.Role;
import com.library.system.model.User;
import com.library.system.repository.UserRepository;
import com.library.system.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final com.library.system.security.CustomUserDetailsService userDetailsService;
    private final com.library.system.repository.MemberRepository memberRepository;

    public AuthService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            com.library.system.security.CustomUserDetailsService userDetailsService,
            com.library.system.repository.MemberRepository memberRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.memberRepository = memberRepository;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.MEMBER); // Default role for public registration

        User savedUser = userRepository.save(user);

        // Auto-create Member profile
        com.library.system.model.Member member = new com.library.system.model.Member();
        member.setUser(savedUser);
        member.setMembershipNumber(java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        member.setMembershipType(com.library.system.model.MembershipType.PUBLIC); // Default
        member.setMembershipStartDate(java.time.LocalDate.now());
        member.setMembershipEndDate(java.time.LocalDate.now().plusYears(1));
        member.setActive(true);
        // Address and Phone are null for self-registration

        memberRepository.save(member);

        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        var jwtToken = jwtService.generateToken(userDetails);
        return new AuthResponse(jwtToken, user.getRole().name());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        var userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(userDetails);
        return new AuthResponse(jwtToken, user.getRole().name());
    }
}
