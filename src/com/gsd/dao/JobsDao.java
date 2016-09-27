package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.Jobs;
import com.gsd.model.JobsReference;

public interface JobsDao {

	public int getLastJobId();
	
	public int getLastJobReferenceId();
	
	public List<Jobs> searchJobs(Map<String, String> data);
	
	public Jobs searchJobsByID(int id);
	
	public List<JobsReference> getItemNameFromJobID(int id);
	
	public List<Jobs> searchJobsReference_old(Map<String, String> data);
	
	public List<JobsReference> searchJobsReference(int id, String sort);
	
	public JobsReference searchJobsReferenceByID(int id);
	
	public List<JobsReference> searchJobReferenceByName(String name);
	
	public void createJob(Jobs job);
	
	public void updateJob(Jobs job);
	
	public void deleteJob(int id);
	
	public void createJobReference(JobsReference jobRef);
	
	public void updateJobReference(JobsReference jobRef);
	
	public void deleteJobReference(int id);
	
	public List<Jobs> radarItem(Map<String, String> data);
	
	public List<Jobs> dailyRadar(Map<String, String> data, String[] dept_list);
	
	public List<Jobs> stackItem(Map<String, String> data);
	
	public List<Jobs> dailyStack(Map<String, String> data, String[] itm_list);
}
