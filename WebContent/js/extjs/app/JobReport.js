store = {};
panels = {};
myStackItem = [];
myRadarItem = [];

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

	jobid = new Ext.form.Hidden({
		name : 'jobid',
		id : 'jobid'
	});
	cusid = new Ext.form.Hidden({
		name : 'cusid',
		id : 'cusid'
	});
	
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
								url: 'showProjects.htm?type=all&id='+myId
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
								url: 'showProjects.htm?type=all&id='+myId
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
							var item = Ext.getCmp('sitm_id');
							var proj_id = Ext.getCmp('sproj_id').getValue();

							item.clearValue();
							item.getStore().removeAll();
							item.getStore().load({
								url: 'showItem.htm?id='+proj_id
							});
						}
					}
				},{
					xtype: 'combobox',
					fieldLabel : 'Item Name ',
					name : 'sitm_id',
					id : 'sitm_id',
					queryMode : 'local',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 280,
					emptyText : 'Item Name',
					store : {
						fields : [ 'itm_id', 'itm_name' ],
						proxy : {
							type : 'ajax',
							url : 'showItem.htm?id=0',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'itm_id'
							}
						},
						autoLoad : true,
						sorters: [{
					         property: 'itm_name',
					         direction: 'ASC'
					     }]
					},
					valueField : 'itm_id',
					displayField : 'itm_name'
				}  ]
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
				    fieldLabel : 'Job Name ',
				    name : 'sjob_name',
				    id : 'sjob_name',
				    labelWidth : 100,
					margin : '0 0 10 0',
					width : 280,
					emptyText : 'Job Name'
				    
				    },{
						xtype : 'combobox',
						fieldLabel : 'Department ',
						name : 'sdept',
						id : 'sdept',
						queryMode : 'local',
						labelWidth : 100,
						emptyText : 'Department',
						editable : false,
						width : 280,
						margin : '0 0 10 0',
						msgTarget: 'under',
						store : department,
						valueField : 'name',
						displayField : 'name',
					},{
						fieldLabel : 'Between Date',
						name : 'sbtw_date',
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
		                        xtype     : 'datefield',
		                        name      : 'sbtw_start',
		                        id	: 'sbtw_start',
		                        labelSeparator : '',
		                        margin: '0 0 0 0',
		                        msgTarget : 'side',
		                        width: 50,
		                        emptyText : 'Start',
		                        editable: false,
		                        format: 'Y-m-d',
//		                        maxValue: new Date(),
		                        listeners: {
		                        	   "change": function () {
		                        		   			var startDate = Ext.getCmp('sbtw_start').getRawValue();
		                        		   			Ext.getCmp('sbtw_end').setMinValue(startDate);
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
		                        name      : 'sbtw_end',
		                        id	: 'sbtw_end',
		                        labelSeparator : '',
		                        msgTarget : 'side',
		                        emptyText : 'End',
		                        editable: false,
		                        format: 'Y-m-d',
//		                        maxValue: new Date(),
		                        width: 50,
		                        listeners: {
		                        	"change": function () {
		                        		   	var endDate = Ext.getCmp('sbtw_end').getRawValue();
		                           			Ext.getCmp('sbtw_start').setMaxValue(endDate);
		                        	}
		                        }
		                    }
		                ]
					}, {
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
						url : 'searchJobsParam.htm' + getParamValues(),
						success : function(response, opts) {
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
				Ext.getCmp('sproj_id').getStore().load({url: 'showProjects.htm?type=all&id=0'});
//				Ext.getCmp('scus_id').setValue("");
//				Ext.getCmp('update_start').setMaxValue(new Date());
//				Ext.getCmp('update_limit').setMinValue('');
			}
		} ]

	});

	panels.grid = Ext.create('Ext.grid.Panel', {
		renderTo : document.body,
//		xtype: 'row-expander-grid',
		title : 'Job Report',
		split : true,
		forceFit : true,
		loadMask : true,
		autoWidth : true,
		frame : true,
		store : store.jobs,
		tools : [ {
			xtype : 'button',
			text : 'Radar',
			id : 'ichart',
			margin : '0 5 0 0',
//			disabled : true,
			iconCls : 'chart-line',
			handler : function() {
				myRadarItem = [];
				itmCount = 0;
				for(var i=0; i<store.radarItem.count(); i++){
					myRadarItem[i]=store.radarItem.getAt(i).getData().dept;
					itmCount = i+1;
				};
				myRadarItem[itmCount]="itm_name";
//				dailyRadarModel.setFields(myRadarItem);
				myRadarItem.pop();
				store.dailyRadar.load({
					url: 'dailyRadar.htm?dept_list='+myRadarItem.toString()
				});
				chartRadar.show();
			}
		},{
			xtype : 'button',
			text : 'Stack',
			id : 'ichart2',
			margin : '0 5 0 0',
//			disabled : true,
			iconCls : 'chart-bar',
			handler : function() {
//				myStackItem = [];
//				itmCount = 0;
//				for(var i=0; i<store.stackItem.count(); i++){
//					myStackItem[i]=store.stackItem.getAt(i).getData().itm_name;
//					itmCount = i+1;
//				};
//				myStackItem[itmCount]="dept";
//				dailyStackModel.setFields(myStackItem);
//				myStackItem.pop();
//				store.dailyStack.load({
//					url: 'dailyStack.htm?itm_list='+myStackItem.toString()
//				});
				myRadarItem = [];
				itmCount = 0;
				for(var i=0; i<store.radarItem.count(); i++){
					myRadarItem[i]=store.radarItem.getAt(i).getData().dept;
					itmCount = i+1;
				};
				myRadarItem[itmCount]="itm_name";
//				dailyRadarModel.setFields(myRadarItem);
				myRadarItem.pop();
				store.dailyRadar.load({
					url: 'dailyRadar.htm?dept_list='+myRadarItem.toString()
				});
				chartStack.show();
			}
		},{
			xtype : 'button',
			text : 'Report',
			id : 'ireport',
			margin : '0 5 0 0',
			disabled : true,
			iconCls : 'icon-print',
			handler : function() {
				alert("Print Report!");
				var form = Ext.getCmp('formPanel').getForm();	   	
//				if (form.isValid()) {
//                    
//                	console.debug("Valid genarate form...");
//                	
//                    form.submit({
//                    	target : '_blank',
//                        url: 'printReport.htm',
//                        method: 'POST',
//                        reset: true,
//                        standardSubmit: true,
//                    });
//                }
			}
		},{
			xtype : 'button',
			text : 'Add Job',
			id : 'icreate',
			iconCls : 'icon-add',
			handler : function() {
//				addJob.showAt(panels.search.getX()+150,panels.search.getY());
				addJob.show();
			}
		} ],
		style : {
			"margin-left" : "auto",
			"margin-right" : "auto",
			"margin-top" : "15px",
			"margin-bottom" : "10px"
		},
		width : 1000,
		height : 400,
		columns : [
				{
					text : "Customer Name",
					flex : 2.5,
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
					text : "Job Name",
					flex : 2,
					sortable : true,
					dataIndex : 'job_name'
				},
				{
					text : "Amount",
					flex : 1,
					sortable : true,
					dataIndex : 'amount'
				},
//				{
//					text : "Time",
//					flex : 1,
//					sortable : true,
//					dataIndex : 'time'
//				},
				{
					text : "Start",
					flex : 1.2,
					sortable : true,
					dataIndex : 'job_in',
					renderer: Ext.util.Format.dateRenderer('Y-m-d')
				},
				{
					text : "End",
					flex : 1.2,
					sortable : true,
					dataIndex : 'job_out',
					renderer: Ext.util.Format.dateRenderer('Y-m-d')
				},
				{
					text : "Dept",
					flex : 0.8,
					sortable : true,
					dataIndex : 'dept'
				},
				{
					text : 'Edit',
					xtype : 'actioncolumn',
					flex : 0.8,
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

							
							Ext.getCmp('eproj_id').getStore().load({
								url: 'showProjects.htm?type=all&id='+cus_id
							});
							
							Ext.getCmp('eproj_ref_id').getStore().load({
								url: 'showProjectsReference.htm?id='+proj_id
							});
							
							Ext.getCmp('ejob_id').setValue(job_id);
							Ext.getCmp('ejob_name').setValue(job_name);
							Ext.getCmp('ecus_name').setValue(cus_name);
							Ext.getCmp('ecus_code').setValue(cus_code);
							Ext.getCmp('eproj_id').setValue(proj_id);
							Ext.getCmp('eproj_ref_id').setValue(proj_ref_id);
							Ext.getCmp('ejob_dtl').setValue(job_dtl);
							Ext.getCmp('eamount').setValue(amount);
							Ext.getCmp('edept').setValue(dept);
							Ext.getCmp('ejob_in').setValue(job_in);
							Ext.getCmp('ejob_out').setValue(job_out);
							editJob.show();
						}
					} ]
				},
				{
					text : 'Delete',
					xtype : 'actioncolumn',
//					width : 10%,
					flex : 0.8,
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
//		            width: 'auto',
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
		bbar : Ext.create('Ext.PagingToolbar', {
			store : store.jobs,
			displayInfo : true,
			displayMsg : 'Displaying Jobs {0} - {1} of {2}',
			emptyMsg : "No Job to display",
			plugins : Ext.create('Ext.ux.ProgressBarPager', {})
		})
	});
	

	chartStack = new Ext.create('Ext.window.Window',{
		width : 800,
		height : 600,
		minHeight : 450,
		animateTarget : 'ichart2',
		minWidth : 600,
//		modal : true,
		hidden : false,
		shadow : false,
		maximizable : true,
		closeAction : 'hide',
		style : 'overflow: hidden;',
		title : 'Stack Chart - GSD',
		layout : 'fit',
		items : [ {
			region : 'center',
			defaults : {
				hideMode : 'offsets',
				layout : 'fit'
			},
			xtype : 'tabpanel',
			items : [ {
						title : 'Daily',
						items : [ {
							region : 'center',
							defaults : {
								hideMode : 'offsets',
								layout : 'fit'
							},
							tabPosition : 'left',
							tbar : [ {
								text : 'Save Chart',
								iconCls : 'icon-camera',
								handler : function() {
										Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an image?',
										function(choice) {
											if (choice == 'yes') {
												stack.save({
													type : 'image/png'
												});
											}
										});
									}
								},{
								text : 'Generate Excel',
								iconCls : 'icon-print',
								handler : function() {
										Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an excel?',
										function(choice) {
											if (choice == 'yes') {
												stack.save({
													type : 'image/png'
													});
											}
										});
									}
								} 
							],
							xtype : 'tabpanel',
							items : [ {
								title : 'Amount',
								items : stack
							}, {
								title : 'Hours'
							}, {
								title : 'Manpower'
							} ]
						} ]
					},
					{
						title : 'Weekly',
						items : [ {
							region : 'center',
							defaults : {
								hideMode : 'offsets',
								layout : 'fit'
							},
							tabPosition : 'left',
							tbar : [ {
								text : 'Save Chart',
								iconCls : 'icon-camera',
								handler : function() {
										Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an image?',
										function(choice) {
											if (choice == 'yes') {
												stack.save({
													type : 'image/png'
												});
											}
										});
									}
								},{
								text : 'Generate Excel',
								iconCls : 'icon-print',
								handler : function() {
										Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an excel?',
										function(choice) {
											if (choice == 'yes') {
												stack.save({
													type : 'image/png'
													});
											}
										});
									}
								} 
							],
							xtype : 'tabpanel',
							items : [ {
								title : 'Amount',
							// items: chart
							}, {
								title : 'Hours'
							}, {
								title : 'Manpower'
							} ]
						} ]
					},
					{
						title : 'Monthly',
						items : [ {
							region : 'center',
							defaults : {
								hideMode : 'offsets',
								layout : 'fit'
							},
							tabPosition : 'left',
							tbar : [ {
								text : 'Save Chart',
								iconCls : 'icon-camera',
								handler : function() {
										Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an image?',
										function(choice) {
											if (choice == 'yes') {
												stack.save({
													type : 'image/png'
												});
											}
										});
									}
								},{
								text : 'Generate Excel',
								iconCls : 'icon-print',
								handler : function() {
										Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an excel?',
										function(choice) {
											if (choice == 'yes') {
												stack.save({
													type : 'image/png'
													});
											}
										});
									}
								} 
							],
							xtype : 'tabpanel',
							items : [ {
								title : 'Amount',
							//	items : chart
							}, {
								title : 'Hours'
							}, {
								title : 'Manpower'
							} ]
						} ]
					} ]
		} ]

	});	

}); //end onReady

