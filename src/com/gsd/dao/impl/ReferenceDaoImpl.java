package com.gsd.dao.impl;

import java.util.List;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.ReferenceDao;
import com.gsd.model.Reference;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

public class ReferenceDaoImpl extends JdbcDaoSupport implements ReferenceDao {

	@Override
	public List<Reference> showDBReference(String kind, String dept) {
		
		String sql = "SELECT db_ref_name from db_reference WHERE db_ref_kind = '"+kind+"' AND db_ref_dept = '"+dept+"' ORDER BY order_by ASC";
		
		List<Reference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Reference>(Reference.class));
		return result;
		
	}
	
	@Override
	public List<Reference> showDepartmentReference(int level) {
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String dept = user.getUserModel().getDept();
		
		String sql = "SELECT db_ref_name from db_reference WHERE db_ref_kind = 'Department'";
				
		if(level == 2){
			if(dept.equals("E-Studio")){
				sql += " AND (db_ref_name LIKE '"+dept+"%' OR db_ref_name = 'Pilot')";
			}else{
				sql += " AND db_ref_name LIKE '"+dept+"%'";
			}
		}
		
		sql += " ORDER BY order_by ASC";
		
		List<Reference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Reference>(Reference.class));
		return result;
	}

	@Override
	public List<Reference> showJobStatus() {
		
		String sql = "SELECT db_ref_name from db_reference WHERE db_ref_kind = 'JobStatus' ORDER BY order_by ASC";
		
		List<Reference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Reference>(Reference.class));
		return result;
	}
	
	@Override
	public List<Reference> showJobReference(String kind, String dept) {
		
		String sql = "SELECT db_ref_name from db_reference WHERE db_ref_kind = '"+kind+"' AND db_ref_dept = '"+dept+"' ORDER BY order_by ASC";
		
		List<Reference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Reference>(Reference.class));
		return result;
	}

}
