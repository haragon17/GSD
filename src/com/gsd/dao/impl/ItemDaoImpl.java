package com.gsd.dao.impl;

import java.util.List;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.ItemDao;
import com.gsd.model.Item;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

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
	public List<Item> showItem(int proj_id){
		
		String sql = "SELECT item.itm_id, itm_name, itm_desc FROM item\n"
				+ "LEFT JOIN projects_reference proj_ref ON proj_ref.itm_id = item.itm_id\n";
		
		if(proj_id != 0){
			sql += "WHERE proj_id = "+proj_id;
		}
		sql += "\nORDER BY itm_name";
		List<Item> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Item>(Item.class));
		return result;
	}

	@Override
	public int getLastItemId() {
		
		String sql = "SELECT max(itm_id) from item";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}
	
	public int getLastAuditId() {
		
		String sql = "SELECT max(aud_id) from audit_logging";
		
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

	@Override
	public void updateItem(Item itm) {
		
		Item itm_audit = new Item();
		itm_audit = getJdbcTemplate().queryForObject("select * from item where itm_id="+itm.getItm_id(), new BeanPropertyRowMapper<Item>(Item.class));
		
		String sql = "update item set itm_name=?, "
				+ "itm_desc=?, "
				+ "update_date=now() "
				+ "where itm_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[]{
				itm.getItm_name(),
				itm.getItm_desc(),
				itm.getItm_id()
			});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		if(!itm_audit.getItm_desc().equals(itm.getItm_desc())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
				itm.getItm_id(),
				"Item List",
				user.getUserModel().getUsr_name(),
				"Item Description",
				itm_audit.getItm_desc(),
				itm.getItm_desc(),
				"Updated",
				itm.getItm_name()
			});
		}
		
		if(!itm_audit.getItm_name().equals(itm.getItm_name())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
				itm.getItm_id(),
				"Item List",
				user.getUserModel().getUsr_name(),
				"Item Name",
				itm_audit.getItm_name(),
				itm.getItm_name(),
				"Updated",
				itm.getItm_name()
			});
		}
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
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				
				itm.getItm_id(),
				"Item List",
				user.getUserModel().getUsr_name(),
				"Created row on Item List name="+itm.getItm_name()+", item_desc="+itm.getItm_desc(),
				itm.getItm_name()
		});
	}

	@Override
	public void deleteItem(int id) {
		
		Item itm = new Item();
		itm = getJdbcTemplate().queryForObject("select * from item where itm_id="+id, new BeanPropertyRowMapper<Item>(Item.class));
		
		String sql = "delete from item where itm_id = "+id;
		
		getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				
				id,
				"Item List",
				user.getUserModel().getUsr_name(),
				"Deleted all Item name="+itm.getItm_name()+", item_desc="+itm.getItm_desc(),
				itm.getItm_name()
		});
	}

	@Override
	public Item findByItmName(String itm_name) {
		String sql = "select * from item where lower(itm_name) = lower('"+itm_name+"')";
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Item>(Item.class));
	}

}
