store = {};
panel = {};
grid = {};
editPosition = 0;
inv_year = "";
Ext.onReady(function() {
	
	Ext.util.Format.thousandSeparator = ',';
	Ext.util.Format.decimalSeparator = '.';
	
	Ext.define('RevRec.util.Format', {
	    override: 'Ext.util.Format',
	    originalNumberFormatter: Ext.util.Format.number,
	    number: function(v, formatString) {
	        if (v < 0) {
	            //negative number: flip the sign, format then prepend '-' onto output
	            return '-' + this.originalNumberFormatter(v * -1, formatString);
	        } else {
	            //positive number: as you were
	            return this.originalNumberFormatter(v, formatString);
	        }
	    }
	});
	
	Ext.define('Ext.form.field.Month', {
        extend: 'Ext.form.field.Date',
        alias: 'widget.monthfield',
        requires: ['Ext.picker.Month'],
        alternateClassName: ['Ext.form.MonthField', 'Ext.form.Month'],
        selectMonth: null,
        createPicker: function () {
            var me = this,
                format = Ext.String.format;
            return Ext.create('Ext.picker.Month', {
                pickerField: me,
                ownerCt: me.ownerCt,
                renderTo: document.body,
                floating: true,
                hidden: true,
                focusOnShow: true,
                minDate: me.minValue,
                maxDate: me.maxValue,
                disabledDatesRE: me.disabledDatesRE,
                disabledDatesText: me.disabledDatesText,
                disabledDays: me.disabledDays,
                disabledDaysText: me.disabledDaysText,
                format: me.format,
                showToday: me.showToday,
                startDay: me.startDay,
                minText: format(me.minText, me.formatDate(me.minValue)),
                maxText: format(me.maxText, me.formatDate(me.maxValue)),
                listeners: {
                    select: { scope: me, fn: me.onSelect },
                    monthdblclick: { scope: me, fn: me.onOKClick },
                    yeardblclick: { scope: me, fn: me.onOKClick },
                    OkClick: { scope: me, fn: me.onOKClick },
                    CancelClick: { scope: me, fn: me.onCancelClick }
                },
                keyNavConfig: {
                    esc: function () {
                        me.collapse();
                    }
                }
            });
        },
        onCancelClick: function () {
            var me = this;
            me.selectMonth = null;
            me.collapse();
        },
        onOKClick: function () {
            var me = this;
            if (me.selectMonth) {
            	var delivery_date = me.selectMonth;
				var max_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth()+1, 0);
				var min_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth(), 1);
            	if(Ext.getCmp('einv_delivery_date').getValue() != null){
            		if(me.selectMonth.getFullYear() == inv_year){
//		                try{
////		    	            var delivery_date = Ext.getCmp('einv_delivery_date').getValue();
//		                	var delivery_date = me.selectMonth;
//		    				var max_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth()+1, 0);
//		    				var min_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth(), 1);
////	    					var val_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth(), new Date().getDay());
//		    				Ext.getCmp('einv_bill_date').setValue('');
//		    				Ext.getCmp('einv_bill_date').setMinValue(min_date);
//		    				Ext.getCmp('einv_bill_date').setMaxValue(max_date);
//		                }catch(err){
//		                	var delivery_date = me.selectMonth;
//		    				var max_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth()+1, 0);
//		    				var min_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth(), 1);
////	    					var val_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth(), new Date().getDay());
//		    				Ext.getCmp('ainv_bill_date').setValue('');
//		    				Ext.getCmp('ainv_bill_date').setMinValue(min_date);
//		    				Ext.getCmp('ainv_bill_date').setMaxValue(max_date);
//		                }
		                
	    				Ext.getCmp('einv_bill_date').setValue('');
	    				Ext.getCmp('einv_bill_date').setMinValue(min_date);
	    				Ext.getCmp('einv_bill_date').setMaxValue(max_date);
	    			}else{
	    				Ext.MessageBox.show({
	            			title : 'Error',
	            			msg : 'Please select only year \''+inv_year+'\' !',
	            			buttons : Ext.MessageBox.OK,
//            				animateTarget : 'del',
	            			icon : Ext.MessageBox.ERROR
	            		});
	    			}
            	}else if(Ext.getCmp('ainv_delivery_date').getValue() != null){
            		Ext.getCmp('ainv_bill_date').setValue('');
    				Ext.getCmp('ainv_bill_date').setMinValue(min_date);
    				Ext.getCmp('ainv_bill_date').setMaxValue(max_date);
            	}
            	me.setValue(me.selectMonth);
            	me.fireEvent('select', me, me.selectMonth);
            }
            me.collapse();
        },
        onSelect: function (m, d) {
            var me = this;
            me.selectMonth = new Date((d[0] + 1) + '/1/' + d[1]);
        }
    });  
	
