store = {};
panel = {};
grid = {};
Ext.onReady(function() {
	
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
	
	invid = new Ext.form.Hidden({
		name : 'invid',
		id : 'invid'
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
		title : 'Invoice Header ',
		width : 850,
		height : 240,
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
				inv_payment_term = Ext.getCmp('dinv_payment_term').getValue();
				inv_vat = Ext.getCmp('dinv_vat').getValue();
				inv_bill_type = Ext.getCmp('dinv_bill_type').getValue();
				
				console.log(inv_delivery_date);
				
				Ext.getCmp('einv_id').setValue(inv_id);
				Ext.getCmp('einv_name').setValue(inv_name);
				Ext.getCmp('einv_proj_no').setValue(inv_proj_no);
				Ext.getCmp('einv_delivery_date').setValue(inv_delivery_date);
				Ext.getCmp('einv_company_id').setValue(inv_company_id);
				Ext.getCmp('ecus_id').setValue(cus_id);
				Ext.getCmp('ecus_name').setValue(cus_name);
				Ext.getCmp('ecus_code').setValue(cus_code);
				Ext.getCmp('einv_payment_term').setValue(inv_payment_term);
				Ext.getCmp('einv_vat').setValue(inv_vat);
				Ext.getCmp('einv_bill_type').setValue(inv_bill_type);
				editInvoice.show();
			}
		} ],
		items : [ {
			layout : 'column',
			border : false,
			items : [ {
				columnWidth : 0.5,
				style : {
					"margin-left" : "60px",
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
					width : 320,
					fieldStyle : 'font-size:14px;font-weight:bold;'
				}, {
					fieldLabel : 'Project No ',
					name : 'dinv_proj_no',
					id : 'dinv_proj_no',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 320,
					fieldStyle : 'font-size:14px;font-weight:bold;'
				},{ 
					fieldLabel : 'Delivery Date ',
					name : 'dinv_delivery_date',
					id : 'dinv_delivery_date',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 320,
					renderer: Ext.util.Format.dateRenderer('m/y'),
					fieldStyle : 'font-size:14px;font-weight:bold;'
				},{
					fieldLabel : 'Billing Type ',
					name : 'dinv_bill_type',
					id : 'dinv_bill_type',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 320,
					fieldStyle : 'font-size:14px;font-weight:bold;'
				}]
			},{
				columnWidth : 0.5,
				border : false,
				layout : 'anchor',
				style : {
					"margin-left" : "60px",
					"margin-right" : "auto",
					"margin-top" : "10px",
					"margin-bottom" : "10px"
				},
				defaultType : 'displayfield',
				items : [
				    {
				    	fieldLabel : 'Company Name ',
						name : 'dinv_company_name',
						id: 'dinv_company_name',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 350,
						fieldStyle : 'font-size:14px;font-weight:bold;'
				    },{
						fieldLabel : 'Customer Name ',
						name : 'dcus_name',
						id: 'dcus_name',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 350,
						fieldStyle : 'font-size:14px;font-weight:bold;'
					},{
						fieldLabel : 'Payment Term ',
						name : 'dinv_payment_term',
						id : 'dinv_payment_term',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 350,
						fieldStyle : 'font-size:14px;font-weight:bold;'
					},{
						fieldLabel : 'Vat(%) ',
						name : 'dinv_vat',
						id : 'dinv_vat',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 350,
						fieldStyle : 'font-size:14px;font-weight:bold;'
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
			}  ]
		} ],
		buttons: [{
			text: 'Print Invoice',
			id : 'printInvoiceButton',
			iconCls: 'icon-print',
			handler: function(){
				
			}
		},
//		{
//			text : 'Edit Invoice',
//			id : 'editInvoiceHeaderButton',
//			iconCls : 'table-edit',
//			handler : function() {
//				addInvoiceHeader.show();
//			}
//		}
		]
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
	});
	
	panel.tabs = Ext.create('Ext.tab.Panel', {
		renderTo : document.body,
		deferredRender : false,
		width: 1300,
		height: 700,
		frame: true,
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
	    	'afterrender': function(){
            	grid.invoice.down('toolbar').add('->',{
            		xtype : 'button',
            		text : "Add Invoice",
            		id : 'inv_add',
            		iconCls : 'icon-add',
            		handler : function() {
            			addInvoice.show();
            		}
            	});
            	grid.invoice.down('statusbar').add('->',{
              		xtype : 'tbtext',
             		 id : 'inv_total',
              		text : '<b>Total Invoices : '+store.invoice.getTotalCount()+' <b>&nbsp;&nbsp;&nbsp;'
            	});
            }
	    }
	});
	
	addInvoice = new Ext.create('Ext.window.Window', {
		title: 'Add Invoice',
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
							Ext.getCmp('acus_id').setValue(myId);
							Ext.getCmp('acus_code').setValue(myValue);
							
							console.log("cus_code: "+myValue);
						},
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record !== false){
								var myIndex = this.store.indexOf(record);
								var myValue = this.store.getAt(myIndex).data.cus_code;
								var myId = this.store.getAt(myIndex).data.cus_id;
								Ext.getCmp('acus_id').setValue(myId);
								Ext.getCmp('acus_code').setValue(myValue);
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
							Ext.getCmp('acus_id').setValue(myId);
							Ext.getCmp('acus_name').setValue(myValue);
							
							console.log("cus_name: "+myValue);
						},
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record !== false){
								var myIndex = this.store.indexOf(record);
								var myValue = this.store.getAt(myIndex).data.cus_name;
								var myId = this.store.getAt(myIndex).data.cus_id;
								Ext.getCmp('acus_id').setValue(myId);
								Ext.getCmp('acus_name').setValue(myValue);
							}else{
								Ext.getCmp('acus_id').setValue("");
								Ext.getCmp('acus_code').setValue("");
								Ext.getCmp('acus_name').setValue("");
							}
						}

					}
				},{
					xtype : 'numberfield',
					fieldLabel : 'Payment Term <font color="red">*</font> ',
					name : 'ainv_payment_term',
					id : 'ainv_payment_term',
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
					fieldLabel: 'Billing Type <font color="red">*</font> ',
					name: 'ainv_bill_type',
					id: 'ainv_bill_type',
					labelWidth: 120,
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
					value : 'Direct'
				}]
			},{
				xtype: 'hidden',
				id: 'acus_id',
				name: 'acus_id'
			}]
		}],
		buttons: [{
			text: 'Add',
			width: 100,
			id: 'addInvoiceButton',
			handler: function(){
				var form = Ext.getCmp('addInvoiceForm').getForm();
				if (form.isValid()){
   				 form.submit({
   				 url: 'addInvoice.htm',
   				 waitTitle: 'Adding Invoice',
   				 waitMsg: 'Please wait...',
   				 standardSubmit: false,
                    success: function(form, action) {
                   	 Ext.MessageBox.show({
     						title: 'Information',
     						msg: "Inovoice Has Been Add!",
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
	            	xtype: 'combobox',
	            	fieldLabel: 'Company <font color="red">*</font> ',
	            	name: 'einv_company_id',
	            	id: 'einv_company_id',
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
	            	xtype: 'monthfield',
	            	fieldLabel : 'Delivery Date <font color="red">*</font> ',
					name : 'einv_delivery_date',
					id : 'einv_delivery_date',
					labelWidth : 120,
					format: 'm/y',
					value: new Date(),
					allowBlank: false,
					editable: false
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
							Ext.getCmp('ecus_id').setValue(myId);
							Ext.getCmp('ecus_code').setValue(myValue);
							
							console.log("cus_code: "+myValue);
						},
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record !== false){
								var myIndex = this.store.indexOf(record);
								var myValue = this.store.getAt(myIndex).data.cus_code;
								var myId = this.store.getAt(myIndex).data.cus_id;
								Ext.getCmp('ecus_id').setValue(myId);
								Ext.getCmp('ecus_code').setValue(myValue);
							}else{
								Ext.getCmp('ecus_id').setValue("");
								Ext.getCmp('ecus_name').setValue("");
								Ext.getCmp('ecus_code').setValue("");
							}
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
							Ext.getCmp('ecus_id').setValue(myId);
							Ext.getCmp('ecus_name').setValue(myValue);
							
							console.log("cus_name: "+myValue);
						},
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record !== false){
								var myIndex = this.store.indexOf(record);
								var myValue = this.store.getAt(myIndex).data.cus_name;
								var myId = this.store.getAt(myIndex).data.cus_id;
								Ext.getCmp('ecus_id').setValue(myId);
								Ext.getCmp('ecus_name').setValue(myValue);
							}else{
								Ext.getCmp('ecus_id').setValue("");
								Ext.getCmp('ecus_code').setValue("");
								Ext.getCmp('ecus_name').setValue("");
							}
						}

					}
				},{
					xtype : 'numberfield',
					fieldLabel : 'Payment Term <font color="red">*</font> ',
					name : 'einv_payment_term',
					id : 'einv_payment_term',
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
					fieldLabel: 'Billing Type <font color="red">*</font> ',
					name: 'einv_bill_type',
					id: 'einv_bill_type',
					labelWidth: 120,
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
           	 if(form.isValid()){
   				 form.submit({
   				 url: 'updateInvoice.htm',
   				 waitTitle: 'Updating Job',
   				 waitMsg: 'Please wait...',
   				 standardSubmit: false,
                    success: function(form, action) {
                   	 Ext.MessageBox.show({
     						title: 'Information',
     						msg: 'Job Has Been Update!',
     						buttons: Ext.MessageBox.OK,
     						icon: Ext.MessageBox.INFO,
     						animateTarget: 'updateInvoiceButton',
     						fn: function(){
     							editInvoice.hide();
     							store.invoice.reload();
     							Ext.getCmp('detailTabs').setDisabled(true);
								Ext.getCmp('detailTabs').setTitle("Detail");
     							Ext.getCmp('filterSearchField').setValue("");
      		                	store.invoice.clearFilter();
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
		dateFormat: 'Y-m-d H:i:s'
	},{
		name: 'inv_delivery_date',
		type: 'date',
		dateFormat: 'Y-m-d'
	},{
		name: 'inv_payment_term',
		type: 'int'
	},{
		name: 'inv_vat',
		type: 'float'
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
		type: 'date',
		dateFormat: 'Y-m-d H:i:s'
	},{
		name: 'update_date',
		type: 'date',
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
	listeners: {
		load: function(){
			setTimeout(function(){
          		Ext.getCmp('inv_total').setText('<b>Total Invoices : '+store.invoice.getTotalCount()+'</b>&nbsp;&nbsp;&nbsp;');
          	},500);
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
		type: 'float'
	},{
		name: 'proj_id',
		type: 'int'
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
							}
					});
            }
            
        }
	}
});

grid.invoice = Ext.create('Ext.ux.LiveFilterGridPanel', {
	store: store.invoice,
	id: 'invoiceGrid',
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
				inv_payment_term = grid.getStore().getAt(rowIndex).get('inv_payment_term');
				inv_vat = grid.getStore().getAt(rowIndex).get('inv_vat');
				inv_bill_type = grid.getStore().getAt(rowIndex).get('inv_bill_type');
				
				console.log(inv_delivery_date);
				
				Ext.getCmp('dinv_id').setValue(inv_id);
				Ext.getCmp('dinv_name').setValue(inv_name);
				Ext.getCmp('dinv_proj_no').setValue(inv_proj_no);
				Ext.getCmp('dinv_delivery_date').setValue(inv_delivery_date);
				Ext.getCmp('dinv_company_id').setValue(inv_company_id);
				Ext.getCmp('dinv_company_name').setValue(inv_company_name);
				Ext.getCmp('dcus_id').setValue(cus_id);
				Ext.getCmp('dcus_name').setValue(cus_name);
				Ext.getCmp('dcus_code').setValue(cus_code);
				Ext.getCmp('dinv_payment_term').setValue(inv_payment_term);
				Ext.getCmp('dinv_vat').setValue(inv_vat);
				Ext.getCmp('dinv_bill_type').setValue(inv_bill_type);
				
				var aproj_id = Ext.getCmp('aproj_id');
				aproj_id.clearValue();
				aproj_id.getStore().removeAll();
				aproj_id.getStore().load({
					url: 'showProjects.htm?id='+cus_id
				});
				
				var eproj_id = Ext.getCmp('eproj_id');
				eproj_id.clearValue();
				eproj_id.getStore().removeAll();
				eproj_id.getStore().load({
					url: 'showProjects.htm?id='+cus_id
				});
				
//				store.invoiceRef.removeAll();
//				store.invoiceRef.load({
//					url: 'searchInvoiceReference.htm?id='+inv_id
//				});
				
				Ext.Ajax.request({
					url : 'searchInvoiceParam.htm?inv_id='+inv_id,
					success : function(response, opts) {
						store.invoiceRef.loadPage(1);
						Ext.getCmp('detailTabs').setDisabled(false);
						Ext.getCmp('detailTabs').setTitle(inv_name);
						panel.tabs.setActiveTab('detailTabs');
					}
				});
				
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
    	text : 'Edit',
		xtype : 'actioncolumn',
		flex : 0.5,
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
				inv_payment_term = grid.getStore().getAt(rowIndex).get('inv_payment_term');
				inv_vat = grid.getStore().getAt(rowIndex).get('inv_vat');
				inv_bill_type = grid.getStore().getAt(rowIndex).get('inv_bill_type');
				
				
				Ext.getCmp('einv_id').setValue(inv_id);
				Ext.getCmp('einv_name').setValue(inv_name);
				Ext.getCmp('einv_proj_no').setValue(inv_proj_no);
				Ext.getCmp('einv_delivery_date').setValue(inv_delivery_date);
				Ext.getCmp('einv_company_id').setValue(inv_company_id);
				Ext.getCmp('ecus_id').setValue(cus_id);
				Ext.getCmp('ecus_name').setValue(cus_name);
				Ext.getCmp('ecus_code').setValue(cus_code);
				Ext.getCmp('einv_payment_term').setValue(inv_payment_term);
				Ext.getCmp('einv_vat').setValue(inv_vat);
				Ext.getCmp('einv_bill_type').setValue(inv_bill_type);
				editInvoice.show();
			}
		}]
	},{
		text : 'Delete',
		xtype : 'actioncolumn',
		flex : 0.5,
		align : 'center',
		id : 'inv_del',
		items : [ {
			iconCls : 'icon-delete',
			handler : function(grid, rowIndex, colIndex) {
				inv_id = grid.getStore().getAt(rowIndex).get('inv_id');
				Ext.getCmp('invid').setValue(inv_id);
				Ext.MessageBox.show({
					title : 'Confirm',
					msg : 'Are you sure you want to delete this?',
					buttons : Ext.MessageBox.YESNO,
					animateTarget : 'inv_del',
					fn : confirmChk,
					icon : Ext.MessageBox.QUESTION
				});
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
			inv_payment_term = dv.getStore().getAt(index).get('inv_payment_term');
			inv_vat = dv.getStore().getAt(index).get('inv_vat');
			inv_bill_type = dv.getStore().getAt(index).get('inv_bill_type');
			
			console.log(inv_delivery_date);
			
			Ext.getCmp('dinv_id').setValue(inv_id);
			Ext.getCmp('dinv_name').setValue(inv_name);
			Ext.getCmp('dinv_proj_no').setValue(inv_proj_no);
			Ext.getCmp('dinv_delivery_date').setValue(inv_delivery_date);
			Ext.getCmp('dinv_company_id').setValue(inv_company_id);
			Ext.getCmp('dinv_company_name').setValue(inv_company_name);
			Ext.getCmp('dcus_id').setValue(cus_id);
			Ext.getCmp('dcus_name').setValue(cus_name);
			Ext.getCmp('dcus_code').setValue(cus_code);
			Ext.getCmp('dinv_payment_term').setValue(inv_payment_term);
			Ext.getCmp('dinv_vat').setValue(inv_vat);
			Ext.getCmp('dinv_bill_type').setValue(inv_bill_type);
			
			var aproj_id = Ext.getCmp('aproj_id');
			aproj_id.clearValue();
			aproj_id.getStore().removeAll();
			aproj_id.getStore().load({
				url: 'showProjects.htm?id='+cus_id
			});
			
			var eproj_id = Ext.getCmp('eproj_id');
			eproj_id.clearValue();
			eproj_id.getStore().removeAll();
			eproj_id.getStore().load({
				url: 'showProjects.htm?id='+cus_id
			});
			
			Ext.Ajax.request({
				url : 'searchInvoiceParam.htm?inv_id='+inv_id,
				success : function(response, opts) {
					store.invoiceRef.loadPage(1);
					Ext.getCmp('detailTabs').setDisabled(false);
					Ext.getCmp('detailTabs').setTitle(inv_name);
					panel.tabs.setActiveTab('detailTabs');
				}
			});
	    }
	}
});

grid.invoiceDetail = Ext.create('Ext.grid.Panel', {
	id: 'detailGrid',
	title: 'Invoice Item',
	store : store.invoiceRef,
	height: 390,
	columnLines: true,
	tools: [ {
		xtype : 'button',
		text : 'Add Item',
		id : 'addInvoiceItemButton',
		iconCls : 'icon-add',
		handler : function() {
			var inv_id = Ext.getCmp('dinv_id').getValue();
			Ext.getCmp('ainv_id').setValue(inv_id);
			addInvoiceItem.show();
		}
//	}
//	,{xtype: 'tbspacer', width: 5},
//	{
//		xtype: 'button',
//		text: 'Save All',
//		id: 'invRefSync',
//		iconCls: 'icon-save',
//		handler: function(){
//			store.invoiceRef.sync();
//		}
	} ],
	tbar: [
//	       {
//		xtype : 'button',
//		text : 'Add Item',
//		id : 'addInvoiceItemButton',
//		iconCls : 'icon-add',
//		handler : function() {
//			var inv_id = Ext.getCmp('dinv_id').getValue();
//			Ext.getCmp('ainv_id').setValue(inv_id);
//			addInvoiceItem.show();
//		}
//	},
	'->',
	{
		xtype: 'button',
		text: 'Save All',
		id: 'invRefSync',
		iconCls: 'icon-save',
		handler: function(){
			store.invoiceRef.sync();
		}
	}],
	columns: [{
			xtype: 'rownumberer'
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
	    	text : "Description",
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
			align : 'center',
			sortable : true,
			dataIndex : 'inv_ref_qty',
			editor: {
				xtype:'numberfield',
				minValue : 0,
				allowBlank: false
			}
		},
		{
			text : "Rate",
			flex : 0.8,
			align : 'center',
			dataIndex : 'inv_ref_price',
		},
	    {
	    	text : "Amount",
			flex : 0.8,
			align : 'center',
			sortable : true,
			dataIndex : 'total_amount'
	    },
	    {
	    	hideable : false,
//	    	hidden: true,
	    	dataIndex: 'order_by',
	    	editor: {
	    		xtype: 'numberfield',
	    		id: 'gorder_by',
		    	name: 'gorder_by'
	    	}
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
					
					Ext.getCmp('eproj_ref_id').getStore().load({
						url: 'showProjectsReference.htm?id='+proj_id
					});
					
					Ext.getCmp('einv_id').setValue(inv_id);
					Ext.getCmp('einv_ref_id').setValue(inv_ref_id);
					Ext.getCmp('eproj_id').setValue(proj_id);
					Ext.getCmp('eproj_ref_id').setValue(proj_ref_id);
					Ext.getCmp('einv_itm_name').setValue(inv_itm_name);
					Ext.getCmp('einv_ref_price').setValue(inv_ref_price);
					Ext.getCmp('einv_ref_qty').setValue(inv_ref_qty);
					Ext.getCmp('einv_ref_currency').setValue(inv_ref_currency);
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
	        		console.log(grid.invoiceDetail.store.indexOf(data.records[0]));
	        		var selectedRecord = grid.invoiceDetail.getSelectionModel().getSelection()[0];
	        		var row = grid.invoiceDetail.store.indexOf(selectedRecord);
	        		console.log(data.records[0].get('order_by')+" To "+(row+1));
	        		data.records[0].set('order_by', row+1);
	        		grid.invoiceDetail.columns[0].doSort();
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
			        			url: 'showProjects.htm?id='+Ext.getCmp('dcus_id').getValue()
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
	width: 450,
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
						sorters: [{
					         property: 'proj_name',
					         direction: 'ASC'
					     }]
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
						fields : [ 'proj_ref_id', 'itm_name', 'proj_ref_desc', 'price', 'currency' ],
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
					         property: 'itm_name',
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
				        	'<div class="x-boundlist-item">{itm_name}</div>',
				            '<tpl else>',
				            '<div class="x-boundlist-item">{itm_name} - {price} {currency}</div>',
				            '</tpl>',
			            '</tpl>'
				    ),
				    // template for the content inside text field
				    displayTpl: Ext.create('Ext.XTemplate',
				        '<tpl for=".">',
				        	"<tpl if='price == \"\"'>",
				        	'{itm_name}',
				            '<tpl else>',
				            '{itm_name} - {price} {currency}',
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
							var currency = this.store.getAt(myIndex).data.currency;
							
							Ext.getCmp('ainv_ref_price').setValue(price);
							Ext.getCmp('ainv_ref_currency').setValue(currency);
							Ext.getCmp('ainv_itm_name').setValue(item);
							console.log(item + " = " + price + " " + currency);
						}
				    }
				},{
					xtype:'numberfield',
	    	    	labelWidth: 120,
	    	    	fieldLabel: 'Qty <font color="red">*</font> ',
	    	    	minValue: 1,
	    	    	value: 1,
	    	    	msgTarget : 'under',
	    	    	name: 'ainv_ref_qty',
	    	    	id: 'ainv_ref_qty',
	    	    	emptyText : 'Qty',
	    	    	allowBlank: false,
				},{
					labelWidth: 120,
					fieldLabel: 'Remark ',
					name: 'ainv_ref_desc',
					id: 'ainv_ref_desc',
					msgTarget: 'under',
					maxLength: 100,
					emptyText: 'Remark'
				},{
					xtype: 'hidden',
					name: 'ainv_ref_price',
					id: 'ainv_ref_price'
				},{
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
 							store.invoiceRef.reload();
 		                	store.invoiceRef.clearFilter();
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
						sorters: [{
					         property: 'proj_name',
					         direction: 'ASC'
					     }]
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
						fields : [ 'proj_ref_id', 'itm_name', 'proj_ref_desc', 'price', 'currency' ],
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
					         property: 'itm_name',
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
				        	'<div class="x-boundlist-item">{itm_name}</div>',
				            '<tpl else>',
				            '<div class="x-boundlist-item">{itm_name} - {price} {currency}</div>',
				            '</tpl>',
			            '</tpl>'
				    ),
				    // template for the content inside text field
				    displayTpl: Ext.create('Ext.XTemplate',
				        '<tpl for=".">',
				        	"<tpl if='price == \"\"'>",
				        	'{itm_name}',
				            '<tpl else>',
				            '{itm_name} - {price} {currency}',
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
							var currency = this.store.getAt(myIndex).data.currency;
							
							Ext.getCmp('einv_ref_price').setValue(price);
							Ext.getCmp('einv_ref_currency').setValue(currency);
							Ext.getCmp('einv_itm_name').setValue(item);
							console.log(item + " = " + price + " " + currency);
						}
				    }
				},{
					xtype:'numberfield',
	    	    	labelWidth: 120,
	    	    	fieldLabel: 'Qty <font color="red">*</font> ',
	    	    	minValue: 1,
	    	    	value: 1,
	    	    	msgTarget : 'under',
	    	    	name: 'einv_ref_qty',
	    	    	id: 'einv_ref_qty',
	    	    	emptyText : 'Qty',
	    	    	allowBlank: false,
				},{
					labelWidth: 120,
					fieldLabel: 'Remark ',
					name: 'einv_ref_desc',
					id: 'einv_ref_desc',
					msgTarget: 'under',
					maxLength: 100,
					emptyText: 'Remark'
				},{
					xtype: 'hidden',
					name: 'einv_ref_price',
					id: 'einv_ref_price'
				},{
					xtype: 'hidden',
					name: 'einv_ref_currency',
					id: 'einv_ref_currency'
				},{
					xtype: 'hidden',
					name: 'einv_itm_name',
					id: 'einv_itm_name'
				},{
					xtype: 'hidden',
					name: 'einv_id',
					id: 'einv_id'
				},{
					xtype: 'hidden',
					name: 'einv_ref_id',
					id: 'einv_ref_id'
				}]
		}]
	}],
	buttons:[{
		text: 'Add',
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

function confirmChk(btn) {
	if (btn == "yes") {
		Ext.Ajax.request({
					url : 'deleteInvoice.htm',
					params : {
						id : Ext.getCmp('invid').getValue(),
					},
					success : function(response, opts) {
						Ext.MessageBox.show({
							title : 'Infomation',
							msg : 'Invoice has been delete!',
							buttons : Ext.MessageBox.OK,
							animateTarget : 'inv_del',
							fn : function(){
								store.invoice.reload();
								Ext.getCmp('detailTabs').setDisabled(true);
								Ext.getCmp('detailTabs').setTitle("Detail");
								Ext.getCmp('filterSearchField').setValue("");
      		                	store.invoice.clearFilter();
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


function customerCombine(value, meta, record, rowIndex, colIndex, store) {
    return record.get('cus_name')+' ('+record.get('cus_code')+')';
}