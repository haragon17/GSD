store = {};
panels = {};
myStackItem = [];
myRadarItem = [];
var userDept = "";

Ext.override(Ext.chart.axis.Radial, {
    processView: function() {
        var me = this,
            seriesItems = me.chart.series.items,
            i, ln, series, ends, fields = [];
        
        for (i = 0, ln = seriesItems.length; i < ln; i++) {
            series = seriesItems[i];
            fields.push(series.yField);
        }
        me.fields = fields;
        
        // Recalculate maximum and minimum properties
        delete me.minimum;
        delete me.maximum;
        //
        
        ends = me.calcEnds();
        me.maximum = ends.to;
        me.steps = ends.steps;
    }
});

Ext.onReady(function() {

	Ext.Ajax.request({
		url : 'userModel.htm',
		success: function(response, opts){
			var responseOject = Ext.decode(response.responseText);
			userDept = responseOject.user[0].dept;
			Ext.Ajax.request({
				url : 'searchJobsParam.htm?sdept='+userDept+'&first=yes',
				success : function(response, opts) {
					store.jobs.loadPage(1);
				}
			});
		},
		failure: function(response, opts){
			var responseOject = Ext.util.JSON.decode(response.responseText);
			Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
		}
	});

	mydept = new Ext.form.Hidden({
		name : 'mydept',
		id : 'mydept'
	});
	jobid = new Ext.form.Hidden({
		name : 'jobid',
		id : 'jobid'
	});
	jobid_ref = new Ext.form.Hidden({
		name : 'jobid_ref',
		id : 'jobid_ref'
	});
	jobrefid = new Ext.form.Hidden({
		name : 'jobrefid',
		id : 'jobrefid'
	})
	cusid = new Ext.form.Hidden({
		name : 'cusid',
		id : 'cusid'
	});
	projid = new Ext.form.Hidden({
		name : 'projid',
		id : 'projid'
	})
	
	panels.search = Ext.create('Ext.form.Panel', {
		title : 'Search Criteria',
		autoWidth : true,
		id : 'formPanel',
		width : 800,
		height : 240,
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
				columnWidth : 0.45,
				style : {
					"margin-left" : "50px",
					"margin-right" : "10px",
					"margin-top" : "10px",
				},
				border : false,
				layout : 'anchor',
				defaultType : 'textfield',
				items : [ {
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
							
							var proj = Ext.getCmp('sproj_id');
							var item = Ext.getCmp('sitm_id');
							item.clearValue();
							item.getStore().removeAll();
							proj.clearValue();
							proj.getStore().removeAll();
							proj.getStore().load({
								url: 'showProjects.htm?id='+myId
							});
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
							
							var proj = Ext.getCmp('sproj_id');
							var item = Ext.getCmp('sitm_id');
							item.clearValue();
							item.getStore().removeAll();
							proj.clearValue();
							proj.getStore().removeAll();
							proj.getStore().load({
								url: 'showProjects.htm?id='+myId
							});
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
					width : 280,
//					editable : false,
					emptyText : 'Project Name',
					store : {
						fields : [ 'proj_id', 'proj_name' ],
						proxy : {
							type : 'ajax',
							url : 'showProjects.htm?id=0',
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
							var item = Ext.getCmp('sitm_id');
							var proj_id = Ext.getCmp('sproj_id').getValue();

							item.clearValue();
							item.getStore().removeAll();
							item.getStore().load({
								url: 'showItem.htm?id='+proj_id
							});
						}
					}
				},
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
//					displayField : 'itm_name'
//				}  
				]
			},{
				columnWidth : 0.55,
				border : false,
				layout : 'anchor',
				style : {
					"margin-left" : "40px",
					"margin-right" : "auto",
					"margin-top" : "10px",
					"margin-bottom" : "10px"
				},
				defaultType : 'textfield',
				items : [ 
						    {
							    fieldLabel : 'Name ',
							    name : 'sjob_name',
							    id : 'sjob_name',
							    labelWidth : 100,
								margin : '0 0 10 0',
								width : 280,
								emptyText : 'Name'
							    
							    },
								{
									xtype : 'combobox',
									fieldLabel : 'Job Status',
									name : 'sjob_status',
									id : 'sjob_status',
									editable : false,
									emptyText : 'Job Status',
									width : 280,
									magin : '0 0 10 0',
									store : jobStatus,
									valueField : 'name',
									displayField : 'name'
								},
//								{
//									fieldLabel : 'Date in ',
//									name : 'sbtw_date',
//									combineErrors: true,
//									xtype: 'fieldcontainer',
//									labelWidth : 100,
//									margin : '0 0 10 0',
//									width : 350,
//									layout: 'hbox',
//					                defaults: {
//					                    flex: 1,
//					                },
//					                items: [
//					                    {
//					                        xtype     : 'datefield',
//					                        name      : 'sbtw_start',
//					                        id	: 'sbtw_start',
//					                        labelSeparator : '',
//					                        margin: '0 0 0 0',
//					                        msgTarget : 'side',
//					                        width: 50,
//					                        emptyText : 'Start',
//					                        editable: false,
//					                        format: 'Y-m-d',
//					                        listeners: {
//					                        	   "change": function () {
//					                        		   			var startDate = Ext.getCmp('sbtw_start').getRawValue();
//					                        		   			Ext.getCmp('sbtw_end').setMinValue(startDate);
//					                        	   }
//					                        }
//					                    },{
//					                    	 xtype: 'fieldcontainer',
//					     	                fieldLabel: 'To ',
//					     	                combineErrors: true,
//					     	                msgTarget : 'side',
//					     	                margin: '0 0 0 5',
//					                    	labelSeparator : '',
//					                        Width : 20
//					                    },
//					                    {
//					                        xtype     : 'datefield',
//					                        margin: '0 10 0 -80',	
//					                        name      : 'sbtw_end',
//					                        id	: 'sbtw_end',
//					                        labelSeparator : '',
//					                        msgTarget : 'side',
//					                        emptyText : 'End',
//					                        editable: false,
//					                        format: 'Y-m-d',
//					                        width: 50,
//					                        listeners: {
//					                        	"change": function () {
//					                        		   	var endDate = Ext.getCmp('sbtw_end').getRawValue();
//					                           			Ext.getCmp('sbtw_start').setMaxValue(endDate);
//					                        	}
//					                        }
//					                    }
//					                ]
//								}, 
								{
									xtype : 'hidden',
									id : 'scus_id',
									name : 'scus_id'
					            } ]
			}  ]
		} ],

		buttons : [ {
			text : 'Search',
			id : 'searchs',
			handler : function() {
				var form = this.up('form').getForm();
				if (form.isValid()) {
					Ext.getCmp('ireport').setDisabled(false);
					Ext.Ajax.request({
						url : 'searchJobsParam.htm?sdept='+userDept + getParamValues(),
						success : function(response, opts) {
							panels.tabs.setActiveTab('projTabs');
							Ext.getCmp('jobTabs').setDisabled(true);
							Ext.getCmp('jobTabs').setTitle("Jobs");
							store.jobs.loadPage(1);
						}
					});

				} else {
					Ext.MessageBox.show({
						title : 'Failed',
						msg : ' Please Check On Invalid Field!',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR,
						animateTarget : 'searchs',
					});
					console.debug("Projects.js Else conditions");
				}
			}
		}, {
			text : 'Reset',
			handler : function() {
				this.up('form').getForm().reset();
				Ext.getCmp('sproj_id').getStore().load({url: 'showProjects.htm?id=0'});
//				Ext.getCmp('scus_id').setValue("");
//				Ext.getCmp('update_start').setMaxValue(new Date());
//				Ext.getCmp('update_limit').setMinValue('');
			}
		} ]

	});
	
	panels.tabs = Ext.create('Ext.tab.Panel', {
		renderTo : document.body,
		width: 1000,
		height: 548,
		frame: true,
		style : {
			"margin-left" : "auto",
			"margin-right" : "auto",
			"margin-top" : "15px",
			"margin-bottom" : "10px"
		},
	    items: [{
	    	id: 'projTabs',
	    	title: 'Projects',
	    	items: grid
	    },{
	    	id: 'jobTabs',
	    	disabled: true,
	    	title: 'Jobs',
	    	items: gridRef
	    }]
	})
	
	/*panels.grid = Ext.create('Ext.grid.Panel', {
//		renderTo : document.body,
		title : 'Billing Report',
		split : true,
		forceFit : true,
		loadMask : true,
		autoWidth : true,
		frame : true,
		store : store.jobsRef,
		tools : [ {
			xtype : 'button',
			text : 'Report',
			id : 'ireport',
			iconCls : 'icon-excel',
			disabled : true,
			handler : function() {
				alert("Print!");
			}
		},{
			xtype : 'button',
			text : 'Add Job',
			id : 'icreate',
			iconCls : 'icon-add',
			handler : function() {
				addJob.show();
			}
		} ],
		style : {
			"margin-left" : "auto",
			"margin-right" : "auto",
			"margin-top" : "15px",
			"margin-bottom" : "10px"
		},
		width : 1200,
		height : 500,
		columns : [
				{
					text : "Date in",
					flex : 1,
					sortable : true,
					dataIndex : 'job_in',
					renderer: Ext.util.Format.dateRenderer('Y-m-d')
				},
				{
					text : "Date out",
					flex : 1,
					sortable : true,
					dataIndex : 'job_out',
					renderer: Ext.util.Format.dateRenderer('Y-m-d')
				},
				{
					text : "Job Name",
					flex : 2.5,
					sortable : true,
					dataIndex : 'job_name'
				},
				{
					text : "Customer Name",
					flex : 2,
					sortable : true,
					dataIndex : 'cus_name'
				},
				{
					text : "Project Name",
					flex : 2,
					sortable : true,
					dataIndex : 'proj_name'
				},
				{
					text : "Item",
					flex : 2,
					sortable : true,
					dataIndex : 'itm_name'
				},
				{
					text : "Amount",
					flex : 1,
					sortable : true,
					dataIndex : 'amount'
				},
				{
					text : "Dept",
					flex : 0.7,
					sortable : true,
					dataIndex : 'dept'
				},
				{
					text : "Status",
					flex : 1,
					sortable : true,
					dataIndex : 'job_status'
				},
				{
					text : 'Print',
					xtype : 'actioncolumn',
					flex : 0.7,
					align : 'center',
					id : 'print',
					items : [ {
						iconCls : 'icon-print',
						handler : function(grid, rowIndex, colIndex) {
							job_id = grid.getStore().getAt(rowIndex).get('job_id');
							
							Ext.Ajax.request({
								url : 'printJobTicket.htm?job_id='+job_id,
								success: function(response, opts){
									
								},
								failure: function(response, opts){
									var responseOject = Ext.util.JSON.decode(response.responseText);
									Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
								}
							});
						}
					} ]
				},
				{
					text : 'Edit',
					xtype : 'actioncolumn',
					flex : 0.7,
					align : 'center',
					id : 'edit',
					items : [ {
						iconCls : 'table-edit',
						handler : function(grid, rowIndex, colIndex) {
							job_id = grid.getStore().getAt(rowIndex).get('job_id');
							job_name = grid.getStore().getAt(rowIndex).get('job_name');
							cus_id = grid.getStore().getAt(rowIndex).get('cus_id');
							cus_name = grid.getStore().getAt(rowIndex).get('cus_name');
							cus_code = grid.getStore().getAt(rowIndex).get('cus_code');
							proj_id = grid.getStore().getAt(rowIndex).get('proj_id');
							proj_ref_id = grid.getStore().getAt(rowIndex).get('proj_ref_id');
							job_dtl = grid.getStore().getAt(rowIndex).get('job_dtl');
							amount = grid.getStore().getAt(rowIndex).get('amount');
							dept = grid.getStore().getAt(rowIndex).get('dept');
							job_in = grid.getStore().getAt(rowIndex).get('job_in');
							job_out = grid.getStore().getAt(rowIndex).get('job_out');
							status = grid.getStore().getAt(rowIndex).get('job_status');
							
							Ext.getCmp('eproj_id').getStore().load({
								url: 'showProjects.htm?id='+cus_id
							});
							
							Ext.getCmp('eproj_ref_id').getStore().load({
								url: 'showProjectsReference.htm?id='+proj_id
							});
							
							Ext.getCmp('ejob_id').setValue(job_id);
							Ext.getCmp('ejob_name').setValue(job_name);
							Ext.getCmp('ecus_id').setValue(cus_id);
							Ext.getCmp('ecus_name').setValue(cus_name);
							Ext.getCmp('ecus_code').setValue(cus_code);
							Ext.getCmp('eproj_id').setValue(proj_id);
							Ext.getCmp('eproj_ref_id').setValue(proj_ref_id);
							Ext.getCmp('ejob_dtl').setValue(job_dtl);
							Ext.getCmp('eamount').setValue(amount);
							Ext.getCmp('edept').setValue(dept);
							Ext.getCmp('ejob_in').setValue(job_in);
							Ext.getCmp('ejob_out').setValue(job_out);
							if(status != "undefined"){
								Ext.getCmp('estatus').setValue(status);
							}
							editJob.show();
						}
					} ]
				},
				{
					text : 'Delete',
					xtype : 'actioncolumn',
					flex : 0.7,
					align : 'center',
					id : 'del',
					items : [ {
						iconCls : 'icon-delete',
						handler : function(grid, rowIndex, colIndex) {
							job_id = grid.getStore().getAt(rowIndex).get('job_id');
							Ext.getCmp('jobid').setValue(job_id);
							Ext.MessageBox.show({
								title : 'Confirm',
								msg : 'Are you sure you want to delete this?',
								buttons : Ext.MessageBox.YESNO,
								animateTarget : 'del',
								fn : confirmChk,
								icon : Ext.MessageBox.QUESTION
							});
						}
					} ]
				}, ],
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
		                    if (columnText){
		                        tip.update("<b>"+columnText+"</b>");
		                    } else {
		                        return false;
		                    }
		                }
		            }
		        });
	        }
	    },
		bbar : Ext.create('Ext.PagingToolbar', {
			store : store.jobsRef,
			displayInfo : true,
			displayMsg : 'Displaying Jobs {0} - {1} of {2}',
			emptyMsg : "No Job to display",
			plugins : Ext.create('Ext.ux.ProgressBarPager', {})
		})
	});*/
	
}); //end onReady

