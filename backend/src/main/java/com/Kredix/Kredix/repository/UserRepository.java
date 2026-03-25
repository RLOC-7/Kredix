package com.Kredix.Kredix.repository;

import java.util.Optional;
import com.Kredix.Kredix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

}
