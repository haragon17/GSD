package com.gsd.controller;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.io.IOUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.WorkingsDao_old;
import com.gsd.model.FileModel;
import com.gsd.model.FileUploadBean;
import com.gsd.model.Workings_old;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

@Controller
public class WorkingsController_old {

	private ApplicationContext context;
	private WorkingsDao_old workingsDao;
	private String name,cname,cate1,cate2,cate3,supdate,eupdate;
	
	public WorkingsController_old(){
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
//		this.workingsDao = (WorkingsDao_old) this.context.getBean("WorkingsDao");
	}
	
	@RequestMapping(value = "/workings_old")
	public ModelAndView viewWorkings(HttpServletRequest request,
			HttpServletResponse response){
//		LOG.debug("Inside LogListing page on method view");

		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();
		
		if(type == 0){
			return new ModelAndView("WorkingsAdmin");
		}else{
			return new ModelAndView("MyWorkings");
		}
	}
	
	@RequestMapping(value = "/showWorkings")
	public ModelAndView showWorkings(HttpServletRequest request,
			HttpServletResponse response){
		
		UserDetailsApp user = UserLoginDetail.getUser();
		String search = request.getParameter("search");
		List<Workings_old> wrks = workingsDao.showWorkings(search,user.getUserModel().getUsr_id());
		
		JSONObject jobj=new JSONObject();
		jobj.put("records", wrks);
		jobj.put("total", wrks.size());
		
		response.setCharacterEncoding("UTF-8");
		return new ModelAndView("jsonView",jobj);
		}
	
	@RequestMapping(value = "/searchWorkingsParam")
	public void searchParam(HttpServletRequest request,
			HttpServletResponse response){
		
		name = request.getParameter("name");
		cate1 = request.getParameter("cate1");
		cate2 = request.getParameter("cate2");
		cate3 = request.getParameter("cate3");
		cname = request.getParameter("cname");
		supdate = request.getParameter("supdate");
		eupdate = request.getParameter("eupdate");
		
	}
	