var store1 = Ext.create('Ext.data.JsonStore', {
    fields: ['dept', 'clipping', 'alpha', 'retouch', 'indesign'],
    data: [
            {dept: 'PP', clipping: 1000, alpha: 600, retouch: 600, indesign: 200},
            {dept: 'PK', clipping: 300, alpha: 200, retouch: 800, indesign: 600},
            {dept: 'CM', clipping: 200, alpha: 100, retouch: 300, indesign: 100},
            {dept: 'BKK', clipping: 100, alpha: 20, retouch: 200, indesign: 50}
          ]
});

var store3 = Ext.create('Ext.data.JsonStore', {
    fields: ['type','PP','CM','PK','BKK','KK','time'],
    data: [
            {'type':'Clipping', 'PP':1000, 'CM':200, 'PK':300, 'BKK':50, 'KK':400, 'time':10},
            {'type':'Alpha', 'PP':500, 'CM':50, 'PK':100, 'BKK':50, 'KK':200, 'time':45},
            {'type':'Retouch', 'PP':400, 'CM':350, 'PK':1000, 'BKK':200, 'KK':500, 'time':30},
          ]
});

var store2 = Ext.create('Ext.data.JsonStore', {
    fields: ['itm_name','PP','PK'],
    data: [
            {'itm_name':'Basic Clipping', 'PP':80.5, 'PK':0},
            {'itm_name':'Basic Retouch', 'PP':10, 'PK':50},
          ]
});

