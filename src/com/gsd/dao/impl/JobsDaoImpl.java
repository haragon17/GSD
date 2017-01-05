package com.gsd.dao.impl;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.JobsDao;
import com.gsd.model.Jobs;
import com.gsd.model.JobsReference;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class JobsDaoImpl extends JdbcDaoSupport implements JobsDao {

	@Override
	public List<Jobs> searchJobs(Map<String, String> data) {
		String sql = "SELECT jobs.job_id, job_name, jobs.proj_id, proj_name, cus_name, cus_code, cus.cus_id, job_dtl, job_status, dept,\n"
				+ "CASE WHEN y.remain_job IS NULL THEN 0 ELSE y.remain_job END,\n"
				+ "CASE WHEN x.total_amount IS NULL THEN 0 ELSE x.total_amount END\n"
				+ "FROM jobs\n"
				+ "LEFT JOIN projects proj ON proj.proj_id = jobs.proj_id\n"
				+ "LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n"
				+ "LEFT JOIN (select job_id, sum(amount) as total_amount from jobs_reference group by job_id) x on x.job_id = jobs.job_id\n"
				+ "LEFT JOIN (select job_id, count(*) as remain_job from jobs_reference where job_ref_status != 'Sent' group by job_id) y on y.job_id = jobs.job_id\n"
				+ "WHERE jobs.job_id != 0\n";
		if(data.get("first")==null || data.get("first").isEmpty()){
		}else{
			sql += "AND job_status != 'Billed'\n";
		}
		if(data.get("job_name")==null || data.get("job_name").isEmpty()){
		}else{
			sql += "AND LOWER(job_name) LIKE LOWER('%"+data.get("job_name")+"%')\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND cus.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
		}else{
			sql += "AND jobs.proj_id = "+data.get("proj_id")+"\n";
		}
		if(data.get("dept")==null || data.get("dept").isEmpty()){
		}else{
			sql += "AND dept = '"+data.get("dept")+"'\n";
		}
		if(data.get("status")==null || data.get("status").isEmpty()){
		}else{
			sql += "AND job_status = '"+data.get("status")+"'\n";
		}
		sql += "ORDER BY\n"+
				"CASE job_status\n"+
				"WHEN 'Processing' 	THEN 1\n"+
				"WHEN 'Sent' 		THEN 2\n"+
				"WHEN 'Checked'		THEN 3\n"+
				"WHEN 'Hold' 		THEN 4\n"+
				"WHEN 'Billed' 		THEN 5\n"+
				"ELSE 6\n"+
				"END,"+
				"jobs.cretd_date DESC";	
		
//		System.out.println(sql);
		
		List<Jobs> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
		return result;
	}
	
	@Override
	public Jobs searchJobsByID(int id){
		
		String sql = "SELECT job_id, job_name, jobs.proj_id, proj_name, cus_name, cus_code, cus.cus_id, job_dtl, job_status, dept\n"
				+ "FROM jobs\n"
				+ "LEFT JOIN projects proj ON proj.proj_id = jobs.proj_id\n"
				+ "LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n"
				+ "WHERE job_id = "+id;
		
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
	}
	
	public List<JobsReference> getItemNameFromJobID(int id){
		
		String sql = "SELECT DISTINCT item.itm_name, jobs_reference.proj_ref_id FROM jobs_reference \n"+
				"LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = jobs_reference.proj_ref_id\n"+
				"LEFT JOIN item ON item.itm_id = proj_ref.itm_id\n"+
				"WHERE job_id = "+id+"\n"+
				"ORDER BY 1";
		
		List<JobsReference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<JobsReference>(JobsReference.class));
		return result;
	}
	
	public List<Jobs> searchTodayJobs(Map<String, String> data){
		String sql = "SELECT DISTINCT jobs.job_id, job_name, jobs.proj_id, proj_name, cus_name, cus_code, cus.cus_id, job_dtl, job_status, dept, job_ref_status, job_ref.job_out\tFROM jobs\n"+
				"LEFT JOIN projects proj ON proj.proj_id = jobs.proj_id\n"+
				"LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n"+
				"LEFT JOIN jobs_reference job_ref ON job_ref.job_id = jobs.job_id\n"+
				"WHERE date (job_out) = current_date\n"+
				"AND job_ref_status <> 'Sent'\n";
				
		if(data.get("job_name")==null || data.get("job_name").isEmpty()){
		}else{
			sql += "AND LOWER(job_name) LIKE LOWER('%"+data.get("job_name")+"%')\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND cus.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
		}else{
			sql += "AND jobs.proj_id = "+data.get("proj_id")+"\n";
		}
		if(data.get("dept")==null || data.get("dept").isEmpty()){
		}else{
			sql += "AND dept = '"+data.get("dept")+"'\n";
		}
		if(data.get("status")==null || data.get("status").isEmpty()){
		}else{
			sql += "AND job_status = '"+data.get("status")+"'\n";
		}
		
		sql += "ORDER BY job_ref.job_out ASC";
		
		List<Jobs> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
		return result;
	}
	
	public List<JobsReference> searchTodayJobsReference(Map<String, String> data){
		
		String sql = "SELECT job_ref_id, job_ref_name, jobs.job_id, jobs_reference.proj_ref_id, amount, job_in, job_out, job_ref_dtl, job_ref_status, itm_name, job_name, proj_name, cus_name, dept, jobs.proj_id\n"+
				"FROM jobs_reference\n"+
				"LEFT JOIN projects_reference proj_ref on proj_ref.proj_ref_id = jobs_reference.proj_ref_id\n"+
				"LEFT JOIN item itm on itm.itm_id = proj_ref.itm_id\n"+
				"LEFT JOIN jobs on jobs.job_id = jobs_reference.job_id\n"+
				"LEFT JOIN projects proj on proj.proj_id = jobs.proj_id\n"+
				"LEFT JOIN customer cus on cus.cus_id = proj.cus_id\n"+
				"WHERE job_ref_status <> 'Sent'\n";
//				"AND date (job_out) <= (CASE\n"+
//				"WHEN extract(dow from current_date) = 6 THEN (current_date+2)\n"+
//				"WHEN extract(dow from current_date) = 7 THEN (current_date+1)\n"+
//				"ELSE current_date END)\n";
				
		if(data.get("job_name")==null || data.get("job_name").isEmpty()){
		}else{
			sql += "AND LOWER(job_name) LIKE LOWER('%"+data.get("job_name")+"%')\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND cus.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
		}else{
			sql += "AND jobs.proj_id = "+data.get("proj_id")+"\n";
		}
		if(data.get("dept")==null || data.get("dept").isEmpty()){
		}else{
			sql += "AND dept = '"+data.get("dept")+"'\n";
		}
		if(data.get("status")==null || data.get("status").isEmpty()){
		}else{
			sql += "AND job_status = '"+data.get("status")+"'\n";
		}
		
		sql += 	"ORDER BY\n"+
//				"CASE job_ref_status\n"+
//				"WHEN 'New' 	THEN 1\n"+
//				"WHEN 'CC' 		THEN 2\n"+
//				"WHEN 'CC2' 	THEN 3\n"+
//				"WHEN 'CC3' 	THEN 4\n"+
//				"WHEN 'CC+Final' THEN 5\n"+
//				"WHEN 'Final' 	THEN 6\n"+
//				"WHEN 'Hold' 	THEN 7\n"+
//				"WHEN 'Sent' 	THEN 8\n"+
//				"ELSE 9\n"+
				"CASE\n"+
				"WHEN job_ref_status LIKE 'New%'	THEN 1\n"+
				"WHEN job_ref_status = 'Hold'		THEN 3\n"+
				"ELSE 2\n"+
				"END,"+
				"jobs_reference.job_out ASC";
		
		List<JobsReference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<JobsReference>(JobsReference.class));
		return result;
	}
	
	@Override
	public JobsReference searchJobsReferenceByID(int id) {
		String sql = "SELECT job_ref_id, jobs.job_id, job_ref_name, cus_name, cus_code, proj_name, itm_name, job_name, amount, job_in, job_out, job_ref_dtl, job_ref_status, dept, jobs_reference.proj_ref_id\n"+
				"FROM jobs_reference\n"+
				"LEFT JOIN jobs ON jobs.job_id = jobs_reference.job_id\n"+
				"LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = jobs_reference.proj_ref_id\n"+
				"LEFT JOIN projects proj ON proj.proj_id = jobs.proj_id\n"+
				"LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n"+
				"LEFT JOIN item ON item.itm_id = proj_ref.itm_id\n"+
				"WHERE job_ref_id="+id;
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<JobsReference>(JobsReference.class));
	}
	
	@Override
	public List<JobsReference> searchJobsReference(int id, String sort) {
		
		String sql = "SELECT job_ref_id, job_ref_name, job_id, jobs_reference.proj_ref_id, amount, job_in, job_out, job_ref_dtl, job_ref_status, itm_name\n"
				+ "FROM jobs_reference\n"
				+ "LEFT JOIN projects_reference proj_ref on proj_ref.proj_ref_id = jobs_reference.proj_ref_id\n"
				+ "LEFT JOIN item itm on itm.itm_id = proj_ref.itm_id\n"
				+ "WHERE job_id="+id;
		
		if(sort == "DESC"){
			sql+= "\nORDER BY \n"
				+ "CASE job_ref_status\n"
				+ "WHEN 'New' 	THEN 1\n"
				+ "WHEN 'CC'  	THEN 2\n"
				+ "WHEN 'CC2'  	THEN 3\n"
				+ "WHEN 'CC3'  	THEN 4\n"
				+ "WHEN 'CC+Final' THEN 5\n"
				+ "WHEN 'Final' 	THEN 6\n"
				+ "WHEN 'Hold' 	THEN 7\n"
				+ "WHEN 'Sent' 	THEN 8\n"
				+ "ELSE 9\n"
				+ "END,jobs_reference.job_in DESC ,job_ref_id DESC";
		}else{
			sql+= " ORDER BY jobs_reference.job_in ASC ,job_ref_id ASC";
		}
		
		List<JobsReference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<JobsReference>(JobsReference.class));
		return result;
	}
	
	@Override
	public List<Jobs> searchJobsReference_old(Map<String, String> data) {
		
		String sql = "SELECT job_id, job_name, job_status, cus_name, cus_code, proj_name, itm_name, amount, job_dtl, job_in, job_out, dept, jobs.cus_id, jobs.proj_ref_id,\n"+
				"CASE\n"+
				"WHEN jobs.proj_ref_id = 0 THEN 0\n"+
				"ELSE item.itm_id\n"+
				"END AS itm_id, \n"+
				"CASE\n"+
				"WHEN jobs.proj_ref_id = 0 THEN 0\n"+
				"ELSE proj.proj_id\n"+
				"END AS proj_id\n"+
				"FROM jobs\n"+
				"LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = jobs.proj_ref_id\n"+
				"LEFT JOIN projects proj ON proj.proj_id = proj_ref.proj_id\n"+
				"LEFT JOIN customer cus ON cus.cus_id = jobs.cus_id\n"+
				"LEFT JOIN item ON item.itm_id = proj_ref.itm_id\n"+
				"WHERE job_id != 0\n";
		
		if(data.get("job_name")==null || data.get("job_name").isEmpty()){
		}else{
			sql += "AND LOWER(job_name) LIKE LOWER('%"+data.get("job_name")+"%')\n";
		}
		if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
		}else{
			sql += "AND item.itm_id = "+data.get("itm_id")+"\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND cus.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
		}else{
			sql += "AND proj.proj_id = "+data.get("proj_id")+"\n";
		}
		if(data.get("dept")==null || data.get("dept").isEmpty()){
		}else{
			sql += "AND dept = '"+data.get("dept")+"'\n";
		}
		if(data.get("start")==null || data.get("start").isEmpty()){
			if(data.get("end")==null || data.get("end").isEmpty()){
			}else{
				sql += "AND job_in <= '"+data.get("end")+" 23:59:59'\n";
			}
		}else if(data.get("end")==null || data.get("end").isEmpty()){
			sql += "AND job_in >= '"+data.get("start")+"'\n";
		}else{
			sql += "AND job_in BETWEEN '"+data.get("start")+"' AND '"+data.get("end")+" 23:59:59'\n ";
		}
