package com.gsd.report;

import com.itextpdf.awt.PdfGraphics2D;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PrintInvoice_iText {

//	public static final String DEST = "/jview_pdf/GSD-BillTicket.pdf";
	public static final String DEST = "/Users/gsd/Desktop/GSD-BillTicket.pdf";
	
	public void createPdf(HttpServletRequest request,
			HttpServletResponse response) throws IOException, DocumentException {
		String rootDirectory = request.getSession().getServletContext().getRealPath("/");
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
        Image img = Image.getInstance(rootDirectory+"image/bill-icon1.png");
        Image img2 = Image.getInstance(rootDirectory+"image/bill-icon2.png");
//        Image img3 = Image.getInstance(rootDirectory+"image/gsd-icon.png");
        Image img3 = Image.getInstance(rootDirectory+"image/bill-icon3.png");
        img.scaleToFit(300f, 220f);
        img.setAbsolutePosition(250f, 770f);
        img2.scaleToFit(550f, 250f);
        img2.setAbsolutePosition(20f, 15f);
        img3.scaleToFit(130f, 15f);
        img3.setAbsolutePosition(75, 690);
        document.add(img);
        document.add(img2);
        document.add(img3);

        Font f = new Font("Arial", Font.PLAIN, 8);
        Font f2 = new Font("Arial", Font.PLAIN, 15);
        Font f3 = new Font("Arial", Font.BOLD, 8);
        g2d.setFont(f);
        g2d.setColor(Color.gray);
        g2d.drawString("Invoice No:", 320, 160);
        g2d.drawString("Invoice date:", 320, 174);
        g2d.drawString("Project-No:", 320, 188);
        g2d.drawString("Delivery Date:", 320, 202);
        g2d.drawString("Customer No:", 320, 216);
        g2d.drawString("Supplier No:", 320, 230);
        g2d.drawString("Order No:", 320, 244);
        g2d.drawString("Reference:", 320, 258);
        
        g2d.drawString("User Name:", 320, 284);
        g2d.drawString("Contact:", 320, 298);
        
        g2d.setFont(f2);
        g2d.drawString("INVOICE", 75, 330);
        
        g2d.setFont(f3);
        g2d.drawString("Subject:", 75, 350);
        
        g2d.drawString("No.", 75, 400);
        g2d.drawString("Description", 140, 400);
        g2d.drawString("Qty", 380, 400);
        g2d.drawString("Rate", 435, 400);
        g2d.drawString("Amount", 490, 400);
        g2d.drawLine(75, 405, 525, 405);
        
        g2d.dispose();
        int pages = ((int)height / (int)maxHeight);
        for (int p = 0; p < pages; ) {
            p++;
            canvas.addTemplate(template, 0, (p * maxHeight) - height);
            document.newPage();
        }
        document.close();
        
        response.setContentType("application/pdf");

		response.setHeader("Content-Disposition", "inline; filename=" + "GSD-BillTicket.pdf" + ";");

		byte[] fileData = new byte[(int)file.length()];

		FileInputStream fis = new FileInputStream(file);

		fis.read(fileData);

		
		ServletOutputStream outputStream = response.getOutputStream();

        outputStream.write(fileData); 

        outputStream.flush();

        outputStream.close();
        
    }
	
}
