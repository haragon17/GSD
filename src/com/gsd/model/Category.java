package com.gsd.model;

public class Category {

	private int cate_id;
	private String cate_desc;
	private String comment;
	private int cate_ref;
	private int cate_lv;
	private String cretd_date;
	
	public Category(){}
	
	public int getCate_id() {
		return cate_id;
	}
	public void setCate_id(int cate_id) {
		this.cate_id = cate_id;
	}
	public String getCate_desc() {
		return cate_desc;
	}
	public void setCate_desc(String cate_desc) {
		this.cate_desc = cate_desc;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public int getCate_ref() {
		return cate_ref;
	}
	public void setCate_ref(int cate_ref) {
		this.cate_ref = cate_ref;
	}
	public int getCate_lv() {
		return cate_lv;
	}
	public void setCate_lv(int cate_lv) {
		this.cate_lv = cate_lv;
	}
	public String getCretd_date() {
		return cretd_date;
	}
	public void setCretd_date(String cretd_date) {
		this.cretd_date = cretd_date;
	}
	
}