//	Ext.define('Ext.form.field.Month', {
//        extend: 'Ext.form.field.Date',
//        alias: 'widget.searchmonthfield',
//        requires: ['Ext.picker.Month'],
//        alternateClassName: ['Ext.form.MonthField', 'Ext.form.Month'],
//        selectMonth: null,
//        createPicker: function () {
//            var me = this,
//                format = Ext.String.format;
//            return Ext.create('Ext.picker.Month', {
//                pickerField: me,
//                ownerCt: me.ownerCt,
//                renderTo: document.body,
//                floating: true,
//                hidden: true,
//                focusOnShow: true,
//                minDate: me.minValue,
//                maxDate: me.maxValue,
//                disabledDatesRE: me.disabledDatesRE,
//                disabledDatesText: me.disabledDatesText,
//                disabledDays: me.disabledDays,
//                disabledDaysText: me.disabledDaysText,
//                format: me.format,
//                showToday: me.showToday,
//                startDay: me.startDay,
//                minText: format(me.minText, me.formatDate(me.minValue)),
//                maxText: format(me.maxText, me.formatDate(me.maxValue)),
//                listeners: {
//                    select: { scope: me, fn: me.onSelect },
//                    monthdblclick: { scope: me, fn: me.onOKClick },
//                    yeardblclick: { scope: me, fn: me.onOKClick },
//                    OkClick: { scope: me, fn: me.onOKClick },
//                    CancelClick: { scope: me, fn: me.onCancelClick }
//                },
//                keyNavConfig: {
//                    esc: function () {
//                        me.collapse();
//                    }
//                }
//            });
//        },
//        onCancelClick: function () {
//            var me = this;
//            me.selectMonth = null;
//            me.collapse();
//        },
//        onOKClick: function () {
//            var me = this;
//            if (me.selectMonth) {
//            	me.setValue(me.selectMonth);
//                me.fireEvent('select', me, me.selectMonth);
//                
//            }
//            me.collapse();
//        },
//        onSelect: function (m, d) {
//            var me = this;
//            me.selectMonth = new Date((d[0] + 1) + '/1/' + d[1]);
//        }
//    });  
	
	invid = new Ext.form.Hidden({
		name : 'invid',
		id : 'invid'
	});
	invid_del = new Ext.form.Hidden({
		name : 'invid_del',
		id : 'invid_del'
	});
	invrefid = new Ext.form.Hidden({
		name : 'invrefid',
		id : 'invrefid'
	});
	projRefId_invRef = new Ext.form.Hidden({
		name : 'projRefId_invRef',
		id : 'projRefId_invRef'
	});
	price_invRef = new Ext.form.Hidden({
		name : 'price_invRef',
		id : 'price_invRef'
	});
	currency_invRef = new Ext.form.Hidden({
		name : 'currency_invRef',
		id : 'currency_invRef'
	});
	
	
	panel.invoiceHeader = Ext.create('Ext.form.Panel', {
		title : 'Invoice Information ',
		width : 850,
		height : 270,
		autoScroll:true,
		layout : 'column',
		style : {
			"margin-left" : "auto",
			"margin-right" : "auto",
			"margin-bottom" : "10px",
			"margin-top" : "10px",
		},
	    padding: '5',
	    tools : [ {
			xtype : 'button',
			text : 'Edit',
			id : 'editInvoiceButton',
			iconCls : 'table-edit',
			handler : function() {
				inv_id = Ext.getCmp('dinv_id').getValue();
				inv_name = Ext.getCmp('dinv_name').getValue();
				inv_proj_no = Ext.getCmp('dinv_proj_no').getValue();
				inv_delivery_date = new Date(Ext.getCmp('dinv_delivery_date').getValue());
				inv_company_id = Ext.getCmp('dinv_company_id').getValue();
//				inv_company_name = Ext.getCmp('dinv_company_name').getValue();
				cus_id = Ext.getCmp('dcus_id').getValue();
				cus_name = Ext.getCmp('dcus_name').getValue();
				cus_code = Ext.getCmp('dcus_code').getValue();
				inv_payment_terms = Ext.getCmp('dinv_payment_terms').getValue();
				inv_vat = Ext.getCmp('dinv_vat').getValue();
//				inv_bill_type = Ext.getCmp('dinv_bill_type').getValue();
				inv_bill_date = new Date(Ext.getCmp('dinv_bill_date').getValue());
				inv_bill_to = Ext.getCmp('dinv_bill_to').getValue();
				inv_currency = Ext.getCmp('dinv_currency').getValue();
				
				min_year = new Date(inv_delivery_date.getFullYear(), 0, 1);
				max_year = new Date(inv_delivery_date.getFullYear()+1, 0, 0);
				inv_year = inv_delivery_date.getFullYear();
				editPosition = 1;
				
				Ext.getCmp('einv_id').setValue(inv_id);
				Ext.getCmp('einv_name').setValue(inv_name);
				Ext.getCmp('einv_proj_no').setValue(inv_proj_no);
				Ext.getCmp('einv_delivery_date').setValue(inv_delivery_date);
//				Ext.getCmp('einv_delivery_date').setMinValue(min_year);
//				Ext.getCmp('einv_delivery_date').setMaxValue(max_year);
				Ext.getCmp('einv_bill_date').setValue(inv_bill_date);
//				Ext.getCmp('einv_company_id').setValue(Number(inv_company_id));
				Ext.getCmp('ecus_id').setValue(cus_id);
				Ext.getCmp('ecus_name').setValue(cus_name);
				Ext.getCmp('ecus_code').setValue(cus_code);
				Ext.getCmp('einv_payment_terms').setValue(inv_payment_terms);
				Ext.getCmp('einv_vat').setValue(inv_vat);
//				Ext.getCmp('einv_bill_type').setValue(inv_bill_type);
				Ext.getCmp('einv_bill_to').setValue(inv_bill_to);
				Ext.getCmp('einv_currency').setValue(inv_currency);
				editInvoice.show();
			}
		} ],
		items : [ {
			layout : 'column',
			border : false,
			items : [ {
				columnWidth : 0.7,
				style : {
					"margin-left" : "30px",
					"margin-right" : "10px",
					"margin-top" : "10px",
				},
				border : false,
				layout : 'anchor',
				defaultType : 'displayfield',
				items : [ {
					xtype: 'displayfield',
					fieldLabel : 'Subject ',
					name : 'dinv_name',
					id : 'dinv_name',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 400,
					fieldStyle : 'font-size:13px;font-weight:bold;'
				}, {
					fieldLabel : 'Project No ',
					name : 'dinv_proj_no',
					id : 'dinv_proj_no',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 400,
					fieldStyle : 'font-size:13px;font-weight:bold;'
				},{ 
					fieldLabel : 'Delivery Date ',
					name : 'dinv_delivery_date',
					id : 'dinv_delivery_date',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 400,
					renderer: Ext.util.Format.dateRenderer('m/y'),
					fieldStyle : 'font-size:13px;font-weight:bold;'
				},{ 
					fieldLabel : 'Bill Date ',
					name : 'dinv_bill_date',
					id : 'dinv_bill_date',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 400,
					renderer: Ext.util.Format.dateRenderer('d/m/y'),
					fieldStyle : 'font-size:13px;font-weight:bold;'
				},{
					fieldLabel : 'Payment Terms ',
					name : 'dinv_payment_terms',
					id : 'dinv_payment_terms',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 400,
					fieldStyle : 'font-size:13px;font-weight:bold;'
				}]
			},{
				columnWidth : 0.3,
				border : false,
				layout : 'anchor',
				style : {
					"margin-left" : "30px",
					"margin-right" : "auto",
					"margin-top" : "10px",
					"margin-bottom" : "10px"
				},
				defaultType : 'displayfield',
				items : [
				    {
				    	fieldLabel : 'Invoice Number ',
						name : 'dinv_number',
						id: 'dinv_number',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 320,
						fieldStyle : 'font-size:13px;font-weight:bold;'
				    },{
				    	fieldLabel : 'Company Name ',
						name : 'dinv_company_name',
						id: 'dinv_company_name',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 320,
						fieldStyle : 'font-size:13px;font-weight:bold;'
				    },{
						fieldLabel : 'Customer Name ',
						name : 'dcus_name',
						id: 'dcus_name',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 320,
						fieldStyle : 'font-size:13px;font-weight:bold;'
					},{
						fieldLabel : 'Billing Type ',
						name : 'dinv_bill_type',
						id : 'dinv_bill_type',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 320,
						fieldStyle : 'font-size:13px;font-weight:bold;'
					},{
						fieldLabel : 'Vat(%) ',
						name : 'dinv_vat',
						id : 'dinv_vat',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 320,
						fieldStyle : 'font-size:13px;font-weight:bold;'
					}]
			},{
				xtype: 'hidden',
				id: 'dinv_id',
				id: 'dinv_id'
			},{
				xtype: 'hidden',
				name: 'dcus_id',
				id: 'dcus_id'
			},{
				xtype: 'hidden',
				name: 'dinv_company_id',
				id: 'dinv_company_id'
			},{
				xtype: 'hidden',
				name: 'dcus_code',
				id: 'dcus_code'
			},{
				xtype: 'hidden',
				name: 'dinv_currency',
				id: 'dinv_currency'
			},{
				xtype: 'hidden',
				name: 'dinv_bill_to',
				id: 'dinv_bill_to'
			}  ]
		} ],
		buttons: [{
			text: 'Send to Angebote',
			disabled: true,
			id: 'angeboteButton',
			iconCls: 'icon-db',
			handler: function(){
				inv_id = Ext.getCmp('dinv_id').getValue();
				var record = store.invoice.findRecord('inv_id',inv_id);
				var myIndex = store.invoice.indexOf(record);
				var count_tpx = store.invoice.getAt(myIndex).data.count_tpx;
				var topix_cus_id = store.invoice.getAt(myIndex).data.topix_cus_id;
				console.log(topix_cus_id);
				if(topix_cus_id == '' || topix_cus_id == '0'){
					Ext.MessageBox.show({
						title: 'Information',
						msg: "Please Assign Topix Customer ID!",
						width: 300,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR,
						animateTarget: 'angeboteButton'
					});
				}else if(count_tpx != 0){
					Ext.MessageBox.show({
						title: 'Information',
						msg: "Please Assign All Item Topix ID!",
						width: 300,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR,
						animateTarget: 'angeboteButton'
					});
				}else{
					Ext.MessageBox.show({
						title : 'Confirm',
						msg : 'Are you sure you want to send to Angebote?',
						buttons : Ext.MessageBox.YESNO,
						animateTarget : 'angeboteButton',
						icon : Ext.MessageBox.QUESTION,
						width: 350,
						fn: function(btn){
							if(btn == "yes"){
								var box1 = Ext.MessageBox.show({
					                  title: 'Sending info to Topix',
					                  msg: 'Please wait...',
					                  wait: true,
					                  animateTarget: 'angeboteButton',
					              });
								var inv_id = Ext.getCmp('dinv_id').getValue();
								Ext.Ajax.request({
			           				url : 'topixSoap.htm',
			           				params: {id : inv_id},
			           				success: function(response, opts){
			           					box1.hide();
			           					var responseOject = Ext.decode(response.responseText);
			           					var err_nr = responseOject.records[0].tpx_res_nr;
			           					var err_text = responseOject.records[0].tpx_res_msg;
			           					if(err_nr == '0'){
			           						Ext.getCmp('angeboteButton').setDisabled(true);
			           						Ext.getCmp('directButton').setDisabled(true);
			           						Ext.getCmp('creditNoteButton').setDisabled(true);
			           						Ext.getCmp('printInvoiceButton').setDisabled(false);
			           						var inv_number = responseOject.records[0].tpx_inv_number;
			           						Ext.getCmp('dinv_bill_type').setValue("Angebote");
			           						Ext.getCmp('dinv_number').setValue(inv_number);
			           						Ext.MessageBox.show({
			           							title: 'Information',
			           							msg: "Invoice has been sent to Angebote: "+inv_number,
			           							width: 350,
			           							buttons: Ext.MessageBox.OK,
			           							icon: Ext.MessageBox.INFO,
			           							animateTarget: 'angeboteButton'
			           						});
			           					}else{
			           						var err_msg = "Angebote Error("+err_nr+"): "+err_text;
			           						Ext.getCmp('dinv_bill_type').setValue(err_msg);
			           						Ext.MessageBox.show({
			           							title: 'Information',
			           							msg: err_msg,
			           							width: 350,
			           							buttons: Ext.MessageBox.OK,
			           							icon: Ext.MessageBox.ERROR,
			           							animateTarget: 'angeboteButton'
			           						});
			           					}
			           				},
			           				failure: function(response, opts){
			           					box1.hide();
			           					var responseOject = Ext.util.JSON.decode(response.responseText);
			           					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
			           				}
			           			});
							}
						}
					});
				}
			}
		},{
			text: 'Send Direct',
			id: 'directButton',
			disabled: true,
			iconCls: 'icon-mail',
			handler: function(){
				Ext.MessageBox.show({
					title : 'Confirm',
					msg : 'Are you sure you want to send Direct?',
					buttons : Ext.MessageBox.YESNO,
					animateTarget : 'directButton',
					icon : Ext.MessageBox.QUESTION,
					width: 350,
					fn: function(btn){
						if(btn == "yes"){
							var inv_id = Ext.getCmp('dinv_id').getValue();
							Ext.Ajax.request({
								url : 'updateInvoiceStatus.htm',
			       				params: {inv_bill_type : "Direct", inv_id : inv_id},
			       				success: function(response, opts){
			       					Ext.getCmp('angeboteButton').setDisabled(true);
	           						Ext.getCmp('directButton').setDisabled(true);
	           						Ext.getCmp('creditNoteButton').setDisabled(true);
	           						Ext.getCmp('printInvoiceButton').setDisabled(false);
			       					var responseOject = Ext.decode(response.responseText);
			       					var inv_number = responseOject.records[0].inv_number;
			       					Ext.getCmp('dinv_bill_type').setValue("Direct");
			   						Ext.getCmp('dinv_number').setValue(inv_number);
			   						Ext.MessageBox.show({
			   							title: 'Information',
			   							msg: "Invoice has been assign to: "+inv_number,
			   							width: 350,
			   							buttons: Ext.MessageBox.OK,
			   							icon: Ext.MessageBox.INFO,
			   							animateTarget: 'directButton'
			   						});
			       				},
			       				failure: function(response, opts){
			       					var responseOject = Ext.util.JSON.decode(response.responseText);
			       					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
			       				}
							});
						}
					}
				});
			}
		},{
			text: 'Credit Note',
			id: 'creditNoteButton',
			disabled: true,
			iconCls: 'icon-mail',
			handler: function(){
				Ext.MessageBox.show({
					title : 'Confirm',
					msg : 'Are you sure you want to make Credit Note?',
					buttons : Ext.MessageBox.YESNO,
					animateTarget : 'creditNoteButton',
					icon : Ext.MessageBox.QUESTION,
					width: 350,
					fn: function(btn){
						if(btn == "yes"){
							var inv_id = Ext.getCmp('dinv_id').getValue();
							Ext.Ajax.request({
								url : 'updateInvoiceStatus.htm',
			       				params: {inv_bill_type : "Credit Note", inv_id : inv_id},
			       				success: function(response, opts){
			       					Ext.getCmp('angeboteButton').setDisabled(true);
	           						Ext.getCmp('directButton').setDisabled(true);
	           						Ext.getCmp('creditNoteButton').setDisabled(true);
	           						Ext.getCmp('printInvoiceButton').setDisabled(false);
			       					var responseOject = Ext.decode(response.responseText);
			       					var inv_number = responseOject.records[0].inv_number;
			       					Ext.getCmp('dinv_bill_type').setValue("Credit Note");
			   						Ext.getCmp('dinv_number').setValue(inv_number);
			   						Ext.MessageBox.show({
			   							title: 'Information',
			   							msg: "Credit Note has been assign to: "+inv_number,
			   							width: 370,
			   							buttons: Ext.MessageBox.OK,
			   							icon: Ext.MessageBox.INFO,
			   							animateTarget: 'creditNoteButton'
			   						});
			       				},
			       				failure: function(response, opts){
			       					var responseOject = Ext.util.JSON.decode(response.responseText);
			       					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
			       				}
							});
						}
					}
				});
			}
		},'->',{
			text: 'Print Invoice',
			id : 'printInvoiceButton',
			iconCls: 'icon-print',
			handler: function(){
					inv_id = Ext.getCmp('dinv_id').getValue();
					window.open('printInvoice.htm?inv_id='+inv_id, '_blank');
				}
		}]
	});

	
	panel.detail = Ext.create('Ext.panel.Panel', {
//	    layout: {
//	        type: 'vbox',
//	        align: 'stretch'
//	    },
//	    width: 400,
//		height : 608,
//		title: 'Nested Grids',
//		tbar: [{
//			xtype: 'button',
//			text: 'Print Invoice',
//			iconCls: 'icon-print',
//			handler: function(){
//				
//			}
//		}],
	    items: [
	    panel.invoiceHeader,
	    grid.invoiceDetail
	    ]
//	    {
//	        xtype: 'panel',
//	        html: '<b><h2><u>Invoice Header Description</b></h2></u><br>Form Panel',
//	        style : {
//				"margin-left" : "auto",
//				"margin-right" : "auto",
//			},
//	        padding: '5',
//	        width : 800,
//	        height: 250
//	    }, {
//	        xtype: 'panel',
//	        html: '<b><h2><u>Invoice Item Description</b></h2></u><br>Grid Panel',
//	        padding: '5',
//	        height : 350
//	    }
//	    ]
	});
	
	panel.search = Ext.create('Ext.form.Panel', {
		title : 'Search Criteria',
		id : 'formPanel',
		width : 800,
		height : 240,
		collapsible : true,
		collapsed : true,
		renderTo : document.body,
		style : {
			"margin-left" : "auto",
			"margin-right" : "auto",
			"margin-top" : "30px"
		},
		layout : 'column',
		fieldDefaults : {
			labelAlign : '',
			msgTarget : 'side'
		},
		defaults : {
			xtype : 'container',
			layout : 'form',
			columnWidth : 1,
			labelWidth : 0,
			anchor : '100%',
			hideBorders : false,
			padding : '10 10 10 10'
		},
		items : [ {
			layout : 'column',
			border : false,
			items : [ {
				columnWidth : 0.66,
				style : {
					"margin-left" : "50px",
					"margin-right" : "10px",
					"margin-top" : "10px",
				},
				border : false,
				layout : 'anchor',
				defaultType : 'textfield',
				items : [ {
					    fieldLabel : 'Project No. ',
					    name : 'sinv_proj_no',
					    id : 'sinv_proj_no',
					    labelWidth : 100,
						margin : '0 0 10 0',
						width : 340,
						emptyText : 'Project No.'
					},{
		            	xtype: 'combobox',
		            	fieldLabel: 'Company ',
		            	name: 'sinv_company_id',
		            	id: 'sinv_company_id',
		            	queryMode: 'local',
		            	msgTarget: 'under',
		            	labelWidth: 100,
		            	width : 340,
		            	editable: false,
		            	emptyText: 'Company',
		            	store: {
		            		fields: ['inv_company_id','inv_company_name'],
		            		proxy: {
		            			type: 'ajax',
		            			url: 'showInvoiceCompany.htm',
		            			reader: {
		            				type: 'json',
		            				root: 'records',
		            				idProperty: 'inv_company_id'
		            			}
		            		},
		            		autoLoad: true,
		            		sorters: [{
		            			property: 'inv_company_id',
		            			direction: 'ASC'
		            		}]
		            	},
		            	valueField: 'inv_company_id',
		            	displayField: 'inv_company_name'
		            },{
						fieldLabel : 'Delivery Date',
						name : 'supdate_date',
						combineErrors: true,
						xtype: 'fieldcontainer',
						labelWidth : 100,
						margin : '0 0 10 0',
						width : 350,
						layout: 'hbox',
		                defaults: {
		                    flex: 1,
		                },
		                items: [
		                    {
//		                        xtype     : 'datefield',
		                    	xtype     : 'monthfield',
		                        name      : 'delivery_start',
		                        id	: 'delivery_start',
		                        labelSeparator : '',
		                        margin: '0 0 0 0',
		                        msgTarget : 'side',
		                        width: 50,
		                        editable: false,
		                        format: 'm/y',
//		                        maxValue: new Date(),
//		                        listeners: {
//		                        	   "change": function () {
//		                        		   			var startDate = Ext.getCmp('delivery_start').getRawValue();
//		                        		   			Ext.getCmp('delivery_limit').setMinValue(startDate);
//		                        	   }
//		                        }
		                    },{
		                    	 xtype: 'fieldcontainer',
		     	                fieldLabel: 'To ',
		     	                combineErrors: true,
		     	                msgTarget : 'side',
		     	                margin: '0 0 0 5',
		                    	labelSeparator : '',
		                        Width : 20
		                    },
		                    {
//		                        xtype     : 'datefield',
		                    	xtype     : 'monthfield',
		                        margin: '0 10 0 -80',	
		                        name      : 'delivery_limit',
		                        id	: 'delivery_limit',
		                        labelSeparator : '',
		                        msgTarget : 'side',
		                        editable: false,
		                        format: 'm/y',
		                        width: 50,
//		                        maxValue: new Date(),
//		                        listeners: {
//		                        	"change": function () {
//		                        		   	var endDate = Ext.getCmp('delivery_limit').getRawValue();
//		                           			Ext.getCmp('delivery_start').setMaxValue(endDate);
//		                        	}
//		                        }
		                    }
		                ]
					}
				]
			},{
				columnWidth : 0.33,
				border : false,
				layout : 'anchor',
				style : {
					"margin-left" : "-80px",
					"margin-right" : "10px",
					"margin-top" : "10px",
					"margin-bottom" : "10px"
				},
				defaultType : 'textfield',
				items : [ 
						{
							xtype : 'combobox',
							fieldLabel : 'Customer Name ',
							name : 'scus_name',
							id: 'scus_name',
							queryMode : 'local',
							labelWidth : 110,
							margin : '0 0 10 0',
							width : 280,
							emptyText : 'Customer Name',
							store : {
								fields : [ 'cus_id', 'cus_name', 'cus_code' ],
								proxy : {
									type : 'ajax',
									url : 'showCustomer.htm',
									reader : {
										type : 'json',
										root : 'records',
										idProperty : 'cus_id'
									}
								},
								autoLoad : true,
								sorters: [{
							         property: 'cus_name',
							         direction: 'ASC'
							     }]
							},
							valueField : 'cus_name',
							displayField : 'cus_name',
							listeners : {
						
								select : function() {
									
									var v = this.getValue();
									var record = this.findRecord(this.valueField || this.displayField, v);
									var myIndex = this.store.indexOf(record);
									var myValue = this.store.getAt(myIndex).data.cus_code;
									var myId = this.store.getAt(myIndex).data.cus_id;
									Ext.getCmp('scus_id').setValue(myId);
									Ext.getCmp('scus_code').setValue(myValue);
									
									console.log("cus_code: "+myValue);
								},
								blur : function() {
									var v = this.getValue();
									var record = this.findRecord(this.valueField || this.displayField, v);
									if(record == false){
										Ext.getCmp('scus_id').setValue("");
										Ext.getCmp('scus_name').setValue("");
										Ext.getCmp('scus_code').setValue("");
									}
								}
							}
						}, {
							xtype : 'combobox',
							fieldLabel : 'Customer Code ',
							name : 'scus_code',
							id : 'scus_code',
							queryMode : 'local',
							labelWidth : 110,
							margin : '0 0 10 0',
							width : 280,
							emptyText : 'Customer Code',
							store : {
								fields : [ 'cus_id', 'cus_code', 'cus_name' ],
								proxy : {
									type : 'ajax',
									url : 'showCustomer.htm',
									reader : {
										type : 'json',
										root : 'records',
										idProperty : 'cus_id'
									}
								},
								autoLoad : true,
								sorters: [{
							         property: 'cus_code',
							         direction: 'ASC'
							     }]
							},
							valueField : 'cus_code',
							displayField : 'cus_code',
							listeners : {
						
								select : function() {
									
									var v = this.getValue();
									var record = this.findRecord(this.valueField || this.displayField, v);
									var myIndex = this.store.indexOf(record);
									var myValue = this.store.getAt(myIndex).data.cus_name;
									var myId = this.store.getAt(myIndex).data.cus_id;
									Ext.getCmp('scus_id').setValue(myId);
									Ext.getCmp('scus_name').setValue(myValue);
									
									console.log("cus_name: "+myValue);
								},
								blur : function() {
									var v = this.getValue();
									var record = this.findRecord(this.valueField || this.displayField, v);
									if(record == false){
										Ext.getCmp('scus_id').setValue("");
										Ext.getCmp('scus_name').setValue("");
										Ext.getCmp('scus_code').setValue("");
									}
								}
						
							}
						},{
							xtype: 'combobox',
							fieldLabel: 'Billing Type ',
							name: 'sinv_bill_type',
							id: 'sinv_bill_type',
							labelWidth: 110,
							width : 280,
							store : {
								fields : ['db_ref_name'],
								proxy : {
									type : 'ajax',
									url : 'showDBReference.htm?kind=BillingType&dept=-',
									reader : {
										type : 'json',
										root : 'records',
									}
								},
								autoLoad : true
							},
							valueField : 'db_ref_name',
							displayField : 'db_ref_name',
							editable : false,
							emptyText : 'Billing Type'
						}]
			},{
				xtype: 'hidden',
				id : 'scus_id',
				name : 'scus_id'
			}  ]
		} ],
		buttons: [{
			text: 'Search',
			id: 'searchBtn',
			handler: function(){
				var form = this.up('form').getForm();
				if(form.isValid()){
					Ext.Ajax.request({
						url : 'searchInvoiceParam.htm' + getParamValues(),
						success : function(response, opts) {
							store.invoice.reload();
							panel.tabs.setActiveTab('invoiceTabs');
							Ext.getCmp('detailTabs').setDisabled(true);
							Ext.getCmp('detailTabs').setTitle("Detail");
 							Ext.getCmp('filterSearchField').setValue("");
						}
					});
				}
			}
		},{
			text : 'Reset',
			handler : function() {
				this.up('form').getForm().reset();
			}
		}]
	});
	
	panel.tabs = Ext.create('Ext.tab.Panel', {
		renderTo : document.body,
		deferredRender : false,
		width: 1300,
		height: 700,
		frame: true,
//		tools : [ {
//			xtype : 'button',
//			text : 'Report',
//			id : 'invoiceReport',
//			iconCls : 'icon-excel',
//			handler : function() {
//				window.open('printInvoiceReport.htm', '_blank');
//			}
//		}],
		style : {
			"margin-left" : "auto",
			"margin-right" : "auto",
			"margin-top" : "30px",
			"margin-bottom" : "10px"
		},
		items: [{
	    	id: 'invoiceTabs',
	    	title: 'Invoice',
//	    	html : '<b><h2><u>Invoice List</b></h2></u><br>Grid Panel',
	    	items: grid.invoice
	    },{
	    	id: 'detailTabs',
	    	title: 'Detail',
	    	disabled: true,
	    	items: panel.detail
	    }],
	    listeners: {
	    	'tabchange': function (tabPanel, tab) {
	    		if(tab.id == 'invoiceTabs'){
	    			store.invoice.reload();
	    		}else if(tab.id == 'detailTabs'){
	    			store.invoice.reload();
	    			store.invoiceRef.reload();
	    		}
	    	},
	    	'afterrender': function(panel){
            	grid.invoice.down('statusbar').add('->',{
              		xtype : 'tbtext',
             		 id : 'inv_total',
              		text : '<b>Total Invoices : '+store.invoice.count()+' <b>&nbsp;&nbsp;&nbsp;'
            	});
            	Ext.Ajax.request({
            		url : 'userModel.htm',
            		success: function(response, opts){
            			var responseObject = Ext.decode(response.responseText);
            			usr_id = responseObject.user[0].usr_id;
            			usr_dept = responseObject.user[0].dept;
            			usr_type = responseObject.user[0].usr_type;
            			
            			if(usr_dept == 'Billing' || usr_type == 0){
            				Ext.getCmp('inv_del').setVisible(true);
            				grid.invoice.down('toolbar').add('->',{
                                xtype: 'button',
                                id: 'inv_monthly_btn',
                                text: 'Monthly Report',
                                margin : '0 5 0 0',
                                iconCls : 'icon-excel',
                    			handler : function() {
                    				window.open('invoiceMonthlyReport.htm', '_blank');
                    			}
                            },{
                                xtype: 'button',
                                id: 'inv_report_btn',
                                text: 'Invoice Report',
                                margin : '0 5 0 0',
                                iconCls : 'icon-excel',
                    			handler : function() {
                    				window.open('invoiceReport.htm', '_blank');
                    			}
                            },{
                        		xtype : 'button',
                        		text : "Add Invoice",
                        		id : 'inv_add',
                        		iconCls : 'icon-add',
                        		handler : function() {
                        			Ext.getCmp('ainv_portal').setValue(1);
                        			var todayDate = new Date();
                        			var max_date = new Date(todayDate.getFullYear(), todayDate.getMonth()+1, 0);
                        			var min_date = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
                        			Ext.getCmp('ainv_bill_date').setValue(todayDate);
                        			Ext.getCmp('ainv_bill_date').setMinValue(min_date);
                        			Ext.getCmp('ainv_bill_date').setMaxValue(max_date);
                        			addInvoice.show();
                        		}
                        	});
            			}else{
            				grid.invoice.down('toolbar').add('->',{
                        		xtype : 'button',
                        		text : "Add Invoice",
                        		id : 'inv_add',
                        		iconCls : 'icon-add',
                        		handler : function() {
                        			Ext.getCmp('ainv_portal').setValue(1);
                        			var todayDate = new Date();
                        			var max_date = new Date(todayDate.getFullYear(), todayDate.getMonth()+1, 0);
                        			var min_date = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
                        			Ext.getCmp('ainv_bill_date').setValue(todayDate);
                        			Ext.getCmp('ainv_bill_date').setMinValue(min_date);
                        			Ext.getCmp('ainv_bill_date').setMaxValue(max_date);
                        			addInvoice.show();
                        		}
                        	});
            			}
            		}
            	});
//            	var bar = panel.tabBar;
//                bar.insert(2,[
//                    {
//                        xtype: 'component',
//                        flex: 1
//                    },
//                    {
//                        xtype: 'button',
//                        text: 'Report',
//                        margin : '0 5 0 0',
//                        iconCls : 'icon-excel',
//            			handler : function() {
//            				window.open('printInvoiceReport.htm', '_blank');
//            			}
//                    }                
//                ]);
            }
	    }
	});
	
	addInvoice = new Ext.create('Ext.window.Window', {
		title: 'Create Invoice',
		width: 450,
		animateTarget: 'inv_add',
		resizable: false,
		closeAction: 'hide',
		items: [{
			xtype: 'form',
			id: 'addInvoiceForm',
			items: [{
				xtype: 'fieldset',
				title: 'Invoice Information',
				defaultType: 'textfield',
				layout: 'anchor',
				padding: 10,
				width: 400,
				style: {
	                "margin-left": "auto",
	                "margin-right": "auto",
	                "margin-top": "10px",
	                "margin-bottom": "10px"
	            },
	            defaults: {
	                anchor: '100%'
	            },
	            items: [{
	            	xtype: 'combobox',
	            	fieldLabel: 'Company <font color="red">*</font> ',
	            	name: 'ainv_company_id',
	            	id: 'ainv_company_id',
	            	allowBlank: false,
	            	queryMode: 'local',
	            	msgTarget: 'under',
	            	labelWidth: 120,
	            	editable: false,
	            	emptyText: 'Company',
	            	store: {
	            		fields: ['inv_company_id','inv_company_name'],
	            		proxy: {
	            			type: 'ajax',
	            			url: 'showInvoiceCompany.htm',
	            			reader: {
	            				type: 'json',
	            				root: 'records',
	            				idProperty: 'inv_company_id'
	            			}
	            		},
	            		autoLoad: true,
	            		sorters: [{
	            			property: 'inv_company_id',
	            			direction: 'ASC'
	            		}]
	            	},
	            	valueField: 'inv_company_id',
	            	displayField: 'inv_company_name'
	            },{
	            	fieldLabel: 'Subject <font color="red">*</font> ',
	            	name: 'ainv_name',
	            	id: 'ainv_name',
	            	allowBlank: false,
	            	labelWidth: 120,
	            	msgTarget: 'under',
	            	emptyText: 'Subject'
	            },{
	            	fieldLabel: 'Project No. ',
	            	name: 'ainv_proj_no',
	            	id: 'ainv_proj_no',
	            	labelWidth: 120,
	            	msgTarget: 'under',
	            	emptyText: 'Project Number'
	            },{
	            	xtype: 'monthfield',
	            	fieldLabel : 'Delivery Date <font color="red">*</font> ',
					name : 'ainv_delivery_date',
					id : 'ainv_delivery_date',
					labelWidth : 120,
					format: 'm/y',
					value: new Date(),
					allowBlank: false,
					editable: false
	            },{
	            	xtype: 'datefield',
	            	fieldLabel : 'Billing Date <font color="red">*</font> ',
					name : 'ainv_bill_date',
					id : 'ainv_bill_date',
					labelWidth : 120,
					format: 'd/m/y',
					value: new Date(),
					allowBlank: false,
					editable: false
	            },{
					xtype : 'combobox',
					fieldLabel : 'Customer Name <font color="red">*</font> ',
					name : 'acus_name',
					id: 'acus_name',
					allowBlank: false,
					queryMode : 'local',
					msgTarget: 'under',
					labelWidth : 120,
					emptyText : 'Customer Name',
					store : {
						fields : [ 'cus_id', 'cus_name', 'cus_code', 'payment_terms' ],
						proxy : {
							type : 'ajax',
							url : 'showCustomer.htm',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'cus_id'
							}
						},
						autoLoad : true,
						sorters: [{
					         property: 'cus_name',
					         direction: 'ASC'
					     }]
					},
					valueField : 'cus_name',
					displayField : 'cus_name',
					listeners : {
						select : function() {
							
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var myValue = this.store.getAt(myIndex).data.cus_code;
							var myId = this.store.getAt(myIndex).data.cus_id;
							var myPayment = this.store.getAt(myIndex).data.payment_terms;
							Ext.getCmp('acus_id').setValue(myId);
							Ext.getCmp('acus_code').setValue(myValue);
							Ext.getCmp('ainv_payment_terms').setValue(myPayment);
							
							console.log("cus_code: "+myValue);
						},
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record !== false){
								var myIndex = this.store.indexOf(record);
								var myValue = this.store.getAt(myIndex).data.cus_code;
								var myId = this.store.getAt(myIndex).data.cus_id;
								var myPayment = this.store.getAt(myIndex).data.payment_terms;
								Ext.getCmp('acus_id').setValue(myId);
								Ext.getCmp('acus_code').setValue(myValue);
								Ext.getCmp('ainv_payment_terms').setValue(myPayment);
							}else{
								Ext.getCmp('acus_id').setValue("");
								Ext.getCmp('acus_name').setValue("");
								Ext.getCmp('acus_code').setValue("");
							}
						}

					}
				},{
					xtype : 'combobox',
					fieldLabel : 'Customer Code <font color="red">*</font> ',
					name : 'acus_code',
					id : 'acus_code',
					allowBlank: false,
					queryMode : 'local',
					labelWidth : 120,
					msgTarget: 'under',
					emptyText : 'Customer Code',
					store : {
						fields : [ 'cus_id', 'cus_code', 'cus_name', 'payment_terms' ],
						proxy : {
							type : 'ajax',
							url : 'showCustomer.htm',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'cus_id'
							}
						},
						autoLoad : true,
						sorters: [{
					         property: 'cus_code',
					         direction: 'ASC'
					     }]
					},
					valueField : 'cus_code',
					displayField : 'cus_code',
					listeners : {

						select : function() {
							
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var myValue = this.store.getAt(myIndex).data.cus_name;
							var myId = this.store.getAt(myIndex).data.cus_id;
							var myPayment = this.store.getAt(myIndex).data.payment_terms;
							Ext.getCmp('acus_id').setValue(myId);
							Ext.getCmp('acus_name').setValue(myValue);
							Ext.getCmp('ainv_payment_terms').setValue(myPayment);
							
							console.log("cus_name: "+myValue);
						},
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record !== false){
								var myIndex = this.store.indexOf(record);
								var myValue = this.store.getAt(myIndex).data.cus_name;
								var myId = this.store.getAt(myIndex).data.cus_id;
								var myPayment = this.store.getAt(myIndex).data.payment_terms;
								Ext.getCmp('acus_id').setValue(myId);
								Ext.getCmp('acus_name').setValue(myValue);
								Ext.getCmp('ainv_payment_terms').setValue(myPayment);
							}else{
								Ext.getCmp('acus_id').setValue("");
								Ext.getCmp('acus_code').setValue("");
								Ext.getCmp('acus_name').setValue("");
							}
						}

					}
				},{
					xtype : 'numberfield',
					fieldLabel : 'Payment Terms <font color="red">*</font> ',
					name : 'ainv_payment_terms',
					id : 'ainv_payment_terms',
					labelWidth : 120,
					value : 0,
					minValue : 0,
					msgTarget: 'under',
					allowBlank: false
				},{
					xtype : 'numberfield',
					fieldLabel : 'Vat(%) <font color="red">*</font> ',
					name : 'ainv_vat',
					id : 'ainv_vat',
					labelWidth : 120,
					value : 0,
					minValue : 0,
					msgTarget: 'under',
					allowBlank: false
				},{
					xtype: 'combobox',
					fieldLabel: 'Billing To <font color="red">*</font> ',
					name: 'ainv_bill_to',
					id: 'ainv_bill_to',
					labelWidth: 120,
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showDBReference.htm?kind=BillingTo&dept=-',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
					editable : false,
					value : 'Customer'
				},{
					xtype:'combobox',
	                fieldLabel: 'Currency <font color="red">*</font> ',
	                labelWidth: 120,
	                name: 'ainv_currency',
	                id: 'ainv_currency',
	                queryMode : 'local',
	    			labelWidth : 120,
	    			emptyText : 'Price Currency',
	    			editable : false,
	    			allowBlank: false,
	    			msgTarget : 'under',
	    			store : currency,
	    			valueField : 'currency',
	    			displayField : 'name',
				}]
			},{
				xtype: 'hidden',
				id: 'acus_id',
				name: 'acus_id'
			},{
				xtype: 'hidden',
				id: 'ainv_portal',
				name: 'ainv_portal'
			}]
		}],
		buttons: [{
			text: 'Create',
			width: 100,
			id: 'addInvoiceButton',
			handler: function(){
				var form = Ext.getCmp('addInvoiceForm').getForm();
				if (form.isValid()){
   				 form.submit({
   				 url: 'addInvoice.htm',
   				 waitTitle: 'Creating Invoice',
   				 waitMsg: 'Please wait...',
   				 standardSubmit: false,
                    success: function(form, action) {
                   	 Ext.MessageBox.show({
     						title: 'Information',
     						msg: "Inovoice Has Been Created!",
     						buttons: Ext.MessageBox.OK,
     						icon: Ext.MessageBox.INFO,
     						animateTarget: 'ajob_btn',
     						fn: function(){
     							addInvoice.hide();
     							store.invoice.reload();
     							Ext.getCmp('filterSearchField').setValue("");
     		                	store.invoice.clearFilter();
     						}
     					});
                       },
                       failure : function(form, action) {
//							Ext.Msg.alert('Failed',
//									action.result ? action.result.message
//											: 'No response');
                       	Ext.MessageBox.show({
			                    title: 'REMOTE EXCEPTION',
			                    msg: operation.getError(),
			                    icon: Ext.MessageBox.ERROR,
			                    buttons: Ext.Msg.OK,
			                    fn: function(){location.reload()}
			                });
						}
         			});
           	 }else {
   					Ext.MessageBox.show({
   						title: 'Failed',
   						msg: ' Please Insert All Required Field',
   						buttons: Ext.MessageBox.OK,
   						icon: Ext.MessageBox.ERROR,
   						animateTarget: 'abtn',
   					});
   				}
			}
		},{
			text: 'Reset',
			width: 100,
			handler: function(){
				Ext.getCmp('addInvoiceForm').getForm().reset();
			}
		}],
		listeners: {
			'beforehide': function() {
				Ext.getCmp('addInvoiceForm').getForm().reset();
			}
		}
	});
	
	editInvoice = new Ext.create('Ext.window.Window', {
		title: 'Edit Invoice',
		width: 450,
		animateTarget: 'inv_edit',
		resizable: false,
		closeAction: 'hide',
		items: [{
			xtype: 'form',
			id: 'editInvoiceForm',
			items: [{
				xtype: 'fieldset',
				title: 'Invoice Information',
				defaultType: 'textfield',
				layout: 'anchor',
				padding: 10,
				width: 400,
				style: {
	                "margin-left": "auto",
	                "margin-right": "auto",
	                "margin-top": "10px",
	                "margin-bottom": "10px"
	            },
	            defaults: {
	                anchor: '100%'
	            },
	            items: [{
	            	fieldLabel: 'Subject <font color="red">*</font> ',
	            	name: 'einv_name',
	            	id: 'einv_name',
	            	allowBlank: false,
	            	labelWidth: 120,
	            	msgTarget: 'under',
	            	emptyText: 'Subject'
	            },{
	            	fieldLabel: 'Project No. ',
	            	name: 'einv_proj_no',
	            	id: 'einv_proj_no',
	            	labelWidth: 120,
	            	msgTarget: 'under',
	            	emptyText: 'Project Number'
	            },{
	            	xtype: 'monthfield',
	            	fieldLabel : 'Delivery Date <font color="red">*</font> ',
					name : 'einv_delivery_date',
					id : 'einv_delivery_date',
					labelWidth : 120,
					format: 'm/y',
					allowBlank: false,
					editable: false,
//					listener: {
//						"select": function(){
//							console.log("change devilery date!!");
//							var delivery_date = Ext.getCmp('einv_delivery_date').getValue();
//							var max_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth()+1, 0).toString();
//							var min_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth(), 1).toString();
//							Ext.getCmp('einv_bill_date').setValue('');
//							Ext.getCmp('einv_bill_date').setMinValue(min_date);
//							Ext.getCmp('einv_bill_date').setMaxValue(max_date);
//							console.log("change devilery date!!");
//						}
//					}
	            },{
	            	xtype: 'datefield',
	            	fieldLabel : 'Billing Date <font color="red">*</font> ',
					name : 'einv_bill_date',
					id : 'einv_bill_date',
					labelWidth : 120,
					format: 'd/m/y',
					allowBlank: false,
					editable: false,
					onExpand: function(){
		                var value = this.up('form').down('datefield[name=einv_bill_date]').getValue();
		                this.picker.setValue(Ext.isDate(value) ? value : new Date());
		            }
	            },{
					xtype : 'combobox',
					fieldLabel : 'Customer Name <font color="red">*</font> ',
					name : 'ecus_name',
					id: 'ecus_name',
					allowBlank: false,
					queryMode : 'local',
					msgTarget: 'under',
					labelWidth : 120,
					emptyText : 'Customer Name',
					store : {
						fields : [ 'cus_id', 'cus_name', 'cus_code', 'payment_terms' ],
						proxy : {
							type : 'ajax',
							url : 'showCustomer.htm',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'cus_id'
							}
						},
						autoLoad : true,
						sorters: [{
					         property: 'cus_name',
					         direction: 'ASC'
					     }]
					},
					valueField : 'cus_name',
					displayField : 'cus_name',
					listeners : {

						select : function() {
							
							Ext.MessageBox.show({
	     						title: 'Warning',
	     						msg: 'All item will be deleted if you change customer!',
	     						buttons: Ext.MessageBox.OK,
	     						icon: Ext.MessageBox.WARNING,
	     						animateTarget: 'ecus_name'
							});
							
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var myValue = this.store.getAt(myIndex).data.cus_code;
							var myId = this.store.getAt(myIndex).data.cus_id;
							var myPayment = this.store.getAt(myIndex).data.payment_terms;
							Ext.getCmp('ecus_id').setValue(myId);
							Ext.getCmp('ecus_code').setValue(myValue);
							Ext.getCmp('epayment_terms').setValue(myPayment);
							
							console.log("cus_code: "+myValue);
						}
					}
				}, {
					xtype : 'combobox',
					fieldLabel : 'Customer Code <font color="red">*</font> ',
					name : 'ecus_code',
					id : 'ecus_code',
					allowBlank: false,
					queryMode : 'local',
					labelWidth : 120,
					msgTarget: 'under',
					emptyText : 'Customer Code',
					store : {
						fields : [ 'cus_id', 'cus_code', 'cus_name', 'payment_terms' ],
						proxy : {
							type : 'ajax',
							url : 'showCustomer.htm',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'cus_id'
							}
						},
						autoLoad : true,
						sorters: [{
					         property: 'cus_code',
					         direction: 'ASC'
					     }]
					},
					valueField : 'cus_code',
					displayField : 'cus_code',
					listeners : {

						select : function() {
							
							Ext.MessageBox.show({
	     						title: 'Warning',
	     						msg: 'All item will be deleted if you change customer!',
	     						buttons: Ext.MessageBox.OK,
	     						icon: Ext.MessageBox.WARNING,
	     						animateTarget: 'ecus_code'
							});
							
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var myValue = this.store.getAt(myIndex).data.cus_name;
							var myId = this.store.getAt(myIndex).data.cus_id;
							var myPayment = this.store.getAt(myIndex).data.payment_terms;
							Ext.getCmp('ecus_id').setValue(myId);
							Ext.getCmp('ecus_name').setValue(myValue);
							Ext.getCmp('epayment_terms').setValue(myPayment);
							
							console.log("cus_name: "+myValue);
						}
					}
				},{
					xtype : 'numberfield',
					fieldLabel : 'Payment Terms <font color="red">*</font> ',
					name : 'einv_payment_terms',
					id : 'einv_payment_terms',
					labelWidth : 120,
					value : 0,
					minValue : 0,
					msgTarget: 'under',
					allowBlank: false
				},{
					xtype : 'numberfield',
					fieldLabel : 'Vat(%) <font color="red">*</font> ',
					name : 'einv_vat',
					id : 'einv_vat',
					labelWidth : 120,
					value : 0,
					minValue : 0,
					msgTarget: 'under',
					allowBlank: false
				},{
					xtype: 'combobox',
					fieldLabel: 'Billing To <font color="red">*</font> ',
					name: 'einv_bill_to',
					id: 'einv_bill_to',
					labelWidth: 120,
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showDBReference.htm?kind=BillingTo&dept=-',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
					editable : false,
//					value : 'Customer'
				},{
					xtype:'combobox',
	                fieldLabel: 'Currency <font color="red">*</font> ',
	                labelWidth: 120,
	                name: 'einv_currency',
	                id: 'einv_currency',
	                queryMode : 'local',
	    			labelWidth : 120,
	    			emptyText : 'Price Currency',
	    			editable : false,
	    			allowBlank: false,
	    			msgTarget : 'under',
	    			store : currency,
	    			valueField : 'currency',
	    			displayField : 'name',
				}]
			},{
				xtype: 'hidden',
				id: 'ecus_id',
				name: 'ecus_id'
			},{
				xtype: 'hidden',
				id: 'einv_id',
				name: 'einv_id'
			}]
		}],
		buttons: [{
			text: 'Update',
			width: 100,
			id: 'updateInvoiceButton',
			handler: function(){
				var form = Ext.getCmp('editInvoiceForm').getForm();
				Ext.Ajax.request({
					url : 'searchInvoiceParam.htm?inv_id='+Ext.getCmp('einv_id').getValue(),
					success : function(response, opts) {
						if(form.isValid()){
			   				 form.submit({
			   				 url: 'updateInvoice.htm',
			   				 waitTitle: 'Updating Invoice',
			   				 waitMsg: 'Please wait...',
			   				 standardSubmit: false,
			                    success: function(form, action) {
			                   	 Ext.MessageBox.show({
			     						title: 'Information',
			     						msg: 'Invoice Has Been Update!',
			     						buttons: Ext.MessageBox.OK,
			     						icon: Ext.MessageBox.INFO,
			     						animateTarget: 'updateInvoiceButton',
			     						fn: function(){
			     							if(editPosition == 0){
				     							editInvoice.hide();
				     							store.invoice.reload();
				     							Ext.getCmp('detailTabs').setDisabled(true);
												Ext.getCmp('detailTabs').setTitle("Detail");
				     							Ext.getCmp('filterSearchField').setValue("");
				      		                	store.invoice.clearFilter();
			     							}else if(editPosition == 1){
			     								editForm = Ext.getCmp('editInvoiceForm').getForm();
			     								inv_name = editForm.getValues().einv_name;
			     								inv_proj_no = editForm.getValues().einv_proj_no;
			     								inv_delivery_date = Ext.getCmp('einv_delivery_date').getValue();
			     								cus_id = Ext.getCmp('ecus_id').getValue();
			     								cus_name = editForm.getValues().ecus_name;
			     								cus_code = editForm.getValues().ecus_code;
			     								inv_payment_terms = Ext.getCmp('einv_payment_terms').getValue();
			     								inv_vat = Ext.getCmp('einv_vat').getValue();
//			     								inv_bill_type = editForm.getValues().einv_bill_type;
			     								inv_bill_date = Ext.getCmp('einv_bill_date').getValue();
			     								inv_bill_to = editForm.getValues().einv_bill_to;
			     								inv_currency = editForm.getValues().einv_currency;
			     								
			     								if(cus_id != Ext.getCmp('dcus_id').getValue()){
			     									console.log("Change Customer!");
//			     									store.invoiceRef.removeAll();
			     									var aproj_id = Ext.getCmp('aproj_id');
			     									aproj_id.clearValue();
			     									aproj_id.getStore().removeAll();
			     									aproj_id.getStore().load({
			     										url: 'showProjects.htm?type=inv&id='+cus_id
			     									});
			     									
			     									var eproj_id = Ext.getCmp('eproj_id');
			     									eproj_id.clearValue();
			     									eproj_id.getStore().removeAll();
			     									eproj_id.getStore().load({
			     										url: 'showProjects.htm?type=inv&id='+cus_id
			     									});
			     								}
			     								
			     								Ext.getCmp('dinv_name').setValue(inv_name);
			     								Ext.getCmp('dinv_proj_no').setValue(inv_proj_no);
			     								Ext.getCmp('dinv_delivery_date').setValue(inv_delivery_date);
			     								Ext.getCmp('dcus_id').setValue(cus_id);
			     								Ext.getCmp('dcus_name').setValue(cus_name);
			     								Ext.getCmp('dcus_code').setValue(cus_code);
			     								Ext.getCmp('dinv_payment_terms').setValue(inv_payment_terms + " days net");
			     								Ext.getCmp('dinv_vat').setValue(inv_vat);
//			     								Ext.getCmp('dinv_bill_type').setValue(inv_bill_type);
			     								Ext.getCmp('dinv_bill_date').setValue(inv_bill_date);
			     								Ext.getCmp('dinv_bill_to').setValue(inv_bill_to);
			     								Ext.getCmp('dinv_currency').setValue(inv_currency);
			     								editInvoice.hide();
			     								store.invoice.reload();
			     								store.invoiceRef.reload();
			     								Ext.getCmp('detailTabs').setTitle(inv_name);
			     							}
			     						}
			     					});
			                       },
			                       failure : function(form, action) {
			                       	Ext.MessageBox.show({
						                    title: 'REMOTE EXCEPTION',
						                    msg: operation.getError(),
						                    icon: Ext.MessageBox.ERROR,
						                    buttons: Ext.Msg.OK,
						                    fn: function(){location.reload()}
						                });
									}
			         			});
			           	 }else {
			   					Ext.MessageBox.show({
			   						title: 'Failed',
			   						msg: ' Please Insert All Required Field',
			   						buttons: Ext.MessageBox.OK,
			   						icon: Ext.MessageBox.ERROR,
			   						animateTarget: 'ebtn',
			   					});
			   				}
					}
				});
			}
		},{
			text: 'Reset',
			width: 100,
			handler: function(){
				Ext.getCmp('editInvoiceForm').getForm().reset();
			}
		}],
		listeners: {
			'beforehide': function() {
				Ext.getCmp('editInvoiceForm').getForm().reset();
			}
		}
	});
}); //end on ready

