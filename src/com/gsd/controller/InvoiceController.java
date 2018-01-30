package com.gsd.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.InvoiceDao;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

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
}
