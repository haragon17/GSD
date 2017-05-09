package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.User;

public interface UserDao {

	public User findByUserName(String username);
	
	public User findByUserID(int usr_id);
	
	public void createUser(User user);

	public int getLastUserId();
	
	public List<User> searchMember(Map<String, String> data); 
	
	public void updateMember(User user);
	
	public void deleteUser(int id);
	
	public List<User> forgotPassword(String username, String email);
	
	public void changePassword(int id, String pass);
	
	public int countLastUpdateProject();
	
	public List<User> showUser(int type);
}
