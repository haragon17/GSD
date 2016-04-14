package com.gsd.security;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserLoginDetail {
    
    public static UserDetailsApp getUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        UserDetailsApp details = (UserDetailsApp) securityContext.getAuthentication().getPrincipal();
        return details;
    }
}

