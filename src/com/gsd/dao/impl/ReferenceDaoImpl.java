package com.gsd.dao.impl;

import java.util.List;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.ReferenceDao;
import com.gsd.model.Reference;

public class ReferenceDaoImpl extends JdbcDaoSupport implements ReferenceDao {

	@Override
	public List<Reference> showDBReference(String kind, String dept) {
		
		String sql = "SELECT db_ref_name from db_reference WHERE db_ref_kind = '"+kind+"' AND db_ref_dept = '"+dept+"' ORDER BY order_by ASC";
		
		List<Reference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Reference>(Reference.class));
		return result;
		
	}
	
	@Override
	public List<Reference> showDepartmentReference() {
		
		String sql = "SELECT db_ref_name from db_reference WHERE db_ref_kind = 'Department' ORDER BY order_by ASC";

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