//Ext.define('jobRefModel', {
//	extend : 'Ext.data.Model',
//	fields : [ {
//		name : 'job_id',
//		type : 'int'
//	}, {
//		name : 'job_ref_id',
//		type : 'int'
//	},{
//		name : 'job_ref_name',
//		type : 'string'
//	}, {
//		name : 'cus_name',
//		type : 'string'
//	}, {
//		name : 'cus_code',
//		type : 'string'
//	}, {
//		name : 'proj_name',
//		type : 'string'
//	}, {
//		name : 'itm_name',
//		type : 'string'
//	}, {
//		name : 'amount',
//		type : 'int'
//	}, {
//		name : 'job_ref_dtl',
//		type : 'string'
//	}, {
//		name : 'job_in',
//		type : 'date',
//		dateFormat: 'Y-m-d H:i:s'
//	}, {
//		name : 'job_out',
//		type : 'date',
//		dateFormat: 'Y-m-d H:i:s'
//	}, {
//		name : 'dept',
//		type : 'string'
//	}, {
//		name : 'cus_id',
//		type : 'int'
//	}, {
//		name : 'proj_ref_id',
//		type : 'int'
//	}, {
//		name : 'itm_id',
//		type : 'int'
//	}, {
//		name : 'proj_id',
//		type : 'int'
//	}, {
//		name : 'job_status',
//		type : 'string'
//	}
//	]
//});