/*		if(data.get("start")==null || data.get("start").isEmpty()){
			if(data.get("end")==null || data.get("end").isEmpty()){
			}else{
				sql += "AND (job_in <= '"+data.get("end")+" 23:59:59' OR job_out <= '"+data.get("end")+" 23:59:59')\n";
			}
		}else if(data.get("end")==null || data.get("end").isEmpty()){
			sql += "AND (job_in >= '"+data.get("start")+"' OR job_out >= '"+data.get("start")+"')\n";
		}else{
//			sql += "AND (job_in BETWEEN '"+data.get("start")+"' AND '"+data.get("end")+" 23:59:59' "
//					+ "OR job_out BETWEEN '"+data.get("start")+"' AND '"+data.get("end")+" 23:59:59')\n";
			sql += "AND ('"+data.get("start")+"' BETWEEN job_in AND job_out "
					+ "OR '"+data.get("end")+" 23:59:59' BETWEEN job_in AND job_out)\n";
		}*/
		
		sql += "ORDER BY "+data.get("sort");
		
		System.out.println(sql);
		
		List<Jobs> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
		return result;
	}
	
	public JobsReference searchJobReferenceByName(String name){
		
		String sql = "SELECT * FROM jobs_reference WHERE job_ref_name='"+name+"' ORDER BY cretd_date DESC";
		
		JobsReference result = getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<JobsReference>(JobsReference.class));
		return result;
	}
	
	@Override
	public void createJob(Jobs job) {
		
		String sql = "INSERT INTO jobs VALUES (?,?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] {
			job.getJob_id(),
			job.getJob_name(),
			job.getProj_id(),
			job.getJob_dtl(),
			job.getJob_status(),
			job.getDept(),
			job.getCretd_usr()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		Jobs job2 = searchJobsByID(job.getJob_id());
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (?,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				job.getJob_id(),
				"Jobs",
				user.getUserModel().getUsr_name(),
				"Created Jobs name="+job.getJob_name()+" on Projects name="+job2.getProj_name()+", customer="+job2.getCus_name()
				+", job_dtl="+job.getJob_dtl()+", job_status="+job.getJob_status()+", dept="+job.getDept(),
				job.getJob_name()
		});
	}

	@Override
	public void createJobReference(JobsReference jobRef) {
		
		String sql = "INSERT INTO jobs_reference VALUES (?,?,?,?,?,?,?,?,?,now(),now(),?)";
		
		this.getJdbcTemplate().update(sql, new Object[] {
				jobRef.getJob_ref_id(),
				jobRef.getJob_id(),
				jobRef.getJob_ref_name(),
				jobRef.getProj_ref_id(),
				jobRef.getAmount(),
				jobRef.getJob_in_ts(),
				jobRef.getJob_out_ts(),
				jobRef.getJob_ref_dtl(),
				jobRef.getCretd_usr(),
				jobRef.getJob_ref_status()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		JobsReference jobRef2 = searchJobsReferenceByID(jobRef.getJob_ref_id());
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (?,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				jobRef.getJob_ref_id(),
				"Jobs Reference:"+jobRef.getJob_id(),
				user.getUserModel().getUsr_name(),
				"Created Jobs Reference name="+jobRef.getJob_ref_name()+" on Jobs name="+jobRef2.getJob_name()+", Item name="+jobRef2.getItm_name()
				+", amount="+jobRef.getAmount()+", job_in="+jobRef2.getJob_in()+", job_out="+jobRef2.getJob_out()+", job_status="+jobRef2.getJob_ref_status()
				+", job_ref_dtl="+jobRef.getJob_ref_dtl(),
				jobRef2.getJob_name()+" : "+jobRef.getJob_ref_name()
		});
	}
	
	@Override
	public int getLastJobId() {
		
		String sql = "SELECT max(job_id) from jobs";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}
	
	@Override
	public int getLastJobReferenceId() {
		
		String sql = "SELECT max(job_ref_id) from jobs_reference";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}
	
	public int getLastAuditId() {
		
		String sql = "SELECT max(aud_id) from audit_logging";
		
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

	@Override
	public void billedJobProjects(int id) {
		
		Jobs job_audit = searchJobsByID(id);
		
		String sql = "UPDATE jobs set job_status = 'Billed' where job_id = "+id;
		this.getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		if(job_audit.getJob_status() != "Billed"){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				job_audit.getJob_id(),
				"Jobs",
				user.getUserModel().getUsr_name(),
				"Jobs Status",
				job_audit.getJob_status(),
				"Billed",
				"Updated",
				job_audit.getJob_name()
			});
		}
	}
	
	@Override
	public void updateJob(Jobs job){
		
		Jobs job_audit = searchJobsByID(job.getJob_id());
		
		String sql = "UPDATE jobs set "
				+ "job_name=?, "
				+ "proj_id=?, "
				+ "job_dtl=?, "
				+ "job_status=?, "
				+ "dept=?, "
				+ "update_date=now() "
				+ "where job_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] {
			job.getJob_name(),
			job.getProj_id(),
			job.getJob_dtl(),
			job.getJob_status(),
			job.getDept(),
			job.getJob_id()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		if(!job_audit.getDept().equals(job.getDept())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				job.getJob_id(),
				"Jobs",
				user.getUserModel().getUsr_name(),
				"Jobs Department",
				job_audit.getDept(),
				job.getDept(),
				"Updated",
				job.getJob_name()
			});
		}
		
		if(!job_audit.getJob_status().equals(job.getJob_status())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				job.getJob_id(),
				"Jobs",
				user.getUserModel().getUsr_name(),
				"Jobs Status",
				job_audit.getJob_status(),
				job.getJob_status(),
				"Updated",
				job.getJob_name()
			});
		}
		
		if(!job_audit.getJob_dtl().equals(job.getJob_dtl())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				job.getJob_id(),
				"Jobs",
				user.getUserModel().getUsr_name(),
				"Job's Project Description",
				job_audit.getJob_dtl(),
				job.getJob_dtl(),
				"Updated",
				job.getJob_name()
			});
		}
		
		if(job_audit.getProj_id() != job.getProj_id()){
			Jobs job_new = searchJobsByID(job.getJob_id());
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				job.getJob_id(),
				"Jobs",
				user.getUserModel().getUsr_name(),
				"Projects Name",
				job_audit.getProj_name(),
				job_new.getProj_name(),
				"Updated",
				job.getJob_name()
			});
		}
		
		if(!job_audit.getJob_name().equals(job.getJob_name())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				job.getJob_id(),
				"Jobs",
				user.getUserModel().getUsr_name(),
				"Job's Project Name",
				job_audit.getJob_name(),
				job.getJob_name(),
				"Updated",
				job.getJob_name()
			});
		}
		
	}
	
	@Override
	public void updateJobReference(JobsReference jobRef){
		
		JobsReference jobRef_audit = searchJobsReferenceByID(jobRef.getJob_ref_id());
		
		String sql = "UPDATE jobs_reference set "
				+ "job_ref_name=?, "
				+ "proj_ref_id=?, "
				+ "amount=?, "
				+ "job_in=?, "
				+ "job_out=?, "
				+ "job_ref_dtl=?, "
				+ "job_ref_status=?, "
				+ "update_date=now() "
				+ "where job_ref_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] {
				jobRef.getJob_ref_name(),
				jobRef.getProj_ref_id(),
				jobRef.getAmount(),
				jobRef.getJob_in_ts(),
				jobRef.getJob_out_ts(),
				jobRef.getJob_ref_dtl(),
				jobRef.getJob_ref_status(),
				jobRef.getJob_ref_id()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		JobsReference jobRef_new = searchJobsReferenceByID(jobRef.getJob_ref_id());
		
		if(!jobRef_audit.getJob_ref_status().equals(jobRef.getJob_ref_status())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				jobRef.getJob_ref_id(),
				"Jobs Reference:"+jobRef_audit.getJob_id(),
				user.getUserModel().getUsr_name(),
				"Jobs Status",
				jobRef_audit.getJob_ref_status(),
				jobRef.getJob_ref_status(),
				"Updated",
				jobRef_audit.getJob_name()+" : "+jobRef.getJob_ref_name()
			});
		}
		
		if(!jobRef_audit.getJob_ref_dtl().equals(jobRef.getJob_ref_dtl())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				jobRef.getJob_ref_id(),
				"Jobs Reference:"+jobRef_audit.getJob_id(),
				user.getUserModel().getUsr_name(),
				"Jobs Description",
				jobRef_audit.getJob_ref_dtl(),
				jobRef.getJob_ref_dtl(),
				"Updated",
				jobRef_audit.getJob_name()+" : "+jobRef.getJob_ref_name()
			});
		}
		
		if(jobRef_audit.getJob_out() == null){
			if(jobRef_new.getJob_out() != null){
				String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
				this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					jobRef.getJob_ref_id(),
					"Jobs Reference:"+jobRef_audit.getJob_id(),
					user.getUserModel().getUsr_name(),
					"Date Out",
					jobRef_audit.getJob_out(),
					jobRef_new.getJob_out(),
					"Updated",
					jobRef_audit.getJob_name()+" : "+jobRef.getJob_ref_name()
				});
			}
		}
		else if(!jobRef_audit.getJob_out().equals(jobRef_new.getJob_out())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				jobRef.getJob_ref_id(),
				"Jobs Reference:"+jobRef_audit.getJob_id(),
				user.getUserModel().getUsr_name(),
				"Date Out",
				jobRef_audit.getJob_out(),
				jobRef_new.getJob_out(),
				"Updated",
				jobRef_audit.getJob_name()+" : "+jobRef.getJob_ref_name()
			});
		}
		
		if(jobRef_audit.getJob_in() == null){
			if(jobRef_new.getJob_in() != null){
				String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
				this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					jobRef.getJob_ref_id(),
					"Jobs Reference:"+jobRef_audit.getJob_id(),
					user.getUserModel().getUsr_name(),
					"Date In",
					jobRef_audit.getJob_in(),
					jobRef_new.getJob_in(),
					"Updated",
					jobRef_audit.getJob_name()+" : "+jobRef.getJob_ref_name()
				});
			}
		}
		else if(!jobRef_audit.getJob_in().equals(jobRef_new.getJob_in())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				jobRef.getJob_ref_id(),
				"Jobs Reference:"+jobRef_audit.getJob_id(),
				user.getUserModel().getUsr_name(),
				"Date In",
				jobRef_audit.getJob_in(),
				jobRef_new.getJob_in(),
				"Updated",
				jobRef_audit.getJob_name()+" : "+jobRef.getJob_ref_name()
			});
		}
		
		if(jobRef_audit.getAmount() != jobRef.getAmount()){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				jobRef.getJob_ref_id(),
				"Jobs Reference:"+jobRef_audit.getJob_id(),
				user.getUserModel().getUsr_name(),
				"Amount",
				jobRef_audit.getAmount(),
				jobRef.getAmount(),
				"Updated",
				jobRef_audit.getJob_name()+" : "+jobRef.getJob_ref_name()
			});
		}
		
		if(jobRef_audit.getProj_ref_id() != jobRef.getProj_ref_id()){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				jobRef.getJob_ref_id(),
				"Jobs Reference:"+jobRef_audit.getJob_id(),
				user.getUserModel().getUsr_name(),
				"Item Name",
				jobRef_audit.getItm_name(),
				jobRef_new.getItm_name(),
				"Updated",
				jobRef_audit.getJob_name()+" : "+jobRef.getJob_ref_name()
			});
		}
		
		if(!jobRef_audit.getJob_ref_name().equals(jobRef.getJob_ref_name())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				jobRef.getJob_ref_id(),
				"Jobs Reference:"+jobRef_audit.getJob_id(),
				user.getUserModel().getUsr_name(),
				"Jobs Name",
				jobRef_audit.getJob_ref_name(),
				jobRef.getJob_ref_name(),
				"Updated",
				jobRef_audit.getJob_name()+" : "+jobRef.getJob_ref_name()
			});
		}
	}
	
	@Override
	public void deleteJob(int id) {
		
		Jobs job_audit = searchJobsByID(id);
		
		String sql = "DELETE from jobs where job_id="+id;
		this.getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (?,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				id,
				"Jobs",
				user.getUserModel().getUsr_name(),
				"Deleted all Jobs on Job's Projects name="+job_audit.getJob_name()+", customer="+job_audit.getCus_name(),
				job_audit.getJob_name()
		});
	}
	
	@Override
	public void deleteJobReference(int id) {
		
		JobsReference jobRef_audit = searchJobsReferenceByID(id);
		
		String sql = "DELETE from jobs_reference where job_ref_id="+id;
		this.getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (?,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				id,
				"Jobs Reference:"+jobRef_audit.getJob_id(),
				user.getUserModel().getUsr_name(),
				"Deleted Jobs name="+jobRef_audit.getJob_ref_name()+"on Job's Project Name="+jobRef_audit.getJob_name(),
				jobRef_audit.getJob_name()+" : "+jobRef_audit.getJob_ref_name()
		});
	}
	
	@Override
	public JobsReference getDataFromJson(Object data) {
		// TODO Auto-generated method stub
		JSONObject jsonObject = JSONObject.fromObject(data);
		JobsReference jobsRef = (JobsReference) JSONObject.toBean(jsonObject, JobsReference.class);
		return jobsRef;
	}
	
	@Override
	public List<JobsReference> getListDataFromJson(Object data) {
		// TODO Auto-generated method stub
		JSONArray jsonArray = JSONArray.fromObject(data);
		List<JobsReference> jobsRefLs = (List<JobsReference>) JSONArray.toCollection(jsonArray,JobsReference.class);
		return jobsRefLs;
	}

	@Override
	public List<JobsReference> getListDataFromRequest(Object data) {
		// TODO Auto-generated method stub
		List<JobsReference> jobsRefLs;

		//it is an array - have to cast to array object
		if (data.toString().indexOf('[') > -1){

			jobsRefLs = getListDataFromJson(data);

		} else { //it is only one object - cast to object/bean

			JobsReference jobsRef = getDataFromJson(data);

			jobsRefLs = new ArrayList<JobsReference>();
			jobsRefLs.add(jobsRef);

		}

		return jobsRefLs;
	}
	
	@Override
	public void updateJobReferenceBatch(List<JobsReference> jobRefLs){
		
		UserDetailsApp user = UserLoginDetail.getUser();
		List<JobsReference> jobRefLs_audit = new ArrayList<JobsReference>();
		JobsReference jobRef = null;
		
		for(int x=0;x<jobRefLs.size();x++){
			jobRef = searchJobsReferenceByID(jobRefLs.get(x).getJob_ref_id());
			jobRefLs_audit.add(jobRef);
		}
		
		try{
			String sql = "UPDATE jobs_reference set "
					+ "job_ref_name=?, "
					+ "proj_ref_id=?, "
					+ "amount=?, "
					+ "job_in=?, "
					+ "job_out=?, "
					+ "job_ref_dtl=?, "
					+ "job_ref_status=?, "
					+ "update_date=now() "
					+ "where job_ref_id=?";
			
			this.getJdbcTemplate().batchUpdate(sql,new BatchPreparedStatementSetter() {

				@Override
				public void setValues(PreparedStatement ps, int i) throws SQLException {
					JobsReference jobRef = jobRefLs.get(i);
					ps.setString(1, jobRef.getJob_ref_name());
					ps.setInt(2, jobRef.getProj_ref_id());
					ps.setFloat(3, jobRef.getAmount());
					ps.setTimestamp(4, jobRef.getJob_in_ts());
					ps.setTimestamp(5, jobRef.getJob_out_ts());
					ps.setString(6, jobRef.getJob_ref_dtl());
					ps.setString(7, jobRef.getJob_ref_status());
					ps.setInt(8, jobRef.getJob_ref_id());
				}
				
				@Override
				public int getBatchSize() {
					return jobRefLs.size();
				}
				
			});
			
			for(int y=0;y<jobRefLs.size();y++){
				JobsReference jobRef_new = searchJobsReferenceByID(jobRefLs.get(y).getJob_ref_id());
				
				if(!jobRefLs_audit.get(y).getJob_ref_status().equals(jobRef_new.getJob_ref_status())){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						jobRef_new.getJob_ref_id(),
						"Jobs Reference:"+jobRefLs_audit.get(y).getJob_id(),
						user.getUserModel().getUsr_name(),
						"Jobs Status",
						jobRefLs_audit.get(y).getJob_ref_status(),
						jobRef_new.getJob_ref_status(),
						"Updated",
						jobRefLs_audit.get(y).getJob_name()+" : "+jobRef_new.getJob_ref_name()
					});
				}
				
				if(!jobRefLs_audit.get(y).getJob_ref_dtl().equals(jobRef_new.getJob_ref_dtl())){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						jobRef_new.getJob_ref_id(),
						"Jobs Reference:"+jobRefLs_audit.get(y).getJob_id(),
						user.getUserModel().getUsr_name(),
						"Jobs Description",
						jobRefLs_audit.get(y).getJob_ref_dtl(),
						jobRef_new.getJob_ref_dtl(),
						"Updated",
						jobRefLs_audit.get(y).getJob_name()+" : "+jobRef_new.getJob_ref_name()
					});
				}
				
				if(jobRefLs_audit.get(y).getJob_out() == null){
					if(jobRef_new.getJob_out() != null){
						String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
						this.getJdbcTemplate().update(audit, new Object[]{
							getLastAuditId(),
							jobRef_new.getJob_ref_id(),
							"Jobs Reference:"+jobRefLs_audit.get(y).getJob_id(),
							user.getUserModel().getUsr_name(),
							"Date Out",
							jobRefLs_audit.get(y).getJob_out(),
							jobRef_new.getJob_out(),
							"Updated",
							jobRefLs_audit.get(y).getJob_name()+" : "+jobRef_new.getJob_ref_name()
						});
					}
				}
				else if(!jobRefLs_audit.get(y).getJob_out().equals(jobRef_new.getJob_out())){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						jobRef_new.getJob_ref_id(),
						"Jobs Reference:"+jobRefLs_audit.get(y).getJob_id(),
						user.getUserModel().getUsr_name(),
						"Date Out",
						jobRefLs_audit.get(y).getJob_out(),
						jobRef_new.getJob_out(),
						"Updated",
						jobRefLs_audit.get(y).getJob_name()+" : "+jobRef_new.getJob_ref_name()
					});
				}
				
				if(jobRefLs_audit.get(y).getJob_in() == null){
					if(jobRef_new.getJob_in() != null){
						String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
						this.getJdbcTemplate().update(audit, new Object[]{
							getLastAuditId(),
							jobRef_new.getJob_ref_id(),
							"Jobs Reference:"+jobRefLs_audit.get(y).getJob_id(),
							user.getUserModel().getUsr_name(),
							"Date In",
							jobRefLs_audit.get(y).getJob_in(),
							jobRef_new.getJob_in(),
							"Updated",
							jobRefLs_audit.get(y).getJob_name()+" : "+jobRef_new.getJob_ref_name()
						});
					}
				}
				else if(!jobRefLs_audit.get(y).getJob_in().equals(jobRef_new.getJob_in())){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						jobRef_new.getJob_ref_id(),
						"Jobs Reference:"+jobRefLs_audit.get(y).getJob_id(),
						user.getUserModel().getUsr_name(),
						"Date In",
						jobRefLs_audit.get(y).getJob_in(),
						jobRef_new.getJob_in(),
						"Updated",
						jobRefLs_audit.get(y).getJob_name()+" : "+jobRef_new.getJob_ref_name()
					});
				}
				
				if(jobRefLs_audit.get(y).getAmount() != jobRef_new.getAmount()){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						jobRef_new.getJob_ref_id(),
						"Jobs Reference:"+jobRefLs_audit.get(y).getJob_id(),
						user.getUserModel().getUsr_name(),
						"Amount",
						jobRefLs_audit.get(y).getAmount(),
						jobRef_new.getAmount(),
						"Updated",
						jobRefLs_audit.get(y).getJob_name()+" : "+jobRef_new.getJob_ref_name()
					});
				}
				
				if(jobRefLs_audit.get(y).getProj_ref_id() != jobRef_new.getProj_ref_id()){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						jobRef_new.getJob_ref_id(),
						"Jobs Reference:"+jobRefLs_audit.get(y).getJob_id(),
						user.getUserModel().getUsr_name(),
						"Item Name",
						jobRefLs_audit.get(y).getItm_name(),
						jobRef_new.getItm_name(),
						"Updated",
						jobRefLs_audit.get(y).getJob_name()+" : "+jobRef_new.getJob_ref_name()
					});
				}
				
				if(!jobRefLs_audit.get(y).getJob_ref_name().equals(jobRef_new.getJob_ref_name())){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						jobRef_new.getJob_ref_id(),
						"Jobs Reference:"+jobRefLs_audit.get(y).getJob_id(),
						user.getUserModel().getUsr_name(),
						"Jobs Name",
						jobRefLs_audit.get(y).getJob_ref_name(),
						jobRef_new.getJob_ref_name(),
						"Updated",
						jobRefLs_audit.get(y).getJob_name()+" : "+jobRef_new.getJob_ref_name()
					});
				}
			}
			
		}catch(Exception e){
			logger.error(e.getMessage());
		}
		
	}
	
	
	@Override
	public List<Jobs> radarItem(Map<String, String> data) {
		
		String sql = "SELECT DISTINCT dept "+
					 "FROM jobs\n" +
					 "LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = jobs.proj_ref_id\n" +
					 "LEFT JOIN projects proj ON proj.proj_id = proj_ref.proj_id\n" +
					 "LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n" +
					 "LEFT JOIN item ON item.itm_id = proj_ref.itm_id\n" +
					 "WHERE job_id != 0\n";
		
		if(data.get("job_name")==null || data.get("job_name").isEmpty()){
		}else{
			sql += "AND LOWER(job_name) LIKE LOWER('%"+data.get("job_name")+"%')\n";
		}
		if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
		}else{
			sql += "AND item.itm_id = "+data.get("itm_id")+"\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND cus.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
		}else{
			sql += "AND proj.proj_id = "+data.get("proj_id")+"\n";
		}
		if(data.get("dept")==null || data.get("dept").isEmpty()){
		}else{
			sql += "AND dept = '"+data.get("dept")+"'\n";
		}
		if(data.get("start")==null || data.get("start").isEmpty()){
			if(data.get("end")==null || data.get("end").isEmpty()){
			}else{
				sql += "AND (job_in <= '"+data.get("end")+" 23:59:59' OR job_out <= '"+data.get("end")+" 23:59:59')\n";
			}
		}else if(data.get("end")==null || data.get("end").isEmpty()){
			sql += "AND (job_in >= '"+data.get("start")+"' OR job_out >= '"+data.get("start")+"')\n";
		}else{
			sql += "AND ('"+data.get("start")+"' BETWEEN job_in AND job_out "
					+ "OR '"+data.get("end")+" 23:59:59' BETWEEN job_in AND job_out)\n";
		}
		
		sql += "ORDER BY 1";
		
		List<Jobs> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
		return result;
	}

	@Override
	public List<Jobs> dailyRadar(Map<String, String> data, String[] dept_list) {
		
		
		String sql = "SELECT * FROM crosstab(\n"+
				"$$select B.itm_name, B.dept, sum(B.result) as amount from\n"+
				"(select A.dept, A.itm_name, A.amount, A.hours, A.mans, A.deadline, A.diff_date,\n"+
				"CASE WHEN diff_date = 0			THEN amount\n"+
				"	 WHEN deadline >  diff_date THEN diff_date*amount\n"+
				"	 WHEN deadline <= diff_date THEN deadline*amount\n"+
				"	 END AS result,\n"+
				"CASE WHEN diff_date = 0			THEN hours\n"+
				"	 WHEN deadline >  diff_date THEN diff_date*hours\n"+
				"	 WHEN deadline <= diff_date THEN deadline*hours\n"+
				"	 END AS result2,\n"+
				"CASE WHEN diff_date = 0			THEN mans\n"+
				"	 WHEN deadline >  diff_date THEN diff_date*mans\n"+
				"	 WHEN deadline <= diff_date THEN deadline*mans\n"+
				"	 END AS result3\n"+
				"FROM\n"+
				"(select item.itm_name, dept, amount/date_part('day', job_out::timestamp - job_in::timestamp) as amount,\n"+
				"time*(amount/date_part('day', job_out::timestamp - job_in::timestamp))/60 as hours,\n"+
				"time*(amount/date_part('day', job_out::timestamp - job_in::timestamp))/60/8 as mans,\n"+
				"DATE(job_out)-DATE(job_in) as deadline,\n"+
				"DATE(job_out)-'2016-04-28' as diff_date\n"+
				"from jobs\n"+
				"LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = jobs.proj_ref_id\n"+
				"LEFT JOIN projects proj ON proj.proj_id = proj_ref.proj_id\n"+
				"LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n"+
				"LEFT JOIN item ON item.itm_id = proj_ref.itm_id\n";
				
				if(data.get("job_name")==null || data.get("job_name").isEmpty()){
				}else{
					sql += "AND LOWER(job_name) LIKE LOWER('%"+data.get("job_name")+"%')\n";
				}
				if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
				}else{
					sql += "AND item.itm_id = "+data.get("itm_id")+"\n";
				}
				if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
				}else{
					sql += "AND cus.cus_id = "+data.get("cus_id")+"\n";
				}
				if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
				}else{
					sql += "AND proj.proj_id = "+data.get("proj_id")+"\n";
				}
				if(data.get("dept")==null || data.get("dept").isEmpty()){
				}else{
					sql += "AND dept = '"+data.get("dept")+"'\n";
				}
				if(data.get("start")==null || data.get("start").isEmpty()){
					if(data.get("end")==null || data.get("end").isEmpty()){
					}else{
						sql += "AND (job_in <= '"+data.get("end")+" 23:59:59' OR job_out <= '"+data.get("end")+" 23:59:59')\n";
					}
				}else if(data.get("end")==null || data.get("end").isEmpty()){
					sql += "AND (job_in >= '"+data.get("start")+"' OR job_out >= '"+data.get("start")+"')\n";
				}else{
					sql += "AND ('"+data.get("start")+"' BETWEEN job_in AND job_out "
							+ "OR '"+data.get("end")+" 23:59:59' BETWEEN job_in AND job_out)\n";
				}
				
				sql +=  ")A)B\n"+
						"GROUP BY B.dept, B.itm_name\n"+
						"ORDER BY 1\n"+
						"$$,\n"+
						"$$SELECT DISTINCT dept FROM jobs \n"+
						"LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = jobs.proj_ref_id\n"+
						"LEFT JOIN projects proj ON proj.proj_id = proj_ref.proj_id\n"+
						"LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n"+
						"LEFT JOIN item ON item.itm_id = proj_ref.itm_id\n";
						
						if(data.get("job_name")==null || data.get("job_name").isEmpty()){
						}else{
							sql += "AND LOWER(job_name) LIKE LOWER('%"+data.get("job_name")+"%')\n";
						}
						if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
						}else{
							sql += "AND item.itm_id = "+data.get("itm_id")+"\n";
						}
						if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
						}else{
							sql += "AND cus.cus_id = "+data.get("cus_id")+"\n";
						}
						if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
						}else{
							sql += "AND proj.proj_id = "+data.get("proj_id")+"\n";
						}
						if(data.get("dept")==null || data.get("dept").isEmpty()){
						}else{
							sql += "AND dept = '"+data.get("dept")+"'\n";
						}
						if(data.get("start")==null || data.get("start").isEmpty()){
							if(data.get("end")==null || data.get("end").isEmpty()){
							}else{
								sql += "AND (job_in <= '"+data.get("end")+" 23:59:59' OR job_out <= '"+data.get("end")+" 23:59:59')\n";
							}
						}else if(data.get("end")==null || data.get("end").isEmpty()){
							sql += "AND (job_in >= '"+data.get("start")+"' OR job_out >= '"+data.get("start")+"')\n";
						}else{
							sql += "AND ('"+data.get("start")+"' BETWEEN job_in AND job_out "
									+ "OR '"+data.get("end")+" 23:59:59' BETWEEN job_in AND job_out)\n";
						}
						
				sql +=	"ORDER BY 1$$\n";
				String myItem = ") AS ct(\"itm_name\" text";
				for(int i=0;i<dept_list.length;i++){
					myItem += ", \"" + dept_list[i] + "\" float";
				}
				sql += myItem+")";
