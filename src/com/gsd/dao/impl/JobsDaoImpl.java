package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.JobsDao;
import com.gsd.model.Jobs;
import com.gsd.model.JobsReference;

public class JobsDaoImpl extends JdbcDaoSupport implements JobsDao {

	@Override
	public List<Jobs> searchJobs(Map<String, String> data) {
		String sql = "SELECT job_id, job_name, jobs.proj_id, proj_name, cus_name, cus_code, cus.cus_id, job_dtl, job_status, dept\n"
				+ "FROM jobs\n"
				+ "LEFT JOIN projects proj ON proj.proj_id = jobs.proj_id\n"
				+ "LEFT JOIN customer cus ON cus.cus_id = proj.cus_id\n"
				+ "WHERE job_id != 0\n";
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
		sql += "ORDER BY jobs.cretd_date DESC";	
		
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
	
	@Override
	public JobsReference searchJobsReferenceByID(int id) {
		String sql = "SELECT job_ref_id, job_ref_name, cus_name, cus_code, proj_name, itm_name, job_name, amount, job_in, job_out, dept\n"+
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
		
		String sql = "SELECT job_ref_id, job_ref_name, job_id, jobs_reference.proj_ref_id, amount, job_in, job_out, job_ref_dtl, itm_name\n"
				+ "FROM jobs_reference\n"
				+ "LEFT JOIN projects_reference proj_ref on proj_ref.proj_ref_id = jobs_reference.proj_ref_id\n"
				+ "LEFT JOIN item itm on itm.itm_id = proj_ref.itm_id\n"
				+ "WHERE job_id="+id
				+ " ORDER BY jobs_reference.job_in "+sort+" ,job_ref_id "+sort;
		
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
	}

	@Override
	public void createJobReference(JobsReference jobRef) {
		
		String sql = "INSERT INTO jobs_reference VALUES (?,?,?,?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] {
				jobRef.getJob_ref_id(),
				jobRef.getJob_id(),
				jobRef.getJob_ref_name(),
				jobRef.getProj_ref_id(),
				jobRef.getAmount(),
				jobRef.getJob_in_ts(),
				jobRef.getJob_out_ts(),
				jobRef.getJob_ref_dtl(),
				jobRef.getCretd_usr()
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

	@Override
	public void updateJob(Jobs job){
		
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
		
	}
	
	@Override
	public void updateJobReference(JobsReference jobRef){
		
		String sql = "UPDATE jobs_reference set "
				+ "job_ref_name=?, "
				+ "proj_ref_id=?, "
				+ "amount=?, "
				+ "job_in=?, "
				+ "job_out=?, "
				+ "job_ref_dtl=?, "
				+ "update_date=now() "
				+ "where job_ref_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] {
				jobRef.getJob_ref_name(),
				jobRef.getProj_ref_id(),
				jobRef.getAmount(),
				jobRef.getJob_in_ts(),
				jobRef.getJob_out_ts(),
				jobRef.getJob_ref_dtl(),
				jobRef.getJob_ref_id()
		});
		
	}
	
	@Override
	public void deleteJob(int id) {
		String sql = "DELETE from jobs where job_id="+id;
		this.getJdbcTemplate().update(sql);
	}
	
	@Override
	public void deleteJobReference(int id) {
		String sql = "DELETE from jobs_reference where job_ref_id="+id;
		this.getJdbcTemplate().update(sql);
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

}
