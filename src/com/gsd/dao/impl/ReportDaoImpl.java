package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.ReportDao;
import com.gsd.model.Report;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

public class ReportDaoImpl extends JdbcDaoSupport implements ReportDao{

	@Override
	public List<Report> searchReport(Map<String, String> data) {

		UserDetailsApp user =UserLoginDetail.getUser();
		
		String sql = "SELECT\n" +
				"workings.wrk_name,\n" +
				"cate1.cate_desc AS cate1,\n" +
				"cate2.cate_desc AS cate2,\n" +
				"cate3.cate_desc AS cate3,\n" +
				"users.usr_name,\n" +
				"workings.cretd_date,\n" +
				"workings.update_date\n" +
				"FROM\n" +
				"workings\n" +
				"LEFT JOIN category AS cate1 ON cate1.cate_id = workings.cate_lv1\n" +
				"LEFT JOIN users ON users.usr_id = workings.cretd_usr\n" +
				"LEFT JOIN category AS cate2 ON workings.cate_lv2 = cate2.cate_id\n" +
				"LEFT JOIN category AS cate3 ON workings.cate_lv3 = cate3.cate_id\n" +
				"WHERE\n" +
				"workings.wrk_id != 0\n";

		if(data.get("name")==null || data.get("name").isEmpty()){
		}else{
			sql += "AND (workings.wrk_name LIKE '%"+data.get("name")+
					"%' OR workings.keyword LIKE '%"+data.get("name")+"%')\n";
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
		if(data.get("screate")==null || data.get("screate").isEmpty()){
			if(data.get("ecreate")==null || data.get("ecreate").isEmpty()){
			}else{
				sql += "AND workings.cretd_date <= '"+data.get("ecreate")+"'\n";
			}
		}else if(data.get("ecreate")==null || data.get("ecreate").isEmpty()){
			sql += "AND workings.cretd_date >= '"+data.get("screate")+"'\n";
		}else{
			sql += "AND workings.cretd_date BETWEEN '"+data.get("screate")+"' AND '"+data.get("ecreate")+"'\n";
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
		
		if(user.getUserModel().getUsr_type()==1){
			sql += "AND workings.cretd_usr = "+user.getUserModel().getUsr_id();
		}
		
		System.out.println(sql);
		
		List<Report> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Report>(Report.class));
		return result;
	}

}
