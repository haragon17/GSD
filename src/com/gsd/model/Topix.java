package com.gsd.model;

import java.sql.Date;
import java.sql.Timestamp;

public class Topix {

	private int tpx_id;
	private int inv_id;
	private int tpx_cfg_id;
	private String tpx_name;
	private String tpx_cus_id;
	private String tpx_date;
	private Date tpx_date_sql;
	private String tpx_res_nr;
	private String tpx_res_msg;
	private String tpx_inv_number;
	private String inv_delivery_date;
	
	public int getTpx_id() {
		return tpx_id;
	}
	public void setTpx_id(int tpx_id) {
		this.tpx_id = tpx_id;
	}
	public int getInv_id() {
		return inv_id;
	}
	public void setInv_id(int inv_id) {
		this.inv_id = inv_id;
	}
	public int getTpx_cfg_id() {
		return tpx_cfg_id;
	}
	public void setTpx_cfg_id(int tpx_cfg_id) {
		this.tpx_cfg_id = tpx_cfg_id;
	}
	public String getTpx_name() {
		return tpx_name;
	}
	public void setTpx_name(String tpx_name) {
		this.tpx_name = tpx_name;
	}
	public String getTpx_cus_id() {
		return tpx_cus_id;
	}
	public void setTpx_cus_id(String tpx_cus_id) {
		this.tpx_cus_id = tpx_cus_id;
	}
	public String getTpx_date() {
		return tpx_date;
	}
	public void setTpx_date(String tpx_date) {
		this.tpx_date = tpx_date;
	}
	public Date getTpx_date_sql() {
		return tpx_date_sql;
	}
	public void setTpx_date_sql(Date tpx_date_sql) {
		this.tpx_date_sql = tpx_date_sql;
	}
	public String getTpx_res_nr() {
		return tpx_res_nr;
	}
	public void setTpx_res_nr(String tpx_res_nr) {
		this.tpx_res_nr = tpx_res_nr;
	}
	public String getTpx_res_msg() {
		return tpx_res_msg;
	}
	public void setTpx_res_msg(String tpx_res_msg) {
		this.tpx_res_msg = tpx_res_msg;
	}
	public String getTpx_inv_number() {
		return tpx_inv_number;
	}
	public void setTpx_inv_number(String tpx_inv_number) {
		this.tpx_inv_number = tpx_inv_number;
	}
	public String getInv_delivery_date() {
		return inv_delivery_date;
	}
	public void setInv_delivery_date(String inv_delivery_date) {
		this.inv_delivery_date = inv_delivery_date;
	}
	
}
