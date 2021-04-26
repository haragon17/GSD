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
		
		Map<Integer, List<Invoice>> map3 = new HashMap<Integer, List<Invoice>>();
		map3.put(0, (List<Invoice>) model.get("gsd20"));
		map3.put(1, (List<Invoice>) model.get("jv20"));
		map3.put(2, (List<Invoice>) model.get("fgs20"));
		map3.put(3, (List<Invoice>) model.get("mm20"));
		map3.put(4, (List<Invoice>) model.get("gsdp20"));
		map3.put(5, (List<Invoice>) model.get("gps20"));
		map3.put(6, (List<Invoice>) model.get("tta20"));
		map3.put(7, (List<Invoice>) model.get("stu20"));
		map3.put(8, (List<Invoice>) model.get("gsda20"));
		map3.put(9, (List<Invoice>) model.get("gsd_angebote20"));
		map3.put(10, (List<Invoice>) model.get("tta_angebote20"));
		map3.put(11, (List<Invoice>) model.get("gsda_angebote20"));
		
		Map<Integer, List<Invoice>> map4 = new HashMap<Integer, List<Invoice>>();
		map4.put(0, (List<Invoice>) model.get("gsd21"));
		map4.put(1, (List<Invoice>) model.get("jv21"));
		map4.put(2, (List<Invoice>) model.get("fgs21"));
		map4.put(3, (List<Invoice>) model.get("mm21"));
		map4.put(4, (List<Invoice>) model.get("gsdp21"));
		map4.put(5, (List<Invoice>) model.get("gps21"));
		map4.put(6, (List<Invoice>) model.get("tta21"));
		map4.put(7, (List<Invoice>) model.get("stu21"));
		map4.put(8, (List<Invoice>) model.get("gsda21"));
		map4.put(9, (List<Invoice>) model.get("gsd_angebote21"));
		map4.put(10, (List<Invoice>) model.get("tta_angebote21"));
		map4.put(11, (List<Invoice>) model.get("gsda_angebote21"));
		
		Date dateTime = new Date();
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy_HHmmss");
		String currentDateTime = dateFormat.format(dateTime);
		
		String fileName = "Monthly-Report_"+currentDateTime;
		response.addHeader("Content-Disposition", "attachment; filename=\""+fileName+".xls\"");
		
 		for(int x=0; x<9; x++){
 			WritableSheet ws = workbook.getSheet(x);
 			List<Invoice> myList = map.get(x);
 			List<Invoice> myList2 = map2.get(x);
 			List<Invoice> myList3 = map3.get(x);
 			List<Invoice> myList4 = map4.get(x);
			int row = 4;
			for(int i=0; i<myList.size(); i++){
				
//				ws.addCell(new Label(0,row,myList.get(i).getCus_name()));
//				for(int abc=1; abc<=36; abc++){
//					ws.addCell(new Number(abc,row,myList.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));
//					abc++;
//					ws.addCell(new Number(abc,row,myList2.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));
//					abc++;
//					ws.addCell(new Number(abc,row,myList3.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));
//				}
//				row++;
				int abc = 1;
				ws.addCell(new Label(0,row,myList.get(i).getCus_name()));
				ws.addCell(new Number(abc,row,myList.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getFeb().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getFeb().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getFeb().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getFeb().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getMar().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getMar().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getMar().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getMar().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getApr().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getApr().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getApr().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getApr().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getMay().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getMay().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getMay().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getMay().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getJun().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getJun().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getJun().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getJun().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getJul().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getJul().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getJul().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getJul().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getAug().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getAug().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getAug().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getAug().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getSep().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getSep().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getSep().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getSep().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getOct().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getOct().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getOct().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getOct().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getNov().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getNov().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getNov().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getNov().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList.get(i).getDec().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList2.get(i).getDec().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList3.get(i).getDec().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
				ws.addCell(new Number(abc,row,myList4.get(i).getDec().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
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
				ws.addCell(new Formula(25,3,"SUM(Z5:Z"+row+")",ws.getWritableCell(25, 3).getCellFormat()));
				ws.addCell(new Formula(26,3,"SUM(AA5:AA"+row+")",ws.getWritableCell(26, 3).getCellFormat()));
				ws.addCell(new Formula(27,3,"SUM(AB5:AB"+row+")",ws.getWritableCell(27, 3).getCellFormat()));
				ws.addCell(new Formula(28,3,"SUM(AC5:AC"+row+")",ws.getWritableCell(28, 3).getCellFormat()));
				ws.addCell(new Formula(29,3,"SUM(AD5:AD"+row+")",ws.getWritableCell(29, 3).getCellFormat()));
				ws.addCell(new Formula(30,3,"SUM(AE5:AE"+row+")",ws.getWritableCell(30, 3).getCellFormat()));
				ws.addCell(new Formula(31,3,"SUM(AF5:AF"+row+")",ws.getWritableCell(31, 3).getCellFormat()));
				ws.addCell(new Formula(32,3,"SUM(AG5:AG"+row+")",ws.getWritableCell(32, 3).getCellFormat()));
				ws.addCell(new Formula(33,3,"SUM(AH5:AH"+row+")",ws.getWritableCell(33, 3).getCellFormat()));
				ws.addCell(new Formula(34,3,"SUM(AI5:AI"+row+")",ws.getWritableCell(34, 3).getCellFormat()));
				ws.addCell(new Formula(35,3,"SUM(AJ5:AJ"+row+")",ws.getWritableCell(35, 3).getCellFormat()));
				ws.addCell(new Formula(36,3,"SUM(AK5:AK"+row+")",ws.getWritableCell(36, 3).getCellFormat()));
				ws.addCell(new Formula(37,3,"SUM(AL5:AL"+row+")",ws.getWritableCell(37, 3).getCellFormat()));
				ws.addCell(new Formula(38,3,"SUM(AM5:AM"+row+")",ws.getWritableCell(38, 3).getCellFormat()));
				ws.addCell(new Formula(39,3,"SUM(AN5:AN"+row+")",ws.getWritableCell(39, 3).getCellFormat()));
				ws.addCell(new Formula(40,3,"SUM(AO5:AO"+row+")",ws.getWritableCell(40, 3).getCellFormat()));
				ws.addCell(new Formula(41,3,"SUM(AP5:AP"+row+")",ws.getWritableCell(41, 3).getCellFormat()));
				ws.addCell(new Formula(42,3,"SUM(AQ5:AQ"+row+")",ws.getWritableCell(42, 3).getCellFormat()));
				ws.addCell(new Formula(43,3,"SUM(AR5:AR"+row+")",ws.getWritableCell(43, 3).getCellFormat()));
				ws.addCell(new Formula(44,3,"SUM(AS5:AS"+row+")",ws.getWritableCell(44, 3).getCellFormat()));
				ws.addCell(new Formula(45,3,"SUM(AT5:AT"+row+")",ws.getWritableCell(45, 3).getCellFormat()));
				ws.addCell(new Formula(46,3,"SUM(AU5:AU"+row+")",ws.getWritableCell(46, 3).getCellFormat()));
				ws.addCell(new Formula(47,3,"SUM(AV5:AV"+row+")",ws.getWritableCell(47, 3).getCellFormat()));
				ws.addCell(new Formula(48,3,"SUM(AW5:AW"+row+")",ws.getWritableCell(48, 3).getCellFormat()));
				ws.addCell(new Label(0,row,"Angebote",ws.getWritableCell(65, 1).getCellFormat()));
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
				ws.addCell(new Formula(25,row,"SUM(Z"+(row+3)+":Z150)",ws.getWritableCell(25, 3).getCellFormat()));
				ws.addCell(new Formula(26,row,"SUM(AA"+(row+3)+":AA150)",ws.getWritableCell(26, 3).getCellFormat()));
				ws.addCell(new Formula(27,row,"SUM(AB"+(row+3)+":AB150)",ws.getWritableCell(27, 3).getCellFormat()));
				ws.addCell(new Formula(28,row,"SUM(AC"+(row+3)+":AC150)",ws.getWritableCell(28, 3).getCellFormat()));
				ws.addCell(new Formula(29,row,"SUM(AD"+(row+3)+":AD150)",ws.getWritableCell(29, 3).getCellFormat()));
				ws.addCell(new Formula(30,row,"SUM(AE"+(row+3)+":AE150)",ws.getWritableCell(30, 3).getCellFormat()));
				ws.addCell(new Formula(31,row,"SUM(AF"+(row+3)+":AF150)",ws.getWritableCell(31, 3).getCellFormat()));
				ws.addCell(new Formula(32,row,"SUM(AG"+(row+3)+":AG150)",ws.getWritableCell(32, 3).getCellFormat()));
				ws.addCell(new Formula(33,row,"SUM(AH"+(row+3)+":AH150)",ws.getWritableCell(33, 3).getCellFormat()));
				ws.addCell(new Formula(34,row,"SUM(AI"+(row+3)+":AI150)",ws.getWritableCell(34, 3).getCellFormat()));
				ws.addCell(new Formula(35,row,"SUM(AJ"+(row+3)+":AJ150)",ws.getWritableCell(35, 3).getCellFormat()));
				ws.addCell(new Formula(36,row,"SUM(AK"+(row+3)+":AK150)",ws.getWritableCell(36, 3).getCellFormat()));
				ws.addCell(new Formula(37,row,"SUM(AL"+(row+3)+":AL150)",ws.getWritableCell(37, 3).getCellFormat()));
				ws.addCell(new Formula(38,row,"SUM(AM"+(row+3)+":AM150)",ws.getWritableCell(38, 3).getCellFormat()));
				ws.addCell(new Formula(39,row,"SUM(AN"+(row+3)+":AN150)",ws.getWritableCell(39, 3).getCellFormat()));
				ws.addCell(new Formula(40,row,"SUM(AO"+(row+3)+":AO150)",ws.getWritableCell(40, 3).getCellFormat()));
				ws.addCell(new Formula(41,row,"SUM(AP"+(row+3)+":AP150)",ws.getWritableCell(41, 3).getCellFormat()));
				ws.addCell(new Formula(42,row,"SUM(AQ"+(row+3)+":AQ150)",ws.getWritableCell(42, 3).getCellFormat()));
				ws.addCell(new Formula(43,row,"SUM(AR"+(row+3)+":AR150)",ws.getWritableCell(43, 3).getCellFormat()));
				ws.addCell(new Formula(44,row,"SUM(AS"+(row+3)+":AS150)",ws.getWritableCell(44, 3).getCellFormat()));
				ws.addCell(new Formula(45,row,"SUM(AT"+(row+3)+":AT150)",ws.getWritableCell(45, 3).getCellFormat()));
				ws.addCell(new Formula(46,row,"SUM(AU"+(row+3)+":AU150)",ws.getWritableCell(46, 3).getCellFormat()));
				ws.addCell(new Formula(47,row,"SUM(AV"+(row+3)+":AV150)",ws.getWritableCell(47, 3).getCellFormat()));
				ws.addCell(new Formula(48,row,"SUM(AW"+(row+3)+":AW150)",ws.getWritableCell(48, 3).getCellFormat()));
				row++;
				List<Invoice> angList;
				List<Invoice> angList2;
				List<Invoice> angList3;
				List<Invoice> angList4;
				if(x == 0){
					angList = map.get(9);
					angList2 = map2.get(9);
					angList3 = map3.get(9);
					angList4 = map4.get(9);
				}else if(x == 6){
					angList = map.get(10);
					angList2 = map2.get(10);
					angList3 = map3.get(10);
					angList4 = map4.get(10);
				}else{
					angList = map.get(11);
					angList2 = map2.get(11);
					angList3 = map3.get(11);
					angList4 = map.get(11);
				}
				for(int i=0; i<angList.size(); i++){
					
//					ws.addCell(new Label(0,row,angList.get(i).getCus_name()));
//					for(int abc=1; abc<=36; abc++){
//						ws.addCell(new Number(abc,row,angList.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));
//						abc++;
//						ws.addCell(new Number(abc,row,angList2.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));
//						abc++;
//						ws.addCell(new Number(abc,row,angList3.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));
//						abc++;
//					}
//					row++;
//					ws.addCell(new Label(0,row,angList.get(i).getCus_name()));
//					ws.addCell(new Number(1,row,angList.get(i).getJan().doubleValue(),ws.getWritableCell(1, 4).getCellFormat()));
//					ws.addCell(new Number(3,row,angList.get(i).getFeb().doubleValue(),ws.getWritableCell(3, 4).getCellFormat()));
//					ws.addCell(new Number(5,row,angList.get(i).getMar().doubleValue(),ws.getWritableCell(5, 4).getCellFormat()));
//					ws.addCell(new Number(7,row,angList.get(i).getApr().doubleValue(),ws.getWritableCell(7, 4).getCellFormat()));
//					ws.addCell(new Number(9,row,angList.get(i).getMay().doubleValue(),ws.getWritableCell(9, 4).getCellFormat()));
//					ws.addCell(new Number(11,row,angList.get(i).getJun().doubleValue(),ws.getWritableCell(11, 4).getCellFormat()));
//					ws.addCell(new Number(13,row,angList.get(i).getJul().doubleValue(),ws.getWritableCell(13, 4).getCellFormat()));
//					ws.addCell(new Number(15,row,angList.get(i).getAug().doubleValue(),ws.getWritableCell(15, 4).getCellFormat()));
//					ws.addCell(new Number(17,row,angList.get(i).getSep().doubleValue(),ws.getWritableCell(17, 4).getCellFormat()));
//					ws.addCell(new Number(19,row,angList.get(i).getOct().doubleValue(),ws.getWritableCell(19, 4).getCellFormat()));
//					ws.addCell(new Number(21,row,angList.get(i).getNov().doubleValue(),ws.getWritableCell(21, 4).getCellFormat()));
//					ws.addCell(new Number(23,row,angList.get(i).getDec().doubleValue(),ws.getWritableCell(23, 4).getCellFormat()));
//					ws.addCell(new Number(2,row,angList2.get(i).getJan().doubleValue(),ws.getWritableCell(2, 4).getCellFormat()));
//					ws.addCell(new Number(4,row,angList2.get(i).getFeb().doubleValue(),ws.getWritableCell(4, 4).getCellFormat()));
//					ws.addCell(new Number(6,row,angList2.get(i).getMar().doubleValue(),ws.getWritableCell(6, 4).getCellFormat()));
//					ws.addCell(new Number(8,row,angList2.get(i).getApr().doubleValue(),ws.getWritableCell(8, 4).getCellFormat()));
//					ws.addCell(new Number(10,row,angList2.get(i).getMay().doubleValue(),ws.getWritableCell(10, 4).getCellFormat()));
//					ws.addCell(new Number(12,row,angList2.get(i).getJun().doubleValue(),ws.getWritableCell(12, 4).getCellFormat()));
//					ws.addCell(new Number(14,row,angList2.get(i).getJul().doubleValue(),ws.getWritableCell(14, 4).getCellFormat()));
//					ws.addCell(new Number(16,row,angList2.get(i).getAug().doubleValue(),ws.getWritableCell(16, 4).getCellFormat()));
//					ws.addCell(new Number(18,row,angList2.get(i).getSep().doubleValue(),ws.getWritableCell(18, 4).getCellFormat()));
//					ws.addCell(new Number(20,row,angList2.get(i).getOct().doubleValue(),ws.getWritableCell(20, 4).getCellFormat()));
//					ws.addCell(new Number(22,row,angList2.get(i).getNov().doubleValue(),ws.getWritableCell(22, 4).getCellFormat()));
//					ws.addCell(new Number(24,row,angList2.get(i).getDec().doubleValue(),ws.getWritableCell(24, 4).getCellFormat()));
//					row++;
					int abc = 1;
					ws.addCell(new Label(0,row,angList.get(i).getCus_name()));
					ws.addCell(new Number(abc,row,angList.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getJan().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getFeb().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getFeb().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getFeb().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getFeb().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getMar().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getMar().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getMar().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getMar().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getApr().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getApr().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getApr().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getApr().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getMay().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getMay().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getMay().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getMay().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getJun().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getJun().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getJun().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getJun().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getJul().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getJul().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getJul().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getJul().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getAug().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getAug().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getAug().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getAug().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getSep().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getSep().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getSep().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getSep().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getOct().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getOct().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getOct().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getOct().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getNov().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getNov().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getNov().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getNov().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList.get(i).getDec().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList2.get(i).getDec().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList3.get(i).getDec().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					ws.addCell(new Number(abc,row,angList4.get(i).getDec().doubleValue(),ws.getWritableCell(abc, 4).getCellFormat()));abc++;
					row++;
				}
			}
 		}
		
	}

}
