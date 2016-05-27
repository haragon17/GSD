package com.gsd.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.ItemDao;
import com.gsd.model.Item;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

import net.sf.json.JSONObject;

@Controller
public class ItemController {

	private ApplicationContext context;
	private ItemDao itemDao;

	public ItemController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.itemDao = (ItemDao) this.context.getBean("ItemDao");
	}

	@RequestMapping(value = "/itemManagement")
	public ModelAndView viewItemManament(HttpServletRequest request, HttpServletResponse response) {

		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();

		if (type == 0) {
			return new ModelAndView("ItemManagement");
		} else {
			return new ModelAndView("AccessDenied");
		}
	}

	@RequestMapping(value = "/showItem")
	public ModelAndView showItem(HttpServletRequest request, HttpServletResponse response) {

		List<Item> itm = null;
		int proj_id = Integer.parseInt(request.getParameter("id"));

		try {
			itm = itemDao.showItem(proj_id);
		} catch (Exception e) {
			System.out.println("Error: " + e.getMessage());
		}

		JSONObject jobj = new JSONObject();
		jobj.put("records", itm);
		jobj.put("total", itm.size());

		return new ModelAndView("jsonView", jobj);
	}

	@RequestMapping(value = "/searchItem")
	public ModelAndView searchItem(HttpServletRequest request, HttpServletResponse response) {

		List<Item> itm = null;
		List<Item> itmLs = new ArrayList<Item>();
		String search = request.getParameter("search");

		if (search == null) {
			search = "";
		}

		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));

		try {
			itm = itemDao.searchItem(search);

			if (limit + start > itm.size()) {
				limit = itm.size();
			} else {
				limit += start;
			}
			for (int i = start; i < (limit); i++) {
				itmLs.add(itm.get(i));
			}
		} catch (Exception e) {
			System.out.println("Error: " + e.getMessage());
		}

		JSONObject jobj = new JSONObject();
		jobj.put("records", itmLs);
		jobj.put("total", itm.size());

		return new ModelAndView("jsonView", jobj);
	}

	@RequestMapping(value = "chkItmName")
	public ModelAndView chkItmName(@RequestParam("records") String itm_name, HttpServletRequest request,
			HttpServletResponse response) {

		List<Item> itmLs = new ArrayList<Item>();
		Item itmNull = new Item();

		try {
			itmLs.add(itemDao.findByItmName(itm_name));
		} catch (Exception e) {
			itmLs.add(itmNull);
		}

		JSONObject jobj = new JSONObject();
		jobj.put("records", itmLs);

		return new ModelAndView("jsonView", jobj);
	}

	@RequestMapping(value = "/updateItem")
	public ModelAndView updateItem(HttpServletRequest request, HttpServletResponse response) {

		int itm_id = Integer.parseInt(request.getParameter("eitm_id"));
		String itm_name = request.getParameter("eitm_name");
		String itm_desc = request.getParameter("eitm_desc");

		Item itm = new Item();
		itm.setItm_id(itm_id);
		itm.setItm_name(itm_name);

		if (!itm_desc.equals("Description")) {
			itm.setItm_desc(itm_desc);
		} else {
			itm.setItm_desc("");
		}

		itemDao.updateItem(itm);

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);

		return new ModelAndView("jsonView", model);
	}

	@RequestMapping(value = "/addItem")
	public ModelAndView addItem(HttpServletRequest request, HttpServletResponse response) {

		UserDetailsApp user = UserLoginDetail.getUser();

		String itm_name = request.getParameter("aitm_name");
		String itm_desc = request.getParameter("aitm_desc");

		Item itm = new Item();
		itm.setItm_id(itemDao.getLastItemId());
		itm.setItm_name(itm_name);
		itm.setCretd_usr(user.getUserModel().getUsr_id());

		if (!itm_desc.equals("Description")) {
			itm.setItm_desc(itm_desc);
		} else {
			itm.setItm_desc("");
		}

		itemDao.createItem(itm);

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);

		return new ModelAndView("jsonView", model);
	}

	@RequestMapping(value = "/deleteItem")
	public void deleteMember(HttpServletRequest request, HttpServletResponse response) {

		int id = Integer.parseInt(request.getParameter("id"));
		itemDao.deleteItem(id);

	}

}
