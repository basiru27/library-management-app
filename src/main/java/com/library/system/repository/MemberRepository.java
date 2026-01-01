package com.library.system.repository;

import com.library.system.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByMembershipNumber(String membershipNumber);

    Optional<Member> findByUserUserId(Long userId); // Find by User ID

    boolean existsByMembershipNumber(String membershipNumber);

    boolean existsByUserUserId(Long userId);
}
