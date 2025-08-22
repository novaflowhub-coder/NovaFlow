package com.novaflow.metadata;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "NovaFlow Metadata Management API",
        version = "1.0.0",
        description = "REST API for managing NovaFlow metadata including connections, objects, rules, and configurations"
    )
)
public class NovaFlowMetadataApplication {
    public static void main(String[] args) {
        SpringApplication.run(NovaFlowMetadataApplication.class, args);
    }
}
