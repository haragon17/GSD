package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.UserDao;
import com.gsd.model.User;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

public class UserDaoImpl extends JdbcDaoSupport implements UserDao{

	@Override
	public User findByUserName(String username) {
		// TODO Auto-generated method stub
		
		String sql = "select * from users where usr_name = '"+username+"'";
		
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<User>(User.class));
	}
	
	public User findByUserID(int usr_id){
		
		String sql = "select * from users where usr_id = "+usr_id;
		
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<User>(User.class));
				
	}
	
	public int countLastUpdateProject(){
//		String sql = "select count(*) from projects where update_date BETWEEN current_date - interval '6' day and now()";
		String sql = "select count(*) from projects_reference where update_date BETWEEN current_date - interval '6' day and now()";
		int id = getJdbcTemplate().queryForInt(sql);
		return id;
	}

	@Override
	public void createUser(User user) {
		// TODO Auto-generated method stub
		String sql = "INSERT INTO users (usr_id,usr_name,password,fname,lname,email,phone,usr_type,cretd_date,update_date,dept,usr_activate) "
				+ "VALUES (?,?,?,?,?,?,?,?,now(),now(),?,?)";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				user.getUsr_id(),
				user.getUsr_name(),
				user.getPassword(),
				user.getFname(),
				user.getLname(),
				user.getEmail(),
				user.getPhone(),
				user.getUsr_type(),
				user.getDept(),
				user.getUsr_activate()
		});
		
