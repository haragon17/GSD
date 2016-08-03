package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.controller.ProjectsController;
import com.gsd.dao.ProjectsDao;
import com.gsd.model.Customer;
import com.gsd.model.FileModel;
import com.gsd.model.Item;
import com.gsd.model.Projects;
import com.gsd.model.ProjectsReference;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

public class ProjectsDaoImpl extends JdbcDaoSupport implements ProjectsDao {

	private static final Logger logger = Logger.getLogger(ProjectsController.class);
	
	@Override
	public List<Projects> showProjects(int cus_id) {
		String sql = "SELECT projects.proj_id, \n" +
				"	projects.proj_name \n" +
//				"	projects.proj_desc, \n" +
//				"	projects.file_id, \n" +
//				"	projects.cus_id, \n" +
//				"	projects.cretd_usr, \n" +
//				"	projects.cretd_date, \n" +
//				"	projects.update_date,\n" +
//				"	count(*) as proj_count\n" +
				"FROM projects\n" +
				"LEFT JOIN projects_reference on projects_reference.proj_id = projects.proj_id\n";
				if(cus_id != 0){
					sql += "Where projects.cus_id = "+cus_id+"\n";
				}
				sql += "ORDER BY projects.proj_name";
		
		List<Projects> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Projects>(Projects.class));
		return result;
	}
	
	@Override
	public List<ProjectsReference> showProjectsReference(int proj_id) {
		
		String sql = "SELECT projects_reference.proj_ref_id, \n" + 
				"item.itm_name \n" +
				"FROM projects_reference, item\n" +
				"WHERE projects_reference.itm_id = item.itm_id " +
				"AND projects_reference.proj_id = "+ proj_id +"\n" +
				"ORDER BY item.itm_name";
		
		List<ProjectsReference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<ProjectsReference>(ProjectsReference.class));
		return result;
	}

//	@Override
//	public List<Projects> searchProjectsReferences(Map<String, String> data) {
//		
//		String sql = "SELECT * FROM projects_reference, item, customer\n" +
//				"WHERE projects_reference.itm_id = item.itm_id " +
//				"AND projects_reference.cus_id = customer.cus_id\n";
//		
//		if(data.get("proj_name")==null || data.get("proj_name").isEmpty()){
//		}else{
//			sql += "AND LOWER(proj_name) LIKE LOWER('%"+data.get("proj_name")+"%')\n";
//		}
//		if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
//		}else{
//			sql += "AND projects_reference.itm_id = "+data.get("itm_id")+"\n";
//		}
//		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
//		}else{
//			sql += "AND projects_reference.cus_id = "+data.get("cus_id")+"\n";
//		}
//		if(data.get("priceStart")==null || data.get("priceStart").isEmpty()){
//			if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
//			}else{
//				sql += "AND (round(price*(CASE projects_reference.currency \n" +
//						"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
//						"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
//						"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
//						"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
//						"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
//						"ELSE 1\n" +
//						"END)*10000)/10000) <= "+data.get("priceLimit")+"\n";
//			}
//		}else if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
//			sql += "AND (round(price*(CASE projects_reference.currency \n" +
//					"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
//					"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
//					"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
//					"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
//					"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
//					"ELSE 1\n" +
//					"END)*10000)/10000) >= "+data.get("priceStart")+"\n";
//		}else{
//			sql += "AND (round(price*(CASE projects_reference.currency \n" +
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
//				sql += "AND projects_reference.time <= "+data.get("timeLimit")+"\n";
//			}
//		}else if(data.get("timeLimit")==null || data.get("timeLimit").isEmpty()){
//			sql += "AND projects_reference.time >= "+data.get("timeStart")+"\n";
//		}else{
//			sql += "AND projects_reference.time BETWEEN "+data.get("timeStart")+" AND "+data.get("timeLimit")+"\n";
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
	public List<Projects> searchProjects(Map<String, String> data){
		String sql = "SELECT DISTINCT projects.proj_id, customer.cus_name, projects.proj_name, projects.proj_desc, projects.cus_id, \n" +
				"customer.cus_code, projects.file_id, customer.bill_to, customer.payment\n" +
				"FROM projects\n" +
				"LEFT JOIN projects_reference ON projects_reference.proj_id = projects.proj_id\n" +
				"LEFT JOIN customer ON customer.cus_id = projects.cus_id\n" +
				"WHERE projects.proj_id != 0\n";
		
		if(data.get("proj_name")==null || data.get("proj_name").isEmpty()){
		}else{
			sql += "AND LOWER(projects.proj_name) LIKE LOWER('%"+data.get("proj_name")+"%')\n";
		}
		if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
		}else{
			sql += "AND projects_reference.itm_id = "+data.get("itm_id")+"\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND projects.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("key_acc_id")==null || data.get("key_acc_id").isEmpty()){
		}else{
			sql += "AND customer.key_acc_id = "+data.get("key_acc_id")+"\n";
		}
		if(data.get("priceStart")==null || data.get("priceStart").isEmpty()){
			if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
			}else{
				sql += "AND (round(price*(CASE projects_reference.currency \n" +
						"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
						"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
						"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
						"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
						"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
						"ELSE 1\n" +
						"END)*10000)/10000) <= "+data.get("priceLimit")+"\n";
			}
		}else if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
			sql += "AND (round(price*(CASE projects_reference.currency \n" +
					"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
					"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
					"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
					"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
					"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
					"ELSE 1\n" +
					"END)*10000)/10000) >= "+data.get("priceStart")+"\n";
		}else{
			sql += "AND (round(price*(CASE projects_reference.currency \n" +
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
				sql += "AND projects_reference.time <= "+data.get("timeLimit")+"\n";
			}
		}else if(data.get("timeLimit")==null || data.get("timeLimit").isEmpty()){
			sql += "AND projects_reference.time >= "+data.get("timeStart")+"\n";
		}else{
			sql += "AND projects_reference.time BETWEEN "+data.get("timeStart")+" AND "+data.get("timeLimit")+"\n";
		}
		if(data.get("updateStart")==null || data.get("updateStart").isEmpty()){
			if(data.get("updateLimit")==null || data.get("updateLimit").isEmpty()){
			}else{
				sql += "AND projects_reference.update_date <= '"+data.get("updateLimit")+" 23:59:59'\n";
			}
		}else if(data.get("updateLimit")==null || data.get("updateLimit").isEmpty()){
			sql += "AND projects_reference.update_date >= '"+data.get("updateStart")+"'\n";
		}else{
			sql += "AND projects_reference.update_date BETWEEN '"+data.get("updateStart")+"' AND '"+data.get("updateLimit")+" 23:59:59'\n";
		}
		
		sql += "ORDER BY projects.proj_name";
		
