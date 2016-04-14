package com.gsd.dao.impl;

import java.util.List;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.KeyAccountManagerDao;
import com.gsd.model.KeyAccountManager;

public class KeyAccountManagerDaoImpl extends JdbcDaoSupport implements KeyAccountManagerDao {

	@Override
	public List<KeyAccountManager> showKeyAccMng() {
		String sql = "select * from key_account_mng order by key_acc_name";
		return getJdbcTemplate().query(sql, new BeanPropertyRowMapper<KeyAccountManager>(KeyAccountManager.class));
	}

	@Override
	public List<KeyAccountManager> searchKeyAccMng(String search) {
		// TODO Auto-generated method stub

		String sql = "select * from key_account_mng where key_acc_id != 0";

		if (search != "") {
			sql += " and lower(key_acc_name) LIKE lower('%" + search + "%')";
		}

		sql += " order by key_acc_name";

		List<KeyAccountManager> result = getJdbcTemplate().query(sql,
				new BeanPropertyRowMapper<KeyAccountManager>(KeyAccountManager.class));
		return result;
	}
	
	@Override
	public int getLastKeyAccId() {
		
		String sql = "SELECT max(key_acc_id) from key_account_mng";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}
	
	@Override
	public void updateKeyAccMng(KeyAccountManager keyAccMng) {
		// TODO Auto-generated method stub
		String sql = "update key_account_mng set key_acc_name=?, "
				+ "update_date=now() "
				+ "where key_acc_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[]{
				keyAccMng.getKey_acc_name(),
				keyAccMng.getKey_acc_id()
			});
	}
	
	@Override
	public void createKeyAccMng(KeyAccountManager keyAccMng) {

		String sql = "INSERT INTO key_account_mng VALUES (?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[]{
			keyAccMng.getKey_acc_id(),
			keyAccMng.getKey_acc_name(),
		});
	}
	
	@Override
	public void deleteKeyAccMng(int id) {
		
		String sql = "delete from key_account_mng where key_acc_id = "+id;
		
		getJdbcTemplate().update(sql);
	}

	@Override
	public void updateCustomer(int key_acc_id) {
		String sql = "update customer set key_acc_id=0, "
				+ "update_date=now() "
				+ "where key_acc_id="+key_acc_id;
		
		this.getJdbcTemplate().update(sql);
	}
	
}
