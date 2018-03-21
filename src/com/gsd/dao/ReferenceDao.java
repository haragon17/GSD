package com.gsd.dao;

import java.util.List;

import com.gsd.model.Reference;

public interface ReferenceDao {
	
	public List<Reference> showDBReference(String kind, String dept);

	public List<Reference> showDepartmentReference();
	
	public List<Reference> showBillingStatus();
	
	public List<Reference> showJobReference(String kind, String dept);
}
