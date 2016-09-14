package com.gsd.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.ReportDao;
import com.gsd.model.Report;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

@Controller
public class ReportController {

	private ApplicationContext context;
	private ReportDao reportDao;
	private String name, cate1, cate2, cate3, screate, ecreate, supdate, eupdate;

	public ReportController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.reportDao = (ReportDao) this.context.getBean("ReportDao");
	}

	@RequestMapping(value = "/report")
	public ModelAndView view(HttpServletRequest request, HttpServletResponse response) {
		// LOG.debug("Inside LogListing page on method view");
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();

		if (type == 0) {
			return new ModelAndView("ReportAdmin");
		} else {
			return new ModelAndView("Report");
		}
	}

	@RequestMapping(value = "/searchReportParam")
	public void searchReportParam(HttpServletRequest request, HttpServletResponse response) {

		name = request.getParameter("name");
		cate1 = request.getParameter("cate1");
		cate2 = request.getParameter("cate2");
		cate3 = request.getParameter("cate3");
		screate = request.getParameter("screate");
		ecreate = request.getParameter("ecreate");
		supdate = request.getParameter("supdate");
		eupdate = request.getParameter("eupdate");

	}

	@RequestMapping(value = "/searchReport")
	public ModelAndView searchReport(HttpServletRequest request, HttpServletResponse response) {

		List<Report> results = null;
		List<Report> temp = new ArrayList<Report>();
		Map<String, String> map = new HashMap<String, String>();

		map.put("name", name);
		map.put("cate1", cate1);
		map.put("cate2", cate2);
		map.put("cate3", cate3);
		map.put("screate", screate);
		map.put("ecreate", ecreate);
		map.put("supdate", supdate);
		map.put("eupdate", eupdate);

		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));

		try {
			results = reportDao.searchReport(map);

			if (limit + start > results.size()) {
				limit = results.size();
			} else {
				limit += start;
			}
			for (int i = start; i < (limit); i++) {
				temp.add(results.get(i));
			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		JSONObject jObj = new JSONObject();

		jObj.put("records", temp);
		jObj.put("total", results.size());

		return new ModelAndView("jsonView", jObj);
	}

//	@RequestMapping(value = "/printReport")
//	public ModelAndView printReport(HttpServletRequest request, HttpServletResponse response) {
//
//		Map<String, String> map = new HashMap<String, String>();
//
//		map.put("name", name);
//		map.put("cate1", cate1);
//		map.put("cate2", cate2);
//		map.put("cate3", cate3);
//		map.put("screate", screate);
//		map.put("ecreate", ecreate);
//		map.put("supdate", supdate);
//		map.put("eupdate", eupdate);
//
//		List<Report> list;
//		try {
//			list = reportDao.searchReport(map);
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			return null;
//		}
//		Map<String, Object> map1 = new HashMap<String, Object>();
//		map1.put("list", list);
//		map1.put("name", name);
//		map1.put("cate1", cate1);
//		map1.put("cate2", cate2);
//		map1.put("cate3", cate3);
//		map1.put("screate", screate);
//		map1.put("ecreate", ecreate);
//		map1.put("supdate", supdate);
//		map1.put("eupdate", eupdate);
//
//		return new ModelAndView("report-print", map1);
//	}

}
