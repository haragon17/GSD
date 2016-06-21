package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.CustomerDao;
import com.gsd.model.Customer;

public class CustomerDaoImpl extends JdbcDaoSupport implements CustomerDao {

	@Override
	public List<Customer> searchCustomer(Map<String, String> data) {

		String sql = "select * from customer,key_account_mng "
				+ "where customer.key_acc_id = key_account_mng.key_acc_id\n";
		
		if(data.get("cus_name")==null || data.get("cus_name").isEmpty()){
		}else{
			sql += "AND cus_name = '"+data.get("cus_name")+"'\n";
		}
		if(data.get("cus_code")==null || data.get("cus_code").isEmpty()){
		}else{
			sql += "AND cus_code = '"+data.get("cus_code")+"'\n";
		}
		if(data.get("key_acc_id")==null || data.get("key_acc_id").isEmpty()){
		}else{
			sql += "AND customer.key_acc_id = "+data.get("key_acc_id")+"\n";
		}
		if(data.get("cus_email")==null || data.get("cus_email").isEmpty()){
		}else{
			sql += "AND customer.cus_email like '%"+data.get("cus_email")+"%'\n";
		}
		
		sql += "ORDER BY cus_name";
		//System.out.println(sql);
		
		List<Customer> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Customer>(Customer.class));
		return result;
	}

	@Override
	public void updateCustomer(Customer cus) {
		String sql = "update customer set cus_name=?, "
				+ "cus_code=?, "
				+ "key_acc_id=?, "
				+ "address=?, "
				+ "contact_person=?, "
				+ "cus_email=?, "
				+ "update_date=now(), "
				+ "cus_phone=? "
				+ "where cus_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[]{
			cus.getCus_name(),
			cus.getCus_code(),
			cus.getKey_acc_id(),
			cus.getAddress(),
			cus.getContact_person(),
			cus.getCus_email(),
			cus.getCus_phone(),
			cus.getCus_id()
		});
		
	}

	@Override
	public int getLastCustomerId() {
		
		String sql = "SELECT max(cus_id) from customer";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

	@Override
	public void createCustomer(Customer cus) {
		
		String sql = "INSERT INTO customer VALUES (?,?,?,?,?,?,?,now(),now(),?,?)";
		
		this.getJdbcTemplate().update(sql, new Object[]{
			cus.getCus_id(),
			cus.getCus_name(),
			cus.getCus_code(),
			cus.getKey_acc_id(),
			cus.getAddress(),
			cus.getContact_person(),
			cus.getCretd_usr(),
			cus.getCus_email(),
			cus.getCus_phone()
		});
		
	}

	@Override
	public void deleteCustomer(int id) {

		String sql = "delete from customer where cus_id = "+id;
		
		getJdbcTemplate().update(sql);
		
	}
	
	public Customer findByCusCode(String cus_code){
		String sql = "select * from customer where cus_code = '"+cus_code+"'";
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Customer>(Customer.class));
	}

	@Override
	public List<Customer> showCustomer() {
		
		String sql = "select * from customer ORDER BY cus_name";

		List<Customer> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Customer>(Customer.class));
		return result;
	}

}
