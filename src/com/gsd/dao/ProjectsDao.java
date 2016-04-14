package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.FileModel;
import com.gsd.model.Jobs;
import com.gsd.model.Projects;

public interface ProjectsDao {

	public List<Projects> showProjects();
	
	public List<Projects> searchProjects(Map<String, String> data);

	public int getLastProjectId();

	public int getLastFileId();
	
	public int getLastJobId();
	
	public void createProjects(Projects proj);
	
	public void createFile(FileModel file);

	public FileModel getFile(int id);
	
	public void updateFile(FileModel file);
	
	public void updateProjects(Projects proj);
	
	public void updateJobs(Jobs job);
	
	public void deleteProject(int id);
	
	public void deleteFile(int id);
	
	public void deleteJob(int id);
	
	public List<Jobs> showJobs();

	public List<Jobs> searchJobs(Map<String, String> data);

	public void createJobs(Jobs job);
	
	public Jobs findByJobName(String name);
}
