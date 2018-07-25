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
import jxl.write.Formula;
import jxl.write.Label;
import jxl.write.Number;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

public class InvoiceMonthlyReport extends AbstractJExcelView{

	@Override
	protected void buildExcelDocument(Map<String, Object> model, WritableWorkbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		
		Map<Integer, List<Invoice>> map = new HashMap<Integer, List<Invoice>>();
		map.put(0, (List<Invoice>) model.get("gsd"));
		map.put(1, (List<Invoice>) model.get("jv"));
		map.put(2, (List<Invoice>) model.get("fgs"));
		map.put(3, (List<Invoice>) model.get("mm"));
		map.put(4, (List<Invoice>) model.get("gsdp"));
		map.put(5, (List<Invoice>) model.get("gps"));
		map.put(6, (List<Invoice>) model.get("tta"));
		map.put(7, (List<Invoice>) model.get("stu"));
		map.put(8, (List<Invoice>) model.get("gsda"));
		map.put(9, (List<Invoice>) model.get("gsd_angebote"));
		map.put(10, (List<Invoice>) model.get("tta_angebote"));
		map.put(11, (List<Invoice>) model.get("gsda_angebote"));
		
		Date dateTime = new Date();
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy_HHmmss");
		String currentDateTime = dateFormat.format(dateTime);
		
		String fileName = "Monthly-Report_"+currentDateTime;
		response.addHeader("Content-Disposition", "attachment; filename=\""+fileName+".xls\"");
		
 		for(int x=0; x<9; x++){
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
			if(x == 0 || x == 6 || x == 8){
				row++;
				ws.addCell(new Formula(1,2,"SUM(B4:B"+row+")",ws.getWritableCell(1, 2).getCellFormat()));
				ws.addCell(new Formula(2,2,"SUM(C4:C"+row+")",ws.getWritableCell(2, 2).getCellFormat()));
				ws.addCell(new Formula(3,2,"SUM(D4:D"+row+")",ws.getWritableCell(3, 2).getCellFormat()));
				ws.addCell(new Formula(4,2,"SUM(E4:E"+row+")",ws.getWritableCell(4, 2).getCellFormat()));
				ws.addCell(new Formula(5,2,"SUM(F4:F"+row+")",ws.getWritableCell(5, 2).getCellFormat()));
				ws.addCell(new Formula(6,2,"SUM(G4:G"+row+")",ws.getWritableCell(6, 2).getCellFormat()));
				ws.addCell(new Formula(7,2,"SUM(H4:H"+row+")",ws.getWritableCell(7, 2).getCellFormat()));
				ws.addCell(new Formula(8,2,"SUM(I4:I"+row+")",ws.getWritableCell(8, 2).getCellFormat()));
				ws.addCell(new Formula(9,2,"SUM(J4:J"+row+")",ws.getWritableCell(9, 2).getCellFormat()));
				ws.addCell(new Formula(10,2,"SUM(K4:K"+row+")",ws.getWritableCell(10, 2).getCellFormat()));
				ws.addCell(new Formula(11,2,"SUM(L4:L"+row+")",ws.getWritableCell(11, 2).getCellFormat()));
				ws.addCell(new Formula(12,2,"SUM(M4:M"+row+")",ws.getWritableCell(12, 2).getCellFormat()));
				ws.addCell(new Label(0,row,"Angebote",ws.getWritableCell(29, 1).getCellFormat()));
				row++;
				ws.addCell(new Label(0,row,"Total:",ws.getWritableCell(0, 2).getCellFormat()));
				ws.addCell(new Formula(1,row,"SUM(B"+(row+2)+":B150)",ws.getWritableCell(1, 2).getCellFormat()));
				ws.addCell(new Formula(2,row,"SUM(C"+(row+2)+":C150)",ws.getWritableCell(2, 2).getCellFormat()));
				ws.addCell(new Formula(3,row,"SUM(D"+(row+2)+":D150)",ws.getWritableCell(3, 2).getCellFormat()));
				ws.addCell(new Formula(4,row,"SUM(E"+(row+2)+":E150)",ws.getWritableCell(4, 2).getCellFormat()));
				ws.addCell(new Formula(5,row,"SUM(F"+(row+2)+":F150)",ws.getWritableCell(5, 2).getCellFormat()));
				ws.addCell(new Formula(6,row,"SUM(G"+(row+2)+":G150)",ws.getWritableCell(6, 2).getCellFormat()));
				ws.addCell(new Formula(7,row,"SUM(H"+(row+2)+":H150)",ws.getWritableCell(7, 2).getCellFormat()));
				ws.addCell(new Formula(8,row,"SUM(I"+(row+2)+":I150)",ws.getWritableCell(8, 2).getCellFormat()));
				ws.addCell(new Formula(9,row,"SUM(J"+(row+2)+":J150)",ws.getWritableCell(9, 2).getCellFormat()));
				ws.addCell(new Formula(10,row,"SUM(K"+(row+2)+":K150)",ws.getWritableCell(10, 2).getCellFormat()));
				ws.addCell(new Formula(11,row,"SUM(L"+(row+2)+":L150)",ws.getWritableCell(11, 2).getCellFormat()));
				ws.addCell(new Formula(12,row,"SUM(M"+(row+2)+":M150)",ws.getWritableCell(12, 2).getCellFormat()));
				row++;
				List<Invoice> angList;
				if(x == 0){
					angList = map.get(9);
				}else if(x == 6){
					angList = map.get(10);
				}else{
					angList = map.get(11);
				}
				for(int i=0; i<angList.size(); i++){
					ws.addCell(new Label(0,row,angList.get(i).getCus_name()));
					ws.addCell(new Number(1,row,angList.get(i).getJan().doubleValue(),ws.getWritableCell(1, 3).getCellFormat()));
					ws.addCell(new Number(2,row,angList.get(i).getFeb().doubleValue(),ws.getWritableCell(2, 3).getCellFormat()));
					ws.addCell(new Number(3,row,angList.get(i).getMar().doubleValue(),ws.getWritableCell(3, 3).getCellFormat()));
					ws.addCell(new Number(4,row,angList.get(i).getApr().doubleValue(),ws.getWritableCell(4, 3).getCellFormat()));
					ws.addCell(new Number(5,row,angList.get(i).getMay().doubleValue(),ws.getWritableCell(5, 3).getCellFormat()));
					ws.addCell(new Number(6,row,angList.get(i).getJun().doubleValue(),ws.getWritableCell(6, 3).getCellFormat()));
					ws.addCell(new Number(7,row,angList.get(i).getJul().doubleValue(),ws.getWritableCell(7, 3).getCellFormat()));
					ws.addCell(new Number(8,row,angList.get(i).getAug().doubleValue(),ws.getWritableCell(8, 3).getCellFormat()));
					ws.addCell(new Number(9,row,angList.get(i).getSep().doubleValue(),ws.getWritableCell(9, 3).getCellFormat()));
					ws.addCell(new Number(10,row,angList.get(i).getOct().doubleValue(),ws.getWritableCell(10, 3).getCellFormat()));
					ws.addCell(new Number(11,row,angList.get(i).getNov().doubleValue(),ws.getWritableCell(11, 3).getCellFormat()));
					ws.addCell(new Number(12,row,angList.get(i).getDec().doubleValue(),ws.getWritableCell(12, 3).getCellFormat()));
					row++;
				}
			}
 		}
		
	}

}
