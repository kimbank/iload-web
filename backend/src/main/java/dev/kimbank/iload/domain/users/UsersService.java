package dev.kimbank.iload.domain.users;

import dev.kimbank.iload.domain.users.dto.UserSignupRequest;
import dev.kimbank.iload.domain.users.dto.UserResponse;
import dev.kimbank.iload.domain.users.dto.UsernameCheckResponse;
import dev.kimbank.iload.domain.users.entity.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsersService {

    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;

    /**
     * username 중복 체크
     */
    public UsernameCheckResponse checkUsernameAvailability(String username) {
        if (username == null || username.trim().isEmpty()) {
            return new UsernameCheckResponse(false, "사용자명을 입력해주세요.");
        }
        
        if (username.length() < 3 || username.length() > 20) {
            return new UsernameCheckResponse(false, "사용자명은 3자 이상 20자 이하여야 합니다.");
        }
        
        boolean exists = usersRepository.findByUsername(username).isPresent();
        if (exists) {
            return new UsernameCheckResponse(false, "이미 사용 중인 사용자명입니다.");
        } else {
            return new UsernameCheckResponse(true, "사용 가능한 사용자명입니다.");
        }
    }

    /**
     * 회원가입
     */
    @Transactional
    public UserResponse signupUser(UserSignupRequest request) {
        // 입력 검증
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("사용자명은 필수입니다.");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }
        if (request.getUsername().length() < 3 || request.getUsername().length() > 20) {
            throw new IllegalArgumentException("사용자명은 3자 이상 20자 이하여야 합니다.");
        }
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("비밀번호는 6자 이상이어야 합니다.");
        }
        
        // 중복 체크
        if (usersRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 사용자명입니다.");
        }
        
        // 사용자 생성
        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // 비밀번호 암호화
        
        Users savedUser = usersRepository.save(user);
        
        return new UserResponse(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getCreatedAt()
        );
    }

    /**
     * username으로 사용자 조회
     */
    public Optional<Users> findByUsername(String username) {
        return usersRepository.findByUsername(username);
    }
}
