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
		
		System.out.println(sql);
		
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
