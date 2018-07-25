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
import org.springframework.jdbc.support.GeneratedKeyHolder;

import com.gsd.dao.InvoiceDao;
import com.gsd.model.Invoice;
import com.gsd.model.InvoiceCompany;
import com.gsd.model.InvoiceReference;
import com.gsd.model.Reference;
import com.gsd.model.Topix;
import com.gsd.model.TopixConfig;
import com.gsd.model.TopixReference;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;
import com.itextpdf.text.log.SysoCounter;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class InvoiceDaoImpl extends JdbcDaoSupport implements InvoiceDao {

	@Override
	public List<Invoice> searchInvoice(Map<String, String> data) {
		
		String sql = "SELECT inv.inv_id, inv_number, inv_name, inv.inv_company_id, inv_proj_no, inv_bill_date, inv_delivery_date, inv_currency, inv_bill_to, "+
				"inv_payment_terms, inv_vat, inv_bill_type, inv.cus_id, inv.cretd_usr, inv_comp.inv_company_name, inv_comp.inv_company_code, "+
				"cus.cus_name, cus.cus_code, users.usr_name, topix_cus_id,\n"+
				"CASE WHEN x.total_inv_price IS NULL THEN 0 ELSE ROUND((x.total_inv_price-ROUND((x.total_inv_price*inv_discount/100),2))*((inv_vat/100)+1),2) END AS total_inv_price,\n"+
//				"CASE WHEN x.inv_ref_currency IS NULL THEN '' ELSE x.inv_ref_currency END,\n"+
				"CASE WHEN y.count_tpx IS NULL THEN 0 ELSE y.count_tpx END\n"+
				"FROM invoice inv\n"+
				"LEFT JOIN invoice_company inv_comp ON inv_comp.inv_company_id = inv.inv_company_id\n"+
				"LEFT JOIN customer cus ON cus.cus_id = inv.cus_id\n"+
				"LEFT JOIN users ON users.usr_id = inv.cretd_usr\n"+
				"LEFT JOIN (select inv_id, sum(inv_ref_price*inv_ref_qty) as total_inv_price from invoice_reference group by inv_id) x on x.inv_id = inv.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, count(*) AS count_tpx FROM invoice_reference inv_ref LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = inv_ref.proj_ref_id WHERE topix_article_id = '' GROUP BY inv_id) y on y.inv_id = inv.inv_id\n"+
				"WHERE inv.inv_id != 0\n";
				
		if(data.get("inv_proj_no")==null || data.get("inv_proj_no").isEmpty()){
		}else{
			sql += "AND LOWER(inv.inv_proj_no) LIKE LOWER('%"+data.get("inv_proj_no")+"%')\n";
		}
		if(data.get("inv_company_id")==null || data.get("inv_company_id").isEmpty()){
		}else{
			sql += "AND inv.inv_company_id = "+data.get("inv_company_id")+"\n";
		}
		if(data.get("inv_cus_id")==null || data.get("inv_cus_id").isEmpty()){
		}else{
			sql += "AND inv.cus_id = "+data.get("inv_cus_id")+"\n";
		}
		if(data.get("inv_bill_type")==null || data.get("inv_bill_type").isEmpty() || data.get("inv_bill_type").equals("All")){
		}else{
			sql += "AND inv.inv_bill_type LIKE '"+data.get("inv_bill_type")+"%'\n";
		}
		if(data.get("delivery_start")==null || data.get("delivery_start").isEmpty()){
			if(data.get("delivery_limit")==null || data.get("delivery_limit").isEmpty()){
			}else{
				sql += "AND inv.inv_delivery_date <= '"+data.get("delivery_limit")+"'\n";
			}
		}else if(data.get("delivery_limit")==null || data.get("delivery_limit").isEmpty()){
			sql += "AND inv.inv_delivery_date >= '"+data.get("delivery_start")+"'\n";
		}else{
			sql += "AND inv.inv_delivery_date BETWEEN '"+data.get("delivery_start")+"' AND '"+data.get("delivery_limit")+"'\n";
		}
		
		sql += "ORDER BY inv.inv_bill_date DESC, inv.inv_id DESC";
		
//		System.out.println(sql);
		
		List<Invoice> inv = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Invoice>(Invoice.class));
		return inv;
	}
	
	public List<InvoiceReference> searchInvoiceReference(int id){
		
		String sql = "SELECT inv_ref.*, invoice.inv_currency, proj_ref.proj_id, proj_ref.topix_article_id, proj.proj_name, proj.proj_currency, cast((inv_ref_price*inv_ref_qty) as numeric(9,2)) as total_amount FROM invoice_reference inv_ref "
				+ "LEFT JOIN invoice ON invoice.inv_id = inv_ref.inv_id "
				+ "LEFT JOIN projects_reference proj_ref ON proj_ref.proj_ref_id = inv_ref.proj_ref_id "
				+ "LEFT JOIN projects proj ON proj.proj_id = proj_ref.proj_id "
				+ "WHERE inv_ref.inv_id="+id
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
	public List<Invoice> showInvoiceCustomer(int cus_id, String month, String year) {
		
		String sql = "SELECT inv_id,inv_name FROM invoice WHERE EXTRACT(MONTH FROM inv_delivery_date) = '"+month+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND cus_id = "+cus_id;
		
		List<Invoice> result = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Invoice>(Invoice.class));
		return result;
	}
	
	@Override
	public int addInvoice(Invoice inv) {
		
//		SimpleDateFormat sdf = new SimpleDateFormat("yy");
//		String delivery_year = sdf.format(inv.getInv_delivery_date_sql());
//		InvoiceCompany inv_company = getInvoiceCompanyById(inv.getInv_company_id());
//		String inv_number = inv_company.getInv_company_code()+delivery_year;
//		String last_inv_number = "";
//		try{
//			last_inv_number = getLastInvoiceNumber(inv.getInv_company_id(),delivery_year);
//		}catch(Exception e){
//			System.out.println("First job of "+inv_company.getInv_company_name());
//		}
//		if(last_inv_number == ""){
//			inv_number += "00001";
//		}else{
//			String inv_number_count = last_inv_number.substring(last_inv_number.length()-5);
//			String myLast = "";
//			for(int x=0; x<inv_number_count.length(); x++){
//				String myChar = inv_number_count.substring(x,x+1);
//				if(!myChar.equals("0")){
//					myLast = inv_number_count.substring(x);
//					break;
//				}
//			}
//			int praseNumber = Integer.parseInt(myLast)+1;
//			String new_inv_number = Integer.toString(praseNumber);
//			int charCount = 5-new_inv_number.length();
//			for(int i=0; i<charCount; i++){
//				inv_number += "0";
//			}
//			inv_number += new_inv_number;
//		}
//		System.out.println("Invoice Number : "+inv_number);
//		
//		String sql = "INSERT INTO invoice VALUES (default,?,?,?,?,?,?,?,?,?,?,0,?,now(),now(),0)";
//		
//		this.getJdbcTemplate().update(sql, new Object[] {
//			inv_number,
//			inv.getInv_name(),
//			inv.getInv_company_id(),
//			inv.getInv_proj_no(),
//			inv.getInv_bill_date_sql(),
//			inv.getInv_delivery_date_sql(),
//			inv.getInv_payment_terms(),
//			inv.getInv_vat(),
//			inv.getInv_bill_type(),
//			inv.getCus_id(),
//			inv.getCretd_usr(),
//		});
		
		String sql = "INSERT INTO invoice VALUES (default,?,?,?,?,?,?,?,?,?,?,0,?,now(),now(),0,?,?)";
		GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
		String id_column = "inv_id";
		
		this.getJdbcTemplate().update(con -> {
		    PreparedStatement ps = con.prepareStatement(sql, new String[]{id_column});
		    ps.setString(1, "");
		    ps.setString(2, inv.getInv_name());
		    ps.setInt(3, inv.getInv_company_id());
		    ps.setString(4, inv.getInv_proj_no());
		    ps.setDate(5, inv.getInv_bill_date_sql());
		    ps.setDate(6, inv.getInv_delivery_date_sql());
		    ps.setInt(7, inv.getInv_payment_terms());
		    ps.setBigDecimal(8, inv.getInv_vat());
		    ps.setString(9, inv.getInv_bill_type());
		    ps.setInt(10, inv.getCus_id());
		    ps.setInt(11, inv.getCretd_usr());
		    ps.setString(12, inv.getInv_bill_to());
		    ps.setString(13, inv.getInv_currency());
		    return ps;
		  }
		  , keyHolder);
		
		int inv_id = (Integer) keyHolder.getKeys().get(id_column);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		Invoice inv_audit = getInvoiceById(inv_id);
		Date parsed_delivery_date = inv.getInv_delivery_date_sql();
		SimpleDateFormat dateFormat = new SimpleDateFormat("MM/yy");
		String delivery_date = dateFormat.format(parsed_delivery_date);
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				
				inv_audit.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Created Invoice name="+inv.getInv_name()+" on Company name="+inv.getInv_company_name()+", customer="+inv_audit.getCus_name()
				+", inv_proj_no="+inv.getInv_proj_no()+", inv_delivery_date="+delivery_date+", inv_payment_terms="+inv.getInv_payment_terms()
				+", inv_vat="+inv.getInv_vat()+", bill_to="+inv.getInv_bill_to()+", currency="+inv.getInv_currency(),
				inv.getInv_name()
		});
		
		return inv_id;
		
	}
	
	@Override
	public void addInvoiceReference(InvoiceReference inv_ref, Map<String, Float> map) {
		
		String order_by_sql = "SELECT count(inv_ref_id) FROM invoice_reference WHERE inv_id="+inv_ref.getInv_id();
		int order_by = this.getJdbcTemplate().queryForInt(order_by_sql)+1;
		
		String sql = "INSERT INTO invoice_reference VALUES (default,?,?,?,?,?,?,?,?,now(),now())";
		
		this.getJdbcTemplate().update(sql, new Object[] {
				inv_ref.getInv_id(),
				inv_ref.getProj_ref_id(),
				inv_ref.getInv_itm_name(),
				inv_ref.getInv_ref_price(),
				inv_ref.getInv_ref_qty(),
				inv_ref.getInv_ref_desc(),
				inv_ref.getCretd_usr(),
				order_by
		});
		
		Invoice inv = getInvoiceById(inv_ref.getInv_id());
		List<InvoiceReference> inv_refLs = searchInvoiceReference(inv_ref.getInv_id());
		BigDecimal total_price = BigDecimal.ZERO;
		BigDecimal negative_price = BigDecimal.ZERO;
		for(int i=0; i<inv_refLs.size(); i++){
			BigDecimal price = inv_refLs.get(i).getInv_ref_price().multiply(inv_refLs.get(i).getInv_ref_qty());
			if(price.floatValue() >= 0){
				BigDecimal vat = (inv.getInv_vat().divide(new BigDecimal(100))).add(new BigDecimal(1));
				price = price.multiply(vat);
				total_price = total_price.add(price);
			}else{
				negative_price = negative_price.add(price);
			}
		}
		total_price = total_price.add(negative_price);
		String currency = inv.getInv_currency();
		if(currency.equals("EUR")){
//			System.out.println(String.format("%.2f", total_price)+" EUR");
		}else{
//			float convert_eur = map.get("EUR") / map.get(currency);
			float total_eur = total_price.floatValue() / map.get(currency);
//			System.out.println(String.format("%.2f", total_price) + " " + currency + " = " + String.format("%.2f", total_eur)+ " EUR");
			total_price = new BigDecimal(total_eur);
		}
		
		String sql_total = "UPDATE invoice SET inv_total_price_eur="+String.format("%.2f", total_price)+" WHERE inv_id="+inv_ref.getInv_id();
		this.getJdbcTemplate().update(sql_total);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int inv_ref_id = getLastInvoiceReferenceIdByInvoiceId(inv_ref.getInv_id());
		
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				
				inv_ref_id,
				"Invoice Reference:"+inv.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Created Invoice Item name="+inv_ref.getInv_itm_name()+" on Invoice name="+inv.getInv_name()+", price="+inv_ref.getInv_ref_price()
				+", inv_ref_qty="+inv_ref.getInv_ref_qty()+", inv_ref_desc="+inv_ref.getInv_ref_desc(),
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
//				+ "inv_bill_type=?, "
				+ "cus_id=?, "
				+ "inv_bill_to=?, "
				+ "inv_currency=?, "
				+ "update_date=now() "
				+ "WHERE inv_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] {
			inv.getInv_name(),
			inv.getInv_proj_no(),
			inv.getInv_bill_date_sql(),
			inv.getInv_delivery_date_sql(),
			inv.getInv_payment_terms(),
			inv.getInv_vat(),
//			inv.getInv_bill_type(),
			inv.getCus_id(),
			inv.getInv_bill_to(),
			inv.getInv_currency(),
			inv.getInv_id()
		});
		
		UserDetailsApp user = UserLoginDetail.getUser();
		Invoice inv_new = getInvoiceById(inv.getInv_id());
		
		if(!inv_audit.getInv_currency().equals(inv_new.getInv_currency())){
			
			List<InvoiceReference> inv_refLs = searchInvoiceReference(inv.getInv_id());
			for(int i=0; i<inv_refLs.size(); i++){
				BigDecimal currency = new BigDecimal(map.get(inv_audit.getInv_currency()));
				BigDecimal new_currency = new BigDecimal(map.get(inv_new.getInv_currency()));
				BigDecimal price = (inv_refLs.get(i).getInv_ref_price().divide(currency, 2, BigDecimal.ROUND_HALF_UP)).multiply(new_currency);
				price = price.setScale(2, BigDecimal.ROUND_HALF_UP);
//				System.out.println("item "+i+" : "+price+" "+inv_new.getInv_currency());
				
				String sql_price = "UPDATE invoice_reference SET inv_ref_price="+price+" WHERE inv_ref_id="+inv_refLs.get(i).getInv_ref_id();
				this.getJdbcTemplate().update(sql_price);
			}
			
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
				inv_new.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Currency",
				inv_audit.getInv_currency(),
				inv_new.getInv_currency(),
				"Updated",
				inv_new.getInv_name()
			});
		}
		
		if(!inv_audit.getInv_bill_to().equals(inv_new.getInv_bill_to())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
				inv_new.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Billing To",
				inv_audit.getInv_bill_to(),
				inv_new.getInv_bill_to(),
				"Updated",
				inv_new.getInv_name()
			});
		}
		
