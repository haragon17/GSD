package com.gsd.report;

import com.gsd.model.Invoice;
import com.gsd.model.InvoiceCompany;
import com.gsd.model.InvoiceReference;
import com.gsd.security.UserDetailsApp;
import com.gsd.security.UserLoginDetail;
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
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PrintInvoice_iText {

	public static final String DEST = "/jview_pdf/GSD-Invoice.pdf";
//	public static final String DEST = "/Users/gsd/Desktop/GSD-Invoice.pdf";
	
	public void createPdf(HttpServletRequest request,
			HttpServletResponse response, Invoice inv, InvoiceCompany inv_company, List<InvoiceReference> inv_ref) throws IOException, DocumentException {
		String rootDirectory = request.getSession().getServletContext().getRealPath("/");
		File file = new File(DEST);
        file.getParentFile().mkdirs();
        int item_count = inv_ref.size();
        int page_count = 1;
        if(item_count <= 10){
        	page_count = 1;
        }else if(item_count > 10 && item_count < 27){
        	page_count = 2;
        }else{
        	page_count = 3;
        }
//        page_count = 2;
        float width = 595;
        float height = 842*page_count;
        float maxHeight = 842;
        Document document = new Document(new Rectangle(width, maxHeight));
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(DEST));
        document.open();
        PdfContentByte canvas = writer.getDirectContent();
        PdfTemplate template = canvas.createTemplate(width, height);
        Graphics2D g2d = new PdfGraphics2D(template, width, height);
        
        
//        Image img = Image.getInstance(rootDirectory+"image/bill-icon1.png");
//        Image img2 = Image.getInstance(rootDirectory+"image/bill-icon2.png");
//        Image img3 = Image.getInstance(rootDirectory+"image/gsd-icon.png");
//        Image img3 = Image.getInstance(rootDirectory+"image/bill-icon3.png");
//        img.scaleToFit(300f, 220f);
//        img.setAbsolutePosition(250f, 770f);
//        img2.scaleToFit(550f, 250f);
//        img2.setAbsolutePosition(20f, 15f);
//        img3.scaleToFit(130f, 15f);
//        img3.setAbsolutePosition(75, 690);
//        document.add(img);
//        document.add(img2);
//        document.add(img3);
        
        String font_name = "Arial";
        
        Font f7p = new Font(font_name, Font.PLAIN, 7);
        Font f7b = new Font(font_name, Font.BOLD, 7);
        Font f8i = new Font(font_name, Font.ITALIC, 8);
        Font f8p = new Font(font_name, Font.PLAIN, 8);
        Font f8b = new Font(font_name, Font.BOLD, 8);
        Font f9p = new Font(font_name, Font.PLAIN, 9);
        Font f9b = new Font(font_name, Font.BOLD, 9);
        Font f10p = new Font(font_name, Font.PLAIN, 10);
        Font f10b = new Font(font_name, Font.BOLD, 10);
        Font f13p = new Font(font_name, Font.PLAIN, 13);
        
        String head = "";
        String tail = "";
        String addr1 = "74/6-9 Moo 2, Tambon Wichit, Amphoe Muang, Phuket 83000, Thailand";
        String addr2 = "Phone: +66 76 21 84 45   E-Mail: info@gsd-digital.com";
        if(inv.getInv_company_id() == 1){
	        head = "gs";
	        tail = "d graphic solution digital Co., Ltd";
        }else if(inv.getInv_company_id() == 2){
	        tail = "RS GSD Marketing Service Co., Ltd";
        }else if(inv.getInv_company_id() == 3){
	        tail = "FGS Media Co., Ltd";
        }else if(inv.getInv_company_id() == 4){
	        tail = "M.M. ASIA Co., Ltd";
	        addr1 = "490 Moo 6, Reanthai Group Building, Maliwan Road, T.Banped, A.Muang, Khon Kaen 40000, Thailand";
        }else if(inv.getInv_company_id() == 5){
        	head = "gs";
	        tail = "d packaging Co., Ltd";
        }else if(inv.getInv_company_id() == 6){
	        tail = "GPS Global Packaging Solutions Co., Ltd";
        }else if(inv.getInv_company_id() == 7){
	        tail = "True Time Media Phnom Penh Co., Ltd";
	        addr1 = "#184, St.217, Sangkat Tomnub Tek, Khan Chamkarmorn, Phnom Penh, Cambodia";
	        addr2 = "Phone: (855-23) 21 59 76   E-Mail: truetime.kh@gmail.com";
        }else if(inv.getInv_company_id() == 8){
        	tail = "Stuber Asia Co., Ltd";
        }
        
        if(!head.equals("")){
	        g2d.setFont(f7b);
	        g2d.setColor(Color.red);
	        g2d.drawString(head, 75, 125);
	        g2d.setColor(Color.gray);
	        g2d.drawString(tail, 83, 125);
        }else{
        	g2d.setFont(f9b);
	        g2d.setColor(Color.gray);
	        g2d.drawString(tail, 75, 125);
        }
//        g2d.setFont(f7b);
//        g2d.setColor(Color.red);
//        g2d.drawString("gs", 75, 125);
//        g2d.setColor(Color.gray);
//        g2d.drawString("d graphic solution digital Co., Ltd", 83, 125);
        
        g2d.setFont(f8b);
        g2d.setColor(Color.black);
        int addrY = 130;
        for (String line : inv.getAddress().split("\n")){
            g2d.drawString(line, 75, addrY += g2d.getFontMetrics().getHeight());
        }
//        g2d.drawString(inv.getAddress(), 75, 140);
        
        float aY = 765;
        for(int a=0; a<page_count; a++){
        	if(!head.equals("")){
		        g2d.setFont(f9b);
		        g2d.setColor(Color.red);
		        g2d.drawString(head, 75, aY);
		        g2d.setColor(Color.gray);
		        g2d.drawString(tail, (float) 85.4, aY);
        	}else{
        		g2d.setFont(f9b);
		        g2d.setColor(Color.gray);
		        g2d.drawString(tail, 75, aY);
        	}
	        g2d.drawLine(75, (int) aY+5, 530, (int) aY+5);
	        g2d.setFont(f9p);
	        g2d.drawString(addr1, 75, aY+18);
	        g2d.drawString(addr2, 75, aY+30);
	        aY += 842;
        }
//        g2d.setFont(f9b);
//        g2d.setColor(Color.red);
//        g2d.drawString("gs", 75, 1622);
//        g2d.setColor(Color.gray);
//        g2d.drawString("d graphic solution digital Co., Ltd", 85, 1622);
//        g2d.drawLine(75, 1627, 530, 1627);
//        g2d.setFont(f9p);
//        g2d.drawString("74/6-9 Moo 2, Tambon Wichit, Amphoe Muang, Phuket 83000, Thailand", 75, 1640);
//        g2d.drawString("Phone +66 76 21 84 45   E-Mail: info@gsd-digital.com", 75, 1652);
        
        g2d.setFont(f7p);
        g2d.setColor(Color.gray);
        g2d.drawString("Invoice No:", 350, 140);
        g2d.drawString("Invoice date:", 350, 150);
        g2d.drawString("Project-No:", 350, 160);
        g2d.drawString("Delivery Date:", 350, 170);
        g2d.drawString("Customer No:", 350, 180);
//        g2d.drawString("Supplier No:", 320, 230);
//        g2d.drawString("Order No:", 320, 244);
//        g2d.drawString("Reference:", 320, 258);
        
        g2d.drawString("User Name:", 350, 195);
//        g2d.drawString("Contact:", 320, 298);

        UserDetailsApp user = UserLoginDetail.getUser();
        String inv_delivery_date = "ERROR!";
        try {
        	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			Date parsed_delivery_date = dateFormat.parse(inv.getInv_delivery_date());
			SimpleDateFormat dateFormat2 = new SimpleDateFormat("MM/yy");
			inv_delivery_date = dateFormat2.format(parsed_delivery_date);
		} catch (ParseException e) {
			e.printStackTrace();
			System.out.println("delivery date error!");
		}
        
        SimpleDateFormat parseFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yy");
		Date parse_bill_date = null;
		try {
			parse_bill_date = parseFormat.parse(inv.getInv_bill_date());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        String inv_bill_date = dateFormat.format(parse_bill_date);
        
        g2d.setFont(f7b);
        g2d.setColor(Color.black);
        g2d.drawString(inv.getInv_number(), 420, 140);	//inv_number
        g2d.drawString(inv_bill_date, 420, 150);	//inv_bill_date
        g2d.drawString(inv.getInv_proj_no(), 420, 160);	//inv_proj_no
        g2d.drawString(inv_delivery_date, 420, 170);	//inv_delivery_date
        g2d.drawString(inv.getTopix_cus_id()+"", 420, 180);	//cus_no ?
        g2d.drawString(user.getUserModel().getUsr_name(), 420, 195);
        
        g2d.setFont(f8p);
        g2d.setColor(Color.gray);
        g2d.drawString("Terms of payment:", 75, 230);
        g2d.drawString("Bank:", 75, 242);
        g2d.drawString("Address:", 75, 254);
        g2d.drawString("SWIFT Code/BIC Code:", 75, 266);
        g2d.drawString("Account Name:", 75, 278);
        g2d.drawString("Account No.:", 75, 290);
        if(inv.getInv_company_id() == 7){
        	g2d.drawString("VATTIN:", 75, 302);
        }else{
        	g2d.drawString("TAX ID:", 75, 302);
        }
        
        g2d.setColor(Color.black);
        if(inv.getInv_payment_terms() == 0){
        	g2d.drawString("immediately upon receipt net", 175, 230);
        }else{
        	g2d.drawString(inv.getInv_payment_terms()+" days net", 175, 230);
        }
        g2d.drawString(inv_company.getInv_company_bank(), 175, 242);
        g2d.drawString(inv_company.getInv_company_address(), 175, 254);
        g2d.drawString(inv_company.getInv_company_acc_code(), 175, 266);
        g2d.drawString(inv_company.getInv_company_acc_name(), 175, 278);
        g2d.drawString(inv_company.getInv_company_acc_no(), 175, 290);
        g2d.drawString(inv_company.getInv_company_tax_id(), 175, 302);
        
        g2d.setFont(f13p);
        g2d.setColor(Color.gray);
        g2d.drawString("INVOICE", 75, 350);
        
        g2d.setFont(f10b);
        g2d.drawString("Subject:", 75, 370);
        g2d.setColor(Color.black);
        g2d.drawString(inv.getInv_name(), 140, 371);
        
        g2d.setFont(f9b);
        g2d.setColor(Color.gray);
        g2d.drawString("No.", 75, 390);
        g2d.drawString("Description", 140, 390);
        g2d.drawString("Qty", 380, 390);
        g2d.drawString("Rate", 435, 390);
        g2d.drawString("Amount", 495, 390);
        g2d.drawLine(75, 395, 530, 395);
        
        g2d.setFont(f8p);
        g2d.setColor(Color.black);
        int itemY = 408;
        float total_price = 0;
        DecimalFormat df = new DecimalFormat("#,###.##");
        DecimalFormat df2 = new DecimalFormat("#,###.00");
        for(int i=0; i<inv_ref.size(); i++){
        	
        	if(i == 10){
        		g2d.setFont(f9b);
        		g2d.drawString("Continued on next page", 528 - g2d.getFontMetrics().stringWidth("Continued on next page"), itemY+14);
        		
        		g2d.setFont(f9b);
                g2d.setColor(Color.gray);
                g2d.drawString("Page 2 of Invoice No. "+inv.getInv_number()+" from "+inv_bill_date, 75, 980);
                
                g2d.drawString("No.", 75, 1020);
                g2d.drawString("Description", 140, 1020);
                g2d.drawString("Qty", 380, 1020);
                g2d.drawString("Rate", 435, 1020);
                g2d.drawString("Amount", 495, 1020);
                g2d.drawLine(75, 1025, 530, 1025);
        		
                g2d.setColor(Color.black);
                String transfer = String.format("%,.2f", total_price)+" "+inv_ref.get(0).getInv_ref_currency();
        		g2d.drawString("Amount brought forward", 453 - g2d.getFontMetrics().stringWidth("Amount brought forward"), 1040);
        		g2d.drawString(transfer, 529 - g2d.getFontMetrics().stringWidth(transfer), 1040);
        		
        		g2d.setFont(f8p);
        		itemY = 1057;
        	}
        	
        	BigDecimal inv_ref_price = inv_ref.get(i).getInv_ref_price();
        	BigDecimal inv_ref_qty = inv_ref.get(i).getInv_ref_qty();
        	String currency = inv_ref.get(i).getInv_ref_currency();
            float sum_price = inv_ref_qty.floatValue()*inv_ref_price.floatValue();
            String qty = df.format(inv_ref_qty);
            String price = String.format("%,.2f", inv_ref_price)+" "+currency;
            String amount = String.format("%,.2f", sum_price)+" "+currency;
//            String amount = String.format("%.2f", sum_price)+" "+currency;
            
            g2d.drawString(inv_ref.get(i).getTopix_article_id(), 75, itemY);
            g2d.drawString(inv_ref.get(i).getInv_itm_name(), 140, itemY);
            g2d.setFont(f8i);
            if(!inv_ref.get(i).getInv_ref_desc().equals("")){
            	g2d.drawString(inv_ref.get(i).getInv_ref_desc(), 140, itemY+10);
            }else{
            	g2d.drawString("-", 140, itemY+10);
            }
            g2d.setFont(f8p);
            g2d.drawString(qty, 394 - g2d.getFontMetrics().stringWidth(qty), itemY);
            g2d.drawString(price, 452 - g2d.getFontMetrics().stringWidth(price), itemY);
            g2d.drawString(amount, 527 - g2d.getFontMetrics().stringWidth(amount), itemY);
            itemY += 23;
            total_price += sum_price;
        }
        
        itemY += 20;
        float sum_vat = (inv.getInv_vat().floatValue()/100)*total_price;
        total_price += sum_vat;
        String vat = "";
        if(sum_vat != 0){
        	vat = String.format("%,.2f", sum_vat)+" "+inv_ref.get(0).getInv_ref_currency();
        }else{
        	vat = String.format("%.2f", sum_vat)+" "+inv_ref.get(0).getInv_ref_currency();
        }
        String total = String.format("%,.2f", total_price)+" "+inv_ref.get(0).getInv_ref_currency();
        g2d.setFont(f9b);
        String vat_text = "plus "+df.format(inv.getInv_vat())+"% VAT";
        g2d.drawString(vat_text, 394 - g2d.getFontMetrics().stringWidth(vat_text), itemY);
        g2d.drawString(vat, 529 - g2d.getFontMetrics().stringWidth(vat), itemY);
        g2d.drawString("Total", 394 - g2d.getFontMetrics().stringWidth("Total"), itemY+12);
        g2d.drawString(total, 529 - g2d.getFontMetrics().stringWidth(total), itemY+12);
        
        
        
//        g2d.setFont(f9b);
//        g2d.setColor(Color.gray);
//        g2d.drawString("Page 2 of Invoice No. "+inv.getInv_number()+" from "+inv_bill_date, 75, 980);
//        g2d.setFont(f9b);
//        g2d.drawString("No.", 75, 1020);
//        g2d.drawString("Description", 140, 1020);
//        g2d.drawString("Qty", 380, 1020);
//        g2d.drawString("Rate", 435, 1020);
//        g2d.drawString("Amount", 490, 1020);
//        g2d.drawLine(75, 1025, 530, 1025);
//        
//        g2d.setColor(Color.black);
//        g2d.drawString("Transfer", 394 - g2d.getFontMetrics().stringWidth("Transfer"), 1040);
//        g2d.drawString("226.93 EUR", 524 - g2d.getFontMetrics().stringWidth("226.93 EUR"), 1040);
//        g2d.setFont(f9p);
//        g2d.setColor(Color.black);
//        g2d.drawString("article id", 75, 1038);
//        g2d.drawString("Item name example : Clipping Basic", 140, 1038);
//        g2d.drawString("This item remark or description....", 140, 1048);
//        g2d.drawString("5", 392 - g2d.getFontMetrics().stringWidth("5"), 1038);
//        g2d.drawString("11.00 EUR", 451 - g2d.getFontMetrics().stringWidth("11.00 EUR"), 1038);
//        g2d.drawString("55.00 EUR", 519 - g2d.getFontMetrics().stringWidth("55.00 EUR"), 1038);
        
//        g2d.setFont(f9p);
//        g2d.drawString("0794-GSD", 75, 1060);
//        g2d.drawString("Retouch Complex", 140, 1060);
//        g2d.drawString("17EUR18758", 140, 1070);
//        g2d.drawString("15", 392 - g2d.getFontMetrics().stringWidth("15"), 1060);
//        g2d.drawString("2.25 EUR", 455 - g2d.getFontMetrics().stringWidth("2.25 EUR"), 1060);
//        g2d.drawString("33.75 EUR", 524 - g2d.getFontMetrics().stringWidth("33.75 EUR"), 1060);
        
//        g2d.setFont(f8b);
//        DecimalFormat df = new DecimalFormat("#.##");
//        String vat_text = "plus "+String.format("%,.2f", inv.getInv_vat())+"% VAT";
//        g2d.drawString(vat_text, 451 - g2d.getFontMetrics().stringWidth(vat_text), 456);
//        g2d.drawString("0.00 EUR", 519 - g2d.getFontMetrics().stringWidth("0.00 EUR"), 456);
//        g2d.drawString("Total", 451 - g2d.getFontMetrics().stringWidth("Total"), 468);
//        g2d.drawString("88.75 EUR", 519 - g2d.getFontMetrics().stringWidth("88.75 EUR"), 468);
        
        g2d.dispose();
        int pages = ((int)height / (int)maxHeight);
        for (int p = 0; p < pages; ) {
            p++;
            
            if(inv.getInv_company_id() == 1 || inv.getInv_company_id() == 2 || inv.getInv_company_id() == 3 || inv.getInv_company_id() == 5){
            	//GSD, JV(RS), FGS, GSDP
            	Image logo = Image.getInstance(rootDirectory+"image/invoice/"+inv_company.getInv_company_code()+".jpg");
                logo.scaleToFit(180, 70);
                logo.setAbsolutePosition(420, 735);
                document.add(logo);
            }else{
            	//MM, GPS, TTA, STU
            	Image logo = Image.getInstance(rootDirectory+"image/invoice/"+inv_company.getInv_company_code()+".jpg");
                logo.scaleToFit(180, 80);
                logo.setAbsolutePosition(350, 760);
                document.add(logo);
            }
            
            //GSD
//            Image logo = Image.getInstance(rootDirectory+"image/invoice/GSD.jpg");
//            logo.scaleToFit(150, 80);
//            logo.setAbsolutePosition(405, 750);
//            document.add(logo);
            
            //JV (RS)
//            Image logo = Image.getInstance(rootDirectory+"image/invoice/JV.jpg");
//            logo.scaleToFit(150, 80);
//            logo.setAbsolutePosition(405, 750);
//            document.add(logo);
            
            //FGS
//            Image logo = Image.getInstance(rootDirectory+"image/invoice/FGS.jpg");
//            logo.scaleToFit(150, 80);
//            logo.setAbsolutePosition(405, 750);
//            document.add(logo);
            
            //MM
//            Image logo = Image.getInstance(rootDirectory+"image/invoice/MM.jpg");
//            logo.scaleToFit(180, 80);
//            logo.setAbsolutePosition(350, 760);
//            document.add(logo);
            
            //GSDP
//            Image logo = Image.getInstance(rootDirectory+"image/invoice/GSDP.jpg");
//            logo.scaleToFit(150, 80);
//            logo.setAbsolutePosition(405, 750);
//            document.add(logo);
            
            //GPS
//            Image logo = Image.getInstance(rootDirectory+"image/invoice/GPS.jpg");
//            logo.scaleToFit(180, 80);
//            logo.setAbsolutePosition(350, 760);
//            document.add(logo);
            
            //TTA
//            Image logo = Image.getInstance(rootDirectory+"image/invoice/TTA.jpg");
//            logo.scaleToFit(180, 80);
//            logo.setAbsolutePosition(350, 760);
//            document.add(logo);
            
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
