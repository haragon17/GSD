package com.gsd.model;

import java.sql.Timestamp;

public class Customer {

	private int cus_id;
	private String cus_name;
	private String cus_code;
	private int key_acc_id;
	private String address;
	private String contact_person;
	private int cretd_usr;
	private String cretd_date;
	private String update_date;
	private String key_acc_name;
	private String cus_email;
	private String cus_phone;
	private String bill_to;
	private String payment;
	private String transfer_dtl;
	private String regist_date;
	private Timestamp regist_date_ts;
	private int topix_cus_id;
	
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
	public String getCus_code() {
		return cus_code;
	}
	public void setCus_code(String cus_code) {
		this.cus_code = cus_code;
	}
	public int getKey_acc_id() {
		return key_acc_id;
	}
	public void setKey_acc_id(int key_acc_id) {
		this.key_acc_id = key_acc_id;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getContact_person() {
		return contact_person;
	}
	public void setContact_person(String contact_person) {
		this.contact_person = contact_person;
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
	public String getKey_acc_name() {
		return key_acc_name;
	}
	public void setKey_acc_name(String key_acc_name) {
		this.key_acc_name = key_acc_name;
	}
	public String getCus_email() {
		return cus_email;
	}
	public void setCus_email(String cus_email) {
		this.cus_email = cus_email;
	}
	public String getCus_phone() {
		return cus_phone;
	}
	public void setCus_phone(String cus_phone) {
		this.cus_phone = cus_phone;
	}
	public String getBill_to() {
		return bill_to;
	}
	public void setBill_to(String bill_to) {
		this.bill_to = bill_to;
	}
	public String getPayment() {
		return payment;
	}
	public void setPayment(String payment) {
		this.payment = payment;
	}
	public String getTransfer_dtl() {
		return transfer_dtl;
	}
	public void setTransfer_dtl(String transfer_dtl) {
		this.transfer_dtl = transfer_dtl;
	}
	public String getRegist_date() {
		return regist_date;
	}
	public void setRegist_date(String regist_date) {
		this.regist_date = regist_date;
	}
	public Timestamp getRegist_date_ts() {
		return regist_date_ts;
	}
	public void setRegist_date_ts(Timestamp regist_date_ts) {
		this.regist_date_ts = regist_date_ts;
	}
	public int getTopix_cus_id() {
		return topix_cus_id;
	}
	public void setTopix_cus_id(int topix_cus_id) {
		this.topix_cus_id = topix_cus_id;
	}
	
}