Ext.define('invoiceModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'inv_id',
		type: 'int'
	},{
		name: 'inv_number',
		type: 'string'
	},{
		name: 'inv_name',
		type: 'string'
	},{
		name: 'inv_company_id',
		type: 'int'
	},{
		name: 'inv_proj_no',
		type: 'string'
	},{
		name: 'inv_bill_date',
		type: 'date',
		dateFormat: 'Y-m-d'
	},{
		name: 'inv_delivery_date',
		type: 'date',
		dateFormat: 'Y-m-d'
	},{
		name: 'inv_payment_terms',
		type: 'int'
	},{
		name: 'inv_vat',
		type: 'double'
	},{
		name: 'inv_bill_type',
		type: 'string'
	},{
		name: 'cus_id',
		type: 'int'
	},{
		name: 'cretd_usr',
		type: 'int'
	},{
		name: 'cretd_date',
		type: 'datetime',
		dateFormat: 'Y-m-d H:i:s'
	},{
		name: 'update_date',
		type: 'datetime',
		dateFormat: 'Y-m-d H:i:s'
	},{
		name: 'inv_company_name',
		type: 'string'
	},{
		name: 'inv_company_code',
		type: 'string'
	},{
		name: 'cus_name',
		type: 'string'
	},{
		name: 'cus_code',
		type: 'string'
	},{
		name: 'usr_name',
		type: 'string'
	},{
		name: 'total_inv_price',
		type: 'double'
	},{
		name: 'inv_ref_currency',
		type: 'string'
	},{
		name: 'count_tpx',
		type: 'int'
	},{
		name: 'topix_cus_id',
		type: 'string'
	},{
		name: 'inv_currency',
		type: 'string'
	},{
		name: 'inv_bill_to',
		type: 'string'
	}]
});

