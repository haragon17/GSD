package com.gsd.report;

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
		
//		List<Invoice> gsd = (List<Invoice>) model.get("gsd");
//		List<Invoice> jv = (List<Invoice>) model.get("jv");
//		List<Invoice> fgs = (List<Invoice>) model.get("fgs");
//		List<Invoice> mm = (List<Invoice>) model.get("mm");
//		List<Invoice> gsdp = (List<Invoice>) model.get("gsdp");
//		List<Invoice> gps = (List<Invoice>) model.get("gps");
//		List<Invoice> tta = (List<Invoice>) model.get("tta");
//		List<Invoice> stu = (List<Invoice>) model.get("stu");
		Map<Integer, List<Invoice>> map = new HashMap<Integer, List<Invoice>>();
		map.put(0, (List<Invoice>) model.get("gsd"));
		map.put(1, (List<Invoice>) model.get("jv"));
		map.put(2, (List<Invoice>) model.get("fgs"));
		map.put(3, (List<Invoice>) model.get("mm"));
		map.put(4, (List<Invoice>) model.get("gsdp"));
		map.put(5, (List<Invoice>) model.get("gps"));
		map.put(6, (List<Invoice>) model.get("tta"));
		map.put(7, (List<Invoice>) model.get("stu"));
		
		Date dateTime = new Date();
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy_HHmmss");
		String currentDateTime = dateFormat.format(dateTime);
		
		String fileName = "Invoice-Report_"+currentDateTime;
		response.addHeader("Content-Disposition", "attachment; filename=\""+fileName+".xls\"");
//		WritableSheet ws_gsd = workbook.getSheet(0);
//		WritableSheet ws_jv = workbook.getSheet(1);
//		WritableSheet ws_fgs = workbook.getSheet(2);
//		WritableSheet ws_mm = workbook.getSheet(3);
//		WritableSheet wsp = workbook.getSheet(4); 
//		WritableSheet ws_gps = workbook.getSheet(5);
//		WritableSheet ws_tta = workbook.getSheet(6);
//		WritableSheet ws_stu = workbook.getSheet(7);
		
 		for(int x=0; x<8; x++){
 			WritableSheet ws = workbook.getSheet(x);
 			List<Invoice> myList = map.get(x);
			int row = 3;
			for(int i=0; i<myList.size(); i++){
				ws.addCell(new Label(0,row,myList.get(i).getCus_name()));
				ws.addCell(new Number(1,row,myList.get(i).getJan().doubleValue(),ws.getWritableCell(1, 3).getCellFormat()));
				ws.addCell(new Number(2,row,myList.get(i).getFeb().doubleValue(),ws.getWritableCell(2, 3).getCellFormat()));
				ws.addCell(new Number(3,row,myList.get(i).getMar().doubleValue(),ws.getWritableCell(3, 3).getCellFormat()));
				ws.addCell(new Number(4,row,myList.get(i).getApr().doubleValue(),ws.getWritableCell(4, 3).getCellFormat()));
				ws.addCell(new Number(5,row,myList.get(i).getMay().doubleValue(),ws.getWritableCell(5, 3).getCellFormat()));
				ws.addCell(new Number(6,row,myList.get(i).getJun().doubleValue(),ws.getWritableCell(6, 3).getCellFormat()));
				ws.addCell(new Number(7,row,myList.get(i).getJul().doubleValue(),ws.getWritableCell(7, 3).getCellFormat()));
				ws.addCell(new Number(8,row,myList.get(i).getAug().doubleValue(),ws.getWritableCell(8, 3).getCellFormat()));
				ws.addCell(new Number(9,row,myList.get(i).getSep().doubleValue(),ws.getWritableCell(9, 3).getCellFormat()));
				ws.addCell(new Number(10,row,myList.get(i).getOct().doubleValue(),ws.getWritableCell(10, 3).getCellFormat()));
				ws.addCell(new Number(11,row,myList.get(i).getNov().doubleValue(),ws.getWritableCell(11, 3).getCellFormat()));
				ws.addCell(new Number(12,row,myList.get(i).getDec().doubleValue(),ws.getWritableCell(12, 3).getCellFormat()));
				
				row++;
			}
 		}
		
	}

}
