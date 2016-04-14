package com.gsd.dao.impl;

import java.util.List;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.ItemDao;
import com.gsd.model.Item;

public class ItemDaoImpl extends JdbcDaoSupport implements ItemDao {

	@Override
	public List<Item> searchItem(String search) {
		// TODO Auto-generated method stub
		String sql = "select * from item";
		
		if(search != ""){
			sql += " where lower(itm_name) LIKE lower('%"+search+"%') or lower(itm_desc) LIKE lower('%"+search+"%') ";
		}
		
		sql += " order by itm_name";
		
		List<Item> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Item>(Item.class));
		return result;
	}

	@Override
	public int getLastItemId() {
		
		String sql = "SELECT max(itm_id) from item";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

	@Override
	public void updateItem(Item itm) {
		// TODO Auto-generated method stub
		String sql = "update item set itm_name=?, "
				+ "itm_desc=?, "
				+ "update_date=now() "
				+ "where itm_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[]{
				itm.getItm_name(),
				itm.getItm_desc(),
				itm.getItm_id()
			});
	}

	@Override
	public void createItem(Item itm) {

String sql = "INSERT INTO item VALUES (?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[]{
			itm.getItm_id(),
			itm.getItm_name(),
			itm.getItm_desc(),
			itm.getCretd_usr()
		});
		
	}

	@Override
	public void deleteItem(int id) {
		
		String sql = "delete from item where itm_id = "+id;
		
		getJdbcTemplate().update(sql);
	}

	@Override
	public Item findByItmName(String itm_name) {
		String sql = "select * from item where lower(itm_name) = lower('"+itm_name+"')";
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Item>(Item.class));
	}

}
