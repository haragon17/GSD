package com.gsd.controller;

import java.text.SimpleDateFormat;
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
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.InvoiceDao;
import com.gsd.model.Invoice;
import com.gsd.model.InvoiceCompany;
import com.gsd.model.InvoiceReference;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

import net.sf.json.JSONObject;

@Controller
public class InvoiceController {

	private ApplicationContext context;
	private InvoiceDao invoiceDao;
	
	private static final Logger logger = Logger.getLogger(InvoiceController.class);
	
	public InvoiceController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.invoiceDao = (InvoiceDao) this.context.getBean("InvoiceDao");
	}
	
	@RequestMapping(value = "/invoice")
	public ModelAndView viewInvoicePage(HttpServletRequest request, HttpServletResponse response){
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();
		if (type == 0 || type == 1) {
			return new ModelAndView("Invoice");
		} else {
			return new ModelAndView("AccessDenied");
		}
	}
	
	@RequestMapping(value = "/searchInvoice")
	public ModelAndView searchInvoice(HttpServletRequest request, HttpServletResponse response){

		List<Invoice> inv = null;
		Map<String, String> map = new HashMap<String, String>();
		
		inv = invoiceDao.searchInvoice(map);
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", inv);
		jobj.put("total", inv.size());

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value = "/searchInvoiceReference")
	public ModelAndView searchInvoiceReference(HttpServletRequest request, HttpServletResponse response){

		List<InvoiceReference> inv_ref = null;
		HttpSession session = request.getSession();
		int id = Integer.parseInt((String) session.getAttribute("inv_id"));
		
		inv_ref = invoiceDao.searchInvoiceReference(id);
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", inv_ref);
		jobj.put("total", inv_ref.size());

		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value = "/searchInvoiceParam")
	public void searchInvoiceParam(HttpServletRequest request, HttpServletResponse response){
		
		HttpSession session = request.getSession();
		session.setAttribute("inv_id", request.getParameter("inv_id"));
		
	}
	
	@RequestMapping(value = "/showInvoiceCompany")
	public ModelAndView showInvoiceCompany(HttpServletRequest request, HttpServletResponse response) {
		
		List<InvoiceCompany> inv_company = null;
		
		inv_company = invoiceDao.showInvoiceCompany();
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", inv_company);
		jobj.put("total", inv_company.size());
		
		return new ModelAndView("jsonView", jobj);
	}
	
	@RequestMapping(value = "/addInvoice")
	public ModelAndView addInvoice (HttpServletRequest request, HttpServletResponse response) {
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int usr_id = user.getUserModel().getUsr_id();
		java.sql.Date inv_delivery_date_sql = null;
		
		String inv_name = request.getParameter("ainv_name");
		int inv_company_id = Integer.parseInt(request.getParameter("ainv_company_id"));
		String inv_proj_no = request.getParameter("ainv_proj_no");
		String inv_delivery_date = request.getParameter("ainv_delivery_date");
		int inv_payment_term = Integer.parseInt(request.getParameter("ainv_payment_term"));
		float inv_vat = Float.parseFloat(request.getParameter("ainv_vat"));
		String inv_bill_type = request.getParameter("ainv_bill_type");
		int cus_id = Integer.parseInt(request.getParameter("acus_id"));
		
		System.out.println("delivery date = "+inv_delivery_date);
		
		Invoice inv = new Invoice();
		inv.setInv_name(inv_name);
		inv.setInv_company_id(inv_company_id);
		inv.setInv_payment_term(inv_payment_term);
		inv.setInv_vat(inv_vat);
		inv.setCus_id(cus_id);
		inv.setCretd_usr(usr_id);
		inv.setInv_bill_type(inv_bill_type);
		
		try{
			SimpleDateFormat dateFormat = new SimpleDateFormat("MM/yy");
			Date parsed_delivery_date = dateFormat.parse(inv_delivery_date);
			inv_delivery_date_sql = new java.sql.Date(parsed_delivery_date.getTime());
		}catch(Exception e){
			logger.error(e.getMessage());
		}
		inv.setInv_delivery_date_sql(inv_delivery_date_sql);
		System.out.println(inv_delivery_date_sql.toString());
		
		if(!inv_proj_no.equals("Project Number")){
			inv.setInv_proj_no(inv_proj_no);
		}else{
			inv.setInv_proj_no("");
		}
		
		invoiceDao.addInvoice(inv);

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value = "/addInvoiceReference")
	public ModelAndView addInvoiceReference(HttpServletRequest request, HttpServletResponse response) {
		
		UserDetailsApp user = UserLoginDetail.getUser();
		int usr_id = user.getUserModel().getUsr_id();
		
		int proj_ref_id = Integer.parseInt(request.getParameter("aproj_ref_id"));
		int inv_id = Integer.parseInt(request.getParameter("ainv_id"));
		String inv_itm_name = request.getParameter("ainv_itm_name");
		float inv_ref_price = Float.parseFloat(request.getParameter("ainv_ref_price"));
		float inv_ref_qty = Float.parseFloat(request.getParameter("ainv_ref_qty"));
		String inv_ref_currency = request.getParameter("ainv_ref_currency");
		String inv_ref_desc = request.getParameter("ainv_ref_desc");
		
		InvoiceReference inv_ref = new InvoiceReference();
		inv_ref.setInv_itm_name(inv_itm_name);
		inv_ref.setInv_id(inv_id);
		inv_ref.setProj_ref_id(proj_ref_id);
		inv_ref.setInv_ref_price(inv_ref_price);
		inv_ref.setInv_ref_qty(inv_ref_qty);
		inv_ref.setInv_ref_currency(inv_ref_currency);
		inv_ref.setCretd_usr(usr_id);
		
		if(!inv_ref_desc.equals("Remark")){
			inv_ref.setInv_ref_desc(inv_ref_desc);
		}else{
			inv_ref.setInv_ref_desc("");
		}
		
		invoiceDao.addInvoiceReference(inv_ref);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value = "/updateInvoice")
	public ModelAndView updateInvoice(HttpServletRequest request, HttpServletResponse response){
		
		int inv_id = Integer.parseInt(request.getParameter("einv_id"));
		String inv_name = request.getParameter("einv_name");
		String inv_proj_no = request.getParameter("einv_proj_no");
		String inv_delivery_date = request.getParameter("einv_delivery_date");
		int inv_payment_term = Integer.parseInt(request.getParameter("einv_payment_term"));
		float inv_vat = Float.parseFloat(request.getParameter("einv_vat"));
		String inv_bill_type = request.getParameter("einv_bill_type");
		int cus_id = Integer.parseInt(request.getParameter("ecus_id"));
		
		Invoice inv = new Invoice();
		inv.setInv_id(inv_id);
		inv.setInv_name(inv_name);
		inv.setInv_payment_term(inv_payment_term);
		inv.setInv_vat(inv_vat);
		inv.setCus_id(cus_id);
		inv.setInv_bill_type(inv_bill_type);
		
		java.sql.Date inv_delivery_date_sql = null;
		try{
			SimpleDateFormat dateFormat = new SimpleDateFormat("MM/yy");
			Date parsed_delivery_date = dateFormat.parse(inv_delivery_date);
			inv_delivery_date_sql = new java.sql.Date(parsed_delivery_date.getTime());
		}catch(Exception e){
			logger.error(e.getMessage());
		}
		inv.setInv_delivery_date_sql(inv_delivery_date_sql);
		
		if(!inv_proj_no.equals("Project Number")){
			inv.setInv_proj_no(inv_proj_no);
		}else{
			inv.setInv_proj_no("");
		}
		
		invoiceDao.updateInvoice(inv);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value = "/updateInvoiceReference")
	public ModelAndView updateInvoiceReference(HttpServletRequest request, HttpServletResponse response){
		
		int inv_ref_id = Integer.parseInt(request.getParameter("einv_ref_id"));
		int proj_ref_id = Integer.parseInt(request.getParameter("eproj_ref_id"));
		int inv_id = Integer.parseInt(request.getParameter("einv_id"));
		String inv_itm_name = request.getParameter("einv_itm_name");
		float inv_ref_price = Float.parseFloat(request.getParameter("einv_ref_price"));
		float inv_ref_qty = Float.parseFloat(request.getParameter("einv_ref_qty"));
		String inv_ref_currency = request.getParameter("einv_ref_currency");
		String inv_ref_desc = request.getParameter("einv_ref_desc");
		
		InvoiceReference inv_ref = new InvoiceReference();
		inv_ref.setInv_ref_id(inv_ref_id);
		inv_ref.setInv_itm_name(inv_itm_name);
		inv_ref.setInv_id(inv_id);
		inv_ref.setProj_ref_id(proj_ref_id);
		inv_ref.setInv_ref_price(inv_ref_price);
		inv_ref.setInv_ref_qty(inv_ref_qty);
		inv_ref.setInv_ref_currency(inv_ref_currency);
		
		if(!inv_ref_desc.equals("Remark")){
			inv_ref.setInv_ref_desc(inv_ref_desc);
		}else{
			inv_ref.setInv_ref_desc("");
		}
		
		invoiceDao.updateInvoicereference(inv_ref);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value = "/updateInvoiceReferenceBatch")
	public ModelAndView updateInvoiceReferenceBatch(HttpServletRequest request, HttpServletResponse response){
		
		Object data = request.getParameter("data");
		List<InvoiceReference> invRefLs = invoiceDao.getListDataFromRequest(data);
		
		invoiceDao.updateInvoiceReferenceBatch(invRefLs);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value = "/deleteInvoice")
	public void deleteInvoice(HttpServletRequest request, HttpServletResponse response){
		int id = Integer.parseInt(request.getParameter("id"));
		try{
			invoiceDao.deleteInvoice(id);
		}catch(Exception e){
			logger.error("Cannot delete inv_id = "+id+"\n"+e.getMessage());
		}
	}
	
	@RequestMapping(value = "/deleteInvoiceReference")
	public void deleteInvoiceReference(HttpServletRequest request, HttpServletResponse response){
		int id = Integer.parseInt(request.getParameter("id"));
		try{
			invoiceDao.deleteInvoiceReference(id);
		}catch(Exception e){
			logger.error("Cannot delete inv_ref_id = "+id+"\n"+e.getMessage());
		}
	}
}
