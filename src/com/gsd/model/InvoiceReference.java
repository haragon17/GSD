package com.gsd.model;

import java.math.BigDecimal;

public class InvoiceReference {

	private int inv_ref_id;
	private int inv_id;
	private int proj_ref_id;
	private String inv_itm_name;
	private BigDecimal inv_ref_price;
	private BigDecimal inv_ref_qty;
	private String inv_ref_currency;
	private String inv_ref_desc;
	private int cretd_usr;
	private int order_by;
	private String cretd_date;
	private String update_date;
	private BigDecimal total_amount;
	private String inv_name;
	private int proj_id;
	private String proj_name;
	private String topix_article_id;
	private String inv_currency;
	
	public int getInv_ref_id() {
		return inv_ref_id;
	}
	public void setInv_ref_id(int inv_ref_id) {
		this.inv_ref_id = inv_ref_id;
	}
	public int getInv_id() {
		return inv_id;
	}
	public void setInv_id(int inv_id) {
		this.inv_id = inv_id;
	}
	public int getProj_ref_id() {
		return proj_ref_id;
	}
	public void setProj_ref_id(int proj_ref_id) {
		this.proj_ref_id = proj_ref_id;
	}
	public String getInv_itm_name() {
		return inv_itm_name;
	}
	public void setInv_itm_name(String inv_itm_name) {
		this.inv_itm_name = inv_itm_name;
	}
	public BigDecimal getInv_ref_price() {
		return inv_ref_price;
	}
	public void setInv_ref_price(BigDecimal inv_ref_price) {
		this.inv_ref_price = inv_ref_price;
	}
	public BigDecimal getInv_ref_qty() {
		return inv_ref_qty;
	}
	public void setInv_ref_qty(BigDecimal inv_ref_qty) {
		this.inv_ref_qty = inv_ref_qty;
	}
	public String getInv_ref_currency() {
		return inv_ref_currency;
	}
	public void setInv_ref_currency(String inv_ref_currency) {
		this.inv_ref_currency = inv_ref_currency;
	}
	public String getInv_ref_desc() {
		return inv_ref_desc;
	}
	public void setInv_ref_desc(String inv_ref_desc) {
		this.inv_ref_desc = inv_ref_desc;
	}
	public int getCretd_usr() {
		return cretd_usr;
	}
	public void setCretd_usr(int cretd_usr) {
		this.cretd_usr = cretd_usr;
	}
	public int getOrder_by() {
		return order_by;
	}
	public void setOrder_by(int order_by) {
		this.order_by = order_by;
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
	public BigDecimal getTotal_amount() {
		return total_amount;
	}
	public void setTotal_amount(BigDecimal total_amount) {
		this.total_amount = total_amount;
	}
	public String getInv_name() {
		return inv_name;
	}
	public void setInv_name(String inv_name) {
		this.inv_name = inv_name;
	}
	public int getProj_id() {
		return proj_id;
	}
	public void setProj_id(int proj_id) {
		this.proj_id = proj_id;
	}
	public String getProj_name() {
		return proj_name;
	}
	public void setProj_name(String proj_name) {
		this.proj_name = proj_name;
	}
	public String getTopix_article_id() {
		return topix_article_id;
	}
	public void setTopix_article_id(String topix_article_id) {
		this.topix_article_id = topix_article_id;
	}
	public String getInv_currency() {
		return inv_currency;
	}
	public void setInv_currency(String inv_currency) {
		this.inv_currency = inv_currency;
	}
	
}