//		String sql = "INSERT INTO users (usr_id,usr_name,password,fname,lname,birthday,email,phone,usr_type,cretd_date,update_date) "
//				+ "VALUES ('"+user.getUsr_id()+"','"+user.getUsr_name()+"','"+user.getPassword()+"','"+user.getFname()+"','"+user.getLname()
//				+"','"+user.getBirthday()+"','"+user.getEmail()+"','"+user.getPhone()+"','"+user.getUsr_type()+"',now(),now())";
//		
//		System.out.println(sql);
//		
//		getJdbcTemplate().update(sql);
		String type = "Staff";
		if(user.getUsr_type() == 0){
			type = "Admin";
		}else if(user.getUsr_type() == 1){
			type = "Manager";
		}else if(user.getUsr_type() == 2){
			type = "JMD";
		}
		
		String activate = "Enable";
		if(user.getUsr_activate() == 0){
			activate = "Disable";
		}
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				
				user.getUsr_id(),
				"Users",
				UserLoginDetail.getUser().getUsername(),
				"Created usr_name="+user.getUsr_name()+", fname="+user.getFname()+", lname="+user.getLname()
				+", e-mail="+user.getEmail()+", phone="+user.getPhone()+", dept="+user.getDept()+", usr_type="+type+", usr_activate="+activate,
				user.getUsr_name()
		});
		
	}
	
	@Override
	public int getLastUserId() {

		String sql = "SELECT max(usr_id) from users";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

	@Override
	public List<User> searchMember(Map<String, String> data) {

		String sql = "select * from users where usr_id !="+data.get("id")+"\n";
		
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
		if(data.get("dept")==null || data.get("dept").isEmpty()){
		}else{
			sql += "AND dept LIKE '"+data.get("dept")+"%'\n";
		}
		if(data.get("usr_activate")==null || data.get("usr_activate").isEmpty()){
		}else{
			sql += "AND usr_activate = "+data.get("usr_activate")+"\n";
		}
		
		sql += "ORDER BY usr_name";
		
		List<User> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<User>(User.class));
		return result;
	}

	@Override
	public void updateMember(User user) {

		User user_audit = findByUserID(user.getUsr_id());
		
		String sql = "update users set fname=?, "
				+ "lname=?, "
				+ "email=?, "
				+ "phone=?, "
				+ "usr_type=?, "
				+ "dept=?, "
				+ "usr_activate=?, "
				+ "update_date=now() "
				+ "where usr_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				user.getFname(),
				user.getLname(),
				user.getEmail(),
				user.getPhone(),
				user.getUsr_type(),
				user.getDept(),
				user.getUsr_activate(),
				user.getUsr_id()
		});
		
		if(user_audit.getUsr_activate() != user.getUsr_activate()){
			
			String activate = "Enable";
			if(user.getUsr_activate() == 0){
				activate = "Disable";
			}
			
			String audit_activate = "Enable";
			if(user_audit.getUsr_activate() == 0){
				audit_activate = "Disable";
			}
			
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					user.getUsr_id(),
					"Users",
					UserLoginDetail.getUser().getUsername(),
					"User Activate",
					audit_activate,
					activate,
					"Updated",
					user_audit.getUsr_name()
			});
		}
		
		if(!user_audit.getDept().equals(user.getDept())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					user.getUsr_id(),
					"Users",
					UserLoginDetail.getUser().getUsername(),
					"Department",
					user_audit.getDept(),
					user.getDept(),
					"Updated",
					user_audit.getUsr_name()
			});
		}
		
		if(user_audit.getUsr_type() != user.getUsr_type()){
			
			String type = "Staff";
			if(user.getUsr_type() == 0){
				type = "Admin";
			}else if(user.getUsr_type() == 1){
				type = "Manager";
			}else if(user.getUsr_type() == 2){
				type = "JMD";
			}
			
			String audit_type = "Staff";
			if(user_audit.getUsr_type() == 0){
				audit_type = "Admin";
			}else if(user_audit.getUsr_type() == 1){
				audit_type = "Manager";
			}else if(user_audit.getUsr_type() == 2){
				audit_type = "JMD";
			}
			
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					user.getUsr_id(),
					"Users",
					UserLoginDetail.getUser().getUsername(),
					"User Type",
					audit_type,
					type,
					"Updated",
					user_audit.getUsr_name()
			});
		}
		
		if(!user_audit.getPhone().equals(user.getPhone())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					user.getUsr_id(),
					"Users",
					UserLoginDetail.getUser().getUsername(),
					"E-mail",
					user_audit.getPhone(),
					user.getPhone(),
					"Updated",
					user_audit.getUsr_name()
			});
		}
		
		if(!user_audit.getEmail().equals(user.getEmail())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					user.getUsr_id(),
					"Users",
					UserLoginDetail.getUser().getUsername(),
					"E-mail",
					user_audit.getEmail(),
					user.getEmail(),
					"Updated",
					user_audit.getUsr_name()
			});
		}
		
		if(!user_audit.getLname().equals(user.getLname())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					user.getUsr_id(),
					"Users",
					UserLoginDetail.getUser().getUsername(),
					"Last Name",
					user_audit.getLname(),
					user.getLname(),
					"Updated",
					user_audit.getUsr_name()
			});
		}
		
		if(!user_audit.getFname().equals(user.getFname())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					user.getUsr_id(),
					"Users",
					UserLoginDetail.getUser().getUsername(),
					"First Name",
					user_audit.getFname(),
					user.getFname(),
					"Updated",
					user_audit.getUsr_name()
			});
		}
		
	}
	
	@Override
	public void deleteUser(int id) {

		User audit_user = findByUserID(id);
		
		String sql = "delete from users where usr_id = "+id;
		
		getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				id,
				"Users",
				user.getUserModel().getUsr_name(),
				"Deleted user name '"+audit_user.getUsr_name()+"' from JView",
				audit_user.getUsr_name()
		});
		
	}

	@Override
	public List<User> forgotPassword(String username, String email) {

		String sql = "select * from users where usr_name = ? and email = ?";
		
		List<User> user = getJdbcTemplate().query(sql, new Object[] { username,email }, new BeanPropertyRowMapper<User>(User.class));
		return user;
	}

	@Override
	public void changePassword(int id, String pass) {

		String sql = "update users set password = ?, update_date = now() where usr_id = ?";
		
		getJdbcTemplate().update(sql, new Object[] { pass, id });
	}

	@Override
	public List<User> showUser(String dept) {
		
		String sql = "SELECT usr_id,usr_name FROM users WHERE (usr_type = 2 OR usr_type = 3) AND dept LIKE '"+dept+"%' AND usr_name NOT LIKE 'jmd%' AND usr_activate = 1 ORDER BY usr_name";
		
		List<User> user = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<User>(User.class));
		return user;
	}

}
