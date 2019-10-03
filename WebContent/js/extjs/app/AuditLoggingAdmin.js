store = {};
panels = {};

Ext.onReady(function() {

	panels.search = Ext.create('Ext.form.Panel', {
		title : 'Search Criteria',
		autoWidth : true,
		id : 'formPanel',
		width : 800,
		height : 175,
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
				border : false,
				layout : 'anchor',
				style : {
					"margin-left" : "50px",
					"margin-right" : "auto",
					"margin-top" : "10px",
					"margin-bottom" : "10px"
				},
				defaultType : 'textfield',
				items : [ 
				    {
				    	fieldLabel : 'Reference ',
				    	name : 'sparent_ref',
				    	id : 'sparent_ref',
				    	labelWidth : 110,
						margin : '0 0 10 0',
						width : 340,
						emptyText : 'Reference'
				    },     
					{
						fieldLabel : 'Update Date ',
						name : 'scommit_date',
						id : 'scommit_date',
						combineErrors: true,
						xtype: 'fieldcontainer',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 350,
						layout: 'hbox',
		                defaults: {
		                    flex: 1,
		                },
		                items: [
		                    {
		                        xtype     : 'datefield',
		                        name      : 'commit_start',
		                        id	: 'commit_start',
		                        labelSeparator : '',
		                        margin: '0 0 0 0',
		                        msgTarget : 'side',
		                        width: 50,
		                        editable: false,
		                        format: 'Y-m-d',
		                        maxValue: new Date(),
		                        emptyText : 'Start',
		                        listeners: {
		                        	   "change": function () {
		                        		   			var startDate = Ext.getCmp('commit_start').getRawValue();
		                        		   			Ext.getCmp('commit_finish').setMinValue(startDate);
		                        	   }
		                        }
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
		                        xtype     : 'datefield',
		                        margin: '0 10 0 -80',	
		                        name      : 'commit_finish',
		                        id	: 'commit_finish',
		                        labelSeparator : '',
		                        msgTarget : 'side',
		                        width: 50,
		                        editable: false,
		                        format: 'Y-m-d',
		                        maxValue: new Date(),
		                        emptyText : 'Finish',
		                        listeners: {
		                        	"change": function () {
		                        		   	var endDate = Ext.getCmp('commit_finish').getRawValue();
		                           			Ext.getCmp('commit_start').setMaxValue(endDate);
		                        	}
		                        }
		                    }
		                ]
					} ]
			}, {
				columnWidth : 0.33,
				style : {
					"margin-left" : "-80px",
					"margin-right" : "10px",
					"margin-top" : "10px",
				},
				border : false,
				layout : 'anchor',
				defaultType : 'textfield',
				items : [ 
//				{
//					xtype : 'combobox',
//					fieldLabel : 'Department ',
//					name : 'sdept',
//					id : 'sdept',
//					queryMode : 'local',
//					labelWidth : 110,
//					emptyText : 'Department',
//					editable : false,
//					width : 300,
//					margin : '0 0 10 0',
//					msgTarget: 'under',
//					store : {
//						fields : ['db_ref_name'],
//						proxy : {
//							type : 'ajax',
//							url : 'showDepartment.htm',
//							reader : {
//								type : 'json',
//								root : 'records',
//							}
//						},
//						autoLoad : true
//					},
//					valueField : 'db_ref_name',
//					displayField : 'db_ref_name',
//					listeners : {
//						select : function() {
//							var dept = Ext.getCmp('sdept').getValue();
//							var process = Ext.getCmp('sprocess');
//							
//							process.clearValue();
//							process.getStore().removeAll();
//							process.getStore().load({
//								url: 'showTimeRecordReference.htm?kind=Process&dept='+dept
//							});
//						}
//					}
//				},
				{
					xtype : 'combobox',
					fieldLabel : 'Object ',
					name : 'sparent_object',
					id : 'sparent_object',
					queryMode : 'local',
					labelWidth : 110,
					emptyText : 'Object',
					editable : false,
					width : 300,
					margin : '0 0 10 0',
					msgTarget: 'under',
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showDBReference.htm?kind=LoggingObject&dept=-',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name'
				},
				{
					xtype : 'combobox',
					fieldLabel : 'Operation ',
					name : 'scommit_type',
					id : 'scommit_type',
					queryMode : 'local',
					labelWidth : 110,
					editable : false,
					emptyText : 'Operation',
					width : 300,
					magin : '0 0 10 0',
//					store : 'jobStatus',
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showDBReference.htm?kind=LoggingType&dept=-',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
				}  ]
			} ]
		} ],

		buttons : [ {
			text : 'Search',
			id : 'search_auddit',
			handler : function() {
				var form = this.up('form').getForm();
				if (form.isValid()) {
//					Ext.getCmp('ireport').setDisabled(false);
					Ext.Ajax.request({
						url : 'searchAudditParam.htm?first_aud='+ getParamValues(),
						success : function(response, opts) {
							store.audditLogging.loadPage(1);
						}
					});

				} else {
					Ext.MessageBox.show({
						title : 'Failed',
						msg : ' Please Check On Invalid Field!',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR,
						animateTarget : 'search_auddit',
					});
					console.debug("AudditLoggingAdmin.js - Search else conditions");
				}
			}
		}, {
			text : 'Reset',
			handler : function() {
				this.up('form').getForm().reset();
				Ext.getCmp('commit_start').setMaxValue(new Date());
				Ext.getCmp('commit_finish').setMinValue('');
			}
		} ]

	});

	
	panels.audditLogging = Ext.create('Ext.grid.Panel', {
		frame : true,
		title : 'History State',
//		bodyPadding : 5,
		renderTo : document.body,
		width : 1200,
		height : 687,
//		forceFit : true,
//		autoWidth : true,
		columnLines : true,
		loadMask: true,
        selModel: {
            pruneRemoved: false
        },
        multiSelect: true,
        viewConfig: {
            trackOver: false
        },
        features:[{
            ftype: 'grouping',
            hideGroupedHeader: false
        }],
		style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "30px",
            "margin-bottom": "20px"
        },
		store : store.audditLogging,
		columns : [ {
			text : 'Object Name',
			flex : 2,
			sortable : true,
			dataIndex : 'parent_type'
		}, {
			text : 'Reference',
			flex : 2.5,
			sortable : true,
			dataIndex : 'parent_ref'
		}, {
			text : 'Field Name',
			flex : 1.5,
			sortable : true,
			dataIndex : 'field_name'
		}, {
			text : 'Old Value',
			flex : 2,
			sortable : true,
			dataIndex : 'old_value'
		}, {
			text : 'New Value',
			flex : 2,
			sortable : true,
			dataIndex : 'new_value'
		}, {
			text : 'Updated by',
			flex : 1,
			sortable : true,
			dataIndex : 'commit_by'
		}, {
			text : 'Updated Date',
			flex : 1.2,
			sortable : true,
			dataIndex : 'commit_date',
			renderer: Ext.util.Format.dateRenderer('Y-m-d')
		}, {
			text : 'Operation',
			flex : 1,
			sortable : true,
			dataIndex : 'commit_type'
		}
		],
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
		                        tip.update("<b>"+(columnText.replace(/\r\n|\n/gi, "<br>"))+"</b>");
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
	        		'<head><META HTTP-EQUIV="content-type" CONTENT="text/html; charset=utf-8"></head>{commit_desc:this.myDesc}',
	        		{
	        			myDesc: function(v){
	        				if(v.length > 7){
	        					myText = v.replace(/, code=/gi, "<br>Code = ");
	        					myText = myText.replace(/, key_account=/gi, "<br>Key Account Manager = ");
	        					myText = myText.replace(/, address=/gi, "<br>Address = ");
	        					myText = myText.replace(/, contact_person=/gi, "<br>Contact Person = ");
	        					myText = myText.replace(/, e-mail=/gi, "<br>E-mail = ");
	        					myText = myText.replace(/, phone=/gi, "<br>Phone = ");
	        					myText = myText.replace(/, bill_to=/gi, "<br>Bill to = ");
	        					myText = myText.replace(/, payment=/gi, "<br>Payment = ");
	        					myText = myText.replace(/, transfer_dtl=/gi, "<br>Transfer detail = ");
	        					myText = myText.replace(/, regist_date=/gi, "<br>Register Date = ");
	        					myText = myText.replace(/, desc=/gi, "<br>Description = ");
	        					myText = myText.replace(/, customer=/gi, "<br>Customer = ");
	        					myText = myText.replace(/, file_Name=/gi, "<br>File Name = ");
	        					myText = myText.replace(/, target_time=/gi, "<br>Target Time = ");
	        					myText = myText.replace(/, actual_time=/gi, "<br>Actual Time = ");
	        					myText = myText.replace(/, price=/gi, "<br>Price = ");
	        					myText = myText.replace(/, currency=/gi, "<br>Currency = ");
	        					myText = myText.replace(/, item_desc=/gi, "<br>Description = ");
	        					myText = myText.replace(/, job_dtl=/gi, "<br>Description = ");
	        					myText = myText.replace(/, job_status=/gi, "<br>Status = ");
	        					myText = myText.replace(/, dept=/gi, "<br>Department = ");
	        					myText = myText.replace(/, Item name=/gi, "<br>Item Name = ");
	        					myText = myText.replace(/, amount=/gi, "<br>Amount = ");
	        					myText = myText.replace(/, job_in=/gi, "<br>Date in = ");
	        					myText = myText.replace(/, job_out=/gi, "<br>Date out = ");
	        					myText = myText.replace(/, job_ref_dtl=/gi, "<br>Description = ");
	        					myText = myText.replace(/, job_ref_number=/gi, "<br>Job Number = ");
	        					myText = myText.replace(/, job_ref_type=/gi, "<br>Job Type = ");
	        					myText = myText.replace(/, inv_proj_no=/gi, "<br>Project Number = ");
	        					myText = myText.replace(/, inv_delivery_date=/gi, "<br>Delivery Date= ");
	        					myText = myText.replace(/, inv_payment_terms=/gi, "<br>Payment Term= ");
	        					myText = myText.replace(/, inv_vat=/gi, "<br>Vat(%)= ");
	        					myText = myText.replace(/, inv_bill_type=/gi, "<br>Billing Type= ");
	        					myText = myText.replace(/, topix_cus_id=/gi, "<br>Customer ID(Topix) = ");
	        					myText = myText.replace(/, topix_article_id=/gi, "<br>Article ID(Topix) = ");
	        					myText = myText.replace(/, inv_ref_qty=/gi, "<br>QTY = ");
	        					myText = myText.replace(/, inv_ref_desc=/gi, "<br>Remark = ");
	        					myText = myText.replace(/, tpx_cfg_id=/gi, "<br>Topix Server = ");
	        					myText = myText.replace(/, tpx_cus_id=/gi, "<br>Customer ID = ");
	        					myText = myText.replace(/, tpx_date=/gi, "<br>Topix Date = ");
	        					myText = myText.replace(/, tpx_res_nr=/gi, "<br>Response Number = ");
	        					myText = myText.replace(/, tpx_res_msg=/gi, "<br>Response Text = ");
	        					myText = myText.replace(/, tpx_inv_number=/gi, "<br>Topix Number = ");
	        					myText = myText.replace(/, tpx_ref_info=/gi, "<br>Topix Item = ");
	        					myText = myText.replace(/, inv_discount=/gi, "<br>Discount(%) = ");
	        					myText = myText.replace(/, activated=/gi, "<br>Activated = ");
	        					myText = myText.replace(/, fname=/gi, "<br>First Name = ");
	        					myText = myText.replace(/, lname=/gi, "<br>Last Name = ");
	        					myText = myText.replace(/, usr_type=/gi, "<br>User Type = ");
	        					myText = myText.replace(/, usr_activate=/gi, "<br>User Activate = ");
	        					myText = myText.replace(/Item List/gi, "Item");
	        					myText = myText.replace('Created row on ', "");
	        					myText = myText.replace('Created ', "");
	        					myText = myText.replace('Error on ', "");
	        					myText = myText.replace(/usr_name=/gi, "User Name = ");
	        					myText = myText.replace(/name=/gi, "Name = ");
	        					myText = myText.replace(/\r\n|\n/gi, " ");
//
	        					var res = myText.split("<br>");
	        					var test = new Array();
	        					for (var i = 0; i < res.length; i++) {
	        						var x = res[i].split("=");
	        						if(x.length == 2){
	        							test.push("<b>"+x[0]+"</b>");
	        							test.push(x[1]);
	        						}else{
	        							var y = res[i].split(" on ");
	        							var y1 = y[0].split("=");
	        							var y2 = y[1].split("=");
	        							test.push("<b>"+y1[0]+"</b>");
	        							test.push(y1[1]);
	        							test.push("<b>"+y2[0]+"</b>");
	        							test.push(y2[1]);
	        						}
	        					};
	        					var sumText = test.toString();
	        					sumText = sumText.replace(/<\/b>,/gi, "</b> = ");
	        					sumText = sumText.replace(/,<b>/gi, "<br><b>");

	        					return sumText;
	        				}else{
	        					return '<b>'+v+'</b>';
	        				}
	        			}
	        		}
	        )
	    }],
		bbar : Ext.create('Ext.PagingToolbar', {
			store : store.audditLogging,
			displayInfo : true,
			displayMsg : 'Displaying Logs {0} - {1} of {2}',
			emptyMsg : "No Logs to display",
			plugins : Ext.create('Ext.ux.ProgressBarPager', {})
		})

	});
	
	Ext.Ajax.request({
		url : 'searchAudditParam.htm?first_aud=yes',
		success : function(response, opts) {
			store.audditLogging.loadPage(1);
		}
	});
	
});