Ext.define('dailyStackModel', {
	extend : 'Ext.data.Model',
	fields : []
});
	
store.stackItem = Ext.create('Ext.data.JsonStore', {
	autoLoad : true,
	fields : ['itm_name'],
	proxy : {
		type : 'ajax',
		url : 'stackItem.htm',
		reader : {
			type : 'json',
			root : 'records',
		}
	}
});

store.dailyStack = Ext.create('Ext.data.JsonStore', {
	model : 'dailyStackModel',
	id : 'dailyStackStore',
	autoLoad : false,
	proxy : {
		type : 'ajax',
//		url : 'searchJobs.htm',
		reader : {
			type : 'json',
			root : 'records',
			totalProperty : 'total'
		}
	}
});

Ext.define('dailyRadarModel', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'itm_name',
		type : 'string'
	},{
		name : 'PP',
		type : 'float'
	},{
		name : 'PK',
		type : 'float'
	},{
		name : 'CM',
		type : 'float'
	},{
		name : 'KK',
		type : 'float'
	},{
		name : 'BKK',
		type : 'float'
	}]
});
	
store.radarItem = Ext.create('Ext.data.JsonStore', {
	autoLoad : true,
	fields : ['dept'],
	proxy : {
		type : 'ajax',
		url : 'radarItem.htm',
		reader : {
			type : 'json',
			root : 'records',
		}
	}
});

