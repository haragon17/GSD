package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.UserDao;
import com.gsd.model.User;

public class UserDaoImpl extends JdbcDaoSupport implements UserDao{

	@Override
	public User findByUserName(String username) {
		// TODO Auto-generated method stub
		
		String sql = "select * from users where usr_name = '"+username+"'";
		
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<User>(User.class));
	}
	
	public int countLastUpdateProject(){
		String sql = "select count(*) from projects where update_date BETWEEN current_date - interval '6' day and now()";
		int id = getJdbcTemplate().queryForInt(sql);
		return id;
	}

	@Override
	public void createUser(User user) {
		// TODO Auto-generated method stub
		String sql = "INSERT INTO users (usr_id,usr_name,password,fname,lname,email,phone,usr_type,cretd_date,update_date) "
				+ "VALUES (?,?,?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				user.getUsr_id(),
				user.getUsr_name(),
				user.getPassword(),
				user.getFname(),
				user.getLname(),
				user.getEmail(),
				user.getPhone(),
				user.getUsr_type()
		});
		
//		String sql = "INSERT INTO users (usr_id,usr_name,password,fname,lname,birthday,email,phone,usr_type,cretd_date,update_date) "
//				+ "VALUES ('"+user.getUsr_id()+"','"+user.getUsr_name()+"','"+user.getPassword()+"','"+user.getFname()+"','"+user.getLname()
//				+"','"+user.getBirthday()+"','"+user.getEmail()+"','"+user.getPhone()+"','"+user.getUsr_type()+"',now(),now())";
//		
//		System.out.println(sql);
//		
//		getJdbcTemplate().update(sql);
		
	}
	
	@Override
	public int getLastUserId() {

		String sql = "SELECT max(usr_id) from users";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

	@Override
	public List<User> searchMember(Map<String, String> data) {

		String sql = "select * from users where usr_id !=0\n";
		
		if(data.get("uname")==null || data.get("uname").isEmpty()){
		}else{
			sql += "AND usr_name LIKE '%"+data.get("uname")+"%'\n";
		}
		if(data.get("fname")==null || data.get("fname").isEmpty()){
		}else{
			sql += "AND fname LIKE '%"+data.get("fname")+"%'\n";
		}
		if(data.get("lname")==null || data.get("lname").isEmpty()){
		}else{
			sql += "AND lname LIKE '%"+data.get("lname")+"%'\n";
		}
		if(data.get("email")==null || data.get("email").isEmpty()){
		}else{
			sql += "AND email LIKE '%"+data.get("email")+"%'\n";
		}
		
		System.out.println(sql);
		
		List<User> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<User>(User.class));
		return result;
	}

	@Override
	public void updateMember(User user) {

		String sql = "update users set fname=?, "
				+ "lname=?, "
				+ "email=?, "
				+ "phone=?, "
				+ "usr_type=?, "
				+ "update_date=now() "
				+ "where usr_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				user.getFname(),
				user.getLname(),
				user.getEmail(),
				user.getPhone(),
				user.getUsr_type(),
				user.getUsr_id()
		});
		
	}
	
	@Override
	public void deleteUser(int id) {

		String sql = "delete from users where usr_id = "+id;
		
		getJdbcTemplate().update(sql);
		
	}

	@Override
	public List<User> forgotPassword(String username, String email) {

		String sql = "select * from users where usr_name = ? and email = ?";
		
		List<User> user = getJdbcTemplate().query(sql, new Object[] { username,email }, new BeanPropertyRowMapper<User>(User.class));
		return user;
	}

	@Override
	public void changePassword(int id, String pass) {

		String sql = "update users set password = ? where usr_id = ?";
		
		getJdbcTemplate().update(sql, new Object[] { pass, id });
	}

}
