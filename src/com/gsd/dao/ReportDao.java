package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.Report;

public interface ReportDao {

	public List<Report> searchReport(Map<String, String> data);
	
}