//						") AS ct(\"dept\" text, "Basic Clipping" float, "Basic Retouch" float, "Image Processing" float)\n";

				System.out.println("dailyRadar sql : \n"+sql);
				
		List<Jobs> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
		return result;
	}
	
	@Override
	public List<Jobs> stackItem(Map<String, String> data) {
		
		String sql = "SELECT DISTINCT item.itm_name "+
					 "FROM jobs\n" +
					 "LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = jobs.proj_ref_id\n" +
					 "LEFT JOIN projects proj ON proj.proj_id = proj_ref.proj_id\n" +
					 "LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n" +
					 "LEFT JOIN item ON item.itm_id = proj_ref.itm_id\n" +
					 "WHERE job_id != 0\n";
		
		if(data.get("job_name")==null || data.get("job_name").isEmpty()){
		}else{
			sql += "AND LOWER(job_name) LIKE LOWER('%"+data.get("job_name")+"%')\n";
		}
		if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
		}else{
			sql += "AND item.itm_id = "+data.get("itm_id")+"\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND cus.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
		}else{
			sql += "AND proj.proj_id = "+data.get("proj_id")+"\n";
		}
		if(data.get("dept")==null || data.get("dept").isEmpty()){
		}else{
			sql += "AND dept = '"+data.get("dept")+"'\n";
		}
		if(data.get("start")==null || data.get("start").isEmpty()){
			if(data.get("end")==null || data.get("end").isEmpty()){
			}else{
				sql += "AND (job_in <= '"+data.get("end")+" 23:59:59' OR job_out <= '"+data.get("end")+" 23:59:59')\n";
			}
		}else if(data.get("end")==null || data.get("end").isEmpty()){
			sql += "AND (job_in >= '"+data.get("start")+"' OR job_out >= '"+data.get("start")+"')\n";
		}else{
//			sql += "AND (job_in BETWEEN '"+data.get("start")+"' AND '"+data.get("end")+" 23:59:59' "
//					+ "OR job_out BETWEEN '"+data.get("start")+"' AND '"+data.get("end")+" 23:59:59')\n";
			sql += "AND ('"+data.get("start")+"' BETWEEN job_in AND job_out "
					+ "OR '"+data.get("end")+" 23:59:59' BETWEEN job_in AND job_out)\n";
		}
		
		sql += "ORDER BY 1";
		
		List<Jobs> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
		return result;
	}
	
	@Override
	public List<Jobs> dailyStack(Map<String, String> data, String[] itm_list) {
		
		String sql = "SELECT * FROM crosstab(\n"+
				"$$select B.dept, B.itm_name, sum(B.result) as amount from\n"+
				"(select A.dept, A.itm_name, A.amount, A.hours, A.mans, A.deadline, A.diff_date,\n"+
				"CASE WHEN diff_date = 0			THEN amount\n"+
				"	 WHEN deadline >  diff_date THEN diff_date*amount\n"+
				"	 WHEN deadline <= diff_date THEN deadline*amount\n"+
				"	 END AS result,\n"+
				"CASE WHEN diff_date = 0			THEN hours\n"+
				"	 WHEN deadline >  diff_date THEN diff_date*hours\n"+
				"	 WHEN deadline <= diff_date THEN deadline*hours\n"+
				"	 END AS result2,\n"+
				"CASE WHEN diff_date = 0			THEN mans\n"+
				"	 WHEN deadline >  diff_date THEN diff_date*mans\n"+
				"	 WHEN deadline <= diff_date THEN deadline*mans\n"+
				"	 END AS result3\n"+
				"FROM\n"+
				"(select item.itm_name, dept, amount/date_part('day', job_out::timestamp - job_in::timestamp) as amount,\n"+
				"time*(amount/date_part('day', job_out::timestamp - job_in::timestamp))/60 as hours,\n"+
				"time*(amount/date_part('day', job_out::timestamp - job_in::timestamp))/60/8 as mans,\n"+
				"DATE(job_out)-DATE(job_in) as deadline,\n"+
				"DATE(job_out)-'2016-04-28' as diff_date\n"+
				"from jobs\n"+
				"LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = jobs.proj_ref_id\n"+
				"LEFT JOIN projects proj ON proj.proj_id = proj_ref.proj_id\n"+
				"LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n"+
				"LEFT JOIN item ON item.itm_id = proj_ref.itm_id\n";
				
				if(data.get("job_name")==null || data.get("job_name").isEmpty()){
				}else{
					sql += "AND LOWER(job_name) LIKE LOWER('%"+data.get("job_name")+"%')\n";
				}
				if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
				}else{
					sql += "AND item.itm_id = "+data.get("itm_id")+"\n";
				}
				if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
				}else{
					sql += "AND cus.cus_id = "+data.get("cus_id")+"\n";
				}
				if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
				}else{
					sql += "AND proj.proj_id = "+data.get("proj_id")+"\n";
				}
				if(data.get("dept")==null || data.get("dept").isEmpty()){
				}else{
					sql += "AND dept = '"+data.get("dept")+"'\n";
				}
				if(data.get("start")==null || data.get("start").isEmpty()){
					if(data.get("end")==null || data.get("end").isEmpty()){
					}else{
						sql += "AND (job_in <= '"+data.get("end")+" 23:59:59' OR job_out <= '"+data.get("end")+" 23:59:59')\n";
					}
				}else if(data.get("end")==null || data.get("end").isEmpty()){
					sql += "AND (job_in >= '"+data.get("start")+"' OR job_out >= '"+data.get("start")+"')\n";
				}else{
					sql += "AND ('"+data.get("start")+"' BETWEEN job_in AND job_out "
							+ "OR '"+data.get("end")+" 23:59:59' BETWEEN job_in AND job_out)\n";
				}
				
				sql +=  ")A)B\n"+
						"GROUP BY B.dept, B.itm_name\n"+
						"ORDER BY 1\n"+
						"$$,\n"+
						"$$SELECT DISTINCT item.itm_name FROM jobs \n"+
						"LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = jobs.proj_ref_id\n"+
						"LEFT JOIN projects proj ON proj.proj_id = proj_ref.proj_id\n"+
						"LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n"+
						"LEFT JOIN item ON item.itm_id = proj_ref.itm_id\n";
						
						if(data.get("job_name")==null || data.get("job_name").isEmpty()){
						}else{
							sql += "AND LOWER(job_name) LIKE LOWER('%"+data.get("job_name")+"%')\n";
						}
						if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
						}else{
							sql += "AND item.itm_id = "+data.get("itm_id")+"\n";
						}
						if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
						}else{
							sql += "AND cus.cus_id = "+data.get("cus_id")+"\n";
						}
						if(data.get("proj_id")==null || data.get("proj_id").isEmpty()){
						}else{
							sql += "AND proj.proj_id = "+data.get("proj_id")+"\n";
						}
						if(data.get("dept")==null || data.get("dept").isEmpty()){
						}else{
							sql += "AND dept = '"+data.get("dept")+"'\n";
						}
						if(data.get("start")==null || data.get("start").isEmpty()){
							if(data.get("end")==null || data.get("end").isEmpty()){
							}else{
								sql += "AND (job_in <= '"+data.get("end")+" 23:59:59' OR job_out <= '"+data.get("end")+" 23:59:59')\n";
							}
						}else if(data.get("end")==null || data.get("end").isEmpty()){
							sql += "AND (job_in >= '"+data.get("start")+"' OR job_out >= '"+data.get("start")+"')\n";
						}else{
							sql += "AND ('"+data.get("start")+"' BETWEEN job_in AND job_out "
									+ "OR '"+data.get("end")+" 23:59:59' BETWEEN job_in AND job_out)\n";
						}
						
				sql +=	"ORDER BY 1$$\n";
				String myItem = ") AS ct(\"dept\" text";
				for(int i=0;i<itm_list.length;i++){
					myItem += ", \"" + itm_list[i] + "\" float";
				}
				sql += myItem+")";
//						") AS ct(\"dept\" text, "Basic Clipping" float, "Basic Retouch" float, "Image Processing" float)\n";

				System.out.println("dailyStack sql : \n"+sql);
				
		List<Jobs> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
		return result;
	}

	@Override
	public Jobs findByJobName(String name) {
		
		String sql = "select * from jobs where lower(job_name)=lower('"+name+"')";
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
	}

}
