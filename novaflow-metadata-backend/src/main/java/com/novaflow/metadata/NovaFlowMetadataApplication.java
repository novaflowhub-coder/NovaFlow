package com.novaflow.metadata;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "NovaFlow Metadata API",
        version = "1.0",
        description = "API for managing NovaFlow metadata"
    )
)
public class NovaFlowMetadataApplication {
    public static void main(String[] args) {
        SpringApplication.run(NovaFlowMetadataApplication.class, args);
    }
}
