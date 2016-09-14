package com.gsd.report;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.format.CellFormat;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.springframework.web.servlet.view.document.AbstractJExcelView;

import com.gsd.model.Report;

public class ReportView_old extends AbstractJExcelView{

	@Override
	protected void buildExcelDocument(Map<String, Object> model,
			WritableWorkbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		
		List<Report> list = (List<Report>) model.get("list");
		
		String fileName = "GSD-Report";
		response.addHeader("Content-Disposition", "attachment; filename="+fileName+".xls");
		WritableSheet ws = workbook.getSheet(0);
        ws.setName("ReportDetail");
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date date = new Date();
		DateFormat dateFormat1 = new SimpleDateFormat("HH:mm:ss");
		
        CellFormat name = ws.getWritableCell(1, 12).getCellFormat();
        CellFormat cate1 = ws.getWritableCell(2, 12).getCellFormat();
        CellFormat cate2 = ws.getWritableCell(3, 12).getCellFormat();
        CellFormat cate3 = ws.getWritableCell(4, 12).getCellFormat();
        CellFormat createBy = ws.getWritableCell(5, 12).getCellFormat();
        CellFormat createDate = ws.getWritableCell(6, 12).getCellFormat();
        CellFormat updateDate = ws.getWritableCell(7, 12).getCellFormat();
        
        //Header
        ws.addCell(new Label(2,3,(model.get("name")==null? "" : model.get("name")+""),ws.getWritableCell(2, 3).getCellFormat()));
        ws.addCell(new Label(2,4,(model.get("cate1")==null? "" : model.get("cate1")+""),ws.getWritableCell(2, 4).getCellFormat()));
        ws.addCell(new Label(2,5,(model.get("cate2")==null? "" : model.get("cate2")+""),ws.getWritableCell(2, 5).getCellFormat()));
        ws.addCell(new Label(2,6,(model.get("cate3")==null? "" : model.get("cate3")+""),ws.getWritableCell(2, 6).getCellFormat()));
        ws.addCell(new Label(2,7,(model.get("screate")==null? "" : model.get("screate")+""),ws.getWritableCell(2, 7).getCellFormat()));
        ws.addCell(new Label(4,7,(model.get("ecreate")==null? "" : model.get("ecreate")+""),ws.getWritableCell(4, 7).getCellFormat()));
        ws.addCell(new Label(2,8,(model.get("supdate")==null? "" : model.get("supdate")+""),ws.getWritableCell(2, 8).getCellFormat()));
        ws.addCell(new Label(4,8,(model.get("eupdate")==null? "" : model.get("eupdate")+""),ws.getWritableCell(4, 8).getCellFormat()));
        ws.addCell(new Label(6,3,dateFormat.format(date),ws.getWritableCell(6, 3).getCellFormat()));
        ws.addCell(new Label(6,4,dateFormat1.format(date),ws.getWritableCell(6, 4).getCellFormat()));
	
        int row = 12;
        for(int i = 0;i<list.size();i++){
        	
        	ws.addCell(new Label(1,row,list.get(i).getWrk_name()+"",name));
        	ws.addCell(new Label(2,row,(list.get(i).getCate1()==null? "" : list.get(i).getCate1()+""),cate1));
        	ws.addCell(new Label(3,row,(list.get(i).getCate2()==null? "" : list.get(i).getCate2()+""),cate2));
        	ws.addCell(new Label(4,row,(list.get(i).getCate3()==null? "" : list.get(i).getCate3()+"")+"",cate3));
        	ws.addCell(new Label(5,row,list.get(i).getUsr_name()+"",createBy));
        	ws.addCell(new Label(6,row,list.get(i).getCretd_date()+"",createDate));
        	ws.addCell(new Label(7,row,list.get(i).getUpdate_date()+"",updateDate));
        	
        	row++;
        	
        }
	
	}

}
