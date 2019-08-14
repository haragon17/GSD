store = {};
panels = {};

Ext.onReady(function() {

	panels.search = Ext.create('Ext.form.Panel', {
		title : 'Search Criteria',
		autoWidth : true,
		id : 'formPanel',
		width : 800,
		height : 275,
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
				    	fieldLabel : 'File Name ',
				    	name : 'str_name',
				    	id : 'str_name',
				    	labelWidth : 110,
						margin : '0 0 10 0',
						width : 340,
						emptyText : 'File Name'
				    },
				    {
				    	fieldLabel : 'Job Name ',
				    	name : 'sjob_ref_name',
				    	id : 'sjob_ref_name',
				    	labelWidth : 110,
						margin : '0 0 10 0',
						width : 340,
						emptyText : 'Job Name'
				    },
//					{
//						xtype: 'combobox',
//						fieldLabel : 'Job Name ',
//						name : 'sjob_ref_id',
//						id : 'sjob_ref_id',
//						queryMode : 'local',
//						labelWidth : 110,
//						margin : '0 0 10 0',
//						width : 340,
//						emptyText : 'Job Name',
//						store : {
//							fields : [ 'job_ref_id', 'job_ref_name' ],
//							proxy : {
//								type : 'ajax',
//								url : 'showJobRef.htm?id=0&type=0',
//								reader : {
//									type : 'json',
//									root : 'records',
//									idProperty : 'job_ref_id'
//								}
//							},
//							autoLoad : true,
//							sorters: [{
//						         property: 'itm_name',
//						         direction: 'ASC'
//						     }]
//						},
//						valueField : 'job_ref_id',
//						displayField : 'job_ref_name',
//						listeners : {
//							blur : function() {
//								var v = this.getValue();
//								var record = this.findRecord(this.valueField || this.displayField, v);
//								if(record == false){
//									Ext.getCmp('sjob_ref_id').setValue("");
//								}
//							}
//						}
//					},
					{
						xtype: 'combobox',
						fieldLabel : 'Process Type ',
						name : 'sprocess',
						id : 'sprocess',
						queryMode : 'local',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 340,
						editable : false,
						emptyText : 'Process Type',
						store : {
							fields : ['tr_ref_name'],
							proxy : {
								type : 'ajax',
								url : 'showTimeRecordReference.htm?kind=Process&dept=0',
								reader : {
									type : 'json',
									root : 'records',
								}
							},
							autoLoad : true
						},
						valueField : 'tr_ref_name',
						displayField : 'tr_ref_name'
					},
					{
						xtype: 'combobox',
						fieldLabel : 'User Name ',
						name : 'susr_id',
						id : 'susr_id',
						queryMode : 'local',
						labelWidth : 110,
						margin : '0 0 10 0',
						width : 340,
//						editable : false,
						emptyText : 'User Name',
						store : {
							fields : [ 'usr_id', 'usr_name' ],
							proxy : {
								type : 'ajax',
								url : 'showUser.htm?dept=',
								reader : {
									type : 'json',
									root : 'records',
									idProperty : 'usr_id'
								}
							},
							autoLoad : true
						},
						valueField : 'usr_id',
						displayField : 'usr_name',
						listeners : {
							blur : function() {
								var v = this.getValue();
								var record = this.findRecord(this.valueField || this.displayField, v);
								if(record == false){
									Ext.getCmp('susr_id').setValue("");
								}
							}
						}
					},
//					{
//						xtype : 'combobox',
//						fieldLabel : 'Department ',
//						name : 'sdept',
//						id : 'sdept',
//						queryMode : 'local',
//						labelWidth : 110,
//						emptyText : 'Department',
//						editable : false,
//						width : 340,
//						margin : '0 0 10 0',
//						msgTarget: 'under',
//						store : department,
//						valueField : 'name',
//						displayField : 'name'
//					},
					{
						fieldLabel : 'Record Date ',
						name : 'srecord_date',
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
		                        name      : 'record_start',
		                        id	: 'record_start',
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
		                        		   			var startDate = Ext.getCmp('record_start').getRawValue();
		                        		   			Ext.getCmp('record_finish').setMinValue(startDate);
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
		                        name      : 'record_finish',
		                        id	: 'record_finish',
		                        labelSeparator : '',
		                        msgTarget : 'side',
		                        width: 50,
		                        editable: false,
		                        format: 'Y-m-d',
		                        maxValue: new Date(),
		                        emptyText : 'Finish',
		                        listeners: {
		                        	"change": function () {
		                        		   	var endDate = Ext.getCmp('record_finish').getRawValue();
		                           			Ext.getCmp('record_start').setMaxValue(endDate);
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
//					xtype: 'combobox',
//					fieldLabel : 'Item Name ',
//					name : 'sitm_id',
//					id : 'sitm_id',
//					queryMode : 'local',
//					labelWidth : 110,
//					margin : '0 0 10 0',
//					width : 280,
//					emptyText : 'Item Name',
//					store : {
//						fields : [ 'itm_id', 'itm_name' ],
//						proxy : {
//							type : 'ajax',
//							url : 'showItem.htm?id=0',
//							reader : {
//								type : 'json',
//								root : 'records',
//								idProperty : 'itm_id'
//							}
//						},
//						autoLoad : true,
//						sorters: [{
//					         property: 'itm_name',
//					         direction: 'ASC'
//					     }]
//					},
//					valueField : 'itm_id',
//					displayField : 'itm_name',
//					listeners : {
//						blur : function() {
//							var v = this.getValue();
//							var record = this.findRecord(this.valueField || this.displayField, v);
//							if(record == false){
//								Ext.getCmp('sitm_id').setValue("");
//							}
//						}
//					}
//				},
				{
					xtype : 'combobox',
					fieldLabel : 'Customer Name ',
					name : 'scus_name',
					id: 'scus_name',
					queryMode : 'local',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 300,
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
							
//							var item = Ext.getCmp('sitm_id');
//							item.clearValue();
//							item.getStore().removeAll();
							var proj = Ext.getCmp('sproj_id');
							proj.clearValue();
							proj.getStore().removeAll();
							proj.getStore().load({
								url: 'showProjects.htm?type=all&id='+myId
							});
							
//							var job_ref = Ext.getCmp('sjob_ref_id');
//							job_ref.clearValue();
//							job_ref.getStore().removeAll();
//							job_ref.getStore().load({
//								url: 'showJobRef.htm?id='+myId+'&type=1'
//							});
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
					width : 300,
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
							
//							var item = Ext.getCmp('sitm_id');
//							item.clearValue();
//							item.getStore().removeAll();
							var proj = Ext.getCmp('sproj_id');
							proj.clearValue();
							proj.getStore().removeAll();
							proj.getStore().load({
								url: 'showProjects.htm?type=all&id='+myId
							});
							
//							var job_ref = Ext.getCmp('sjob_ref_id');
//							job_ref.clearValue();
//							job_ref.getStore().removeAll();
//							job_ref.getStore().load({
//								url: 'showJobRef.htm?id='+myId+'&type=1'
//							});
						}

					}
				},{
					xtype: 'combobox',
					fieldLabel : 'Project Name ',
					name : 'sproj_id',
					id : 'sproj_id',
					queryMode : 'local',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 300,
//					editable : false,
					emptyText : 'Project Name',
					store : {
						fields : [ 'proj_id', 'proj_name' ],
						proxy : {
							type : 'ajax',
							url : 'showProjects.htm?type=all&id=0',
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
//							var item = Ext.getCmp('sitm_id');
//							var proj_id = Ext.getCmp('sproj_id').getValue();
//
//							var job_ref = Ext.getCmp('sjob_ref_id');
//							job_ref.clearValue();
//							job_ref.getStore().removeAll();
//							job_ref.getStore().load({
//								url: 'showJobRef.htm?id='+proj_id+'&type=2'
//							});
						}
					}
				},
				{
					xtype : 'combobox',
					fieldLabel : 'Department ',
					name : 'sdept',
					id : 'sdept',
					queryMode : 'local',
					labelWidth : 110,
					emptyText : 'Department',
					editable : false,
					width : 300,
					margin : '0 0 10 0',
					msgTarget: 'under',
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showDepartment.htm',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
					listeners : {
						select : function() {
							var dept = Ext.getCmp('sdept').getValue();
							var process = Ext.getCmp('sprocess');
							
							process.clearValue();
							process.getStore().removeAll();
							process.getStore().load({
								url: 'showTimeRecordReference.htm?kind=Process&dept='+dept
							});
						}
					}
				},
				{
					xtype : 'combobox',
					fieldLabel : 'Billing Status ',
					name : 'sjob_status',
					id : 'sjob_status',
					queryMode : 'local',
					labelWidth : 110,
					editable : false,
					emptyText : 'Billing Status',
					width : 300,
					magin : '0 0 10 0',
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showJobStatus.htm',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
				},
				{
					xtype : 'hidden',
					id : 'scus_id',
					name : 'scus_id'
	            },
				{
					xtype : 'hidden',
					id : 'sjob_ref_id',
					name : 'sjob_ref_id'
	            }  ]
			} ]
		} ],

		buttons : [ {
			text : 'Search',
			id : 'searchs',
			handler : function() {
				var form = this.up('form').getForm();
				if (form.isValid()) {
//					Ext.getCmp('ireport').setDisabled(false);
					Ext.Ajax.request({
						url : 'searchTimeRecordParam.htm' + getParamValues(),
						success : function(response, opts) {
							store.timeRecord.loadPage(1);
						}
					});
					Ext.getCmp('sjob_ref_id').setValue("");
				} else {
					Ext.MessageBox.show({
						title : 'Failed',
						msg : ' Please Check On Invalid Field!',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR,
						animateTarget : 'searchs',
					});
					console.debug("TimeRecordAdmin.js - Search else conditions");
				}
			}
		}, {
			text : 'Reset',
			handler : function() {
				this.up('form').getForm().reset();
				Ext.getCmp('scus_id').setValue("");
				Ext.getCmp('record_start').setMaxValue(new Date());
				Ext.getCmp('record_finish').setMinValue('');
				var proj = Ext.getCmp('sproj_id');
//				var job_ref = Ext.getCmp('sjob_ref_id');
				var process = Ext.getCmp('sprocess');
				proj.clearValue();
				proj.getStore().removeAll();
				proj.getStore().load({
					url: 'showProjects.htm?type=all&id=0'
				});
//				job_ref.clearValue();
//				job_ref.getStore().removeAll();
//				job_ref.getStore().load({
//					url: 'showJobRef.htm?id=0&type=0'
//				});
				process.clearValue();
				process.getStore().removeAll();
				process.getStore().load({
					url: 'showTimeRecordReference.htm?kind=Process&dept=0'
				});
			}
		} ]

	});

	panels.grid = Ext.create('Ext.grid.Panel', {
		renderTo : document.body,
		title : 'Time Record',
//		split : true,
//		forceFit : true,
//		loadMask : true,
//		autoWidth : true,
		frame : true,
		store : store.timeRecord,
		tools : [ {
			xtype : 'button',
			text : 'Report',
			id : 'ireport',
			margin : '0 5 0 0',
//			disabled : true,
			iconCls : 'icon-print',
			handler : function() {
//				alert("Print Report!");
				var form = Ext.getCmp('formPanel').getForm();
				form.submit({
					target : '_blank',
					url : 'printTimeReport.htm',
					method : 'POST',
					reset : true,
					standardSubmit : true
				});
			}
		} ],
		style : {
			"margin-left" : "auto",
			"margin-right" : "auto",
			"margin-top" : "15px",
			"margin-bottom" : "10px"
		},
		width : 1200,
//		height : 495,
		minHeight: 495,
		columns : [
				{
					text : "Customer Name",
					flex : 1.2,
					sortable : true,
					dataIndex : 'cus_name',
					renderer : renderCustomer
				},
				{
					text : "Job Name",
					flex : 1,
					sortable : true,
					dataIndex : 'job_ref_name'
				},
				{
					text : "File Name",
					flex : 1,
					sortable : true,
					dataIndex : 'tr_name'
				},
				{
					text : "Process",
					flex : 0.8,
					sortable : true,
					dataIndex : 'tr_process'
				},
//				{
//					text : "Date",
//					flex : 0.5,
//					sortable : true,
//					dataIndex : 'tr_start',
//					renderer: Ext.util.Format.dateRenderer('Y-m-d')
//				},
				{
					text : "Start",
					flex : 0.8,
					sortable : true,
					dataIndex : 'tr_start',
					renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
				},
				{
					text : "Finish",
					flex : 0.8,
					sortable : true,
					dataIndex : 'tr_finish',
					renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
				},
				{
					text : "Summary",
					flex : 0.45,
					dataIndex : 'sum_time'
				},
				{
					text : "Name",
					flex : 0.35,
					sortable : true,
					dataIndex : 'usr_name'
				}
				],
		columnLines : true,
		listeners: {
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
		bbar : Ext.create('Ext.PagingToolbar', {
			store : store.timeRecord,
			displayInfo : true,
			displayMsg : 'Displaying Records {0} - {1} of {2}',
			emptyMsg : "No record to display",
			plugins : Ext.create('Ext.ux.ProgressBarPager', {})
		})
	});

});	//end onReady

