package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.TimeRecordDao;
import com.gsd.model.TimeRecord;
import com.gsd.model.TimeRecordReference;

public class TimeRecordDaoImpl extends JdbcDaoSupport implements TimeRecordDao {

	@Override
	public List<TimeRecord> searchTimeRecord(Map<String, String> data) {
		String sql = "SELECT tr_id, tr_name, usr_name, tr.job_ref_id, cus_name, proj_name, job_name, job_ref_name, tr_name, tr_process, tr_start, tr_finish, (tr_finish - tr_start) AS sum_time, job_ref_number\n"+
					"FROM time_record tr \n"+
					"LEFT JOIN jobs_reference job_ref ON job_ref.job_ref_id = tr.job_ref_id\n"+
					"LEFT JOIN jobs ON jobs.job_id = job_ref.job_id\n"+
					"LEFT JOIN projects proj ON proj.proj_id = jobs.proj_id\n"+
					"LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n"+
					"LEFT JOIN users ON users.usr_id = tr.usr_id\n"+
					"WHERE tr_id != 0\n";
					
		if(data.get("tr_name")==null || data.get("tr_name").isEmpty()){
		}else{
			sql += "AND LOWER(tr_name) LIKE LOWER('%"+data.get("tr_name")+"%')\n";
		}
		if(data.get("job_ref_id")==null || data.get("job_ref_id").isEmpty()){
		}else{
			sql += "AND tr.job_ref_id = "+data.get("job_ref_id")+"\n";
		}
		if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
		}else{
			sql += "AND jobs.proj_id = "+data.get("proj_id")+"\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND proj.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("usr_id")==null || data.get("usr_id").isEmpty()){
		}else{
			sql += "AND tr.usr_id = "+data.get("usr_id")+"\n";
		}
		if(data.get("job_status")==null || data.get("job_status").isEmpty()){
		}else{
			sql += "AND jobs.job_status = '"+data.get("job_status")+"'\n";
		}
		if(data.get("dept")==null || data.get("dept").isEmpty()){
		}else{
			sql += "AND users.dept LIKE '"+data.get("dept")+"%'\n";
		}
		if(data.get("process")==null || data.get("process").isEmpty()){
		}else{
			sql += "AND tr_process LIKE '"+data.get("process")+"%'\n";
		}
		if(data.get("record_start")==null || data.get("record_start").isEmpty()){
			if(data.get("record_finish")==null || data.get("record_finish").isEmpty()){
			}else{
				sql += "AND tr_start <= '"+data.get("record_finish")+" 23:59:59'\n";
			}
		}else if(data.get("record_finish")==null || data.get("record_finish").isEmpty()){
			sql += "AND tr_start >= '"+data.get("record_start")+"'\n";
		}else{
			sql += "AND tr_start BETWEEN '"+data.get("record_start")+"' AND '"+data.get("record_finish")+" 23:59:59'\n";
		}
		
		if(data.get("searchType") == "report"){
			sql += "ORDER BY job_ref_name ASC, tr_name ASC, tr_id ASC";
		}else{
			sql += "ORDER BY tr_id DESC";
		}
		
//		System.out.println(sql);
		
		List<TimeRecord> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<TimeRecord>(TimeRecord.class));
		return result;
	}

	@Override
	public List<TimeRecordReference> showTimeRecordReference(String tr_ref_kind, String tr_ref_dept) {
		
		String sql = "";
		
		if(tr_ref_kind.equals("Process")){
			if(tr_ref_dept.equals("0")){
				sql = "SELECT DISTINCT tr_ref_name FROM tr_reference WHERE tr_ref_kind = '"+tr_ref_kind+"' ";
			}else{
				sql = "SELECT tr_ref_name FROM tr_reference "
					+ "WHERE tr_ref_kind = '"+tr_ref_kind+"' AND tr_ref_dept = '"+tr_ref_dept+"' ";
			}
		}
		sql += "ORDER BY tr_ref_name ASC";
		
		List<TimeRecordReference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<TimeRecordReference>(TimeRecordReference.class));
		return result;
	}

}
