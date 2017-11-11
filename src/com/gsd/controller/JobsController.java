package com.gsd.controller;

import java.awt.print.PrinterException;
import java.awt.print.PrinterJob;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.swing.UIManager;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.JobsDao;
import com.gsd.model.Jobs;
import com.gsd.model.JobsReference;
import com.gsd.report.PrintInvoice_iText;
import com.gsd.report.PrintJobTicket;
import com.gsd.report.PrintJobTicket_iText;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;
import com.itextpdf.text.DocumentException;

import net.sf.json.JSONObject;

@Controller
public class JobsController {

	private ApplicationContext context;
	private String cus_id,proj_id,itm_id,job_name,dept,start,end;
	private JobsDao jobsDao;
	
	private static final Logger logger = Logger.getLogger(JobsController.class);
	
	public JobsController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.jobsDao = (JobsDao) this.context.getBean("JobsDao");
	}
	
	@RequestMapping(value = "/jobReport")
	public ModelAndView viewJobsReport(HttpServletRequest request, HttpServletResponse response){
		
		HttpSession session = request.getSession();
		session.setAttribute("cus_id", "");
		session.setAttribute("proj_id", "");
		session.setAttribute("itm_id", "");
		session.setAttribute("job_name", "");
		session.setAttribute("dept", "");
		session.setAttribute("start", "");
		session.setAttribute("end", "");
		session.setAttribute("status", "");
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();
		
		if (type == 0 || type == 1) {
			return new ModelAndView("JobReport");
		} else {
			return new ModelAndView("AccessDenied");
		}
		
	}
	
	@RequestMapping(value = "/jobs")
	public ModelAndView viewBilling(HttpServletRequest request, HttpServletResponse response){
		
//		String rootDirectory = request.getSession().getServletContext().getRealPath("/");
//		System.out.println(rootDirectory);
		
		HttpSession session = request.getSession();
		session.setAttribute("cus_id", "");
		session.setAttribute("proj_id", "");
		session.setAttribute("itm_id", "");
		session.setAttribute("job_name", "");
		session.setAttribute("dept", "");
		session.setAttribute("start", "");
		session.setAttribute("end", "");
		session.setAttribute("status", "");
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();
		
		if (type == 0 || type == 1) {
			return new ModelAndView("BillingAdmin");
		} else {
			return new ModelAndView("Billing");
		}
	}
	
	@RequestMapping(value = "/showJobRef")
	public ModelAndView showJobReference(HttpServletRequest request, HttpServletResponse response) {

		List<JobsReference> jobRef = null;
		int id = Integer.parseInt(request.getParameter("id"));
		int type = Integer.parseInt(request.getParameter("type"));
		
		try{
			if(type == 1){
				jobRef = jobsDao.showJobsReferenceByCustomer(id);
			}else if(type == 2){
				jobRef = jobsDao.showJobsReferenceByProject(id);
			}else{
				jobRef = jobsDao.showJobsReference();
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", jobRef);
		jobj.put("total", jobRef.size());

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value = "/chkJobName")
	public ModelAndView chkJobName(@RequestParam("records") String name, HttpServletRequest request,
			HttpServletResponse response){
		
		List<Jobs> jobLs = new ArrayList<Jobs>();
		Jobs jobNull = new Jobs();
		
		try{
			jobLs.add(jobsDao.findByJobName(name));
		} catch (Exception e){
			jobLs.add(jobNull);
		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", jobLs);

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value = "/printInvoice")
	public void printInvoice(HttpServletRequest request, HttpServletResponse response){
		
		try {
			new PrintInvoice_iText().createPdf(request,response);
		} catch (IOException | DocumentException e) {
			logger.error(e.getMessage());
		}
		
	}
	
	@RequestMapping(value = "/printJobTicket")
	public void printJobTicket(HttpServletRequest request, HttpServletResponse response) throws IOException{
	
		int id = Integer.parseInt(request.getParameter("job_ref_id"));
		JobsReference job = jobsDao.searchJobsReferenceByID(id);
		
		try {
			new PrintJobTicket_iText().createPdf(request,response, job);
		} catch (IOException | DocumentException e) {
			logger.error(e.getMessage());
		}
		
//		FileOutputStream fileOut = new FileOutputStream("/Users/gsd/Desktop/GSD-JobTicket.pdf");
//		fileOut.close();
//		return response;
		
//		try {
//            String cn = UIManager.getSystemLookAndFeelClassName();
//            UIManager.setLookAndFeel(cn);
//        } catch (Exception cnf) {
//        }
//        PrinterJob job = PrinterJob.getPrinterJob();
//        job.setPrintable(new PrintJobTicket(myJob));
//        boolean ok = job.printDialog();
//        if (ok) {
//            try {
//                job.print();
//            } catch (PrinterException ex) {
//            	logger.error(ex.getMessage());
//            }
//        }
//        System.exit(0);
	}
	
	@RequestMapping(value="/chkJobRefName")
	public ModelAndView chkCusCode(@RequestParam("records") String job_ref_name, HttpServletRequest request,
			HttpServletResponse response){
		
		List<JobsReference> jobRefLs = new ArrayList<JobsReference>();;
		JobsReference jobRef = null;
		
		String[] name = job_ref_name.split("\n");
		for(int i=0; i<name.length; i++){
			if(name[i].length() > 0){
//				jobRef = jobsDao.searchJobReferenceByName(name[i]);
				jobRefLs.add(jobsDao.searchJobReferenceByName(name[i]));
			}
		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", jobRefLs);
		jobj.put("total", jobRefLs.size());
		
		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value="/searchJobsParam")
	public void searchJobParam(HttpServletRequest request, HttpServletResponse response){
		
		HttpSession session = request.getSession();
		if(request.getParameter("job_id") == "" || request.getParameter("job_id") == null){
			session.setAttribute("cus_id", request.getParameter("scus_id"));
			session.setAttribute("proj_id", request.getParameter("sproj_id"));
	//		session.setAttribute("itm_id", request.getParameter("sitm_id"));
			session.setAttribute("job_name", request.getParameter("sjob_name"));
			session.setAttribute("dept", request.getParameter("sdept"));
	//		session.setAttribute("start", request.getParameter("sbtw_start"));
	//		session.setAttribute("end", request.getParameter("sbtw_end"));
			session.setAttribute("status", request.getParameter("sjob_status"));
			session.setAttribute("first", request.getParameter("first"));
			session.setAttribute("job_id", request.getParameter("job_id"));
		}else{
			session.setAttribute("job_id", request.getParameter("job_id"));
		}
	}
	
	@RequestMapping(value="/searchJobs")
	public ModelAndView searchJobs(HttpServletRequest request, HttpServletResponse response){
		
		HttpSession session = request.getSession();
		List<Jobs> job = null;
		List<Jobs> jobLs = new ArrayList<Jobs>();
		Map<String, String> map = new HashMap<String, String>();
		
		map.put("cus_id", (String)session.getAttribute("cus_id"));
		map.put("proj_id", (String)session.getAttribute("proj_id"));
		map.put("job_name", (String)session.getAttribute("job_name"));
		map.put("dept", (String)session.getAttribute("dept"));
		map.put("status", (String)session.getAttribute("status"));
//		if(((String)session.getAttribute("first")) != null){
			map.put("first", (String)session.getAttribute("first"));
//		}else{
//			map.put("first", "");
//		}
		
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
		}catch(Exception e){
			logger.error(e.getMessage());
		}
			
		JSONObject jobj = new JSONObject();
//		jobj.put("records", jobLs);
		jobj.put("records", job);
		jobj.put("total", job.size());
		
		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value="/searchJobsReference")
	public ModelAndView searchJobsReference(HttpServletRequest request, HttpServletResponse response){
		
		HttpSession session = request.getSession();
		int job_id = Integer.parseInt((String) session.getAttribute("job_id"));
		
		List<JobsReference> jobRef = null;
		List<JobsReference> jobRefLs = new ArrayList<JobsReference>();

		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));
		
		jobRef = jobsDao.searchJobsReference(job_id,"DESC");
				
		if(limit + start > jobRef.size()) {
			limit = jobRef.size();
		} else {
			limit += start;
		}
		for (int i = start; i < limit; i++) {
			jobRefLs.add(jobRef.get(i));
		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", jobRefLs);
		jobj.put("total", jobRef.size());

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value="/searchTodayJobs")
	public ModelAndView searchTodayJobs(HttpServletRequest request, HttpServletResponse response){
		
		HttpSession session = request.getSession();
		List<Jobs> job = null;
		List<Jobs> jobLs = new ArrayList<Jobs>();
		Map<String, String> map = new HashMap<String, String>();
		
		map.put("cus_id", (String)session.getAttribute("cus_id"));
		map.put("proj_id", (String)session.getAttribute("proj_id"));
		map.put("job_name", (String)session.getAttribute("job_name"));
		map.put("dept", (String)session.getAttribute("dept"));
		map.put("status", (String)session.getAttribute("status"));
	
		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));
		
		try{
			job = jobsDao.searchTodayJobs(map);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		
		if(limit + start > job.size()) {
			limit = job.size();
		} else {
			limit += start;
		}
		for (int i = start; i < limit; i++) {
			jobLs.add(job.get(i));
		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", job);
		jobj.put("total", job.size());
		
		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value="/searchTodayJobsReference")
	public ModelAndView searchTodayJobsReference(HttpServletRequest request, HttpServletResponse response){
		
		HttpSession session = request.getSession();
		List<JobsReference> jobRef = null;
		Map<String, String> map = new HashMap<String, String>();
		String dept = request.getParameter("grid_dept");
		
		map.put("cus_id", (String)session.getAttribute("cus_id"));
		map.put("proj_id", (String)session.getAttribute("proj_id"));
		map.put("job_name", (String)session.getAttribute("job_name"));
//		map.put("dept", (String)session.getAttribute("dept"));
		map.put("dept", dept);
		map.put("status", (String)session.getAttribute("status"));
	
		try{
			jobRef = jobsDao.searchTodayJobsReference(map);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", jobRef);
		jobj.put("total", jobRef.size());
		
		return new ModelAndView("jsonView", jobj);
	}
	
//	@RequestMapping(value="/searchJobsReference")
//	public ModelAndView searchJobsReference(HttpServletRequest request, HttpServletResponse response){
//		
//		HttpSession session = request.getSession();
//		List<Jobs> job = null;
//		List<Jobs> jobLs = new ArrayList<Jobs>();
//		Map<String, String> map = new HashMap<String, String>();
//		
//		map.put("cus_id", (String)session.getAttribute("cus_id"));
//		map.put("proj_id", (String)session.getAttribute("proj_id"));
//		map.put("itm_id", (String)session.getAttribute("itm_id"));
//		map.put("job_name", (String)session.getAttribute("job_name"));
//		map.put("dept", (String)session.getAttribute("dept"));
//		map.put("start", (String)session.getAttribute("start"));
//		map.put("end", (String)session.getAttribute("end"));
//		map.put("status", (String)session.getAttribute("status"));
//		map.put("sort", "job_in,cus_name DESC");
//		
//		int start = Integer.parseInt(request.getParameter("start"));
//		int limit = Integer.parseInt(request.getParameter("limit"));
//		
//		try{
//			job = jobsDao.searchJobsReference(map);
//			
//			if(limit + start > job.size()) {
//				limit = job.size();
//			} else {
//				limit += start;
//			}
//			for (int i = start; i < limit; i++) {
//				jobLs.add(job.get(i));
//			}
//		} catch (Exception e){
//			System.out.println("searchJobs Error: " + e.getMessage());
//		}
//		
//		JSONObject jobj = new JSONObject();
//		jobj.put("records", jobLs);
//		jobj.put("total", job.size());
//
//		return new ModelAndView("jsonView", jobj);
//	}
	
	@RequestMapping(value="/createJob")
	public ModelAndView createJob(HttpServletRequest request, HttpServletResponse response){
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int usr_id = user.getUserModel().getUsr_id();
		
		String job_name = request.getParameter("ajob_name");
		String dept = request.getParameter("adept");
		String job_dtl = request.getParameter("ajob_dtl");
		String status = request.getParameter("ajob_status");
		int proj_id = Integer.parseInt(request.getParameter("aproj_id"));
		
		Jobs job = new Jobs();
		job.setJob_id(jobsDao.getLastJobId());
		job.setJob_name(job_name);
		job.setCretd_usr(usr_id);
		job.setProj_id(proj_id);
		job.setDept(dept);
		job.setJob_status(status);
		
		if(!job_dtl.equals("Details")){
			job_dtl = job_dtl.replace("\u2028", "\n");
			job_dtl = job_dtl.replace("\u2029", "\n");
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
		
		int job_id = Integer.parseInt(request.getParameter("ejob_id"));
		String job_name = request.getParameter("ejob_name");
		String job_dtl = request.getParameter("ejob_dtl");
		String status = request.getParameter("ejob_status");
		int proj_id = Integer.parseInt(request.getParameter("eproj_id"));
		UserDetailsApp user = UserLoginDetail.getUser();
		int userType = user.getUserModel().getUsr_type();
		String dept = "";
		if(userType == 0 || userType == 1){
			dept = request.getParameter("edept");
		}else{
			Jobs myJob = new Jobs();
			myJob = jobsDao.searchJobsByID(job_id);
			dept = myJob.getDept();
		}
		
		Jobs job = new Jobs();
		job.setJob_id(job_id);
		job.setJob_name(job_name);
		job.setProj_id(proj_id);
		job.setDept(dept);
		job.setJob_status(status);
		
		if(!job_dtl.equals("Details")){
			job_dtl = job_dtl.replace("\u2028", "\n");
			job_dtl = job_dtl.replace("\u2029", "\n");
			job.setJob_dtl(job_dtl);
		}else{
			job.setJob_dtl("");
		}
		
		jobsDao.updateJob(job);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value="/createJobReference")
	public ModelAndView createJobReference(HttpServletRequest request, HttpServletResponse response){
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int usr_id = user.getUserModel().getUsr_id();
		Timestamp job_in_ts = null;
		Timestamp job_out_ts = null;
		
		int job_id = Integer.parseInt(request.getParameter("arefjob_id"));
		String proj_ref_id = request.getParameter("aproj_ref_id");
		String job_ref_name = request.getParameter("ajob_ref_name");
		String amount = request.getParameter("aamount");
		String job_in = request.getParameter("ajob_in");
		String job_out = request.getParameter("ajob_out")+" "+request.getParameter("atime");
		String job_dtl = request.getParameter("ajob_ref_dtl");
		String job_ref_status = request.getParameter("ajob_ref_status");
		String job_ref_number = request.getParameter("ajob_ref_number");
		
		List<JobsReference> jobRefLs = new ArrayList<JobsReference>();
		JobsReference jobRef = new JobsReference();
		jobRef.setJob_id(job_id);
		jobRef.setCretd_usr(usr_id);
		jobRef.setJob_ref_status(job_ref_status);
		
		
		if(!job_in.equals("Date in")){
			try{
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			    Date parsedJobIn = dateFormat.parse(job_in);
			    job_in_ts = new java.sql.Timestamp(parsedJobIn.getTime());
			}catch(Exception e){
				logger.error(e.getMessage());
			}
		}
		
		if(!job_out.equals("Date out")){
			try{
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
				Date parsedJobOut = dateFormat.parse(job_out);
				job_out_ts = new java.sql.Timestamp(parsedJobOut.getTime());
			}catch(Exception e){
				logger.error(e.getMessage());
			}
		}
		
		jobRef.setJob_in_ts(job_in_ts);
		jobRef.setJob_out_ts(job_out_ts);
		
		if(!job_ref_number.equals("Job Number")){
			jobRef.setJob_ref_number(job_ref_number);
		}else{
			jobRef.setJob_ref_number("");
		}
		
		if(!proj_ref_id.equals("Item Name")){
			jobRef.setProj_ref_id(Integer.parseInt(proj_ref_id));
		}else{
			jobRef.setProj_ref_id(0);
		}
		
		if(!amount.equals("Amount or Hours")){
			jobRef.setAmount(Integer.parseInt(amount));
		}else{
			jobRef.setAmount(0);
		}
		
		if(!job_dtl.equals("Job Details")){
			job_dtl = job_dtl.replace("\u2028", "\n");
			job_dtl = job_dtl.replace("\u2029", "\n");
			jobRef.setJob_ref_dtl(job_dtl);
		}else{
			jobRef.setJob_ref_dtl("");
		}
		
		job_ref_name = job_ref_name.replace("\u2028", "\n");
		job_ref_name = job_ref_name.replace("\u2029", "\n");
		String[] name = job_ref_name.split("\n");
		for(int i=0; i<name.length; i++){
			if(name[i].length() > 0){
				jobRef.setJob_ref_id(jobsDao.getLastJobReferenceId());
				jobRef.setJob_ref_name(name[i]);
				JobsReference jobRef2 = new JobsReference();
				jobRef2.setJob_ref_id(jobRef.getJob_ref_id());
				jobRefLs.add(jobRef2);
				jobsDao.createJobReference(jobRef);
			}
		}
		
//		for(int x=0;x<jobRefLs.size(); x++){
//			System.out.println(jobRefLs.get(x).getJob_ref_id());
//		}
//		
//		if(print == null){
//		}else if(print.equals("yes")){
//			JobsReference myJob = jobsDao.searchJobsReferenceByID(jobRef.getJob_ref_id());
//			PrinterJob printerJob = PrinterJob.getPrinterJob();
//			printerJob.setPrintable(new PrintJobTicket(myJob));
//	        boolean ok = printerJob.printDialog();
//	        if (ok) {
//	            try {
//	            	printerJob.print();
//	            } catch (PrinterException ex) {
//	            	logger.error(ex.getMessage());
//	            }
//	        }
//		}
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		model.put("records", jobRefLs);
		model.put("total", jobRefLs.size());
		
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value="/updateJobReference")
	public ModelAndView updateJobReference(HttpServletRequest request, HttpServletResponse response){
		
		Timestamp job_in_ts = null;
		Timestamp job_out_ts = null;
		
		int job_ref_id = Integer.parseInt(request.getParameter("ejob_ref_id"));
		String proj_ref_id = request.getParameter("eproj_ref_id");
		String job_ref_name = request.getParameter("ejob_ref_name");
		String amount = request.getParameter("eamount");
		String job_in = request.getParameter("ejob_in");
		String job_out = request.getParameter("ejob_out")+" "+request.getParameter("etime");
		String job_dtl = request.getParameter("ejob_ref_dtl");
		String job_ref_status = request.getParameter("ejob_ref_status");
		String job_ref_number = request.getParameter("ejob_ref_number");
		
		JobsReference jobRef = new JobsReference();
		jobRef.setJob_ref_id(job_ref_id);
		jobRef.setJob_ref_name(job_ref_name);
		jobRef.setJob_ref_status(job_ref_status);
		
		if(!job_in.equals("Date in")){
			try{
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			    Date parsedJobIn = dateFormat.parse(job_in);
			    job_in_ts = new java.sql.Timestamp(parsedJobIn.getTime());
			}catch(Exception e){
				logger.error(e.getMessage());
			}
		}
		
		if(!job_out.equals("Date out")){
			try{
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
				Date parsedJobOut = dateFormat.parse(job_out);
				job_out_ts = new java.sql.Timestamp(parsedJobOut.getTime());
			}catch(Exception e){
				logger.error(e.getMessage());
			}
		}
		
		jobRef.setJob_in_ts(job_in_ts);
		jobRef.setJob_out_ts(job_out_ts);
		
		if(!job_ref_number.equals("Job Number")){
			jobRef.setJob_ref_number(job_ref_number);
		}else{
			jobRef.setJob_ref_number("");
		}
		
		if(!proj_ref_id.equals("Item Name")){
			jobRef.setProj_ref_id(Integer.parseInt(proj_ref_id));
		}else{
			jobRef.setProj_ref_id(0);
		}
		
		if(!amount.equals("Amount or Hours")){
			jobRef.setAmount(Integer.parseInt(amount));
		}else{
			jobRef.setAmount(0);
		}
		
		if(!job_dtl.equals("Job Details")){
			job_dtl = job_dtl.replace("\u2028", "\n");
			job_dtl = job_dtl.replace("\u2029", "\n");
			jobRef.setJob_ref_dtl(job_dtl);
		}else{
			jobRef.setJob_ref_dtl("");
		}
		
		jobsDao.updateJobReference(jobRef);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value="/updateJobReferenceBatch")
	public ModelAndView updateJobReferenceBatch(HttpServletRequest request, HttpServletResponse response){
		
//		try{
			Object data = request.getParameter("data");
			List<JobsReference> jobRefLs = jobsDao.getListDataFromRequest(data);
			
//			System.out.println("data = "+data);
//			System.out.println("model.size() = "+jobRefLs.size());
			
			if(jobRefLs.size() != 0){
				for(int i=0;i<jobRefLs.size();i++){
					
					Timestamp job_in_ts = null;
					Timestamp job_out_ts = null;
					
						try{
							String job_in = jobRefLs.get(i).getJob_in();
							SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
						    Date parsedJobIn = dateFormat.parse(job_in);
						    job_in_ts = new java.sql.Timestamp(parsedJobIn.getTime());
						}catch(Exception e){
							logger.error(e.getMessage());
						}
					
						try{
							String job_out = jobRefLs.get(i).getJob_out();
							SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
							Date parsedJobOut = dateFormat.parse(job_out);
							job_out_ts = new java.sql.Timestamp(parsedJobOut.getTime());
						}catch(Exception e){
							logger.error(e.getMessage());
						}

					jobRefLs.get(i).setJob_in_ts(job_in_ts);
					jobRefLs.get(i).setJob_out_ts(job_out_ts);
				}
				jobsDao.updateJobReferenceBatch(jobRefLs);
			}
			
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("success", true);
			return new ModelAndView("jsonView", model);
			
//		}catch(Exception e){
//			logger.error(e.getMessage());
//			Map<String,Object> modelMap = new HashMap<String,Object>();
//			modelMap.put("message", e.getMessage());
//			modelMap.put("success", false);
//
//			return new ModelAndView("jsonView",modelMap);
//		}
		
	}
	
	@RequestMapping(value="/deleteJob")
	public void deleteJobs(HttpServletRequest request, HttpServletResponse response){
		
		int id = Integer.parseInt(request.getParameter("id"));
		try{
			jobsDao.deleteJob(id);
		}catch(Exception e){
			logger.error("Cannot delete job_id = "+id+"\n"+e.getMessage());
		}
	}
	
	@RequestMapping(value="/deleteJobReference")
	public void deleteJobsReference(HttpServletRequest request, HttpServletResponse response){
		
		int id = Integer.parseInt(request.getParameter("id"));
		try{
			jobsDao.deleteJobReference(id);
		}catch(Exception e){
			logger.error("Cannot delete job_ref_id = "+id+"\n"+e.getMessage());
		}
	}
	
	@RequestMapping(value="billedProjects")
	public ModelAndView billedJobProjects(HttpServletRequest request, HttpServletResponse response){
		
		int id = Integer.parseInt(request.getParameter("id"));
		try{
			jobsDao.billedJobProjects(id);
		}catch(Exception e){
			logger.error("Cannot change status to billed on job_id = "+id+"\n"+e.getMessage());
		}
		
		List<Jobs> jobLs = new ArrayList<Jobs>();
		jobLs.add(jobsDao.searchJobsByID(id));
		
		JSONObject jobj = new JSONObject();
		jobj.put("jobs", jobLs);
		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value="printReport")
	public ModelAndView printReport(HttpServletRequest request, HttpServletResponse response) {
		
		int job_id = Integer.parseInt(request.getParameter("job_id"));
		
		Jobs job = jobsDao.searchJobsByID(job_id);
		List<JobsReference> jobRef = jobsDao.searchJobsReference(job_id,"ASC");
		List<JobsReference> item = jobsDao.getItemNameFromJobID(job_id);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", jobRef);
		map.put("jobs", job);
		map.put("item", item);
		
		return new ModelAndView("report-print", map);
	}
	
	@RequestMapping(value="radarItem")
	public ModelAndView radarItem(HttpServletRequest request, HttpServletResponse response){
		
		List<Jobs> job = new ArrayList<Jobs>();
		Map<String, String> map = new HashMap<String, String>();
		
		map.put("cus_id", cus_id);
		map.put("proj_id", proj_id);
		map.put("itm_id", itm_id);
		map.put("job_name", job_name);
		map.put("dept", dept);
		map.put("start", start);
		map.put("end", end);
		
		job = jobsDao.radarItem(map);
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", job);
		jobj.put("total", job.size());

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value="dailyRadar")
	public ModelAndView dailyRadar(HttpServletRequest request, HttpServletResponse response){
		
		List<Jobs> job = new ArrayList<Jobs>();
		String itm = request.getParameter("dept_list");
		String[] dept_list = itm.split(",");
		Map<String, String> map = new HashMap<String, String>();
		
		map.put("cus_id", cus_id);
		map.put("proj_id", proj_id);
		map.put("itm_id", itm_id);
		map.put("job_name", job_name);
		map.put("dept", dept);
		map.put("start", start);
		map.put("end", end);
		
		job = jobsDao.dailyRadar(map, dept_list);
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", job);
		jobj.put("total", job.size());

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value="stackItem")
	public ModelAndView stackItem(HttpServletRequest request, HttpServletResponse response){
		
		List<Jobs> job = new ArrayList<Jobs>();
		Map<String, String> map = new HashMap<String, String>();
		
		map.put("cus_id", cus_id);
		map.put("proj_id", proj_id);
		map.put("itm_id", itm_id);
		map.put("job_name", job_name);
		map.put("dept", dept);
		map.put("start", start);
		map.put("end", end);
		
		job = jobsDao.stackItem(map);
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", job);
		jobj.put("total", job.size());

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value="dailyStack")
	public ModelAndView dailyStack(HttpServletRequest request, HttpServletResponse response){
		
		List<Jobs> job = new ArrayList<Jobs>();
		String itm = request.getParameter("itm_list");
		String[] itm_list = itm.split(",");
		Map<String, String> map = new HashMap<String, String>();
		
		map.put("cus_id", cus_id);
		map.put("proj_id", proj_id);
		map.put("itm_id", itm_id);
		map.put("job_name", job_name);
		map.put("dept", dept);
		map.put("start", start);
		map.put("end", end);
		
		job = jobsDao.dailyStack(map, itm_list);
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", job);
		jobj.put("total", job.size());

		return new ModelAndView("jsonView", jobj);
	}
	
}
