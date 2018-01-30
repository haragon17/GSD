package com.gsd.report;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.format.CellFormat;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.Number;

import org.springframework.web.servlet.view.document.AbstractJExcelView;

import com.gsd.model.Jobs;
import com.gsd.model.JobsReference;
import com.gsd.model.Report;

public class ReportView extends AbstractJExcelView{

	@Override
	protected void buildExcelDocument(Map<String, Object> model,
			WritableWorkbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		
		List<JobsReference> list = (List<JobsReference>) model.get("list");
		List<JobsReference> item = (List<JobsReference>) model.get("item");
		Jobs job = (Jobs) model.get("jobs");
		
		String fileName = job.getJob_name();
//		fileName = fileName.replace(" ", "+");
		response.addHeader("Content-Disposition", "attachment; filename=\""+fileName+".xls\"");
		WritableSheet ws = workbook.getSheet(0);
        ws.setName(job.getCus_code());
        DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        DateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		Date date = new Date();
		
        CellFormat date = ws.getWritableCell(0, 4).getCellFormat();
        CellFormat job_name = ws.getWritableCell(1, 4).getCellFormat();
//        CellFormat cate2 = ws.getWritableCell(3, 12).getCellFormat();
//        CellFormat cate3 = ws.getWritableCell(4, 12).getCellFormat();
//        CellFormat createBy = ws.getWritableCell(5, 12).getCellFormat();
//        CellFormat createDate = ws.getWritableCell(6, 12).getCellFormat();
//        CellFormat updateDate = ws.getWritableCell(7, 12).getCellFormat();
        
        //Header
        Map<Integer, Integer> map = new HashMap<Integer, Integer>();
        ws.addCell(new Label(0,0,job.getCus_name()+"("+job.getProj_name()+") : " +fileName,ws.getWritableCell(0, 0).getCellFormat()));
        for(int x=0;x<item.size();x++){
        	int y=x+2;
        	ws.addCell(new Label(y,1,item.get(x).getItm_name(),ws.getWritableCell(y, 1).getCellFormat()));
        	map.put(item.get(x).getProj_ref_id(), y);
        }
//        ws.addCell(new Label(2,3,(model.get("name")==null? "" : model.get("name")+""),ws.getWritableCell(2, 3).getCellFormat()));
//        ws.addCell(new Label(2,4,(model.get("cate1")==null? "" : model.get("cate1")+""),ws.getWritableCell(2, 4).getCellFormat()));
//        ws.addCell(new Label(2,5,(model.get("cate2")==null? "" : model.get("cate2")+""),ws.getWritableCell(2, 5).getCellFormat()));
//        ws.addCell(new Label(2,6,(model.get("cate3")==null? "" : model.get("cate3")+""),ws.getWritableCell(2, 6).getCellFormat()));
//        ws.addCell(new Label(2,7,(model.get("screate")==null? "" : model.get("screate")+""),ws.getWritableCell(2, 7).getCellFormat()));
//        ws.addCell(new Label(4,7,(model.get("ecreate")==null? "" : model.get("ecreate")+""),ws.getWritableCell(4, 7).getCellFormat()));
//        ws.addCell(new Label(2,8,(model.get("supdate")==null? "" : model.get("supdate")+""),ws.getWritableCell(2, 8).getCellFormat()));
//        ws.addCell(new Label(4,8,(model.get("eupdate")==null? "" : model.get("eupdate")+""),ws.getWritableCell(4, 8).getCellFormat()));
//        ws.addCell(new Label(6,3,dateFormat.format(date),ws.getWritableCell(6, 3).getCellFormat()));
//        ws.addCell(new Label(6,4,dateFormat1.format(date),ws.getWritableCell(6, 4).getCellFormat()));
	
        int row = 4;
        String chkDate = "";
        Map<String, Integer> map_name = new HashMap<String, Integer>();
        for(int i = 0;i<list.size();i++){
        	String job_in = "";
        	try{
        		Date parsedJobIn = dateFormat1.parse(list.get(i).getJob_in());
        		job_in = dateFormat.format(parsedJobIn);
        	}catch(Exception e){
        		job_in = "No date in!";
        	}
        	
        	if(chkDate.equals(job_in)){
        		job_in = "";
        	}else{
        		chkDate = job_in;
        		row++;
        	}
        	
        	int col = map.get(list.get(i).getProj_ref_id());
        	String amount = "";
        	if(list.get(i).getAmount() == 0){
        		amount = "***NO AMOUNT***";
        	}
        	Number num = new Number(3, 0, 9.99);
        	
        	if(map_name.get(list.get(i).getJob_ref_name()) == null){
	        	ws.addCell(new Label(0,row,job_in,date));
	        	ws.addCell(new Label(1,row,list.get(i).getJob_ref_name()+amount,job_name));
	        	ws.addCell(new Number(col,row,list.get(i).getAmount(),ws.getWritableCell(col, 4).getCellFormat()));
	        	map_name.put(list.get(i).getJob_ref_name(), row);
	        	row++;
        	}else{
        		ws.addCell(new Number(col,map_name.get(list.get(i).getJob_ref_name()),list.get(i).getAmount(),ws.getWritableCell(col, 4).getCellFormat()));
        	}
        	
        }
	
	}

}
