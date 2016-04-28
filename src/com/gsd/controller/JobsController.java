package com.gsd.controller;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.JobsDao;
import com.gsd.model.Jobs;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

import net.sf.json.JSONObject;

@Controller
public class JobsController {

	private ApplicationContext context;
	private JobsDao jobsDao;
	
	public JobsController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.jobsDao = (JobsDao) this.context.getBean("JobsDao");
	}
	
	@RequestMapping(value = "/jobReport")
	public ModelAndView viewJobsReport(HttpServletRequest request, HttpServletResponse response){
		
		return new ModelAndView("JobReport");
		
	}
	
	@RequestMapping(value="/searchJobs")
	public ModelAndView searchJobs(HttpServletRequest request, HttpServletResponse response){
		
		List<Jobs> job = null;
		List<Jobs> jobLs = new ArrayList<Jobs>();
		Map<String, String> map = new HashMap<String, String>();
		
		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));
		
		try{
			job = jobsDao.searchJobs(map);
			
			if(limit + start > job.size()) {
				limit = job.size();
			} else {
				limit += start;
			}
			for (int i = start; i < limit; i++) {
				jobLs.add(job.get(i));
			}
		} catch (Exception e){
			System.out.println("searchJobs Error: " + e.getMessage());
		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", jobLs);
		jobj.put("total", job.size());

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value="/createJob")
	public ModelAndView createJob(HttpServletRequest request, HttpServletResponse response){
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int usr_id = user.getUserModel().getUsr_id();
		Timestamp job_in_ts = null;
		Timestamp job_out_ts = null;
		
		int proj_ref_id = Integer.parseInt(request.getParameter("aproj_ref_id"));
		String job_name = request.getParameter("ajob_name");
		int amount = Integer.parseInt(request.getParameter("aamount"));
		String dept = request.getParameter("adept");
		String job_in = request.getParameter("ajob_in");
		String job_out = request.getParameter("ajob_out");
		String job_dtl = request.getParameter("ajob_dtl");
		
		Jobs job = new Jobs();
		job.setJob_id(jobsDao.getLastJobId());
		job.setJob_name(job_name);
		job.setProj_ref_id(proj_ref_id);
		job.setAmount(amount);
		job.setDept(dept);
		job.setCretd_usr(usr_id);
		
		try{
		    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		    Date parsedJobIn = dateFormat.parse(job_in);
		    Date parsedJobOut = dateFormat.parse(job_out);
		    job_in_ts = new java.sql.Timestamp(parsedJobIn.getTime());
		    job_out_ts = new java.sql.Timestamp(parsedJobOut.getTime());
		}catch(Exception e){
			System.out.println(e);
		}
		
		job.setJob_in_ts(job_in_ts);
		job.setJob_out_ts(job_out_ts);
		
		if(!job_dtl.equals("Job Details")){
			job.setJob_dtl(job_dtl);
		}else{
			job.setJob_dtl("");
		}
		
		jobsDao.createJob(job);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value="/updateJob")
	public ModelAndView updateJob(HttpServletRequest request, HttpServletResponse response){
		
		Timestamp job_in_ts = null;
		Timestamp job_out_ts = null;
		int job_id = Integer.parseInt(request.getParameter("ejob_id"));
		int proj_ref_id = Integer.parseInt(request.getParameter("eproj_ref_id"));
		String job_name = request.getParameter("ejob_name");
		int amount = Integer.parseInt(request.getParameter("eamount"));
		String dept = request.getParameter("edept");
		String job_in = request.getParameter("ejob_in");
		String job_out = request.getParameter("ejob_out");
		String job_dtl = request.getParameter("ejob_dtl");
		
		Jobs job = new Jobs();
		job.setJob_id(job_id);
		job.setJob_name(job_name);
		job.setProj_ref_id(proj_ref_id);
		job.setAmount(amount);
		job.setDept(dept);
		
		try{
		    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		    Date parsedJobIn = dateFormat.parse(job_in);
		    Date parsedJobOut = dateFormat.parse(job_out);
		    job_in_ts = new java.sql.Timestamp(parsedJobIn.getTime());
		    job_out_ts = new java.sql.Timestamp(parsedJobOut.getTime());
		}catch(Exception e){
			System.out.println(e);
		}
		
		job.setJob_in_ts(job_in_ts);
		job.setJob_out_ts(job_out_ts);
		
		if(!job_dtl.equals("Job Details")){
			job.setJob_dtl(job_dtl);
		}else{
			job.setJob_dtl("");
		}
		
		jobsDao.updateJob(job);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value="/deleteJob")
	public void deleteJobs(HttpServletRequest request, HttpServletResponse response){
		
		int id = Integer.parseInt(request.getParameter("id"));
		try{
			jobsDao.deleteJob(id);
		}catch(Exception e){
			System.out.println("Cannot delete job_id = "+id+"\n"+e.getMessage());
		}
	}
	
}