store.invoice = Ext.create('Ext.data.JsonStore', {
	model : 'invoiceModel',
	id : 'invoiceStore',
	pageSize : 999,
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'searchInvoice.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'inv_id',
			totalProperty : 'total'
		}
	},
	sorters: [{
        property: 'inv_bill_date',
        direction: 'DESC'
    }],
	listeners: {
		load: function(){
			setTimeout(function(){
          		Ext.getCmp('inv_total').setText('<b>Total Invoices : '+store.invoice.count()+'</b>&nbsp;&nbsp;&nbsp;');
          	},500);
			try {
				var record = store.invoice.findRecord('inv_id',Ext.getCmp('dinv_id').getValue());
				var myIndex = store.invoice.indexOf(record);
				var total_price = store.invoice.getAt(myIndex).data.total_inv_price;
				var currency = store.invoice.getAt(myIndex).data.inv_currency;
				var sum_price = Ext.util.Format.number(total_price, '0,000.##');
				store.invoiceRef.reload();
				setTimeout(function(){
	          		Ext.getCmp('invRef_tbar').setText('<b>Total Price : '+sum_price+' '+currency+'</b>');
	          	},500);
			} catch (err){
				console.log(err.message);
			}
		}
	}
});

Ext.define('invoiceRefModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'inv_ref_id',
		type: 'int'
	},{
		name: 'inv_id',
		type: 'int'
	},{
		name: 'proj_ref_id',
		type: 'int'
	},{
		name: 'inv_itm_name',
		type: 'string'
	},{
		name: 'inv_ref_price',
		type: 'float'
	},{
		name: 'inv_ref_qty',
		type: 'float'
	},{
		name: 'inv_ref_currency',
		type: 'string'
	},{
		name: 'inv_ref_desc',
		type: 'string'
	},{
		name: 'order_by',
		type: 'int'
	},{
		name: 'cretd_usr',
		type: 'int'
	},{
		name: 'cretd_date',
		type: 'date',
		dateFormat: 'Y-m-d H:i:s'
	},{
		name: 'update_date',
		type: 'date',
		dateFormat: 'Y-m-d H:i:s'
	},{
		name: 'total_amount',
		type: 'double'
	},{
		name: 'proj_id',
		type: 'int'
	},{
		name: 'proj_name',
		type: 'string'
	},{
		name: 'topix_article_id',
		type: 'string'
	},{
		name: 'proj_currency',
		type: 'string'
	},{
		name: 'inv_currency',
		type: 'string'
	}]
});

