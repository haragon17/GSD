package com.gsd.report;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.view.document.AbstractJExcelView;

import com.gsd.model.TimeRecord;

import jxl.CellView;
import jxl.format.CellFormat;
import jxl.write.Formula;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

public class TimeRecordView extends AbstractJExcelView {

	@Override
	protected void buildExcelDocument(Map<String, Object> model,
			WritableWorkbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		
		List<TimeRecord> list = (List<TimeRecord>) model.get("list");
		String fileName = "GSD-TimeReport";
		response.addHeader("Content-Disposition", "attachment; filename=\""+fileName+".xls\"");
		WritableSheet ws = workbook.getSheet(0);
		Date dateTime = new Date();
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        DateFormat dateFormat1 = new SimpleDateFormat("HH:mm:ss");
        
        CellFormat date = ws.getWritableCell(1, 10).getCellFormat();
        CellFormat cus = ws.getWritableCell(2, 10).getCellFormat();
        CellFormat job = ws.getWritableCell(3, 10).getCellFormat();
        CellFormat file = ws.getWritableCell(4, 10).getCellFormat();
        CellFormat start = ws.getWritableCell(5, 10).getCellFormat();
        CellFormat finish = ws.getWritableCell(6, 10).getCellFormat();
        CellFormat process = ws.getWritableCell(7, 10).getCellFormat();
        CellFormat operator = ws.getWritableCell(8, 10).getCellFormat();
        CellFormat sum = ws.getWritableCell(9, 10).getCellFormat();
        
        //Header
        ws.addCell(new Label(2,4,dateFormat.format(dateTime),ws.getWritableCell(2, 4).getCellFormat()));
        ws.addCell(new Label(2,6,dateFormat1.format(dateTime),ws.getWritableCell(2, 6).getCellFormat()));
        
        ws.addCell(new Label(6,3,(model.get("tr_name")==null? "" : model.get("tr_name")+""),ws.getWritableCell(6, 3).getCellFormat()));
        ws.addCell(new Label(6,4,(model.get("job_ref_name")==null? "" : model.get("job_ref_name")+""),ws.getWritableCell(6, 4).getCellFormat()));
        ws.addCell(new Label(6,5,(model.get("process")==null? "" : model.get("process")+""),ws.getWritableCell(6, 5).getCellFormat()));
        ws.addCell(new Label(6,6,(model.get("usr_name")==null? "" : model.get("usr_name")+""),ws.getWritableCell(6, 6).getCellFormat()));
        ws.addCell(new Label(6,7,(model.get("record_start")==null? "" : model.get("record_start")+""),ws.getWritableCell(6, 7).getCellFormat()));
        ws.addCell(new Label(7,7,(model.get("record_finish")==null? "To :" : "To : "+model.get("record_finish")+""),ws.getWritableCell(7, 7).getCellFormat()));
        
        ws.addCell(new Label(9,3,(model.get("cus_name")==null? "" : model.get("cus_name")+""),ws.getWritableCell(9, 3).getCellFormat()));
        ws.addCell(new Label(9,4,(model.get("cus_code")==null? "" : model.get("cus_code")+""),ws.getWritableCell(9, 4).getCellFormat()));
        ws.addCell(new Label(9,5,(model.get("proj_name")==null? "" : model.get("proj_name")+""),ws.getWritableCell(9, 5).getCellFormat()));
        ws.addCell(new Label(9,6,(model.get("dept")==null? "" : model.get("dept")+""),ws.getWritableCell(9, 6).getCellFormat()));
        ws.addCell(new Label(9,7,(model.get("job_status")==null? "" : model.get("job_status")+""),ws.getWritableCell(9, 7).getCellFormat()));
        
        //Insert Record
        int row = 10;
        int f = 11;
        for(int i = 0;i<list.size();i++){
        	
        	String strFormula = "IF(G"+f+"<F"+f+",((G"+f+"-F"+f+"))+1,G"+f+"-F"+f+")";
        	
        	DateFormat format = new SimpleDateFormat("yyy-MM-dd HH:mm:ss");
        	Date startDate = format.parse(list.get(i).getTr_start()+"");
        	Date finishDate = format.parse(list.get(i).getTr_finish()+"");
        	
        	ws.setRowView(row, 350);
        	ws.addCell(new Label(1,row,dateFormat.format(startDate)+"",date));
        	ws.addCell(new Label(2,row,list.get(i).getCus_name()+"("+list.get(i).getProj_name()+")",cus));
        	ws.addCell(new Label(3,row,list.get(i).getJob_ref_name()+"",job));
        	ws.addCell(new Label(4,row,list.get(i).getTr_name()+"",file));
        	ws.addCell(new Label(5,row,dateFormat1.format(startDate)+"",start));
        	ws.addCell(new Label(6,row,dateFormat1.format(finishDate)+"",finish));
        	ws.addCell(new Label(7,row,list.get(i).getTr_process()+"",process));
        	ws.addCell(new Label(8,row,list.get(i).getUsr_name()+"",operator));
//        	ws.addCell(new Label(9,row,"=IF(G"+f+"<F"+f+",((G"+f+"-F"+f+"))+1,G"+f+"-F"+f+")",sum));
        	ws.addCell(new Formula(9, row, strFormula, sum));
        	
        	row++;
        	f++;
        }
        
        row = row+1;
        ws.setRowView(row, 350);
        ws.addCell(new Label(8,row,"Total :",ws.getWritableCell(5, 3).getCellFormat()));
        ws.addCell(new Formula(9,row,"SUM(J11:J"+f+")",ws.getWritableCell(3, 3).getCellFormat()));
        
	}

}
