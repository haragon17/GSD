package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.JobsDao;
import com.gsd.model.Jobs;

public class JobsDaoImpl extends JdbcDaoSupport implements JobsDao {

	@Override
	public List<Jobs> searchJobs(Map<String, String> data) {
		
		String sql = "SELECT job_id, job_name , cus_name, cus_code, proj_name, itm_name, amount, "+
					 "job_in, job_out, dept, cus.cus_id, jobs.proj_ref_id, item.itm_id, proj.proj_id\n"+ 
					 "FROM jobs\n" +
					 "LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = jobs.proj_ref_id\n" +
					 "LEFT JOIN projects proj ON proj.proj_id = proj_ref.proj_id\n" +
					 "LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n" +
					 "LEFT JOIN item ON item.itm_id = proj_ref.itm_id";
		
		List<Jobs> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
		return result;
	}
	
	@Override
	public void createJob(Jobs job) {
		
		String sql = "INSERT INTO jobs VALUES (?,?,?,?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] {
			job.getJob_id(),
			job.getJob_name(),
			job.getProj_ref_id(),
			job.getAmount(),
			job.getDept(),
			job.getJob_in_ts(),
			job.getJob_out_ts(),
			job.getJob_dtl(),
			job.getCretd_usr()
		});
	}

	@Override
	public int getLastJobId() {
		
		String sql = "SELECT max(job_id) from jobs";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

	@Override
	public void updateJob(Jobs job){
		
		String sql = "UPDATE jobs set "
				+ "job_name=?, "
				+ "proj_ref_id=?, "
				+ "amount=?, "
				+ "dept=?, "
				+ "job_in=?, "
				+ "job_out=?, "
				+ "job_dtl=?, "
				+ "update_date=now() "
				+ "where job_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] {
			job.getJob_name(),
			job.getProj_ref_id(),
			job.getAmount(),
			job.getDept(),
			job.getJob_in_ts(),
			job.getJob_out_ts(),
			job.getJob_dtl(),
			job.getJob_id()
		});
		
	}
	
	@Override
	public void deleteJob(int id) {
		String sql = "DELETE from jobs where job_id="+id;
		this.getJdbcTemplate().update(sql);
	}
	
}