store.invoiceRef = Ext.create('Ext.data.JsonStore', {
	model : 'invoiceRefModel',
	id : 'invoiceRefStore',
	pageSize : 999,
//	autoLoad : true,
	proxy : {
		type : 'ajax',
		api: {
			read : 'searchInvoiceReference.htm',
			update : 'updateInvoiceReferenceBatch.htm'
		},
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'inv_ref_id',
			totalProperty : 'total'
		},
		writer: {
            type: 'json',
            root: 'data',
            encode: true,
            writeAllFields: true,
        },
	},
	listeners: {
        write: function(proxy, operation){
            if(operation.action == 'update'){
            	Ext.MessageBox.show({
						title: 'Information',
						msg: 'Item Has Been Update!',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO,
						animateTarget: 'invRefSync',
						fn: function(){
							store.invoiceRef.reload();
							store.invoice.reload();
							}
					});
            }
            
        },
        load: function(proxy, operation){
        	var inv_status = Ext.getCmp('dinv_bill_type').getValue();
        	if(store.invoiceRef.count() == 0){
        		Ext.getCmp('angeboteButton').setDisabled(true);
	        	Ext.getCmp('directButton').setDisabled(true);
	        	Ext.getCmp('creditNoteButton').setDisabled(true);
        		Ext.getCmp('printInvoiceButton').setDisabled(true);
        	}else if(inv_status !== "Direct" && inv_status !== "Angebote" && inv_status !== "Credit Note" && store.invoiceRef.count() !== 0){
	        	Ext.getCmp('angeboteButton').setDisabled(false);
	        	Ext.getCmp('directButton').setDisabled(false);
	        	Ext.getCmp('creditNoteButton').setDisabled(false);
	        	Ext.getCmp('printInvoiceButton').setDisabled(true);
			}else{
				Ext.getCmp('angeboteButton').setDisabled(true);
				Ext.getCmp('directButton').setDisabled(true);
				Ext.getCmp('creditNoteButton').setDisabled(true);
				Ext.getCmp('printInvoiceButton').setDisabled(false);
			}
    	}
	}
});

Ext.Ajax.useDefaultXhrHeader = false;

Ext.define('exModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'USD',
		type : 'float'
	}, {
		name : 'EUR',
		type : 'float'
	}, {
		name : 'THB',
		type : 'float'
	}, {
		name : 'AUD',
		type : 'float'
	}, {
		name : 'GBP',
		type : 'float'
	}, {
		name : 'CHF',
		type : 'float'
	}

	]
});

store.exchangeRates = Ext.create('Ext.data.JsonStore', {
	model: 'exModel',
	id : 'exStore',
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'https://openexchangerates.org/api/latest.json?app_id=70ee2e9a9f814ea0a36bd0a00a11272c&base=EUR',
		reader : {
			type : 'json',
			root : 'rates',
		}
	},
	listeners: {
		load : function(){
			Ext.Ajax.request({
				url : 'invoiceCurrencyParam.htm?AUD='+store.exchangeRates.getAt(0).data.AUD+'&CHF='+store.exchangeRates.getAt(0).data.CHF+
				'&GBP='+store.exchangeRates.getAt(0).data.GBP+'&THB='+store.exchangeRates.getAt(0).data.THB+
				'&EUR='+store.exchangeRates.getAt(0).data.EUR+'&USD='+store.exchangeRates.getAt(0).data.USD,
				success : function(response, opts) {}
			});
		}
	}
});

var currency = Ext.create('Ext.data.Store', {
    fields: ['currency','name'],
    data : [
        {"currency":"AUD", "name":"Australian Dollar[AUD]"},
        {"currency":"CHF", "name":"Swiss Franc[CHF]"},
        {"currency":"EUR", "name":"Euro[EUR]"},
        {"currency":"GBP", "name":"British Pound[GBP]"},
        {"currency":"THB", "name":"Thai Bath[THB]"},
        {"currency":"USD", "name":"US Dollar[USD]"}
    ]
});

grid.invoice = Ext.create('Ext.ux.LiveFilterGridPanel', {
	store: store.invoice,
	id: 'invoiceGrid',
	columnLines: true,
    stripeRows: true,
	indexes: ['inv_number','inv_name','cus_name'],
	height: 652,
	columns: [{
		text: '!',
		xtype : 'actioncolumn',
		flex : 0.33,
		align : 'center',
		id : 'inv_go',
		items : [{
			iconCls : 'icon-go',
			handler : function(grid, rowIndex, colIndex) {
				inv_id = grid.getStore().getAt(rowIndex).get('inv_id');
				inv_name = grid.getStore().getAt(rowIndex).get('inv_name');
				inv_proj_no = grid.getStore().getAt(rowIndex).get('inv_proj_no');
				inv_delivery_date = grid.getStore().getAt(rowIndex).get('inv_delivery_date');
				inv_company_id = grid.getStore().getAt(rowIndex).get('inv_company_id');
				inv_company_name = grid.getStore().getAt(rowIndex).get('inv_company_name');
				cus_id = grid.getStore().getAt(rowIndex).get('cus_id');
				cus_name = grid.getStore().getAt(rowIndex).get('cus_name');
				cus_code = grid.getStore().getAt(rowIndex).get('cus_code');
				inv_payment_terms = grid.getStore().getAt(rowIndex).get('inv_payment_terms');
				inv_vat = grid.getStore().getAt(rowIndex).get('inv_vat');
				inv_bill_type = grid.getStore().getAt(rowIndex).get('inv_bill_type');
				inv_bill_date = grid.getStore().getAt(rowIndex).get('inv_bill_date');
				inv_number = grid.getStore().getAt(rowIndex).get('inv_number');
				inv_bill_to = grid.getStore().getAt(rowIndex).get('inv_bill_to');
				inv_currency = grid.getStore().getAt(rowIndex).get('inv_currency');
				
				Ext.getCmp('invid').setValue(inv_id);
				Ext.getCmp('dinv_id').setValue(inv_id);
				Ext.getCmp('dinv_name').setValue(inv_name);
				Ext.getCmp('dinv_proj_no').setValue(inv_proj_no);
				Ext.getCmp('dinv_delivery_date').setValue(inv_delivery_date);
				Ext.getCmp('dinv_bill_date').setValue(inv_bill_date);
				Ext.getCmp('dinv_company_id').setValue(inv_company_id);
				Ext.getCmp('dinv_company_name').setValue(inv_company_name);
				Ext.getCmp('dcus_id').setValue(cus_id);
				Ext.getCmp('dcus_name').setValue(cus_name);
				Ext.getCmp('dcus_code').setValue(cus_code);
				Ext.getCmp('dinv_payment_terms').setValue(inv_payment_terms + ' days net');
				Ext.getCmp('dinv_vat').setValue(inv_vat);
				Ext.getCmp('dinv_bill_type').setValue(inv_bill_type);
				Ext.getCmp('dinv_number').setValue(inv_number);
				Ext.getCmp('dinv_bill_to').setValue(inv_bill_to);
				Ext.getCmp('dinv_currency').setValue(inv_currency);
				
				var aproj_id = Ext.getCmp('aproj_id');
				aproj_id.clearValue();
				aproj_id.getStore().removeAll();
				aproj_id.getStore().load({
					url: 'showProjects.htm?type=inv&id='+cus_id
				});
				
				var eproj_id = Ext.getCmp('eproj_id');
				eproj_id.clearValue();
				eproj_id.getStore().removeAll();
				eproj_id.getStore().load({
					url: 'showProjects.htm?type=inv&id='+cus_id
				});
				
//				Ext.apply(store.invoiceRef.getProxy().api,{read: 'searchInvoiceReference.htm?inv_id='+inv_id});
				Ext.apply(store.invoiceRef.getProxy().extraParams,{'inv_id': inv_id});
				store.invoiceRef.loadPage(1);
				Ext.getCmp('detailTabs').setDisabled(false);
				Ext.getCmp('detailTabs').setTitle(inv_name);
				panel.tabs.setActiveTab('detailTabs');
				
//				Ext.Ajax.request({
//					url : 'searchInvoiceParam.htm?inv_id='+inv_id,
//					success : function(response, opts) {
//						store.invoiceRef.loadPage(1);
//						Ext.getCmp('detailTabs').setDisabled(false);
//						Ext.getCmp('detailTabs').setTitle(inv_name);
//						panel.tabs.setActiveTab('detailTabs');
//					}
//				});
				
			}
		}]
	},{
		text: 'Number',
		flex: 0.4,
		sortable: true,
		dataIndex: 'inv_number'
	},{
		text: 'Subject',
		flex: 1.2,
		sortable: true,
		dataIndex: 'inv_name'
	},{
		text : "Customer Name",
    	flex : 1,
    	sortable : true,
    	dataIndex : 'cus_name',
//    	renderer: customerCombine
	},{
		text: 'Customer Code',
		flex: 0.4,
		sortable: true,
		dataIndex: 'cus_code',
		align : 'center',
	},{
		text: 'Total Price',
		flex: 0.4,
		sortable: true,
		dataIndex: 'total_inv_price',
		align : 'right',
		renderer: roundDecimal
	},{
    	text : 'Edit',
		xtype : 'actioncolumn',
		flex : 0.3,
		align : 'center',
		id : 'inv_edit',
		items : [{
			iconCls : 'table-edit',
			handler : function(grid, rowIndex, colIndex) {
				inv_id = grid.getStore().getAt(rowIndex).get('inv_id');
				inv_name = grid.getStore().getAt(rowIndex).get('inv_name');
				inv_proj_no = grid.getStore().getAt(rowIndex).get('inv_proj_no');
				inv_delivery_date = grid.getStore().getAt(rowIndex).get('inv_delivery_date');
				inv_company_id = grid.getStore().getAt(rowIndex).get('inv_company_id');
				cus_id = grid.getStore().getAt(rowIndex).get('cus_id');
				cus_name = grid.getStore().getAt(rowIndex).get('cus_name');
				cus_code = grid.getStore().getAt(rowIndex).get('cus_code');
				inv_payment_terms = grid.getStore().getAt(rowIndex).get('inv_payment_terms');
				inv_vat = grid.getStore().getAt(rowIndex).get('inv_vat');
//				inv_bill_type = grid.getStore().getAt(rowIndex).get('inv_bill_type');
				inv_bill_date = grid.getStore().getAt(rowIndex).get('inv_bill_date');
				inv_bill_to = grid.getStore().getAt(rowIndex).get('inv_bill_to');
				inv_currency = grid.getStore().getAt(rowIndex).get('inv_currency');
				
				min_year = new Date(inv_delivery_date.getFullYear(), 0, 1);
				max_year = new Date(inv_delivery_date.getFullYear()+1, 0, 0);
				inv_year = inv_delivery_date.getFullYear();
				
				editPosition = 0;
				
				Ext.getCmp('einv_id').setValue(inv_id);
				Ext.getCmp('einv_name').setValue(inv_name);
				Ext.getCmp('einv_proj_no').setValue(inv_proj_no);
				Ext.getCmp('einv_delivery_date').setValue(inv_delivery_date);
//				Ext.getCmp('einv_delivery_date').setMinValue(min_year);
//				Ext.getCmp('einv_delivery_date').setMaxValue(max_year);
				Ext.getCmp('einv_bill_date').setValue(inv_bill_date);
//				Ext.getCmp('einv_company_id').setValue(inv_company_id);
				Ext.getCmp('ecus_id').setValue(cus_id);
				Ext.getCmp('ecus_name').setValue(cus_name);
				Ext.getCmp('ecus_code').setValue(cus_code);
				Ext.getCmp('einv_payment_terms').setValue(inv_payment_terms);
				Ext.getCmp('einv_vat').setValue(inv_vat);
//				Ext.getCmp('einv_bill_type').setValue(inv_bill_type);
				Ext.getCmp('einv_bill_to').setValue(inv_bill_to);
				Ext.getCmp('einv_currency').setValue(inv_currency);
				editInvoice.show();
			}
		}]
	},{
		text : 'Delete',
		xtype : 'actioncolumn',
		flex : 0.3,
		align : 'center',
		id : 'inv_del',
		hidden : true,
		items : [ {
			iconCls : 'icon-delete',
			handler : function(grid, rowIndex, colIndex) {
				inv_id = grid.getStore().getAt(rowIndex).get('inv_id');
				inv_number = grid.getStore().getAt(rowIndex).get('inv_number');
				if(inv_number == ""){
					Ext.getCmp('invid_del').setValue(inv_id);
					Ext.MessageBox.show({
						title : 'Confirm',
						msg : 'Are you sure you want to delete this?',
						buttons : Ext.MessageBox.YESNO,
						animateTarget : 'inv_del',
						fn : confirmChk,
						icon : Ext.MessageBox.QUESTION
					});
				}else{
					Ext.MessageBox.show({
						title : 'Information',
						msg : 'Cannot delete assigned invoice!',
						width: 270,
						buttons : Ext.MessageBox.OK,
						animateTarget : 'inv_del',
						icon : Ext.MessageBox.ERROR
					});
				}
			}
		}]
	}],
	listeners : {
	    itemdblclick: function(dv, record, item, index, e) {
	    	inv_id = dv.getStore().getAt(index).get('inv_id');
			inv_name = dv.getStore().getAt(index).get('inv_name');
			inv_proj_no = dv.getStore().getAt(index).get('inv_proj_no');
			inv_delivery_date = dv.getStore().getAt(index).get('inv_delivery_date');
			inv_company_id = dv.getStore().getAt(index).get('inv_company_id');
			inv_company_name = dv.getStore().getAt(index).get('inv_company_name');
			cus_id = dv.getStore().getAt(index).get('cus_id');
			cus_name = dv.getStore().getAt(index).get('cus_name');
			cus_code = dv.getStore().getAt(index).get('cus_code');
			inv_payment_terms = dv.getStore().getAt(index).get('inv_payment_terms');
			inv_vat = dv.getStore().getAt(index).get('inv_vat');
			inv_bill_type = dv.getStore().getAt(index).get('inv_bill_type');
			inv_bill_date = dv.getStore().getAt(index).get('inv_bill_date');
			inv_number = dv.getStore().getAt(index).get('inv_number');
			inv_bill_to = dv.getStore().getAt(index).get('inv_bill_to');
			inv_currency = dv.getStore().getAt(index).get('inv_currency');
			
			Ext.getCmp('invid').setValue(inv_id);
			Ext.getCmp('dinv_id').setValue(inv_id);
			Ext.getCmp('dinv_name').setValue(inv_name);
			Ext.getCmp('dinv_proj_no').setValue(inv_proj_no);
			Ext.getCmp('dinv_delivery_date').setValue(inv_delivery_date);
			Ext.getCmp('dinv_bill_date').setValue(inv_bill_date);
			Ext.getCmp('dinv_company_id').setValue(inv_company_id);
			Ext.getCmp('dinv_company_name').setValue(inv_company_name);
			Ext.getCmp('dcus_id').setValue(cus_id);
			Ext.getCmp('dcus_name').setValue(cus_name);
			Ext.getCmp('dcus_code').setValue(cus_code);
			Ext.getCmp('dinv_payment_terms').setValue(inv_payment_terms);
			Ext.getCmp('dinv_vat').setValue(inv_vat);
			Ext.getCmp('dinv_bill_type').setValue(inv_bill_type);
			Ext.getCmp('dinv_number').setValue(inv_number);
			Ext.getCmp('dinv_bill_to').setValue(inv_bill_to);
			Ext.getCmp('dinv_currency').setValue(inv_currency);
			
			var aproj_id = Ext.getCmp('aproj_id');
			aproj_id.clearValue();
			aproj_id.getStore().removeAll();
			aproj_id.getStore().load({
				url: 'showProjects.htm?type=inv&id='+cus_id
			});
			
			var eproj_id = Ext.getCmp('eproj_id');
			eproj_id.clearValue();
			eproj_id.getStore().removeAll();
			eproj_id.getStore().load({
				url: 'showProjects.htm?type=inv&id='+cus_id
			});
			
			Ext.apply(store.invoiceRef.getProxy().extraParams,{'inv_id': inv_id});
			store.invoiceRef.loadPage(1);
			Ext.getCmp('detailTabs').setDisabled(false);
			Ext.getCmp('detailTabs').setTitle(inv_name);
			panel.tabs.setActiveTab('detailTabs');
			
//			Ext.Ajax.request({
//				url : 'searchInvoiceParam.htm?inv_id='+inv_id,
//				success : function(response, opts) {
//					store.invoiceRef.loadPage(1);
//					Ext.getCmp('detailTabs').setDisabled(false);
//					Ext.getCmp('detailTabs').setTitle(inv_name);
//					panel.tabs.setActiveTab('detailTabs');
//				}
//			});
	    }
	}
});

