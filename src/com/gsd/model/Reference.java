package com.gsd.model;

public class Reference {
	private int db_ref_id;
	private String db_ref_name;
	private String db_ref_kind;
	private String db_ref_dept;
	private int cretd_usr;
	private String cretd_date;
	private String update_date;
	private int order_by;
	
	public int getDb_ref_id() {
		return db_ref_id;
	}
	public void setDb_ref_id(int db_ref_id) {
		this.db_ref_id = db_ref_id;
	}
	public String getDb_ref_name() {
		return db_ref_name;
	}
	public void setDb_ref_name(String db_ref_name) {
		this.db_ref_name = db_ref_name;
	}
	public String getDb_ref_kind() {
		return db_ref_kind;
	}
	public void setDb_ref_kind(String db_ref_kind) {
		this.db_ref_kind = db_ref_kind;
	}
	public String getDb_ref_dept() {
		return db_ref_dept;
	}
	public void setDb_ref_dept(String db_ref_dept) {
		this.db_ref_dept = db_ref_dept;
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
	public int getOrder_by() {
		return order_by;
	}
	public void setOrder_by(int order_by) {
		this.order_by = order_by;
	}
}
