package com.gsd.controller;

import java.util.Map;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;

import com.gsd.mail.SentMail;

@Controller
public class EmailController {

	private ApplicationContext context;
	private SentMail sentMail;
	private String from = "psms.system@gmail.com"; 
	
	public EmailController(){
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.sentMail = (SentMail) this.context.getBean("SentMail");
	}
	
	public void sentRegistMail(HttpServletRequest request, Map<Object, String> mail){
		
		String subject = "Welcome to Portfolio Storage & Management System";
		String to = mail.get("to");
		String name = mail.get("name");
		String pass = mail.get("pass");
		String msg = "";

		msg += "This is your new account for Portfolio Storage & Management System<br><br>";
		msg += "User Name : <b><font color='green'>"+name+"</font></b><br>";
		msg += "Password  : <b><font color='green'>"+pass+"</font></b><br>";

		try {
			this.sentMail.sendMail(from, to, subject, msg);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println(e.getMessage());
		}
		
	}
	
	public void sentForgotMail(HttpServletRequest request, Map<Object, String> mail){
		
		String subject = "Your new password for Portfolio Storage & Management System";
		String to = mail.get("to");
		String name = mail.get("name");
		String pass = mail.get("pass");
		String msg = "";

		msg += "Your password have been change from forget password<br><br>";
		msg += "User Name : <b><font color='green'>"+name+"</font></b><br>";
		msg += "Password  : <b><font color='green'>"+pass+"</font></b><br>";

		try {
			this.sentMail.sendMail(from, to, subject, msg);
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
