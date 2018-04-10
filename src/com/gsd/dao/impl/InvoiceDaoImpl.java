package com.gsd.dao.impl;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import com.gsd.dao.InvoiceDao;
import com.gsd.model.Invoice;
import com.gsd.model.InvoiceCompany;
import com.gsd.model.InvoiceReference;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class InvoiceDaoImpl extends JdbcDaoSupport implements InvoiceDao {

	@Override
	public List<Invoice> searchInvoice(Map<String, String> data) {
		
		String sql = "SELECT inv_id, inv_number, inv_name, inv.inv_company_id, inv_proj_no, inv_bill_date, inv_delivery_date, inv_payment_terms, inv_vat, inv_bill_type, inv.cus_id, inv.cretd_usr, inv_comp.inv_company_name, inv_comp.inv_company_code, cus.cus_name, cus.cus_code, users.usr_name\n"+
				"FROM invoice inv\n"+
				"LEFT JOIN invoice_company inv_comp ON inv_comp.inv_company_id = inv.inv_company_id\n"+
				"LEFT JOIN customer cus ON cus.cus_id = inv.cus_id\n"+
				"LEFT JOIN users ON users.usr_id = inv.cretd_usr\n"+
				"ORDER BY inv_id DESC";
		
		List<Invoice> inv = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Invoice>(Invoice.class));
		return inv;
	}
	
	public List<InvoiceReference> searchInvoiceReference(int id){
		
		String sql = "SELECT inv_ref.*, proj_ref.proj_id, proj_ref.topix_article_id, proj.proj_name, cast((inv_ref_price*inv_ref_qty) as numeric(9,2)) as total_amount FROM invoice_reference inv_ref "
				+ "LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = inv_ref.proj_ref_id "
				+ "LEFT JOIN projects proj ON proj.proj_id = proj_ref.proj_id "
				+ "WHERE inv_id="+id
				+ " ORDER BY order_by ASC";
		
		List<InvoiceReference> inv_ref = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<InvoiceReference>(InvoiceReference.class));
		return inv_ref;
	}
	
	@Override
	public List<InvoiceCompany> showInvoiceCompany() {
		
		String sql = "SELECT * FROM invoice_company ORDER BY inv_company_id";
		
		List<InvoiceCompany> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<InvoiceCompany>(InvoiceCompany.class));
		return result;
	}

	@Override
	public int addInvoice(Invoice inv) {
		
		SimpleDateFormat sdf = new SimpleDateFormat("yy");
		String delivery_year = sdf.format(inv.getInv_delivery_date_sql());
		InvoiceCompany inv_company = getInvoiceCompanyById(inv.getInv_company_id());
		String inv_number = inv_company.getInv_company_code()+delivery_year;
		String last_inv_number = "";
		try{
			last_inv_number = getLastInvoiceNumber(inv.getInv_company_id(),delivery_year);
		}catch(Exception e){
			System.out.println("First job of "+inv_company.getInv_company_name());
		}
		if(last_inv_number == ""){
			inv_number += "00001";
		}else{
			String inv_number_count = last_inv_number.substring(last_inv_number.length()-5);
			String myLast = "";
			for(int x=0; x<inv_number_count.length(); x++){
				String myChar = inv_number_count.substring(x,x+1);
				if(!myChar.equals("0")){
					myLast = inv_number_count.substring(x);
					break;
				}
			}
			int praseNumber = Integer.parseInt(myLast)+1;
			String new_inv_number = Integer.toString(praseNumber);
			int charCount = 5-new_inv_number.length();
			for(int i=0; i<charCount; i++){
				inv_number += "0";
			}
			inv_number += new_inv_number;
		}
		System.out.println("Invoice Number : "+inv_number);
		
		String sql = "INSERT INTO invoice VALUES (default,?,?,?,?,?,?,?,?,?,?,0,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] {
			inv_number,
			inv.getInv_name(),
			inv.getInv_company_id(),
			inv.getInv_proj_no(),
			inv.getInv_bill_date_sql(),
			inv.getInv_delivery_date_sql(),
			inv.getInv_payment_terms(),
			inv.getInv_vat(),
			inv.getInv_bill_type(),
			inv.getCus_id(),
			inv.getCretd_usr()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		Invoice inv_audit = getInvoiceByNumber(inv_number);
		Date parsed_delivery_date = inv.getInv_delivery_date_sql();
		SimpleDateFormat dateFormat = new SimpleDateFormat("MM/yy");
		String delivery_date = dateFormat.format(parsed_delivery_date);
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (?,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				inv_audit.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Created Invoice name="+inv.getInv_name()+" on Company name="+inv_company.getInv_company_name()+", customer="+inv_audit.getCus_name()
				+", inv_proj_no="+inv.getInv_proj_no()+", inv_delivery_date="+delivery_date+", inv_payment_terms="+inv.getInv_payment_terms()
				+", inv_vat="+inv.getInv_vat()+", inv_bill_type="+inv.getInv_bill_type(),
				inv.getInv_name()
		});
		
		return inv_audit.getInv_id();
		
	}
	
	@Override
	public void addInvoiceReference(InvoiceReference inv_ref, Map<String, Float> map) {
		
		String order_by_sql = "SELECT count(inv_ref_id) FROM invoice_reference WHERE inv_id="+inv_ref.getInv_id();
		int order_by = this.getJdbcTemplate().queryForInt(order_by_sql)+1;
		
		String sql = "INSERT INTO invoice_reference VALUES (default,?,?,?,?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] {
				inv_ref.getInv_id(),
				inv_ref.getProj_ref_id(),
				inv_ref.getInv_itm_name(),
				inv_ref.getInv_ref_price(),
				inv_ref.getInv_ref_qty(),
				inv_ref.getInv_ref_currency(),
				inv_ref.getInv_ref_desc(),
				inv_ref.getCretd_usr(),
				order_by
		});
		
		Invoice inv = getInvoiceById(inv_ref.getInv_id());
		List<InvoiceReference> inv_refLs = searchInvoiceReference(inv_ref.getInv_id());
		BigDecimal total_price = BigDecimal.ZERO;
		for(int i=0; i<inv_refLs.size(); i++){
			BigDecimal price = inv_refLs.get(i).getInv_ref_price().multiply(inv_refLs.get(i).getInv_ref_qty());
			float vat = (inv.getInv_vat().floatValue() / 100)+1;
			price = price.multiply(new BigDecimal(vat));
			total_price = total_price.add(price);
		}
		String currency = inv_refLs.get(0).getInv_ref_currency();
		if(currency.equals("EUR")){
			System.out.println(String.format("%.2f", total_price)+" EUR");
		}else{
			float convert_eur = map.get("EUR") / map.get(currency);
			float total_eur = total_price.floatValue() * convert_eur;
			System.out.println(String.format("%.2f", total_price) + " " + currency + " = " + String.format("%.2f", total_eur)+ " EUR");
			total_price = new BigDecimal(total_eur);
		}
		
		String sql_total = "UPDATE invoice SET inv_total_price_eur="+String.format("%.2f", total_price)+" WHERE inv_id="+inv_ref.getInv_id();
		this.getJdbcTemplate().update(sql_total);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int inv_ref_id = getLastInvoiceReferenceIdByInvoiceId(inv_ref.getInv_id());
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (?,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				inv_ref_id,
				"Invoice Reference:"+inv.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Created Invoice Item name="+inv_ref.getInv_itm_name()+" on Invoice name="+inv.getInv_name()+", price="+inv_ref.getInv_ref_price()
				+", currency="+inv_ref.getInv_ref_currency()+", inv_ref_qty="+inv_ref.getInv_ref_qty()+", inv_ref_desc="+inv_ref.getInv_ref_desc(),
				inv.getInv_name()+" : "+inv_ref.getInv_itm_name()
		});
	}
	
	@Override
	public void updateInvoice(Invoice inv, Map<String, Float> map) {
		
		Invoice inv_audit = getInvoiceById(inv.getInv_id());
		
		String sql = "UPDATE invoice SET "
				+ "inv_name=?, "
				+ "inv_proj_no=?, "
				+ "inv_bill_date=?, "
				+ "inv_delivery_date=?, "
				+ "inv_payment_terms=?, "
				+ "inv_vat=?, "
				+ "inv_bill_type=?, "
				+ "cus_id=?, "
				+ "update_date=now() "
				+ "WHERE inv_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] {
			inv.getInv_name(),
			inv.getInv_proj_no(),
			inv.getInv_bill_date_sql(),
			inv.getInv_delivery_date_sql(),
			inv.getInv_payment_terms(),
			inv.getInv_vat(),
			inv.getInv_bill_type(),
			inv.getCus_id(),
			inv.getInv_id()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		Invoice inv_new = getInvoiceById(inv.getInv_id());
		
//		if(inv_audit.getInv_delivery_date() == null){
//			if(inv_new.getInv_delivery_date() != null){
//				Date parsed_delivery_date = inv_new.getInv_delivery_date_sql();
//				SimpleDateFormat dateFormat = new SimpleDateFormat("MM/yy");
//				String delivery_date = dateFormat.format(parsed_delivery_date);
//				String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
//				this.getJdbcTemplate().update(audit, new Object[]{
//					getLastAuditId(),
//					inv_new.getInv_id(),
//					"Invoice",
//					user.getUserModel().getUsr_name(),
//					"Delivery Date",
//					inv_audit.getInv_delivery_date(),
//					inv_new.getInv_delivery_date(),
//					"Updated",
//					inv_new.getInv_name()
//				});
//			}
//		}
//		else 
		if(!inv_audit.getInv_delivery_date().equals(inv_new.getInv_delivery_date())){
//			Date parsed_delivery_date_audit = inv_audit.getInv_delivery_date_sql();
//			Date parsed_delivery_date_new = inv_new.getInv_delivery_date_sql();
//			SimpleDateFormat dateFormat = new SimpleDateFormat("MM/yy");
//			String delivery_date_new = dateFormat.format(parsed_delivery_date_new);
//			String delivery_date_audit = dateFormat.format(parsed_delivery_date_audit);
			
			String year_new = inv_new.getInv_delivery_date().substring(2, 4);
			String month_new = inv_new.getInv_delivery_date().substring(5, 7);
			String delivery_date_new = month_new+"/"+year_new;
			String year_audit = inv_audit.getInv_delivery_date().substring(2, 4);
			String month_audit = inv_audit.getInv_delivery_date().substring(5, 7);		
			String delivery_date_audit = month_audit+"/"+year_audit;
			
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				inv_new.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Delivery Date",
				delivery_date_audit,
				delivery_date_new,
				"Updated",
				inv_new.getInv_name()
			});
		}
		
		if(inv_audit.getCus_id() != inv_new.getCus_id()){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				inv_new.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Customer",
				inv_audit.getCus_name(),
				inv_new.getCus_name(),
				"Updated",
				inv_new.getInv_name()
			});
			
			String del_item = "DELETE FROM invoice_reference WHERE inv_id="+inv_new.getInv_id();
			this.getJdbcTemplate().update(del_item);
			
			String audit_del = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (?,?,?,?,now(),?,?)";
			this.getJdbcTemplate().update(audit_del, new Object[]{
					getLastAuditId(),
					inv_new.getInv_id(),
					"Invoice",
					user.getUserModel().getUsr_name(),
					"Delete all Items from Invoice name="+inv_new.getInv_name(),
					inv.getInv_name()
			});
			
			String sql_total = "UPDATE invoice SET inv_total_price_eur=0.00 WHERE inv_id="+inv.getInv_id();
			this.getJdbcTemplate().update(sql_total);
		}
		
		if(!inv_audit.getInv_bill_type().equals(inv_new.getInv_bill_type())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				inv_new.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Billing Type",
				inv_audit.getInv_bill_type(),
				inv_new.getInv_bill_type(),
				"Updated",
				inv_new.getInv_name()
			});
		}
		
		if(inv_audit.getInv_vat().compareTo(inv_new.getInv_vat()) != 0){
			
			List<InvoiceReference> inv_refLs = searchInvoiceReference(inv.getInv_id());
			BigDecimal total_price = BigDecimal.ZERO;
			for(int i=0; i<inv_refLs.size(); i++){
				BigDecimal price = inv_refLs.get(i).getInv_ref_price().multiply(inv_refLs.get(i).getInv_ref_qty());
				float vat = (inv.getInv_vat().floatValue() / 100)+1;
				price = price.multiply(new BigDecimal(vat));
				total_price = total_price.add(price);
			}
			String currency = inv_refLs.get(0).getInv_ref_currency();
			if(currency.equals("EUR")){
				System.out.println(String.format("%.2f", total_price)+" EUR");
			}else{
				float convert_eur = map.get("EUR") / map.get(currency);
				float total_eur = total_price.floatValue() * convert_eur;
				System.out.println(String.format("%.2f", total_price) + " " + currency + " = " + String.format("%.2f", total_eur)+ " EUR");
				total_price = new BigDecimal(total_eur);
			}
			
			String sql_total = "UPDATE invoice SET inv_total_price_eur="+String.format("%.2f", total_price)+" WHERE inv_id="+inv.getInv_id();
			this.getJdbcTemplate().update(sql_total);
			
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				inv_new.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Vat(%)",
				inv_audit.getInv_vat(),
				inv_new.getInv_vat(),
				"Updated",
				inv_new.getInv_name()
			});
		}
		
		if(inv_audit.getInv_payment_terms() != inv_new.getInv_payment_terms()){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				inv_new.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Payment Term",
				inv_audit.getInv_payment_terms(),
				inv_new.getInv_payment_terms(),
				"Updated",
				inv_new.getInv_name()
			});
		}
		
		if(!inv_audit.getInv_proj_no().equals(inv_new.getInv_proj_no())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				inv_new.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Project Number",
				inv_audit.getInv_proj_no(),
				inv_new.getInv_proj_no(),
				"Updated",
				inv_new.getInv_name()
			});
		}
		
		if(!inv_audit.getInv_name().equals(inv_new.getInv_name())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				inv_new.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Subject",
				inv_audit.getInv_name(),
				inv_new.getInv_name(),
				"Updated",
				inv_new.getInv_name()
			});
		}
	}

	@Override
	public void updateInvoicereference(InvoiceReference inv_ref, Map<String, Float> map) {
		
		InvoiceReference inv_ref_audit = getInvoiceReferenceById(inv_ref.getInv_ref_id());
		
		String sql = "UPDATE invoice_reference SET "
				+ "proj_ref_id=?, "
				+ "inv_itm_name=?, "
				+ "inv_ref_price=?, "
				+ "inv_ref_qty=?, "
				+ "inv_ref_currency=?, "
				+ "inv_ref_desc=?, "
				+ "update_date=now() "
				+ "WHERE inv_ref_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] {
				inv_ref.getProj_ref_id(),
				inv_ref.getInv_itm_name(),
				inv_ref.getInv_ref_price(),
				inv_ref.getInv_ref_qty(),
				inv_ref.getInv_ref_currency(),
				inv_ref.getInv_ref_desc(),
				inv_ref.getInv_ref_id()
		});
		
		Invoice inv = getInvoiceById(inv_ref.getInv_id());
		List<InvoiceReference> inv_refLs = searchInvoiceReference(inv_ref.getInv_id());
		BigDecimal total_price = BigDecimal.ZERO;
		for(int i=0; i<inv_refLs.size(); i++){
			BigDecimal price = inv_refLs.get(i).getInv_ref_price().multiply(inv_refLs.get(i).getInv_ref_qty());
			float vat = (inv.getInv_vat().floatValue() / 100)+1;
			price = price.multiply(new BigDecimal(vat));
			total_price = total_price.add(price);
		}
		String currency = inv_refLs.get(0).getInv_ref_currency();
		if(currency.equals("EUR")){
			System.out.println(String.format("%.2f", total_price)+" EUR");
		}else{
			float convert_eur = map.get("EUR") / map.get(currency);
			float total_eur = total_price.floatValue() * convert_eur;
			System.out.println(String.format("%.2f", total_price) + " " + currency + " = " + String.format("%.2f", total_eur)+ " EUR");
			total_price = new BigDecimal(total_eur);
		}
		
		String sql_total = "UPDATE invoice SET inv_total_price_eur="+String.format("%.2f", total_price)+" WHERE inv_id="+inv_ref.getInv_id();
		this.getJdbcTemplate().update(sql_total);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		InvoiceReference invRef_new = getInvoiceReferenceById(inv_ref.getInv_ref_id());
		
		if(!inv_ref_audit.getInv_ref_desc().equals(invRef_new.getInv_ref_desc())){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				invRef_new.getInv_ref_id(),
				"Invoice Reference:"+invRef_new.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Description",
				inv_ref_audit.getInv_ref_desc(),
				invRef_new.getInv_ref_desc(),
				"Updated",
				invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
			});
		}
		
		if(inv_ref_audit.getInv_ref_qty().compareTo(invRef_new.getInv_ref_qty()) != 0){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				invRef_new.getInv_ref_id(),
				"Invoice Reference:"+invRef_new.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Qty",
				inv_ref_audit.getInv_ref_qty(),
				invRef_new.getInv_ref_qty(),
				"Updated",
				invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
			});
		}
		
		if(inv_ref_audit.getInv_ref_price().compareTo(invRef_new.getInv_ref_price()) != 0){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				invRef_new.getInv_ref_id(),
				"Invoice Reference:"+invRef_new.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Price",
				inv_ref_audit.getInv_ref_price()+" "+inv_ref_audit.getInv_ref_currency(),
				invRef_new.getInv_ref_price()+" "+invRef_new.getInv_ref_currency(),
				"Updated",
				invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
			});
		}
		
		if(inv_ref_audit.getProj_ref_id() != invRef_new.getProj_ref_id()){
			String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				invRef_new.getInv_ref_id(),
				"Invoice Reference:"+invRef_new.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Item Name",
				inv_ref_audit.getInv_itm_name(),
				invRef_new.getInv_itm_name(),
				"Updated",
				invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
			});
		}
		
	}
	
	@Override
	public void updateInvoiceReferenceBatch(List<InvoiceReference> invRefLs, Map<String, Float> map) {
		
		UserDetailsApp user = UserLoginDetail.getUser();
		List<InvoiceReference> invRefLs_audit = new ArrayList<InvoiceReference>();
		InvoiceReference invRef = null;
		
		for(int x=0;x<invRefLs.size();x++){
			invRef = getInvoiceReferenceById(invRefLs.get(x).getInv_ref_id());
			invRefLs_audit.add(invRef);
		}
		
		try{
			String sql = "UPDATE invoice_reference SET "
					+ "proj_ref_id=?, "
					+ "inv_itm_name=?, "
					+ "inv_ref_price=?, "
					+ "inv_ref_qty=?, "
					+ "inv_ref_currency=?, "
					+ "inv_ref_desc=?, "
					+ "order_by=?, "
					+ "update_date=now() "
					+ "WHERE inv_ref_id=?";
			
			this.getJdbcTemplate().batchUpdate(sql,new BatchPreparedStatementSetter() {

				@Override
				public void setValues(PreparedStatement ps, int i) throws SQLException {
					InvoiceReference invRef = invRefLs.get(i);
					ps.setInt(1, invRef.getProj_ref_id());
					ps.setString(2, invRef.getInv_itm_name());
					ps.setBigDecimal(3, invRef.getInv_ref_price());
					ps.setBigDecimal(4, invRef.getInv_ref_qty());
					ps.setString(5, invRef.getInv_ref_currency());
					ps.setString(6, invRef.getInv_ref_desc());
					ps.setInt(7, invRef.getOrder_by());
					ps.setInt(8, invRef.getInv_ref_id());
				}
				
				@Override
				public int getBatchSize() {
					return invRefLs.size();
				}
				
			});
			
			for(int y=0; y<invRefLs.size(); y++){
				
				//Update invoice total price in EUR
				Invoice inv = getInvoiceById(invRefLs.get(y).getInv_id());
				List<InvoiceReference> inv_refLs = searchInvoiceReference(invRefLs.get(y).getInv_id());
				BigDecimal total_price = BigDecimal.ZERO;
				for(int i=0; i<inv_refLs.size(); i++){
					BigDecimal price = inv_refLs.get(i).getInv_ref_price().multiply(inv_refLs.get(i).getInv_ref_qty());
					float vat = (inv.getInv_vat().floatValue() / 100)+1;
					price = price.multiply(new BigDecimal(vat));
					total_price = total_price.add(price);
				}
				String currency = inv_refLs.get(0).getInv_ref_currency();
				if(currency.equals("EUR")){
					System.out.println(String.format("%.2f", total_price)+" EUR");
				}else{
					float convert_eur = map.get("EUR") / map.get(currency);
					float total_eur = total_price.floatValue() * convert_eur;
					System.out.println(String.format("%.2f", total_price) + " " + currency + " = " + String.format("%.2f", total_eur)+ " EUR");
					total_price = new BigDecimal(total_eur);
				}
				
				String sql_total = "UPDATE invoice SET inv_total_price_eur="+String.format("%.2f", total_price)+" WHERE inv_id="+invRefLs.get(y).getInv_id();
				this.getJdbcTemplate().update(sql_total);
				//End update
				
				InvoiceReference invRef_new = getInvoiceReferenceById(invRefLs.get(y).getInv_ref_id());
				
				if(!invRefLs_audit.get(y).getInv_ref_desc().equals(invRef_new.getInv_ref_desc())){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						invRef_new.getInv_ref_id(),
						"Invoice Reference:"+invRef_new.getInv_id(),
						user.getUserModel().getUsr_name(),
						"Description",
						invRefLs_audit.get(y).getInv_ref_desc(),
						invRef_new.getInv_ref_desc(),
						"Updated",
						invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
					});
				}
				
				if(invRefLs_audit.get(y).getInv_ref_qty().compareTo(invRef_new.getInv_ref_qty()) != 0){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						invRef_new.getInv_ref_id(),
						"Invoice Reference:"+invRef_new.getInv_id(),
						user.getUserModel().getUsr_name(),
						"Qty",
						invRefLs_audit.get(y).getInv_ref_qty(),
						invRef_new.getInv_ref_qty(),
						"Updated",
						invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
					});
				}
				
				if(invRefLs_audit.get(y).getInv_ref_price().compareTo(invRef_new.getInv_ref_price()) != 0){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						invRef_new.getInv_ref_id(),
						"Invoice Reference:"+invRef_new.getInv_id(),
						user.getUserModel().getUsr_name(),
						"Price",
						invRefLs_audit.get(y).getInv_ref_price()+" "+invRefLs_audit.get(y).getInv_ref_currency(),
						invRef_new.getInv_ref_price()+" "+invRef_new.getInv_ref_currency(),
						"Updated",
						invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
					});
				}
				
				if(invRefLs_audit.get(y).getProj_ref_id() != invRef_new.getProj_ref_id()){
					String audit = "INSERT INTO audit_logging VALUES (?,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						getLastAuditId(),
						invRef_new.getInv_ref_id(),
						"Invoice Reference:"+invRef_new.getInv_id(),
						user.getUserModel().getUsr_name(),
						"Item Name",
						invRefLs_audit.get(y).getInv_itm_name(),
						invRef_new.getInv_itm_name(),
						"Updated",
						invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
					});
				}
				
			}
			
		}catch(Exception e){
			logger.error(e.getMessage());
		}
		
	}
	
	public Invoice getInvoiceByNumber(String inv_number){
		
		String sql = "SELECT * FROM invoice LEFT JOIN customer ON customer.cus_id = invoice.cus_id WHERE inv_number='"+inv_number+"'";
		
		Invoice inv = this.getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Invoice>(Invoice.class));
		
		return inv;
	}
	
	public Invoice getInvoiceById(int id){
		
		String sql = "SELECT invoice.*, cus.cus_name, cus.cus_code, cus.address, cus.topix_cus_id, inv_comp.inv_company_name, inv_comp.inv_company_code FROM invoice "
				+ "LEFT JOIN customer cus ON cus.cus_id = invoice.cus_id "
				+ "LEFT JOIN invoice_company inv_comp ON inv_comp.inv_company_id = invoice.inv_company_id "
				+ "WHERE inv_id="+id;
		
		Invoice inv = this.getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Invoice>(Invoice.class));
		
		return inv;
	}
	
	public InvoiceReference getInvoiceReferenceById(int id){
		
		String sql = "SELECT * FROM invoice_reference LEFT JOIN invoice ON invoice.inv_id = invoice_reference.inv_id WHERE inv_ref_id="+id;
		
		InvoiceReference invRef = this.getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<InvoiceReference>(InvoiceReference.class));
		
		return invRef;
	}
	
	public String getLastInvoiceNumber(int inv_company_id, String delivery_date){
		
		String sql = "SELECT inv_number FROM invoice "
				+ "WHERE inv_company_id = "+inv_company_id
				+ " AND EXTRACT(YEAR FROM inv_delivery_date) = '20"+delivery_date+"' "
				+ "ORDER BY inv_id DESC LIMIT 1";
		
		Invoice inv = getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Invoice>(Invoice.class));
		return inv.getInv_number();
	}
	
	public InvoiceCompany getInvoiceCompanyById(int inv_company_id){
		
		String sql = "SELECT * FROM invoice_company WHERE inv_company_id = "+inv_company_id;
		
		InvoiceCompany inv_company = this.getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<InvoiceCompany>(InvoiceCompany.class));
		
		return inv_company;
	}
	
	@Override
	public List<InvoiceReference> getJobItemList(int job_id) {
		
		String sql = "SELECT jobs_reference.proj_ref_id, itm_name as inv_itm_name, sum(amount) as inv_ref_qty, price as inv_ref_price, currency as inv_ref_currency\n"+
				"FROM jobs_reference\n"+
				"LEFT JOIN projects_reference proj_ref on proj_ref.proj_ref_id = jobs_reference.proj_ref_id\n"+
				"LEFT JOIN item itm on itm.itm_id = proj_ref.itm_id\n"+
				"WHERE job_id="+job_id+"\n"+
				"GROUP BY jobs_reference.proj_ref_id, inv_itm_name, price, currency";
		
		List<InvoiceReference> inv_ref = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<InvoiceReference>(InvoiceReference.class));
		return inv_ref;
	}

	public int getLastInvoiceReferenceIdByInvoiceId(int inv_id) {
		
		String sql = "SELECT max(inv_ref_id) from invoice_reference WHERE inv_id="+inv_id;
		
		int id = getJdbcTemplate().queryForInt(sql);
		return id;
	}
	
	public int getLastAuditId() {
		
		String sql = "SELECT max(aud_id) from audit_logging";
		
		int id = getJdbcTemplate().queryForInt(sql);
		return id+1;
	}
	
	public InvoiceReference getDataFromJson(Object data) {
		// TODO Auto-generated method stub
		JSONObject jsonObject = JSONObject.fromObject(data);
		InvoiceReference invRef = (InvoiceReference) JSONObject.toBean(jsonObject, InvoiceReference.class);
		return invRef;
	}
	
	public List<InvoiceReference> getListDataFromJson(Object data) {
		// TODO Auto-generated method stub
		JSONArray jsonArray = JSONArray.fromObject(data);
		List<InvoiceReference> invRefLs = (List<InvoiceReference>) JSONArray.toCollection(jsonArray,InvoiceReference.class);
		return invRefLs;
	}

	public List<InvoiceReference> getListDataFromRequest(Object data) {
		// TODO Auto-generated method stub
		List<InvoiceReference> invRefLs;

		//it is an array - have to cast to array object
		if (data.toString().indexOf('[') > -1){

			invRefLs = getListDataFromJson(data);

		} else { //it is only one object - cast to object/bean

			InvoiceReference invRef = getDataFromJson(data);

			invRefLs = new ArrayList<InvoiceReference>();
			invRefLs.add(invRef);

		}

		return invRefLs;
	}

	@Override
	public void deleteInvoice(int id) {
		
		Invoice inv_audit = getInvoiceById(id);
		
		String sql = "DELETE FROM invoice WHERE inv_id="+id;
		this.getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (?,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				id,
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Deleted all items From Invoice name="+inv_audit.getInv_name()+" on Company name="+inv_audit.getInv_company_name(),
				inv_audit.getInv_name()
		});
		
	}
	
	@Override
	public void deleteInvoiceReference(int id) {
		
		InvoiceReference inv_ref_audit = getInvoiceReferenceById(id);
		
		String sql = "DELETE FROM invoice_reference WHERE inv_ref_id="+id;
		this.getJdbcTemplate().update(sql);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (?,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				getLastAuditId(),
				id,
				"Invoice Reference:"+inv_ref_audit.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Deleted Item name="+inv_ref_audit.getInv_itm_name()+" on Invoice Name="+inv_ref_audit.getInv_name(),
				inv_ref_audit.getInv_name()+" : "+inv_ref_audit.getInv_itm_name()
		});
		
	}

}
