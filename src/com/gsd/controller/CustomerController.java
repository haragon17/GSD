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
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.CustomerDao;
import com.gsd.model.Customer;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

import net.sf.json.JSONObject;

@Controller
public class CustomerController {

	private ApplicationContext context;
	private CustomerDao customerDao;
//	private String scus_id,scus_name, scus_code, skey_acc_id, scus_email;
	
	private static final Logger logger = Logger.getLogger(CustomerController.class);
	
	public CustomerController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.customerDao = (CustomerDao) this.context.getBean("CustomerDao");
	}
	
	@RequestMapping(value = "/customer")
	public ModelAndView viewCustomer(HttpServletRequest request,
			HttpServletResponse response){
		
//		scus_name = "";
//		scus_code = "";
//		scus_id = "";
//		skey_acc_id = "";
//		scus_email = "";
		
		HttpSession session = request.getSession();
		session.setAttribute("scus_name", "");
		session.setAttribute("scus_code", "");
		session.setAttribute("scus_id", "");
		session.setAttribute("skey_acc_mng", "");
		session.setAttribute("scus_email", "");
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();

		if (type == 0 || type == 1) {
			return new ModelAndView("CustomerManagement");
		} else {
			return new ModelAndView("AccessDenied");
		}
	}
	
	@RequestMapping(value = "/searchCustomerParam")
	public void searchReportParam(HttpServletRequest request, HttpServletResponse response) {

		HttpSession session = request.getSession();
		session.setAttribute("scus_name", request.getParameter("scus_name"));
		session.setAttribute("scus_code", request.getParameter("scus_code"));
		session.setAttribute("scus_id", request.getParameter("scus_id"));
		session.setAttribute("skey_acc_mng", request.getParameter("skey_acc_mng"));
		session.setAttribute("scus_email", request.getParameter("scus_email"));
		
//		scus_name = request.getParameter("scus_name");
//		scus_code = request.getParameter("scus_code");
//		scus_id = request.getParameter("scus_id");
//		skey_acc_id = request.getParameter("skey_acc_mng");
//		scus_email = request.getParameter("scus_email");

	}
	
	@RequestMapping(value = "/showCustomer")
	public ModelAndView showCustomer(HttpServletRequest request, HttpServletResponse response) {
		
		List<Customer> cus = null;
		
		cus = customerDao.showCustomer();
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", cus);
		jobj.put("total", cus.size());

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value = "/searchCustomer")
	public ModelAndView searchCustomer(HttpServletRequest request, HttpServletResponse response) throws Exception {

		HttpSession session = request.getSession();
		List<Customer> cus = null;
		List<Customer> cusLs = new ArrayList<Customer>();
		Map<String, String> map = new HashMap<String, String>();

//		map.put("cus_name", scus_name);
//		map.put("cus_code", scus_code);
//		map.put("cus_id", scus_id);
//		map.put("key_acc_id", skey_acc_id);
//		map.put("cus_email", scus_email);
		
		map.put("cus_name", (String)session.getAttribute("scus_name"));
		map.put("cus_code", (String)session.getAttribute("scus_code"));
		map.put("cus_id", (String)session.getAttribute("scus_id"));
		map.put("key_acc_id", (String)session.getAttribute("skey_acc_mng"));
		map.put("cus_email", (String)session.getAttribute("scus_email"));
		
		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));
		
		try {
			cus = customerDao.searchCustomer(map);

			if (limit + start > cus.size()) {
				limit = cus.size();
			} else {
				limit += start;
			}
			for (int i = start; i < (limit); i++) {
				cusLs.add(cus.get(i));
			}

		} catch (Exception e) {
			System.out.println("Error: "+e.getMessage());
		}

		JSONObject jobj = new JSONObject();
		jobj.put("records", cusLs);
		jobj.put("total", cus.size());

		return new ModelAndView("jsonView", jobj);

	}
	
	@RequestMapping(value="/chkCusCode")
	public ModelAndView chkCusCode(@RequestParam("records") String cus_code, HttpServletRequest request,
			HttpServletResponse response){
		
		List<Customer> cusLs = new ArrayList<Customer>();
		Customer cusNull = new Customer();
		
		try{
			cusLs.add(customerDao.findByCusCode(cus_code));
		} catch (Exception e){
			cusLs.add(cusNull);
		}
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", cusLs);

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value="/addCustomer")
	public ModelAndView addCustomer(HttpServletRequest request, HttpServletResponse response){
		
		UserDetailsApp user = UserLoginDetail.getUser();
		
		String cus_name = request.getParameter("acus_name");
		String cus_code = request.getParameter("acus_code");
		String address = request.getParameter("aaddress");
		String contact_person = request.getParameter("acontact_person");
		String cus_phone = request.getParameter("acus_phone");
		String cus_fax = request.getParameter("acus_fax");
		String cus_email = request.getParameter("acus_email");
		String bill_to = request.getParameter("abill_to");
		String billing_terms = request.getParameter("abilling_terms");
		String transfer_dtl = request.getParameter("atransfer_dtl");
		String regist_date = request.getParameter("aregist_date");
		int topix_cus_id = Integer.parseInt(request.getParameter("atopix_cus_id"));
		int payment_terms = Integer.parseInt(request.getParameter("apayment_terms"));
		Timestamp regist_date_ts = null;
		int key_acc_id = 0;
		
		try{
			key_acc_id = Integer.parseInt(request.getParameter("akey_acc_mng"));
		}catch(Exception e){
			
		}
		
		Customer cus = new Customer();
		cus.setCus_id(customerDao.getLastCustomerId());
		cus.setCus_name(cus_name);
		cus.setCus_code(cus_code);
		cus.setKey_acc_id(key_acc_id);
		cus.setCretd_usr(user.getUserModel().getUsr_id());
		cus.setTopix_cus_id(topix_cus_id);
		cus.setPayment_terms(payment_terms);
		
		if(!regist_date.equals("Register Date")){
			try{
			    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			    Date parsedDate = dateFormat.parse(regist_date);
			    regist_date_ts = new java.sql.Timestamp(parsedDate.getTime());
			}catch(Exception e){
				logger.error(e);
			}
			cus.setRegist_date_ts(regist_date_ts);
		}else{
			cus.setRegist_date_ts(null);
		}
		
		cus.setRegist_date_ts(regist_date_ts);
		
		if(!address.equals("Address")){
			address = address.replace("\u2028", "\n");
			address = address.replace("\u2029", "\n");
			cus.setAddress(address);
		}else{
			cus.setAddress("");
			}
		if(!contact_person.equals("Contact Person")){
		cus.setContact_person(contact_person);
		}else{
			cus.setContact_person("");
		}
		if(!cus_email.equals("E-mail")){
			cus.setCus_email(cus_email);
		}else{
			cus.setCus_email("");
		}
		if(!cus_phone.equals("Phone Number")){
			cus.setCus_phone(cus_phone);
		}else{
			cus.setCus_phone("");
		}
		if(!cus_fax.equals("Fax Number")){
			cus.setCus_fax(cus_fax);
		}else{
			cus.setCus_fax("");
		}
		if(!bill_to.equals("Billing To")){
			cus.setBill_to(bill_to);
		}else{
			cus.setBill_to("");
		}
		if(!billing_terms.equals("Billing Terms")){
			cus.setBilling_terms(billing_terms);
		}else{
			cus.setBilling_terms("");
		}
		if(!transfer_dtl.equals("Transfer Detail")){
			transfer_dtl = transfer_dtl.replace("\u2028", "\n");
			transfer_dtl = transfer_dtl.replace("\u2029", "\n");
			cus.setTransfer_dtl(transfer_dtl);
		}else{
			cus.setTransfer_dtl("");
		}
		
		customerDao.createCustomer(cus);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);

		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value="/updateCustomer")
		public ModelAndView updateCustomer(HttpServletRequest request, HttpServletResponse response){
			
			int cus_id = Integer.parseInt(request.getParameter("ecus_id"));
			String cus_name = request.getParameter("ecus_name");
			String cus_code = request.getParameter("ecus_code");
			String address = request.getParameter("eaddress");
			String cus_phone = request.getParameter("ecus_phone");
			String cus_fax = request.getParameter("ecus_fax");
			String contact_person = request.getParameter("econtact_person");
			int key_acc_id = Integer.parseInt(request.getParameter("ekey_acc_mng"));
			String cus_email = request.getParameter("ecus_email");
			String bill_to = request.getParameter("ebill_to");
			String billing_terms = request.getParameter("ebilling_terms");
			String transfer_dtl = request.getParameter("etransfer_dtl");
			String regist_date = request.getParameter("eregist_date");
			int topix_cus_id = Integer.parseInt(request.getParameter("etopix_cus_id"));
			int payment_terms = Integer.parseInt(request.getParameter("epayment_terms"));
			Timestamp regist_date_ts = null;
			
			Customer cus = new Customer();
			cus.setCus_id(cus_id);
			cus.setCus_name(cus_name);
			cus.setCus_code(cus_code);
			cus.setKey_acc_id(key_acc_id);
			cus.setTopix_cus_id(topix_cus_id);
			cus.setPayment_terms(payment_terms);
			
			if(!regist_date.equals("Register Date")){
				try{
				    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				    Date parsedDate = dateFormat.parse(regist_date);
				    regist_date_ts = new java.sql.Timestamp(parsedDate.getTime());
				}catch(Exception e){
					logger.error(e);
				}
				cus.setRegist_date_ts(regist_date_ts);
			}else{
				cus.setRegist_date_ts(null);
			}
			
			if(!address.equals("Address")){
				address = address.replace("\u2028", "\n");
				address = address.replace("\u2029", "\n");
				cus.setAddress(address);
			}else{
				cus.setAddress("");
				}
			if(!contact_person.equals("Contact Person")){
				cus.setContact_person(contact_person);
			}else{
				cus.setContact_person("");
			}
			if(!cus_email.equals("E-mail")){
				cus.setCus_email(cus_email);
			}else{
				cus.setCus_email("");
			}
			if(!cus_phone.equals("Phone Number")){
				cus.setCus_phone(cus_phone);
			}else{
				cus.setCus_phone("");
			}
			if(!cus_fax.equals("Fax Number")){
				cus.setCus_fax(cus_fax);
			}else{
				cus.setCus_fax("");
			}
			if(!bill_to.equals("Billing To")){
				cus.setBill_to(bill_to);
			}else{
				cus.setBill_to("");
			}
			if(!billing_terms.equals("Billing Terms")){
				cus.setBilling_terms(billing_terms);
			}else{
				cus.setBilling_terms("");
			}
			if(!transfer_dtl.equals("Transfer Detail")){
				transfer_dtl = transfer_dtl.replace("\u2028", "\n");
				transfer_dtl = transfer_dtl.replace("\u2029", "\n");
				cus.setTransfer_dtl(transfer_dtl);
			}else{
				cus.setTransfer_dtl("");
			}
			
			customerDao.updateCustomer(cus);
			
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("success", true);
	//		return new ModelAndView("redirect:customer.htm");
			return new ModelAndView("jsonView", model);
		}

	@RequestMapping(value = "/deleteCustomer")
	public void deleteMember(HttpServletRequest request, HttpServletResponse response) {

		int id = Integer.parseInt(request.getParameter("id"));
		customerDao.deleteCustomer(id);
		
	}
	
}
