package com.gsd.report;

import com.gsd.model.JobsReference;
import com.itextpdf.awt.PdfGraphics2D;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PrintJobTicket_iText {

	public static final String DEST = "/jview_pdf/GSD-JobTicket.pdf";
//	public static final String DEST = "/Users/gsd/Desktop/GSD-JobTicket.pdf";
	
	public void createPdf(HttpServletRequest request,
			HttpServletResponse response, JobsReference job) throws IOException, DocumentException {
		File file = new File(DEST);
        file.getParentFile().mkdirs();
        float width = 595;
        float height = 842;
        float maxHeight = 842;
        Document document = new Document(new Rectangle(width, maxHeight));
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(DEST));
        document.open();
        PdfContentByte canvas = writer.getDirectContent();
        PdfTemplate template = canvas.createTemplate(width, height);
        Graphics2D g2d = new PdfGraphics2D(template, width, height);     

        //Head
        g2d.drawLine(45, 40, 520, 40);
        g2d.drawLine(45, 40, 45, 100);
        g2d.drawLine(45, 75, 520, 75);
        g2d.drawLine(282, 75, 282, 100);
        g2d.drawLine(520, 40, 520, 100);
        g2d.drawLine(45, 100, 520, 100);
        
        //Job name
        g2d.drawLine(45, 110, 520, 110);
        g2d.drawLine(45, 135, 520, 135);
        g2d.drawLine(45, 110, 45, 135);
        g2d.drawLine(520, 110, 520, 135);

        //Customer
        g2d.drawLine(45, 145, 520, 145);
        g2d.drawLine(45, 170, 520, 170);
        g2d.drawLine(45, 145, 45, 170);
        g2d.drawLine(520, 145, 520, 170);
        
        //Deadline
        g2d.drawLine(45, 180, 520, 180);
        g2d.drawLine(520, 180, 520, 215);
        g2d.drawLine(45, 215, 520, 215);
        g2d.drawLine(45, 180, 45, 215);
        
        //Item & Qty
        g2d.drawLine(45, 225, 520, 225);
        g2d.drawLine(45, 250, 520, 250);
        g2d.drawLine(45, 225, 45, 250);
        g2d.drawLine(520, 225, 520, 250);
        g2d.drawLine(400, 225, 400, 250);
        
        //Remark
        g2d.drawLine(45, 265, 520, 265);
        g2d.drawLine(45, 435, 520, 435);
        g2d.drawLine(45, 265, 45, 435);
        g2d.drawLine(520, 265, 520, 435);
        
        //Status
        g2d.drawLine(45, 450, 520, 450);
        g2d.drawLine(45, 475, 520, 475);
        g2d.drawLine(45, 500, 520, 500);
        g2d.drawLine(45, 525, 520, 525);
        g2d.drawLine(45, 550, 520, 550);
        g2d.drawLine(45, 575, 520, 575);
        g2d.drawLine(45, 450, 45, 575);
        g2d.drawLine(520, 450, 520, 575);
        g2d.drawLine(150, 450, 150, 575);
        g2d.drawLine(335, 450, 335, 575);
        
        //Note
        g2d.drawLine(45, 615, 520, 615);
        g2d.drawLine(45, 640, 520, 640);
        g2d.drawLine(45, 665, 520, 665);
        g2d.drawLine(45, 690, 520, 690);
        g2d.drawLine(45, 715, 520, 715);
        g2d.drawLine(45, 740, 520, 740);
        g2d.drawLine(45, 765, 520, 765);
        g2d.drawLine(45, 790, 520, 790);
        
        
        Font f = new Font("Arial", Font.BOLD, 20);
        Font f1 = new Font("Arial", Font.BOLD, 16);
        Font f2 = new Font("Arial", Font.BOLD, 8);
        Font f3 = new Font("Arial", Font.BOLD, 12);
        Font f4 = new Font("Arial", Font.PLAIN, 11);
        g2d.setFont(f);
        g2d.setColor(Color.darkGray);
        //Text
        g2d.drawString("GSD JobTicket", 210, 65);
        
        g2d.setFont(f1);
        Color c = new Color(240, 10, 10);
        g2d.setColor(c);
        String mydate = job.getJob_out();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		try {
			String dateFormat2 = new SimpleDateFormat("E, MMM d, yyyy").format(dateFormat.parse(mydate));
			String timeFomat = new SimpleDateFormat("HH:mm").format(dateFormat.parse(mydate));
			g2d.drawString(dateFormat2, 95, 205);
			g2d.drawString(timeFomat, 450, 205);
		} catch (ParseException e) {
			e.printStackTrace();
		}
        
        g2d.setFont(f2);
        g2d.setColor(Color.gray);
        g2d.drawString("Project Name:", 50, 85);
        g2d.drawString("Project Number:", 287, 85);
        
        g2d.drawString("Job Name:", 50, 120);
        
        g2d.drawString("Customer:", 50, 155);
        
        g2d.drawString("Deadline:", 50, 190);
        
        g2d.drawString("Item:", 50, 235);
        g2d.drawString("Qty:", 405, 235);
        
        g2d.drawString("Remark:", 50, 275);
        
        g2d.setFont(f3);
        g2d.setColor(Color.darkGray);
        g2d.drawString("PREPARE", 55, 467);
        g2d.drawString("MASKING", 55, 492);
        g2d.drawString("RETOUCH", 55, 517);
        g2d.drawString("PAGING", 55, 542);
        g2d.drawString("QC", 55, 567);
        
        g2d.setFont(f4);
        g2d.setColor(Color.BLACK);
        g2d.drawString(((job.getProj_name()==null)||(job.getProj_name().isEmpty())? "-" : job.getProj_name()), 105, 90);
        g2d.drawString(((job.getJob_name()==null)||(job.getJob_name().isEmpty())? "-" : job.getJob_name()), 350, 90);

        g2d.drawString(job.getJob_ref_name(), 95, 125);
        g2d.drawString(job.getCus_name(), 95, 160);
        
        DecimalFormat df = new DecimalFormat("###.##");
        g2d.drawString(((job.getItm_name()==null)||(job.getItm_name().isEmpty())? "-" : job.getItm_name()), 75, 240);
        g2d.drawString(df.format(job.getAmount()), 460, 240);
        
        String str = ((job.getJob_ref_dtl()==null)||(job.getJob_ref_dtl().isEmpty())? "-" : job.getJob_ref_dtl());
        int x = 90;
        int y = 269;
        for (String line : str.split("\n")){
        	if(line.length() <= 80){
        		g2d.drawString(line, x, y += g2d.getFontMetrics().getHeight());
        	}else{
        		long count = line.length()/80;
        		int a=0;
    			int b=80;
        		for(int xyz=0;xyz<=count;xyz++){
        			if(b>line.length()){b=(int) line.length();}
        			String myWord = line.substring(a, b);
        			g2d.drawString(myWord, x, y += g2d.getFontMetrics().getHeight());
        			a+=80;
        			b+=80;
        		}
        	}
        }
        
        g2d.dispose();
        int pages = ((int)height / (int)maxHeight);
        for (int p = 0; p < pages; ) {
            p++;
            canvas.addTemplate(template, 0, (p * maxHeight) - height);
            document.newPage();
        }
        document.close();
        
        response.setContentType("application/pdf");

		response.setHeader("Content-Disposition", "inline; filename=" + "GSD-JobTicket.pdf" + ";");

		byte[] fileData = new byte[(int)file.length()];

		FileInputStream fis = new FileInputStream(file);

		fis.read(fileData);

		
		ServletOutputStream outputStream = response.getOutputStream();

        outputStream.write(fileData); 

        outputStream.flush();

        outputStream.close();
        
    }
}