//		if(inv_audit.getInv_delivery_date() == null){
//			if(inv_new.getInv_delivery_date() != null){
//				Date parsed_delivery_date = inv_new.getInv_delivery_date_sql();
//				SimpleDateFormat dateFormat = new SimpleDateFormat("MM/yy");
//				String delivery_date = dateFormat.format(parsed_delivery_date);
//				String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
//				this.getJdbcTemplate().update(audit, new Object[]{
//					
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
			
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
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
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
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
			
			String audit_del = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
			this.getJdbcTemplate().update(audit_del, new Object[]{
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
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
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
		
<<<<<<< HEAD
if(inv_audit.getInv_discount().compareTo(inv_new.getInv_discount()) != 0){
			
			List<InvoiceReference> inv_refLs = searchInvoiceReference(inv.getInv_id());
			BigDecimal total_price = BigDecimal.ZERO;
			for(int i=0; i<inv_refLs.size(); i++){
				BigDecimal price = inv_refLs.get(i).getInv_ref_price().multiply(inv_refLs.get(i).getInv_ref_qty());
				total_price = total_price.add(price);
			}
			float discount = 1 - (inv.getInv_discount().floatValue() / 100);
			total_price = total_price.multiply(new BigDecimal(discount));
			float vat = (inv.getInv_vat().floatValue() / 100)+1;
			total_price = total_price.multiply(new BigDecimal(vat));
			String currency = inv_new.getInv_currency();
			if(!currency.equals("EUR")){
				float total_eur = total_price.floatValue() / map.get(currency);
				total_price = new BigDecimal(total_eur);
			}
			
			String sql_total = "UPDATE invoice SET inv_total_price_eur="+String.format("%.2f", total_price)+" WHERE inv_id="+inv.getInv_id();
			this.getJdbcTemplate().update(sql_total);
			
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
				inv_new.getInv_id(),
				"Invoice",
				user.getUserModel().getUsr_name(),
				"Discount(%)",
				inv_audit.getInv_discount(),
				inv_new.getInv_discount(),
				"Updated",
				inv_new.getInv_name()
			});
		}
		
