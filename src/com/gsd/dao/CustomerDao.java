package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.Customer;

public interface CustomerDao {

	public List<Customer> searchCustomer(Map<String, String> data);

	public void updateCustomer(Customer cus);
	
	public void createCustomer(Customer cus);
	
	public int getLastCustomerId();
	
	public void deleteCustomer(int id);
	
	public Customer findByCusCode(String cus_code);
	
	public Customer findByCusID(int cus_id);
	
	public List<Customer> showCustomer();
}