Ext.define('jobRefModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'job_id',
		type : 'int'
	}, {
		name : 'job_ref_id',
		type : 'int'
	},{
		name : 'job_ref_name',
		type : 'string'
	},{
		name : 'proj_id',
		type : 'int'
	},{
		name : 'proj_ref_id',
		type : 'int'
	},{
		name : 'amount',
		type : 'int'
	},{
		name : 'job_in',
		type : 'date',
		dateFormat: 'Y-m-d H:i:s'
	},{
		name : 'job_out',
		type : 'date',
		dateFormat: 'Y-m-d H:i:s'
	},{
		name : 'job_ref_dtl',
		type : 'string'
	},{
		name : 'itm_name',
		type : 'string'
	},{
		name : 'job_ref_status',
		type : 'string'
	}
	]
});

store.jobsRef = Ext.create('Ext.data.JsonStore', {
	model : 'jobRefModel',
	id : 'jobRefStore',
	pageSize : 20,
//	autoLoad : true,
	proxy : {
		type : 'ajax',
//		url : 'searchJobsRef.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'job_ref_id',
			totalProperty : 'total'
		}
	}
});

Ext.define('jobModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'job_id',
		type : 'int'
	}, {
		name : 'job_name',
		type : 'string'
	}, {
		name : 'cus_id',
		type : 'int'
	}, {
		name : 'cus_name',
		type : 'string'
	}, {
		name : 'cus_code',
		type : 'string'
	}, {
		name : 'proj_id',
		type : 'int'
	}, {
		name : 'proj_name',
		type : 'string'
	}, {
		name : 'job_dtl',
		type : 'string'
	}, {
		name : 'job_status',
		type : 'string'
	}, {
		name : 'dept',
		type : 'string'
	}
	]
});


store.jobs = Ext.create('Ext.data.JsonStore', {
	model : 'jobModel',
	id : 'jobStore',
	pageSize : 20,
//	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'searchJobs.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'job_id',
			totalProperty : 'total'
		}
	}
})

var currency = Ext.create('Ext.data.Store', {
    fields: ['currency','name'],
    data : [
        {"currency":"AUD", "name":"Australian Dollar[AUD]"},
        {"currency":"CHF", "name":"Swiss Franc[CHF]"},
        {"currency":"EUR", "name":"Euro[EUR]"},
        {"currency":"GBP", "name":"British Pound[GBP]"},
        {"currency":"THB", "name":"Thai Bath[THB]"},
        {"currency":"USD", "name":"US Dollar[USD]"}
        //...
    ]
});

var department = Ext.create('Ext.data.Store', {
	fields: ['name'],
	data : [
	        {"name":"E-Studio"},
	        {"name":"Publication"},
	        {"name":"PP"},
	        {"name":"CM"},
	        {"name":"KK"},
	        {"name":"BKK"}
	]
});

var jobStatus = Ext.create('Ext.data.Store', {
	fields: ['name'],
	data : [
	        {"name":"Processing"},
	        {"name":"Sent"},
	        {"name":"Checked"},
	        {"name":"Billed"},
	        {"name":"Hold"}     
	]
});

var jobRefStatus = Ext.create('Ext.data.Store', {
	fields: ['name'],
	data : [
	        {"name":"New"},
	        {"name":"CC"},
	        {"name":"CC2"},
	        {"name":"CC3"},
	        {"name":"Final"},
	        {"name":"Sent"},
	        {"name":"Hold"}     
	]
});

