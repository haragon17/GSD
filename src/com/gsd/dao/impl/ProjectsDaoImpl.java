package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.ProjectsDao;
import com.gsd.model.FileModel;
import com.gsd.model.Jobs;
import com.gsd.model.Projects;

public class ProjectsDaoImpl extends JdbcDaoSupport implements ProjectsDao {

	@Override
	public List<Jobs> showJobs() {
		String sql = "SELECT jobs.job_id, \n" +
				"	jobs.job_name, \n" +
				"	jobs.job_desc, \n" +
				"	jobs.file_id, \n" +
				"	jobs.cus_id, \n" +
				"	jobs.cretd_usr, \n" +
				"	jobs.cretd_date, \n" +
				"	jobs.update_date,\n" +
				"	count(*) as proj_count\n" +
				"FROM jobs\n" +
				"LEFT JOIN projects on projects.job_id = jobs.job_id\n" +
				"GROUP BY jobs.job_id";
		
		List<Jobs> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
		return result;
	}
	
	@Override
	public List<Projects> showProjects() {
		
		String sql = "SELECT * FROM projects, item, customer\n" +
				"WHERE projects.itm_id = item.itm_id " +
				"AND projects.cus_id = customer.cus_id\n" +
				"ORDER BY proj_name";
		
		List<Projects> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Projects>(Projects.class));
		return result;
	}

//	@Override
//	public List<Projects> searchProjects(Map<String, String> data) {
//		
//		String sql = "SELECT * FROM projects, item, customer\n" +
//				"WHERE projects.itm_id = item.itm_id " +
//				"AND projects.cus_id = customer.cus_id\n";
//		
//		if(data.get("proj_name")==null || data.get("proj_name").isEmpty()){
//		}else{
//			sql += "AND LOWER(proj_name) LIKE LOWER('%"+data.get("proj_name")+"%')\n";
//		}
//		if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
//		}else{
//			sql += "AND projects.itm_id = "+data.get("itm_id")+"\n";
//		}
//		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
//		}else{
//			sql += "AND projects.cus_id = "+data.get("cus_id")+"\n";
//		}
//		if(data.get("priceStart")==null || data.get("priceStart").isEmpty()){
//			if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
//			}else{
//				sql += "AND (round(price*(CASE projects.currency \n" +
//						"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
//						"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
//						"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
//						"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
//						"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
//						"ELSE 1\n" +
//						"END)*10000)/10000) <= "+data.get("priceLimit")+"\n";
//			}
//		}else if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
//			sql += "AND (round(price*(CASE projects.currency \n" +
//					"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
//					"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
//					"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
//					"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
//					"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
//					"ELSE 1\n" +
//					"END)*10000)/10000) >= "+data.get("priceStart")+"\n";
//		}else{
//			sql += "AND (round(price*(CASE projects.currency \n" +
//					"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
//					"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
//					"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
//					"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
//					"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
//					"ELSE 1\n" +
//					"END)*10000)/10000) BETWEEN "+data.get("priceStart")+" and "+data.get("priceLimit")+"\n";
//		}
//		if(data.get("timeStart")==null || data.get("timeStart").isEmpty()){
//			if(data.get("timeLimit")==null || data.get("timeLimit").isEmpty()){
//			}else{
//				sql += "AND projects.time <= "+data.get("timeLimit")+"\n";
//			}
//		}else if(data.get("timeLimit")==null || data.get("timeLimit").isEmpty()){
//			sql += "AND projects.time >= "+data.get("timeStart")+"\n";
//		}else{
//			sql += "AND projects.time BETWEEN "+data.get("timeStart")+" AND "+data.get("timeLimit")+"\n";
//		}
//		
//		sql += "ORDER BY proj_name";
//		
//		System.out.println(sql);
//		
//		List<Projects> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Projects>(Projects.class));
//		return result;
//	}
	
	@Override
	public List<Jobs> searchJobs(Map<String, String> data){
		String sql = "SELECT DISTINCT jobs.job_id, customer.cus_name, jobs.job_name, jobs.job_desc, jobs.cus_id, \n" +
				"customer.cus_code, jobs.file_id\n" +
				"FROM jobs\n" +
				"LEFT JOIN projects ON projects.job_id = jobs.job_id\n" +
				"LEFT JOIN customer ON customer.cus_id = jobs.cus_id\n" +
				"WHERE jobs.job_id != 0\n";
		
		if(data.get("proj_name")==null || data.get("proj_name").isEmpty()){
		}else{
			sql += "AND LOWER(jobs.job_name) LIKE LOWER('%"+data.get("proj_name")+"%')\n";
		}
		if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
		}else{
			sql += "AND projects.itm_id = "+data.get("itm_id")+"\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND jobs.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("key_acc_id")==null || data.get("key_acc_id").isEmpty()){
		}else{
			sql += "AND customer.key_acc_id = "+data.get("key_acc_id")+"\n";
		}
		if(data.get("priceStart")==null || data.get("priceStart").isEmpty()){
			if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
			}else{
				sql += "AND (round(price*(CASE projects.currency \n" +
						"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
						"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
						"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
						"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
						"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
						"ELSE 1\n" +
						"END)*10000)/10000) <= "+data.get("priceLimit")+"\n";
			}
		}else if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
			sql += "AND (round(price*(CASE projects.currency \n" +
					"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
					"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
					"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
					"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
					"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
					"ELSE 1\n" +
					"END)*10000)/10000) >= "+data.get("priceStart")+"\n";
		}else{
			sql += "AND (round(price*(CASE projects.currency \n" +
					"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
					"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
					"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
					"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
					"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
					"ELSE 1\n" +
					"END)*10000)/10000) BETWEEN "+data.get("priceStart")+" and "+data.get("priceLimit")+"\n";
		}
		if(data.get("timeStart")==null || data.get("timeStart").isEmpty()){
			if(data.get("timeLimit")==null || data.get("timeLimit").isEmpty()){
			}else{
				sql += "AND projects.time <= "+data.get("timeLimit")+"\n";
			}
		}else if(data.get("timeLimit")==null || data.get("timeLimit").isEmpty()){
			sql += "AND projects.time >= "+data.get("timeStart")+"\n";
		}else{
			sql += "AND projects.time BETWEEN "+data.get("timeStart")+" AND "+data.get("timeLimit")+"\n";
		}
		if(data.get("updateStart")==null || data.get("updateStart").isEmpty()){
			if(data.get("updateLimit")==null || data.get("updateLimit").isEmpty()){
			}else{
				sql += "AND projects.update_date <= '"+data.get("updateLimit")+" 23:59:59'\n";
			}
		}else if(data.get("updateLimit")==null || data.get("updateLimit").isEmpty()){
			sql += "AND projects.update_date >= '"+data.get("updateStart")+"'\n";
		}else{
			sql += "AND projects.update_date BETWEEN '"+data.get("updateStart")+"' AND '"+data.get("updateLimit")+" 23:59:59'\n";
		}
		
		sql += "ORDER BY jobs.job_name";
		
