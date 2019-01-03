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
//		map.put(0, (List<Invoice>) model.get("gsd"));
//		map.put(1, (List<Invoice>) model.get("jv"));
//		map.put(2, (List<Invoice>) model.get("fgs"));
//		map.put(3, (List<Invoice>) model.get("mm"));
//		map.put(4, (List<Invoice>) model.get("gsdp"));
//		map.put(5, (List<Invoice>) model.get("gps"));
//		map.put(6, (List<Invoice>) model.get("tta"));
//		map.put(7, (List<Invoice>) model.get("stu"));
//		map.put(8, (List<Invoice>) model.get("gsda"));
//		map.put(9, (List<Invoice>) model.get("gsd_angebote"));
//		map.put(10, (List<Invoice>) model.get("tta_angebote"));
//		map.put(11, (List<Invoice>) model.get("gsda_angebote"));
		map.put(0, (List<Invoice>) model.get("gsd18"));
		map.put(1, (List<Invoice>) model.get("jv18"));
		map.put(2, (List<Invoice>) model.get("fgs18"));
		map.put(3, (List<Invoice>) model.get("mm18"));
		map.put(4, (List<Invoice>) model.get("gsdp18"));
		map.put(5, (List<Invoice>) model.get("gps18"));
		map.put(6, (List<Invoice>) model.get("tta18"));
		map.put(7, (List<Invoice>) model.get("stu18"));
		map.put(8, (List<Invoice>) model.get("gsda18"));
		map.put(9, (List<Invoice>) model.get("gsd_angebote18"));
		map.put(10, (List<Invoice>) model.get("tta_angebote18"));
		map.put(11, (List<Invoice>) model.get("gsda_angebote18"));
		
		Map<Integer, List<Invoice>> map2 = new HashMap<Integer, List<Invoice>>();
		map2.put(0, (List<Invoice>) model.get("gsd19"));
		map2.put(1, (List<Invoice>) model.get("jv19"));
		map2.put(2, (List<Invoice>) model.get("fgs19"));
		map2.put(3, (List<Invoice>) model.get("mm19"));
		map2.put(4, (List<Invoice>) model.get("gsdp19"));
		map2.put(5, (List<Invoice>) model.get("gps19"));
		map2.put(6, (List<Invoice>) model.get("tta19"));
		map2.put(7, (List<Invoice>) model.get("stu19"));
		map2.put(8, (List<Invoice>) model.get("gsda19"));
		map2.put(9, (List<Invoice>) model.get("gsd_angebote19"));
		map2.put(10, (List<Invoice>) model.get("tta_angebote19"));
		map2.put(11, (List<Invoice>) model.get("gsda_angebote19"));
		
		Date dateTime = new Date();
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy_HHmmss");
		String currentDateTime = dateFormat.format(dateTime);
		
		String fileName = "Monthly-Report_"+currentDateTime;
		response.addHeader("Content-Disposition", "attachment; filename=\""+fileName+".xls\"");
		
 		for(int x=0; x<9; x++){
 			WritableSheet ws = workbook.getSheet(x);
 			List<Invoice> myList = map.get(x);
 			List<Invoice> myList2 = map2.get(x);
			int row = 4;
			for(int i=0; i<myList.size(); i++){
//				ws.addCell(new Label(0,row,myList.get(i).getCus_name()));
//				ws.addCell(new Number(1,row,myList.get(i).getJan().doubleValue(),ws.getWritableCell(1, 3).getCellFormat()));
//				ws.addCell(new Number(2,row,myList.get(i).getFeb().doubleValue(),ws.getWritableCell(2, 3).getCellFormat()));
//				ws.addCell(new Number(3,row,myList.get(i).getMar().doubleValue(),ws.getWritableCell(3, 3).getCellFormat()));
//				ws.addCell(new Number(4,row,myList.get(i).getApr().doubleValue(),ws.getWritableCell(4, 3).getCellFormat()));
//				ws.addCell(new Number(5,row,myList.get(i).getMay().doubleValue(),ws.getWritableCell(5, 3).getCellFormat()));
//				ws.addCell(new Number(6,row,myList.get(i).getJun().doubleValue(),ws.getWritableCell(6, 3).getCellFormat()));
//				ws.addCell(new Number(7,row,myList.get(i).getJul().doubleValue(),ws.getWritableCell(7, 3).getCellFormat()));
//				ws.addCell(new Number(8,row,myList.get(i).getAug().doubleValue(),ws.getWritableCell(8, 3).getCellFormat()));
//				ws.addCell(new Number(9,row,myList.get(i).getSep().doubleValue(),ws.getWritableCell(9, 3).getCellFormat()));
//				ws.addCell(new Number(10,row,myList.get(i).getOct().doubleValue(),ws.getWritableCell(10, 3).getCellFormat()));
//				ws.addCell(new Number(11,row,myList.get(i).getNov().doubleValue(),ws.getWritableCell(11, 3).getCellFormat()));
//				ws.addCell(new Number(12,row,myList.get(i).getDec().doubleValue(),ws.getWritableCell(12, 3).getCellFormat()));
				ws.addCell(new Label(0,row,myList.get(i).getCus_name()));
				ws.addCell(new Number(1,row,myList.get(i).getJan().doubleValue(),ws.getWritableCell(1, 4).getCellFormat()));
				ws.addCell(new Number(3,row,myList.get(i).getFeb().doubleValue(),ws.getWritableCell(3, 4).getCellFormat()));
				ws.addCell(new Number(5,row,myList.get(i).getMar().doubleValue(),ws.getWritableCell(5, 4).getCellFormat()));
				ws.addCell(new Number(7,row,myList.get(i).getApr().doubleValue(),ws.getWritableCell(7, 4).getCellFormat()));
				ws.addCell(new Number(9,row,myList.get(i).getMay().doubleValue(),ws.getWritableCell(9, 4).getCellFormat()));
				ws.addCell(new Number(11,row,myList.get(i).getJun().doubleValue(),ws.getWritableCell(11, 4).getCellFormat()));
				ws.addCell(new Number(13,row,myList.get(i).getJul().doubleValue(),ws.getWritableCell(13, 4).getCellFormat()));
				ws.addCell(new Number(15,row,myList.get(i).getAug().doubleValue(),ws.getWritableCell(15, 4).getCellFormat()));
				ws.addCell(new Number(17,row,myList.get(i).getSep().doubleValue(),ws.getWritableCell(17, 4).getCellFormat()));
				ws.addCell(new Number(19,row,myList.get(i).getOct().doubleValue(),ws.getWritableCell(19, 4).getCellFormat()));
				ws.addCell(new Number(21,row,myList.get(i).getNov().doubleValue(),ws.getWritableCell(21, 4).getCellFormat()));
				ws.addCell(new Number(23,row,myList.get(i).getDec().doubleValue(),ws.getWritableCell(23, 4).getCellFormat()));
				ws.addCell(new Number(2,row,myList2.get(i).getJan().doubleValue(),ws.getWritableCell(2, 4).getCellFormat()));
				ws.addCell(new Number(4,row,myList2.get(i).getFeb().doubleValue(),ws.getWritableCell(4, 4).getCellFormat()));
				ws.addCell(new Number(6,row,myList2.get(i).getMar().doubleValue(),ws.getWritableCell(6, 4).getCellFormat()));
				ws.addCell(new Number(8,row,myList2.get(i).getApr().doubleValue(),ws.getWritableCell(8, 4).getCellFormat()));
				ws.addCell(new Number(10,row,myList2.get(i).getMay().doubleValue(),ws.getWritableCell(10, 4).getCellFormat()));
				ws.addCell(new Number(12,row,myList2.get(i).getJun().doubleValue(),ws.getWritableCell(12, 4).getCellFormat()));
				ws.addCell(new Number(14,row,myList2.get(i).getJul().doubleValue(),ws.getWritableCell(14, 4).getCellFormat()));
				ws.addCell(new Number(16,row,myList2.get(i).getAug().doubleValue(),ws.getWritableCell(16, 4).getCellFormat()));
				ws.addCell(new Number(18,row,myList2.get(i).getSep().doubleValue(),ws.getWritableCell(18, 4).getCellFormat()));
				ws.addCell(new Number(20,row,myList2.get(i).getOct().doubleValue(),ws.getWritableCell(20, 4).getCellFormat()));
				ws.addCell(new Number(22,row,myList2.get(i).getNov().doubleValue(),ws.getWritableCell(22, 4).getCellFormat()));
				ws.addCell(new Number(24,row,myList2.get(i).getDec().doubleValue(),ws.getWritableCell(24, 4).getCellFormat()));
				row++;
			}
			if(x == 0 || x == 6 || x == 8){
				row++;
				ws.addCell(new Formula(1,3,"SUM(B5:B"+row+")",ws.getWritableCell(1, 3).getCellFormat()));
				ws.addCell(new Formula(2,3,"SUM(C5:C"+row+")",ws.getWritableCell(2, 3).getCellFormat()));
				ws.addCell(new Formula(3,3,"SUM(D5:D"+row+")",ws.getWritableCell(3, 3).getCellFormat()));
				ws.addCell(new Formula(4,3,"SUM(E5:E"+row+")",ws.getWritableCell(4, 3).getCellFormat()));
				ws.addCell(new Formula(5,3,"SUM(F5:F"+row+")",ws.getWritableCell(5, 3).getCellFormat()));
				ws.addCell(new Formula(6,3,"SUM(G5:G"+row+")",ws.getWritableCell(6, 3).getCellFormat()));
				ws.addCell(new Formula(7,3,"SUM(H5:H"+row+")",ws.getWritableCell(7, 3).getCellFormat()));
				ws.addCell(new Formula(8,3,"SUM(I5:I"+row+")",ws.getWritableCell(8, 3).getCellFormat()));
				ws.addCell(new Formula(9,3,"SUM(J5:J"+row+")",ws.getWritableCell(9, 3).getCellFormat()));
				ws.addCell(new Formula(10,3,"SUM(K5:K"+row+")",ws.getWritableCell(10, 3).getCellFormat()));
				ws.addCell(new Formula(11,3,"SUM(L5:L"+row+")",ws.getWritableCell(11, 3).getCellFormat()));
				ws.addCell(new Formula(12,3,"SUM(M5:M"+row+")",ws.getWritableCell(12, 3).getCellFormat()));
				ws.addCell(new Formula(13,3,"SUM(N5:N"+row+")",ws.getWritableCell(13, 3).getCellFormat()));
				ws.addCell(new Formula(14,3,"SUM(O5:O"+row+")",ws.getWritableCell(14, 3).getCellFormat()));
				ws.addCell(new Formula(15,3,"SUM(P5:P"+row+")",ws.getWritableCell(15, 3).getCellFormat()));
				ws.addCell(new Formula(16,3,"SUM(Q5:Q"+row+")",ws.getWritableCell(16, 3).getCellFormat()));
				ws.addCell(new Formula(17,3,"SUM(R5:R"+row+")",ws.getWritableCell(17, 3).getCellFormat()));
				ws.addCell(new Formula(18,3,"SUM(S5:S"+row+")",ws.getWritableCell(18, 3).getCellFormat()));
				ws.addCell(new Formula(19,3,"SUM(T5:T"+row+")",ws.getWritableCell(19, 3).getCellFormat()));
				ws.addCell(new Formula(20,3,"SUM(U5:U"+row+")",ws.getWritableCell(20, 3).getCellFormat()));
				ws.addCell(new Formula(21,3,"SUM(V5:V"+row+")",ws.getWritableCell(21, 3).getCellFormat()));
				ws.addCell(new Formula(22,3,"SUM(W5:W"+row+")",ws.getWritableCell(22, 3).getCellFormat()));
				ws.addCell(new Formula(23,3,"SUM(X5:X"+row+")",ws.getWritableCell(23, 3).getCellFormat()));
				ws.addCell(new Formula(24,3,"SUM(Y5:Y"+row+")",ws.getWritableCell(24, 3).getCellFormat()));
				ws.addCell(new Label(0,row,"Angebote",ws.getWritableCell(41, 1).getCellFormat()));
				row++;
				ws.addCell(new Label(0,row,"Total:",ws.getWritableCell(0, 2).getCellFormat()));
				ws.addCell(new Formula(1,row,"SUM(B"+(row+3)+":B150)",ws.getWritableCell(1, 3).getCellFormat()));
				ws.addCell(new Formula(2,row,"SUM(C"+(row+3)+":C150)",ws.getWritableCell(2, 3).getCellFormat()));
				ws.addCell(new Formula(3,row,"SUM(D"+(row+3)+":D150)",ws.getWritableCell(3, 3).getCellFormat()));
				ws.addCell(new Formula(4,row,"SUM(E"+(row+3)+":E150)",ws.getWritableCell(4, 3).getCellFormat()));
				ws.addCell(new Formula(5,row,"SUM(F"+(row+3)+":F150)",ws.getWritableCell(5, 3).getCellFormat()));
				ws.addCell(new Formula(6,row,"SUM(G"+(row+3)+":G150)",ws.getWritableCell(6, 3).getCellFormat()));
				ws.addCell(new Formula(7,row,"SUM(H"+(row+3)+":H150)",ws.getWritableCell(7, 3).getCellFormat()));
				ws.addCell(new Formula(8,row,"SUM(I"+(row+3)+":I150)",ws.getWritableCell(8, 3).getCellFormat()));
				ws.addCell(new Formula(9,row,"SUM(J"+(row+3)+":J150)",ws.getWritableCell(9, 3).getCellFormat()));
				ws.addCell(new Formula(10,row,"SUM(K"+(row+3)+":K150)",ws.getWritableCell(10, 3).getCellFormat()));
				ws.addCell(new Formula(11,row,"SUM(L"+(row+3)+":L150)",ws.getWritableCell(11, 3).getCellFormat()));
				ws.addCell(new Formula(12,row,"SUM(M"+(row+3)+":M150)",ws.getWritableCell(12, 3).getCellFormat()));
				ws.addCell(new Formula(13,row,"SUM(N"+(row+3)+":N150)",ws.getWritableCell(13, 3).getCellFormat()));
				ws.addCell(new Formula(14,row,"SUM(O"+(row+3)+":O150)",ws.getWritableCell(14, 3).getCellFormat()));
				ws.addCell(new Formula(15,row,"SUM(P"+(row+3)+":P150)",ws.getWritableCell(15, 3).getCellFormat()));
				ws.addCell(new Formula(16,row,"SUM(Q"+(row+3)+":Q150)",ws.getWritableCell(16, 3).getCellFormat()));
				ws.addCell(new Formula(17,row,"SUM(R"+(row+3)+":R150)",ws.getWritableCell(17, 3).getCellFormat()));
				ws.addCell(new Formula(18,row,"SUM(S"+(row+3)+":S150)",ws.getWritableCell(18, 3).getCellFormat()));
				ws.addCell(new Formula(19,row,"SUM(T"+(row+3)+":T150)",ws.getWritableCell(19, 3).getCellFormat()));
				ws.addCell(new Formula(20,row,"SUM(U"+(row+3)+":U150)",ws.getWritableCell(20, 3).getCellFormat()));
				ws.addCell(new Formula(21,row,"SUM(V"+(row+3)+":V150)",ws.getWritableCell(21, 3).getCellFormat()));
				ws.addCell(new Formula(22,row,"SUM(W"+(row+3)+":W150)",ws.getWritableCell(22, 3).getCellFormat()));
				ws.addCell(new Formula(23,row,"SUM(X"+(row+3)+":X150)",ws.getWritableCell(23, 3).getCellFormat()));
				ws.addCell(new Formula(24,row,"SUM(Y"+(row+3)+":Y150)",ws.getWritableCell(24, 3).getCellFormat()));
				row++;
				List<Invoice> angList;
				List<Invoice> angList2;
				if(x == 0){
					angList = map.get(9);
					angList2 = map2.get(9);
				}else if(x == 6){
					angList = map.get(10);
					angList2 = map2.get(10);
				}else{
					angList = map.get(11);
					angList2 = map2.get(11);
				}
				for(int i=0; i<angList.size(); i++){
//					ws.addCell(new Label(0,row,angList.get(i).getCus_name()));
//					ws.addCell(new Number(1,row,angList.get(i).getJan().doubleValue(),ws.getWritableCell(1, 3).getCellFormat()));
//					ws.addCell(new Number(2,row,angList.get(i).getFeb().doubleValue(),ws.getWritableCell(2, 3).getCellFormat()));
//					ws.addCell(new Number(3,row,angList.get(i).getMar().doubleValue(),ws.getWritableCell(3, 3).getCellFormat()));
//					ws.addCell(new Number(4,row,angList.get(i).getApr().doubleValue(),ws.getWritableCell(4, 3).getCellFormat()));
//					ws.addCell(new Number(5,row,angList.get(i).getMay().doubleValue(),ws.getWritableCell(5, 3).getCellFormat()));
//					ws.addCell(new Number(6,row,angList.get(i).getJun().doubleValue(),ws.getWritableCell(6, 3).getCellFormat()));
//					ws.addCell(new Number(7,row,angList.get(i).getJul().doubleValue(),ws.getWritableCell(7, 3).getCellFormat()));
//					ws.addCell(new Number(8,row,angList.get(i).getAug().doubleValue(),ws.getWritableCell(8, 3).getCellFormat()));
//					ws.addCell(new Number(9,row,angList.get(i).getSep().doubleValue(),ws.getWritableCell(9, 3).getCellFormat()));
//					ws.addCell(new Number(10,row,angList.get(i).getOct().doubleValue(),ws.getWritableCell(10, 3).getCellFormat()));
//					ws.addCell(new Number(11,row,angList.get(i).getNov().doubleValue(),ws.getWritableCell(11, 3).getCellFormat()));
//					ws.addCell(new Number(12,row,angList.get(i).getDec().doubleValue(),ws.getWritableCell(12, 3).getCellFormat()));
					ws.addCell(new Label(0,row,angList.get(i).getCus_name()));
					ws.addCell(new Number(1,row,angList.get(i).getJan().doubleValue(),ws.getWritableCell(1, 4).getCellFormat()));
					ws.addCell(new Number(3,row,angList.get(i).getFeb().doubleValue(),ws.getWritableCell(3, 4).getCellFormat()));
					ws.addCell(new Number(5,row,angList.get(i).getMar().doubleValue(),ws.getWritableCell(5, 4).getCellFormat()));
					ws.addCell(new Number(7,row,angList.get(i).getApr().doubleValue(),ws.getWritableCell(7, 4).getCellFormat()));
					ws.addCell(new Number(9,row,angList.get(i).getMay().doubleValue(),ws.getWritableCell(9, 4).getCellFormat()));
					ws.addCell(new Number(11,row,angList.get(i).getJun().doubleValue(),ws.getWritableCell(11, 4).getCellFormat()));
					ws.addCell(new Number(13,row,angList.get(i).getJul().doubleValue(),ws.getWritableCell(13, 4).getCellFormat()));
					ws.addCell(new Number(15,row,angList.get(i).getAug().doubleValue(),ws.getWritableCell(15, 4).getCellFormat()));
					ws.addCell(new Number(17,row,angList.get(i).getSep().doubleValue(),ws.getWritableCell(17, 4).getCellFormat()));
					ws.addCell(new Number(19,row,angList.get(i).getOct().doubleValue(),ws.getWritableCell(19, 4).getCellFormat()));
					ws.addCell(new Number(21,row,angList.get(i).getNov().doubleValue(),ws.getWritableCell(21, 4).getCellFormat()));
					ws.addCell(new Number(23,row,angList.get(i).getDec().doubleValue(),ws.getWritableCell(23, 4).getCellFormat()));
					ws.addCell(new Number(2,row,angList2.get(i).getJan().doubleValue(),ws.getWritableCell(2, 4).getCellFormat()));
					ws.addCell(new Number(4,row,angList2.get(i).getFeb().doubleValue(),ws.getWritableCell(4, 4).getCellFormat()));
					ws.addCell(new Number(6,row,angList2.get(i).getMar().doubleValue(),ws.getWritableCell(6, 4).getCellFormat()));
					ws.addCell(new Number(8,row,angList2.get(i).getApr().doubleValue(),ws.getWritableCell(8, 4).getCellFormat()));
					ws.addCell(new Number(10,row,angList2.get(i).getMay().doubleValue(),ws.getWritableCell(10, 4).getCellFormat()));
					ws.addCell(new Number(12,row,angList2.get(i).getJun().doubleValue(),ws.getWritableCell(12, 4).getCellFormat()));
					ws.addCell(new Number(14,row,angList2.get(i).getJul().doubleValue(),ws.getWritableCell(14, 4).getCellFormat()));
					ws.addCell(new Number(16,row,angList2.get(i).getAug().doubleValue(),ws.getWritableCell(16, 4).getCellFormat()));
					ws.addCell(new Number(18,row,angList2.get(i).getSep().doubleValue(),ws.getWritableCell(18, 4).getCellFormat()));
					ws.addCell(new Number(20,row,angList2.get(i).getOct().doubleValue(),ws.getWritableCell(20, 4).getCellFormat()));
					ws.addCell(new Number(22,row,angList2.get(i).getNov().doubleValue(),ws.getWritableCell(22, 4).getCellFormat()));
					ws.addCell(new Number(24,row,angList2.get(i).getDec().doubleValue(),ws.getWritableCell(24, 4).getCellFormat()));
					row++;
				}
			}
 		}
		
	}

}
