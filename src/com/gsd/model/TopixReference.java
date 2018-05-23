package com.gsd.model;

import java.math.BigDecimal;

public class TopixReference {

	private int tpx_ref_id;
	private int tpx_id;
	private String tpx_article_id;
	private BigDecimal tpx_ref_qty;
	
	public int getTpx_ref_id() {
		return tpx_ref_id;
	}
	public void setTpx_ref_id(int tpx_ref_id) {
		this.tpx_ref_id = tpx_ref_id;
	}
	public int getTpx_id() {
		return tpx_id;
	}
	public void setTpx_id(int tpx_id) {
		this.tpx_id = tpx_id;
	}
	public String getTpx_article_id() {
		return tpx_article_id;
	}
	public void setTpx_article_id(String tpx_article_id) {
		this.tpx_article_id = tpx_article_id;
	}
	public BigDecimal getTpx_ref_qty() {
		return tpx_ref_qty;
	}
	public void setTpx_ref_qty(BigDecimal tpx_ref_qty) {
		this.tpx_ref_qty = tpx_ref_qty;
	}
	
}
