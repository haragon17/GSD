package com.gsd.controller;

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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.CategoryManagementDao;
import com.gsd.model.Category;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

@Controller
public class CategoryManagementController {

	private ApplicationContext context;
	private CategoryManagementDao cateDao;
	private String cc1;
	private String cc2;

	public CategoryManagementController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.cateDao = (CategoryManagementDao) this.context.getBean("CategoryManagementDao");
	}

	@RequestMapping(value = "/categoryManagement")
	public ModelAndView viewCategoryManagement(HttpServletRequest request, HttpServletResponse response) {
		// LOG.debug("Inside LogListing page on method view");
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();

		if (type == 0) {
			return new ModelAndView("CategoryManagement");
		} else {
			return new ModelAndView("AccessDenied");
		}
	}

	@RequestMapping(value = "/showCate1")
	public ModelAndView showCate1(HttpServletRequest request, HttpServletResponse response) {

		List<Category> cate1 = cateDao.showCate1();

		JSONObject jobj = new JSONObject();
		jobj.put("records", cate1);
		jobj.put("total", cate1.size());

		response.setCharacterEncoding("UTF-8");
		return new ModelAndView("jsonView", jobj);
	}

	@RequestMapping(value = "/showCate2")
	public ModelAndView showCate2(@RequestParam("id") String id, HttpServletRequest request,
			HttpServletResponse response) {

		if (id.equals("")) {
		} else {
			cc1 = id;
		}
		List<Category> cate2 = cateDao.showCate2(cc1);

		JSONObject jobj = new JSONObject();
		jobj.put("records2", cate2);
		jobj.put("total2", cate2.size());

		response.setCharacterEncoding("UTF-8");
		return new ModelAndView("jsonView", jobj);
	}

	@RequestMapping(value = "/showCate3")
	public ModelAndView showCate3(@RequestParam("id") String id, HttpServletRequest request,
			HttpServletResponse response) {

		if (id.equals("")) {
		} else {
			cc2 = id;
		}
		List<Category> cate3 = cateDao.showCate3(cc2);

		JSONObject jobj = new JSONObject();
		jobj.put("records3", cate3);
		jobj.put("total3", cate3.size());

		response.setCharacterEncoding("UTF-8");
		return new ModelAndView("jsonView", jobj);
	}

	@RequestMapping(value = "createCate1", method = RequestMethod.POST)
	public void createCate1(HttpServletRequest request, HttpServletResponse response) {

		String cate_desc = request.getParameter("desc1");
		String comment = request.getParameter("comment1");
		if (comment.equals("Comment")) {
			comment = "";
		}
		Category cate = new Category();
		cate.setCate_desc(cate_desc);
		cate.setComment(comment);
		cate.setCate_lv(1);
		cate.setCate_ref(0);
		cate.setCate_id(cateDao.getLastCateId());

		cateDao.createCate(cate);
	}

	@RequestMapping(value = "createCate2", method = RequestMethod.POST)
	public void createCate2(HttpServletRequest request, HttpServletResponse response) {

		String cate_desc = request.getParameter("desc2");
		String comment = request.getParameter("comment2");
		int ref = Integer.parseInt(request.getParameter("ref2-inputEl"));
		if (comment.equals("Comment")) {
			comment = "";
		}

		Category cate = new Category();
		cate.setCate_desc(cate_desc);
		cate.setComment(comment);
		cate.setCate_lv(2);
		cate.setCate_ref(ref);
		cate.setCate_id(cateDao.getLastCateId());

		cateDao.createCate(cate);
	}

	@RequestMapping(value = "createCate3", method = RequestMethod.POST)
	public void createCate3(HttpServletRequest request, HttpServletResponse response) {

		String cate_desc = request.getParameter("desc3");
		String comment = request.getParameter("comment3");
		int ref = Integer.parseInt(request.getParameter("ref3-inputEl"));
		if (comment.equals("Comment")) {
			comment = "";
		}

		Category cate = new Category();
		cate.setCate_desc(cate_desc);
		cate.setComment(comment);
		cate.setCate_lv(3);
		cate.setCate_ref(ref);
		cate.setCate_id(cateDao.getLastCateId());

		cateDao.createCate(cate);
	}

	@RequestMapping(value = "updateCate", method = RequestMethod.POST)
	public ModelAndView updateCate(HttpServletRequest request, HttpServletResponse response) {

		try {
			Object data = request.getParameter("data");
			List<Category> listCate = cateDao.getListDataFromRequest(data);
			if (listCate.size() != 0) {
				if (this.cateDao.updateCate1(listCate)) {
					listCate.clear();
					listCate = this.cateDao.showCate1();
				}
			} else {
				// LOG.error("Inside ParamTblController.updateHdr method ::
				// Update DAO fail");
			}
			Map<String, Object> model = new HashMap<String, Object>();
			// model.put("total",listCate.size());
			// model.put("records",listCate);
			model.put("success", true);

			return new ModelAndView("jsonView", model);

		} catch (Exception e) {

			Map<String, Object> modelMap = new HashMap<String, Object>();
			modelMap.put("message", e.getMessage());
			modelMap.put("success", false);

			return new ModelAndView("jsonView", modelMap);
		}

	}

	@RequestMapping(value = "deleteCate", method = RequestMethod.POST)
	public ModelAndView deleteCate1(HttpServletRequest request, HttpServletResponse response, String data) {

		try {
			// JSONArray jsonArray=JSONArray.fromObject(data);
			List<Category> listCate = cateDao.getListDataFromRequest(data);
			if (listCate.size() != 0) {
				if (this.cateDao.deleteCate1(listCate)) {
					listCate.clear();
					listCate = this.cateDao.showCate1();
				}
			}

			Map<String, Object> model = new HashMap<String, Object>();
			model.put("total", listCate.size());
			model.put("records", listCate);
			model.put("success", true);
			return new ModelAndView("jsonView", model);

		} catch (Exception e) {

			Map<String, Object> modelMap = new HashMap<String, Object>();
			modelMap.put("message", e.getMessage());
			modelMap.put("success", false);

			return new ModelAndView("jsonView", modelMap);
		}
	}

}