=======
>>>>>>> f934fd2dff8a360d60a176fdc55f9a9290ff4e4b
		if(inv_audit.getInv_vat().compareTo(inv_new.getInv_vat()) != 0){
			
			List<InvoiceReference> inv_refLs = searchInvoiceReference(inv.getInv_id());
			BigDecimal total_price = BigDecimal.ZERO;
			for(int i=0; i<inv_refLs.size(); i++){
				BigDecimal price = inv_refLs.get(i).getInv_ref_price().multiply(inv_refLs.get(i).getInv_ref_qty());
				total_price = total_price.add(price);
			}
			float discount = 1 - (inv.getInv_discount().floatValue() / 100);
			total_price = total_price.multiply(new BigDecimal(discount));
			float vat = (inv.getInv_vat().floatValue() / 100)+1;
			total_price = total_price.multiply(new BigDecimal(vat));
			String currency = inv_new.getInv_currency();
			if(currency.equals("EUR")){
//				System.out.println(String.format("%.2f", total_price)+" EUR");
			}else{
//				float convert_eur = map.get("EUR") / map.get(currency);
				float total_eur = total_price.floatValue() / map.get(currency);
//				System.out.println(String.format("%.2f", total_price) + " " + currency + " = " + String.format("%.2f", total_eur)+ " EUR");
				total_price = new BigDecimal(total_eur);
			}
			
			String sql_total = "UPDATE invoice SET inv_total_price_eur="+String.format("%.2f", total_price)+" WHERE inv_id="+inv.getInv_id();
			this.getJdbcTemplate().update(sql_total);
			
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
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
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
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
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
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
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
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
//				+ "inv_ref_currency=?, "
				+ "inv_ref_desc=?, "
				+ "update_date=now() "
				+ "WHERE inv_ref_id=?";
		
		this.getJdbcTemplate().update(sql, new Object[] {
				inv_ref.getProj_ref_id(),
				inv_ref.getInv_itm_name(),
				inv_ref.getInv_ref_price(),
				inv_ref.getInv_ref_qty(),
//				inv_ref.getInv_ref_currency(),
				inv_ref.getInv_ref_desc(),
				inv_ref.getInv_ref_id()
		});
		
		Invoice inv = getInvoiceById(inv_ref.getInv_id());
		List<InvoiceReference> inv_refLs = searchInvoiceReference(inv_ref.getInv_id());
		BigDecimal total_price = BigDecimal.ZERO;
		BigDecimal negative_price = BigDecimal.ZERO;
		for(int i=0; i<inv_refLs.size(); i++){
			BigDecimal price = inv_refLs.get(i).getInv_ref_price().multiply(inv_refLs.get(i).getInv_ref_qty());
			if(price.floatValue() >= 0){
				BigDecimal vat = (inv.getInv_vat().divide(new BigDecimal(100))).add(new BigDecimal(1));
				price = price.multiply(vat);
				total_price = total_price.add(price);
			}else{
				negative_price = negative_price.add(price);
			}
		}
		total_price = total_price.add(negative_price);
		String currency = inv.getInv_currency();
		if(currency.equals("EUR")){
//			System.out.println(String.format("%.2f", total_price)+" EUR");
		}else{
//			float convert_eur = map.get("EUR") / map.get(currency);
			float total_eur = total_price.floatValue() / map.get(currency);
//			System.out.println(String.format("%.2f", total_price) + " " + currency + " = " + String.format("%.2f", total_eur)+ " EUR");
			total_price = new BigDecimal(total_eur);
		}
		
		String sql_total = "UPDATE invoice SET inv_total_price_eur="+String.format("%.2f", total_price)+" WHERE inv_id="+inv_ref.getInv_id();
		this.getJdbcTemplate().update(sql_total);
		
		UserDetailsApp user = UserLoginDetail.getUser();
		InvoiceReference invRef_new = getInvoiceReferenceById(inv_ref.getInv_ref_id());
		
<<<<<<< HEAD
		if(!inv_ref_audit.getInv_topix_id().equals(invRef_new.getInv_topix_id())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
				invRef_new.getInv_ref_id(),
				"Invoice Reference:"+invRef_new.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Topix ID",
				inv_ref_audit.getInv_topix_id(),
				invRef_new.getInv_topix_id(),
				"Updated",
				invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
			});
		}
		
