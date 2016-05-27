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
	
	public List<Jobs> radarItem(Map<String, String> data);
	
	public List<Jobs> dailyRadar(Map<String, String> data, String[] dept_list);
	
	public List<Jobs> stackItem(Map<String, String> data);
	
	public List<Jobs> dailyStack(Map<String, String> data, String[] itm_list);
}
