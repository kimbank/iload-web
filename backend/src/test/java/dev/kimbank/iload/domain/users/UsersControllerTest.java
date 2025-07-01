package dev.kimbank.iload.domain.users;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kimbank.iload.domain.users.dto.UserSignupRequest;
import dev.kimbank.iload.domain.users.entity.Users;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class UsersControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private UsersRepository usersRepository;
    
    private Users testUser;
    
    @BeforeEach
    void setUp() {
        // 테스트 시작 전 데이터 정리
        usersRepository.deleteAll();
        
        // 테스트용 사용자 생성
        testUser = new Users();
        testUser.setUsername("existinguser");
        testUser.setPassword("password123");
        usersRepository.save(testUser);
    }
    
    // username 중복 체크 API 테스트
    
    @Test
    void checkUsername_availableUsername_returnsSuccess() throws Exception {
        // Given - 사용 가능한 username
        String username = "newuser";
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(get("/api/users/check-username")
                        .param("username", username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true))
                .andExpect(jsonPath("$.message").value("사용 가능한 사용자명입니다."));
    }
    
    @Test
    void checkUsername_existingUsername_returnsUnavailable() throws Exception {
        // Given - 이미 존재하는 username
        String username = "existinguser";
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(get("/api/users/check-username")
                        .param("username", username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false))
                .andExpect(jsonPath("$.message").value("이미 사용 중인 사용자명입니다."));
    }
    
    @Test
    void checkUsername_emptyUsername_returnsValidationError() throws Exception {
        // Given - 빈 문자열 username
        String username = "";
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(get("/api/users/check-username")
                        .param("username", username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false))
                .andExpect(jsonPath("$.message").value("사용자명을 입력해주세요."));
    }
    
    @Test
    void checkUsername_tooShortUsername_returnsValidationError() throws Exception {
        // Given - 너무 짧은 username (2자)
        String username = "ab";
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(get("/api/users/check-username")
                        .param("username", username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false))
                .andExpect(jsonPath("$.message").value("사용자명은 3자 이상 20자 이하여야 합니다."));
    }
    
    @Test
    void checkUsername_tooLongUsername_returnsValidationError() throws Exception {
        // Given - 너무 긴 username (21자)
        String username = "a".repeat(21);
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(get("/api/users/check-username")
                        .param("username", username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false))
                .andExpect(jsonPath("$.message").value("사용자명은 3자 이상 20자 이하여야 합니다."));
    }
    
    // 회원가입 API 테스트
    
    @Test
    void registerUser_validRequest_returnsCreated() throws Exception {
        // Given - 유효한 회원가입 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("newuser");
        request.setPassword("password123");
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.createdAt").exists());
    }
    
    @Test
    void registerUser_duplicateUsername_returnsBadRequest() throws Exception {
        // Given - 이미 존재하는 username으로 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("existinguser");
        request.setPassword("password123");
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("이미 사용 중인 사용자명입니다."));
    }
    
    @Test
    void registerUser_emptyUsername_returnsBadRequest() throws Exception {
        // Given - 빈 username으로 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("");
        request.setPassword("password123");
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("사용자명은 필수입니다."));
    }
    
    @Test
    void registerUser_emptyPassword_returnsBadRequest() throws Exception {
        // Given - 빈 password로 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("newuser");
        request.setPassword("");
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("비밀번호는 필수입니다."));
    }
    
    @Test
    void registerUser_shortUsername_returnsBadRequest() throws Exception {
        // Given - 너무 짧은 username (2자)
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("ab");
        request.setPassword("password123");
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("사용자명은 3자 이상 20자 이하여야 합니다."));
    }
    
    @Test
    void registerUser_longUsername_returnsBadRequest() throws Exception {
        // Given - 너무 긴 username (21자)
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("a".repeat(21));
        request.setPassword("password123");
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("사용자명은 3자 이상 20자 이하여야 합니다."));
    }
    
    @Test
    void registerUser_shortPassword_returnsBadRequest() throws Exception {
        // Given - 너무 짧은 password (5자)
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("newuser");
        request.setPassword("12345");
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("비밀번호는 6자 이상이어야 합니다."));
    }
    
    @Test
    void registerUser_nullUsername_returnsBadRequest() throws Exception {
        // Given - null username으로 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername(null);
        request.setPassword("password123");
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("사용자명은 필수입니다."));
    }
    
    @Test
    void registerUser_nullPassword_returnsBadRequest() throws Exception {
        // Given - null password로 요청
        UserSignupRequest request = new UserSignupRequest();
        request.setUsername("newuser");
        request.setPassword(null);
        
        // When & Then - API 호출 및 응답 검증
        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("비밀번호는 필수입니다."));
    }
}