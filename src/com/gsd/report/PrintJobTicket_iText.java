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
        
        //Job name & Customer
        g2d.drawLine(45, 110, 520, 110);
        g2d.drawLine(45, 135, 520, 135);
        g2d.drawLine(45, 110, 45, 135);
        g2d.drawLine(520, 110, 520, 135);
        g2d.drawLine(282, 110, 282, 135);
        
        //Deadline
        g2d.drawLine(45, 145, 520, 145);
        g2d.drawLine(520, 145, 520, 180);
        g2d.drawLine(45, 180, 520, 180);
        g2d.drawLine(45, 145, 45, 180);
        
        //Item & Qty
        g2d.drawLine(45, 190, 520, 190);
        g2d.drawLine(45, 215, 520, 215);
        g2d.drawLine(45, 190, 45, 215);
        g2d.drawLine(520, 190, 520, 215);
        g2d.drawLine(400, 190, 400, 215);
        
        //Remark
        g2d.drawLine(45, 230, 520, 230);
        g2d.drawLine(45, 400, 520, 400);
        g2d.drawLine(45, 230, 45, 400);
        g2d.drawLine(520, 230, 520, 400);
        
        //Status
        g2d.drawLine(45, 415, 520, 415);
        g2d.drawLine(45, 440, 520, 440);
        g2d.drawLine(45, 465, 520, 465);
        g2d.drawLine(45, 490, 520, 490);
        g2d.drawLine(45, 515, 520, 515);
        g2d.drawLine(45, 540, 520, 540);
        g2d.drawLine(45, 415, 45, 540);
        g2d.drawLine(520, 415, 520, 540);
        g2d.drawLine(150, 415, 150, 540);
        g2d.drawLine(335, 415, 335, 540);
        
        //Note
        g2d.drawLine(45, 590, 520, 590);
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
        String mydate = job.getJob_out();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		try {
			String dateFormat2 = new SimpleDateFormat("E, MMM d, yyyy").format(dateFormat.parse(mydate));
			String timeFomat = new SimpleDateFormat("HH:mm").format(dateFormat.parse(mydate));
			g2d.drawString(dateFormat2, 95, 170);
			g2d.drawString(timeFomat, 450, 170);
		} catch (ParseException e) {
			e.printStackTrace();
		}
        
        g2d.setFont(f2);
        g2d.setColor(Color.gray);
        g2d.drawString("Project Name:", 50, 85);
        g2d.drawString("Project Number:", 287, 85);
        
        g2d.drawString("Job Name:", 50, 120);
        g2d.drawString("Customer:", 287, 120);
        
        g2d.drawString("Deadline:", 50, 155);
        
        g2d.drawString("Item:", 50, 200);
        g2d.drawString("Qty:", 405, 200);
        
        g2d.drawString("Remark:", 50, 240);
        
        g2d.setFont(f3);
        g2d.drawString("PREPARE", 55, 432);
        g2d.drawString("MASKING", 55, 457);
        g2d.drawString("RETOUCH", 55, 482);
        g2d.drawString("PAGING", 55, 507);
        g2d.drawString("QC", 55, 532);
        
        g2d.setFont(f4);
        g2d.setColor(Color.BLACK);
        g2d.drawString(((job.getProj_name()==null)||(job.getProj_name().isEmpty())? "-" : job.getProj_name()), 105, 90);
        g2d.drawString(((job.getJob_name()==null)||(job.getJob_name().isEmpty())? "-" : job.getJob_name()), 350, 90);

        g2d.drawString(job.getJob_ref_name(), 95, 125);
        g2d.drawString(job.getCus_name(), 330, 125);
        
        DecimalFormat df = new DecimalFormat("###.##");
        g2d.drawString(((job.getItm_name()==null)||(job.getItm_name().isEmpty())? "-" : job.getItm_name()), 75, 205);
        g2d.drawString(df.format(job.getAmount()), 460, 205);
        
        String str = ((job.getJob_ref_dtl()==null)||(job.getJob_ref_dtl().isEmpty())? "-" : job.getJob_ref_dtl());
        int x = 90;
        int y = 234;
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
