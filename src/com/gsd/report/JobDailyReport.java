package com.gsd.report;

import java.awt.Color;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.CellType;
import jxl.biff.FontRecord;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.CellFormat;
import jxl.format.Colour;
import jxl.format.Pattern;
import jxl.write.Blank;
import jxl.write.Formula;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.Number;
import jxl.write.NumberFormat;
import jxl.write.WritableCellFormat;

import org.springframework.web.servlet.view.document.AbstractJExcelView;

import com.gsd.model.Jobs;
import com.gsd.model.JobsReference;
import com.gsd.model.Report;

public class JobDailyReport extends AbstractJExcelView{

	@Override
	protected void buildExcelDocument(Map<String, Object> model,
			WritableWorkbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		
		List<JobsReference> list = (List<JobsReference>) model.get("list");
		List<JobsReference> item = (List<JobsReference>) model.get("item");
		Jobs job = (Jobs) model.get("jobs");
		
		String fileName = "Daily Report - "+job.getJob_name();
//		fileName = fileName.replace(" ", "+");
		response.addHeader("Content-Disposition", "attachment; filename=\""+fileName+".xls\"");
		WritableSheet ws = workbook.getSheet(0);
        ws.setName(job.getCus_code());
        DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        DateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		Date date = new Date();
		
        String jobCurrency = item.get(0).getProj_currency();
        System.out.println("Currency = "+jobCurrency);
        
        CellFormat currency;
        
        if(jobCurrency.equals("EUR")){
        	currency = ws.getWritableCell(0, 1).getCellFormat();
        }else if(jobCurrency.equals("USD") || jobCurrency.equals("AUD")){
        	currency = ws.getWritableCell(1, 1).getCellFormat();
        }else if(jobCurrency.equals("GBP")){
        	currency = ws.getWritableCell(2, 1).getCellFormat();
        }else if(jobCurrency.equals("CHF")){
        	currency = ws.getWritableCell(3, 1).getCellFormat();
        }else if(jobCurrency.equals("THB")){
        	currency = ws.getWritableCell(4, 1).getCellFormat();
        }else{
        	currency = ws.getWritableCell(0, 1).getCellFormat();
        }
        
//        workbook.setColourRGB(Colour.LIGHT_GREEN, 197, 225, 182);
//        workbook.setColourRGB(Colour.LIGHT_GREEN, 196, 190, 153);
        workbook.setColourRGB(Colour.LIGHT_ORANGE, 248, 203, 174);
        WritableCellFormat format04 = new WritableCellFormat(ws.getWritableCell(0, 4).getCellFormat());
        format04.setBackground(Colour.LIGHT_ORANGE);
        ws.getWritableCell(0, 4).setCellFormat(format04);
        
//        NumberFormat euroSuffixCurrency = new NumberFormat("#,##0.00" + NumberFormat.CURRENCY_EURO_SUFFIX, NumberFormat.COMPLEX_FORMAT);
        WritableCellFormat format14cur = new WritableCellFormat(currency);
        WritableCellFormat format14 = new WritableCellFormat(ws.getWritableCell(1, 4).getCellFormat());
        format14cur.setAlignment(format14.getAlignment());
        format14cur.setBackground(Colour.LIGHT_ORANGE);
        format14cur.setBorder(Border.ALL, BorderLineStyle.THIN);
        format14cur.setFont((FontRecord) format14.getFont());
//        format14.setBackground(Colour.LIGHT_ORANGE);
        
        ws.getWritableCell(1, 4).setCellFormat(format14cur);

        workbook.setColourRGB(Colour.OLIVE_GREEN, 110, 174, 79);
        WritableCellFormat format12 = new WritableCellFormat(ws.getWritableCell(1, 2).getCellFormat());
        format12.setBackground(Colour.OLIVE_GREEN);
        ws.getWritableCell(1, 2).setCellFormat(format12);
        ws.getWritableCell(2, 2).setCellFormat(format12);
        
        workbook.setColourRGB(Colour.VERY_LIGHT_YELLOW, 255, 231, 157);
        WritableCellFormat formatDate = new WritableCellFormat(ws.getWritableCell(0, 5).getCellFormat());
        formatDate.setBackground(Colour.VERY_LIGHT_YELLOW);
        ws.getWritableCell(0, 5).setCellFormat(formatDate);
        ws.getWritableCell(0, 3).setCellFormat(formatDate);
        ws.getWritableCell(0, 2).setCellFormat(formatDate);
        
        CellFormat date = ws.getWritableCell(0, 5).getCellFormat();
        CellFormat job_name = ws.getWritableCell(1, 4).getCellFormat();
        
        //Header
        Map<Integer, Integer> map = new HashMap<Integer, Integer>();
        ws.addCell(new Label(0,0,job.getCus_name()+" - " +job.getJob_name(),ws.getWritableCell(0, 0).getCellFormat()));
        ws.addCell(new Label(0,4,"Price per image",ws.getWritableCell(0, 4).getCellFormat()));
        int y=0;
        for(int x=0;x<item.size();x++){
        	y=x+1;
        	int z=(x%2)+1;
        	
        	ws.addCell(new Label(y,2,item.get(x).getItm_name(),ws.getWritableCell(z, 2).getCellFormat()));
        	ws.addCell(new Label(y,3,item.get(x).getTopix_article_id(),ws.getWritableCell(z, 3).getCellFormat()));
        	ws.addCell(new Number(y,4,item.get(x).getPrice().doubleValue(),ws.getWritableCell(1, 4).getCellFormat()));
        	ws.addCell(new Blank(y,5,ws.getWritableCell(z, 5).getCellFormat()));
        	map.put(item.get(x).getProj_ref_id(), y);
        	
        }
        
        ws.addCell(new Label((y+3),4,"Daily Price",ws.getWritableCell(0, 4).getCellFormat()));
        workbook.setColourRGB(Colour.LIGHT_TURQUOISE2, 189, 215, 237);
        WritableCellFormat formatDailyPrice = new WritableCellFormat(ws.getWritableCell((y+3), 4).getCellFormat());
        formatDailyPrice.setAlignment(Alignment.CENTRE);
        formatDailyPrice.setBackground(Colour.LIGHT_TURQUOISE2);
        ws.getWritableCell((y+3), 4).setCellFormat(formatDailyPrice);
        
        WritableCellFormat formatDailyPriceCur = new WritableCellFormat(currency);
        formatDailyPriceCur.setBackground(Colour.LIGHT_TURQUOISE2);
        formatDailyPriceCur.setBorder(Border.ALL, BorderLineStyle.THIN);
        formatDailyPriceCur.setFont((FontRecord) formatDailyPrice.getFont());
        
        int row = 4;
        String chkDate = "";
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
        		for(int a=0;a<=y;a++){
            		ws.addCell(new Blank(a,row,ws.getWritableCell(a, 5).getCellFormat()));
            	}
        		ws.addCell(new Label(0,row,job_in,date));
        		String sumDaily = "";
        		for(int aa = 1;aa<=y;aa++){
        			if(sumDaily != ""){
        				sumDaily += "+";
        			}
        			int cc;
        			String dd;
        			if(aa>25){
        				cc = aa+65-26;
        				dd = "A" + ((char)cc);
        			}else{
        				cc = aa+65;
        				dd = "" + ((char)cc);
        			}
        			sumDaily += "("+dd+(row+1)+"*"+dd+"5)";
        		}
        		ws.addCell(new Formula((y+3), row, sumDaily, formatDailyPriceCur));
        	}
        	
