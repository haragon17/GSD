package com.gsd.dao.impl;

import java.util.List;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.AuditLoggingDao;
import com.gsd.model.AuditLogging;

public class AuditLoggingDaoImpl extends JdbcDaoSupport implements AuditLoggingDao{

	@Override
	public List<AuditLogging> showAuditLogging(String dept) {
		
//		String sql = "SELECT aud.aud_id,aud.parent_id,aud.commit_by,aud.parent_object,parent_ref, aud.field_name, aud.old_value, aud.new_value,\n"+
//				"CASE\n"+
//				"WHEN aud.commit_desc LIKE 'C%' THEN 'Created'\n"+
//				"WHEN aud.commit_desc LIKE 'U%' THEN 'Updated'\n"+
//				"WHEN aud.commit_desc LIKE 'D%' THEN 'Deleted'\n"+
//				"WHEN aud.commit_desc LIKE 'E%' THEN 'Error'\n"+
//				"ELSE 'Got some error...'\n"+
//				"END AS commit_type, aud.commit_desc, aud.commit_date,\n"+
//				"CASE\n"+
//				"WHEN aud.parent_object LIKE '%Projects Reference%' THEN 'Projects Item'\n"+
//				"WHEN aud.parent_object LIKE '%Jobs Reference%' THEN 'Jobs Item'\n"+
//				"ELSE aud.parent_object\n"+
//				"END AS parent_type,\n"+
//				"CASE\n"+
//				"WHEN aud.parent_object LIKE '%Jobs Reference%' THEN jobs2.dept\n"+
//				"WHEN aud.parent_object = 'Jobs' THEN jobs.dept\n"+
//				"ELSE NULL\n"+
//				"END AS job_dept\n"+
//				"FROM audit_logging aud\n"+
//				"LEFT JOIN customer cus ON cus.cus_id = aud.parent_id\n"+
//				"LEFT JOIN projects proj ON proj.proj_id = aud.parent_id\n"+
//				"LEFT JOIN projects proj2 ON proj2.proj_id = substring(aud.parent_object , ':*([0-9]{1,9})')::int\n"+
//				"LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = aud.parent_id\n"+
//				"LEFT JOIN jobs ON jobs.job_id = aud.parent_id\n"+
//				"LEFT JOIN jobs jobs2 ON jobs2.job_id = substring(aud.parent_object , ':*([0-9]{1,9})')::int AND aud.parent_object LIKE '%Jobs Reference%'\n"+
//				"LEFT JOIN jobs_reference job_ref on job_ref.job_ref_id = aud.parent_id\n"+
//				"LEFT JOIN item itm_ref ON itm_ref.itm_id = proj_ref.itm_id\n"+
//				"LEFT JOIN item itm ON itm.itm_id = aud.parent_id\n"+
//				"LEFT JOIN key_account_mng keyAccMng ON keyAccMng.key_acc_id = aud.parent_id\n"+
//				"WHERE aud_id <> 0\n";
		
		String sql = "SELECT aud.aud_id,aud.parent_id,aud.commit_by,aud.parent_object,parent_ref, aud.field_name, aud.old_value, aud.new_value,\n" +
				"CASE\n" +
				"WHEN aud.commit_desc LIKE 'C%' THEN 'Created'\n" +
				"WHEN aud.commit_desc LIKE 'U%' THEN 'Updated'\n" +
				"WHEN aud.commit_desc LIKE 'D%' THEN 'Deleted'\n" +
				"WHEN aud.commit_desc LIKE 'E%' THEN 'Error'\n" +
				"ELSE 'Got some error...'\n" +
				"END AS commit_type, aud.commit_desc, aud.commit_date,\n" +
				"CASE\n" +
				"WHEN aud.parent_object LIKE '%Projects Reference%' THEN 'Projects Item'\n" +
				"WHEN aud.parent_object LIKE '%Jobs Reference%' THEN 'Jobs Item'\n" +
				"WHEN aud.parent_object LIKE '%Invoice Reference%' THEN 'Invoice Item'\n" +
				"ELSE aud.parent_object\n" +
				"END AS parent_type\n" +
				"FROM audit_logging aud\n";
				
		if(dept == "" || dept == null){
		}else if(dept.equals("E-Studio")){
			sql +=  "LEFT JOIN jobs ON jobs.job_id = aud.parent_id\n" +
					"LEFT JOIN jobs jobs2 ON jobs2.job_id = substring(aud.parent_object , ':*([0-9]{1,9})')::int AND aud.parent_object LIKE '%Jobs Reference%'\n" +
					"WHERE aud_id <> 0\n"+
					"AND ((CASE\n"+
					"WHEN aud.parent_object LIKE '%Jobs Reference%' THEN jobs2.dept\n"+
					"WHEN aud.parent_object = 'Jobs' THEN jobs.dept END) LIKE '"+dept+"%'\n"+
					"OR (CASE\n"+
					"WHEN aud.parent_object LIKE '%Jobs Reference%' THEN jobs2.dept\n"+
					"WHEN aud.parent_object = 'Jobs' THEN jobs.dept END) LIKE 'Pilot%')\n";
		}else{
			sql +=  "LEFT JOIN jobs ON jobs.job_id = aud.parent_id\n" +
					"LEFT JOIN jobs jobs2 ON jobs2.job_id = substring(aud.parent_object , ':*([0-9]{1,9})')::int AND aud.parent_object LIKE '%Jobs Reference%'\n" +
					"WHERE aud_id <> 0\n"+
					"AND (CASE\n"+
					"WHEN aud.parent_object LIKE '%Jobs Reference%' THEN jobs2.dept\n"+
					"WHEN aud.parent_object = 'Jobs' THEN jobs.dept END) LIKE '"+dept+"%'\n";
		}
				
		sql += "ORDER BY 1 DESC";
		
//		System.out.println(sql);
		
		List<AuditLogging> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<AuditLogging>(AuditLogging.class));
		return result;
	}

}
