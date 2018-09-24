package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.AuditLogging;

public interface AuditLoggingDao {

	public List<AuditLogging> searchAuditLogging(Map<String, String> data);
	
}