store.dailyRadar = Ext.create('Ext.data.JsonStore', {
	autoDestroy: true,
	model : 'dailyRadarModel',
	id : 'dailyRadarStore',
	autoLoad : false,
	proxy : {
		type : 'ajax',
//		url : 'searchJobs.htm',
		reader : {
			type : 'json',
			root : 'records',
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
		name : 'cus_name',
		type : 'string'
	}, {
		name : 'cus_code',
		type : 'string'
	}, {
		name : 'proj_name',
		type : 'string'
	}, {
		name : 'itm_name',
		type : 'string'
	}, {
		name : 'amount',
		type : 'int'
	}, {
		name : 'job_in',
		type : 'date',
		dateFormat: 'Y-m-d H:i:s'
	}, {
		name : 'job_out',
		type : 'date',
		dateFormat: 'Y-m-d H:i:s'
	}, {
		name : 'dept',
		type : 'string'
	}, {
		name : 'cus_id',
		type : 'int'
	}, {
		name : 'proj_ref_id',
		type : 'int'
	}, {
		name : 'itm_id',
		type : 'int'
	}, {
		name : 'proj_id',
		type : 'int'
	}
	]
});

store.jobs = Ext.create('Ext.data.JsonStore', {
	model : 'jobModel',
	id : 'projStore',
	pageSize : 10,
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'searchJobs.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'job_id',
			totalProperty : 'total'
		}
	},
