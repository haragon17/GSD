package com.gsd.controller;

import java.io.IOException;
import java.math.BigDecimal;
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
import com.gsd.dao.JobsDao;
import com.gsd.model.Invoice;
import com.gsd.model.InvoiceCompany;
import com.gsd.model.InvoiceReference;
import com.gsd.report.PrintInvoice_iText;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;
import com.itextpdf.text.DocumentException;

import net.sf.json.JSONObject;

@Controller
public class InvoiceController {

	private ApplicationContext context;
	private InvoiceDao invoiceDao;
	private JobsDao jobsDao;
	
	private static final Logger logger = Logger.getLogger(InvoiceController.class);
	
	public InvoiceController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.invoiceDao = (InvoiceDao) this.context.getBean("InvoiceDao");
		this.jobsDao = (JobsDao) this.context.getBean("JobsDao");
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

		HttpSession session = request.getSession();
		session.setAttribute("inv_id", "");
		session.setAttribute("AUD", "");
		session.setAttribute("CHF", "");
		session.setAttribute("GBP", "");
		session.setAttribute("THB", "");
		session.setAttribute("EUR", "");
		session.setAttribute("USD", "");
		
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
		session.setAttribute("AUD", request.getParameter("AUD"));
		session.setAttribute("CHF", request.getParameter("CHF"));
		session.setAttribute("GBP", request.getParameter("GBP"));
		session.setAttribute("THB", request.getParameter("THB"));
		session.setAttribute("EUR", request.getParameter("EUR"));
		session.setAttribute("USD", request.getParameter("USD"));
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
		java.sql.Date inv_bill_date_sql = null;
		
		String inv_name = request.getParameter("ainv_name");
		int inv_company_id = Integer.parseInt(request.getParameter("ainv_company_id"));
		String inv_proj_no = request.getParameter("ainv_proj_no");
		String inv_delivery_date = request.getParameter("ainv_delivery_date");
		int inv_payment_terms = Integer.parseInt(request.getParameter("ainv_payment_terms"));
		BigDecimal inv_vat = new BigDecimal(request.getParameter("ainv_vat"));
		String inv_bill_type = request.getParameter("ainv_bill_type");
		int cus_id = Integer.parseInt(request.getParameter("acus_id"));
		String inv_bill_date = request.getParameter("ainv_bill_date");
		int inv_portal = Integer.parseInt(request.getParameter("ainv_portal"));
		
		System.out.println("delivery date = "+inv_delivery_date);
		
		Invoice inv = new Invoice();
		inv.setInv_name(inv_name);
		inv.setInv_company_id(inv_company_id);
		inv.setInv_payment_terms(inv_payment_terms);
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
		
		try{
			SimpleDateFormat dateFormat2 = new SimpleDateFormat("dd/MM/yy");
			Date parsed_bill_date = dateFormat2.parse(inv_bill_date);
			inv_bill_date_sql = new java.sql.Date(parsed_bill_date.getTime());
		}catch(Exception e){
			logger.error(e.getMessage());
		}
		
		inv.setInv_delivery_date_sql(inv_delivery_date_sql);
		inv.setInv_bill_date_sql(inv_bill_date_sql);
		System.out.println(inv_delivery_date_sql.toString());
		
		if(!inv_proj_no.equals("Project Number")){
			inv.setInv_proj_no(inv_proj_no);
		}else{
			inv.setInv_proj_no("");
		}
		
		int inv_id = invoiceDao.addInvoice(inv);
		
		if(inv_portal == 2){
			Map<String, Float> map = new HashMap<String, Float>();
			map = getCurrencyRate(request, response);
			int job_id = Integer.parseInt(request.getParameter("ainv_job_id"));
			String job_name = request.getParameter("ainv_job_name");
			List<InvoiceReference> inv_refLs = invoiceDao.getJobItemList(job_id);
			for(int i=0; i<inv_refLs.size(); i++){
				inv_refLs.get(i).setInv_id(inv_id);
				inv_refLs.get(i).setInv_ref_desc(job_name);
//				System.out.println("item name = "+inv_refLs.get(i).getInv_itm_name());
//				System.out.println("proj_ref_id = "+inv_refLs.get(i).getProj_ref_id());
//				System.out.println("price = "+inv_refLs.get(i).getInv_ref_price());
//				System.out.println("qty = "+inv_refLs.get(i).getInv_ref_qty());
//				System.out.println("currency = "+inv_refLs.get(i).getInv_itm_name());
				invoiceDao.addInvoiceReference(inv_refLs.get(i), map);
			}
			jobsDao.billedJobProjects(job_id);
		}

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
		BigDecimal inv_ref_price = new BigDecimal(request.getParameter("ainv_ref_price"));
		BigDecimal inv_ref_qty = new BigDecimal(request.getParameter("ainv_ref_qty"));
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
		
		Map<String, Float> map = new HashMap<String, Float>();
		map = getCurrencyRate(request, response);
		
