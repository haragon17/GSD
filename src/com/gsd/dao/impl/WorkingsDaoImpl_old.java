package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.WorkingsDao_old;
import com.gsd.model.FileModel;
import com.gsd.model.Workings_old;

public class WorkingsDaoImpl_old extends JdbcDaoSupport implements WorkingsDao_old{

	@Override
	public List<Workings_old> showWorkings(String search,int id) {
		String sql = "SELECT\n" +
				"workings.wrk_id,\n" +
				"workings.wrk_name,\n" +
				"workings.cate_lv1,\n" +
				"workings.cate_lv2,\n" +
				"workings.cate_lv3,\n" +
				"workings.file_id,\n" +
				"workings.keyword,\n" +
				"workings.wrk_dtl,\n" +
				"workings.cretd_usr,\n" +
				"workings.cretd_date,\n" +
				"workings.update_date,\n" +
				"cate1.cate_desc AS cateDesc1,\n" +
				"cate2.cate_desc AS cateDesc2,\n" +
				"cate3.cate_desc AS cateDesc3,\n" +
				"file.file_name AS file_name\n" +
				"FROM\n" +
				"workings\n" +
				"LEFT JOIN category AS cate1 on cate1.cate_id = workings.cate_lv1\n" +
				"LEFT JOIN category AS cate2 on cate2.cate_id = workings.cate_lv2\n" +
				"LEFT JOIN category AS cate3 on cate3.cate_id = workings.cate_lv3\n"+
				"LEFT JOIN file on file.file_id = workings.file_id\n"+
				"WHERE\n" +
				"(workings.wrk_name LIKE '%"+search+"%'\n" +
				"or\n" +
				"workings.keyword LIKE '%"+search+"%')\n" +
				"and\n" +
				"workings.cretd_usr = "+id;
		return getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Workings_old>(Workings_old.class));
	}
	
	@Override
	public List<Workings_old> showWorkingsAdmin(Map<String, String> data) {
		String sql = "SELECT\n" +
				"workings.wrk_id,\n" +
				"workings.wrk_name,\n" +
				"workings.cate_lv1,\n" +
				"workings.cate_lv2,\n" +
				"workings.cate_lv3,\n" +
				"workings.file_id,\n" +
				"workings.keyword,\n" +
				"workings.wrk_dtl,\n" +
				"workings.cretd_usr,\n" +
				"workings.cretd_date,\n" +
				"workings.update_date,\n" +
				"cate1.cate_desc AS cateDesc1,\n" +
				"cate2.cate_desc AS cateDesc2,\n" +
				"cate3.cate_desc AS cateDesc3,\n" +
				"file.file_name AS file_name\n" +
				"FROM\n" +
				"workings\n" +
				"LEFT JOIN category AS cate1 on cate1.cate_id = workings.cate_lv1\n" +
				"LEFT JOIN category AS cate2 on cate2.cate_id = workings.cate_lv2\n" +
				"LEFT JOIN category AS cate3 on cate3.cate_id = workings.cate_lv3\n" +
				"LEFT JOIN file on file.file_id = workings.file_id\n" +
				"LEFT JOIN users on users.usr_id = workings.cretd_usr\n" +
				"WHERE\n" +
				"workings.wrk_id != 0\n";
		
		if(data.get("name")==null || data.get("name").isEmpty()){
		}else{
			sql += "AND (workings.wrk_name LIKE '%"+data.get("name")+
					"%' OR workings.keyword LIKE '%"+data.get("name")+"%')\n";
		}
		if(data.get("cname")==null || data.get("cname").isEmpty()){
		}else{
			sql += "AND users.usr_name LIKE '%"+data.get("cname")+"'%\n";
		}
		if(data.get("cate1")==null || data.get("cate1").isEmpty()){
		}else{
			sql += "AND workings.cate_lv1 = "+data.get("cate1")+"\n";
		}
		if(data.get("cate2")==null || data.get("cate2").isEmpty()){
		}else{
			sql += "AND workings.cate_lv2 = "+data.get("cate2")+"\n";
		}
		if(data.get("cate3")==null || data.get("cate3").isEmpty()){
		}else{
			sql += "AND workings.cate_lv3 = "+data.get("cate3")+"\n";
		}
		if(data.get("supdate")==null || data.get("supdate").isEmpty()){
			if(data.get("eupdate")==null || data.get("eupdate").isEmpty()){
			}else{
				sql += "AND workings.update_date <= '"+data.get("eupdate")+"'\n";
			}
		}else if(data.get("eupdate")==null || data.get("eupdate").isEmpty()){
			sql += "AND workings.cretd_date >= '"+data.get("supdate")+"'\n";
		}else{
			sql += "AND workings.update_date BETWEEN '"+data.get("supdate")+"' AND '"+data.get("eupdate")+"'\n";
		}
		
		System.out.println(sql);
		
		return getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Workings_old>(Workings_old.class));
	}
	
	@Override
	public void createWorkings(Workings_old wrks,FileModel file) {
		// TODO Auto-generated method stub
		String sql = "INSERT INTO workings VALUES (?,?,?,?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				wrks.getWrk_id(),
				wrks.getWrk_name(),
				wrks.getCate_lv1(),
				wrks.getCate_lv2(),
				wrks.getCate_lv3(),
				file.getFile_id(),
				wrks.getKeyword(),
				wrks.getWrk_dtl(),
				wrks.getCretd_usr()
		});
		
		String sql2 = "INSERT INTO file VALUES (?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql2, new Object[] { 
				file.getFile_id(),
				file.getFile_path(),
				file.getFile_name(),
				file.getFile_type(),
				file.getFile_size(),
				file.getCretd_usr()
		});
		
	}
	
	@Override
	public int getLastWrkId() {
		
		String sql = "SELECT max(wrk_id) from workings";
		 
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
	public FileModel getFile(int id) {

		String sql = "select * from file where file_id = "+id;
		
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<FileModel>(FileModel.class));
	}

	@Override
	public void updateWorkings(Workings_old wrks) {

		String sql = "update workings set wrk_name=?, "
				+ "cate_lv1=?, "
				+ "cate_lv2=?, "
				+ "cate_lv3=?, "
				+ "keyword=?, "
				+ "wrk_dtl=?, "
				+ "update_date=now() "
				+ "where wrk_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				wrks.getWrk_name(),
				wrks.getCate_lv1(),
				wrks.getCate_lv2(),
				wrks.getCate_lv3(),
				wrks.getKeyword(),
				wrks.getWrk_dtl(),
				wrks.getWrk_id(),
		});
		
	}

	@Override
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
	public void deleteWorkings(int id) {
		// TODO Auto-generated method stub
		String sql = "delete from workings where wrk_id="+id;
		
		this.getJdbcTemplate().update(sql);
	}

	
}