grid.invoiceDetail = Ext.create('Ext.grid.Panel', {
	id: 'detailGrid',
	title: 'Invoice Item',
	store : store.invoiceRef,
	height: 360,
	columnLines: true,
//	tools: [ {
//		xtype : 'button',
//		text : 'Add Item',
//		id : 'addInvoiceItemButton',
//		iconCls : 'icon-add',
//		handler : function() {
//			var inv_id = Ext.getCmp('dinv_id').getValue();
//			Ext.getCmp('ainv_id').setValue(inv_id);
//			addInvoiceItem.show();
//		}
//	} ],
	tbar: [
	       {
		xtype : 'button',
		text : 'Add Item',
		id : 'addInvoiceItemButton',
		iconCls : 'icon-add',
		handler : function() {
			Ext.Msg.show({
                title : 'Invoice',
                msg : 'How do you want to add? ',
                width : 270,
                closable : true,
                buttons : Ext.Msg.YESNO,
                animateTarget: 'addInvoiceItemButton',
                icon : Ext.Msg.QUESTION,
                buttonText : 
                {
                    yes : 'Add New',
                    no : 'Select From Jobs',
//                    cancel : 'Cancel'
                },
                multiline : false,
                fn : function(buttonValue, inputText, showConfig){
                	if(buttonValue == "yes"){
                		var inv_id = Ext.getCmp('dinv_id').getValue();
                		var inv_currency = Ext.getCmp('dinv_currency').getValue();
            			Ext.getCmp('ainv_id').setValue(inv_id);
            			Ext.getCmp('ainv_ref_currency').setValue(inv_currency);
            			Ext.getCmp('dinv_ref_currency').setValue(inv_currency);
            			addInvoiceItem.show();
                	}else if(buttonValue == "no"){
                		var cus_id = Ext.getCmp('dcus_id').getValue();
                		var inv_id = Ext.getCmp('dinv_id').getValue();
                		var ajob_name = Ext.getCmp('aeinv_job_name');
                		ajob_name.clearValue();
                		ajob_name.getStore().removeAll();
                		ajob_name.getStore().load({
							url: 'showJobForInvoice.htm?cus_id='+cus_id
						});
                		Ext.getCmp('aejob_inv_id').setValue(inv_id);
                		addInvoiceItemFromJobs.show();
                	}
                }
            });
			
		}
	},
	'->',{
		xtype: 'tbtext',
		id: 'invRef_tbar',
        text: 'Loading ...'
	},{xtype: 'tbspacer', width: 5},
	{
		xtype: 'button',
		text: 'Save All',
		id: 'invRefSync',
		iconCls: 'icon-save',
		handler: function(){
			store.invoiceRef.sync();
		}
	}],
	columns: [
//	    {
//			xtype: 'rownumberer'
		{
			hideable : false,
			flex : 0.3,
			dataIndex: 'order_by',
			editor: {
				xtype: 'numberfield',
				id: 'gorder_by',
		    	name: 'gorder_by',
		    	hideTrigger: true,
			}
		},{
			text : "Topix ID",
			flex : 0.7,
			dataIndex: 'topix_article_id',
			align : 'center'
		},{
			text : "Item Name",
			flex : 2.5,
			sortable : true,
//			hidden : true,
			dataIndex : 'inv_itm_name',
//			editor: {
//				xtype: 'combobox',
//				id: 'edit_itm_invRef',
//				store : {
//					fields : [ 'proj_ref_id', 'itm_name', 'proj_ref_desc', 'price', 'currency'],
//					proxy : {
//						type : 'ajax',
//						url : '',
//						reader : {
//							type : 'json',
//							root : 'records',
//							idProperty : 'proj_ref_id'
//						}
//					},
//					autoLoad : true,
//					sorters: [{
//				         property: 'itm_name',
//				         direction: 'ASC'
//				     }]
//				},
//				valueField : 'itm_name',
//			    tpl: Ext.create('Ext.XTemplate',
//			        '<tpl for=".">',
//			        	"<tpl if='price == \"\"'>",
//			        	'<div class="x-boundlist-item">{itm_name}</div>',
//			            '<tpl else>',
//			            '<div class="x-boundlist-item">{itm_name} - {price} {currency}</div>',
//			            '</tpl>',
//		            '</tpl>'
//			    ),
//			    displayTpl: Ext.create('Ext.XTemplate',
//			        '<tpl for=".">',
//			        	"<tpl if='price == \"\"'>",
//			        	'{itm_name}',
//			            '<tpl else>',
//			            '{itm_name} - {price} {currency}',
//			            '</tpl>',
//			        '</tpl>'
//			    ),
//			    listeners: {
//			    	select : function(){
//			    		var v = this.getValue();
//						var record = this.findRecord(this.valueField || this.displayField, v);
//						var myIndex = this.store.indexOf(record);
//						var proj_ref_id = this.store.getAt(myIndex).data.proj_ref_id;
//						var price = this.store.getAt(myIndex).data.inv_ref_price;
//						var currency = this.store.getAt(myIndex).data.inv_ref_currency;
//						
//						Ext.getCmp('projRefId_invRef').setValue(proj_ref_id);
//						Ext.getCmp('price_invRef').setValue(price);
//						Ext.getCmp('currency_invRef').setValue(currency);
//			    	}
//			    }
//			}
		},
		{
			dataIndex : 'proj_ref_id',
			hidden : true,
			hideable : false
		},
		{
	    	text : "Remark",
	    	flex : 3,
	    	sortable : true,
	    	dataIndex : 'inv_ref_desc',
//	    	renderer : renderCustomer,
	    	editor: {
				xtype: 'textfield',
				allowBlank: true
			}
	    },
		{
			dataIndex : 'proj_ref_id',
			hidden : true,
			hideable : false
		},
		{
			text : "Qty",
			flex : 0.6,
			align : 'right',
			sortable : true,
			dataIndex : 'inv_ref_qty',
//			renderer: roundDecimal,
			renderer: Ext.util.Format.numberRenderer('0,000.##'),
			editor: {
				xtype:'numberfield',
				minValue : 0,
				allowBlank: false
			}
		},
		{
			text : "Rate",
			flex : 0.8,
			align : 'right',
			dataIndex : 'inv_ref_price',
			renderer: roundDecimal,
			editor: {
				xtype:'numberfield',
				allowBlank: false
			}
		},
	    {
	    	text : "Amount",
			flex : 0.8,
			align : 'right',
			sortable : true,
			dataIndex : 'total_amount',
			renderer: roundDecimal
	    },
	    {
	    	text : 'Edit',
			xtype : 'actioncolumn',
			flex : 0.5,
			align : 'center',
			sortable : false,
			hideable : false,
			id : 'inv_ref_edit',
			items : [{
				iconCls : 'table-edit',
				handler : function(grid, rowIndex, colIndex) {
					inv_id = grid.getStore().getAt(rowIndex).get('inv_id');
					inv_ref_id = grid.getStore().getAt(rowIndex).get('inv_ref_id');
					proj_id = grid.getStore().getAt(rowIndex).get('proj_id');
					proj_ref_id = grid.getStore().getAt(rowIndex).get('proj_ref_id');
					inv_itm_name = grid.getStore().getAt(rowIndex).get('inv_itm_name');
					inv_ref_price = grid.getStore().getAt(rowIndex).get('inv_ref_price');
					inv_ref_qty = grid.getStore().getAt(rowIndex).get('inv_ref_qty');
					inv_ref_currency = grid.getStore().getAt(rowIndex).get('inv_ref_currency');
					inv_ref_desc = grid.getStore().getAt(rowIndex).get('inv_ref_desc');
					inv_currency = grid.getStore().getAt(rowIndex).get('inv_currency');
					
					Ext.getCmp('eproj_ref_id').getStore().load({
						url: 'showProjectsReference.htm?id='+proj_id
					});
					
					Ext.getCmp('einv_id_ref').setValue(inv_id);
					Ext.getCmp('einv_ref_id').setValue(inv_ref_id);
					Ext.getCmp('eproj_id').setValue(proj_id);
					Ext.getCmp('eproj_ref_id').setValue(proj_ref_id);
					Ext.getCmp('einv_itm_name').setValue(inv_itm_name);
					Ext.getCmp('einv_ref_price').setValue(inv_ref_price);
					Ext.getCmp('einv_ref_qty').setValue(inv_ref_qty);
					Ext.getCmp('einv_ref_currency').setValue(inv_currency);
					Ext.getCmp('deinv_ref_currency').setValue(inv_currency);
					Ext.getCmp('einv_ref_desc').setValue(inv_ref_desc);
					editInvoiceItem.show();
				}
			}]
		},
	    {
			text : 'Delete',
			xtype : 'actioncolumn',
			flex : 0.5,
			sortable : false,
			hideable : false,
			align : 'center',
			id : 'inv_ref_del',
			items : [ {
				iconCls : 'icon-delete',
				handler : function(grid, rowIndex, colIndex) {
					inv_ref_id = grid.getStore().getAt(rowIndex).get('inv_ref_id');
					Ext.getCmp('invrefid').setValue(inv_ref_id);
					Ext.MessageBox.show({
						title : 'Confirm',
						msg : 'Are you sure you want to delete this?',
						buttons : Ext.MessageBox.YESNO,
						animateTarget : 'inv_ref_del',
						fn : confirmChkRef,
						icon : Ext.MessageBox.QUESTION
					});
				}
			} ]
		},
		],
		viewConfig: {
	        plugins: {
	            ptype: 'gridviewdragdrop',
	            dragText: 'Drag and drop to reorganize'
	        },
	        listeners : {
	        	drop : function (node, data, overModel, dropPosition, eOpts) {
//	        		alert(data.records);
//	        		console.log(grid.invoiceDetail.store.indexOf(data.records[0]));
	        		var selectedRecord = grid.invoiceDetail.getSelectionModel().getSelection()[0];
	        		var row = grid.invoiceDetail.store.indexOf(selectedRecord);
	        		console.log(data.records[0].get('order_by')+" To "+(row+1));
//	        		data.records[0].set('order_by', row+1);
//	        		grid.invoiceDetail.columns[0].doSort();
	        	}
	        }
	    },
		listeners : {
			viewready: function (grid) {
		        var view = grid.view;
		        this.toolTip = Ext.create('Ext.tip.ToolTip', {
		            target: view.el,
		            delegate: view.cellSelector,
		            trackMouse: true,
		            renderTo: Ext.getBody(),
		            listeners: {
		                beforeshow: function(tip) {
		                    var trigger = tip.triggerElement,
		                        parent = tip.triggerElement.parentElement,
		                        columnTitle = view.getHeaderByCell(trigger).text,
		                        columnDataIndex = view.getHeaderByCell(trigger).dataIndex,
		                        columnText = view.getRecord(parent).get(columnDataIndex).toString();
		                    if(columnDataIndex == "cus_name"){
		                    	columnText += "("+view.getRecord(parent).get('proj_name').toString()+")";
		                    }
		                    if (columnText){
		                        tip.update("<b>"+(columnText.replace(/\r\n|\n/gi, "<br>"))+"</b>");
		                    } else {
		                        return false;
		                    }
		                }
		            }
		        });
	        }
	    },
	    plugins: 
		    [{ 
		        ptype: 'cellediting',
		        clicksToEdit: 2,
		        listeners: {
			        beforeedit: function (editor, e) {
			        	Ext.getCmp('projRefId_invRef').setValue(0);
			        	if(e.field == "inv_itm_name"){
			        		Ext.getCmp('edit_itm_invRef').getStore().load({
			        			url: 'showProjects.htm?type=inv&id='+Ext.getCmp('dcus_id').getValue()
							});
			        	}
//			        	if(e.field == "sent_amount"){
//			        		Ext.getCmp('esent_amount').setMaxValue(e.record.get('amount'));
//			        	}
//			        	if(e.field == "job_ref_approve"){
//			        		gjob_ref = Ext.getCmp('edit_job_ref_approve_estudio');
//							
//		        			gjob_ref.clearValue();
//		        			gjob_ref.getStore().removeAll();
//		        			gjob_ref.getStore().load({
//								url: 'showJobReference.htm?kind=JobApprove&dept='+e.record.get('dept')
//							});
//			        	}
					},
					afteredit: function (editor, e) {
						if(e.field == "itm_name"){
							if(Ext.getCmp('projRefId_invRef').getValue() != 0){
								e.record.set('proj_ref_id', Ext.getCmp('projRefId_invRef').getValue());
								e.record.set('inv_ref_price', Ext.getCmp('price_invRef').getValue());
								e.record.set('inv_ref_currency', Ext.getCmp('currency_invRef').getValue());
								
							}
						}
					},
					edit: function (editor, e) {
//						if(e.field == "job_out"){
//							try{
//								myTime = Ext.getCmp('edit_time_today').getValue();
//								var myDate = new Date(editorDate.getFullYear(), editorDate.getMonth(), editorDate.getDate(), myTime.getHours(), myTime.getMinutes());
//								Ext.getCmp('edit_time_today').setValue(myDate);
//								e.record.set('job_out', myDate);
//							}catch(e){
//								console.log(e.message);
//							}
//						}
//						if(e.field == "job_ref_approve"){
//							if(Ext.getCmp('edit_job_ref_approve_estudio').getValue() == "-"){
//								e.record.set("job_ref_approve", "");
//							}
//						}
					}
		        }
		    }],
	    bbar : Ext.create('Ext.PagingToolbar', {
			store : store.invoiceRef,
			displayInfo : true,
			displayMsg : '<b>Total Count : {2} Items<b>&nbsp;&nbsp;&nbsp;',
			emptyMsg : "<b>No Item to display</b>",
//				plugins : Ext.create('Ext.ux.ProgressBarPager', {}),
		})
});