		invoiceDao.addInvoiceReference(inv_ref,map);
		
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
		int inv_payment_terms = Integer.parseInt(request.getParameter("einv_payment_terms"));
		BigDecimal inv_vat = new BigDecimal(request.getParameter("einv_vat"));
		String inv_bill_type = request.getParameter("einv_bill_type");
		int cus_id = Integer.parseInt(request.getParameter("ecus_id"));
		String inv_bill_date = request.getParameter("einv_bill_date");
		
		Map<String, Float> map = new HashMap<String, Float>();
		map = getCurrencyRate(request, response);
		
		Invoice inv = new Invoice();
		inv.setInv_id(inv_id);
		inv.setInv_name(inv_name);
		inv.setInv_payment_terms(inv_payment_terms);
		inv.setInv_vat(inv_vat);
		inv.setCus_id(cus_id);
		inv.setInv_bill_type(inv_bill_type);
		
		java.sql.Date inv_delivery_date_sql = null;
		java.sql.Date inv_bill_date_sql = null;
		try{
			SimpleDateFormat dateFormat = new SimpleDateFormat("MM/yy");
			Date parsed_delivery_date = dateFormat.parse(inv_delivery_date);
			inv_delivery_date_sql = new java.sql.Date(parsed_delivery_date.getTime());
		}catch(Exception e){
			logger.error(e.getMessage());
		}
		try{
			SimpleDateFormat dateFormat2 = new SimpleDateFormat("dd/MM/yy");
			Date parsed_bill_date = dateFormat2.parse(inv_bill_date);
			inv_bill_date_sql = new java.sql.Date(parsed_bill_date.getTime());
		}catch(Exception e){
			logger.error(e.getMessage());
		}
		
		inv.setInv_delivery_date_sql(inv_delivery_date_sql);
		inv.setInv_bill_date_sql(inv_bill_date_sql);
		if(!inv_proj_no.equals("Project Number")){
			inv.setInv_proj_no(inv_proj_no);
		}else{
			inv.setInv_proj_no("");
		}
		
		invoiceDao.updateInvoice(inv,map);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value = "/updateInvoiceReference")
	public ModelAndView updateInvoiceReference(HttpServletRequest request, HttpServletResponse response){
		
		int inv_ref_id = Integer.parseInt(request.getParameter("einv_ref_id"));
		int proj_ref_id = Integer.parseInt(request.getParameter("eproj_ref_id"));
		int inv_id = Integer.parseInt(request.getParameter("einv_id_ref"));
		String inv_itm_name = request.getParameter("einv_itm_name");
		BigDecimal inv_ref_price = new BigDecimal(request.getParameter("einv_ref_price"));
		BigDecimal inv_ref_qty = new BigDecimal(request.getParameter("einv_ref_qty"));
		String inv_ref_currency = request.getParameter("einv_ref_currency");
		String inv_ref_desc = request.getParameter("einv_ref_desc");
		
		Map<String, Float> map = new HashMap<String, Float>();
		map = getCurrencyRate(request, response);
		
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
		
		invoiceDao.updateInvoicereference(inv_ref,map);
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("success", true);
		return new ModelAndView("jsonView", model);
	}
	
	@RequestMapping(value = "/updateInvoiceReferenceBatch")
	public ModelAndView updateInvoiceReferenceBatch(HttpServletRequest request, HttpServletResponse response){
		
		Object data = request.getParameter("data");
		List<InvoiceReference> invRefLs = invoiceDao.getListDataFromRequest(data);
		
		Map<String, Float> map = new HashMap<String, Float>();
		map = getCurrencyRate(request, response);
		
		invoiceDao.updateInvoiceReferenceBatch(invRefLs,map);
		
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
	
	@RequestMapping(value = "/printInvoice")
	public void printInvoice(HttpServletRequest request, HttpServletResponse response) throws IOException{
		
		int id = Integer.parseInt(request.getParameter("inv_id"));
		Invoice inv = invoiceDao.getInvoiceById(id);
		InvoiceCompany inv_company = invoiceDao.getInvoiceCompanyById(inv.getInv_company_id());
		List<InvoiceReference> inv_ref = invoiceDao.searchInvoiceReference(id);
		
		try {
			new PrintInvoice_iText().createPdf(request,response,inv,inv_company,inv_ref);
		} catch (IOException | DocumentException e) {
			logger.error(e.getMessage());
		}
		
	}
	
	public Map<String, Float> getCurrencyRate(HttpServletRequest request, HttpServletResponse response){
		
		HttpSession session = request.getSession();
		Map<String, Float> map = new HashMap<String, Float>();
		map.put("AUD", Float.parseFloat((String)session.getAttribute("AUD")));
		map.put("CHF", Float.parseFloat((String)session.getAttribute("CHF")));
		map.put("GBP", Float.parseFloat((String)session.getAttribute("GBP")));
		map.put("THB", Float.parseFloat((String)session.getAttribute("THB")));
		map.put("USD", Float.parseFloat((String)session.getAttribute("USD")));
		map.put("EUR", Float.parseFloat((String)session.getAttribute("EUR")));
		
		return map;
	}
	
}
