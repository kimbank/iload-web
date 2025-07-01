package dev.kimbank.iload.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@OpenAPIDefinition(
        info = @Info(title = "iLoad Web Backend"),
        security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SwaggerConfig {

    @Value("${spring.security.cors.allowed-origins}")
    private String corsAllowedOrigins;

    @Bean
    public OpenAPI customOpenAPI() {
        Server publicServer = new Server()
                .url(corsAllowedOrigins.split(",")[0])
                .description("Public server");

        Server localServer = new Server()
                .url("http://localhost:8080")
                .description("Local server");
        return new OpenAPI().servers(List.of(publicServer, localServer));
    }
}