//	listeners: {
//		'load' : function(){
//			for(var xyz=0;xyz<store.projects.count();xyz++){
//				if(Ext.fly(panels.grid.plugins[0].view.getNodes()[xyz]).hasCls(panels.grid.plugins[0].rowCollapsedCls) == true){
//					panels.grid.plugins[0].toggleRow(xyz, panels.grid.getStore().getAt(xyz));
//				}
//			}
//		}
//	}
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
        //...
    ]
});

var department = Ext.create('Ext.data.Store', {
	fields: ['name'],
	data : [
	        {"name":"PP"},
	        {"name":"PK"},
	        {"name":"CM"},
	        {"name":"KK"},
	        {"name":"BKK"}
	]
})

stack = Ext.create('Ext.chart.Chart',{
    animate: true,
    shadow: true,
    store: store.dailyRadar,
    legend: {
        position: 'right'
    },
    axes: [{
        type: 'Numeric',
        position: 'bottom',
//        fields: myStackItem,
        fields: ["PP","PK","CM","KK","BKK"],
        title: false,
        grid: true,
        label: {
        	renderer: Ext.util.Format.numberRenderer('0,0')
//            renderer: function(v) {
//            	return String(v).replace(/(.)00000$/, '.$1M');
//            }
        }
    }, {
        type: 'Category',
        position: 'left',
        fields: ['itm_name'],
        title: false
    }],
    series: [{
        type: 'bar',
        axis: 'bottom',
        gutter: 80,
        xField: 'itm_name',
        yField: ["PP","PK","CM","KK","BKK"],
        highlight: true,
        stacked: true,
        tips: {
            trackMouse: true,
            width: 110,
            height: 28,
            renderer: function(storeItem, item) {
            	for( var i = 0; i < item.series.items.length; i++ ){
                    if( item == item.series.items[i] ){
                    	itemsPerRec = item.series.items.length / item.storeItem.store.getCount();
                    	Y=item.series.yField[ i % itemsPerRec ]; 
                    }
                }
            	this.update( '<b>' + Y + '</b> = ' + String(item.value[1]));
            }
        },
//        label: {
//            display: 'insideEnd',
//              field: ['clipping', 'alpha', 'retouch', 'indesign'],
//              renderer: Ext.util.Format.numberRenderer('0'),
//              orientation: 'horizontal',
//              color: '#333',
//              'text-anchor': 'middle'
//          }
    }]
});

var seriesConfig = function(field) {
    return {
        type: 'radar',
        xField: 'itm_name',
        yField: field,
        showInLegend: true,
        showMarkers: true,
        markerConfig: {
            radius: 5,
            size: 5
        },
        tips: {
            trackMouse: true,
            width: 150,
            height: 28,
            renderer: function(storeItem, item) {
//                this.setTitle(storeItem.get('name') + ': ' + storeItem.get(field));
//            	this.setTitle(storeItem.get('type') + ': ' + ((storeItem.get(field))*(storeItem.get('time'))/60/8));
            	if(storeItem.get(field) == ""){
            		this.setTitle(storeItem.get('itm_name') + ": 0");
            	}else{
            		this.setTitle(storeItem.get('itm_name') + ': ' + storeItem.get(field));
            	}
            }
        },
        style: {
            'stroke-width': 2,
//            opacity: 0.4
            fill: 'none'
        }
    }
}

radar = Ext.create('Ext.chart.Chart', {
		id: 'dailyRadar',
        style: 'background:#fff',
        theme: 'Category2',
        animate: true,
        store: store.dailyRadar,
        insetPadding: 20,
        legend: {
            position: 'right'
        },
        axes: [{
            type: 'Radial',
            position: 'radial',
            label: {
                display: true
            }
        }],
        series: [seriesConfig('PK'),seriesConfig('PP'),seriesConfig('CM'),seriesConfig('KK'),seriesConfig('BKK')]
});

