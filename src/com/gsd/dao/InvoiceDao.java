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
	
	public void addInvoice(Invoice inv);
	
	public void addInvoiceReference(InvoiceReference inv_ref);
	
	public void updateInvoice(Invoice inv);
	
	public void updateInvoicereference(InvoiceReference inv_ref);
	
	public void updateInvoiceReferenceBatch(List<InvoiceReference> invRefLs);
	
	public void deleteInvoice(int id);
	
	public void deleteInvoiceReference(int id);
	
	public List<InvoiceReference> getListDataFromRequest(Object data);
}
