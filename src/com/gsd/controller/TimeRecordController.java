package com.gsd.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.CustomerDao;
import com.gsd.dao.JobsDao;
import com.gsd.dao.ProjectsDao;
import com.gsd.dao.TimeRecordDao;
import com.gsd.dao.UserDao;
import com.gsd.model.Customer;
import com.gsd.model.Jobs;
import com.gsd.model.JobsReference;
import com.gsd.model.Projects;
import com.gsd.model.TimeRecord;
import com.gsd.model.TimeRecordReference;
import com.gsd.model.User;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

import net.sf.json.JSONObject;

@Controller
public class TimeRecordController {

	private ApplicationContext context;
	private TimeRecordDao timeRecordDao;
	private JobsDao jobsDao;
	private CustomerDao customerDao;
	private UserDao userDao;
	private ProjectsDao projectsDao;
	private static final Logger logger = Logger.getLogger(TimeRecordController.class);
	
	public TimeRecordController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.timeRecordDao = (TimeRecordDao) this.context.getBean("TimeRecordDao");
		this.jobsDao = (JobsDao) this.context.getBean("JobsDao");
		this.customerDao = (CustomerDao) this.context.getBean("CustomerDao");
		this.userDao = (UserDao) this.context.getBean("UserDao");
		this.projectsDao = (ProjectsDao) this.context.getBean("ProjectsDao");
	}
	
	@RequestMapping(value = "/timeRecord")
	public ModelAndView viewTimeRecord(HttpServletRequest request, HttpServletResponse response) {
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();
		UserController uc = new UserController();
		
		if(request.getParameter("job_ref_id") != null && request.getParameter("job_ref_id") != null){
			uc.setChkTR(Integer.parseInt(request.getParameter("job_ref_id")));
		}
		
		HttpSession session = request.getSession();
		session.setAttribute("tr_name", "");
		session.setAttribute("job_ref_id", "");
		session.setAttribute("cus_id", "");
		session.setAttribute("usr_id", "");
		session.setAttribute("record_start", "");
		session.setAttribute("record_finish", "");
		session.setAttribute("proj_id", "");
		session.setAttribute("dept", "");
		session.setAttribute("job_status", "");
		session.setAttribute("process", "");
		
		if(type == 0 || type == 1){
			return new ModelAndView("TimeRecordAdmin");
		}else{
			return new ModelAndView("TimeRecord");
		}
	}
	
	@RequestMapping(value = "/searchTimeRecordParam")
	public void searchTimeRecordParam(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession session = request.getSession();
		session.setAttribute("tr_name", request.getParameter("str_name"));
		session.setAttribute("job_ref_id", request.getParameter("sjob_ref_id"));
		session.setAttribute("cus_id", request.getParameter("scus_id"));
		session.setAttribute("usr_id", request.getParameter("susr_id"));
		session.setAttribute("record_start", request.getParameter("record_start"));
		session.setAttribute("record_finish", request.getParameter("record_finish"));
		session.setAttribute("proj_id", request.getParameter("sproj_id"));
		session.setAttribute("dept", request.getParameter("sdept"));
		session.setAttribute("job_status", request.getParameter("sjob_status"));
		session.setAttribute("process", request.getParameter("sprocess"));

	}
	
	@RequestMapping(value = "/searchTimeRecord")
	public ModelAndView searchTimeRecord(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession session = request.getSession();
		List<TimeRecord> timeRecord = null;
		List<TimeRecord> trLs = new ArrayList<TimeRecord>();
		Map<String, String> map = new HashMap<String, String>();
		
		map.put("tr_name", (String)session.getAttribute("tr_name"));
		map.put("job_ref_id", (String)session.getAttribute("job_ref_id"));
		map.put("cus_id", (String)session.getAttribute("cus_id"));
		map.put("usr_id", (String)session.getAttribute("usr_id"));
		map.put("record_start", (String)session.getAttribute("record_start"));
		map.put("record_finish", (String)session.getAttribute("record_finish"));
		map.put("proj_id", (String)session.getAttribute("proj_id"));
		map.put("dept", (String)session.getAttribute("dept"));
		map.put("job_status", (String)session.getAttribute("job_status"));
		map.put("process", (String)session.getAttribute("process"));
		map.put("searchType", "");
		
		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));
		
		try {
			timeRecord = timeRecordDao.searchTimeRecord(map);
			
			if(limit + start > timeRecord.size()) {
				limit = timeRecord.size();
			} else {
				limit += start;
			}
			for (int i = start; i < limit; i++) {
				trLs.add(timeRecord.get(i));
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", trLs);
		jobj.put("total", timeRecord.size());

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value = "/showTimeRecordReference")
	public ModelAndView showTimeRecordReference(HttpServletRequest request, HttpServletResponse response) {
	
		List<TimeRecordReference> trRef = null;
		String tr_ref_kind = request.getParameter("kind");
		String tr_ref_dept = request.getParameter("dept");
		
		try {
			trRef = timeRecordDao.showTimeRecordReference(tr_ref_kind, tr_ref_dept);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", trRef);
		jobj.put("total", trRef.size());
		
		return new ModelAndView("jsonView", jobj);
		
	}
	
	@RequestMapping(value = "/printTimeReport")
	public ModelAndView printTimeReport(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession session = request.getSession();
		List<TimeRecord> timeRecord = null;
		Map<String, String> map = new HashMap<String, String>();
		
		String job_ref_name = "";
		String cus_name = "";
		String cus_code = "";
		String usr_name = "";
		String proj_name = "";
		
		map.put("tr_name", (String)session.getAttribute("tr_name"));
		map.put("job_ref_id", (String)session.getAttribute("job_ref_id"));
		map.put("cus_id", (String)session.getAttribute("cus_id"));
		map.put("usr_id", (String)session.getAttribute("usr_id"));
		map.put("record_start", (String)session.getAttribute("record_start"));
		map.put("record_finish", (String)session.getAttribute("record_finish"));
		map.put("proj_id", (String)session.getAttribute("proj_id"));
		map.put("dept", (String)session.getAttribute("dept"));
		map.put("job_status", (String)session.getAttribute("job_status"));
		map.put("process", (String)session.getAttribute("process"));
		map.put("searchType", "report");
		
		try{
			timeRecord = timeRecordDao.searchTimeRecord(map);
			
			if(map.get("job_ref_id")==null || map.get("job_ref_id").isEmpty()){
			}else{
				int id = Integer.parseInt((String)session.getAttribute("job_ref_id"));
				JobsReference jobRef = new JobsReference();
				jobRef = jobsDao.searchJobsReferenceByID(id);
				job_ref_name = jobRef.getJob_ref_name();
			}
			if(map.get("cus_id")==null || map.get("cus_id").isEmpty()){
			}else{
				int cus_id = Integer.parseInt((String)session.getAttribute("cus_id"));
				Customer cus = new Customer();
				cus = customerDao.findByCusID(cus_id);
				cus_name = cus.getCus_name();
				cus_code = cus.getCus_code();
			}
			if(map.get("usr_id")==null || map.get("usr_id").isEmpty()){
			}else{
				int usr_id = Integer.parseInt((String)session.getAttribute("usr_id"));
				User usr = new User();
				usr = userDao.findByUserID(usr_id);
				usr_name = usr.getUsr_name();
			}
			if(map.get("proj_id")==null || map.get("proj_id").isEmpty()){
			}else{
				int proj_id = Integer.parseInt((String)session.getAttribute("proj_id"));
				Projects proj = new Projects();
				proj = projectsDao.findByProjectID(proj_id);
				proj_name = proj.getProj_name();
			}
			
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		
		Map<String, Object> map2 = new HashMap<String, Object>();
		map2.put("list", timeRecord);
		map2.put("tr_name", (String)session.getAttribute("tr_name"));
		map2.put("job_ref_name", job_ref_name);
		map2.put("cus_name", cus_name);
		map2.put("cus_code", cus_code);
		map2.put("usr_name", usr_name);
		map2.put("record_start", (String)session.getAttribute("record_start"));
		map2.put("record_finish", (String)session.getAttribute("record_finish"));
		map2.put("proj_name", proj_name);
		map2.put("dept", (String)session.getAttribute("dept"));
		map2.put("job_status", (String)session.getAttribute("job_status"));
		map2.put("process", (String)session.getAttribute("process"));
		
		return new ModelAndView("timerecord-print", map2);
	}
}
