package com.novaflow.metadata.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("NovaFlow Metadata Management API")
                        .version("1.0.0")
                        .description("REST API for managing NovaFlow metadata including connections, integration objects, rules, and configurations")
                        .contact(new Contact()
                                .name("NovaFlow Team")
                                .email("support@novaflow.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8081").description("Development Server"),
                        new Server().url("https://api.novaflow.com").description("Production Server")
                ));
    }
}
