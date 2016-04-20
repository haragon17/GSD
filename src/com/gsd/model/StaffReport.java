package com.gsd.model;

public class StaffReport {

	private int sr_id;
	private int cus_id;
	private String cus_name;
	private String wrk_name;
	private int amount;
	private String sr_process;
	private int sr_time;
	private String sr_dtl;
	private int cretd_usr;
	private String cretd_date;
	private String update_date;
	
	public int getSr_id() {
		return sr_id;
	}
	public void setSr_id(int sr_id) {
		this.sr_id = sr_id;
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
	public void setCus_name(String cus_name) {
		this.cus_name = cus_name;
	}
	public String getWrk_name() {
		return wrk_name;
	}
	public void setWrk_name(String wrk_name) {
		this.wrk_name = wrk_name;
	}
	public int getAmount() {
		return amount;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}
	public String getSr_process() {
		return sr_process;
	}
	public void setSr_process(String sr_process) {
		this.sr_process = sr_process;
	}
	public int getSr_time() {
		return sr_time;
	}
	public void setSr_time(int sr_time) {
		this.sr_time = sr_time;
	}
	public String getSr_dtl() {
		return sr_dtl;
	}
	public void setSr_dtl(String sr_dtl) {
		this.sr_dtl = sr_dtl;
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
