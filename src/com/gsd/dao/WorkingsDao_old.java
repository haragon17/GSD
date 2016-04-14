package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.FileModel;
import com.gsd.model.Workings_old;

public interface WorkingsDao_old {
	
	public void createWorkings(Workings_old wrks,FileModel file);
	
	public void updateWorkings(Workings_old wrks);
	
	public void updateFile(FileModel file);
	
	public List<Workings_old> showWorkings(String search, int id);
	
	public List<Workings_old> showWorkingsAdmin(Map<String, String> data);
	
	public FileModel getFile(int id);
	
	public void deleteWorkings(int id);
	
	public int getLastWrkId();
	
	public int getLastFileId();
}
