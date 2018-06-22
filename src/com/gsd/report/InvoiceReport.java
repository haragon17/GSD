package com.gsd.report;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.view.document.AbstractJExcelView;

import com.gsd.model.Invoice;

import jxl.format.CellFormat;
import jxl.write.Label;
import jxl.write.Number;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

public class InvoiceReport extends AbstractJExcelView{

	@Override
	protected void buildExcelDocument(Map<String, Object> model, WritableWorkbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		
		List<Invoice> inv = (List<Invoice>) model.get("list");
		
		Date dateTime = new Date();
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy_HHmmss");
		String currentDateTime = dateFormat.format(dateTime);
		
		String fileName = "Invoice-Report_"+currentDateTime;
		response.addHeader("Content-Disposition", "attachment; filename=\""+fileName+".xls\"");
		
		WritableSheet ws = workbook.getSheet(0);
		CellFormat date = ws.getWritableCell(0, 1).getCellFormat();
		CellFormat customer = ws.getWritableCell(1, 1).getCellFormat();
		CellFormat inv_number = ws.getWritableCell(2, 1).getCellFormat();
        CellFormat subject = ws.getWritableCell(3, 1).getCellFormat();
        CellFormat item_name = ws.getWritableCell(4, 1).getCellFormat();
        CellFormat qty = ws.getWritableCell(5, 1).getCellFormat();
        CellFormat price = ws.getWritableCell(6, 1).getCellFormat();
        CellFormat total = ws.getWritableCell(7, 1).getCellFormat();
        CellFormat currency = ws.getWritableCell(8, 1).getCellFormat();
		
        int row = 1;
        int inv_id = 0;
        for(int i=0; i<inv.size(); i++){
        	
        	DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        	DateFormat format2 = new SimpleDateFormat("dd/MM/yy");
        	Date inv_bill_date = format.parse(inv.get(i).getInv_bill_date());
        	String date_str = format2.format(inv_bill_date);
        	
        	if(inv_id != inv.get(i).getInv_id()){
	        	ws.addCell(new Label(0,row,date_str,date));
	        	ws.addCell(new Label(1,row,inv.get(i).getCus_name(),customer));
	        	ws.addCell(new Label(2,row,inv.get(i).getInv_number(),inv_number));
	        	ws.addCell(new Label(3,row,inv.get(i).getInv_name(),subject));
	        	ws.addCell(new Number(7,row,inv.get(i).getTotal_price().setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue(),total));
	        	ws.addCell(new Label(8,row,inv.get(i).getInv_currency(),currency));
//	        	ws.addCell(new Label(7,row,String.format("%,.2f", inv.get(i).getTotal_price())+" "+inv.get(i).getInv_ref_currency(),total));
	        	inv_id = inv.get(i).getInv_id();
        	}else{
        		ws.addCell(new Label(0,row,"",date));
        		ws.addCell(new Label(1,row,"",customer));
	        	ws.addCell(new Label(2,row,"",inv_number));
	        	ws.addCell(new Label(3,row,"",subject));
	        	ws.addCell(new Label(7,row,"",total));
	        	ws.addCell(new Label(8,row,"",currency));
        	}
        	
        	ws.addCell(new Label(4,row,inv.get(i).getInv_itm_name(),item_name));
        	ws.addCell(new Label(5,row,String.format("%,.2f", inv.get(i).getInv_ref_qty()),qty));
        	ws.addCell(new Label(6,row,String.format("%,.2f", inv.get(i).getInv_ref_price())+" "+inv.get(i).getInv_currency(),price));
        	
        	row++;
        }
        
	}

}
