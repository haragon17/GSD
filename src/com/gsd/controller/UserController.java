package com.gsd.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.RandomStringUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.gsd.dao.UserDao;
import com.gsd.model.User;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;

@Controller
public class UserController {

	private ApplicationContext context;
	private UserDao userDao;
	private String uname, fname, lname, email;
	private static int chkPush;

	public UserController() {
		this.context = new ClassPathXmlApplicationContext("META-INF/gsd-context.xml");
		this.userDao = (UserDao) this.context.getBean("UserDao");
	}

	public void setChk(int chk){
		this.chkPush = chk;
	}
//	static final PasswordEncoder passwordEncoder = new StandardPasswordEncoder();
	static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//	String hashUser = passwordEncoder.encode("user");
//	String hashAdmin = passwordEncoder.encode("admin");

	@RequestMapping(value = "/userModel")
	public ModelAndView getUserModel(HttpServletRequest request, HttpServletResponse response) throws Exception {

		UserDetailsApp user = UserLoginDetail.getUser();
		List<User> userLs = new ArrayList<User>();
		userLs.add(user.getUserModel());
		
		JSONObject jobj = new JSONObject();
		jobj.put("user", userLs);
		jobj.put("total", userDao.countLastUpdateProject());
		
		if(chkPush == 1){
			jobj.put("chk",1);
			chkPush = 0;
		}else{
			jobj.put("chk",0);
		}
//		System.out.println("user = " + hashUser);
//		System.out.println("admin = " + hashAdmin);

		return new ModelAndView("jsonView", jobj);

	}

	@RequestMapping(value = "/chkUserName")
	public ModelAndView chkUserName(@RequestParam("records") String userName, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		List<User> userLs = new ArrayList<User>();
		User userNull = new User();
		try {
			userLs.add(userDao.findByUserName(userName));
		} catch (Exception e) {
			userLs.add(userNull);
		}

		JSONObject jobj = new JSONObject();
		jobj.put("records", userLs);

		return new ModelAndView("jsonView", jobj);

	}

	@RequestMapping(value = "/register")
	public ModelAndView register(HttpServletRequest request, HttpServletResponse response) throws Exception {

		String usr_name = request.getParameter("username");
		String password = request.getParameter("pass");
		String fname = request.getParameter("fname");
		String lname = request.getParameter("lname");
		String birthday = request.getParameter("dob");
		String email = request.getParameter("email");
		String phone = request.getParameter("phone");
		int usr_type = Integer.parseInt(request.getParameter("usr_type"));

		User user = new User();
		user.setUsr_id(userDao.getLastUserId());
		user.setUsr_name(usr_name);
		user.setPassword(passwordEncoder.encode(password));
		user.setFname(fname);
		user.setLname(lname);
		user.setBirthdayDate(birthday);
		user.setEmail(email);
		user.setPhone(phone);
		user.setUsr_type(usr_type);

		userDao.createUser(user);
		
		List<User> userLs = new ArrayList<User>();
		User userNull = new User();
		try {
			userLs.add(userDao.findByUserName(usr_name));

			EmailController sentMail = new EmailController();

			Map<Object, String> mail = new HashMap<Object, String>();
			mail.put("name", usr_name);
			mail.put("pass", password);
			mail.put("to", email);
			mail.put("fname", fname);

			sentMail.sentRegistMail(request, mail);
		} catch (Exception e) {
			userLs.add(userNull);
			System.out.println("sent regist mail error");
		}

		userLs.add(userDao.findByUserName(usr_name));
		
		JSONObject jobj = new JSONObject();
		jobj.put("records", userLs);
		
		return new ModelAndView("jsonView", jobj);

	}

	@RequestMapping(value = "/editProfile")
	public ModelAndView viewWorkings(HttpServletRequest request, HttpServletResponse response) {
		// LOG.debug("Inside LogListing page on method view");
		return new ModelAndView("EditProfile");
	}

	@RequestMapping(value = "/memberManagement")
	public ModelAndView viewMemberManagement(HttpServletRequest request, HttpServletResponse response) {
		// LOG.debug("Inside LogListing page on method view");
		UserDetailsApp user = UserLoginDetail.getUser();
		int type = user.getUserModel().getUsr_type();

		if (type == 0) {
			return new ModelAndView("MemberManagement");
		} else {
			return new ModelAndView("AccessDenied");
		}
	}

	@RequestMapping(value = "/searchMemberParam")
	public void searchReportParam(HttpServletRequest request, HttpServletResponse response) {

		uname = request.getParameter("usr_name");
		fname = request.getParameter("fname");
		lname = request.getParameter("lname");
		email = request.getParameter("email");

	}