=======
>>>>>>> f934fd2dff8a360d60a176fdc55f9a9290ff4e4b
		if(!inv_ref_audit.getInv_ref_desc().equals(invRef_new.getInv_ref_desc())){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
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
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
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
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
				invRef_new.getInv_ref_id(),
				"Invoice Reference:"+invRef_new.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Price",
				inv_ref_audit.getInv_ref_price()+" "+inv.getInv_currency(),
				invRef_new.getInv_ref_price()+" "+inv.getInv_currency(),
				"Updated",
				invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
			});
		}
		
		if(inv_ref_audit.getProj_ref_id() != invRef_new.getProj_ref_id()){
			String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
			this.getJdbcTemplate().update(audit, new Object[]{
				
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
		
//		try{
			String sql = "UPDATE invoice_reference SET "
					+ "proj_ref_id=?, "
					+ "inv_itm_name=?, "
					+ "inv_ref_price=?, "
					+ "inv_ref_qty=?, "
//					+ "inv_ref_currency=?, "
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
//					ps.setString(5, invRef.getInv_ref_currency());
					ps.setString(5, invRef.getInv_ref_desc());
					ps.setInt(6, invRef.getOrder_by());
					ps.setInt(7, invRef.getInv_ref_id());
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
				BigDecimal negative_price = BigDecimal.ZERO;
				for(int i=0; i<inv_refLs.size(); i++){
					BigDecimal price = inv_refLs.get(i).getInv_ref_price().multiply(inv_refLs.get(i).getInv_ref_qty());
					if(price.floatValue() >= 0){
						BigDecimal vat = (inv.getInv_vat().divide(new BigDecimal(100))).add(new BigDecimal(1));
						price = price.multiply(vat);
						total_price = total_price.add(price);
					}else{
						negative_price = negative_price.add(price);
					}
				}
				total_price = total_price.add(negative_price);
				String currency = inv.getInv_currency();
				if(currency.equals("EUR")){
//					System.out.println(String.format("%.2f", total_price)+" EUR");
				}else{
//					float convert_eur = map.get("EUR") / map.get(currency);
					float total_eur = total_price.floatValue() / map.get(currency);
//					System.out.println(String.format("%.2f", total_price) + " " + currency + " = " + String.format("%.2f", total_eur)+ " EUR");
					total_price = new BigDecimal(total_eur);
				}
				
				String sql_total = "UPDATE invoice SET inv_total_price_eur="+String.format("%.2f", total_price)+" WHERE inv_id="+invRefLs.get(y).getInv_id();
				this.getJdbcTemplate().update(sql_total);
				//End update
				
				InvoiceReference invRef_new = getInvoiceReferenceById(invRefLs.get(y).getInv_ref_id());
				
<<<<<<< HEAD
				if(!invRefLs_audit.get(y).getInv_topix_id().equals(invRef_new.getInv_topix_id())){
					String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						
						invRef_new.getInv_ref_id(),
						"Invoice Reference:"+invRef_new.getInv_id(),
						user.getUserModel().getUsr_name(),
						"Topix ID",
						invRefLs_audit.get(y).getInv_topix_id(),
						invRef_new.getInv_topix_id(),
						"Updated",
						invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
					});
				}
				
=======
>>>>>>> f934fd2dff8a360d60a176fdc55f9a9290ff4e4b
				if(!invRefLs_audit.get(y).getInv_ref_desc().equals(invRef_new.getInv_ref_desc())){
					String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						
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
					String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						
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
					String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						
						invRef_new.getInv_ref_id(),
						"Invoice Reference:"+invRef_new.getInv_id(),
						user.getUserModel().getUsr_name(),
						"Price",
						invRefLs_audit.get(y).getInv_ref_price()+" "+inv.getInv_currency(),
						invRef_new.getInv_ref_price()+" "+inv.getInv_currency(),
						"Updated",
						invRef_new.getInv_name()+" : "+invRef_new.getInv_itm_name()
					});
				}
				
				if(invRefLs_audit.get(y).getProj_ref_id() != invRef_new.getProj_ref_id()){
					String audit = "INSERT INTO audit_logging VALUES (default,?,?,?,now(),?,?,?,?,?)";
					this.getJdbcTemplate().update(audit, new Object[]{
						
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
			
//		}catch(Exception e){
//			logger.error(e.getMessage());
//		}
		
	}
	
	public Invoice getInvoiceByNumber(String inv_number){
		
		String sql = "SELECT * FROM invoice LEFT JOIN customer ON customer.cus_id = invoice.cus_id WHERE inv_number='"+inv_number+"'";
		
		Invoice inv = this.getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Invoice>(Invoice.class));
		
		return inv;
	}
	
	public Invoice getInvoiceById(int id){
		
		String sql = "SELECT invoice.*, cus.cus_name, cus.cus_code, cus.address, cus.topix_cus_id, cus.bill_to, inv_comp.inv_company_name, inv_comp.inv_company_code, "
				+ "CASE WHEN x.total_inv_price IS NULL THEN 0 ELSE x.total_inv_price END\n"
				+ "FROM invoice "
				+ "LEFT JOIN customer cus ON cus.cus_id = invoice.cus_id "
				+ "LEFT JOIN (select inv_id, sum(inv_ref_price*inv_ref_qty) as total_inv_price from invoice_reference group by inv_id) x on x.inv_id = invoice.inv_id\n"
				+ "LEFT JOIN invoice_company inv_comp ON inv_comp.inv_company_id = invoice.inv_company_id "
				+ "WHERE invoice.inv_id="+id;
		
		Invoice inv = this.getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<Invoice>(Invoice.class));
		
		return inv;
	}
	
	public InvoiceReference getInvoiceReferenceById(int id){
		
		String sql = "SELECT * FROM invoice_reference LEFT JOIN invoice ON invoice.inv_id = invoice_reference.inv_id WHERE inv_ref_id="+id;
		
		InvoiceReference invRef = this.getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<InvoiceReference>(InvoiceReference.class));
		
		return invRef;
	}
	
	public String getLastInvoiceNumber(int inv_company_id, String delivery_date, String inv_bill_type){
		
		String sql = "SELECT inv_number FROM invoice"
				+ " WHERE inv_company_id = "+inv_company_id
				+ " AND EXTRACT(YEAR FROM inv_delivery_date) = '20"+delivery_date+"'"
				+ " AND inv_bill_type = '"+inv_bill_type+"'"
				+ " ORDER BY inv_number DESC LIMIT 1";
		
//		System.out.println(sql);
		
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
		
		String sql = "SELECT jobs_reference.proj_ref_id, itm_name as inv_itm_name, sum(amount) as inv_ref_qty, price as inv_ref_price, proj_currency as inv_currency\n"+
				"FROM jobs_reference\n"+
				"LEFT JOIN projects_reference proj_ref on proj_ref.proj_ref_id = jobs_reference.proj_ref_id\n"+
				"LEFT JOIN projects proj on proj.proj_id = proj_ref.proj_id\n"+
				"LEFT JOIN item itm on itm.itm_id = proj_ref.itm_id\n"+
				"WHERE job_id="+job_id+"\n"+
				"GROUP BY jobs_reference.proj_ref_id, inv_itm_name, price, proj_currency";
		
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
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				
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
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				
				id,
				"Invoice Reference:"+inv_ref_audit.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Deleted Item name="+inv_ref_audit.getInv_itm_name()+" on Invoice Name="+inv_ref_audit.getInv_name(),
				inv_ref_audit.getInv_name()+" : "+inv_ref_audit.getInv_itm_name()
		});
		
	}
	
	@Override
	public List<Invoice> showInvoiceMonthlyReport(String year, int inv_company_id){
		
<<<<<<< HEAD
//		String sql = "SELECT cus_name,\n"+
//				"CASE WHEN sum(jan.sum_price) IS NULL THEN 0 ELSE sum(jan.sum_price) END AS jan,\n"+
//				"CASE WHEN sum(feb.sum_price) IS NULL THEN 0 ELSE sum(feb.sum_price) END AS feb,\n"+
//				"CASE WHEN sum(mar.sum_price) IS NULL THEN 0 ELSE sum(mar.sum_price) END AS mar,\n"+
//				"CASE WHEN sum(apr.sum_price) IS NULL THEN 0 ELSE sum(apr.sum_price) END AS apr,\n"+
//				"CASE WHEN sum(may.sum_price) IS NULL THEN 0 ELSE sum(may.sum_price) END AS may,\n"+
//				"CASE WHEN sum(jun.sum_price) IS NULL THEN 0 ELSE sum(jun.sum_price) END AS jun,\n"+
//				"CASE WHEN sum(jul.sum_price) IS NULL THEN 0 ELSE sum(jul.sum_price) END AS jul,\n"+
//				"CASE WHEN sum(aug.sum_price) IS NULL THEN 0 ELSE sum(aug.sum_price) END AS aug,\n"+
//				"CASE WHEN sum(sep.sum_price) IS NULL THEN 0 ELSE sum(sep.sum_price) END AS sep,\n"+
//				"CASE WHEN sum(oct.sum_price) IS NULL THEN 0 ELSE sum(oct.sum_price) END AS oct,\n"+
//				"CASE WHEN sum(nov.sum_price) IS NULL THEN 0 ELSE sum(nov.sum_price) END AS nov,\n"+
//				"CASE WHEN sum(dec.sum_price) IS NULL THEN 0 ELSE sum(dec.sum_price) END AS dec\n"+
//				"FROM invoice\n"+
//				"LEFT JOIN customer cus ON cus.cus_id = invoice.cus_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'1\' \n"+
//				"GROUP BY inv_id) jan ON jan.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'2\' \n"+
//				"GROUP BY inv_id) feb ON feb.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'3\' \n"+
//				"GROUP BY inv_id) mar ON mar.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'4\' \n"+
//				"GROUP BY inv_id) apr ON apr.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'5\' \n"+
//				"GROUP BY inv_id) may ON may.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'6\' \n"+
//				"GROUP BY inv_id) jun ON jun.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'7\' \n"+
//				"GROUP BY inv_id) jul ON jul.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'8\' \n"+
//				"GROUP BY inv_id) aug ON aug.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'9\' \n"+
//				"GROUP BY inv_id) sep ON sep.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'10\' \n"+
//				"GROUP BY inv_id) oct ON oct.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'11\' \n"+
//				"GROUP BY inv_id) nov ON nov.inv_id = invoice.inv_id\n"+
//				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
//				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'12\' \n"+
//				"GROUP BY inv_id) dec ON dec.inv_id = invoice.inv_id\n"+
//				"WHERE inv_company_id = "+inv_company_id+"\n"+
//				"AND inv_bill_type = '"+inv_bill_type+"'\n"+
//				"GROUP BY cus_name\n"+
//				"ORDER BY cus_name ASC";
		
		String sql = "SELECT cus_name,\n" +
				"CASE \n" +
				"WHEN (sum(jan.sum_price) IS NULL) AND (sum(jan_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(jan.sum_price) IS NOT NULL) AND (sum(jan_c.sum_price) IS NULL) THEN sum(jan.sum_price)\n" +
				"WHEN (sum(jan.sum_price) IS NULL) AND (sum(jan_c.sum_price) IS NOT NULL) THEN (sum(jan_c.sum_price)*-1)\n" +
				"ELSE (sum(jan.sum_price)-sum(jan_c.sum_price)) END AS jan,\n" +
				"CASE \n" +
				"WHEN (sum(feb.sum_price) IS NULL) AND (sum(feb_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(feb.sum_price) IS NOT NULL) AND (sum(feb_c.sum_price) IS NULL) THEN sum(feb.sum_price)\n" +
				"WHEN (sum(feb.sum_price) IS NULL) AND (sum(feb_c.sum_price) IS NOT NULL) THEN (sum(feb_c.sum_price)*-1)\n" +
				"ELSE (sum(feb.sum_price)-sum(feb_c.sum_price)) END AS feb,\n" +
				"CASE \n" +
				"WHEN (sum(mar.sum_price) IS NULL) AND (sum(mar_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(mar.sum_price) IS NOT NULL) AND (sum(mar_c.sum_price) IS NULL) THEN sum(mar.sum_price)\n" +
				"WHEN (sum(mar.sum_price) IS NULL) AND (sum(mar_c.sum_price) IS NOT NULL) THEN (sum(mar_c.sum_price)*-1)\n" +
				"ELSE (sum(mar.sum_price)-sum(mar_c.sum_price)) END AS mar,\n" +
				"CASE \n" +
				"WHEN (sum(apr.sum_price) IS NULL) AND (sum(apr_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(apr.sum_price) IS NOT NULL) AND (sum(apr_c.sum_price) IS NULL) THEN sum(apr.sum_price)\n" +
				"WHEN (sum(apr.sum_price) IS NULL) AND (sum(apr_c.sum_price) IS NOT NULL) THEN (sum(apr_c.sum_price)*-1)\n" +
				"ELSE (sum(apr.sum_price)-sum(apr_c.sum_price)) END AS apr,\n" +
				"CASE \n" +
				"WHEN (sum(may.sum_price) IS NULL) AND (sum(may_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(may.sum_price) IS NOT NULL) AND (sum(may_c.sum_price) IS NULL) THEN sum(may.sum_price)\n" +
				"WHEN (sum(may.sum_price) IS NULL) AND (sum(may_c.sum_price) IS NOT NULL) THEN (sum(may_c.sum_price)*-1)\n" +
				"ELSE (sum(may.sum_price)-sum(may_c.sum_price)) END AS may,\n" +
				"CASE \n" +
				"WHEN (sum(jun.sum_price) IS NULL) AND (sum(jun_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(jun.sum_price) IS NOT NULL) AND (sum(jun_c.sum_price) IS NULL) THEN sum(jun.sum_price)\n" +
				"WHEN (sum(jun.sum_price) IS NULL) AND (sum(jun_c.sum_price) IS NOT NULL) THEN (sum(jun_c.sum_price)*-1)\n" +
				"ELSE (sum(jun.sum_price)-sum(jun_c.sum_price)) END AS jun,\n" +
				"CASE \n" +
				"WHEN (sum(jul.sum_price) IS NULL) AND (sum(jul_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(jul.sum_price) IS NOT NULL) AND (sum(jul_c.sum_price) IS NULL) THEN sum(jul.sum_price)\n" +
				"WHEN (sum(jul.sum_price) IS NULL) AND (sum(jul_c.sum_price) IS NOT NULL) THEN (sum(jul_c.sum_price)*-1)\n" +
				"ELSE (sum(jul.sum_price)-sum(jul_c.sum_price)) END AS jul,\n" +
				"CASE \n" +
				"WHEN (sum(aug.sum_price) IS NULL) AND (sum(aug_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(aug.sum_price) IS NOT NULL) AND (sum(aug_c.sum_price) IS NULL) THEN sum(aug.sum_price)\n" +
				"WHEN (sum(aug.sum_price) IS NULL) AND (sum(aug_c.sum_price) IS NOT NULL) THEN (sum(aug_c.sum_price)*-1)\n" +
				"ELSE (sum(aug.sum_price)-sum(aug_c.sum_price)) END AS aug,\n" +
				"CASE \n" +
				"WHEN (sum(sep.sum_price) IS NULL) AND (sum(sep_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(sep.sum_price) IS NOT NULL) AND (sum(sep_c.sum_price) IS NULL) THEN sum(sep.sum_price)\n" +
				"WHEN (sum(sep.sum_price) IS NULL) AND (sum(sep_c.sum_price) IS NOT NULL) THEN (sum(sep_c.sum_price)*-1)\n" +
				"ELSE (sum(sep.sum_price)-sum(sep_c.sum_price)) END AS sep,\n" +
				"CASE \n" +
				"WHEN (sum(oct.sum_price) IS NULL) AND (sum(oct_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(oct.sum_price) IS NOT NULL) AND (sum(oct_c.sum_price) IS NULL) THEN sum(oct.sum_price)\n" +
				"WHEN (sum(oct.sum_price) IS NULL) AND (sum(oct_c.sum_price) IS NOT NULL) THEN (sum(oct_c.sum_price)*-1)\n" +
				"ELSE (sum(oct.sum_price)-sum(oct_c.sum_price)) END AS oct,\n" +
				"CASE \n" +
				"WHEN (sum(nov.sum_price) IS NULL) AND (sum(nov_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(nov.sum_price) IS NOT NULL) AND (sum(nov_c.sum_price) IS NULL) THEN sum(nov.sum_price)\n" +
				"WHEN (sum(nov.sum_price) IS NULL) AND (sum(nov_c.sum_price) IS NOT NULL) THEN (sum(nov_c.sum_price)*-1)\n" +
				"ELSE (sum(nov.sum_price)-sum(nov_c.sum_price)) END AS nov,\n" +
				"CASE \n" +
				"WHEN (sum(dec.sum_price) IS NULL) AND (sum(dec_c.sum_price) IS NULL) THEN 0\n" +
				"WHEN (sum(dec.sum_price) IS NOT NULL) AND (sum(dec_c.sum_price) IS NULL) THEN sum(dec.sum_price)\n" +
				"WHEN (sum(dec.sum_price) IS NULL) AND (sum(dec_c.sum_price) IS NOT NULL) THEN (sum(dec_c.sum_price)*-1)\n" +
				"ELSE (sum(dec.sum_price)-sum(dec_c.sum_price)) END AS dec\n" +
				"FROM invoice\n" +
				"LEFT JOIN customer cus ON cus.cus_id = invoice.cus_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '1' \n" +
				"GROUP BY inv_id) jan ON jan.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '2' \n" +
				"GROUP BY inv_id) feb ON feb.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '3' \n" +
				"GROUP BY inv_id) mar ON mar.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '4' \n" +
				"GROUP BY inv_id) apr ON apr.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '5' \n" +
				"GROUP BY inv_id) may ON may.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '6' \n" +
				"GROUP BY inv_id) jun ON jun.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '7' \n" +
				"GROUP BY inv_id) jul ON jul.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '8' \n" +
				"GROUP BY inv_id) aug ON aug.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '9' \n" +
				"GROUP BY inv_id) sep ON sep.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '10' \n" +
				"GROUP BY inv_id) oct ON oct.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '11' \n" +
				"GROUP BY inv_id) nov ON nov.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = '"+inv_bill_type+"' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '12' \n" +
				"GROUP BY inv_id) dec ON dec.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '1' \n" +
				"GROUP BY inv_id) jan_c ON jan_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '2' \n" +
				"GROUP BY inv_id) feb_c ON feb_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '3' \n" +
				"GROUP BY inv_id) mar_c ON mar_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '4' \n" +
				"GROUP BY inv_id) apr_c ON apr_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '5' \n" +
				"GROUP BY inv_id) may_c ON may_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '6' \n" +
				"GROUP BY inv_id) jun_c ON jun_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '7' \n" +
				"GROUP BY inv_id) jul_c ON jul_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '8' \n" +
				"GROUP BY inv_id) aug_c ON aug_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '9' \n" +
				"GROUP BY inv_id) sep_c ON sep_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '10' \n" +
				"GROUP BY inv_id) oct_c ON oct_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '11' \n" +
				"GROUP BY inv_id) nov_c ON nov_c.inv_id = invoice.inv_id\n" +
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n" +
				"WHERE inv_bill_type = 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = '12' \n" +
				"GROUP BY inv_id) dec_c ON dec_c.inv_id = invoice.inv_id\n" +
				"WHERE inv_company_id = "+inv_company_id+"\n";
		
		if(inv_bill_type == "Direct"){
			sql += "AND (inv_bill_type = '"+inv_bill_type+"' OR inv_bill_type = 'Credit Note')\n";
		}else{
			sql += "AND inv_bill_type = '"+inv_bill_type+"'\n";
		}
				
		sql += "GROUP BY cus_name\n" +
			"ORDER BY cus_name ASC";
=======
		String sql = "SELECT cus_name,\n"+
				"CASE WHEN sum(jan.sum_price) IS NULL THEN 0 ELSE sum(jan.sum_price) END AS jan,\n"+
				"CASE WHEN sum(feb.sum_price) IS NULL THEN 0 ELSE sum(feb.sum_price) END AS feb,\n"+
				"CASE WHEN sum(mar.sum_price) IS NULL THEN 0 ELSE sum(mar.sum_price) END AS mar,\n"+
				"CASE WHEN sum(apr.sum_price) IS NULL THEN 0 ELSE sum(apr.sum_price) END AS apr,\n"+
				"CASE WHEN sum(may.sum_price) IS NULL THEN 0 ELSE sum(may.sum_price) END AS may,\n"+
				"CASE WHEN sum(jun.sum_price) IS NULL THEN 0 ELSE sum(jun.sum_price) END AS jun,\n"+
				"CASE WHEN sum(jul.sum_price) IS NULL THEN 0 ELSE sum(jul.sum_price) END AS jul,\n"+
				"CASE WHEN sum(aug.sum_price) IS NULL THEN 0 ELSE sum(aug.sum_price) END AS aug,\n"+
				"CASE WHEN sum(sep.sum_price) IS NULL THEN 0 ELSE sum(sep.sum_price) END AS sep,\n"+
				"CASE WHEN sum(oct.sum_price) IS NULL THEN 0 ELSE sum(oct.sum_price) END AS oct,\n"+
				"CASE WHEN sum(nov.sum_price) IS NULL THEN 0 ELSE sum(nov.sum_price) END AS nov,\n"+
				"CASE WHEN sum(dec.sum_price) IS NULL THEN 0 ELSE sum(dec.sum_price) END AS dec\n"+
				"FROM invoice\n"+
				"LEFT JOIN customer cus ON cus.cus_id = invoice.cus_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'1\' \n"+
				"GROUP BY inv_id) jan ON jan.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'2\' \n"+
				"GROUP BY inv_id) feb ON feb.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'3\' \n"+
				"GROUP BY inv_id) mar ON mar.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'4\' \n"+
				"GROUP BY inv_id) apr ON apr.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'5\' \n"+
				"GROUP BY inv_id) may ON may.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'6\' \n"+
				"GROUP BY inv_id) jun ON jun.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'7\' \n"+
				"GROUP BY inv_id) jul ON jul.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'8\' \n"+
				"GROUP BY inv_id) aug ON aug.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'9\' \n"+
				"GROUP BY inv_id) sep ON sep.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'10\' \n"+
				"GROUP BY inv_id) oct ON oct.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'11\' \n"+
				"GROUP BY inv_id) nov ON nov.inv_id = invoice.inv_id\n"+
				"LEFT JOIN (SELECT inv_id, sum(inv_total_price_eur) AS sum_price FROM invoice \n"+
				"WHERE inv_bill_type <> 'Credit Note' AND EXTRACT(YEAR FROM inv_delivery_date) = '"+year+"' AND EXTRACT(MONTH FROM inv_delivery_date) = \'12\' \n"+
				"GROUP BY inv_id) dec ON dec.inv_id = invoice.inv_id\n"+
				"WHERE inv_company_id = "+inv_company_id+"\n"+
				"GROUP BY cus_name\n"+
				"ORDER BY cus_name ASC";
>>>>>>> f934fd2dff8a360d60a176fdc55f9a9290ff4e4b
		
		List<Invoice> inv = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Invoice>(Invoice.class));
		return inv;
	}
	
	public TopixConfig getTopixConfig(){
		
		// Test Server = 0 && Main Server = 1
		Reference tpx_ref = this.getJdbcTemplate().queryForObject("SELECT db_ref_name FROM db_reference WHERE db_ref_kind = 'TopixConfig'", new BeanPropertyRowMapper<Reference>(Reference.class));
		
		String sql = "SELECT * FROM topix_config WHERE tpx_cfg_id="+tpx_ref.getDb_ref_name();
		
		TopixConfig tpx_cfg = this.getJdbcTemplate().queryForObject(sql, new BeanPropertyRowMapper<TopixConfig>(TopixConfig.class));
		
		return tpx_cfg;
	}

	public int addTopix(Topix tpx){
		
		String sql = "INSERT INTO topix VALUES (default,?,?,?,?,?,?,?,?,now())";
		
		GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
		String id_column = "tpx_id";
		
		this.getJdbcTemplate().update(con -> {
		    PreparedStatement ps = con.prepareStatement(sql, new String[]{id_column});
		    ps.setInt(1, tpx.getInv_id());
		    ps.setInt(2, tpx.getTpx_cfg_id());
		    ps.setString(3, tpx.getTpx_name());
		    ps.setString(4, tpx.getTpx_cus_id());
		    ps.setDate(5, tpx.getTpx_date_sql());
		    ps.setString(6, tpx.getTpx_res_nr());
		    ps.setString(7, tpx.getTpx_res_msg());
		    ps.setString(8, tpx.getTpx_inv_number());
		    return ps;
		  }
		  , keyHolder);
		
		int tpx_id = (Integer) keyHolder.getKeys().get(id_column);
		
		String sql2 = "UPDATE invoice SET inv_number=?, inv_bill_type=?, inv_tpx_id=? WHERE inv_id=?";
		
		this.getJdbcTemplate().update(sql2, new Object[] {
				tpx.getTpx_inv_number(),
				"Angebote",
				tpx_id,
				tpx.getInv_id()
		});
		
		List<InvoiceReference> inv_refLs = searchInvoiceReference(tpx.getInv_id());
		
		
		String topix_info = "Created Topix name="+tpx.getTpx_name()+", tpx_cfg_id="+tpx.getTpx_cfg_id()
		+", tpx_cus_id="+tpx.getTpx_cus_id()+", tpx_date="+tpx.getTpx_date()+", tpx_res_nr="+tpx.getTpx_res_nr()
		+", tpx_res_msg="+tpx.getTpx_res_msg()+", tpx_inv_number="+tpx.getTpx_inv_number();
		
		for(int i=0; i<inv_refLs.size(); i++){
			topix_info += ", tpx_ref_info="+inv_refLs.get(i).getInv_topix_id()+" : "+inv_refLs.get(i).getInv_ref_qty()+" QTY";
		}
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				
				tpx_id,
				"Topix:"+tpx.getInv_id(),
				user.getUserModel().getUsr_name(),
				topix_info,
				tpx.getTpx_name()+ " : " +tpx.getTpx_inv_number()
		});
		
		return tpx_id;

	}

	public void addTopixReference(TopixReference tpx_ref) {
		
		String sql = "INSERT INTO topix_reference VALUES (default,?,?,?)";
		
		this.getJdbcTemplate().update(sql, new Object[] {
				tpx_ref.getTpx_id(),
				tpx_ref.getTpx_article_id(),
				tpx_ref.getTpx_ref_qty()
		});
		
	}

	@Override
	public void updateInvoiceStatus(int inv_id, String status, String inv_number) {
		// TODO Auto-generated method stub
		String sql = "UPDATE invoice SET inv_bill_type = '"+status+"', inv_number = '"+inv_number+"' WHERE inv_id="+inv_id;
		this.getJdbcTemplate().update(sql);
	}
	
	public void updateTopixAuditLogging(Topix tpx){
	
		UserDetailsApp user = UserLoginDetail.getUser();
		String audit = "INSERT INTO audit_logging (aud_id,parent_id,parent_object,commit_by,commit_date,commit_desc,parent_ref) VALUES (default,?,?,?,now(),?,?)";
		this.getJdbcTemplate().update(audit, new Object[]{
				
				tpx.getInv_id(),
				"Topix:"+tpx.getInv_id(),
				user.getUserModel().getUsr_name(),
				"Error on Topix name="+tpx.getTpx_name()+", tpx_cfg_id="+tpx.getTpx_cfg_id()
				+", tpx_cus_id="+tpx.getTpx_cus_id()+", tpx_res_nr="+tpx.getTpx_res_nr()
				+", tpx_res_msg="+tpx.getTpx_res_msg(),
				tpx.getTpx_name()+" Error("+tpx.getTpx_res_nr()+ "): " +tpx.getTpx_res_msg()
		});
	}

	@Override
	public List<Invoice> showInvoiceReport(Map<String, String> data) {
		
		String sql = "SELECT inv.inv_id, inv_currency, inv_bill_date, inv_number, cus.cus_name, inv_name, inv_itm_name, inv_ref_qty, inv_ref_price, inv_total_price_eur, x.total_price\n"+
				"FROM invoice inv\n"+
				"LEFT JOIN invoice_reference inv_ref ON inv_ref.inv_id = inv.inv_id\n"+
				"LEFT JOIN customer cus ON cus.cus_id = inv.cus_id\n"+
				"LEFT JOIN (SELECT inv_id, SUM(inv_ref_price * inv_ref_qty) AS total_price FROM invoice_reference GROUP BY inv_id) x ON x.inv_id = inv.inv_id\n"+
				"WHERE inv.inv_id != 0\n";
				
		if(data.get("inv_proj_no")==null || data.get("inv_proj_no").isEmpty()){
		}else{
			sql += "AND LOWER(inv.inv_proj_no) LIKE LOWER('%"+data.get("inv_proj_no")+"%')\n";
		}
		if(data.get("inv_company_id")==null || data.get("inv_company_id").isEmpty()){
		}else{
			sql += "AND inv.inv_company_id = "+data.get("inv_company_id")+"\n";
		}
		if(data.get("inv_cus_id")==null || data.get("inv_cus_id").isEmpty()){
		}else{
			sql += "AND inv.cus_id = "+data.get("inv_cus_id")+"\n";
		}
		if(data.get("inv_bill_type")==null || data.get("inv_bill_type").isEmpty() || data.get("inv_bill_type").equals("All")){
		}else{
			sql += "AND inv.inv_bill_type LIKE '"+data.get("inv_bill_type")+"%'\n";
		}
		if(data.get("delivery_start")==null || data.get("delivery_start").isEmpty()){
			if(data.get("delivery_limit")==null || data.get("delivery_limit").isEmpty()){
			}else{
				sql += "AND inv.inv_delivery_date <= '"+data.get("delivery_limit")+"'\n";
			}
		}else if(data.get("delivery_limit")==null || data.get("delivery_limit").isEmpty()){
			sql += "AND inv.inv_delivery_date >= '"+data.get("delivery_start")+"'\n";
		}else{
			sql += "AND inv.inv_delivery_date BETWEEN '"+data.get("delivery_start")+"' AND '"+data.get("delivery_limit")+"'\n";
		}
		
		sql += "ORDER BY inv_number DESC";
		
		List<Invoice> inv = getJdbcTemplate().query(sql, new BeanPropertyRowMapper<Invoice>(Invoice.class));
		return inv;
	}
	
}
