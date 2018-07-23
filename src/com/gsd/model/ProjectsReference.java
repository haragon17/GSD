package com.gsd.model;

import java.math.BigDecimal;

public class ProjectsReference {

	private int proj_ref_id;
	private int proj_id;
	private int itm_id;
	private float time;
	private BigDecimal price;
	private String price_str;
	private int cretd_usr;
	private String cretd_date;
	private String update_date;
	private String currency;
	private String proj_ref_desc;
	private String itm_name;
	private String cus_name;
	private String cus_code;
	private float actual_time;
	private String topix_article_id;
	private String proj_currency;
	private int activated;
	
	public int getProj_ref_id() {
		return proj_ref_id;
	}
	public void setProj_ref_id(int proj_ref_id) {
		this.proj_ref_id = proj_ref_id;
	}
	public int getProj_id() {
		return proj_id;
	}
	public void setProj_id(int proj_id) {
		this.proj_id = proj_id;
	}
	public int getItm_id() {
		return itm_id;
	}
	public void setItm_id(int itm_id) {
		this.itm_id = itm_id;
	}
	public float getTime() {
		return time;
	}
	public void setTime(float time) {
		this.time = time;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public String getPrice_str() {
		return price_str;
	}
	public void setPrice_str(String price_str) {
		this.price_str = price_str;
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
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public String getProj_ref_desc() {
		return proj_ref_desc;
	}
	public void setProj_ref_desc(String proj_ref_desc) {
		this.proj_ref_desc = proj_ref_desc;
	}
	public String getItm_name() {
		return itm_name;
	}
	public void setItm_name(String itm_name) {
		this.itm_name = itm_name;
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
	public float getActual_time() {
		return actual_time;
	}
	public void setActual_time(float actual_time) {
		this.actual_time = actual_time;
	}
	public String getTopix_article_id() {
		return topix_article_id;
	}
	public void setTopix_article_id(String topix_article_id) {
		this.topix_article_id = topix_article_id;
	}
	public String getProj_currency() {
		return proj_currency;
	}
	public void setProj_currency(String proj_currency) {
		this.proj_currency = proj_currency;
	}
	public int getActivated() {
		return activated;
	}
	public void setActivated(int activated) {
		this.activated = activated;
	}
	
}
