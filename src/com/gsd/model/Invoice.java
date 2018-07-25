package com.gsd.model;

import java.math.BigDecimal;
import java.sql.Date;

public class Invoice {

	private int inv_id;
	private String inv_number;
	private String inv_name;
	private int inv_company_id;
	private String inv_proj_no;
	private String inv_bill_date;
	private String inv_delivery_date;
	private Date setInv_bill_date_sql;
	private Date inv_delivery_date_sql;
	private int inv_payment_terms;
	private BigDecimal inv_vat;
	private String inv_bill_type;
	private int cus_id;
	private int cretd_usr;
	private String cretd_date;
	private String update_date;
	private String inv_company_name;
	private String inv_company_code;
	private String cus_name;
	private String cus_code;
	private String usr_name;
	private String topix_cus_id;
	private String address;
	private BigDecimal inv_total_price_eur;
	private BigDecimal jan;
	private BigDecimal feb;
	private BigDecimal mar;
	private BigDecimal apr;
	private BigDecimal may;
	private BigDecimal jun;
	private BigDecimal jul;
	private BigDecimal aug;
	private BigDecimal sep;
	private BigDecimal oct;
	private BigDecimal nov;
	private BigDecimal dec;
	private int inv_tpx_id;
	private BigDecimal total_inv_price;
	private int count_tpx;
	private String bill_to;
	private String inv_itm_name;
	private BigDecimal inv_ref_qty;
	private BigDecimal inv_ref_price;
	private BigDecimal total_price;
	private String inv_bill_to;
	private String inv_currency;
	private BigDecimal inv_discount;
	