var grid = Ext.create('Ext.grid.Panel', {
	id : 'mainGrid',
	store : store.jobs,
	tbar : [{
		xtype : 'button',
		text : "Add Job's Project",
		id : 'job_add',
		iconCls : 'icon-add',
		handler : function() {
			Ext.getCmp('adept').setValue(userDept);
			addJob.show();
		}
	}],
	height : 500,
	columns : [
		{
			text : '!',
			xtype : 'actioncolumn',
			flex : 0.33,
			align : 'center',
			id : 'job_go',
			items : [{
				iconCls : 'icon-go',
				handler : function(grid, rowIndex, colIndex) {
					job_name = grid.getStore().getAt(rowIndex).get('job_name');
					job_id = grid.getStore().getAt(rowIndex).get('job_id');
					proj_id = grid.getStore().getAt(rowIndex).get('proj_id');
					Ext.getCmp('projid').setValue(proj_id);
					Ext.getCmp('jobid_ref').setValue(job_id);
					store.jobsRef.load({url:'searchJobsReference.htm?id='+job_id});
					Ext.getCmp('jobTabs').setDisabled(false);
					Ext.getCmp('jobTabs').setTitle(job_name);
					panels.tabs.setActiveTab('jobTabs');
				}
			}]
		},
		{
			text : "Name",
			flex : 2,
			sortable : true,
			dataIndex : 'job_name',
		},
	    {
	    	text : "Customer Name",
	    	flex : 1.5,
	    	sortable : true,
	    	dataIndex : 'cus_name',
	    },
	    {
	    	text : "Project Name",
			flex : 1.5,
			sortable : true,
			dataIndex : 'proj_name'
	    },
	    {
	    	text : "Status",
			flex : 0.7,
			sortable : true,
			dataIndex : 'job_status'
	    },
//	    {
//	    	text : "Dept",
//			flex : 0.7,
//			sortable : true,
//			dataIndex : 'dept'
//	    },
	    {
	    	text : 'Edit',
			xtype : 'actioncolumn',
			flex : 0.5,
			align : 'center',
			id : 'job_edit',
			items : [ {
				iconCls : 'table-edit',
				handler : function(grid, rowIndex, colIndex) {
					job_id = grid.getStore().getAt(rowIndex).get('job_id');
					job_name = grid.getStore().getAt(rowIndex).get('job_name');
					cus_id = grid.getStore().getAt(rowIndex).get('cus_id');
					cus_name = grid.getStore().getAt(rowIndex).get('cus_name');
					cus_code = grid.getStore().getAt(rowIndex).get('cus_code');
					proj_id = grid.getStore().getAt(rowIndex).get('proj_id');
					job_dtl = grid.getStore().getAt(rowIndex).get('job_dtl');
					dept = grid.getStore().getAt(rowIndex).get('dept');
					status = grid.getStore().getAt(rowIndex).get('job_status');
					
					Ext.getCmp('eproj_id').getStore().load({
						url: 'showProjects.htm?id='+cus_id
					});
					
					Ext.getCmp('ejob_id').setValue(job_id);
					Ext.getCmp('ejob_name').setValue(job_name);
					Ext.getCmp('ecus_name').setValue(cus_name);
					Ext.getCmp('ecus_code').setValue(cus_code);
					Ext.getCmp('eproj_id').setValue(proj_id);
					Ext.getCmp('ejob_dtl').setValue(job_dtl);
					Ext.getCmp('edept').setValue(dept);
					Ext.getCmp('ejob_status').setValue(status);
					editJob.show();
				}
			}]
	    },
	    {
			text : 'Delete',
			xtype : 'actioncolumn',
			flex : 0.5,
			align : 'center',
			id : 'job_del',
			items : [ {
				iconCls : 'icon-delete',
				handler : function(grid, rowIndex, colIndex) {
					job_id = grid.getStore().getAt(rowIndex).get('job_id');
					Ext.getCmp('jobid').setValue(job_id);
					Ext.MessageBox.show({
						title : 'Confirm',
						msg : 'Are you sure you want to delete this?',
						buttons : Ext.MessageBox.YESNO,
						animateTarget : 'job_del',
						fn : confirmChk,
						icon : Ext.MessageBox.QUESTION
					});
				}
			} ]
		}],
		listeners : {
		    itemdblclick: function(dv, record, item, index, e) {
					job_name = dv.getStore().getAt(index).get('job_name');
					job_id = dv.getStore().getAt(index).get('job_id');
					proj_id = dv.getStore().getAt(index).get('proj_id');
					Ext.getCmp('projid').setValue(proj_id);
					Ext.getCmp('jobid_ref').setValue(job_id);
					store.jobsRef.load({url:'searchJobsReference.htm?id='+job_id});
					Ext.getCmp('jobTabs').setDisabled(false);
					Ext.getCmp('jobTabs').setTitle(job_name);
					panels.tabs.setActiveTab('jobTabs');
		    }
		},
		bbar : Ext.create('Ext.PagingToolbar', {
			store : store.jobs,
			displayInfo : true,
			displayMsg : "Job's Projects {0} - {1} of {2}",
			emptyMsg : "No Job's Project to display",
			plugins : Ext.create('Ext.ux.ProgressBarPager', {})
		})
});

var gridRef = Ext.create('Ext.grid.Panel', {
//	renderTo : document.body,
//	title : 'Billing Report',
//	split : true,
//	forceFit : true,
//	loadMask : true,
//	autoWidth : true,
//	frame : true,
	store : store.jobsRef,
	tbar : [{
		xtype : 'button',
		text : 'Add Job',
		id : 'icreate',
		iconCls : 'icon-add',
		handler : function() {
			Ext.getCmp('arefjob_id').setValue(Ext.getCmp('jobid_ref').getValue());
			Ext.getCmp('aproj_ref_id').getStore().load({
				url: 'showProjectsReference.htm?id='+Ext.getCmp('projid').getValue()
			});
			addJobRef.show();
		}
	},{
		xtype : 'button',
		text : 'Report',
		id : 'ireport',
		iconCls : 'icon-excel',
//		disabled : true,
		handler : function() {
			job_id = Ext.getCmp('jobid_ref').getValue();
			myForm = Ext.getCmp('formPanel').getForm();
			myForm.submit({
				target : '_blank',
                        url: 'printReport.htm?job_id='+job_id,
                        method: 'POST',
                        reset: true,
                        standardSubmit: true
			})
		}
	}],
//	style : {
//		"margin-left" : "auto",
//		"margin-right" : "auto",
//		"margin-top" : "15px",
//		"margin-bottom" : "10px"
//	},
//	width : 1200,
	height : 500,
	columns : [
			{
				text : "Date in",
				flex : 1,
				sortable : true,
				dataIndex : 'job_in',
				renderer: Ext.util.Format.dateRenderer('Y-m-d')
			},
			{
				text : "Date out",
				flex : 1,
				sortable : true,
				dataIndex : 'job_out',
				renderer: Ext.util.Format.dateRenderer('Y-m-d')
			},
			{
				text : "Job Name",
				flex : 2.5,
				sortable : true,
				dataIndex : 'job_ref_name'
			},
//			{
//				text : "Customer Name",
//				flex : 2,
//				sortable : true,
//				dataIndex : 'cus_name'
//			},
//			{
//				text : "Project Name",
//				flex : 2,
//				sortable : true,
//				dataIndex : 'proj_name'
//			},
			{
				text : "Item",
				flex : 2,
				sortable : true,
				dataIndex : 'itm_name'
			},
			{
				text : "Amount",
				flex : 1,
				sortable : true,
				dataIndex : 'amount'
			},
//			{
//				text : "Dept",
//				flex : 0.7,
//				sortable : true,
//				dataIndex : 'dept'
//			},
			{
				text : "Status",
				flex : 1,
				sortable : true,
				dataIndex : 'job_ref_status'
			},
			{
				text : 'Print',
				xtype : 'actioncolumn',
				flex : 0.7,
				align : 'center',
				id : 'print',
				items : [ {
					iconCls : 'icon-print',
					handler : function(grid, rowIndex, colIndex) {
						job_ref_id = grid.getStore().getAt(rowIndex).get('job_ref_id');
						
						window.open('printJobTicket.htm?job_ref_id='+job_ref_id, '_blank');
						
//						Ext.Ajax.request({
//							url : 'printJobTicket.htm?job_ref_id='+job_ref_id,
//							success: function(response, opts){
//								
//							},
//							failure: function(response, opts){
//								var responseOject = Ext.util.JSON.decode(response.responseText);
//								Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
//							}
//						});
					}
				} ]
			},
			{
				text : 'Edit',
				xtype : 'actioncolumn',
				flex : 0.7,
				align : 'center',
				id : 'edit',
				items : [ {
					iconCls : 'table-edit',
					handler : function(grid, rowIndex, colIndex) {
						job_id = grid.getStore().getAt(rowIndex).get('job_ref_id');
						job_name = grid.getStore().getAt(rowIndex).get('job_ref_name');
						proj_ref_id = grid.getStore().getAt(rowIndex).get('proj_ref_id');
						job_dtl = grid.getStore().getAt(rowIndex).get('job_ref_dtl');
						amount = grid.getStore().getAt(rowIndex).get('amount');
						job_in = grid.getStore().getAt(rowIndex).get('job_in');
						job_out = grid.getStore().getAt(rowIndex).get('job_out');
						proj_id = Ext.getCmp('projid').getValue();
						job_ref_status = grid.getStore().getAt(rowIndex).get('job_ref_status');
						
						Ext.getCmp('eproj_ref_id').getStore().load({
							url: 'showProjectsReference.htm?id='+proj_id
						});
						
						Ext.getCmp('ejob_ref_id').setValue(job_id);
						Ext.getCmp('ejob_ref_name').setValue(job_name);
						Ext.getCmp('eproj_ref_id').setValue(proj_ref_id);
						Ext.getCmp('ejob_ref_dtl').setValue(job_dtl);
						Ext.getCmp('eamount').setValue(amount);
						Ext.getCmp('ejob_in').setValue(job_in);
						Ext.getCmp('ejob_out').setValue(job_out);
						Ext.getCmp('ejob_ref_status').setValue(job_ref_status);
						editJobRef.show();
					}
				} ]
			},
			{
				text : 'Delete',
				xtype : 'actioncolumn',
				flex : 0.7,
				align : 'center',
				id : 'del',
				items : [ {
					iconCls : 'icon-delete',
					handler : function(grid, rowIndex, colIndex) {
						job_ref_id = grid.getStore().getAt(rowIndex).get('job_ref_id');
						Ext.getCmp('jobrefid').setValue(job_ref_id);
						Ext.MessageBox.show({
							title : 'Confirm',
							msg : 'Are you sure you want to delete this?',
							buttons : Ext.MessageBox.YESNO,
							animateTarget : 'del',
							fn : confirmChkRef,
							icon : Ext.MessageBox.QUESTION
						});
					}
				} ]
			}, ],
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
	                    if (columnText){
	                        tip.update("<b>"+columnText+"</b>");
	                    } else {
	                        return false;
	                    }
	                }
	            }
	        });
        }
    },
	bbar : Ext.create('Ext.PagingToolbar', {
		store : store.jobsRef,
		displayInfo : true,
		displayMsg : 'Displaying Jobs {0} - {1} of {2}',
		emptyMsg : "No Job to display",
		plugins : Ext.create('Ext.ux.ProgressBarPager', {}),
		doRefresh : function(){
			store.jobsRef.reload();
		},
//		listeners: {
//		    afterrender: function() {
//		    	this.child('#refresh').hide();
//		    }
//		}
	})
});


