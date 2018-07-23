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
//		if(data.get("cus_name")==null || data.get("cus_name").isEmpty()){
//		}else{
//			sql += "AND cus_name = '"+data.get("cus_name")+"'\n";
//		}
//		if(data.get("cus_code")==null || data.get("cus_code").isEmpty()){
//		}else{
//			sql += "AND cus_code = '"+data.get("cus_code")+"'\n";
//		}
		if(data.get("cus_id")==null || data.get("cus_id").isEmpty()){
		}else{
			sql += "AND cus_id = "+data.get("cus_id")+"\n";
		}
		if(data.get("key_acc_id")==null || data.get("key_acc_id").isEmpty()){
		}else{
			sql += "AND customer.key_acc_id = "+data.get("key_acc_id")+"\n";
		}
		if(data.get("cus_email")==null || data.get("cus_email").isEmpty()){
		}else{
			sql += "AND customer.cus_email like '%"+data.get("cus_email")+"%'\n";
		}
		
		sql += "ORDER BY lower(cus_name)";
//		System.out.println(sql);
		
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
				+ "billing_terms=?, "
				+ "transfer_dtl=?, "
				+ "regist_date=?, "
				+ "topix_cus_id=?, "
				+ "payment_terms=?, "
				+ "cus_fax=? "
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
			cus.getBilling_terms(),
			cus.getTransfer_dtl(),
			cus.getRegist_date_ts(),
			cus.getTopix_cus_id(),
			cus.getPayment_terms(),
			cus.getCus_fax(),
			cus.getCus_id()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		if(cus_audit.getTopix_cus_id().equals(cus.getTopix_cus_id())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Customer ID(Topix)",
					cus_audit.getTopix_cus_id(),
					cus.getTopix_cus_id(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(cus.getRegist_date_ts() != null){
			if(!cus.getRegist_date_ts().toString().contains(((cus_audit.getRegist_date() == null) ? "no" : cus_audit.getRegist_date()))){
				String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
				this.getJdbcTemplate().update(audit, new Object[]{
						cus.getCus_id(),
						"Customer",
						user.getUserModel().getUsr_name(),
						"Regist Date",
						cus_audit.getRegist_date(),
						cus.getRegist_date_ts().toString(),
						"Updated",
						cus.getCus_name()
				});
			}
		}else{
			if(cus_audit.getRegist_date() != null){
				String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
				this.getJdbcTemplate().update(audit, new Object[]{
						cus.getCus_id(),
						"Customer",
						user.getUserModel().getUsr_name(),
						"Regist Date",
						cus_audit.getRegist_date(),
						"",
						"Updated",
						cus.getCus_name()
				});
			}
		}
		
		if(!cus_audit.getTransfer_dtl().equals(cus.getTransfer_dtl())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Transfer Detail",
					cus_audit.getTransfer_dtl(),
					cus.getTransfer_dtl(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(!cus_audit.getBilling_terms().equals(cus.getBilling_terms())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Billing Terms",
					cus_audit.getBilling_terms(),
					cus.getBilling_terms(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(!cus_audit.getBill_to().equals(cus.getBill_to())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Bill to",
					cus_audit.getBill_to(),
					cus.getBill_to(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(!cus_audit.getCus_phone().equals(cus.getCus_phone())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Phone",
					cus_audit.getCus_phone(),
					cus.getCus_phone(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(!cus_audit.getCus_fax().equals(cus.getCus_fax())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Fax",
					cus_audit.getCus_fax(),
					cus.getCus_fax(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(!cus_audit.getCus_email().equals(cus.getCus_email())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"E-Mail",
					cus_audit.getCus_email(),
					cus.getCus_email(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(!cus_audit.getContact_person().equals(cus.getContact_person())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Contact Person",
					cus_audit.getContact_person(),
					cus.getContact_person(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(!cus_audit.getAddress().equals(cus.getAddress())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Address",
					cus_audit.getAddress(),
					cus.getAddress(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(cus_audit.getKey_acc_id() != cus.getKey_acc_id()){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Key Account Manager",
					key_acc_audit.getKey_acc_name(),
					key_acc.getKey_acc_name(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(!cus_audit.getCus_code().equals(cus.getCus_code())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Customer Code",
					cus_audit.getCus_code(),
					cus.getCus_code(),
					"Updated",
					cus.getCus_name()
			});
		}
		
		if(!cus_audit.getCus_name().equals(cus.getCus_name())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
					cus.getCus_id(),
					"Customer",
					user.getUserModel().getUsr_name(),
					"Customer Name",
					cus_audit.getCus_name(),
					cus.getCus_name(),
					"Updated",
					cus.getCus_name()
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
		
		String sql = "INSERT INTO customer VALUES (?,?,?,?,?,?,?,now(),now(),?,?,?,?,?,?,?,?,?)";
		
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
			cus.getBilling_terms(),
			cus.getTransfer_dtl(),
			cus.getRegist_date_ts(),
			cus.getTopix_cus_id(),
			cus.getPayment_terms(),
			cus.getCus_fax()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		KeyAccountManager key_acc = new KeyAccountManager();
		key_acc = getJdbcTemplate().queryForObject("select * from key_account_mng where key_acc_id ="+cus.getKey_acc_id(), new BeanPropertyRowMapper<KeyAccountManager>(KeyAccountManager.class));
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				cus.getCus_id(),
				"Customer",
				user.getUserModel().getUsr_name(),
				"Created row on Customer name="+cus.getCus_name()+", code="+cus.getCus_code()+", key_account="+key_acc.getKey_acc_name()
				+", address="+cus.getAddress()+", contact_person="+cus.getContact_person()+", e-mail="+cus.getCus_email()
				+", phone="+cus.getCus_phone()+", fax="+cus.getCus_fax()+", bill_to="+cus.getBill_to()+", payment="+cus.getBilling_terms()+", transfer_dtl="+cus.getTransfer_dtl()
				+", regist_date="+((cus.getRegist_date_ts()==null) ? "" : cus.getRegist_date_ts().toString())+", topix_cus_id="+cus.getTopix_cus_id(),
				cus.getCus_name()
		});
		
	}

	@Override
	public void deleteCustomer(int id) {

		Customer cus = new Customer();
		cus = getJdbcTemplate().queryForObject("select * from customer where cus_id ="+id, new BeanPropertyRowMapper<Customer>(Customer.class));
		
		String sql = "delete from customer where cus_id = "+id;
		
		getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				id,
				"Customer",
				user.getUserModel().getUsr_name(),
				"Deleted row on Customer name="+cus.getCus_name()+", code="+cus.getCus_code(),
				cus.getCus_name()
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

	@Override
	public Customer findByCusID(int cus_id) {
		
		String sql = "SELECT * from customer where cus_id = "+cus_id;
		
		return getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Customer>(Customer.class));
	}

}