//		System.out.println(sql);
		
		List<Projects> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Projects>(Projects.class));
		return result;
	}
	
	@Override
	public List<ProjectsReference> searchProjectsReferences(Map<String, String> data) {
		
		String sql = "SELECT projects_reference.proj_ref_id, projects_reference.proj_id, projects.proj_name, \n" +
				"projects_reference.itm_id, item.itm_name, projects_reference.\"time\", projects_reference.actual_time, \n" +
				"projects_reference.price, projects_reference.currency, projects_reference.proj_ref_desc\n" +
				"FROM projects_reference\n" +
				"LEFT JOIN projects ON projects.proj_id = projects_reference.proj_id\n" +
				"LEFT JOIN item ON item.itm_id = projects_reference.itm_id\n" +
				"LEFT JOIN customer ON customer.cus_id = projects.cus_id\n" +
				"WHERE projects_reference.proj_ref_id != 0\n";
		
		if(data.get("proj_name")==null || data.get("proj_name").isEmpty()){
		}else{
			sql += "AND LOWER(projects.proj_name) LIKE LOWER('%"+data.get("proj_name")+"%')\n";
		}
		if(data.get("itm_id")==null || data.get("itm_id").isEmpty()){
		}else{
			sql += "AND projects_reference.itm_id = "+data.get("itm_id")+"\n";
		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND projects.cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("key_acc_id")==null || data.get("key_acc_id").isEmpty()){
		}else{
			sql += "AND customer.key_acc_id = "+data.get("key_acc_id")+"\n";
		}
		if(data.get("priceStart")==null || data.get("priceStart").isEmpty()){
			if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
			}else{
				sql += "AND (round(price*(CASE projects_reference.currency \n" +
						"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
						"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
						"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
						"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
						"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
						"ELSE 1\n" +
						"END)*10000)/10000) <= "+data.get("priceLimit")+"\n";
			}
		}else if(data.get("priceLimit")==null || data.get("priceLimit").isEmpty()){
			sql += "AND (round(price*(CASE projects_reference.currency \n" +
					"WHEN 'AUD' THEN "+data.get("EUR")+"/"+data.get("AUD")+"\n" +
					"WHEN 'CHF' THEN "+data.get("EUR")+"/"+data.get("CHF")+"\n" +
					"WHEN 'GBP' THEN "+data.get("EUR")+"/"+data.get("GBP")+"\n" +
					"WHEN 'THB' THEN "+data.get("EUR")+"/"+data.get("THB")+"\n" +
					"WHEN 'USD' THEN "+data.get("EUR")+"\n" +
					"ELSE 1\n" +
					"END)*10000)/10000) >= "+data.get("priceStart")+"\n";
		}else{
			sql += "AND (round(price*(CASE projects_reference.currency \n" +
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
				sql += "AND projects_reference.time <= "+data.get("timeLimit")+"\n";
			}
		}else if(data.get("timeLimit")==null || data.get("timeLimit").isEmpty()){
			sql += "AND projects_reference.time >= "+data.get("timeStart")+"\n";
		}else{
			sql += "AND projects_reference.time BETWEEN "+data.get("timeStart")+" AND "+data.get("timeLimit")+"\n";
		}
		if(data.get("updateStart")==null || data.get("updateStart").isEmpty()){
			if(data.get("updateLimit")==null || data.get("updateLimit").isEmpty()){
			}else{
				sql += "AND projects_reference.update_date <= '"+data.get("updateLimit")+" 23:59:59'\n";
			}
		}else if(data.get("updateLimit")==null || data.get("updateLimit").isEmpty()){
			sql += "AND projects_reference.update_date >= '"+data.get("updateStart")+"'\n";
		}else{
			sql += "AND projects_reference.update_date BETWEEN '"+data.get("updateStart")+"' AND '"+data.get("updateLimit")+" 23:59:59'\n";
		}
		
		sql += "ORDER BY projects.proj_name, item.itm_name";
		
