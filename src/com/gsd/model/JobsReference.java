package com.gsd.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class JobsReference {

	private int job_ref_id;
	private int job_id;
	private String job_ref_name;
	private int proj_ref_id;
	private BigDecimal amount;
	private String job_in;
	private String job_out;
	private String job_ref_dtl;
	private int cretd_usr;
	private String cretd_date;
	private String update_date;
	private Timestamp job_in_ts;
	private Timestamp job_out_ts;
	private String itm_name;
	private int proj_id;
	private String proj_name;
	private String job_name;
	private String cus_name;
	private String cus_code;
	private String job_ref_status;
	private String job_ref_approve;
	private String dept;
	private BigDecimal sent_amount;
	private BigDecimal total_amount;
	private String job_ref_number;
	private String topix_article_id;
	private BigDecimal price;
	private String proj_currency;
	private String job_ref_remark;
	private String job_ref_type;
	private String job_dtl;
	private String job_status;
	private int cus_id;
	private BigDecimal new_page;
	private BigDecimal cc;
	private BigDecimal ic;
	private BigDecimal ic_cc;
	private BigDecimal wait_df;
	private BigDecimal sent;
	private BigDecimal s_hold;
	
	public int getJob_ref_id() {
		return job_ref_id;
	}
	public void setJob_ref_id(int job_ref_id) {
		this.job_ref_id = job_ref_id;
	}
	public int getJob_id() {
		return job_id;
	}
	public void setJob_id(int job_id) {
		this.job_id = job_id;
	}
	public String getJob_ref_name() {
		return job_ref_name;
	}
	public void setJob_ref_name(String job_ref_name) {
		this.job_ref_name = job_ref_name;
	}
	public int getProj_ref_id() {
		return proj_ref_id;
	}
	public void setProj_ref_id(int proj_ref_id) {
		this.proj_ref_id = proj_ref_id;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public String getJob_in() {
		return job_in;
	}
	public void setJob_in(String job_in) {
		this.job_in = job_in;
	}
	public String getJob_out() {
		return job_out;
	}
	public void setJob_out(String job_out) {
		this.job_out = job_out;
	}
	public String getJob_ref_dtl() {
		return job_ref_dtl;
	}
	public void setJob_ref_dtl(String job_ref_dtl) {
		this.job_ref_dtl = job_ref_dtl;
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
	public Timestamp getJob_in_ts() {
		return job_in_ts;
	}
	public void setJob_in_ts(Timestamp job_in_ts) {
		this.job_in_ts = job_in_ts;
	}
	public Timestamp getJob_out_ts() {
		return job_out_ts;
	}
	public void setJob_out_ts(Timestamp job_out_ts) {
		this.job_out_ts = job_out_ts;
	}
	public String getItm_name() {
		return itm_name;
	}
	public void setItm_name(String itm_name) {
		this.itm_name = itm_name;
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
	public String getJob_name() {
		return job_name;
	}
	public void setJob_name(String job_name) {
		this.job_name = job_name;
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
	public String getJob_ref_status() {
		return job_ref_status;
	}
	public void setJob_ref_status(String job_ref_status) {
		this.job_ref_status = job_ref_status;
	}
	public String getJob_ref_approve() {
		return job_ref_approve;
	}
	public void setJob_ref_approve(String job_ref_approve) {
		this.job_ref_approve = job_ref_approve;
	}
	public String getDept() {
		return dept;
	}
	public void setDept(String dept) {
		this.dept = dept;
	}
	public BigDecimal getSent_amount() {
		return sent_amount;
	}
	public void setSent_amount(BigDecimal sent_amount) {
		this.sent_amount = sent_amount;
	}
	public BigDecimal getTotal_amount() {
		return total_amount;
	}
	public void setTotal_amount(BigDecimal total_amount) {
		this.total_amount = total_amount;
	}
	public String getJob_ref_number() {
		return job_ref_number;
	}
	public void setJob_ref_number(String job_ref_number) {
		this.job_ref_number = job_ref_number;
	}
	public String getTopix_article_id() {
		return topix_article_id;
	}
	public void setTopix_article_id(String topix_article_id) {
		this.topix_article_id = topix_article_id;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public String getProj_currency() {
		return proj_currency;
	}
	public void setProj_currency(String proj_currency) {
		this.proj_currency = proj_currency;
	}
	public String getJob_ref_remark() {
		return job_ref_remark;
	}
	public void setJob_ref_remark(String job_ref_remark) {
		this.job_ref_remark = job_ref_remark;
	}
	public String getJob_ref_type() {
		return job_ref_type;
	}
	public void setJob_ref_type(String job_ref_type) {
		this.job_ref_type = job_ref_type;
	}
	public String getJob_dtl() {
		return job_dtl;
	}
	public void setJob_dtl(String job_dtl) {
		this.job_dtl = job_dtl;
	}
	public String getJob_status() {
		return job_status;
	}
	public void setJob_status(String job_status) {
		this.job_status = job_status;
	}
	public int getCus_id() {
		return cus_id;
	}
	public void setCus_id(int cus_id) {
		this.cus_id = cus_id;
	}
	public BigDecimal getNew_page() {
		return new_page;
	}
	public void setNew_page(BigDecimal new_page) {
		this.new_page = new_page;
	}
	public BigDecimal getCc() {
		return cc;
	}
	public void setCc(BigDecimal cc) {
		this.cc = cc;
	}
	public BigDecimal getIc() {
		return ic;
	}
	public void setIc(BigDecimal ic) {
		this.ic = ic;
	}
	public BigDecimal getIc_cc() {
		return ic_cc;
	}
	public void setIc_cc(BigDecimal ic_cc) {
		this.ic_cc = ic_cc;
	}
	public BigDecimal getWait_df() {
		return wait_df;
	}
	public void setWait_df(BigDecimal wait_df) {
		this.wait_df = wait_df;
	}
	public BigDecimal getSent() {
		return sent;
	}
	public void setSent(BigDecimal sent) {
		this.sent = sent;
	}
	public BigDecimal getS_hold() {
		return s_hold;
	}
	public void setS_hold(BigDecimal s_hold) {
		this.s_hold = s_hold;
	}
	
}