	@RequestMapping(value = "/searchMember")
	public ModelAndView searchMember(HttpServletRequest request, HttpServletResponse response) throws Exception {

		UserDetailsApp userLoginDetail = UserLoginDetail.getUser();
		List<User> user = null;
		List<User> userLs = new ArrayList<User>();
		Map<String, String> map = new HashMap<String, String>();

		map.put("id", Integer.toString(userLoginDetail.getUserModel().getUsr_id()));
		map.put("uname", uname);
		map.put("fname", fname);
		map.put("lname", lname);
		map.put("email", email);

		int start = Integer.parseInt(request.getParameter("start"));
		int limit = Integer.parseInt(request.getParameter("limit"));

		try {
			user = userDao.searchMember(map);

			if (limit + start > user.size()) {
				limit = user.size();
			} else {
				limit += start;
			}
			for (int i = start; i < (limit); i++) {
				userLs.add(user.get(i));
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		JSONObject jobj = new JSONObject();
		jobj.put("records", userLs);
		jobj.put("total", user.size());

		return new ModelAndView("jsonView", jobj);

	}

	@RequestMapping(value = "/updateMember")
	public ModelAndView updateMember(HttpServletRequest request, HttpServletResponse response) {

		int id = Integer.parseInt(request.getParameter("eid"));
		String fname = request.getParameter("efname");
		String lname = request.getParameter("elname");
		String birthday = request.getParameter("edob");
		String email = request.getParameter("eemail");
		String phone = request.getParameter("ephone");
		int type = Integer.parseInt(request.getParameter("usr_type"));

		User user = new User();
		user.setUsr_id(id);
		user.setFname(fname);
		user.setLname(lname);
		user.setBirthdayDate(birthday);
		user.setEmail(email);
		user.setUsr_type(type);

		if (!phone.equals("Phone Number")) {
			user.setPhone(phone);
		} else {
			user.setPhone("");
		}

		userDao.updateMember(user);

		return new ModelAndView("redirect:memberManagement.htm");
	}

	@RequestMapping(value = "/deleteMember")
	public void deleteMember(HttpServletRequest request, HttpServletResponse response) {

		int id = Integer.parseInt(request.getParameter("id"));

		userDao.deleteUser(id);

	}

	@RequestMapping(value = "forgotPass")
	public ModelAndView forgotPass(HttpServletRequest request, HttpServletResponse response) {

		User userNull = new User();
		List<User> user = new ArrayList<User>();
		user = userDao.forgotPassword(request.getParameter("usr_name"), request.getParameter("email"));

		if (user.size() > 0) {
			int id = user.get(0).getUsr_id();
			String result = RandomStringUtils.randomAlphanumeric(6);

			userDao.changePassword(id, passwordEncoder.encode(result));

			EmailController sentMail = new EmailController();

			Map<Object, String> mail = new HashMap<Object, String>();
			mail.put("name", user.get(0).getUsr_name());
			mail.put("pass", result);
			mail.put("to", request.getParameter("email"));

			sentMail.sentForgotMail(request, mail);
		} else {
			user.add(userNull);
		}

		JSONObject jobj = new JSONObject();
		jobj.put("user", user);

		return new ModelAndView("jsonView", jobj);
	}

	@RequestMapping(value = "changePassword")
	public ModelAndView changePassword(HttpServletRequest request, HttpServletResponse response) {

		String opass = request.getParameter("opass");
		String npass = request.getParameter("npass");

		UserDetailsApp user = UserLoginDetail.getUser();
		User userNull = new User();
		List<User> userLs = new ArrayList<User>();
		int id = user.getUserModel().getUsr_id();
		
		if(passwordEncoder.matches(opass, user.getPassword())){
//		if (passwordEncoder.encode(opass).equals(user.getPassword())) {
			userDao.changePassword(id, passwordEncoder.encode(npass));
			userLs.add(user.getUserModel());
		} else {
			userLs.add(userNull);
		}

		JSONObject jobj = new JSONObject();
		jobj.put("user", userLs);

		return new ModelAndView("jsonView", jobj);
	}

	@RequestMapping(value = "/updateProfile")
	public ModelAndView updateProfile(HttpServletRequest request, HttpServletResponse response) {

		UserDetailsApp user = UserLoginDetail.getUser();

		int id = user.getUserModel().getUsr_id();
		String fname = request.getParameter("pfname");
		String lname = request.getParameter("plname");
		String birthday = request.getParameter("pdob");
		String email = request.getParameter("pemail");
		String phone = request.getParameter("pphone");

		User userLs = new User();
		userLs.setUsr_id(id);
		userLs.setFname(fname);
		userLs.setLname(lname);
		userLs.setBirthday(birthday);
		userLs.setEmail(email);
		userLs.setUsr_type(user.getUserModel().getUsr_type());

		if (!phone.equals("Phone Number")) {
			userLs.setPhone(phone);
		} else {
			userLs.setPhone("");
		}

		userDao.updateMember(userLs);

		JSONObject jobj = new JSONObject();
		jobj.put("user", userLs);

		return new ModelAndView("jsonView", jobj);
	}

}
