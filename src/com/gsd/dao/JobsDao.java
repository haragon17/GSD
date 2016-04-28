package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.Jobs;

public interface JobsDao {

	public int getLastJobId();
	
	public List<Jobs> searchJobs(Map<String, String> data);
	
	public void createJob(Jobs job);
	
	public void updateJob(Jobs job);
	
	public void deleteJob(int id);
}
