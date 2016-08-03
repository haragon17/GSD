package com.gsd.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.CustomerDao;
import com.gsd.model.Customer;
import com.gsd.model.KeyAccountManager;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

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
		
		Customer cus_audit = new Customer();
		cus_audit = getJdbcTemplate().queryForObject("select * from customer where cus_id ="+cus.getCus_id(), new BeanPropertyRowMapper<Customer>(Customer.class));
		KeyAccountManager key_acc_audit = new KeyAccountManager();
		key_acc_audit = getJdbcTemplate().queryForObject("select * from key_account_mng where key_acc_id ="+cus_audit.getKey_acc_id(), new BeanPropertyRowMapper<KeyAccountManager>(KeyAccountManager.class));
		KeyAccountManager key_acc = new KeyAccountManager();
		key_acc = getJdbcTemplate().queryForObject("select * from key_account_mng where key_acc_id ="+cus.getKey_acc_id(), new BeanPropertyRowMapper<KeyAccountManager>(KeyAccountManager.class));
		
		String sql = "update customer set cus_name=?, "
				+ "cus_code=?, "
				+ "key_acc_id=?, "
				+ "address=?, "
				+ "contact_person=?, "
				+ "cus_email=?, "
				+ "update_date=now(), "
				+ "cus_phone=?, "
				+ "bill_to=?, "
				+ "payment=?, "
				+ "transfer_dtl=? "
				+ "where cus_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[]{
			cus.getCus_name(),
			cus.getCus_code(),
			cus.getKey_acc_id(),
			cus.getAddress(),
			cus.getContact_person(),
			cus.getCus_email(),
			cus.getCus_phone(),
			cus.getBill_to(),
			cus.getPayment(),
			cus.getTransfer_dtl(),
			cus.getCus_id()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		if(!cus_audit.getTransfer_dtl().equals(cus.getTransfer_dtl())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Transfer Detail",
					cus_audit.getTransfer_dtl(),
					cus.getTransfer_dtl(),
					"Updated"
			});
		}
		
		if(!cus_audit.getPayment().equals(cus.getPayment())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Payment",
					cus_audit.getPayment(),
					cus.getPayment(),
					"Updated"
			});
		}
		
		if(!cus_audit.getBill_to().equals(cus.getBill_to())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Bill to",
					cus_audit.getBill_to(),
					cus.getBill_to(),
					"Updated"
			});
		}
		
		if(!cus_audit.getCus_phone().equals(cus.getCus_phone())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Phone",
					cus_audit.getCus_phone(),
					cus.getCus_phone(),
					"Updated"
			});
		}
		
		if(!cus_audit.getCus_email().equals(cus.getCus_email())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"E-Mail",
					cus_audit.getCus_email(),
					cus.getCus_email(),
					"Updated"
			});
		}
		
		if(!cus_audit.getContact_person().equals(cus.getContact_person())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Contact Person",
					cus_audit.getContact_person(),
					cus.getContact_person(),
					"Updated"
			});
		}
		
		if(!cus_audit.getAddress().equals(cus.getAddress())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Address",
					cus_audit.getAddress(),
					cus.getAddress(),
					"Updated"
			});
		}
		
		if(cus_audit.getKey_acc_id() != cus.getKey_acc_id()){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Key Account Manager",
					key_acc_audit.getKey_acc_name(),
					key_acc.getKey_acc_name(),
					"Updated"
			});
		}
		
		if(!cus_audit.getCus_code().equals(cus.getCus_code())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Customer Code",
					cus_audit.getCus_code(),
					cus.getCus_code(),
					"Updated"
			});
		}
		
		if(!cus_audit.getCus_name().equals(cus.getCus_name())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					getLastAuditId(),
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Customer Name",
					cus_audit.getCus_name(),
					cus.getCus_name(),
					"Updated"
			});
		}
		
	}

	@Override
	public int getLastCustomerId() {
		
		String sql = "SELECT max(cus_id) from customer";
		 
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}
	
	public int getLastAuditId() {
		
		String sql = "SELECT max(aud_id) from audit_logging";
		
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}

	@Override
	public void createCustomer(Customer cus) {
		
		String sql = "INSERT INTO customer VALUES (?,?,?,?,?,?,?,now(),now(),?,?,?,?,?)";
		
		this.getJdbcTemplate().update(sql, new Object[]{
			cus.getCus_id(),
			cus.getCus_name(),
			cus.getCus_code(),
			cus.getKey_acc_id(),
			cus.getAddress(),
			cus.getContact_person(),
			cus.getCretd_usr(),
			cus.getCus_email(),
			cus.getCus_phone(),
			cus.getBill_to(),
			cus.getPayment(),
			cus.getTransfer_dtl()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		KeyAccountManager key_acc = new KeyAccountManager();
		key_acc = getJdbcTemplate().queryForObject("select * from key_account_mng where key_acc_id ="+cus.getKey_acc_id(), new BeanPropertyRowMapper<KeyAccountManager>(KeyAccountManager.class));
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc) VALUES (?,?,?,?,now(),?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				cus.getCus_id(),
				"Customer",
				user.getUserModel().getUsr_name(),
				"Created row on Customer name="+cus.getCus_name()+", code="+cus.getCus_code()+", key_account="+key_acc.getKey_acc_name()
				+", address="+cus.getAddress()+", contact_person="+cus.getContact_person()+", e-mail="+cus.getCus_email()
				+", phone="+cus.getCus_phone()+", bill_to="+cus.getBill_to()+", payment="+cus.getPayment()+", transfer_dtl="+cus.getTransfer_dtl()
		});
		
	}

	@Override
	public void deleteCustomer(int id) {

		Customer cus = new Customer();
		cus = getJdbcTemplate().queryForObject("select * from customer where cus_id ="+id, new BeanPropertyRowMapper<Customer>(Customer.class));
		
		String sql = "delete from customer where cus_id = "+id;
		
		getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc) VALUES (?,?,?,?,now(),?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				id,
				"Customer",
				user.getUserModel().getUsr_name(),
				"Deleted row on Customer name="+cus.getCus_name()+", code="+cus.getCus_code()
		});
		
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