	@RequestMapping(value = "/showWorkingsAdmin")
	public ModelAndView showWorkingsAdmin(HttpServletRequest request,
			HttpServletResponse response){
		
		List<Workings_old> results = null;
		List<Workings_old> temp = new ArrayList<Workings_old>();
		Map<String, String> map = new HashMap<String, String>();

		map.put("name", name);
		map.put("cate1", cate1);
		map.put("cate2", cate2);
		map.put("cate3", cate3);
		map.put("cname", cname);
		map.put("supdate", supdate);
		map.put("eupdate", eupdate);
		
		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));
		
		try{
			results = workingsDao.showWorkingsAdmin(map);
			
			if(limit+start > results.size()){
			    limit = results.size();
			   }else{
			    limit += start;
			   }
			   for(int i=start;i<(limit);i++){
			    temp.add(results.get(i));
			   }
			
		}catch (Exception e){
			e.printStackTrace();
		}
		
		JSONObject jobj=new JSONObject();
		
		jobj.put("records", temp);
		jobj.put("total", results.size());
		
		response.setCharacterEncoding("UTF-8");
		return new ModelAndView("jsonView",jobj);
		}
	
	@RequestMapping(value = "/createWorkings")
	public ModelAndView createWorkings(HttpServletRequest request,
			HttpServletResponse response,FileUploadBean uploadItem,BindingResult result){

		UserDetailsApp user =UserLoginDetail.getUser();
		
		String name =request.getParameter("name");
		String cate1 = request.getParameter("cate1");
		String cate2 = request.getParameter("cate2");
		String cate3 = request.getParameter("cate3");
		String file = request.getParameter("file");
		String keyword = request.getParameter("keyword");
		String detail = request.getParameter("detail");
		
		Workings_old wrks = new Workings_old();
		FileModel fileModel = new FileModel();
		
		wrks.setWrk_id(workingsDao.getLastWrkId());
		wrks.setWrk_name(name);
		if(!cate1.equals("Category 1")){
			wrks.setCate_lv1(Integer.parseInt(cate1));
		}else{
			wrks.setCate_lv1(0);
		}
		if(!cate2.equals("Category 2")){
			wrks.setCate_lv2(Integer.parseInt(cate2));
		}else{
			wrks.setCate_lv2(0);
		}
		if(!cate3.equals("Category 3")){
			wrks.setCate_lv3(Integer.parseInt(cate3));
		}else{
			wrks.setCate_lv3(0);
		}
		if(!keyword.equals("java,art,animal,etc...")){
			wrks.setKeyword(keyword);
		}else{
			wrks.setKeyword("");
		}
		if(!detail.equals("Workings Details")){
			wrks.setWrk_dtl(detail);
		}else{
			wrks.setWrk_dtl("");
		}
		wrks.setCretd_usr(user.getUserModel().getUsr_id());
		
		
		System.out.println("name = "+wrks.getWrk_name());
		System.out.println("cate1 = "+wrks.getCate_lv1());
		System.out.println("cate2 = "+wrks.getCate_lv2());
		System.out.println("cate3 = "+wrks.getCate_lv3());
		System.out.println("keyword = "+wrks.getKeyword());
		System.out.println("detail = "+wrks.getWrk_dtl());
		
		JSONObject jobj=new JSONObject();
//		jobj.put("records", userLs);
		
		  OutputStream outputStream = null;
		  
		  System.out.println("---------------------------------");
		  System.out.println("file name = "+uploadItem.getFile().getOriginalFilename());
		  System.out.println("file type = "+uploadItem.getFile().getContentType());
		  System.out.println("file size = "+uploadItem.getFile().getSize());
		  
//		  MultipartFile fileUpload = uploadItem.getFile();

		  if (result.hasErrors()) {
			  System.out.println("error");
		   return new ModelAndView("MyWorkings");
		  }else{

		  try {
//		   File createMain = new File("C:/files");
		   File createMain = new File("/Users/gsd/files");
		   if(!createMain.exists()){
			   createMain.mkdir();
		   }
		   String fileName = uploadItem.getFile().getOriginalFilename();  
//		   String filePath = "C:/files/" + user.getUsername();
		   String filePath = "/Users/gsd/files/" + user.getUsername();
		   File newFile = new File(filePath);
		   if(!newFile.exists()){
			   newFile.mkdir();
		   }
		   
		   File newFile2 = new File(filePath +"/"+ fileName);

		   outputStream = new FileOutputStream(newFile2);
		   outputStream.write(uploadItem.getFile().getFileItem().get());
		   outputStream.close();

		   fileModel.setFile_id(workingsDao.getLastFileId());
		   fileModel.setFile_path(filePath +"/"+ fileName);
		   fileModel.setFile_name(uploadItem.getFile().getOriginalFilename());
		   fileModel.setFile_type(uploadItem.getFile().getContentType());
		   fileModel.setFile_size(uploadItem.getFile().getSize());
		   fileModel.setCretd_usr(user.getUserModel().getUsr_id());
		  
		  } catch (IOException e) {
		   // TODO Auto-generated catch block
		   e.printStackTrace();
		  }
		  
		  workingsDao.createWorkings(wrks, fileModel);

		
		return new ModelAndView("redirect:workings.htm");
		  }
	}
	
	@RequestMapping(value = "/editWorkings")
	public ModelAndView editWorkings(HttpServletRequest request,
			HttpServletResponse response,FileUploadBean uploadItem,BindingResult result){

		UserDetailsApp user =UserLoginDetail.getUser();
		System.out.println(request.getParameter("eid"));
		
		int id = Integer.parseInt(request.getParameter("wid"));
		String name =request.getParameter("ename");
		String cate1 = request.getParameter("ecate1");
		String cate2 = request.getParameter("ecate2");
		String cate3 = request.getParameter("ecate3");
		int file_id = Integer.parseInt(request.getParameter("eid"));
		String keyword = request.getParameter("ekeyword");
		String detail = request.getParameter("edetail");
		
		Workings_old wrks = new Workings_old();
		FileModel fileModel = new FileModel();
		
		wrks.setWrk_id(id);
		wrks.setWrk_name(name);
		if(!cate1.equals("Category 1")){
			wrks.setCate_lv1(Integer.parseInt(cate1));
		}else{
			wrks.setCate_lv1(0);
		}
		if(!cate2.equals("Category 2")){
			wrks.setCate_lv2(Integer.parseInt(cate2));
		}else{
			wrks.setCate_lv2(0);
		}
		if(!cate3.equals("Category 3")){
			wrks.setCate_lv3(Integer.parseInt(cate3));
		}else{
			wrks.setCate_lv3(0);
		}
		if(!keyword.equals("java,art,animal,etc...")){
			wrks.setKeyword(keyword);
		}else{
			wrks.setKeyword("");
		}
		if(!detail.equals("Workings Details")){
			wrks.setWrk_dtl(detail);
		}else{
			wrks.setWrk_dtl("");
		}
		
		System.out.println("name = "+wrks.getWrk_name());
		System.out.println("cate1 = "+wrks.getCate_lv1());
		System.out.println("cate2 = "+wrks.getCate_lv2());
		System.out.println("cate3 = "+wrks.getCate_lv3());
		System.out.println("keyword = "+wrks.getKeyword());
		System.out.println("detail = "+wrks.getWrk_dtl());
		System.out.println("file id = "+file_id);
		
		  OutputStream outputStream = null;
		  
		  if (result.hasErrors()) {
			  System.out.println("error");
		  }else{
			  FileModel dfile = workingsDao.getFile(file_id);
			  if(!uploadItem.getFile().isEmpty()){

				  File dFile2 = new File(dfile.getFile_path());
				  dFile2.delete();
				  
				  try {
//				   File createMain = new File("C:/files");
				   File createMain = new File("/Users/gsd/files");  
				   if(!createMain.exists()){
					   createMain.mkdir();
				   }
				   String fileName = uploadItem.getFile().getOriginalFilename();  
//				   String filePath = "C:/files/" + user.getUsername();
				   String filePath = "/Users/gsd/files/" + user.getUsername();
				   File newFile = new File(filePath);
				   if(!newFile.exists()){
					   newFile.mkdir();
				   }
				   
				   File newFile2 = new File(filePath +"/"+ fileName);
		
				   outputStream = new FileOutputStream(newFile2);
				   outputStream.write(uploadItem.getFile().getFileItem().get());
				   outputStream.close();
				   
				   fileModel.setFile_id(file_id);
				   fileModel.setFile_path(filePath +"/"+ fileName);
				   fileModel.setFile_name(uploadItem.getFile().getOriginalFilename());
				   fileModel.setFile_type(uploadItem.getFile().getContentType());
				   fileModel.setFile_size(uploadItem.getFile().getSize());
				  
				   workingsDao.updateFile(fileModel);
				   
				  } catch (IOException e) {
				   // TODO Auto-generated catch block
				   e.printStackTrace();
				  }
			  }else{
				  System.out.println("No file upload");
			  }
		  }
		  
		  workingsDao.updateWorkings(wrks);
		  
		  return new ModelAndView("redirect:workings.htm");
	}
	
	@RequestMapping(value="download")
	public void doDownload(HttpServletRequest   request,HttpServletResponse response) throws Exception{

		try{
			int id=Integer.valueOf(request.getParameter("file"));
			FileModel fm=new FileModel();
			fm = workingsDao.getFile(id);
			
			File file = new File(fm.getFile_path() + "/" +fm.getFile_name());
			InputStream in =new BufferedInputStream(new FileInputStream(file));
			response.setContentType(fm.getFile_type());
	        response.setHeader("Content-Disposition","attachment; filename=\"" + fm.getFile_name() +"\"");
			ServletOutputStream out = response.getOutputStream();
			IOUtils.copy(in, out);
			response.flushBuffer();
			in.close();
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
	}
	
	@RequestMapping(value = "/deleteWorkings")
	public void deleteWorkings(HttpServletRequest request,
			HttpServletResponse response){
//		LOG.debug("Inside LogListing page on method view");

		int id = Integer.parseInt(request.getParameter("id"));
		int fid = Integer.parseInt(request.getParameter("fid"));
		
		FileModel dfile = workingsDao.getFile(fid);
		
		File dFile2 = new File(dfile.getFile_path());
		
		if(dFile2.delete()){
			workingsDao.deleteWorkings(id);
			System.out.println("delete workings "+id);
		}else{
			System.out.println("can't delete workings "+id);
		}
		
	}
	
}
