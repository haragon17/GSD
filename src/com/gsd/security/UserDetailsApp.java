package com.gsd.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.gsd.model.User;


public class UserDetailsApp implements UserDetails {

//    public static final GrantedAuthority ADMIN_ROLE = new SimpleGrantedAuthority("ADMIN");
//    public static final GrantedAuthority SUPERUSER_ROLE = new SimpleGrantedAuthority("SUPERUSER");
//    public static final GrantedAuthority PUBLIC_ROLE = new SimpleGrantedAuthority("PUBLIC");
    public static final GrantedAuthority USER_ROLE = new SimpleGrantedAuthority("USER");
    private User user;
    private Set<GrantedAuthority> grants;
    
    public UserDetailsApp(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (grants == null) {
            grants = new HashSet<GrantedAuthority>();
            grants.add(USER_ROLE);
        }
        return grants;
    }

    public User getUserModel(){
    	return user;
    }
    
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsr_name();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
