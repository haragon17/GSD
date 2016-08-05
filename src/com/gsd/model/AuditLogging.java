package com.gsd.model;

public class AuditLogging {

	private int aud_id;
	private int parent_id;
	private String parent_object;
	private String commit_by;
	private String commit_date;
	private String field_name;
	private String old_value;
	private String new_value;
	private String commit_desc;
	private String parent_ref;
	private String commit_type;
	private String parent_type;
	
	public int getAud_id() {
		return aud_id;
	}
	public void setAud_id(int aud_id) {
		this.aud_id = aud_id;
	}
	public int getParent_id() {
		return parent_id;
	}
	public void setParent_id(int parent_id) {
		this.parent_id = parent_id;
	}
	public String getParent_object() {
		return parent_object;
	}
	public void setParent_object(String parent_object) {
		this.parent_object = parent_object;
	}
	public String getCommit_by() {
		return commit_by;
	}
	public void setCommit_by(String commit_by) {
		this.commit_by = commit_by;
	}
	public String getCommit_date() {
		return commit_date;
	}
	public void setCommit_date(String commit_date) {
		this.commit_date = commit_date;
	}
	public String getField_name() {
		return field_name;
	}
	public void setField_name(String field_name) {
		this.field_name = field_name;
	}
	public String getOld_value() {
		return old_value;
	}
	public void setOld_value(String old_value) {
		this.old_value = old_value;
	}
	public String getNew_value() {
		return new_value;
	}
	public void setNew_value(String new_value) {
		this.new_value = new_value;
	}
	public String getCommit_desc() {
		return commit_desc;
	}
	public void setCommit_desc(String commit_desc) {
		this.commit_desc = commit_desc;
	}
	public String getParent_ref() {
		return parent_ref;
	}
	public void setParent_ref(String parent_ref) {
		this.parent_ref = parent_ref;
	}
	public String getCommit_type() {
		return commit_type;
	}
	public void setCommit_type(String commit_type) {
		this.commit_type = commit_type;
	}
	public String getParent_type() {
		return parent_type;
	}
	public void setParent_type(String parent_type) {
		this.parent_type = parent_type;
	}
}
