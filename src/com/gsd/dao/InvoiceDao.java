package com.gsd.dao;

import java.util.List;
import java.util.Map;

import com.gsd.model.Invoice;
import com.gsd.model.InvoiceCompany;
import com.gsd.model.InvoiceReference;

public interface InvoiceDao {

	public List<Invoice> searchInvoice(Map<String, String> data);
	
	public List<InvoiceReference> searchInvoiceReference(int id);
	
	public List<InvoiceCompany> showInvoiceCompany();
	
	public List<Invoice> showInvoiceCustomer(int cus_id, String month, String year);
	
	public int addInvoice(Invoice inv);
	
	public void addInvoiceReference(InvoiceReference inv_ref, Map<String, Float> map);
	
	public void updateInvoice(Invoice inv, Map<String, Float> map);
	
	public void updateInvoicereference(InvoiceReference inv_ref, Map<String, Float> map);
	
	public void updateInvoiceReferenceBatch(List<InvoiceReference> invRefLs, Map<String, Float> map);
	
	public void deleteInvoice(int id);
	
	public void deleteInvoiceReference(int id);
	
	public Invoice getInvoiceById(int id);
	
	public InvoiceCompany getInvoiceCompanyById(int inv_company_id);
	
	public List<InvoiceReference> getJobItemList(int job_id);
	
	public List<InvoiceReference> getListDataFromRequest(Object data);
}
