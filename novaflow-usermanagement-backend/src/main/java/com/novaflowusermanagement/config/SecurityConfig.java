 package com.novaflowusermanagement.config;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuer;

    @Value("${google.oauth2.audience:}")
    private String audience;

    @Value("${google.oauth2.hosted-domain:}")
    private String hostedDomain;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints - zero trust: only these specific paths allowed without auth
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // Zero-trust on /metadata/** endpoints - require authentication
                .requestMatchers("/metadata/**").authenticated()
                // Authentication endpoints require authentication
                .requestMatchers("/api/me", "/api/authorize").authenticated()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().denyAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> {
                    jwt.decoder(jwtDecoder());
                    jwt.jwtAuthenticationConverter(jwtAuthenticationConverter());
                })
            );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = JwtDecoders.fromIssuerLocation(issuer);
        
        // Add validators for audience and hosted domain  
        OAuth2TokenValidator<Jwt> withIssuer = new JwtIssuerValidator(issuer);
        OAuth2TokenValidator<Jwt> withAudience = withIssuer;
        
        // Add hosted domain validator if configured
        if (hostedDomain != null && !hostedDomain.isEmpty()) {
            OAuth2TokenValidator<Jwt> hostedDomainValidator = new GoogleHostedDomainValidator(hostedDomain);
            withAudience = new DelegatingOAuth2TokenValidator<>(withAudience, hostedDomainValidator);
        }
        
        jwtDecoder.setJwtValidator(withAudience);
        return jwtDecoder;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        
        // DB-only RBAC: Do not extract groups from JWT
        // All authorization comes from PostgreSQL user_management schema
        converter.setJwtGrantedAuthoritiesConverter(jwt -> Collections.emptyList());
        
        return converter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
