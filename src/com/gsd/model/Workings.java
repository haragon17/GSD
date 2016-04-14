package com.gsd.model;

public class Workings {

	private int wrk_id;
	private String wrk_name;
	private int cus_id;
	private String cus_name;
	private int wrk_sts_id;
	private String wrk_sts_name;
	private int wrk_amount;
	private String wrk_dtl;
	private String wrk_in;
	private String wrk_out;
	private int cretd_usr;
	private String cretd_date;
	private String update_date;
	
	public Workings(){}

	public int getWrk_id() {
		return wrk_id;
	}

	public void setWrk_id(int wrk_id) {
		this.wrk_id = wrk_id;
	}

	public String getWrk_name() {
		return wrk_name;
	}

	public void setWrk_name(String wrk_name) {
		this.wrk_name = wrk_name;
	}

	public int getCus_id() {
		return cus_id;
	}

	public void setCus_id(int cus_id) {
		this.cus_id = cus_id;
	}
	
	public String getCus_name() {
		return cus_name;
	}
	
	public void setCus_name(String cus_name){
		this.cus_name = cus_name;
	}

	public int getWrk_sts_id() {
		return wrk_sts_id;
	}

	public void setWrk_sts_id(int wrk_sts_id) {
		this.wrk_sts_id = wrk_sts_id;
	}
	
	public String getWrk_sts_name(){
		return wrk_sts_name;
	}
	
	public void setWrk_sts_name(String wrk_sts_name){
		this.wrk_sts_name = wrk_sts_name;
	}

	public int getWrk_amount() {
		return wrk_amount;
	}

	public void setWrk_amount(int wrk_amount) {
		this.wrk_amount = wrk_amount;
	}

	public String getWrk_dtl() {
		return wrk_dtl;
	}

	public void setWrk_dtl(String wrk_dtl) {
		this.wrk_dtl = wrk_dtl;
	}

	public String getWrk_in() {
		return wrk_in;
	}

	public void setWrk_in(String wrk_in) {
		this.wrk_in = wrk_in;
	}

	public String getWrk_out() {
		return wrk_out;
	}

	public void setWrk_out(String wrk_out) {
		this.wrk_out = wrk_out;
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
