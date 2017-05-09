package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.TimeRecord;
import com.gsd.model.TimeRecordReference;

public interface TimeRecordDao {

	public List<TimeRecord> searchTimeRecord(Map<String, String> data);
	
	public List<TimeRecordReference> showTimeRecordReference(String tr_ref_kind, String tr_ref_dept);
}
