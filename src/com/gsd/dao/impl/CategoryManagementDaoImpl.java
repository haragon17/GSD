package com.gsd.dao.impl;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.CategoryManagementDao;
import com.gsd.model.Category;

public class CategoryManagementDaoImpl extends JdbcDaoSupport implements CategoryManagementDao{

	@Override
	public List<Category> showCate1() {
		// TODO Auto-generated method stub
		String sql = "select * from category where cate_lv = 1";
		return getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Category>(Category.class));
	}

	@Override
	public List<Category> showCate2(String ref) {
		// TODO Auto-generated method stub
		String sql = "select * from category where cate_lv = 2 and cate_ref = "+ref;
		return getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Category>(Category.class));
	}

	@Override
	public List<Category> showCate3(String ref) {
		// TODO Auto-generated method stub
		String sql = "select * from category where cate_lv = 3 and cate_ref = "+ref;
		return getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Category>(Category.class));
	}

	@Override
	public void createCate(Category cate) {
		// TODO Auto-generated method stub
		String sql = "INSERT INTO category (cate_id,cate_desc,comment,cate_ref,cate_lv,cretd_date) "
				+ "VALUES (?,?,?,?,?,now())";
		
		this.getJdbcTemplate().update(sql, new Object[] { 
				cate.getCate_id(),
				cate.getCate_desc(),
				cate.getComment(),
				cate.getCate_ref(),
				cate.getCate_lv()
		});
	}
	
	@Override
	public boolean updateCate1(final List<Category> cate) {
		// TODO Auto-generated method stub
//		LOG.debug("Inside ParamDaoImpl.updateParamHdr method");
		try{
			StringBuilder sql = new StringBuilder();
			sql.append("UPDATE category SET " +
					"cate_desc=? ," +
					"comment=? " +
					"WHERE cate_id=?");
			this.getJdbcTemplate().batchUpdate(sql.toString(),new BatchPreparedStatementSetter() {
				
				@Override
				public void setValues(PreparedStatement ps, int i) throws SQLException {
					Category c=cate.get(i);

					try{
					ps.setString(1,c.getCate_desc());
					ps.setString(2,c.getComment());
					ps.setInt(3, c.getCate_id());
					}catch(Exception e){
//						LOG.error(" :: "+e.getMessage());
						System.out.println(e.getMessage());
					}
				}
				
				@Override
				public int getBatchSize() {
					// TODO Auto-generated method stub
					return cate.size();
				}
			});
			return true;
		}catch(Exception e){
//			LOG.error("Inside ParamDaoImpl.updateParamHdr method :: "+e.getMessage());
			System.out.println(e.getMessage());
			return false;
		}
		
	}
	
	@Override
	public boolean deleteCate1(final List<Category> cate) {

		// TODO Auto-generated method stub
		try{
			
			deleteCateRef(cate);
			
			StringBuilder sql= new StringBuilder();
			sql.append("DELETE FROM category WHERE cate_id = ?");
			this.getJdbcTemplate().batchUpdate(sql.toString(),new BatchPreparedStatementSetter() {
				
				@Override
				public void setValues(PreparedStatement ps, int i) throws SQLException {
					// TODO Auto-generated method stub
					Category c  = cate.get(i);
					ps.setInt(1, c.getCate_id());
				}
				
				@Override
				public int getBatchSize() {
					// TODO Auto-generated method stub
					return cate.size();
				}
			});
			return true;
		}catch(Exception e){
			return false;
		}
		
	}
	
	@Override
	public boolean deleteCateRef(final List<Category> cate) {

		// TODO Auto-generated method stub
		try{
			
			StringBuilder sql= new StringBuilder();
			sql.append("DELETE FROM category WHERE cate_ref = ?");
			this.getJdbcTemplate().batchUpdate(sql.toString(),new BatchPreparedStatementSetter() {
				
				@Override
				public void setValues(PreparedStatement ps, int i) throws SQLException {
					// TODO Auto-generated method stub
					Category c  = cate.get(i);
					ps.setInt(1, c.getCate_id());
				}
				
				@Override
				public int getBatchSize() {
					// TODO Auto-generated method stub
					return cate.size();
				}
			});
			return true;
		}catch(Exception e){
			return false;
		}
		
	}
	
	@SuppressWarnings("unchecked")
	public List<Category> getListDataFromJson(Object data) {
		// TODO Auto-generated method stub
		JSONArray jsonArray = JSONArray.fromObject(data);
		List<Category> newList=(List<Category>) JSONArray.toCollection(jsonArray,Category.class);
		return newList;
	}
	public List<Category> getListDataFromRequest(Object data){

		List<Category> listCate;
		
		if(data.toString().indexOf('[')> -1){
			listCate = getListDataFromJson(data);
		}else{
			Category paramHdr=getDataFromJson(data);
			
			listCate = new ArrayList<Category>();
			listCate.add(paramHdr);
		}
		return listCate;
	}
	private Category getDataFromJson(Object data){

		JSONObject jsonObject = JSONObject.fromObject(data);
		Category newExample = (Category) JSONObject.toBean(jsonObject, Category.class);
		return newExample;
	}

	@Override
	public int getLastCateId() {
		
		String sql = "SELECT max(cate_id) from category";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

}
