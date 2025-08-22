package com.novaflowusermanagement.config;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Validates that the JWT contains the expected Google Workspace hosted domain (hd claim).
 * This ensures tokens are only accepted from users in the specified organization.
 */
public class GoogleHostedDomainValidator implements OAuth2TokenValidator<Jwt> {
    
    private final String expectedHostedDomain;
    
    public GoogleHostedDomainValidator(String expectedHostedDomain) {
        this.expectedHostedDomain = expectedHostedDomain;
    }
    
    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        String hostedDomain = jwt.getClaimAsString("hd");
        
        if (hostedDomain == null || !expectedHostedDomain.equals(hostedDomain)) {
            return OAuth2TokenValidatorResult.failure(
                new OAuth2Error("invalid_hosted_domain", 
                    "Token does not contain expected hosted domain: " + expectedHostedDomain, 
                    null)
            );
        }
        
        return OAuth2TokenValidatorResult.success();
    }
}