//		System.out.println(sql);
		
		List<Jobs> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class));
		return result;
	}
	
	@Override
	public List<Projects> searchProjects(Map<String, String> data) {
		
		String sql = "SELECT projects.proj_id, projects.job_id, jobs.job_name, \n" +
				"projects.itm_id, item.itm_name, projects.\"time\", \n" +
				"projects.price, projects.currency, projects.proj_desc\n" +
				"FROM projects\n" +
				"LEFT JOIN jobs ON jobs.job_id = projects.job_id\n" +
				"LEFT JOIN item ON item.itm_id = projects.itm_id\n" +
				"LEFT JOIN customer ON customer.cus_id = jobs.cus_id\n" +
				"WHERE projects.proj_id != 0\n";
		
		if(data.get("proj_name")==null || data.get("proj_name").isEmpty()){
		}else{
			sql += "AND LOWER(jobs.job_name) LIKE LOWER('%"+data.get("proj_name")+"%')\n";
		}
		if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
		}else{
			sql += "AND projects.itm_id = "+data.get("itm_id")+"\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND jobs.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("key_acc_id")==null || data.get("key_acc_id").isEmpty()){
		}else{
			sql += "AND customer.key_acc_id = "+data.get("key_acc_id")+"\n";
		}
		if(data.get("priceStart")==null || data.get("priceStart").isEmpty()){
			if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
			}else{
				sql += "AND (round(price*(CASE projects.currency \n" +
						"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
						"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
						"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
						"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
						"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
						"ELSE 1\n" +
						"END)*10000)/10000) <= "+data.get("priceLimit")+"\n";
			}
		}else if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
			sql += "AND (round(price*(CASE projects.currency \n" +
					"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
					"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
					"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
					"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
					"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
					"ELSE 1\n" +
					"END)*10000)/10000) >= "+data.get("priceStart")+"\n";
		}else{
			sql += "AND (round(price*(CASE projects.currency \n" +
					"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
					"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
					"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
					"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
					"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
					"ELSE 1\n" +
					"END)*10000)/10000) BETWEEN "+data.get("priceStart")+" and "+data.get("priceLimit")+"\n";
		}
		if(data.get("timeStart")==null || data.get("timeStart").isEmpty()){
			if(data.get("timeLimit")==null || data.get("timeLimit").isEmpty()){
			}else{
				sql += "AND projects.time <= "+data.get("timeLimit")+"\n";
			}
		}else if(data.get("timeLimit")==null || data.get("timeLimit").isEmpty()){
			sql += "AND projects.time >= "+data.get("timeStart")+"\n";
		}else{
			sql += "AND projects.time BETWEEN "+data.get("timeStart")+" AND "+data.get("timeLimit")+"\n";
		}
		if(data.get("updateStart")==null || data.get("updateStart").isEmpty()){
			if(data.get("updateLimit")==null || data.get("updateLimit").isEmpty()){
			}else{
				sql += "AND projects.update_date <= '"+data.get("updateLimit")+" 23:59:59'\n";
			}
		}else if(data.get("updateLimit")==null || data.get("updateLimit").isEmpty()){
			sql += "AND projects.update_date >= '"+data.get("updateStart")+"'\n";
		}else{
			sql += "AND projects.update_date BETWEEN '"+data.get("updateStart")+"' AND '"+data.get("updateLimit")+" 23:59:59'\n";
		}
		
		sql += "ORDER BY jobs.job_name, item.itm_name";
		
