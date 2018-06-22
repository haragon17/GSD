package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.FileModel;
import com.gsd.model.Projects;
import com.gsd.model.ProjectsReference;

public interface ProjectsDao {

	public List<ProjectsReference> showProjectsReference(int proj_id);
	
	public List<ProjectsReference> searchProjectsReferences(Map<String, String> data);

	public int getLastProjectRefId();

	public int getLastFileId();
	
	public int getLastProjectId();
	
	public void createProjectsReference(ProjectsReference proj);
	
	public void createFile(FileModel file);

	public FileModel getFile(int id);
	
	public void updateFile(FileModel file);
	
	public void updateProjectsReference(ProjectsReference proj);
	
	public void updateProjects(Projects proj);
	
	public void deleteProjectsReference(int id);
	
	public void deleteFile(int id);
	
	public void deleteProjects(int id);
	
	public List<Projects> showProjects(int cus_id, String type);

	public List<Projects> searchProjects(Map<String, String> data);

	public void createProjects(Projects proj);
	
	public Projects findByProjectName(String name);
	
	public Projects findByProjectID(int proj_id);
}