chartRadar = new Ext.create('Ext.window.Window',{
	width : 800,
	height : 600,
	minHeight : 450,
	animateTarget : 'ichart',
	minWidth : 600,
	hidden : false,
	shadow : false,
	maximizable : true,
	closeAction : 'hide',
	style : 'overflow: hidden;',
	title : 'Radar Chart - GSD',
	layout : 'fit',
	items : [ {
		region : 'center',
		defaults : {
			hideMode : 'offsets',
			layout : 'fit'
		},
		xtype : 'tabpanel',
		items : [ {
					title : 'Daily',
					items : [ {
						region : 'center',
						defaults : {
							hideMode : 'offsets',
							layout : 'fit'
						},
						tabPosition : 'left',
						tbar : [ {
							text : 'Save Chart',
							iconCls : 'icon-camera',
							handler : function() {
									Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an image?',
									function(choice) {
										if (choice == 'yes') {
											radar.save({
												type : 'image/png'
											});
										}
									});
								}
							},{
							text : 'Generate Excel',
							iconCls : 'icon-print',
							handler : function() {
									Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an excel?',
									function(choice) {
										if (choice == 'yes') {
											radar.save({
												type : 'image/png'
												});
										}
									});
								}
							} 
						],
						xtype : 'tabpanel',
						items : [ {
							title : 'Amount',
							items : radar
						}, {
							title : 'Hours'
						}, {
							title : 'Manpower'
						} ]
					} ]
				},
				{
					title : 'Weekly',
					items : [ {
						region : 'center',
						defaults : {
							hideMode : 'offsets',
							layout : 'fit'
						},
						tabPosition : 'left',
						tbar : [ {
							text : 'Save Chart',
							iconCls : 'icon-camera',
							handler : function() {
									Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an image?',
									function(choice) {
										if (choice == 'yes') {
											radar.save({
												type : 'image/png'
											});
										}
									});
								}
							},{
							text : 'Generate Excel',
							iconCls : 'icon-print',
							handler : function() {
									Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an excel?',
									function(choice) {
										if (choice == 'yes') {
											radar.save({
												type : 'image/png'
												});
										}
									});
								}
							} 
						],
						xtype : 'tabpanel',
						items : [ {
							title : 'Amount',
						// items: chart
						}, {
							title : 'Hours'
						}, {
							title : 'Manpower'
						} ]
					} ]
				},
				{
					title : 'Monthly',
					items : [ {
						region : 'center',
						defaults : {
							hideMode : 'offsets',
							layout : 'fit'
						},
						tabPosition : 'left',
						tbar : [ {
							text : 'Save Chart',
							iconCls : 'icon-camera',
							handler : function() {
									Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an image?',
									function(choice) {
										if (choice == 'yes') {
											radar.save({
												type : 'image/png'
											});
										}
									});
								}
							},{
							text : 'Generate Excel',
							iconCls : 'icon-print',
							handler : function() {
									Ext.MessageBox.confirm('Confirm Download','Would you like to download the chart as an excel?',
									function(choice) {
										if (choice == 'yes') {
											radar.save({
												type : 'image/png'
												});
										}
									});
								}
							} 
						],
						xtype : 'tabpanel',
						items : [ {
							title : 'Amount',
						//	items : chart
						}, {
							title : 'Hours'
						}, {
							title : 'Manpower'
						} ]
					} ]
				} ]
	} ]

});