//		System.out.println(sql);
		
		List<ProjectsReference> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<ProjectsReference>(ProjectsReference.class));
		return result;
	}

	@Override
	public int getLastProjectRefId() {
		
		String sql = "SELECT max(proj_ref_id) from projects_reference";
		 
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
	public int getLastProjectId() {
		
		String sql = "SELECT max(proj_id) from projects";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

	public int getLastAuditId() {
		
		String sql = "SELECT max(aud_id) from audit_logging";
		
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}
	
	@Override
	public void createProjectsReference(ProjectsReference proj) {
		// TODO Auto-generated method stub
		String sql = "INSERT INTO projects_reference VALUES (?,?,?,?,?,?,now(),now(),?,?,?)";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				proj.getProj_ref_id(),
				proj.getProj_id(),
				proj.getItm_id(),
				proj.getTime(),
				proj.getPrice(),
				proj.getCretd_usr(),
				proj.getCurrency(),
				proj.getProj_ref_desc(),
				proj.getActual_time()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		Projects proj2 = new Projects();
		proj2 = getJdbcTemplate().queryForObject("select * from projects where proj_id="+proj.getProj_id(), new BeanPropertyRowMapper<Projects>(Projects.class));
		Item itm = new Item();
		itm = getJdbcTemplate().queryForObject("select * from item where itm_id="+proj.getItm_id(), new BeanPropertyRowMapper<Item>(Item.class));
		Customer cus = new Customer();
		cus = getJdbcTemplate().queryForObject("select * from customer where cus_id ="+proj2.getCus_id(), new BeanPropertyRowMapper<Customer>(Customer.class));
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc) VALUES (?,?,?,?,now(),?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				proj.getProj_ref_id(),
				"Projects Reference:"+proj2.getProj_id(),
				user.getUserModel().getUsr_name(),
				"Created Item name="+itm.getItm_name()+" on Project name="+proj2.getProj_name()+", customer="+cus.getCus_name()
				+", target_time="+proj.getTime()+", actual_time="+proj.getActual_time()+", price="+proj.getPrice()+", currency="+proj.getCurrency()+", desc="+proj.getProj_ref_desc()
		});
	}
	
	@Override
	public void createProjects(Projects proj) {
		// TODO Auto-generated method stub
		String sql = "INSERT INTO projects VALUES (?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				proj.getProj_id(),
				proj.getProj_name(),
				proj.getProj_desc(),
				proj.getFile_id(),
				proj.getCus_id(),
				proj.getCretd_usr()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		Customer cus = new Customer();
		cus = getJdbcTemplate().queryForObject("select * from customer where cus_id="+proj.getCus_id(), new BeanPropertyRowMapper<Customer>(Customer.class));
		String file_name = "";
		if(proj.getFile_id() != 0){
			FileModel myFile = new FileModel();
			myFile = getJdbcTemplate().queryForObject("select * from file where file_id="+proj.getFile_id(), new BeanPropertyRowMapper<FileModel>(FileModel.class));
			file_name = myFile.getFile_name();
		}
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc) VALUES (?,?,?,?,now(),?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				proj.getProj_id(),
				"Projects",
				user.getUserModel().getUsr_name(),
				"Created row on Projects name="+proj.getProj_name()+", desc="+proj.getProj_desc()+", file_name="+file_name
				+", customer="+cus.getCus_code()
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
	public void updateProjectsReference(ProjectsReference proj) {
		
		ProjectsReference proj_audit = new ProjectsReference();
		proj_audit = getJdbcTemplate().queryForObject("select * from projects_reference where proj_ref_id="+proj.getProj_ref_id(), new BeanPropertyRowMapper<ProjectsReference>(ProjectsReference.class));
		Item itm_audit = new Item();
		itm_audit = getJdbcTemplate().queryForObject("select * from item where itm_id="+proj_audit.getItm_id(), new BeanPropertyRowMapper<Item>(Item.class));
		Item itm = new Item();
		itm = getJdbcTemplate().queryForObject("select * from item where itm_id="+proj.getItm_id(), new BeanPropertyRowMapper<Item>(Item.class));
		
		String sql = "update projects_reference set "
				+ "itm_id=?, "
				+ "time=?, "
				+ "price=?, "
				+ "update_date=now(), "
				+ "currency=?, "
				+ "proj_ref_desc=?, "
				+ "actual_time=?"
				+ "where proj_ref_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				proj.getItm_id(),
				proj.getTime(),
				proj.getPrice(),
				proj.getCurrency(),
				proj.getProj_ref_desc(),
				proj.getActual_time(),
				proj.getProj_ref_id()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		if(!proj_audit.getProj_ref_desc().equals(proj.getProj_ref_desc())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					proj.getProj_ref_id(),
					"Projects Reference:"+proj_audit.getProj_id(),
					user.getUserModel().getUsr_name(),
					"Item Description",
					proj_audit.getProj_ref_desc(),
					proj.getProj_ref_desc(),
					"Updated"
			});
		}
		
		if(!proj_audit.getCurrency().equals(proj.getCurrency())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					proj.getProj_ref_id(),
					"Projects Reference:"+proj_audit.getProj_id(),
					user.getUserModel().getUsr_name(),
					"Currency",
					proj_audit.getCurrency(),
					proj.getCurrency(),
					"Updated"
			});
		}
		
		if(proj_audit.getPrice() != proj.getPrice()){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					proj.getProj_ref_id(),
					"Projects Reference:"+proj_audit.getProj_id(),
					user.getUserModel().getUsr_name(),
					"Price",
					proj_audit.getPrice(),
					proj.getPrice(),
					"Updated"
			});
		}
		
		if(proj_audit.getActual_time() != proj.getActual_time()){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					proj.getProj_ref_id(),
					"Projects Reference:"+proj_audit.getProj_id(),
					user.getUserModel().getUsr_name(),
					"Actual Time",
					proj_audit.getActual_time(),
					proj.getActual_time(),
					"Updated"
			});
		}
		
		if(proj_audit.getTime() != proj.getTime()){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					proj.getProj_ref_id(),
					"Projects Reference:"+proj_audit.getProj_id(),
					user.getUserModel().getUsr_name(),
					"Target Time",
					proj_audit.getTime(),
					proj.getTime(),
					"Updated"
			});
		}
		
		if(!itm_audit.getItm_name().equals(itm.getItm_name())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				proj.getProj_ref_id(),
				"Projects Reference:"+proj_audit.getProj_id(),
				user.getUserModel().getUsr_name(),
				"Item Name",
				itm_audit.getItm_name(),
				itm.getItm_name(),
				"Updated"
			});
		}
	}
	
	@Override
	public void updateProjects(Projects proj){
		
		Projects proj_audit = new Projects();
		proj_audit = getJdbcTemplate().queryForObject("select * from projects where proj_id="+proj.getProj_id(), new BeanPropertyRowMapper<Projects>(Projects.class));
		Customer cus_audit = new Customer();
		cus_audit = getJdbcTemplate().queryForObject("select * from customer where cus_id ="+proj_audit.getCus_id(), new BeanPropertyRowMapper<Customer>(Customer.class));
		Customer cus = new Customer();
		cus = getJdbcTemplate().queryForObject("select * from customer where cus_id ="+proj.getCus_id(), new BeanPropertyRowMapper<Customer>(Customer.class));
		
		String sql = "update projects set "
				+ "proj_name=?, "
				+ "proj_desc=?, "
				+ "file_id=?, "
				+ "cus_id=?, "
				+ "update_date=now() "
				+ "where proj_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				proj.getProj_name(),
				proj.getProj_desc(),
				proj.getFile_id(),
				proj.getCus_id(),
				proj.getProj_id()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		if(!cus_audit.getCus_name().equals(cus.getCus_name())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				proj.getProj_id(),
				"Projects",
				user.getUserModel().getUsr_name(),
				"Customer",
				cus_audit.getCus_name(),
				cus.getCus_name(),
				"Updated"
			});
		}
		
		if(proj.getFile_id() != 0){
			FileModel file_new = new FileModel();
			file_new = getFile(proj.getFile_id());
			logger.debug("file_audit="+proj.getFile_name()+" file_new="+file_new.getFile_name());
			if(!proj.getFile_name().equals(file_new.getFile_name())){
				String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
				this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					proj.getProj_id(),
					"Projects",
					user.getUserModel().getUsr_name(),
					"File",
					proj.getFile_name(),
					file_new.getFile_name(),
					"Updated"
				});
			}
		}
		
		if(!proj_audit.getProj_desc().equals(proj.getProj_desc())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				proj.getProj_id(),
				"Projects",
				user.getUserModel().getUsr_name(),
				"Projects Description",
				proj_audit.getProj_desc(),
				proj.getProj_desc(),
				"Updated"
			});
		}
		
		if(!proj_audit.getProj_name().equals(proj.getProj_name())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				proj.getProj_id(),
				"Projects",
				user.getUserModel().getUsr_name(),
				"Projects Name",
				proj_audit.getProj_name(),
				proj.getProj_name(),
				"Updated"
			});
		}
	}

	@Override
	public void deleteProjectsReference(int id) {
		
		ProjectsReference proj_ref = new ProjectsReference();
		proj_ref = getJdbcTemplate().queryForObject("select * from projects_reference where proj_ref_id="+id, new BeanPropertyRowMapper<ProjectsReference>(ProjectsReference.class));
		Projects proj = new Projects();
		proj = getJdbcTemplate().queryForObject("select * from projects where proj_id="+proj_ref.getProj_ref_id(), new BeanPropertyRowMapper<Projects>(Projects.class));
		Item itm = new Item();
		itm = getJdbcTemplate().queryForObject("select * from item where itm_id="+proj_ref.getItm_id(), new BeanPropertyRowMapper<Item>(Item.class));
		Customer cus = new Customer();
		cus = getJdbcTemplate().queryForObject("select * from customer where cus_id ="+proj.getCus_id(), new BeanPropertyRowMapper<Customer>(Customer.class));
		
		String sql = "delete from projects_reference where proj_ref_id="+id;
		this.getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc) VALUES (?,?,?,?,now(),?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				id,
				"Projects Reference:"+proj.getProj_id(),
				user.getUserModel().getUsr_name(),
				"Deleted Item name="+itm.getItm_name()+" on Project name="+proj.getProj_name()+", customer="+cus.getCus_name()
		});
	}
	
	public void deleteFile(int id) {
		// TODO Auto-generated method stub
		String sql = "delete from file where file_id="+id;
		this.getJdbcTemplate().update(sql);
	}

	@Override
	public void deleteProjects(int id) {
		
		Projects proj = new Projects();
		proj = getJdbcTemplate().queryForObject("select * from projects where proj_id="+id, new BeanPropertyRowMapper<Projects>(Projects.class));
		Customer cus = new Customer();
		cus = getJdbcTemplate().queryForObject("select * from customer where cus_id ="+proj.getCus_id(), new BeanPropertyRowMapper<Customer>(Customer.class));
		
		String sql = "delete from projects where proj_id="+id;
		this.getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc) VALUES (?,?,?,?,now(),?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				id,
				"Projects",
				user.getUserModel().getUsr_name(),
				"Deleted all Item on Projects name="+proj.getProj_name()+", customer="+cus.getCus_name()
		});
	}

	@Override
	public Projects findByProjectName(String name) {
		// TODO Auto-generated method stub
		String sql = "select * from projects where lower(proj_name)=lower('"+name+"')";
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Projects>(Projects.class)) ;
	}

}