addInvoiceItem = new Ext.create('Ext.window.Window', {
	title: 'Add Item',
	animateTarget: 'addInvoiceItemButton',
	width: 600,
	minHeight: 250,
	layout: 'fit',
	closeAction: 'hide',
	resizable: false,
	items: [{
		xtype: 'form',
		id: 'addInvoiceItemForm',
		items: [{
			xtype:'fieldset',
            title: 'Item Information',
            defaultType: 'textfield',
            padding: 10,
            style: {
                "margin-left": "10px",
                "margin-right": "10px",
                "margin-top": "10px",
                "margin-bottom": "10px"
            },
            defaults: {
                anchor: '100%'
            },
            items: [{
	            	xtype: 'combobox',
					fieldLabel : 'Project Name <font color="red">*</font> ',
					name : 'aproj_id',
					id : 'aproj_id',
					allowBlank: false,
					editable : false,
					queryMode : 'local',
					labelWidth : 120,
					msgTarget: 'under',
					emptyText : 'Project Name',
					store : {
						fields : [ 'proj_id', 'proj_name' ],
						proxy : {
							type : 'ajax',
							url : '',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'proj_id'
							}
						},
						autoLoad : true,
//						sorters: [{
//					         property: 'proj_name',
//					         direction: 'ASC'
//					     }]
					},
					valueField : 'proj_id',
					displayField : 'proj_name',
					listeners : {
						select : function() {
							var proj_ref = Ext.getCmp('aproj_ref_id');
							var proj_id = Ext.getCmp('aproj_id').getValue();
	
							proj_ref.clearValue();
							proj_ref.getStore().removeAll();
							proj_ref.getStore().load({
								url: 'showProjectsReference.htm?id='+proj_id
							});
						}
					}
				},{
					xtype: 'combobox',
					fieldLabel : 'Item Name <font color="red">*</font> ',
					name : 'aproj_ref_id',
					id : 'aproj_ref_id',
					allowBlank: false,
					editable : false,
					queryMode : 'local',
					labelWidth : 120,
					msgTarget: 'under',
					emptyText : 'Item Name',
					store : {
						fields : [ 'proj_ref_id', 'itm_name', 'proj_ref_desc', 'price', 'proj_currency', 'topix_article_id' ],
						proxy : {
							type : 'ajax',
							url : '',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'proj_ref_id'
							}
						},
						autoLoad : true,
						sorters: [{
					         property: 'topix_article_id',
					         direction: 'ASC'
					     }]
					},
					valueField : 'proj_ref_id',
//					displayField : 'itm_name'
					// Template for the dropdown menu.
				    // Note the use of "x-boundlist-item" class,
				    // this is required to make the items selectable.
				    tpl: Ext.create('Ext.XTemplate',
				        '<tpl for=".">',
				        	"<tpl if='price == \"\"'>",
				        	'<div class="x-boundlist-item">{topix_article_id} : {itm_name}</div>',
				            '<tpl else>',
				            '<div class="x-boundlist-item">{topix_article_id} : {itm_name} : {price} {proj_currency}</div>',
				            '</tpl>',
			            '</tpl>'
				    ),
				    // template for the content inside text field
				    displayTpl: Ext.create('Ext.XTemplate',
				        '<tpl for=".">',
				        	"<tpl if='price == \"\"'>",
				        	'{topix_article_id} : {itm_name}',
				            '<tpl else>',
				            '{topix_article_id} : {itm_name} : {price} {proj_currency}',
				            '</tpl>',
				        '</tpl>'
				    ),
				    listeners : {
						select : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var price = this.store.getAt(myIndex).data.price;
							var item = this.store.getAt(myIndex).data.itm_name;
							var currency = this.store.getAt(myIndex).data.proj_currency;
							var inv_currency = Ext.getCmp('dinv_currency').getValue();
							var new_price = 0;
							
							if(currency !== inv_currency){
								var EUR = 1;
								var USD = store.exchangeRates.getAt(0).data.USD;
								var THB = store.exchangeRates.getAt(0).data.THB;
								var AUD = store.exchangeRates.getAt(0).data.AUD;
								var GBP = store.exchangeRates.getAt(0).data.GBP;
								var CHF = store.exchangeRates.getAt(0).data.CHF;
								var myRate = 0;
								if(currency == "EUR"){
									myRate = price;
								}else if(currency == "USD"){
									myRate = price/USD;
								}else if(currency == "THB"){
									myRate = price/THB;
								}else if(currency == "AUD"){
									myRate = price/AUD;
								}else if(currency == "GBP"){
									myRate = price/GBP;
								}else if(currency == "CHF"){
									myRate = price/CHF;
								}
								if(inv_currency == "EUR"){
									new_price = myRate;
								}else if(inv_currency == "USD"){
									new_price = myRate*USD;
								}else if(inv_currency == "THB"){
									new_price = myRate*THB;
								}else if(inv_currency == "AUD"){
									new_price = myRate*AUD;
								}else if(inv_currency == "GBP"){
									new_price = myRate*GBP;
								}else if(inv_currency == "CHF"){
									new_price = myRate*CHF;
								}
							}else{
								new_price = price;
							}
							
							Ext.getCmp('ainv_ref_price').setValue(new_price);
//							Ext.getCmp('ainv_ref_currency').setValue(currency);
							Ext.getCmp('ainv_itm_name').setValue(item);
							console.log(item + " = " + price + " " + currency);
						}
				    }
				},{
					xtype:'numberfield',
	    	    	labelWidth: 120,
	    	    	fieldLabel: 'Qty <font color="red">*</font> ',
//	    	    	minValue: 0,
	    	    	value: 1,
	    	    	msgTarget : 'under',
	    	    	name: 'ainv_ref_qty',
	    	    	id: 'ainv_ref_qty',
	    	    	emptyText : 'Qty',
	    	    	allowBlank: false,
				},{
					xtype:'numberfield',
	    	    	labelWidth: 120,
	    	    	fieldLabel: 'Price <font color="red">*</font> ',
	    	    	msgTarget : 'under',
	    	    	name: 'ainv_ref_price',
	    	    	id: 'ainv_ref_price',
	    	    	emptyText : 'Price',
	    	    	allowBlank: false,
				},{
					xtype:'displayfield',
	                fieldLabel: 'Currency ',
	                labelWidth: 120,
	                name: 'dinv_ref_currency',
	                id: 'dinv_ref_currency',
				},{
					labelWidth: 120,
					fieldLabel: 'Remark ',
					name: 'ainv_ref_desc',
					id: 'ainv_ref_desc',
					msgTarget: 'under',
					maxLength: 100,
					emptyText: 'Remark'
				},{
//					xtype: 'hidden',
//					name: 'ainv_ref_price',
//					id: 'ainv_ref_price'
//				},{
					xtype: 'hidden',
					name: 'ainv_ref_currency',
					id: 'ainv_ref_currency'
				},{
					xtype: 'hidden',
					name: 'ainv_itm_name',
					id: 'ainv_itm_name'
				},{
					xtype: 'hidden',
					name: 'ainv_id',
					id: 'ainv_id'
				}]
		}]
	}],
	buttons:[{
		text: 'Add',
		width: 100,
		id: 'addInvoiceItemBtn',
		handler: function(){
			var form = Ext.getCmp('addInvoiceItemForm').getForm();
			if (form.isValid()){
				 form.submit({
				 url: 'addInvoiceReference.htm',
				 waitTitle: 'Adding Invoice Item',
				 waitMsg: 'Please wait...',
				 standardSubmit: false,
                success: function(form, action) {
               	 Ext.MessageBox.show({
 						title: 'Information',
 						msg: "Inovoice's Item Has Been Add!",
 						buttons: Ext.MessageBox.OK,
 						icon: Ext.MessageBox.INFO,
 						animateTarget: 'addInvoiceItemBtn',
 						fn: function(){
 							addInvoiceItem.hide();
 							store.invoice.reload();
 							store.invoiceRef.reload();
 						}
 					});
                   },
                   failure : function(form, action) {
//						Ext.Msg.alert('Failed',
//								action.result ? action.result.message
//										: 'No response');
                   	Ext.MessageBox.show({
		                    title: 'REMOTE EXCEPTION',
		                    msg: operation.getError(),
		                    icon: Ext.MessageBox.ERROR,
		                    buttons: Ext.Msg.OK,
		                    fn: function(){location.reload()}
		                });
					}
     			});
       	 }else {
					Ext.MessageBox.show({
						title: 'Failed',
						msg: ' Please Insert All Required Field',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR,
						animateTarget: 'addInvoiceItemForm',
					});
				}
		}
	},{
		text: 'Reset',
		width: 100,
		handler: function(){
			Ext.getCmp('addInvoiceItemForm').getForm().reset();
		}
	}],
	listeners: {
		'beforehide': function(){
			Ext.getCmp('addInvoiceItemForm').getForm().reset();
		}
	}
});