addJob = new Ext.create('Ext.window.Window', {
	title: "Add Job's Project",
    animateTarget: 'job_add',
    modal : true,
    resizable:false,
    width: 450,
    closeAction: 'hide',
    items :[{
    	xtype:'form',
        id:'addJobForm',
        items:[{
    		xtype:'fieldset',
            title: 'Job Information',
            defaultType: 'textfield',
            layout: 'anchor',
            padding: 10,
            width:400,
            style: {
                "margin-left": "auto",
                "margin-right": "auto",
                "margin-top": "10px",
                "margin-bottom": "10px"
            },
            defaults: {
                anchor: '100%'
            },
            items :[{
    	    	xtype:'textfield',
    	    	labelWidth: 120,
    	    	allowBlank: false,
    	    	fieldLabel: 'Name <font color="red">*</font> ',
    	    	emptyText : 'Name',
//    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	maxLength : 60,
    	    	name: 'ajob_name',
    	    	id: 'ajob_name',
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
						
						var proj = Ext.getCmp('aproj_id');
						var v = this.getValue();
						var record = this.findRecord(this.valueField || this.displayField, v);
						var myIndex = this.store.indexOf(record);
						var myValue = this.store.getAt(myIndex).data.cus_code;
						var myId = this.store.getAt(myIndex).data.cus_id;
						Ext.getCmp('acus_code').setValue(myValue);
						
						proj.clearValue();
						proj.getStore().removeAll();
						proj.getStore().load({
							url: 'showProjects.htm?id='+myId
						});
						
					}

				}
			}, {
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
						
						var proj = Ext.getCmp('aproj_id');
						var v = this.getValue();
						var record = this.findRecord(this.valueField || this.displayField, v);
						var myIndex = this.store.indexOf(record);
						var myValue = this.store.getAt(myIndex).data.cus_name;
						var myId = this.store.getAt(myIndex).data.cus_id;
						Ext.getCmp('acus_name').setValue(myValue);
						
						proj.clearValue();
						proj.getStore().removeAll();
						proj.getStore().load({
							url: 'showProjects.htm?id='+myId
						});
						
					}
				}
			},{
				xtype: 'combobox',
				fieldLabel : 'Project Name <font color="red">*</font> ',
				name : 'aproj_id',
				id : 'aproj_id',
				allowBlank: false,
//				editable : false,
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
//				listeners : {
//
//					select : function() {
//						var proj_ref = Ext.getCmp('aproj_ref_id');
//						var proj_id = Ext.getCmp('aproj_id').getValue();
//
//						proj_ref.clearValue();
//						proj_ref.getStore().removeAll();
//						proj_ref.getStore().load({
//							url: 'showProjectsReference.htm?id='+proj_id
//						});
//						proj_ref.markInvalid('Item Required!');
//						proj_ref.allowBlank = false;
//					},
//					blur : function() {
//						var v = this.getValue();
//						var record = this.findRecord(this.valueField || this.displayField, v);
//						if(record == false){
//							Ext.getCmp('aproj_id').setValue("");
//							Ext.getCmp('aproj_ref_id').clearInvalid();
//							Ext.getCmp('aproj_ref_id').allowBlank = true;
//							Ext.getCmp('aproj_ref_id').clearValue();
//							Ext.getCmp('aproj_ref_id').getStore().removeAll();
//						}
//					}
//				}
			},
//			{
//				xtype : 'combobox',
//				fieldLabel : 'Department <font color="red">*</font> ',
//				name : 'adept',
//				id : 'adept',
//				queryMode : 'local',
//				labelWidth : 120,
//				emptyText : 'Department',
//				allowBlank: false,
//				editable : false,
//				msgTarget: 'under',
//				store : department,
//				valueField : 'name',
//				displayField : 'name',
//			},
			{
				xtype : 'combobox',
				fieldLabel : 'Job Status <font color="red">*</font> ',
				name : 'ajob_status',
				id : 'ajob_status',
				queryMode : 'local',
				labelWidth : 120,
				emptyText : 'Job Status',
				allowBlank: false,
				editable : false,
				msgTarget: 'under',
				store : jobStatus,
				valueField : 'name',
				displayField : 'name',
			},{
    	    	xtype: 'textarea',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Detail',
    	    	name: 'ajob_dtl',
    	    	id: 'ajob_dtl',
    	    	emptyText: 'Details',
    	    	maxLength : 500,
				maxLengthText : 'Maximum input 500 Character',
    	    }]
            },{
            	xtype : 'hidden',
				id : 'adept',
				name : 'adept'
            }]
    		}],
            buttons:[{	
           		  text: 'Add',
          		  width:100,
          		  id: 'ajob_btn',
                 handler: function(){
                	 var form = Ext.getCmp('addJobForm').getForm();
                	 if(form.isValid()){
        				 form.submit({
        				 url: 'createJob.htm',
        				 waitTitle: 'Adding Job',
        				 waitMsg: 'Please wait...',
        				 standardSubmit: false,
                         success: function(form, action) {
                        	 Ext.MessageBox.show({
          						title: 'Information',
          						msg: "Job's Project Has Been Add!",
          						buttons: Ext.MessageBox.OK,
          						icon: Ext.MessageBox.INFO,
          						animateTarget: 'ajob_btn',
          						fn: function(){
          							addJob.hide();
          							store.jobs.reload();
          							}
          					});
                            },
                            failure : function(form, action) {
								Ext.Msg.alert('Failed',
										action.result ? action.result.message
												: 'No response');
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
                	width:100,
                	handler: function(){
                		Ext.getCmp('addJobForm').getForm().reset();
                	}
                }],
               	listeners:{
               		'beforehide':function(){
               			Ext.getCmp('addJobForm').getForm().reset();
               		}
               	}
});

editJob = new Ext.create('Ext.window.Window', {
	title: "Edit Job's Project",
    animateTarget: 'job_edit',
    modal : true,
    resizable:false,
    width: 450,
    closeAction: 'hide',
    items :[{
    	xtype:'form',
        id:'editJobForm',
        items:[{
    		xtype:'fieldset',
            title: 'Job Information',
            defaultType: 'textfield',
            layout: 'anchor',
            padding: 10,
            width:400,
            style: {
                "margin-left": "auto",
                "margin-right": "auto",
                "margin-top": "10px",
                "margin-bottom": "10px"
            },
            defaults: {
                anchor: '100%'
            },
            items :[{
    	    	xtype:'textfield',
    	    	labelWidth: 120,
    	    	allowBlank: false,
    	    	fieldLabel: 'Job Name <font color="red">*</font> ',
    	    	emptyText : 'Job Name',
    	    	msgTarget : 'under',
    	    	name: 'ejob_name',
    	    	id: 'ejob_name',
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
						
						var proj = Ext.getCmp('eproj_id');
						var v = this.getValue();
						var record = this.findRecord(this.valueField || this.displayField, v);
						var myIndex = this.store.indexOf(record);
						var myValue = this.store.getAt(myIndex).data.cus_code;
						var myId = this.store.getAt(myIndex).data.cus_id;
						Ext.getCmp('ecus_code').setValue(myValue);

						proj.clearValue();
						proj.getStore().removeAll();
						proj.getStore().load({
							url: 'showProjects.htm?id='+myId
						});
						
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
						
						var proj = Ext.getCmp('eproj_id');
						var v = this.getValue();
						var record = this.findRecord(this.valueField || this.displayField, v);
						var myIndex = this.store.indexOf(record);
						var myValue = this.store.getAt(myIndex).data.cus_name;
						var myId = this.store.getAt(myIndex).data.cus_id;
						Ext.getCmp('ecus_name').setValue(myValue);

						proj.clearValue();
						proj.getStore().removeAll();
						proj.getStore().load({
							url: 'showProjects.htm?id='+myId
						});
						
					}
				}
			},{
				xtype: 'combobox',
				fieldLabel : 'Project Name <font color="red">*</font> ',
				name : 'eproj_id',
				id : 'eproj_id',
				allowBlank: false,
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
					autoLoad : true
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
					},
					blur : function() {
						var v = this.getValue();
						var record = this.findRecord(this.valueField || this.displayField, v);
						if(record == false){
							Ext.getCmp('eproj_id').setValue("");
							Ext.getCmp('eproj_ref_id').clearInvalid();
							Ext.getCmp('eproj_ref_id').allowBlank = true;
							Ext.getCmp('eproj_ref_id').clearValue();
							Ext.getCmp('eproj_ref_id').getStore().removeAll();
						}
					}
				}
			},
			{
				xtype : 'combobox',
				fieldLabel : 'Department <font color="red">*</font> ',
				name : 'edept',
				id : 'edept',
				queryMode : 'local',
				labelWidth : 120,
				emptyText : 'Department',
				allowBlank: false,
				editable : false,
				msgTarget: 'under',
				store : department,
				valueField : 'name',
				displayField : 'name',
			},{
				xtype : 'combobox',
				fieldLabel : 'Job Status <font color="red">*</font> ',
				name : 'ejob_status',
				id : 'ejob_status',
				queryMode : 'local',
				labelWidth : 120,
				emptyText : 'Job Status',
				allowBlank: false,
				editable : false,
				msgTarget: 'under',
				store : jobStatus,
				valueField : 'name',
				displayField : 'name',
			},{
    	    	xtype: 'textarea',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Detail',
    	    	name: 'ejob_dtl',
    	    	id: 'ejob_dtl',
    	    	emptyText: 'Details',
    	    	maxLength : 500,
				maxLengthText : 'Maximum input 500 Character',
    	    }]
            },
            {
				xtype : 'hidden',
				id : 'ejob_id',
				name : 'ejob_id'
            }
            ]
    		}],
            buttons:[{	
           		  text: 'Update',
          		  width:100,
          		  id: 'ejob_btn',
                 handler: function(){
                	 var form = Ext.getCmp('editJobForm').getForm();
                	 if(form.isValid()){
        				 form.submit({
        				 url: 'updateJob.htm',
        				 waitTitle: 'Updating Job',
        				 waitMsg: 'Please wait...',
        				 standardSubmit: false,
                         success: function(form, action) {
                        	 Ext.MessageBox.show({
          						title: 'Information',
          						msg: "Job's Project Has Been Update!",
          						buttons: Ext.MessageBox.OK,
          						icon: Ext.MessageBox.INFO,
          						animateTarget: 'ejob_btn',
          						fn: function(){
          							editJob.hide();
          							store.jobs.reload();
          							}
          					});
                            },
                            failure : function(form, action) {
								Ext.Msg.alert('Failed',
										action.result ? action.result.message
												: 'No response');
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
                	width:100,
                	handler: function(){
                		Ext.getCmp('editJobForm').getForm().reset();
                	}
                }],
               	listeners:{
               		'beforehide':function(){
               			Ext.getCmp('editJobForm').getForm().reset();
               		}
               	}
});

addJobRef = new Ext.create('Ext.window.Window', {
	title: 'Add Job',
    animateTarget: 'icreate',
    modal : true,
    resizable:false,
    width: 450,
    closeAction: 'hide',
    items :[{
    	xtype:'form',
        id:'addJobRefForm',
        items:[{
    		xtype:'fieldset',
            title: 'Job Information',
            defaultType: 'textfield',
            layout: 'anchor',
            padding: 10,
            width:400,
            style: {
                "margin-left": "auto",
                "margin-right": "auto",
                "margin-top": "10px",
                "margin-bottom": "10px"
            },
            defaults: {
                anchor: '100%'
            },
            items :[{
    	    	xtype:'textfield',
    	    	labelWidth: 120,
    	    	allowBlank: false,
    	    	fieldLabel: 'Job Name <font color="red">*</font> ',
    	    	emptyText : 'Job Name',
//    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	maxLength : 60,
    	    	name: 'ajob_ref_name',
    	    	id: 'ajob_ref_name',
    	    },
    	    {
				xtype : 'combobox',
				fieldLabel : 'Job Status <font color="red">*</font> ',
				name : 'ajob_ref_status',
				id : 'ajob_ref_status',
				queryMode : 'local',
				labelWidth : 120,
				emptyText : 'Job Status',
				allowBlank: false,
				editable : false,
				msgTarget: 'under',
				store : jobRefStatus,
				valueField : 'name',
				displayField : 'name',
			},
    	    {
				fieldLabel : 'Job in-out ',
				name : 'ajob_date',
				combineErrors: true,
				xtype: 'fieldcontainer',
				labelWidth : 100,
				width : 350,
				layout: 'hbox',
                defaults: {
                    flex: 1,
                },
                items: [
                    {
                        xtype: 'datefield',
                        name: 'ajob_in',
                        id: 'ajob_in',
                        labelSeparator : '',
                        margin: '0 0 0 20',
                        msgTarget : 'under',
                        flex: 1.1,
                        editable: false,
                        format: 'Y-m-d',
                        emptyText : 'Date in',
                        listeners: {
                        	   "change": function () {
                        		   			var startDate = Ext.getCmp('ajob_in').getRawValue();
                        		   			Ext.getCmp('ajob_out').setMinValue(startDate);
                        	   }
                        }
                    },
                 {
                   	xtype: 'fieldcontainer',
  	                combineErrors: true,
  	                margin: '0 0 0 0',
                 	labelSeparator : '',
                 	flex: 0.1
                 },
                    {
                        xtype: 'datetimefield',
                        margin: '0 0 0 0',	
                        name: 'ajob_out',
                        id: 'ajob_out',
                        labelSeparator : '',
                        msgTarget : 'under',
                        editable: false,
                        format: 'Y-m-d H:i',
                        emptyText : 'Date out',
                        minValue: new Date(),
                        flex: 1.5,
                        listeners: {
                        	"change": function () {
                        		   	var endDate = Ext.getCmp('ajob_out').getRawValue();
                           			Ext.getCmp('ajob_in').setMaxValue(endDate);
                        	}
                        }
                    }
                ]
			},
    	    {
				xtype: 'combobox',
				fieldLabel : 'Item Name ',
				name : 'aproj_ref_id',
				id : 'aproj_ref_id',
//				allowBlank: false,
				editable : false,
				queryMode : 'local',
				labelWidth : 120,
				msgTarget: 'under',
				emptyText : 'Item Name',
				store : {
					fields : [ 'proj_ref_id', 'itm_name', 'proj_ref_desc' ],
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
//				displayField : 'itm_name'
				// Template for the dropdown menu.
			    // Note the use of "x-boundlist-item" class,
			    // this is required to make the items selectable.
			    tpl: Ext.create('Ext.XTemplate',
			        '<tpl for=".">',
			        	"<tpl if='proj_ref_desc == \"\"'>",
			        	'<div class="x-boundlist-item">{itm_name}</div>',
			            '<tpl else>',
			            '<div class="x-boundlist-item">{itm_name} - {proj_ref_desc}</div>',
			            '</tpl>',
		            '</tpl>'
			    ),
			    // template for the content inside text field
			    displayTpl: Ext.create('Ext.XTemplate',
			        '<tpl for=".">',
			        	"<tpl if='proj_ref_desc == \"\"'>",
			        	'{itm_name}',
			            '<tpl else>',
			            '{itm_name} - {proj_ref_desc}',
			            '</tpl>',
			        '</tpl>'
			    )
			},
			{
    	    	xtype:'numberfield',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Amount / Hours ',
    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	name: 'aamount',
    	    	id: 'aamount',
    	    	emptyText : 'Amount or Hours',
    	    },{
    	    	xtype: 'textarea',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Job Detail',
    	    	name: 'ajob_ref_dtl',
    	    	id: 'ajob_ref_dtl',
    	    	emptyText: 'Job Details',
    	    	maxLength : 500,
				maxLengthText : 'Maximum input 500 Character',
    	    }]
            },{
            	xtype : 'hidden',
				id : 'arefjob_id',
				name : 'arefjob_id'
            }]
    		}],
            buttons:[{
            	text: 'Add & Print',
            	width:100,
            	id: 'apbtn',
                handler: function(){
               	 var form = Ext.getCmp('addJobRefForm').getForm();
               	 job_ref_name = Ext.getCmp('ajob_ref_name').getValue();
               	 if(form.isValid()){
       				 form.submit({
       				 url: 'createJobReference.htm?print=yes',
       				 waitTitle: 'Adding Job',
       				 waitMsg: 'Please wait...',
       				 standardSubmit: false,
                        success: function(response, opts) {
                        	Ext.Ajax.request({
    	           				url : 'chkJobRefName.htm',
    	           				params: {records : job_ref_name},
    	           				success: function(response, opts){
    	           					var responseOject = Ext.decode(response.responseText);
    	           					job_ref_id = responseOject.records[0].job_ref_id;
    	           					window.open('printJobTicket.htm?job_ref_id='+job_ref_id, '_blank');
    	           				},
    	           				failure: function(response, opts){
    	           					var responseOject = Ext.util.JSON.decode(response.responseText);
    	           					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
    	           				}
    	           			});	
                       	 Ext.MessageBox.show({
         						title: 'Information',
         						msg: 'Job Has Been Add!',
         						buttons: Ext.MessageBox.OK,
         						icon: Ext.MessageBox.INFO,
         						animateTarget: 'abtn',
         						fn: function(){
         							addJobRef.hide();
         							store.jobsRef.reload();
         							}
         					});
                           },
                           failure : function(form, action) {
								Ext.Msg.alert('Failed',
										action.result ? action.result.message
												: 'No response');
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
            },{xtype: 'tbspacer', width: 110},{	
           		  text: 'Add',
          		  width:100,
          		  id: 'abtn',
                 handler: function(){
                	 var form = Ext.getCmp('addJobRefForm').getForm();
                	 if(form.isValid()){
        				 form.submit({
        				 url: 'createJobReference.htm',
        				 waitTitle: 'Adding Job',
        				 waitMsg: 'Please wait...',
        				 standardSubmit: false,
                         success: function(form, action) {
                        	 Ext.MessageBox.show({
          						title: 'Information',
          						msg: 'Job Has Been Add!',
          						buttons: Ext.MessageBox.OK,
          						icon: Ext.MessageBox.INFO,
          						animateTarget: 'abtn',
          						fn: function(){
          							addJobRef.hide();
          							store.jobsRef.reload();
          							}
          					});
                            },
                            failure : function(form, action) {
								Ext.Msg.alert('Failed',
										action.result ? action.result.message
												: 'No response');
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
                	width:100,
                	handler: function(){
                		Ext.getCmp('addJobRefForm').getForm().reset();
                	}
                }],
               	listeners:{
               		'beforehide':function(){
               			Ext.getCmp('addJobRefForm').getForm().reset();
               		}
               	}
});

editJobRef = new Ext.create('Ext.window.Window', {
	title: 'Edit Job',
    animateTarget: 'edit',
    modal : true,
    resizable:false,
    width: 450,
    closeAction: 'hide',
    items :[{
    	xtype:'form',
        id:'editJobRefForm',
        items:[{
    		xtype:'fieldset',
            title: 'Job Information',
            defaultType: 'textfield',
            layout: 'anchor',
            padding: 10,
            width:400,
            style: {
                "margin-left": "auto",
                "margin-right": "auto",
                "margin-top": "10px",
                "margin-bottom": "10px"
            },
            defaults: {
                anchor: '100%'
            },
            items :[{
    	    	xtype:'textfield',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Job Name <font color="red">*</font> ',
    	    	emptyText : 'Job Name',
    	    	msgTarget : 'under',
    	    	name: 'ejob_ref_name',
    	    	id: 'ejob_ref_name',
    	    },{
				xtype : 'combobox',
				fieldLabel : 'Job Status <font color="red">*</font> ',
				name : 'ejob_ref_status',
				id : 'ejob_ref_status',
				queryMode : 'local',
				labelWidth : 120,
				emptyText : 'Job Status',
				allowBlank: false,
				editable : false,
				msgTarget: 'under',
				store : jobRefStatus,
				valueField : 'name',
				displayField : 'name',
			},{
				xtype: 'combobox',
				fieldLabel : 'Item Name ',
				name : 'eproj_ref_id',
				id : 'eproj_ref_id',
				queryMode : 'local',
				editable : false,
				labelWidth : 120,
				msgTarget: 'under',
				emptyText : 'Item Name',
				store : {
					fields : [ 'proj_ref_id', 'itm_name' ],
					proxy : {
						type : 'ajax',
						url : '',
						reader : {
							type : 'json',
							root : 'records',
							idProperty : 'proj_ref_id'
						}
					},
					autoLoad : true
				},
				valueField : 'proj_ref_id',
				displayField : 'itm_name'
			},
			{
				fieldLabel : 'Job in-out ',
				name : 'ajob_date',
				combineErrors: true,
				xtype: 'fieldcontainer',
				labelWidth : 100,
				width : 350,
				layout: 'hbox',
                defaults: {
                    flex: 1,
                },
                items: [
                    {
                        xtype: 'datefield',
                        name: 'ejob_in',
                        id: 'ejob_in',
                        labelSeparator : '',
                        margin: '0 0 0 20',
                        msgTarget : 'under',
                        flex: 1.1,
                        editable: false,
                        format: 'Y-m-d',
                        emptyText : 'Date in',
                        listeners: {
                        	   "change": function () {
                        		   			var startDate = Ext.getCmp('ejob_in').getRawValue();
                        		   			Ext.getCmp('ejob_out').setMinValue(startDate);
                        	   }
                        }
                    },
                 {
                   	xtype: 'fieldcontainer',
  	                combineErrors: true,
  	                margin: '0 0 0 0',
                 	labelSeparator : '',
                 	flex: 0.1
                 },
                    {
                        xtype: 'datetimefield',
                        margin: '0 0 0 0',	
                        name: 'ejob_out',
                        id: 'ejob_out',
                        labelSeparator : '',
                        msgTarget : 'under',
                        editable: false,
                        format: 'Y-m-d H:i',
                        emptyText : 'Date out',
                        minValue: new Date(),
                        flex: 1.5,
                        listeners: {
                        	"change": function () {
                        		   	var endDate = Ext.getCmp('ejob_out').getRawValue();
                           			Ext.getCmp('ejob_in').setMaxValue(endDate);
                        	}
                        }
                    }
                ]
			},
			{
    	    	xtype:'numberfield',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Amount / Hours ',
//    	    	allowBlank: false,
    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	name: 'eamount',
    	    	id: 'eamount',
    	    	emptyText : 'Amount or Hours',
    	    },{
    	    	xtype: 'textarea',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Job Detail',
    	    	name: 'ejob_ref_dtl',
    	    	id: 'ejob_ref_dtl',
    	    	emptyText: 'Job Details',
    	    	maxLength : 500,
				maxLengthText : 'Maximum input 500 Character',
    	    }]
            },
            {
				xtype : 'hidden',
				id : 'ejob_ref_id',
				name : 'ejob_ref_id'
            }
            ]
    		}],
            buttons:[{	
           		  text: 'Update',
          		  width:100,
          		  id: 'ebtn',
                 handler: function(){
                	 var form = Ext.getCmp('editJobRefForm').getForm();
                	 if(form.isValid()){
        				 form.submit({
        				 url: 'updateJobReference.htm',
        				 waitTitle: 'Updating Job',
        				 waitMsg: 'Please wait...',
        				 standardSubmit: false,
                         success: function(form, action) {
                        	 Ext.MessageBox.show({
          						title: 'Information',
          						msg: 'Job Has Been Update!',
          						buttons: Ext.MessageBox.OK,
          						icon: Ext.MessageBox.INFO,
          						animateTarget: 'ebtn',
          						fn: function(){
          							editJobRef.hide();
          							store.jobsRef.reload();
          							}
          					});
                            },
                            failure : function(form, action) {
								Ext.Msg.alert('Failed',
										action.result ? action.result.message
												: 'No response');
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
                	width:100,
                	handler: function(){
                		Ext.getCmp('editJobRefForm').getForm().reset();
                	}
                }],
               	listeners:{
               		'beforehide':function(){
               			Ext.getCmp('editJobRefForm').getForm().reset();
               		}
               	}
});


function confirmChk(btn) {
	if (btn == "yes") {
		Ext.Ajax.request({
					url : 'deleteJob.htm',
					params : {
						id : Ext.getCmp('jobid').getValue(),
					},
					success : function(response, opts) {
						Ext.MessageBox.show({
							title : 'Infomation',
							msg : 'Job has been delete!',
							buttons : Ext.MessageBox.OK,
							animateTarget : 'job_del',
							fn : function(){
								store.jobs.reload();
								Ext.getCmp('jobTabs').setDisabled(true);
								Ext.getCmp('jobTabs').setTitle("Jobs");
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
					url : 'deleteJobReference.htm',
					params : {
						id : Ext.getCmp('jobrefid').getValue(),
					},
					success : function(response, opts) {
						Ext.MessageBox.show({
							title : 'Infomation',
							msg : 'Job has been delete!',
							buttons : Ext.MessageBox.OK,
							animateTarget : 'del',
							fn : function(){store.jobsRef.reload();},
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

function combinecols2(value, meta, record, rowIndex, colIndex, store) {
    return record.get('cus_name')+' - '+record.get('cus_code');
}

function renderTime(value, meta, record, rowIndex, colIndex, store) {
    return record.get('time')+' mins';
} 
