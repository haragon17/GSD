package com.gsd.model;

public class Item {

	private int itm_id;
	private String itm_name;
	private String itm_desc;
	private int cretd_usr;
	private String cretd_date;
	private String update_date;
	
	public int getItm_id() {
		return itm_id;
	}
	public void setItm_id(int itm_id) {
		this.itm_id = itm_id;
	}
	public String getItm_name() {
		return itm_name;
	}
	public void setItm_name(String itm_name) {
		this.itm_name = itm_name;
	}
	public String getItm_desc() {
		return itm_desc;
	}
	public void setItm_desc(String itm_desc) {
		this.itm_desc = itm_desc;
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
		
}
