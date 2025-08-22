package com.novaflowusermanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("NovaFlow User Management API")
                        .description("Comprehensive API for managing users, domains, roles, and permissions in NovaFlow system")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("NovaFlow Team")
                                .email("support@novaflow.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