        	int col = map.get(list.get(i).getProj_ref_id());
        	ws.addCell(new Number(col,row,list.get(i).getTotal_amount().doubleValue(),ws.getWritableCell(col, 5).getCellFormat()));
        }
        row++;
        ws.addCell(new Label(0,row,"Price per item",ws.getWritableCell(0, 4).getCellFormat()));
        workbook.setColourRGB(Colour.LIGHT_BLUE, 180, 197, 230);
        WritableCellFormat formatPricePerItem = new WritableCellFormat(ws.getWritableCell(0, row).getCellFormat());
        formatPricePerItem.setBackground(Colour.LIGHT_BLUE);
        ws.getWritableCell(0, row).setCellFormat(formatPricePerItem);
        WritableCellFormat formatPricePerItemCur = new WritableCellFormat(currency);
        formatPricePerItemCur.setBackground(Colour.LIGHT_BLUE);
        formatPricePerItemCur.setBorder(Border.ALL, BorderLineStyle.THIN);
        formatPricePerItemCur.setFont((FontRecord) formatPricePerItem.getFont());
        
        for(int b=1;b<=y;b++){
        	int c;
        	String d;
        	if(b>25){
        		c = b+65-26;
            	d = "A"+((char)c);
        	}else{
        		c = b+65;
        		d = "" + ((char)c);
        	}
    		ws.addCell(new Formula(b,row,"SUM("+d+"6:"+d+row+")*"+d+"5",formatPricePerItemCur));
    	}
        String sumRow;
		if((y+3)>25){
			int xx = y+3+65-26;
			sumRow = "A"+((char)xx);
		}else{
			int xx = y+3+65;
			sumRow = ""+((char)xx);
		}
		ws.addCell(new Label(y+2,row, "Total Amount", ws.getWritableCell(0, 4).getCellFormat()));
//		workbook.setColourRGB(Colour.LIGHT_ORANGE, 248, 203, 174);
        WritableCellFormat formatTotal = new WritableCellFormat(ws.getWritableCell(y+2, row).getCellFormat());
        formatTotal.setAlignment(Alignment.CENTRE);
        formatTotal.setBackground(Colour.LIGHT_ORANGE);
        ws.getWritableCell(y+2, row).setCellFormat(formatTotal);
        WritableCellFormat formatTotalCur = new WritableCellFormat(currency);
        formatTotalCur.setBackground(Colour.LIGHT_ORANGE);
        formatTotalCur.setBorder(Border.ALL, BorderLineStyle.THIN);
        formatTotalCur.setFont((FontRecord) formatTotal.getFont());
		ws.addCell(new Formula(y+3,row,"SUM("+sumRow+"6:"+sumRow+row+")",formatTotalCur));
		if(job.getCus_code().equals("CBR")){
			ws.addCell(new Label(y+2,row+1, "z.zgl 19% MwSt.",formatTotal));
			ws.addCell(new Formula(y+3,row+1,sumRow+(row+1)+"*1.19",formatTotalCur));
		}
		
		ws.mergeCells(0, 2, 0, 3);
	}

}