Ext.define('logModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'aud_id',
		type : 'int'
	}, {
		name : 'parent_id',
		type : 'int'
	}, {
		name : 'parent_object',
		type : 'string'
	}, {
		name : 'commit_by',
		type : 'string'
	}, {
		name : 'commit_date',
		type : 'date',
		dateFormat: 'Y-m-d H:i:s.u'
	}, {
		name : 'field_name',
		type : 'string'
	}, {
		name : 'old_value',
		type : 'string'
	}, {
		name : 'new_value',
		type : 'string'
	}, {
		name : 'commit_desc',
		type : 'string'
	}, {
		name : 'parent_ref',
		type : 'string'
	}, {
		name : 'commit_type',
		type : 'string'
	}, {
		name : 'parent_type',
		type : 'string'
	}

	]
});

store.audditLogging = Ext.create('Ext.data.JsonStore', {
	model : 'logModel',
	id : 'logStore',
	pageSize : 100,
//	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'searchAuditLogging.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'aud_id',
			totalProperty : 'total'
		}
	},
});

function getParamValues() {
	var url = "";
	var param = "";
	var prefix = "&";
	var queryStr = "";
	var i = 1;
	var count = 0;

	for (param in panels.search.getValues()) {

		count += panels.search.getValues()[param].length;

		if (i == 1) {
			queryStr += param + "=" + panels.search.getValues()[param];
		} else {
			queryStr += "&" + param + "=" + panels.search.getValues()[param];
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