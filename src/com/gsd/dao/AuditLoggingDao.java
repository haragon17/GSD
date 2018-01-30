package com.gsd.dao;

import java.util.List;

import com.gsd.model.AuditLogging;

public interface AuditLoggingDao {

	public List<AuditLogging> showAuditLogging(String dept);
	
}
