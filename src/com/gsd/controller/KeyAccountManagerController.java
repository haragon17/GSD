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
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.KeyAccountManagerDao;
import com.gsd.model.Item;
import com.gsd.model.KeyAccountManager;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

import net.sf.json.JSONObject;

@Controller
public class KeyAccountManagerController {

	private ApplicationContext context;
	private KeyAccountManagerDao keyAccMngDao;
	private String key_acc_name;

	public KeyAccountManagerController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.keyAccMngDao = (KeyAccountManagerDao) this.context.getBean("KeyAccountManagerDao");
	}
	
	@RequestMapping(value = "/showKeyAccMng")
	public ModelAndView showKeyAccountManager(HttpServletRequest request,
			HttpServletResponse response){
		
		List<KeyAccountManager> keyAccMng = keyAccMngDao.showKeyAccMng();
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", keyAccMng);
		jobj.put("total", keyAccMng.size());
		
		return new ModelAndView("jsonView",jobj);
	}
	
	@RequestMapping(value="/keyAccountManagerment")
	public ModelAndView viewKeyAccMng(HttpServletRequest request,
			HttpServletResponse response){
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();
		
		if(type == 0 || type == 1){
			return new ModelAndView("KeyAccountManagement");
		}else{
			return new ModelAndView("AccessDenied");
		}
	}
	
	@RequestMapping(value = "/searchKeyAccMngParam")
	public void searchItemParam(HttpServletRequest request, HttpServletResponse response){
		key_acc_name = request.getParameter("search");
	}
	
	@RequestMapping(value = "/searchKeyAccMng")
	public ModelAndView searchItem(HttpServletRequest request, HttpServletResponse response) {

		List<KeyAccountManager> itm = null;
		List<KeyAccountManager> itmLs = new ArrayList<KeyAccountManager>();

		if (key_acc_name == null) {
			key_acc_name = "";
		}

		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));

		try {
			itm = keyAccMngDao.searchKeyAccMng(key_acc_name);

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
	
	@RequestMapping(value = "/updateKeyAccMng")
	public ModelAndView updateItem(HttpServletRequest request, HttpServletResponse response) {

		int key_acc_id = Integer.parseInt(request.getParameter("ekey_acc_id"));
		String key_acc_name = request.getParameter("ekey_acc_name");

		KeyAccountManager keyAccMng = new KeyAccountManager();
		keyAccMng.setKey_acc_id(key_acc_id);
		keyAccMng.setKey_acc_name(key_acc_name);

		keyAccMngDao.updateKeyAccMng(keyAccMng);

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);

		return new ModelAndView("jsonView", model);
	}

	@RequestMapping(value = "/addKeyAccMng")
	public ModelAndView addItem(HttpServletRequest request, HttpServletResponse response) {

		String key_acc_name = request.getParameter("akey_acc_name");

		KeyAccountManager keyAccMng = new KeyAccountManager();
		keyAccMng.setKey_acc_id(keyAccMngDao.getLastKeyAccId());
		keyAccMng.setKey_acc_name(key_acc_name);

		keyAccMngDao.createKeyAccMng(keyAccMng);

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);

		return new ModelAndView("jsonView", model);
	}

	@RequestMapping(value = "/deleteKeyAccMng")
	public void deleteMember(HttpServletRequest request, HttpServletResponse response) {

		int id = Integer.parseInt(request.getParameter("id"));
		keyAccMngDao.updateCustomer(id);
		keyAccMngDao.deleteKeyAccMng(id);

	}
	
}
