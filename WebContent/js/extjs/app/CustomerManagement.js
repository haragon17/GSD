store = {};
panels = {};
userDept = "";
userType = "";

Ext.onReady(function() {
	
	cusid = new Ext.form.Hidden({
		name : 'cusid',
		id : 'cusid'
	});
	
	scusid = new Ext.form.Hidden({
		name : 'scusid',
		id : 'scusid'
	})

	panels.search = Ext.create('Ext.form.Panel', {
		title : 'Search Criteria',
		autoWidth : true,
		id : 'formPanel',
		width : 750,
		height : 200,
		collapsible : true,
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
				columnWidth : 0.62,
				border : false,
				layout : 'anchor',
				style : {
					"margin-left" : "50px",
					"margin-right" : "auto",
					"margin-top" : "10px",
					"margin-bottom" : "10px"
				},
				defaultType : 'textfield',
				items : [ {
					xtype : 'combobox',
					fieldLabel : 'Customer Name ',
					name : 'scus_name',
					id: 'scus_name',
					queryMode : 'local',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 260,
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
							Ext.getCmp('scusid').setValue(myId);
							Ext.getCmp('scus_code').setValue(myValue);
						},
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record == false){
								Ext.getCmp('scusid').setValue("");
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
					width : 260,
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
							Ext.getCmp('scusid').setValue(myId);
							Ext.getCmp('scus_name').setValue(myValue);
						},
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record == false){
								Ext.getCmp('scusid').setValue("");
								Ext.getCmp('scus_name').setValue("");
								Ext.getCmp('scus_code').setValue("");
							}
						}
					}
				} ]
			}, {
				columnWidth : 0.36,
				style : {
					"margin-left" : "-80px",
					"margin-right" : "10px",
					"margin-top" : "10px",
				},
				border : false,
				layout : 'anchor',
				defaultType : 'textfield',
				items : [ {
					xtype: 'combobox',
					fieldLabel : 'Key Acc Mng ',
					name : 'skey_acc_mng',
					id : 'skey_acc_mng',
					queryMode : 'local',
					labelWidth : 100,
					margin : '0 0 10 0',
					width : 260,
					store : {
						fields : [ 'key_acc_id', 'key_acc_name' ],
						proxy : {
							type : 'ajax',
							url : 'showKeyAccMng.htm',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'key_acc_id'
							}
						},
						autoLoad : true
					},
					valueField : 'key_acc_id',
					displayField : 'key_acc_name'
				}, {
					fieldLabel : 'E-mail ',
					name : 'scus_email',
					id : 'scus_email',
					labelWidth : 100,
					margin : '0 0 10 0',
					width : 260,
				} ]
			} ]
		} ],

		buttons : [ {
			text : 'Search',
			id : 'searchs',
			handler : function() {
				var form = this.up('form').getForm();

				if (form.isValid()) {

					Ext.Ajax.request({
						url : 'searchCustomerParam.htm' + '?scus_id='+Ext.getCmp('scusid').getValue() + getParamValues(),
						success : function(response, opts) {
							store.searchCustomer.loadPage(1);
						}
					});

				} else {
					console.debug("MemberManagement.js Else conditions");
				}
			}
		}, {
			text : 'Reset',
			handler : function() {
				this.up('form').getForm().reset();
				Ext.getCmp('scusid').setValue("");
			}
		} ]

	});

	panels.grid = Ext.create('Ext.grid.Panel', {
		renderTo : document.body,
		xtype: 'row-expander-grid',
		title : 'Customer',
//		split : true,
//		forceFit : true,
//		loadMask : true,
//		autoWidth : true,
		frame : true,
		store : store.searchCustomer,
		tools : [ {
			xtype : 'button',
			text : 'Add Customer',
			id : 'icreate',
			iconCls : 'icon-add',
			handler : function() {
				Ext.getCmp('akey_acc_mng').setValue(0);
				addCustomer.show();
			}
		} ],
		style : {
			"margin-left" : "auto",
			"margin-right" : "auto",
			"margin-top" : "15px",
			"margin-bottom" : "auto"
		},
		width : 1200,
		height : 500,
		columns : [
				{
					text : "Customer Name",
					flex : 1,
					sortable : true,
					dataIndex : 'cus_name'
				},
				{
					text : "Customer Code",
					flex : 0.6,
					sortable : true,
					dataIndex : 'cus_code'
				},
				{
					text : "ID (Topix)",
					flex : 0.4,
					sortable : true,
					dataIndex : 'topix_cus_id'
				},
				{
					text : "E-mail",
					flex : 1.2,
					sortable : true,
					dataIndex : 'cus_email'
				},
				{
					text : "Contact Person",
					flex : 0.9,
					sortable : true,
					dataIndex : 'contact_person'
				},
				{
					text : "Key Account Mng",
					flex : 0.7,
					sortable : true,
					dataIndex : 'key_acc_name'
				},
				{
					text : "Bill to",
					flex : 0.6,
					sortable : true,
					dataIndex : 'bill_to'
				},
				{
					text : "Terms",
					flex : 0.4,
					sortable : true,
					dataIndex : 'billing_terms'
				},
				{
					text : 'Edit',
					xtype : 'actioncolumn',
					flex : 0.25,
					sortable : false,
					align : 'center',
					id : 'edit',
					items : [ {
						iconCls : 'table-edit',
						handler : function(grid, rowIndex, colIndex) {
							cus_id = grid.getStore().getAt(rowIndex).get('cus_id');
							cus_name = grid.getStore().getAt(rowIndex).get('cus_name');
							cus_code = grid.getStore().getAt(rowIndex).get('cus_code');
							address = grid.getStore().getAt(rowIndex).get('address');
							contact_person = grid.getStore().getAt(rowIndex).get('contact_person');
							key_acc_id = grid.getStore().getAt(rowIndex).get('key_acc_id');
							cus_email = grid.getStore().getAt(rowIndex).get('cus_email');
							cus_phone = grid.getStore().getAt(rowIndex).get('cus_phone');
							bill_to = grid.getStore().getAt(rowIndex).get('bill_to');
							billing_terms = grid.getStore().getAt(rowIndex).get('billing_terms');
							transfer_dtl = grid.getStore().getAt(rowIndex).get('transfer_dtl');
							regist_date = grid.getStore().getAt(rowIndex).get('regist_date');
							topix_cus_id = grid.getStore().getAt(rowIndex).get('topix_cus_id');
							payment_terms = grid.getStore().getAt(rowIndex).get('payment_terms');
							cus_fax = grid.getStore().getAt(rowIndex).get('cus_fax');
							
							Ext.getCmp('ecus_name').setValue(cus_name);
							Ext.getCmp('ecus_code').setValue(cus_code);
							Ext.getCmp('eaddress').setValue(address);
							Ext.getCmp('econtact_person').setValue(contact_person);
							Ext.getCmp('ecus_email').setValue(cus_email);
							Ext.getCmp('ekey_acc_mng').setValue(key_acc_id);
							Ext.getCmp('ecus_id').setValue(cus_id);
							Ext.getCmp('ecus_phone').setValue(cus_phone);
							Ext.getCmp('ecus_fax').setValue(cus_fax);
							Ext.getCmp('ebill_to').setValue(bill_to);
							Ext.getCmp('ebilling_terms').setValue(billing_terms);
							Ext.getCmp('etransfer_dtl').setValue(transfer_dtl);
							Ext.getCmp('eregist_date').setValue(regist_date);
							Ext.getCmp('etopix_cus_id').setValue(topix_cus_id);
							Ext.getCmp('epayment_terms').setValue(payment_terms);
							editCustomer.show();
						}
					} ]
				},
				{
					text : 'Delete',
					xtype : 'actioncolumn',
					flex : 0.3,
					sortable : false,
					align : 'center',
					id : 'del',
					items : [ {
						iconCls : 'icon-delete',
						handler : function(grid, rowIndex, colIndex) {
							cus_id = grid.getStore().getAt(rowIndex).get('cus_id');
							Ext.getCmp('cusid').setValue(cus_id);
							if(userDept == "Manager" || userDept == "Billing" || userDept == "IT"){
								Ext.MessageBox.show({
									title : 'Confirm',
									msg : 'Are you sure you want to delete this?',
									buttons : Ext.MessageBox.YESNO,
									animateTarget : 'del',
									fn : confirmChk,
									icon : Ext.MessageBox.QUESTION
								});
							}else{
								Ext.MessageBox.show({
									title : 'Information',
									msg : 'Please contact Billing Department for delete !',
									buttons : Ext.MessageBox.OK,
									animateTarget : 'del',
									icon : Ext.MessageBox.INFO
								});
							}
						}
					} ]
				}, 
				],
		columnLines : true,
		listeners: {
			viewready: function (grid) {
		        var view = grid.view;
		        this.toolTip = Ext.create('Ext.tip.ToolTip', {
		            target: view.el,
		            delegate: view.cellSelector,
//		            width: 'auto',
//		            autoWidth: true,
		            trackMouse: true,
		            renderTo: Ext.getBody(),
		            listeners: {
		                beforeshow: function(tip) {
		                    var trigger = tip.triggerElement,
		                        parent = tip.triggerElement.parentElement,
		                        columnTitle = view.getHeaderByCell(trigger).text,
		                        columnDataIndex = view.getHeaderByCell(trigger).dataIndex,
		                        columnText = view.getRecord(parent).get(columnDataIndex).toString();
		                    if (columnText){
//		                        tip.update("<b>" + columnTitle + ":</b> " + columnText);
		                        tip.update("<b>"+columnText+"</b>");
		                    } else {
		                        return false;
		                    }
		                }
		            }
		        });
	        }
	    },
		plugins: [{
	        ptype: 'rowexpander',
	        rowBodyTpl : new Ext.XTemplate(
	        		'<p><b>Register date:</b> {regist_date:this.formatDate}</p>',
	        		'<p><b>Adress:</b> {address:this.chkEmpty}</p>',
	        		'<p><b>Phone :</b> {cus_phone:this.chkEmpty}</p>',
	        		'<p><b>Fax :</b> {cus_fax:this.chkEmpty}</p>',
	        		'<p><b>Transfer Detail:</b> <br>{transfer_dtl:this.chkTransfer}</p>',
	        		'<p><b>Payment Terms :</b> {payment_terms} days net</p>',
	        		{
	        			chkEmpty: function(v){
	        				if(v == "" || v == null){
	        					return '-';
	        				}else{
	        					return v;
	        				}
	        			}
	        		},
	        		{
	        			chkTransfer: function(v){
	        				if(v == ""){
	        					return '-';
	        				}else{
	        					return v.replace(/\r\n|\n/gi, "<br>");
	        				}
	        			}
	        		},
	        		{
	        			formatDate: function(v){
	        				if(v == "" || v == null){
	        					return '-';
	        				}else{
//	        					var myDate = v.getFullYear() + "-";
//	        					if((v.getMonth() + 1).length > 1){
//	        						myDate += (v.getMonth() + 1) + "-";
//	        					}else{
//	        						myDate += "0" + (v.getMonth() + 1) + "-";
//	        					}
//	        					if(v.getDate().length > 1){
//	        						myDate += v.getDate();
//	        					}else{
//	        						myDate += "0" + v.getDate();
//	        					}
	        					var options = {
	        						    weekday: "long", year: "numeric", month: "short",
	        						    day: "numeric"
	        						};
	        					return v.toLocaleDateString("en-us", options);
	        				}
	        			}
	        		}
	        )
	    }],
		bbar : Ext.create('Ext.PagingToolbar', {
			store : store.searchCustomer,
			displayInfo : true,
			displayMsg : 'Displaying Customer {0} - {1} of {2}',
			emptyMsg : "No Customer to display",
			plugins : Ext.create('Ext.ux.ProgressBarPager', {})
		})
	});

	Ext.Ajax.request({
		url : 'userModel.htm',
		success: function(response, opts){
			var responseOject = Ext.decode(response.responseText);
			userDept = responseOject.user[0].dept;
			userType = responseOject.user[0].usr_type;
		},
		failure: function(response, opts){
			var responseOject = Ext.util.JSON.decode(response.responseText);
			Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
		}
	});
	
}); //End onReady