	public int getInv_id() {
		return inv_id;
	}
	public void setInv_id(int inv_id) {
		this.inv_id = inv_id;
	}
	public String getInv_number() {
		return inv_number;
	}
	public void setInv_number(String inv_number) {
		this.inv_number = inv_number;
	}
	public String getInv_name() {
		return inv_name;
	}
	public void setInv_name(String inv_name) {
		this.inv_name = inv_name;
	}
	public int getInv_company_id() {
		return inv_company_id;
	}
	public void setInv_company_id(int inv_company_id) {
		this.inv_company_id = inv_company_id;
	}
	public String getInv_proj_no() {
		return inv_proj_no;
	}
	public void setInv_proj_no(String inv_proj_no) {
		this.inv_proj_no = inv_proj_no;
	}
	public String getInv_bill_date() {
		return inv_bill_date;
	}
	public void setInv_bill_date(String inv_bill_date) {
		this.inv_bill_date = inv_bill_date;
	}
	public String getInv_delivery_date() {
		return inv_delivery_date;
	}
	public void setInv_delivery_date(String inv_delivery_date) {
		this.inv_delivery_date = inv_delivery_date;
	}
	public Date getInv_bill_date_sql() {
		return setInv_bill_date_sql;
	}
	public void setInv_bill_date_sql(Date inv_bill_date_ts) {
		this.setInv_bill_date_sql = inv_bill_date_ts;
	}
	public Date getInv_delivery_date_sql() {
		return inv_delivery_date_sql;
	}
	public void setInv_delivery_date_sql(Date inv_delivery_date_sql) {
		this.inv_delivery_date_sql = inv_delivery_date_sql;
	}
	public int getInv_payment_terms() {
		return inv_payment_terms;
	}
	public void setInv_payment_terms(int inv_payment_terms) {
		this.inv_payment_terms = inv_payment_terms;
	}
	public BigDecimal getInv_vat() {
		return inv_vat;
	}
	public void setInv_vat(BigDecimal inv_vat) {
		this.inv_vat = inv_vat;
	}
	public String getInv_bill_type() {
		return inv_bill_type;
	}
	public void setInv_bill_type(String inv_bill_type) {
		this.inv_bill_type = inv_bill_type;
	}
	public int getCus_id() {
		return cus_id;
	}
	public void setCus_id(int cus_id) {
		this.cus_id = cus_id;
	}
	public int getCretd_usr() {
		return cretd_usr;
	}
	public void setCretd_usr(int cretd_usr) {
		this.cretd_usr = cretd_usr;
	}
	public String getCretd_date() {
		return cretd_date;
	}
	public void setCretd_date(String cretd_date) {
		this.cretd_date = cretd_date;
	}
	public String getUpdate_date() {
		return update_date;
	}
	public void setUpdate_date(String update_date) {
		this.update_date = update_date;
	}
	public String getInv_company_name() {
		return inv_company_name;
	}
	public void setInv_company_name(String inv_company_name) {
		this.inv_company_name = inv_company_name;
	}
	public String getInv_company_code() {
		return inv_company_code;
	}
	public void setInv_company_code(String inv_company_code) {
		this.inv_company_code = inv_company_code;
	}
	public String getCus_name() {
		return cus_name;
	}
	public void setCus_name(String cus_name) {
		this.cus_name = cus_name;
	}
	public String getCus_code() {
		return cus_code;
	}
	public void setCus_code(String cus_code) {
		this.cus_code = cus_code;
	}
	public String getUsr_name() {
		return usr_name;
	}
	public void setUsr_name(String usr_name) {
		this.usr_name = usr_name;
	}
	public String getTopix_cus_id() {
		return topix_cus_id;
	}
	public void setTopix_cus_id(String topix_cus_id) {
		this.topix_cus_id = topix_cus_id;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public BigDecimal getInv_total_price_eur() {
		return inv_total_price_eur;
	}
	public void setInv_total_price_eur(BigDecimal inv_total_price_eur) {
		this.inv_total_price_eur = inv_total_price_eur;
	}
	public Date getSetInv_bill_date_sql() {
		return setInv_bill_date_sql;
	}
	public void setSetInv_bill_date_sql(Date setInv_bill_date_sql) {
		this.setInv_bill_date_sql = setInv_bill_date_sql;
	}
	public BigDecimal getJan() {
		return jan;
	}
	public void setJan(BigDecimal jan) {
		this.jan = jan;
	}
	public BigDecimal getFeb() {
		return feb;
	}
	public void setFeb(BigDecimal feb) {
		this.feb = feb;
	}
	public BigDecimal getMar() {
		return mar;
	}
	public void setMar(BigDecimal mar) {
		this.mar = mar;
	}
	public BigDecimal getApr() {
		return apr;
	}
	public void setApr(BigDecimal apr) {
		this.apr = apr;
	}
	public BigDecimal getMay() {
		return may;
	}
	public void setMay(BigDecimal may) {
		this.may = may;
	}
	public BigDecimal getJun() {
		return jun;
	}
	public void setJun(BigDecimal jun) {
		this.jun = jun;
	}
	public BigDecimal getJul() {
		return jul;
	}
	public void setJul(BigDecimal jul) {
		this.jul = jul;
	}
	public BigDecimal getAug() {
		return aug;
	}
	public void setAug(BigDecimal aug) {
		this.aug = aug;
	}
	public BigDecimal getSep() {
		return sep;
	}
	public void setSep(BigDecimal sep) {
		this.sep = sep;
	}
	public BigDecimal getOct() {
		return oct;
	}
	public void setOct(BigDecimal oct) {
		this.oct = oct;
	}
	public BigDecimal getNov() {
		return nov;
	}
	public void setNov(BigDecimal nov) {
		this.nov = nov;
	}
	public BigDecimal getDec() {
		return dec;
	}
	public void setDec(BigDecimal dec) {
		this.dec = dec;
	}
	public int getInv_tpx_id() {
		return inv_tpx_id;
	}
	public void setInv_tpx_id(int inv_tpx_id) {
		this.inv_tpx_id = inv_tpx_id;
	}
	public BigDecimal getTotal_inv_price() {
		return total_inv_price;
	}
	public void setTotal_inv_price(BigDecimal total_inv_price) {
		this.total_inv_price = total_inv_price;
	}
	public int getCount_tpx() {
		return count_tpx;
	}
	public void setCount_tpx(int count_tpx) {
		this.count_tpx = count_tpx;
	}
	public String getBill_to() {
		return bill_to;
	}
	public void setBill_to(String bill_to) {
		this.bill_to = bill_to;
	}
	public String getInv_itm_name() {
		return inv_itm_name;
	}
	public void setInv_itm_name(String inv_itm_name) {
		this.inv_itm_name = inv_itm_name;
	}
	public BigDecimal getInv_ref_qty() {
		return inv_ref_qty;
	}
	public void setInv_ref_qty(BigDecimal inv_ref_qty) {
		this.inv_ref_qty = inv_ref_qty;
	}
	public BigDecimal getInv_ref_price() {
		return inv_ref_price;
	}
	public void setInv_ref_price(BigDecimal inv_ref_price) {
		this.inv_ref_price = inv_ref_price;
	}
	public BigDecimal getTotal_price() {
		return total_price;
	}
	public void setTotal_price(BigDecimal total_price) {
		this.total_price = total_price;
	}
	public String getInv_bill_to() {
		return inv_bill_to;
	}
	public void setInv_bill_to(String inv_bill_to) {
		this.inv_bill_to = inv_bill_to;
	}
	public String getInv_currency() {
		return inv_currency;
	}
	public void setInv_currency(String inv_currency) {
		this.inv_currency = inv_currency;
	}
	public BigDecimal getInv_discount() {
		return inv_discount;
	}
	public void setInv_discount(BigDecimal inv_discount) {
		this.inv_discount = inv_discount;
	}
	
}
