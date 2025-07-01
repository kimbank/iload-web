package dev.kimbank.iload.domain.users;

import dev.kimbank.iload.domain.users.dto.UserSignupRequest;
import dev.kimbank.iload.domain.users.dto.UserResponse;
import dev.kimbank.iload.domain.users.dto.UsernameCheckResponse;
import dev.kimbank.iload.domain.users.entity.Users;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsersServiceTest {
    
    @Mock
    private UsersRepository usersRepository;

    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UsersService usersService;
    
    private Users testUser;
    
    @BeforeEach
    void setUp() {
        // 테스트용 사용자 객체 초기화
        testUser = new Users();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setCreatedAt(LocalDateTime.now());
    }
    
    // username 중복 체크 테스트 케이스들
    
    @Test
    void checkUsernameAvailability_validUsername_returnsTrueResponse() {
        // Given - 사용 가능한 username으로 테스트
        String username = "availableuser";
        when(usersRepository.findByUsername(username)).thenReturn(Optional.empty());
        
        // When - username 중복 체크 실행
        UsernameCheckResponse response = usersService.checkUsernameAvailability(username);
        
        // Then - 사용 가능하다는 응답 확인
        assertNotNull(response);
        assertTrue(response.isAvailable());
        assertEquals("사용 가능한 사용자명입니다.", response.getMessage());
        verify(usersRepository).findByUsername(username);
    }
    
    @Test
    void checkUsernameAvailability_existingUsername_returnsFalseResponse() {
        // Given - 이미 존재하는 username으로 테스트
        String username = "existinguser";
        when(usersRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        
        // When - username 중복 체크 실행
        UsernameCheckResponse response = usersService.checkUsernameAvailability(username);
        
        // Then - 사용 불가능하다는 응답 확인
        assertNotNull(response);
        assertFalse(response.isAvailable());
        assertEquals("이미 사용 중인 사용자명입니다.", response.getMessage());
        verify(usersRepository).findByUsername(username);
    }
    
    @Test
    void checkUsernameAvailability_nullUsername_returnsFalseResponse() {
        // Given - null username으로 테스트
        String username = null;
        
        // When - username 중복 체크 실행
        UsernameCheckResponse response = usersService.checkUsernameAvailability(username);
        
        // Then - 입력 오류 응답 확인
        assertNotNull(response);
        assertFalse(response.isAvailable());
        assertEquals("사용자명을 입력해주세요.", response.getMessage());
        verifyNoInteractions(usersRepository); // Repository 호출되지 않아야 함
    }
    
    @Test
    void checkUsernameAvailability_emptyUsername_returnsFalseResponse() {
        // Given - 빈 문자열 username으로 테스트
        String username = "  ";
        
        // When - username 중복 체크 실행
        UsernameCheckResponse response = usersService.checkUsernameAvailability(username);
        
        // Then - 입력 오류 응답 확인
        assertNotNull(response);
        assertFalse(response.isAvailable());
        assertEquals("사용자명을 입력해주세요.", response.getMessage());
        verifyNoInteractions(usersRepository);
    }
    
    @Test
    void checkUsernameAvailability_tooShortUsername_returnsFalseResponse() {
        // Given - 너무 짧은 username으로 테스트 (2자)
        String username = "ab";
        
        // When - username 중복 체크 실행
        UsernameCheckResponse response = usersService.checkUsernameAvailability(username);
        
        // Then - 길이 오류 응답 확인
        assertNotNull(response);
        assertFalse(response.isAvailable());
        assertEquals("사용자명은 3자 이상 20자 이하여야 합니다.", response.getMessage());
        verifyNoInteractions(usersRepository);
    }
    
    @Test
    void checkUsernameAvailability_tooLongUsername_returnsFalseResponse() {
        // Given - 너무 긴 username으로 테스트 (21자)
        String username = "a".repeat(21);
        
        // When - username 중복 체크 실행
        UsernameCheckResponse response = usersService.checkUsernameAvailability(username);
        
        // Then - 길이 오류 응답 확인
        assertNotNull(response);
        assertFalse(response.isAvailable());
        assertEquals("사용자명은 3자 이상 20자 이하여야 합니다.", response.getMessage());
        verifyNoInteractions(usersRepository);
    }
    
    // 회원가입 테스트 케이스들
    
    @Test
    void signupUser_validRequest_returnsUserResponse() {
        // Given - 유효한 회원가입 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("newuser");
        request.setPassword("password123");
        
        when(usersRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(usersRepository.save(any(Users.class))).thenReturn(testUser);
        
        // When - 회원가입 실행
        UserResponse response = usersService.signupUser(request);
        
        // Then - 성공적인 회원가입 응답 확인
        assertNotNull(response);
        assertEquals(testUser.getId(), response.getId());
        assertEquals(testUser.getUsername(), response.getUsername());
        assertEquals(testUser.getCreatedAt(), response.getCreatedAt());
        
        verify(usersRepository).findByUsername("newuser");
        verify(usersRepository).save(any(Users.class));
    }
    
    @Test
    void signupUser_nullUsername_throwsException() {
        // Given - username이 null인 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername(null);
        request.setPassword("password123");
        
        // When & Then - 예외 발생 확인
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, 
            () -> usersService.signupUser(request)
        );
        assertEquals("사용자명은 필수입니다.", exception.getMessage());
        verifyNoInteractions(usersRepository);
    }
    
    @Test
    void signupUser_emptyUsername_throwsException() {
        // Given - username이 빈 문자열인 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("  ");
        request.setPassword("password123");
        
        // When & Then - 예외 발생 확인
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, 
            () -> usersService.signupUser(request)
        );
        assertEquals("사용자명은 필수입니다.", exception.getMessage());
        verifyNoInteractions(usersRepository);
    }
    
    @Test
    void signupUser_nullPassword_throwsException() {
        // Given - password가 null인 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("testuser");
        request.setPassword(null);
        
        // When & Then - 예외 발생 확인
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, 
            () -> usersService.signupUser(request)
        );
        assertEquals("비밀번호는 필수입니다.", exception.getMessage());
        verifyNoInteractions(usersRepository);
    }
    
    @Test
    void signupUser_emptyPassword_throwsException() {
        // Given - password가 빈 문자열인 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("testuser");
        request.setPassword("  ");
        
        // When & Then - 예외 발생 확인
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, 
            () -> usersService.signupUser(request)
        );
        assertEquals("비밀번호는 필수입니다.", exception.getMessage());
        verifyNoInteractions(usersRepository);
    }
    
    @Test
    void signupUser_shortUsername_throwsException() {
        // Given - 너무 짧은 username (2자)
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("ab");
        request.setPassword("password123");
        
        // When & Then - 예외 발생 확인
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, 
            () -> usersService.signupUser(request)
        );
        assertEquals("사용자명은 3자 이상 20자 이하여야 합니다.", exception.getMessage());
        verifyNoInteractions(usersRepository);
    }
    
    @Test
    void signupUser_longUsername_throwsException() {
        // Given - 너무 긴 username (21자)
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("a".repeat(21));
        request.setPassword("password123");
        
        // When & Then - 예외 발생 확인
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, 
            () -> usersService.signupUser(request)
        );
        assertEquals("사용자명은 3자 이상 20자 이하여야 합니다.", exception.getMessage());
        verifyNoInteractions(usersRepository);
    }
    
    @Test
    void signupUser_shortPassword_throwsException() {
        // Given - 너무 짧은 password (5자)
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("testuser");
        request.setPassword("12345");
        
        // When & Then - 예외 발생 확인
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, 
            () -> usersService.signupUser(request)
        );
        assertEquals("비밀번호는 6자 이상이어야 합니다.", exception.getMessage());
        verifyNoInteractions(usersRepository);
    }
    
    @Test
    void signupUser_duplicateUsername_throwsException() {
        // Given - 이미 존재하는 username으로 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("existinguser");
        request.setPassword("password123");
        
        when(usersRepository.findByUsername("existinguser")).thenReturn(Optional.of(testUser));
        
        // When & Then - 예외 발생 확인
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, 
            () -> usersService.signupUser(request)
        );
        assertEquals("이미 사용 중인 사용자명입니다.", exception.getMessage());
        verify(usersRepository).findByUsername("existinguser");
        verify(usersRepository, never()).save(any(Users.class)); // save는 호출되지 않아야 함
    }
    
    // findByUsername 테스트
    
    @Test
    void findByUsername_existingUser_returnsUser() {
        // Given - 존재하는 사용자
        String username = "testuser";
        when(usersRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        
        // When - 사용자 조회 실행
        Optional<Users> result = usersService.findByUsername(username);
        
        // Then - 사용자 반환 확인
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(usersRepository).findByUsername(username);
    }
    
    @Test
    void findByUsername_nonExistingUser_returnsEmpty() {
        // Given - 존재하지 않는 사용자
        String username = "nonexistent";
        when(usersRepository.findByUsername(username)).thenReturn(Optional.empty());
        
        // When - 사용자 조회 실행
        Optional<Users> result = usersService.findByUsername(username);
        
        // Then - 빈 Optional 반환 확인
        assertTrue(result.isEmpty());
        verify(usersRepository).findByUsername(username);
    }
}