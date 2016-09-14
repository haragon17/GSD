package com.gsd.report;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.print.PageFormat;
import java.awt.print.Printable;
import java.awt.print.PrinterException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.apache.log4j.Logger;

import com.gsd.model.JobsReference;

public class PrintJobTicket implements Printable {

	JobsReference job = null;
	private static final Logger logger = Logger.getLogger(PrintJobTicket.class);
	
	public PrintJobTicket(JobsReference myJob) {
		this.job = myJob;
	}

	@Override
	public int print(Graphics g, PageFormat pf, int page) throws PrinterException {
		
		if (page > 0) {
            return NO_SUCH_PAGE;
        }
 
		Graphics2D g2d = (Graphics2D)g;
        g2d.translate(pf.getImageableX(), pf.getImageableY());
 
        //Head
        g.drawLine(45, 40, 520, 40);
        g.drawLine(45, 40, 45, 100);
        g.drawLine(45, 75, 520, 75);
        g.drawLine(282, 75, 282, 100);
        g.drawLine(520, 40, 520, 100);
        g.drawLine(45, 100, 520, 100);
        
        //Job name & Customer
        g.drawLine(45, 110, 520, 110);
        g.drawLine(45, 135, 520, 135);
        g.drawLine(45, 110, 45, 135);
        g.drawLine(520, 110, 520, 135);
        g.drawLine(282, 110, 282, 135);
        
        //Deadline
        g.drawLine(45, 145, 520, 145);
        g.drawLine(520, 145, 520, 180);
        g.drawLine(45, 180, 520, 180);
        g.drawLine(45, 145, 45, 180);
        
        //Item & Qty
        g.drawLine(45, 190, 520, 190);
        g.drawLine(45, 215, 520, 215);
        g.drawLine(45, 190, 45, 215);
        g.drawLine(520, 190, 520, 215);
        g.drawLine(400, 190, 400, 215);
        
        //Remark
        g.drawLine(45, 230, 520, 230);
        g.drawLine(45, 400, 520, 400);
        g.drawLine(45, 230, 45, 400);
        g.drawLine(520, 230, 520, 400);
        
        //Status
        g.drawLine(45, 415, 520, 415);
        g.drawLine(45, 440, 520, 440);
        g.drawLine(45, 465, 520, 465);
        g.drawLine(45, 490, 520, 490);
        g.drawLine(45, 515, 520, 515);
        g.drawLine(45, 540, 520, 540);
        g.drawLine(45, 415, 45, 540);
        g.drawLine(520, 415, 520, 540);
        g.drawLine(150, 415, 150, 540);
        g.drawLine(335, 415, 335, 540);
        
      //Text
        Font f = new Font("Arial", Font.BOLD, 20);
        Font f1 = new Font("Arial", Font.BOLD, 16);
        Font f2 = new Font("Arial", Font.BOLD, 8);
        Font f3 = new Font("Arial", Font.BOLD, 12);
        Font f4 = new Font("Arial", Font.PLAIN, 11);
        g.setFont(f);
        g.setColor(Color.darkGray);
        g.drawString("GSD JobTicket", 210, 65);
        
        g.setFont(f1);
        try {
        String mydate = job.getJob_out();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            String dateFormat2 = new SimpleDateFormat("E, MMM d, yyyy").format(dateFormat.parse(mydate));
            String timeFomat = new SimpleDateFormat("HH:mm").format(dateFormat.parse(mydate));
            g.drawString(dateFormat2, 95, 170);
            g.drawString(timeFomat, 450, 170);
        } catch (Exception e) {
        	logger.error(e.getMessage());
        }
        
        g.setFont(f2);
        g.setColor(Color.gray);
        g.drawString("Project Name:", 50, 85);
        g.drawString("Project Number:", 287, 85);
        
        g.drawString("Job Name:", 50, 120);
        g.drawString("Customer:", 287, 120);
        
        g.drawString("Deadline:", 50, 155);
        
        g.drawString("Item:", 50, 200);
        g.drawString("Qty:", 405, 200);
        
        g.drawString("Remark:", 50, 240);
        
        g.setFont(f3);
        g.drawString("PREPARE", 55, 432);
        g.drawString("MASKING", 55, 457);
        g.drawString("RETOUCH", 55, 482);
        g.drawString("PAGING", 55, 507);
        g.drawString("QC", 55, 532);
        
        g.setFont(f4);
        g.setColor(Color.BLACK);
        g.drawString(((job.getProj_name()==null)||(job.getProj_name().isEmpty())? "-" : job.getProj_name()), 105, 90);
        g.drawString(((job.getJob_name()==null)||(job.getJob_name().isEmpty())? "-" : job.getJob_name()), 350, 90);

        g.drawString(job.getJob_ref_name(), 95, 125);
        g.drawString(job.getCus_name(), 330, 125);
        
        DecimalFormat df = new DecimalFormat("###.##");
        g.drawString(((job.getItm_name()==null)||(job.getItm_name().isEmpty())? "-" : job.getItm_name()), 75, 205);
        g.drawString(df.format(job.getAmount()), 460, 205);
        
        String str = ((job.getJob_ref_dtl()==null)||(job.getJob_ref_dtl().isEmpty())? "-" : job.getJob_ref_dtl());
        int x = 90;
        int y = 234;
        for (String line : str.split("\n")){
            if(line.length() <= 80){
                g.drawString(line, x, y += g.getFontMetrics().getHeight());
            }else{
                long count = line.length()/80;
                int a=0;
                int b=80;
                for(int xyz=0;xyz<=count;xyz++){
                    if(b>line.length()){b=(int) line.length();}
                    String myWord = line.substring(a, b);
                    g.drawString(myWord, x, y += g.getFontMetrics().getHeight());
                    a+=80;
                    b+=80;
                }
            }
        }

        return PAGE_EXISTS;
        
	}

}