//		System.out.println(sql);
		
		List<Projects> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Projects>(Projects.class));
		return result;
	}

	@Override
	public int getLastProjectId() {
		
		String sql = "SELECT max(proj_id) from projects";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}
	
	@Override
	public int getLastFileId() {
		
		String sql = "SELECT max(file_id) from file";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}
	
	@Override
	public int getLastJobId() {
		
		String sql = "SELECT max(job_id) from jobs";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

	@Override
	public void createProjects(Projects proj) {
		// TODO Auto-generated method stub
		String sql = "INSERT INTO projects VALUES (?,?,?,?,?,?,now(),now(),?,?)";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				proj.getProj_id(),
				proj.getJob_id(),
				proj.getItm_id(),
				proj.getTime(),
				proj.getPrice(),
				proj.getCretd_usr(),
				proj.getCurrency(),
				proj.getProj_desc()
		});
	}
	
	@Override
	public void createJobs(Jobs job) {
		// TODO Auto-generated method stub
		String sql = "INSERT INTO jobs VALUES (?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				job.getJob_id(),
				job.getJob_name(),
				job.getJob_desc(),
				job.getFile_id(),
				job.getCus_id(),
				job.getCretd_usr()
		});
	}

	@Override
	public void createFile(FileModel file) {
		// TODO Auto-generated method stub
		String sql = "INSERT INTO file VALUES (?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				file.getFile_id(),
				file.getFile_path(),
				file.getFile_name(),
				file.getFile_type(),
				file.getFile_size(),
				file.getCretd_usr()
		});
	}
	
	@Override
	public FileModel getFile(int id) {

		String sql = "select * from file where file_id = "+id;
		
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<FileModel>(FileModel.class));
	}
	
	public void updateFile(FileModel file) {
		
		String sql = "update file set file_path=?, file_name=?, file_type=?, file_size=?, update_date=now() "
				+ "where file_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				file.getFile_path(),
				file.getFile_name(),
				file.getFile_type(),
				file.getFile_size(),
				file.getFile_id(),
		});
		
	}

	@Override
	public void updateProjects(Projects proj) {
		// TODO Auto-generated method stub
		String sql = "update projects set "
				+ "itm_id=?, "
				+ "time=?, "
				+ "price=?, "
				+ "update_date=now(), "
				+ "currency=?, "
				+ "proj_desc=? "
				+ "where proj_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				proj.getItm_id(),
				proj.getTime(),
				proj.getPrice(),
				proj.getCurrency(),
				proj.getProj_desc(),
				proj.getProj_id()
		});
		
	}
	
	@Override
	public void updateJobs(Jobs job){
		
		String sql = "update jobs set "
				+ "job_name=?, "
				+ "job_desc=?, "
				+ "file_id=?, "
				+ "cus_id=?,"
				+ "update_date=now() "
				+ "where job_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				job.getJob_name(),
				job.getJob_desc(),
				job.getFile_id(),
				job.getCus_id(),
				job.getJob_id()
		});
	}

	@Override
	public void deleteProject(int id) {
		// TODO Auto-generated method stub
		String sql = "delete from projects where proj_id="+id;
		this.getJdbcTemplate().update(sql);
	}
	
	public void deleteFile(int id) {
		// TODO Auto-generated method stub
		String sql = "delete from file where file_id="+id;
		this.getJdbcTemplate().update(sql);
	}

	@Override
	public void deleteJob(int id) {
		// TODO Auto-generated method stub
		String sql = "delete from jobs where job_id="+id;
		this.getJdbcTemplate().update(sql);
	}

	@Override
	public Jobs findByJobName(String name) {
		// TODO Auto-generated method stub
		String sql = "select * from jobs where lower(job_name)=lower('"+name+"')";
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Jobs>(Jobs.class)) ;
	}

}