addJob = new Ext.create('Ext.window.Window', {
	title: 'Add Job',
    animateTarget: 'icreate',
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
						var proj_ref = Ext.getCmp('aproj_ref_id');
						var v = this.getValue();
						var record = this.findRecord(this.valueField || this.displayField, v);
						var myIndex = this.store.indexOf(record);
						var myValue = this.store.getAt(myIndex).data.cus_code;
						var myId = this.store.getAt(myIndex).data.cus_id;
						Ext.getCmp('acus_code').setValue(myValue);

						proj_ref.clearValue();
						proj_ref.getStore().removeAll();
						proj.clearValue();
						proj.getStore().removeAll();
						proj.getStore().load({
							url: 'showProjects.htm?type=all&id='+myId
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
						var proj_ref = Ext.getCmp('aproj_ref_id');
						var v = this.getValue();
						var record = this.findRecord(this.valueField || this.displayField, v);
						var myIndex = this.store.indexOf(record);
						var myValue = this.store.getAt(myIndex).data.cus_name;
						var myId = this.store.getAt(myIndex).data.cus_id;
						Ext.getCmp('acus_name').setValue(myValue);

						proj_ref.clearValue();
						proj_ref.getStore().removeAll();
						proj.clearValue();
						proj.getStore().removeAll();
						proj.getStore().load({
							url: 'showProjects.htm?type=all&id='+myId
						});
						
					}
				}
			},{
				xtype: 'combobox',
				fieldLabel : 'Project Name <font color="red">*</font> ',
				name : 'aproj_id',
				id : 'aproj_id',
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
				queryMode : 'local',
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
					autoLoad : true,
					sorters: [{
				         property: 'itm_name',
				         direction: 'ASC'
				     }]
				},
				valueField : 'proj_ref_id',
				displayField : 'itm_name'
			},{
    	    	xtype:'textfield',
    	    	labelWidth: 120,
    	    	allowBlank: false,
    	    	fieldLabel: 'Job Name <font color="red">*</font> ',
    	    	emptyText : 'Job Name',
//    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	maxLength : 50,
    	    	name: 'ajob_name',
    	    	id: 'ajob_name',
    	    },{
				fieldLabel : 'Job in-out <font color="red">*</font> ',
				name : 'ajob_date',
				combineErrors: true,
				xtype: 'fieldcontainer',
				labelWidth : 100,
//				margin : '0 0 10 0',
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
                        allowBlank: false,
                        labelSeparator : '',
                        margin: '0 0 0 20',
                        msgTarget : 'under',
                        width: 50,
                        editable: false,
                        format: 'Y-m-d',
                        emptyText : 'Date in',
                        value: new Date(),
//                        maxValue: new Date(),
                        listeners: {
                        	   "change": function () {
                        		   			var startDate = Ext.getCmp('ajob_in').getRawValue();
                        		   			Ext.getCmp('ajob_out').setMinValue(startDate);
                        	   }
                        }
                    },{
                    	 xtype: 'fieldcontainer',
     	                fieldLabel: 'To : ',
     	                combineErrors: true,
     	                msgTarget : 'under',
     	                margin: '0 0 0 10',
                    	labelSeparator : '',
                        Width : 20
                    },
                    {
                        xtype: 'datefield',
                        margin: '0 0 0 -60',	
                        name: 'ajob_out',
                        id: 'ajob_out',
                        labelSeparator : '',
                        msgTarget : 'under',
                        editable: false,
                        allowBlank: false,
                        format: 'Y-m-d',
                        emptyText : 'Date out',
//                        maxValue: new Date(),
                        minValue: new Date(),
                        width: 50,
                        listeners: {
                        	"change": function () {
                        		   	var endDate = Ext.getCmp('ajob_out').getRawValue();
                           			Ext.getCmp('ajob_in').setMaxValue(endDate);
                        	}
                        }
                    }
                ]
			},{
    	    	xtype:'numberfield',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Amount <font color="red">*</font> ',
    	    	allowBlank: false,
    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	name: 'aamount',
    	    	id: 'aamount',
    	    	emptyText : 'Amount',
    	    },{
				xtype : 'combobox',
				fieldLabel : 'Department <font color="red">*</font> ',
				name : 'adept',
				id : 'adept',
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
    	    	xtype: 'textarea',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Job Detail',
    	    	name: 'ajob_dtl',
    	    	id: 'ajob_dtl',
    	    	emptyText: 'Job Details',
    	    	maxLength : 100,
				maxLengthText : 'Maximum input 100 Character',
    	    }]
            },
//            {
//				xtype : 'hidden',
//				id : 'aproj_id',
//				name : 'aproj_id'
//            }
            ]
    		}],
            buttons:[{
            	text: 'Reset',
            	width:100,
            	handler: function(){
            		Ext.getCmp('addJobForm').getForm().reset();
            	}
            },{	
           		  text: 'Add',
          		  width:100,
          		  id: 'abtn',
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
          						msg: 'Job Has Been Add!',
          						buttons: Ext.MessageBox.OK,
          						icon: Ext.MessageBox.INFO,
          						animateTarget: 'abtn',
          						fn: function(){
          							addJob.hide();
          							store.jobs.reload();
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
               	}],
               	listeners:{
               		'beforehide':function(){
               			Ext.getCmp('addJobForm').getForm().reset();
               		}
               	}
});