Ext.define('cusModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'cus_id',
		type : 'int'
	}, {
		name : 'cus_name',
		type : 'string'
	}, {
		name : 'cus_code',
		type : 'string'
	}, {
		name : 'key_acc_id',
		type : 'int'
	}, {
		name : 'address',
		type : 'string'
	}, {
		name : 'contact_person',
		type : 'string'
	}, {
		name : 'key_acc_name',
		type : 'string'
	}, {
		name : 'cus_email',
		type : 'string'
	}, {
		name : 'cus_phone',
		type : 'string'
	}, {
		name : 'bill_from',
		type : 'string'
	}, {
		name : 'bill_to',
		type : 'string'
	}, {
		name : 'billing_terms',
		type : 'string'
	}, {
		name : 'transfer_dtl',
		type : 'string'
	}, {
		name : 'regist_date',
//		type : 'string'
		type : 'date',
		dateFormat: 'Y-m-d H:i:s'
	}, {
		name : 'topix_cus_id',
		type : 'string'
	}, {
		name : 'payment_terms',
		type : 'int'
	}, {
		name : 'cus_fax',
		type : 'string'
	}

	]
});

store.searchCustomer = Ext.create('Ext.data.JsonStore', {
	model : 'cusModel',
	id : 'cusStore',
	pageSize : 15,
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'searchCustomer.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'cus_id',
			totalProperty : 'total'
		}
	},