editInvoiceItem = new Ext.create('Ext.window.Window', {
	title: 'Edit Item',
	animateTarget: 'inv_ref_edit',
	width: 450,
	minHeight: 250,
	layout: 'fit',
	closeAction: 'hide',
	resizable: false,
	items: [{
		xtype: 'form',
		id: 'editInvoiceItemForm',
		items: [{
			xtype:'fieldset',
            title: 'Item Information',
            defaultType: 'textfield',
            padding: 10,
            style: {
                "margin-left": "10px",
                "margin-right": "10px",
                "margin-top": "10px",
                "margin-bottom": "10px"
            },
            defaults: {
                anchor: '100%'
            },
            items: [{
	            	xtype: 'combobox',
					fieldLabel : 'Project Name <font color="red">*</font> ',
					name : 'eproj_id',
					id : 'eproj_id',
					allowBlank: false,
					editable : false,
					queryMode : 'local',
					labelWidth : 120,
					msgTarget: 'under',
					emptyText : 'Project Name',
					store : {
						fields : [ 'proj_id', 'proj_name' ],
						proxy : {
							type : 'ajax',
							url : '',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'proj_id'
							}
						},
						autoLoad : true,
//						sorters: [{
//					         property: 'proj_name',
//					         direction: 'ASC'
//					     }]
					},
					valueField : 'proj_id',
					displayField : 'proj_name',
					listeners : {
						select : function() {
							var proj_ref = Ext.getCmp('eproj_ref_id');
							var proj_id = Ext.getCmp('eproj_id').getValue();
	
							proj_ref.clearValue();
							proj_ref.getStore().removeAll();
							proj_ref.getStore().load({
								url: 'showProjectsReference.htm?id='+proj_id
							});
						}
					}
				},{
					xtype: 'combobox',
					fieldLabel : 'Item Name <font color="red">*</font> ',
					name : 'eproj_ref_id',
					id : 'eproj_ref_id',
					allowBlank: false,
					editable : false,
					queryMode : 'local',
					labelWidth : 120,
					msgTarget: 'under',
					emptyText : 'Item Name',
					store : {
						fields : [ 'proj_ref_id', 'itm_name', 'proj_ref_desc', 'price', 'proj_currency', 'topix_article_id' ],
						proxy : {
							type : 'ajax',
							url : '',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'proj_ref_id'
							}
						},
						autoLoad : true,
						sorters: [{
					         property: 'topix_article_id',
					         direction: 'ASC'
					     }]
					},
					valueField : 'proj_ref_id',
//					displayField : 'itm_name'
					// Template for the dropdown menu.
				    // Note the use of "x-boundlist-item" class,
				    // this is required to make the items selectable.
				    tpl: Ext.create('Ext.XTemplate',
				        '<tpl for=".">',
				        	"<tpl if='price == \"\"'>",
				        	'<div class="x-boundlist-item">{topix_article_id} : {itm_name}</div>',
				            '<tpl else>',
				            '<div class="x-boundlist-item">{topix_article_id} : {itm_name} : {price} {proj_currency}</div>',
				            '</tpl>',
			            '</tpl>'
				    ),
				    // template for the content inside text field
				    displayTpl: Ext.create('Ext.XTemplate',
				        '<tpl for=".">',
				        	"<tpl if='price == \"\"'>",
				        	'{topix_article_id} : {itm_name}',
				            '<tpl else>',
				            '{topix_article_id} : {itm_name} : {price} {proj_currency}',
				            '</tpl>',
				        '</tpl>'
				    ),
				    listeners : {
						select : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var price = this.store.getAt(myIndex).data.price;
							var item = this.store.getAt(myIndex).data.itm_name;
							var currency = this.store.getAt(myIndex).data.proj_currency;
							var inv_currency = Ext.getCmp('dinv_currency').getValue();
							var new_price = 0;
							
							if(currency !== inv_currency){
								var EUR = 1;
								var USD = store.exchangeRates.getAt(0).data.USD;
								var THB = store.exchangeRates.getAt(0).data.THB;
								var AUD = store.exchangeRates.getAt(0).data.AUD;
								var GBP = store.exchangeRates.getAt(0).data.GBP;
								var CHF = store.exchangeRates.getAt(0).data.CHF;
								var myRate = 0;
								if(currency == "EUR"){
									myRate = price;
								}else if(currency == "USD"){
									myRate = price/USD;
								}else if(currency == "THB"){
									myRate = price/THB;
								}else if(currency == "AUD"){
									myRate = price/AUD;
								}else if(currency == "GBP"){
									myRate = price/GBP;
								}else if(currency == "CHF"){
									myRate = price/CHF;
								}
								if(inv_currency == "EUR"){
									new_price = myRate;
								}else if(inv_currency == "USD"){
									new_price = myRate*USD;
								}else if(inv_currency == "THB"){
									new_price = myRate*THB;
								}else if(inv_currency == "AUD"){
									new_price = myRate*AUD;
								}else if(inv_currency == "GBP"){
									new_price = myRate*GBP;
								}else if(inv_currency == "CHF"){
									new_price = myRate*CHF;
								}
							}else{
								new_price = price;
							}
							
							Ext.getCmp('einv_ref_price').setValue(new_price);
							Ext.getCmp('einv_itm_name').setValue(item);
							console.log(item + " = " + price + " " + currency);
						}
				    }
				},{
					xtype:'numberfield',
	    	    	labelWidth: 120,
	    	    	fieldLabel: 'Qty <font color="red">*</font> ',
//	    	    	minValue: 0,
	    	    	value: 1,
	    	    	msgTarget : 'under',
	    	    	name: 'einv_ref_qty',
	    	    	id: 'einv_ref_qty',
	    	    	emptyText : 'Qty',
	    	    	allowBlank: false,
				},{
					xtype:'numberfield',
	    	    	labelWidth: 120,
	    	    	fieldLabel: 'Price <font color="red">*</font> ',
	    	    	msgTarget : 'under',
	    	    	name: 'einv_ref_price',
	    	    	id: 'einv_ref_price',
	    	    	emptyText : 'Price',
	    	    	allowBlank: false,
				},{
					xtype:'displayfield',
	                fieldLabel: 'Currency ',
	                labelWidth: 120,
	                name: 'deinv_ref_currency',
	                id: 'deinv_ref_currency',
				},{
					labelWidth: 120,
					fieldLabel: 'Remark ',
					name: 'einv_ref_desc',
					id: 'einv_ref_desc',
					msgTarget: 'under',
					maxLength: 100,
					emptyText: 'Remark'
				},{
//					xtype: 'hidden',
//					name: 'einv_ref_price',
//					id: 'einv_ref_price'
//				},{
					xtype: 'hidden',
					name: 'einv_ref_currency',
					id: 'einv_ref_currency'
				},{
					xtype: 'hidden',
					name: 'einv_itm_name',
					id: 'einv_itm_name'
				},{
					xtype: 'hidden',
					name: 'einv_id_ref',
					id: 'einv_id_ref'
				},{
					xtype: 'hidden',
					name: 'einv_ref_id',
					id: 'einv_ref_id'
				}]
		}]
	}],
	buttons:[{
		text: 'Update',
		width: 100,
		id: 'updateInvoiceItemBtn',
		handler: function(){
			var form = Ext.getCmp('editInvoiceItemForm').getForm();
			if (form.isValid()){
				 form.submit({
				 url: 'updateInvoiceReference.htm',
				 waitTitle: 'Updating Invoice Item',
				 waitMsg: 'Please wait...',
				 standardSubmit: false,
                success: function(form, action) {
               	 Ext.MessageBox.show({
 						title: 'Information',
 						msg: "Inovoice's Item Has Been Updated!",
 						buttons: Ext.MessageBox.OK,
 						icon: Ext.MessageBox.INFO,
 						animateTarget: 'updateInvoiceItemBtn',
 						fn: function(){
 							editInvoiceItem.hide();
 							store.invoice.reload();
 							store.invoiceRef.reload();
 						}
 					});
                   },
                   failure : function(form, action) {
//						Ext.Msg.alert('Failed',
//								action.result ? action.result.message
//										: 'No response');
                   	Ext.MessageBox.show({
		                    title: 'REMOTE EXCEPTION',
		                    msg: operation.getError(),
		                    icon: Ext.MessageBox.ERROR,
		                    buttons: Ext.Msg.OK,
		                    fn: function(){location.reload()}
		                });
					}
     			});
       	 }else {
					Ext.MessageBox.show({
						title: 'Failed',
						msg: ' Please Insert All Required Field',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR,
						animateTarget: 'updateInvoiceItemBtn',
					});
				}
		}
	},{
		text: 'Reset',
		width: 100,
		handler: function(){
			Ext.getCmp('editInvoiceItemForm').getForm().reset();
		}
	}],
	listeners: {
		'beforehide': function(){
			Ext.getCmp('editInvoiceItemForm').getForm().reset();
		}
	}
});

addInvoiceItemFromJobs = new Ext.create('Ext.window.Window', {
	title: 'Select From Jobs',
	width: 600,
	animateTarget: 'addInvoiceItemButton',
	resizable: false,
	closeAction: 'hide',
	items: [{
		xtype: 'form',
		id: 'addInvoiceItemFromJobsForm',
		items: [{
			xtype: 'fieldset',
			title: 'Job List Information',
			defaultType: 'textfield',
			layout: 'anchor',
			padding: 10,
			width: 550,
			style: {
                "margin-left": "auto",
                "margin-right": "auto",
                "margin-top": "10px",
                "margin-bottom": "10px"
            },
            defaults: {
                anchor: '100%'
            },
            items: [{
            	xtype: 'combobox',
            	fieldLabel: 'Job Name <font color="red">*</font>',
            	name: 'aeinv_job_name',
            	id: 'aeinv_job_name',
            	allowBlank: false,
            	queryMode: 'local',
            	msgTarget: 'under',
            	labelWidth: 120,
            	editable: false,
            	emptyText: 'Job Name',
            	store: {
            		fields: ['job_id', 'job_name'],
            		proxy: {
            			type: 'ajax',
            			url: '',
            			reader: {
            				type: 'json',
            				root: 'records',
            				idProperty: 'job_id'
            			}
            		},
            		sorters: [{
            			property: 'job_name',
            			direction: 'ASC'
            		}]
            	},
            	valueField: 'job_name',
            	displayField: 'job_name',
            	listeners: {
            		select: function(){
            			var v = this.getValue();
            			var record = this.findRecord(this.valueField || this.displayField, v);
            			var myIndex = this.store.indexOf(record);
						var job_id = this.store.getAt(myIndex).data.job_id;
						Ext.getCmp('aejob_id').setValue(job_id);
            		}
            	}
            }]
		},{
			xtype: 'hidden',
			id: 'aejob_inv_id',
			name: 'aejob_inv_id'
		},{
			xtype: 'hidden',
			id: 'aejob_id',
			name: 'aejob_id'
		}]
	}],
	buttons:[{
		text: 'Add',
		width: 100,
		id: 'addFromJobBtn',
		handler: function(){
			var form = Ext.getCmp('addInvoiceItemFromJobsForm').getForm();
			if (form.isValid()){
				 form.submit({
				 url: 'addInvoiceReferenceFromJobs.htm',
				 waitTitle: 'Adding Invoice Item',
				 waitMsg: 'Please wait...',
				 standardSubmit: false,
                success: function(form, action) {
               	 Ext.MessageBox.show({
 						title: 'Information',
 						msg: "Inovoice's Item Has Been Add!",
 						buttons: Ext.MessageBox.OK,
 						icon: Ext.MessageBox.INFO,
 						animateTarget: 'addInvoiceItemButton',
 						fn: function(){
 							addInvoiceItemFromJobs.hide();
 							store.invoiceRef.reload();
 						}
 					});
                   },
                   failure : function(form, action) {
//						Ext.Msg.alert('Failed',
//								action.result ? action.result.message
//										: 'No response');
                   	Ext.MessageBox.show({
		                    title: 'REMOTE EXCEPTION',
		                    msg: operation.getError(),
		                    icon: Ext.MessageBox.ERROR,
		                    buttons: Ext.Msg.OK,
		                    fn: function(){location.reload()}
		                });
					}
     			});
       	 }else {
					Ext.MessageBox.show({
						title: 'Failed',
						msg: ' Please Select Job!',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR,
						animateTarget: 'addInvoiceItemButton',
					});
				}
		}
	},{
		text: 'Cancel',
		width: 100,
		handler: function(){
			addInvoiceItemFromJobs.hide();
		}
	}],
	listeners: {
		'beforehide': function(){
			Ext.getCmp('addInvoiceItemFromJobsForm').getForm().reset();
		}
	}
});

function confirmChk(btn) {
	if (btn == "yes") {
		Ext.Ajax.request({
					url : 'deleteInvoice.htm',
					params : {
						id : Ext.getCmp('invid_del').getValue(),
					},
					success : function(response, opts) {
						Ext.MessageBox.show({
							title : 'Infomation',
							msg : 'Invoice has been deleted!',
							buttons : Ext.MessageBox.OK,
							animateTarget : 'inv_del',
							fn : function(){
								store.invoice.reload();
								Ext.getCmp('detailTabs').setDisabled(true);
								Ext.getCmp('detailTabs').setTitle("Detail");
								Ext.getCmp('filterSearchField').setValue("");
      		                	store.invoice.clearFilter();
      		                	Ext.getCmp('invid_del').setValue("");
							},
							icon : Ext.MessageBox.INFO
						});
					},
					failure : function(response, opts) {
						var responseOject = Ext.util.JSON
								.decode(response.responseText);
						Ext.Msg.alert(responseOject.messageHeader,
								responseOject.message);
					}
				});
	}
}

function confirmChkRef(btn) {
	if (btn == "yes") {
		Ext.Ajax.request({
					url : 'deleteInvoiceReference.htm',
					params : {
						id : Ext.getCmp('invrefid').getValue(),
					},
					success : function(response, opts) {
						Ext.MessageBox.show({
							title : 'Infomation',
							msg : 'Item has been delete!',
							buttons : Ext.MessageBox.OK,
							animateTarget : 'inv_ref_del',
							fn : function(){
								store.invoice.reload();
								store.invoiceRef.reload();
							},
							icon : Ext.MessageBox.INFO
						});
					},
					failure : function(response, opts) {
						var responseOject = Ext.util.JSON
								.decode(response.responseText);
						Ext.Msg.alert(responseOject.messageHeader,
								responseOject.message);
					}
				});
	}
}

function getParamValues() {
	var url = "";
	var param = "";
	var prefix = "?";
	var queryStr = "";
	var i = 1;
	var count = 0;

	for (param in panel.search.getValues()) {

		count += panel.search.getValues()[param].length;

		if (i == 1) {
			queryStr += param + "=" + panel.search.getValues()[param];
		} else {
			queryStr += "&" + param + "=" + panel.search.getValues()[param];
		}

		i++;
	}

	if (count == 0) {
		url = "";
	} else {
		url = prefix + queryStr;
	}

	return encodeURI(url);
}

function roundDecimal(value, meta, record, rowIndex, colIndex, store) {
    return Ext.util.Format.number(value, '0,000.##')+' '+record.get('inv_currency');
//	return Math.round(value * 100) / 100;
}

function customerCombine(value, meta, record, rowIndex, colIndex, store) {
    return record.get('cus_name')+' ('+record.get('cus_code')+')';
}