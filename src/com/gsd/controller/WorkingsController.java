package com.gsd.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class WorkingsController {

	private ApplicationContext context;
	
	public WorkingsController(){
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		
	}
	
	@RequestMapping(value = "/workings")
	public ModelAndView viewWorkings(HttpServletRequest request,
			HttpServletResponse response){
		
		return new ModelAndView("WorkingsAdmin");
	}
	
}
