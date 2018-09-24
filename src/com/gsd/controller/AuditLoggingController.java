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

import com.gsd.dao.AuditLoggingDao;
import com.gsd.model.AuditLogging;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

import net.sf.json.JSONObject;

@Controller
public class AuditLoggingController {

	private ApplicationContext context;
	private AuditLoggingDao auditLoggingDao;
	
	private static final Logger logger = Logger.getLogger(AuditLoggingController.class);
	
	public AuditLoggingController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.auditLoggingDao = (AuditLoggingDao) this.context.getBean("AuditLoggingDao");
	}
	
	@RequestMapping(value = "/auditLogging")
	public ModelAndView viewAuditLogging(HttpServletRequest request, HttpServletResponse response){
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();
		
		if(type == 0 || type == 1){
			return new ModelAndView("AuditLoggingAdmin");
		}else if(type == 2){
			return new ModelAndView("AuditLogging");
		}else{
			return new ModelAndView("AccessDenied");
		}
	}
	
	@RequestMapping(value = "/searchAudditParam")
	public void searchAuditParam(HttpServletRequest request, HttpServletResponse response){
		
		HttpSession session = request.getSession();
		session.setAttribute("parent_ref", request.getParameter("sparent_ref"));
		session.setAttribute("parent_object", request.getParameter("sparent_object"));
		session.setAttribute("commit_start", request.getParameter("commit_start"));
		session.setAttribute("commit_finish", request.getParameter("commit_finish"));
		session.setAttribute("commit_type", request.getParameter("scommit_type"));
		session.setAttribute("first_aud", request.getParameter("first_aud"));
		
	}
	
	@RequestMapping(value = "/searchAuditLogging")
	public ModelAndView showAuditLogging(HttpServletRequest request, HttpServletResponse response){
	
		HttpSession session = request.getSession();
		List<AuditLogging> aud = null;
		List<AuditLogging> audLs = new ArrayList<AuditLogging>();
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();
		String dept = "";
		if(type != 1 && type != 0){
			dept = user.getUserModel().getDept();
		}
		Map<String, String> map = new HashMap<String, String>();
		map.put("parent_ref", (String)session.getAttribute("parent_ref"));
		map.put("parent_object", (String)session.getAttribute("parent_object"));
		map.put("commit_start", (String)session.getAttribute("commit_start"));
		map.put("commit_finish", (String)session.getAttribute("commit_finish"));
		map.put("commit_type", (String)session.getAttribute("commit_type"));
		map.put("aud_dept", dept);
		map.put("first_aud", (String)session.getAttribute("first_aud"));
		
		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));
		
//		try{
			
			aud = auditLoggingDao.searchAuditLogging(map);
			
			if (limit + start > aud.size()) {
				limit = aud.size();
			} else {
				limit += start;
			}
			for (int i = start; i < (limit); i++) {
				audLs.add(aud.get(i));
			}
//		} catch (Exception e) {
//			logger.error(e.getMessage());
//		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", audLs);
		jobj.put("total", aud.size());
		
		return new ModelAndView("jsonView", jobj);
	}
	
}