Ext.define('timeRecordModel', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'tr_id',
		type : 'int'
	}, {
		name : 'job_ref_id',
		type : 'int'
	}, {
		name : 'usr_id',
		type : 'int'
	}, {
		name : 'cus_id',
		type : 'int'
	}, {
		name : 'proj_id',
		type : 'int'
	}, {
		name : 'job_id',
		type : 'int'
	}, {
		name : 'tr_start',
		type : 'date',
		dateFormat: 'Y-m-d H:i:s'
	}, {
		name : 'tr_finish',
		type : 'date',
		dateFormat: 'Y-m-d H:i:s'
	}, {
		name : 'tr_name',
		type : 'string'
	}, {
		name : 'tr_process',
		type : 'string'
	}, {
		name : 'tr_name',
		type : 'string'
	}, {
		name : 'usr_name',
		type : 'string'
	}, {
		name : 'cus_name',
		type : 'string'
	}, {
		name : 'proj_name',
		type : 'string'
	}, {
		name : 'job_name',
		type : 'string'
	}, {
		name : 'job_ref_name',
		type : 'string'
	}, {
		name : 'sum_time',
		type : 'string'
	}]
});

store.timeRecord = Ext.create('Ext.data.JsonStore', {
	model : 'timeRecordModel',
	id : 'timeRecordStore',
	pageSize : 15,
//	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'searchTimeRecord.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'tr_id',
			totalProperty : 'total'
		}
	},
});

function getParamValues() {
	var url = "";
	var param = "";
	var prefix = "?";
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

function renderCustomer(value, meta, record, rowIndex, colIndex, store) {
    return record.get('cus_name')+'('+record.get('proj_name')+')';
}