// sorters: [{
// property: 'serv',
// direction: 'ASC'
// }]
});

var billingTo = Ext.create('Ext.data.Store', {
	fields: ['name'],
	data : [
	        {"name":"Customer"},
	        {"name":"GSDI (Direct)"},
	        {"name":"GSDI (Angebote)"},
//	        {"name":"GSD"},
	]
});

var billingTerms = Ext.create('Ext.data.Store', {
	fields: ['name'],
	data : [
	        {"name":"Monthly"},
	        {"name":"Biweekly"},
	        {"name":"Project"}
	]
});

editCustomer = new Ext.create('Ext.window.Window', {
	title : 'Edit Customer',
	width : 500,
//	height : 340,
	animateTarget : 'edit',
	modal : true,
	resizable : false,
	closeAction : 'hide',
	items : [ {
		xtype : 'form',
		id : 'editform',
		items : [ {
			xtype : 'fieldset',
			title : 'Customer Information',
			defaultType : 'textfield',
			padding : 10,
			width : 400,
			autoHeight : true,
			style : {
				"margin-left" : "auto",
				"margin-right" : "auto",
				"margin-top" : "10px",
				"margin-bottom" : "12px"
			},
			defaults : {
				anchor : '100%'
			},
			items : [ {
				allowBlank : false,
				fieldLabel : 'Customer Name <font color="red">*</font> ',
				name : 'ecus_name',
				id : 'ecus_name',
				emptyText : 'Customer Name',
				labelWidth : 145,
				msgTarget : 'side',
				// vtype: 'alpha',
				maxLength : 50,
				maxLengthText : 'Maximum input 50 Character',
			}, {
				allowBlank : false,
				fieldLabel : 'Customer Code <font color="red">*</font> ',
				name : 'ecus_code',
				id : 'ecus_code',
				emptyText : 'Customer Code',
				labelWidth : 145,
				msgTarget : 'under',
				vtype : 'alphanum',
				maxLength : 10,
				maxLengthText : 'Maximum input 10 Character',
				listeners: {
	           		 'blur': function(e){
	           			 var cc = Ext.getCmp('ecus_code').getValue();
	           			 Ext.getCmp('ecus_code').setValue(cc.toUpperCase());
	           			 var cus_code = Ext.getCmp('ecus_code').getValue();
	           			 var cus_id = Ext.getCmp('ecus_id').getValue();
	           			 Ext.Ajax.request({
	           				url : 'chkCusCode.htm',
	           				params: {records : cus_code},
	           				success: function(response, opts){
	           					var responseOject = Ext.decode(response.responseText);
	           					if(responseOject.records[0].cus_id != 0){
	           						if(responseOject.records[0].cus_id != cus_id){
	           							Ext.getCmp('ecus_code').setValue('');
	           							Ext.getCmp('ecus_code').markInvalid('"'+cus_code+'" has been used');
	           						}
	           					}
	           				},
	           				failure: function(response, opts){
	           					var responseOject = Ext.util.JSON.decode(response.responseText);
	           					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
	           				}
	           			});
	           		 }
	           	 }
			}, {
				allowBlank : true,
				fieldLabel : 'Contact Person ',
				name : 'econtact_person',
				id : 'econtact_person',
				emptyText : 'Contact Person',
				labelWidth : 145,
				msgTarget : 'side',
				// vtype: 'phone',
				maxLength : 60,
				maxLengthText : 'Maximum input 60 Character',
			}, {
				xtype : 'textareafield',
				allowBlank : true,
				fieldLabel : 'Address ',
				name : 'eaddress',
				id : 'eaddress',
				emptyText : 'Address',
				labelWidth : 145,
				msgTarget : 'side',
				maxLength : 150,
				maxLengthText : 'Maximum input 150 Character',
			}, {
				allowBlank : true,
				fieldLabel : 'Phone Number ',
				name : 'ecus_phone',
				id : 'ecus_phone',
				emptyText : 'Phone Number',
				labelWidth : 145,
				msgTarget : 'under',
				vtype: 'ephone',
				maxLength : 50,
				maxLengthText : 'Maximum input 50 Character',
			}, {
				allowBlank : true,
				fieldLabel : 'Fax Number ',
				name : 'ecus_fax',
				id : 'ecus_fax',
				emptyText : 'Fax Number',
				labelWidth : 145,
				msgTarget : 'under',
				vtype: 'ephone',
				maxLength : 50,
				maxLengthText : 'Maximum input 50 Character',
			}, {
				allowBlank : true,
				fieldLabel : 'E-mail ',
				name : 'ecus_email',
				id : 'ecus_email',
				emptyText : 'E-mail',
				labelWidth : 145,
				msgTarget : 'side',
				vtype: 'email',
				maxLength : 50,
				maxLengthText : 'Maximum input 50 Character',
			}, {
				xtype : 'combobox',
				// margin: '10 0 0 30',
				labelWidth : 145,
				// width: 300,
				fieldLabel : 'Key Account Mng',
				name : 'ekey_acc_mng',
				id : 'ekey_acc_mng',
				msgTarget : 'side',
				emptyText : 'Key Account Mng',
				editable : false,
				store : {
					fields : [ 'key_acc_id', 'key_acc_name' ],
					proxy : {
						type : 'ajax',
						url : 'showKeyAccMng.htm',
						reader : {
							type : 'json',
							root : 'records',
							idProperty : 'key_acc_id'
						}
					},
					autoLoad : true
				},
				valueField : 'key_acc_id',
				displayField : 'key_acc_name'
			},{
				xtype: 'combobox',
				fieldLabel: 'Billing To <font color="red">*</font> ',
				name: 'ebill_to',
				id: 'ebill_to',
				labelWidth: 145,
				store : {
					fields : ['db_ref_name'],
					proxy : {
						type : 'ajax',
						url : 'showDBReference.htm?kind=CusBillTo&dept=-',
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
			},{
				xtype : 'combobox',
				labelWidth : 145,
				fieldLabel : 'Billing Terms',
				name : 'ebilling_terms',
				id : 'ebilling_terms',
				emptyText : 'Billing Terms',
				editable : false,
				store : billingTerms,
				valueField : 'name',
				displayField : 'name'
			}, {
				xtype: 'numberfield',
				allowBlank: false,
				fieldLabel: 'Payment Terms <font color="red">*</font> ',
				name: 'epayment_terms',
				id : 'epayment_terms',
				labelWidth : 145,
				minValue : 0,
				value : 0,
//				hideTrigger: true,
				msgTarget : 'under',
			}, {
				xtype : 'textareafield',
				allowBlank : true,
				fieldLabel : 'Transfer Detail ',
				name : 'etransfer_dtl',
				id : 'etransfer_dtl',
				emptyText : 'Transfer Detail',
				labelWidth : 145,
				msgTarget : 'side',
				maxLength : 200,
				maxLengthText : 'Maximum input 200 Character',
			}, {
				xtype: 'datefield',
				allowBlank : true,
				fieldLabel : 'Register Date ',
				name : 'eregist_date',
				id : 'eregist_date',
				labelWidth : 145,
				emptyText : 'Register Date',
				editable: false,
				format: 'Y-m-d',
			}, {
//				xtype: 'numberfield',
				allowBlank: false,
				fieldLabel: 'Customer ID(Topix) <font color="red">*</font> ',
				name: 'etopix_cus_id',
				id : 'etopix_cus_id',
				labelWidth : 145,
				emptyText : 'Customer ID(Topix)',
//				minValue : 0,
//				hideTrigger: true,
//				msgTarget : 'under',
			}, {
				xtype : 'hidden',
				id : 'ecus_id',
				name : 'ecus_id'
			} ]
		} ],
	} ],
	buttons : [
			{
				text : 'Update',
				width : 100,
				id : 'ebtn',
				handler : function() {
					var form = Ext.getCmp('editform').getForm();
					if (form.isValid()) {
						form.submit({
							url : 'updateCustomer.htm',
							waitTitle : 'Update Customer',
							waitMsg : 'Please wait...',
							standardSubmit : false,
							success : function(form, action) {
								Ext.MessageBox.show({
									title : 'Information',
									msg : 'Customer Has Been Updated!',
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO,
									animateTarget : 'ebtn',
									fn : function() {
										editCustomer.hide();
										store.searchCustomer.reload();
									}
								});
							},
							failure : function(form, action) {
//								Ext.Msg.alert('Failed',
//										action.result ? action.result.message
//												: 'No response');
								Ext.MessageBox.show({
				                    title: 'REMOTE EXCEPTION',
				                    msg: operation.getError(),
				                    icon: Ext.MessageBox.ERROR,
				                    buttons: Ext.Msg.OK,
				                    fn: function(){location.reload()}
				                });
							}
						});
					} else {
						Ext.MessageBox.show({
							title : 'Failed',
							msg : ' Please Insert All Required Field',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR,
							animateTarget : 'ebtn',
						});
					}
				}
			},{
				text : 'Reset',
				width : 100,
				handler : function() {
					Ext.getCmp('editform').getForm().reset();
				}
			} ],
	listeners : {
		'beforehide' : function() {
			Ext.getCmp('editform').getForm().reset();
		}
	}
});

addCustomer = new Ext.create('Ext.window.Window', {
	title : 'Add Customer',
	id : 'addCusForm',
	animateTarget : 'icreate',
	modal : true,
	resizable : false,
	closeAction : 'hide',
	// autoScroll:true,
	width : 500,
	//height : 340,

	items : [ {
		xtype : 'form',
		id : 'addform',
		items : [ {
			xtype : 'fieldset',
			title : 'Customer Information',
			defaultType : 'textfield',
			padding : 10,
			width : 400,
			autoHeight : true,
			style : {
				"margin-left" : "auto",
				"margin-right" : "auto",
				"margin-top" : "10px",
				"margin-bottom" : "12px"
			},
			defaults : {
				anchor : '100%'
			},
			items : [ {
				allowBlank : false,
				fieldLabel : 'Customer Name <font color="red">*</font> ',
				name : 'acus_name',
				id : 'acus_name',
				emptyText : 'Customer Name',
				labelWidth : 145,
				msgTarget : 'side',
				// vtype: 'alpha',
				maxLength : 50,
				maxLengthText : 'Maximum input 50 Character',
			}, {
				allowBlank : false,
				fieldLabel : 'Customer Code <font color="red">*</font> ',
				name : 'acus_code',
				id : 'acus_code',
				emptyText : 'Customer Code',
				labelWidth : 145,
				msgTarget : 'under',
				vtype : 'alphanum',
				maxLength : 10,
				maxLengthText : 'Maximum input 10 Character',
				listeners: {
	           		 'blur': function(e){
	           			 var cc = Ext.getCmp('acus_code').getValue();
	           			 Ext.getCmp('acus_code').setValue(cc.toUpperCase());
	           			var cus_code = Ext.getCmp('acus_code').getValue();
	           			 Ext.Ajax.request({
	           				url : 'chkCusCode.htm',
	           				params: {records : cus_code},
	           				success: function(response, opts){
	           					var responseOject = Ext.decode(response.responseText);
	           					if(responseOject.records[0].cus_id != 0){
	           						Ext.getCmp('acus_code').setValue('');
	           						Ext.getCmp('acus_code').markInvalid('"'+cus_code+'" has been used');
	           					}
	           				},
	           				failure: function(response, opts){
	           					var responseOject = Ext.util.JSON.decode(response.responseText);
	           					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
	           				}
	           			});
	           		 }
	           	 }
			}, {
				allowBlank : true,
				fieldLabel : 'Contact Person ',
				name : 'acontact_person',
				id : 'acontact_person',
				emptyText : 'Contact Person',
				labelWidth : 145,
				msgTarget : 'side',
				// vtype: 'phone',
				maxLength : 60,
				maxLengthText : 'Maximum input 60 Character',
			}, {
				xtype : 'textareafield',
				allowBlank : true,
				fieldLabel : 'Address ',
				name : 'aaddress',
				id : 'aaddress',
				emptyText : 'Address',
				labelWidth : 145,
				msgTarget : 'side',
				maxLength : 150,
				maxLengthText : 'Maximum input 150 Character',
			}, {
				allowBlank : true,
				fieldLabel : 'Phone Number ',
				name : 'acus_phone',
				id : 'acus_phone',
				emptyText : 'Phone Number',
				labelWidth : 145,
				msgTarget : 'under',
				vtype: 'ephone',
				maxLength : 50,
				maxLengthText : 'Maximum input 50 Character',
			}, {
				allowBlank : true,
				fieldLabel : 'Fax Number ',
				name : 'acus_fax',
				id : 'acus_fax',
				emptyText : 'Fax Number',
				labelWidth : 145,
				msgTarget : 'under',
				vtype: 'ephone',
				maxLength : 50,
				maxLengthText : 'Maximum input 50 Character',
			}, {
				allowBlank : true,
				fieldLabel : 'E-mail ',
				name : 'acus_email',
				id : 'acus_email',
				emptyText : 'E-mail',
				labelWidth : 145,
				msgTarget : 'side',
				vtype: 'email',
				maxLength : 50,
				maxLengthText : 'Maximum input 50 Character',
			}, {
				xtype : 'combobox',
				// margin: '10 0 0 30',
				labelWidth : 145,
				// width: 300,
				fieldLabel : 'Key Account Mng',
				name : 'akey_acc_mng',
				id : 'akey_acc_mng',
				msgTarget : 'side',
				emptyText : 'Key Account Mng',
				editable : false,
				store : {
					fields : [ 'key_acc_id', 'key_acc_name' ],
					proxy : {
						type : 'ajax',
						url : 'showKeyAccMng.htm',
						reader : {
							type : 'json',
							root : 'records',
							idProperty : 'key_acc_id'
						}
					},
					autoLoad : true
				},
				valueField : 'key_acc_id',
				displayField : 'key_acc_name'
//			},{
//				xtype : 'combobox',
//				labelWidth : 145,
//				fieldLabel : 'Billing To',
//				name : 'abill_to',
//				id : 'abill_to',
//				emptyText : 'Billing To',
//				editable : false,
//				store : billingTo,
//				valueField : 'name',
//				displayField : 'name'
			},{
				xtype: 'combobox',
				fieldLabel: 'Billing To <font color="red">*</font> ',
				name: 'abill_to',
				id: 'abill_to',
				labelWidth: 145,
				store : {
					fields : ['db_ref_name'],
					proxy : {
						type : 'ajax',
						url : 'showDBReference.htm?kind=CusBillTo&dept=-',
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
				xtype : 'combobox',
				labelWidth : 145,
				fieldLabel : 'Billing Terms',
				name : 'abilling_terms',
				id : 'abilling_terms',
				emptyText : 'Billing Terms',
				editable : false,
				store : billingTerms,
				valueField : 'name',
				displayField : 'name'
			}, {
				xtype: 'numberfield',
				allowBlank: false,
				fieldLabel: 'Payment Terms <font color="red">*</font> ',
				name: 'apayment_terms',
				id : 'apayment_terms',
				labelWidth : 145,
				minValue : 0,
				value : 0,
//				hideTrigger: true,
				msgTarget : 'under',
			}, {
				xtype : 'textareafield',
				allowBlank : true,
				fieldLabel : 'Transfer Detail ',
				name : 'atransfer_dtl',
				id : 'atransfer_dtl',
				emptyText : 'Transfer Detail',
				labelWidth : 145,
				msgTarget : 'side',
				maxLength : 200,
				maxLengthText : 'Maximum input 200 Character',
			}, {
				xtype: 'datefield',
				allowBlank : true,
				fieldLabel : 'Register Date ',
				name : 'aregist_date',
				id : 'aregist_date',
				labelWidth : 145,
				emptyText : 'Register Date',
				editable: false,
				format: 'Y-m-d',
			}, {
//				xtype: 'numberfield',
				allowBlank: false,
				fieldLabel: 'Customer ID(Topix) <font color="red">*</font> ',
				name: 'atopix_cus_id',
				id : 'atopix_cus_id',
				labelWidth : 145,
				emptyText : 'Customer ID(Topix)',
//				minValue : 0,
//				value : 0,
//				hideTrigger: true,
//				msgTarget : 'under',
			} ]
		} ],
	} ],
	buttons : [
			{
				text : 'Add',
				id : 'btnRegist',
				handler : function() {
					var form = Ext.getCmp('addform').getForm();
					if (form.isValid()) {
						form.submit({
							url : 'addCustomer.htm',
							waitTitle : 'Adding Customer',
							waitMsg : 'Please wait...',
							standardSubmit : false,
							success : function(form, action) {
								Ext.MessageBox.show({
									title : 'Information',
									msg : 'Customer Has Been Created!',
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO,
									animateTarget : 'btnRegist',
									fn : function() {
										addCustomer.hide();
										store.searchCustomer.reload();
										Ext.getCmp('scus_name').getStore().reload();
										Ext.getCmp('scus_code').getStore().reload();
									}
								});
							},
							failure : function(form, action) {
//								Ext.Msg.alert('Failed',
//										action.result ? action.result.message
//												: 'No response');
								Ext.MessageBox.show({
				                    title: 'REMOTE EXCEPTION',
				                    msg: operation.getError(),
				                    icon: Ext.MessageBox.ERROR,
				                    buttons: Ext.Msg.OK,
				                    fn: function(){location.reload()}
				                });
							}
						});
					} else {
						Ext.MessageBox.show({
							title : 'Failed',
							msg : ' Please Insert All Field',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR,
							animateTarget : 'btnRegist',
						});
					}
				}
			},{
				text : 'Reset',
				handler : function() {
					Ext.getCmp('addform').getForm().reset();
				}
			} ],
	listeners : {
		'beforehide' : function() {
			Ext.getCmp('addform').getForm().reset();
		}
	}
});

function confirmChk(btn) {
	if (btn == "yes") {
		Ext.Ajax.request({
					url : 'deleteCustomer.htm',
					params : {
						id : Ext.getCmp('cusid').getValue()
					},
					success : function(response, opts) {
						// window.location = "memberManagement.htm";
						Ext.MessageBox.show({
							title : 'Infomation',
							msg : 'Customer has been deleted!',
							buttons : Ext.MessageBox.OK,
							animateTarget : 'del',
							fn : function(){
								store.searchCustomer.reload();
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
	var prefix = "&";
	var queryStr = "";
	var i = 1;
	var count = 0;

	for (param in panels.search.getValues()) {

		count += panels.search.getValues()[param].length;
		
		var myValue = panels.search.getValues()[param];
		try{
		var n = myValue.indexOf("&");
		if (n !== -1) {
			myValue = myValue.replace("&","%26");
		}
		} catch(err){
			console.log(err);
		}
		
//		alert(myValue);
		
		if (i == 1) {
//			queryStr += param + "=" + panels.search.getValues()[param];
			queryStr += param + "=" + myValue;
		} else {
//			queryStr += "&" + param + "=" + panels.search.getValues()[param];
			queryStr += "&" + param + "=" + myValue;
		}

		i++;
	}

	if (count == 0) {
		url = "";
	} else {
		url = prefix + queryStr;
	}

	url = encodeURI(url);
	url = url.replace("%2526", "%26");
	
//	return encodeURI(url);
	return url;
}