editJob = new Ext.create('Ext.window.Window', {
	title: 'Edit Job',
    animateTarget: 'edit',
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
						var proj_ref = Ext.getCmp('eproj_ref_id');
						var v = this.getValue();
						var record = this.findRecord(this.valueField || this.displayField, v);
						var myIndex = this.store.indexOf(record);
						var myValue = this.store.getAt(myIndex).data.cus_code;
						var myId = this.store.getAt(myIndex).data.cus_id;
						Ext.getCmp('ecus_code').setValue(myValue);

						proj_ref.clearValue();
						proj_ref.getStore().removeAll();
						proj.clearValue();
						proj.getStore().removeAll();
						proj.getStore().load({
							url: 'showProjects.htm?type=all&id='+myId
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
						var proj_ref = Ext.getCmp('eproj_ref_id');
						var v = this.getValue();
						var record = this.findRecord(this.valueField || this.displayField, v);
						var myIndex = this.store.indexOf(record);
						var myValue = this.store.getAt(myIndex).data.cus_name;
						var myId = this.store.getAt(myIndex).data.cus_id;
						Ext.getCmp('ecus_name').setValue(myValue);

						proj_ref.clearValue();
						proj_ref.getStore().removeAll();
						proj.clearValue();
						proj.getStore().removeAll();
						proj.getStore().load({
							url: 'showProjects.htm?type=all&id='+myId
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
					}
				}
			},{
				xtype: 'combobox',
				fieldLabel : 'Item Name <font color="red">*</font> ',
				name : 'eproj_ref_id',
				id : 'eproj_ref_id',
				allowBlank: false,
				queryMode : 'local',
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
			},{
    	    	xtype:'textfield',
    	    	labelWidth: 120,
    	    	allowBlank: false,
    	    	fieldLabel: 'Job Name <font color="red">*</font> ',
    	    	emptyText : 'Job Name',
//    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	name: 'ejob_name',
    	    	id: 'ejob_name',
    	    },{
				fieldLabel : 'Job in-out <font color="red">*</font> ',
				name : 'ejob_date',
				combineErrors: true,
				xtype: 'fieldcontainer',
				labelWidth : 100,
//				margin : '0 0 10 0',
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
                        allowBlank: false,
                        labelSeparator : '',
                        margin: '0 0 0 20',
                        msgTarget : 'under',
                        width: 50,
                        editable: false,
                        format: 'Y-m-d',
                        emptyText : 'Date in',
                        value: new Date(),
//                        maxValue: new Date(),
                        listeners: {
                        	   "change": function () {
                        		   			var startDate = Ext.getCmp('ejob_in').getRawValue();
                        		   			Ext.getCmp('ejob_out').setMinValue(startDate);
                        	   }
                        }
                    },{
                    	 xtype: 'fieldcontainer',
     	                fieldLabel: 'To : ',
     	                combineErrors: true,
     	                msgTarget : 'under',
     	                margin: '0 0 0 10',
                    	labelSeparator : '',
                        Width : 20
                    },
                    {
                        xtype: 'datefield',
                        margin: '0 0 0 -60',	
                        name: 'ejob_out',
                        id: 'ejob_out',
                        labelSeparator : '',
                        msgTarget : 'under',
                        editable: false,
                        allowBlank: false,
                        format: 'Y-m-d',
                        emptyText : 'Date out',
//                        maxValue: new Date(),
                        minValue: new Date(),
                        width: 50,
                        listeners: {
                        	"change": function () {
                        		   	var endDate = Ext.getCmp('ejob_out').getRawValue();
                           			Ext.getCmp('ejob_in').setMaxValue(endDate);
                        	}
                        }
                    }
                ]
			},{
    	    	xtype:'numberfield',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Amount <font color="red">*</font> ',
    	    	allowBlank: false,
    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	name: 'eamount',
    	    	id: 'eamount',
    	    	emptyText : 'Amount',
    	    },{
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
    	    	xtype: 'textarea',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Job Detail',
    	    	name: 'ejob_dtl',
    	    	id: 'ejob_dtl',
    	    	emptyText: 'Job Details',
    	    	maxLength : 50,
				maxLengthText : 'Maximum input 100 Character',
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
            	text: 'Reset',
            	width:100,
            	handler: function(){
            		Ext.getCmp('editJobForm').getForm().reset();
            	}
            },{	
           		  text: 'Update',
          		  width:100,
          		  id: 'ebtn',
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
          						msg: 'Job Has Been Update!',
          						buttons: Ext.MessageBox.OK,
          						icon: Ext.MessageBox.INFO,
          						animateTarget: 'ebtn',
          						fn: function(){
          							editJob.hide();
          							store.jobs.reload();
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
               	}],
               	listeners:{
               		'beforehide':function(){
               			Ext.getCmp('editJobForm').getForm().reset();
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
							animateTarget : 'del',
							fn : function(){store.jobs.reload();},
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
