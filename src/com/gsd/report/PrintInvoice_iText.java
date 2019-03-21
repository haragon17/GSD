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
        }else{
        	page_count = ((item_count - 10) / 18) + 2;
        }
        
//        System.out.println("Page Count = "+page_count);
        
//        if(item_count <= 10){
//        	page_count = 1;
//        }else if(item_count > 10 && item_count < 29){
//        	page_count = 2;
//        }else if(item_count > 28 && item_count < 47){
//        	page_count = 3;
//        }else{
//        	page_count = 4;
//        }
        
        float width = 595;
        float height = 842*page_count;
        float maxHeight = 842;
        Document document = new Document(new Rectangle(width, maxHeight));
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(DEST));
        document.open();
        PdfContentByte canvas = writer.getDirectContent();
        PdfTemplate template = canvas.createTemplate(width, height);
        Graphics2D g2d = new PdfGraphics2D(template, width, height);
        
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
        String addr2 = "Phone: +66 76 24 81 00   E-Mail: info@gsd-digital.com";
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
        }else if(inv.getInv_company_id() == 9){
        	tail = "GSD ASIA Co., Ltd";
        }else if(inv.getInv_company_id() == 0){
        	tail = "MIMAMI INTERNATIONAL LAW OFFICE CO., LTD.";
        	addr2 = "Phone: +66 76 24 81 00   FAX: +66 76 24 80 99";
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
        
        g2d.setFont(f8b);
        g2d.setColor(Color.black);
        int addrY = 130;
        if(inv.getInv_bill_to().equals("Customer")){
        	for (String line : inv.getAddress().split("\n")){
	            g2d.drawString(line, 75, addrY += g2d.getFontMetrics().getHeight());
	        }
        }else if(!inv.getInv_bill_to().equals("")){
        	String inv_addr1 = "";
        	String inv_addr2 = "74/6-9 Moo 2, Tambon Wichit,";
        	String inv_addr3 = "Amphoe Muang, Phuket 83000,";
        	String inv_addr4 = "Thailand";
        	if(inv.getInv_bill_to().equals("GSD")){
        		inv_addr1 = "gsd graphic solution digital Co., Ltd.";
        	}else if(inv.getInv_bill_to().equals("JV")){
        		inv_addr1 = "RS GSD Marketing Service Co., Ltd.";
        	}else if(inv.getInv_bill_to().equals("FGS")){
        		inv_addr1 = "FGS Media Co., Ltd.";
        	}else if(inv.getInv_bill_to().equals("MM")){
        		inv_addr1 = "M.M. ASIA Co., Ltd.";
        		inv_addr2 = "490 Moo 6, Reanthai Group Building, Maliwan Road,";
        		inv_addr3 = "T.Banped, A.Muang, Khon Kaen 40000,";
        	}else if(inv.getInv_bill_to().equals("GSDP")){
        		inv_addr1 = "gsd packaging Co., Ltd.";
        	}else if(inv.getInv_bill_to().equals("GPS")){
        		inv_addr1 = "GPS Global Packaging Solutions Co., Ltd.";
        	}else if(inv.getInv_bill_to().equals("TTA")){
        		inv_addr1 = "True Time Media Phnom Penh Co., Ltd.";
        		inv_addr2 = "#184, St.217, Sangkat Tomnub Tek,";
        		inv_addr3 = "Khan Chamkarmorn, Phnom Penh,";
        		inv_addr4 = "Cambodia";
        	}else if(inv.getInv_bill_to().equals("STU")){
        		inv_addr1 = "Stuber Asia Co., Ltd.";
        	}else if(inv.getInv_bill_to().equals("GSDA")){
        		inv_addr1 = "GSD ASIA Co., Ltd.";
        	}
        	g2d.drawString(inv_addr1, 75, addrY += g2d.getFontMetrics().getHeight());
        	g2d.drawString(inv_addr2, 75, addrY += g2d.getFontMetrics().getHeight());
        	g2d.drawString(inv_addr3, 75, addrY += g2d.getFontMetrics().getHeight());
        	g2d.drawString(inv_addr4, 75, addrY += g2d.getFontMetrics().getHeight());
        }
        
//        if(inv.getBill_to().equals("GSD")){
//        	g2d.drawString("gsd graphic solution digital Co., Ltd.", 75, addrY += g2d.getFontMetrics().getHeight());
//        	g2d.drawString("74/6-9 Moo 2, Tambon Wichit,", 75, addrY += g2d.getFontMetrics().getHeight());
//        	g2d.drawString("Amphoe Muang, Phuket 83000,", 75, addrY += g2d.getFontMetrics().getHeight());
//        	g2d.drawString("Thailand", 75, addrY += g2d.getFontMetrics().getHeight());
//        }else{
//	        for (String line : inv.getAddress().split("\n")){
//	            g2d.drawString(line, 75, addrY += g2d.getFontMetrics().getHeight());
//	        }
//        }
        
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
        
        g2d.setFont(f7p);
        g2d.setColor(Color.gray);
        if(inv.getInv_bill_type().equals("Credit Note")){
        	g2d.drawString("Credit Note No:", 350, 140);
        }else{
        	g2d.drawString("Invoice No:", 350, 140);
        }
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
        if(inv.getInv_bill_type().equals("Credit Note")){
        	g2d.drawString("CREDIT NOTE", 75, 350);
        }else{
        	g2d.drawString("INVOICE", 75, 350);
        }
        g2d.setFont(f10b);
        g2d.drawString("Subject:", 75, 370);
        g2d.setColor(Color.black);
        String subject = inv.getInv_name();
        int subjectY = 356;
        int subject_width = g2d.getFontMetrics().stringWidth(subject);
        if(subject_width > 396){
	        StringBuilder sb = new StringBuilder(subject);
	        int ix = 0;
	        while ((ix = sb.indexOf(" ", ix + 65)) != -1) {
	            sb.replace(ix, ix + 1, "\n");
	        }
	        subject = sb.toString();
	        for (String line : subject.split("\n")){
	            g2d.drawString(line, 140, subjectY += 15);
	        }
        }else{
        	subjectY = 371;
        	g2d.drawString(inv.getInv_name(), 140, subjectY);
        }
        
        subjectY += 19;
        g2d.setFont(f9b);
        g2d.setColor(Color.gray);
        g2d.drawString("No.", 75, subjectY);
        g2d.drawString("Description", 140, subjectY);
        g2d.drawString("Qty", 370, subjectY);
        g2d.drawString("Rate", 435, subjectY);
        g2d.drawString("Amount", 495, subjectY);
        g2d.drawLine(75, subjectY+5, 530, subjectY+5);
        
        g2d.setFont(f8p);
        g2d.setColor(Color.black);
        int itemY = subjectY+18;
        double total_price = 0;
        float positive_price = 0;
        float negative_price = 0;
        DecimalFormat df = new DecimalFormat("#,###.##");
        DecimalFormat df2 = new DecimalFormat("#,###.00");
        int pageChk = 0;
        int i_chk = 0;
        int p_chk = 2;
        for(int i=0; i<inv_ref.size(); i++){
        	pageChk = 0;
        	if(i == 10){
        		pageChk = 1;
        	}else if(i > 10){
        		i_chk = i - 10;
        		if(i_chk%18 == 0){
        			pageChk = 1;
        		}
        	}
        	
//        	if(i == 10 || i == 28 || i == 46){
        	if(pageChk == 1){
        		int myY =0;
        		String myPage = "";
        		g2d.setFont(f9b);
        		g2d.drawString("Continued on next page", 528 - g2d.getFontMetrics().stringWidth("Continued on next page"), itemY+14);
        		
        		if(i == 10){
                	myY = 980;
                	myPage = p_chk+"";
                	itemY = 1057;
                	p_chk++;
        		}else if(i > 10){
        			myY = 980 + (842 * (p_chk - 2));
        			myPage = p_chk+"";
        			itemY = myY + 77;
        			p_chk++;
        		}
//                }else if(i == 28){
//                	myY = 1822;
//                	myPage = "3";
//                	itemY = 1899;
//                }else if(i == 46){
//                	myY = 2664;
//                	myPage = "4";
//                	itemY = 2741;
//                }
        		
        		g2d.setFont(f9b);
                g2d.setColor(Color.gray);
                g2d.drawString("Page "+myPage+" of Invoice No. "+inv.getInv_number()+" from "+inv_bill_date, 75, myY);
                
                g2d.drawString("No.", 75, myY+40);
                g2d.drawString("Description", 140, myY+40);
                g2d.drawString("Qty", 370, myY+40);
                g2d.drawString("Rate", 435, myY+40);
                g2d.drawString("Amount", 495, myY+40);
                g2d.drawLine(75, myY+45, 530, myY+45);
        		
                g2d.setColor(Color.black);
                String transfer = String.format("%,.2f", total_price)+" "+inv_ref.get(0).getInv_currency();
        		g2d.drawString("Amount brought forward", 453 - g2d.getFontMetrics().stringWidth("Amount brought forward"), myY+60);
        		g2d.drawString(transfer, 529 - g2d.getFontMetrics().stringWidth(transfer), myY+60);
        		
        		g2d.setFont(f8p);
        	}
        	
        	BigDecimal inv_ref_price = inv_ref.get(i).getInv_ref_price();
        	BigDecimal inv_ref_qty = inv_ref.get(i).getInv_ref_qty();
        	String currency = inv_ref.get(i).getInv_currency();
        	BigDecimal sum_price = inv_ref_qty.multiply(inv_ref_price);
        	sum_price = sum_price.setScale(2, BigDecimal.ROUND_HALF_UP);
            String qty = df.format(inv_ref_qty);
            String price = String.format("%,.2f", inv_ref_price)+" "+currency;
            String amount = String.format("%,.2f", sum_price)+" "+currency;
//            String amount = String.format("%.2f", sum_price)+" "+currency;
            
            g2d.drawString(inv_ref.get(i).getInv_topix_id(), 75, itemY);
            g2d.drawString(inv_ref.get(i).getInv_itm_name(), 140, itemY);
            g2d.setFont(f8i);
            if(!inv_ref.get(i).getInv_ref_desc().equals("")){
            	g2d.drawString(inv_ref.get(i).getInv_ref_desc(), 140, itemY+10);
            }else{
            	g2d.drawString("-", 140, itemY+10);
            }
            g2d.setFont(f8p);
            g2d.drawString(qty, 384 - g2d.getFontMetrics().stringWidth(qty), itemY);
            g2d.drawString(price, 452 - g2d.getFontMetrics().stringWidth(price), itemY);
            g2d.drawString(amount, 527 - g2d.getFontMetrics().stringWidth(amount), itemY);
            itemY += 23;
            if(sum_price.compareTo(new BigDecimal(0)) < 0){
            	positive_price += sum_price.floatValue();
            }else{
            	negative_price += sum_price.floatValue();
            }
            total_price += sum_price.floatValue();
        }
        
        itemY += 20;
        g2d.setFont(f9b);
        String vat = "";
        double subtotal = inv.getTotal_inv_price().doubleValue();
        String subtotal_str = String.format("%,.2f", subtotal)+" "+inv_ref.get(0).getInv_currency();
        g2d.drawString("Subtotal", 384 - g2d.getFontMetrics().stringWidth("Subtotal"), itemY);
        g2d.drawString(subtotal_str, 529 - g2d.getFontMetrics().stringWidth(subtotal_str), itemY);
        itemY += 12;
        double sum_disc = 0;
        double price_total = Math.round(subtotal*100.0)/100.0;
        if(inv.getInv_discount().floatValue() != 0){
        	sum_disc = (inv.getInv_discount().doubleValue()/100.0)*subtotal;
        	String sum_disc_str = "-"+String.format("%,.2f", sum_disc)+" "+inv_ref.get(0).getInv_currency();
        	String disc_text = "Discount "+df.format(inv.getInv_discount())+"%";
        	g2d.drawString(disc_text, 384 - g2d.getFontMetrics().stringWidth(disc_text), itemY);
            g2d.drawString(sum_disc_str, 529 - g2d.getFontMetrics().stringWidth(sum_disc_str), itemY);
            itemY += 12;
            price_total -= sum_disc;
        }
        double sum_vat = 0;
//        System.out.println("Price total : "+price_total);
        if(inv.getInv_vat().floatValue() != 0){
//        	sum_vat = (inv.getInv_vat().floatValue()/100)*positive_price;
        	sum_vat = (inv.getInv_vat().doubleValue()/100.0)*price_total;
        	price_total += (Math.round(sum_vat*100.0)/100.0);
//        	System.out.println("Price total : "+price_total);
            vat = String.format("%,.2f", sum_vat)+" "+inv_ref.get(0).getInv_currency();
        }else{
        	vat = String.format("%.2f", sum_vat)+" "+inv_ref.get(0).getInv_currency();
        }
        total_price += sum_vat;
        String total = String.format("%,.2f", price_total)+" "+inv.getInv_currency();
        String vat_text = "plus "+df.format(inv.getInv_vat())+"% VAT";
        g2d.drawString(vat_text, 384 - g2d.getFontMetrics().stringWidth(vat_text), itemY);
        g2d.drawString(vat, 529 - g2d.getFontMetrics().stringWidth(vat), itemY);
        itemY += 12;
        g2d.drawString("Total", 384 - g2d.getFontMetrics().stringWidth("Total"), itemY);
        g2d.drawString(total, 529 - g2d.getFontMetrics().stringWidth(total), itemY);

//        g2d.setFont(f13p);
//        g2d.setColor(Color.gray);
        
//        if(total_price >= 0){
//            g2d.drawString("INVOICE", 75, 350);
//        }else{
//        	g2d.drawString("CREDIT NOTE", 75, 350);
//        }
        
        
        
        g2d.dispose();
        int pages = ((int)height / (int)maxHeight);
        for (int p = 0; p < pages; ) {
            p++;
            
            if(inv.getInv_company_id() == 0 ||inv.getInv_company_id() == 1 || inv.getInv_company_id() == 2 || inv.getInv_company_id() == 3 || inv.getInv_company_id() == 5){
            	//GSD, JV(RS), FGS, GSDP
            	Image logo = Image.getInstance(rootDirectory+"image/invoice/"+inv_company.getInv_company_code()+".jpg");
                logo.scaleToFit(180, 70);
                logo.setAbsolutePosition(420, 735);
                document.add(logo);
            }else if(inv.getInv_company_id() == 9){
            	//GSDA
            	Image logo = Image.getInstance(rootDirectory+"image/invoice/"+inv_company.getInv_company_code()+".jpg");
                logo.scaleToFit(180, 70);
                logo.setAbsolutePosition(350, 742);
                document.add(logo);
            }else{
            	//MM, GPS, TTA, STU
            	Image logo = Image.getInstance(rootDirectory+"image/invoice/"+inv_company.getInv_company_code()+".jpg");
                logo.scaleToFit(180, 80);
                logo.setAbsolutePosition(350, 760);
                document.add(logo);
            }
            
            canvas.addTemplate(template, 0, (p * maxHeight) - height);
            document.newPage();
        }
        document.close();
        
        response.setContentType("application/pdf");

		response.setHeader("Content-Disposition", "inline; filename=" + inv.getInv_number() +".pdf" + ";");

		byte[] fileData = new byte[(int)file.length()];

		FileInputStream fis = new FileInputStream(file);

		fis.read(fileData);

		
		ServletOutputStream outputStream = response.getOutputStream();

        outputStream.write(fileData); 

        outputStream.flush();

        outputStream.close();
        
    }
	
}
