store = {};
panels = {};
grid = {};
map = {};
myStackItem = [];
myRadarItem = [];
editorDate = "";
myDept = "";
notLoaded = true;

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
            
			var delivery_date = me.selectMonth;
			var max_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth()+1, 0);
			var min_date = new Date(delivery_date.getFullYear(), delivery_date.getMonth(), 1);
			Ext.getCmp('ainv_bill_date').setValue('');
			Ext.getCmp('ainv_bill_date').setMinValue(min_date);
			Ext.getCmp('ainv_bill_date').setMaxValue(max_date);
            
        	var delivery_date2 = me.selectMonth;
        	var cus_id = Ext.getCmp('cusid').getValue();
        	month = delivery_date2.getMonth()+1;
    		year = delivery_date2.getFullYear();
    		aejob_inv_id = Ext.getCmp('aejob_inv_id');
    		aejob_inv_id.clearValue();
    		aejob_inv_id.getStore().removeAll();
    		aejob_inv_id.getStore().load({
				url: 'showInvoiceCustomer.htm?cus_id='+cus_id+'&month='+month+'&year='+year
			});
        },
        onSelect: function (m, d) {
            var me = this;
            me.selectMonth = new Date((d[0] + 1) + '/1/' + d[1]);
        }
    });
	
	map.document = new Ext.util.KeyMap(document,{
	    key: [117], // press F6
//	    ctrl:true,
	    fn: function(){ 
//	    	alert("map.doc");
	    	if(panels.tabs.activeTab.id == "jobTabs"){
	    		Ext.get('isave-sync').dom.click();
	    	}else if(panels.tabs.activeTab.id == "publicationTabs"){
	    		Ext.get('isave-syncPub').dom.click();
	    	}else if(panels.tabs.activeTab.id == "estudioTabs"){
	    		Ext.get('isave-syncEstudio').dom.click();
	    	}
	    }
	});
	
	Ext.Ajax.request({
		url : 'searchJobsParam.htm?first=yes',
		success : function(response, opts) {
			store.jobs.loadPage(1);
		}
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
	});
	cusid = new Ext.form.Hidden({
		name : 'cusid',
		id : 'cusid'
	});
	projid = new Ext.form.Hidden({
		name : 'projid',
		id : 'projid'
	});
	projrefid = new Ext.form.Hidden({
		name : 'projrefid',
		id : 'projrefid'
	});
	projrefidtoday = new Ext.form.Hidden({
		name : 'projrefidtoday',
		id : 'projrefidtoday'
	});
	
	grid.job = Ext.create('Ext.ux.LiveFilterGridPanel', {
		id : 'mainGrid',
		store : store.jobs,
		indexes : ['job_name','cus_name','proj_name'],
//		tbar : ['->',{
//			xtype : 'button',
//			text : "Add Job's Project",
//			id : 'job_add',
//			iconCls : 'icon-add',
//			handler : function() {
//				addJob.show();
//			}
//		}],
		height : 608,
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
						myDept = grid.getStore().getAt(rowIndex).get('dept');
						cus_id = grid.getStore().getAt(rowIndex).get('cus_id');
//						totalAmount = grid.getStore().getAt(rowIndex).get('total_amount');
						Ext.getCmp('cusid').setValue(cus_id);
						Ext.getCmp('projid').setValue(proj_id);
						Ext.getCmp('jobid_ref').setValue(job_id);
						deptRef = "";
						if(myDept.indexOf("E-Studio") !== -1){
							deptRef = "E-Studio";
//							Ext.getCmp('ajob_ref_status').bindStore('jobRefStatusEstudio');
//							Ext.getCmp('ejob_ref_status').bindStore('jobRefStatusEstudio');
//							Ext.getCmp('gjob_ref_status').bindStore(jobRefStatusEstudio);
						}else if(myDept == "Publication"){
//		        			Ext.getCmp('ajob_ref_status').bindStore('jobRefStatusPublication');
//							Ext.getCmp('ejob_ref_status').bindStore('jobRefStatusPublication');
//							Ext.getCmp('gjob_ref_status').bindStore(jobRefStatusPublication);
		        			deptRef = "Publication";
		        		}else{
		        			deptRef = "E-Studio";
		        		}
						var ajob_ref = Ext.getCmp('ajob_ref_status');
						var ejob_ref = Ext.getCmp('ejob_ref_status');
						
						ajob_ref.clearValue();
						ajob_ref.getStore().removeAll();
						ajob_ref.getStore().load({
							url: 'showJobReference.htm?kind=JobRefStatus&dept='+deptRef
						});
						
						ejob_ref.clearValue();
						ejob_ref.getStore().removeAll();
						ejob_ref.getStore().load({
							url: 'showJobReference.htm?kind=JobRefStatus&dept='+deptRef
						});
						Ext.Ajax.request({
							url : 'searchJobsParam.htm?job_id='+job_id,
							success : function(response, opts) {
			//					store.jobsRef.load({url:'searchJobsReference.htm?id='+job_id});
								store.jobsRef.loadPage(1);
								Ext.getCmp('jobTabs').setDisabled(false);
								Ext.getCmp('jobTabs').setTitle(job_name);
								panels.tabs.setActiveTab('jobTabs');
							}
						});
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
		    	text : "Amount",
		    	flex : 0.7,
		    	sortable : true,
		    	dataIndex : 'total_amount'
		    },
		    {
		    	text : "Status",
				flex : 0.7,
				sortable : true,
				dataIndex : 'job_status'
		    },
		    {
		    	text : "Dept",
				flex : 0.7,
				sortable : true,
				dataIndex : 'dept'
		    },
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
							url: 'showProjects.htm?type=all&id='+cus_id
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
			viewConfig: { 
		        stripeRows: false, 
		        getRowClass: function(record) { 
		            if(record.get('job_status') == "Processing"){
		        		return 'process-row'; 
		        	}else if(record.get('job_status') == "Hold"){
		        		return 'hold-row';
		        	}else if(record.get('job_status') == "Checked"){
		        		return 'check-row';
		        	}else if(record.get('job_status') == "Billed"){
		        		return 'bill-row';
		        	}else if(record.get('job_status') == "Sent"){
		        		return 'sent-row';
		        	}
		        } 
		    },
			listeners : {
			    itemdblclick: function(dv, record, item, index, e) {
						job_name = dv.getStore().getAt(index).get('job_name');
						job_id = dv.getStore().getAt(index).get('job_id');
						proj_id = dv.getStore().getAt(index).get('proj_id');
						myDept = dv.getStore().getAt(index).get('dept');
						cus_id = dv.getStore().getAt(index).get('cus_id');
//						totalAmount = grid.getStore().getAt(rowIndex).get('total_amount');
						Ext.getCmp('cusid').setValue(cus_id);
						Ext.getCmp('projid').setValue(proj_id);
						Ext.getCmp('jobid_ref').setValue(job_id);
						deptRef = "";
						if(myDept.indexOf("E-Studio") !== -1){
							deptRef = "E-Studio";
						}else if(myDept == "Publication"){
		        			deptRef = "Publication";
		        		}else{
		        			deptRef = "E-Studio";
		        		}
						var ajob_ref = Ext.getCmp('ajob_ref_status');
						var ejob_ref = Ext.getCmp('ejob_ref_status');
						ajob_ref.clearValue();
						ajob_ref.getStore().removeAll();
						ajob_ref.getStore().load({
							url: 'showJobReference.htm?kind=JobRefStatus&dept='+deptRef
						});
						ejob_ref.clearValue();
						ejob_ref.getStore().removeAll();
						ejob_ref.getStore().load({
							url: 'showJobReference.htm?kind=JobRefStatus&dept='+deptRef
						});
						Ext.Ajax.request({
							url : 'searchJobsParam.htm?job_id='+job_id,
							success : function(response, opts) {
			//					store.jobsRef.load({url:'searchJobsReference.htm?id='+job_id});
								store.jobsRef.loadPage(1);
								Ext.getCmp('jobTabs').setDisabled(false);
								Ext.getCmp('jobTabs').setTitle(job_name);
								panels.tabs.setActiveTab('jobTabs');
							}
						});
			    }
			},
//			bbar : Ext.create('Ext.PagingToolbar', {
//				store : store.jobs,
//				displayInfo : true,
//				displayMsg : '<b>Total Jobs : {2} <b>&nbsp;&nbsp;&nbsp;',
//				emptyMsg : "<b>No Job to display</b>",
//			})
	});

	grid.jobRef = Ext.create('Ext.grid.Panel', {
//		renderTo : document.body,
//		title : 'Billing Report',
//		split : true,
//		forceFit : true,
//		loadMask : true,
//		autoWidth : true,
//		frame : true,
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
				Ext.getCmp('ajob_ref_status').setValue("New");
				addJobRef.show();
			}
		},{
			xtype : 'button',
			text : 'Job Report',
			id : 'ireport',
			iconCls : 'icon-excel',
//			disabled : true,
			handler : function() {
				job_id = Ext.getCmp('jobid_ref').getValue();
				myForm = Ext.getCmp('formPanel').getForm();
				myForm.submit({
					target : '_blank',
	                        url: 'jobReport.htm?job_id='+job_id,
	                        method: 'POST',
	                        reset: true,
	                        standardSubmit: true
				})
			}
		},{
			xtype : 'button',
			text : 'Daily Report',
			id : 'ireport2',
			iconCls : 'icon-excel',
//			disabled : true,
			handler : function() {
				job_id = Ext.getCmp('jobid_ref').getValue();
				myForm = Ext.getCmp('formPanel').getForm();
				myForm.submit({
					target : '_blank',
	                        url: 'jobDailyReport.htm?job_id='+job_id,
	                        method: 'POST',
	                        reset: true,
	                        standardSubmit: true
				})
			}
		},"->",{
			xtype : 'button',
			text : 'Invoice',
			id : 'invoice-button',
			iconCls : 'icon-billed',
			handler : function() {
				var record = store.jobs.findRecord('job_id',Ext.getCmp('jobid_ref').getValue());
				var myIndex = store.jobs.indexOf(record);
				var remain_job = store.jobs.getAt(myIndex).data.remain_job;
				var remain_item = store.jobs.getAt(myIndex).data.remain_item;
				var inv_cus_name = store.jobs.getAt(myIndex).data.cus_name;
				var inv_cus_code = store.jobs.getAt(myIndex).data.cus_code;
				var inv_cus_id = store.jobs.getAt(myIndex).data.cus_id;
				var job_name = store.jobs.getAt(myIndex).data.job_name;
				var payment_terms = store.jobs.getAt(myIndex).data.payment_terms;
				
				if(notLoaded){
					store.exchangeRates.load();
				}
				
				if(remain_job != 0){
					Ext.MessageBox.show({
							title: 'Information',
							msg: "Still Have Jobs Remaining!",
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR,
							animateTarget: 'invoice-button'
						});
				}else if(remain_item != 0){
					Ext.MessageBox.show({
						title: 'Information',
						msg: "Please Assign All Item!",
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR,
						animateTarget: 'invoice-button'
					});
				}else{
					Ext.Msg.show({
		                title : 'Invoice',
		                msg : 'How do you want to invoice? ',
		                width : 270,
		                closable : true,
		                buttons : Ext.Msg.YESNO,
		                animateTarget: 'invoice-button',
		                icon : Ext.Msg.QUESTION,
		                buttonText : 
		                {
		                    yes : 'Create New',
		                    no : 'Add To Existing',
//		                    cancel : 'Cancel'
		                },
		                multiline : false,
		                fn : function(buttonValue, inputText, showConfig){
//		                    Ext.Msg.alert('Status', buttonValue);
		                	if(buttonValue == "yes"){
		        						Ext.getCmp('ainv_cus_name').setValue(inv_cus_name);
				                		Ext.getCmp('ainv_cus_code').setValue(inv_cus_code);
				                		Ext.getCmp('acus_id').setValue(inv_cus_id);
				                		Ext.getCmp('ainv_job_id').setValue(Ext.getCmp('jobid_ref').getValue());
				                		Ext.getCmp('ainv_portal').setValue(2);
				                		Ext.getCmp('ainv_job_name').setValue(job_name);
				                		Ext.getCmp('ainv_payment_terms').setValue(payment_terms);
				                		addInvoice.show();
		                	}else if(buttonValue == "no"){
//		                		Ext.Msg.alert('Information', 'Hang on, This feature will come soon! ;)')
//		                		cus_id = Ext.getCmp('cusid').getValue();
		        						Ext.getCmp('aeinv_job_name').setValue(job_name);
				                		Ext.getCmp('aejob_id').setValue(Ext.getCmp('jobid_ref').getValue());
				                		today = new Date();
				                		month = today.getMonth()+1;
				                		year = today.getFullYear();
				                		aejob_inv_id = Ext.getCmp('aejob_inv_id');
				                		aejob_inv_id.clearValue();
				                		aejob_inv_id.getStore().removeAll();
				                		aejob_inv_id.getStore().load({
											url: 'showInvoiceCustomer.htm?cus_id='+inv_cus_id+'&month='+month+'&year='+year
										});
				                		addToExistInvoice.show();
		                	}
		                }
		            });
//					Ext.Ajax.request({
//						url : 'billedProjects.htm?id=' + Ext.getCmp('jobid_ref').getValue(),
//						success : function(response, opts) {
//							var responseObject = Ext.decode(response.responseText);
//							projStatus = responseObject.jobs[0].job_status;
//							if(projStatus == "Billed"){
//								Ext.MessageBox.show({
//		     						title: 'Information',
//		     						msg: "Job's Project Has Been Billed!",
//		     						buttons: Ext.MessageBox.OK,
//		     						icon: Ext.MessageBox.INFO,
//		     						animateTarget: 'invoice-button',
//		     						fn: function(){
//		     							panels.tabs.setActiveTab('projTabs');
//		     							Ext.getCmp('jobTabs').setDisabled(true);
//		     							Ext.getCmp('jobTabs').setTitle("Jobs");
//		     							store.jobs.loadPage(1);
//		     							store.publicationJobRef.reload();
//		     							store.jobsToday.reload();
//		     						}
//		     					});
//							}else{
//								
//							}
//						},
//						failure: function(response, opts){
//							var responseOject = Ext.util.JSON.decode(response.responseText);
//							Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
//						}
//					});
				}
			}
		},{
			xtype: 'tbtext',
			id: 'gridRef_tbar',
	        text: 'Loading ...'
		},{xtype: 'tbspacer', width: 5},{
			iconCls: 'icon-save',
			text: 'Save All',
			id: 'isave-sync',
			iconAlign: 'right',
	        tooltip: 'Sync data from server',
	        disabled: false,
	        itemId: 'saveSync',
	        scope: this,
	        handler: function(){
	        	store.jobsRef.sync();
	        	store.jobs.reload();
//	            console.debug('Save all data');
	        }
		}],
//		style : {
//			"margin-left" : "auto",
//			"margin-right" : "auto",
//			"margin-top" : "15px",
//			"margin-bottom" : "10px"
//		},
//		width : 1200,
		height : 608,
		columns : [
				{
					text : "Date in",
					flex : 1,
					sortable : true,
					dataIndex : 'job_in',
					renderer: Ext.util.Format.dateRenderer('Y-m-d'),
					editor: {
						xtype: 'datefield',
						format: 'Y-m-d',
						editable: false
					}
				},
				{
					text : "Date out",
					flex : 1,
					sortable : true,
					dataIndex : 'job_out',
					renderer: Ext.util.Format.dateRenderer('Y-m-d'),
					editor: {
						xtype: 'datefield',
						id: 'edit_date',
						format: 'Y-m-d        H:i',
						editable: false,
						listeners: {
							"change": function () {
								newDate = Ext.getCmp('edit_date').getValue();
								var myDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), editorDate.getHours(), editorDate.getMinutes());
//								alert(editorDate);
//								alert(myDate);
								Ext.getCmp('edit_date').setValue(myDate);
//								alert(Ext.getCmp('edit_date').getValue());
//								Ext.getCmp('edit_time').setValue(myDate);
							}
						}
					}
				},
				{
					text : "Time",
					flex : 0.6,
					sortable : true,
					dataIndex : 'job_out',
					renderer: Ext.util.Format.dateRenderer('H:i'),
					editor: {
						xtype: 'timefield',
						id: 'edit_time',
						format: 'H:i',
						listeners: {
							select: function () {
								myTime = Ext.getCmp('edit_time').getValue();
								var myDate = new Date(editorDate.getFullYear(), editorDate.getMonth(), editorDate.getDate(), myTime.getHours(), myTime.getMinutes());
//								alert(editorDate);
								Ext.getCmp('edit_time').setValue(myDate);
//								alert(myDate);
							}
						}
					}
				},
				{
					text : "Job Number",
					flex : 1,
					sortable : true,
					dataIndex : 'job_ref_number',
					hidden : true
				},
				{
					text : "Job Name",
					flex : 2.5,
					sortable : true,
					dataIndex : 'job_ref_name',
					editor: {
						xtype: 'textfield',
						allowBlank: false
					}
				},
				{
					text : "Item",
					flex : 2,
					sortable : true,
					dataIndex : 'itm_name',
					editor: {
						xtype: 'combobox',
						id: 'edit_itm',
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
						valueField : 'itm_name',
						displayField : 'itm_name',
//					    tpl: Ext.create('Ext.XTemplate',
//					        '<tpl for=".">',
//					        	"<tpl if='proj_ref_desc == \"\"'>",
//					        	'<div class="x-boundlist-item">{itm_name}</div>',
//					            '<tpl else>',
//					            '<div class="x-boundlist-item">{itm_name} - {proj_ref_desc}</div>',
//					            '</tpl>',
//				            '</tpl>'
//					    ),
//					    displayTpl: Ext.create('Ext.XTemplate',
//					        '<tpl for=".">',
//					        	"<tpl if='proj_ref_desc == \"\"'>",
//					        	'{itm_name}',
//					            '<tpl else>',
//					            '{itm_name} - {proj_ref_desc}',
//					            '</tpl>',
//					        '</tpl>'
//					    ),
					    listeners: {
					    	select : function(){
					    		var v = this.getValue();
								var record = this.findRecord(this.valueField || this.displayField, v);
								var myIndex = this.store.indexOf(record);
								var myValue = this.store.getAt(myIndex).data.proj_ref_id;
								Ext.getCmp('projrefid').setValue(myValue);
					    	}
					    }
					}
				},
				{
					dataIndex : 'proj_ref_id',
					id : 'edit_proj_ref_id',
					hidden : true,
					hideable : false
				},
				{
					text : "Amount",
					flex : 1,
					sortable : true,
					dataIndex : 'amount',
					editor: {
						xtype:'numberfield',
						minValue : 0,
						allowBlank: false
					}
				},
				{
					text : "Status",
					flex : 1,
					sortable : true,
					dataIndex : 'job_ref_status',
					editor: {
						xtype: 'combobox',
						name: 'gjob_ref_status',
						id: 'gjob_ref_status',
//						store : jobRefStatusPublication,
						store : {
							fields : ['db_ref_name'],
							proxy : {
								type : 'ajax',
								url : '',
								reader : {
									type : 'json',
									root : 'records',
								}
							},
//							autoLoad : true
						},
						valueField : 'db_ref_name',
						displayField : 'db_ref_name',
						editable : false
					}
				},
				{
					text : 'Dupplicate',
					xtype : 'actioncolumn',
					flex : 0.7,
					align : 'center',
					id : 'duplicate_job_ref',
					items : [ {
						iconCls : 'icon-disk',
						handler : function(grid, rowIndex, colIndex) {
							job_ref_id = grid.getStore().getAt(rowIndex).get('job_ref_id');
							amount = grid.getStore().getAt(rowIndex).get('amount');
							job_ref_name = grid.getStore().getAt(rowIndex).get('job_ref_name');
							Ext.getCmp('dup_job_ref_id').setValue(job_ref_id);
							Ext.getCmp('dup_amount').setValue(amount);
							Ext.getCmp('dup_job_ref_name').setValue(job_ref_name);
							Ext.getCmp('dup_proj_ref_id').getStore().load({
								url: 'showProjectsReference.htm?id='+Ext.getCmp('projid').getValue()
							});
							duplicateJobRef.show();
						}
					} ]
				},
				{
					text : 'Time',
					xtype : 'actioncolumn',
					flex : 0.7,
					align : 'center',
					id : 'time_record',
					items : [ {
						iconCls : 'icon-clock',
						handler : function(grid, rowIndex, colIndex) {
							job_ref_id = grid.getStore().getAt(rowIndex).get('job_ref_id');
							window.open('timeRecord.htm?job_ref_id='+job_ref_id, '_blank');
						}
					} ]
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
							job_ref_number = grid.getStore().getAt(rowIndex).get('job_ref_number');
							
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
							Ext.getCmp('etime').setValue(job_out);
							Ext.getCmp('ejob_ref_status').setValue(job_ref_status);
							Ext.getCmp('ejob_ref_number').setValue(job_ref_number);
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
		plugins: 
		    [{ 
		        ptype: 'cellediting',
		        clicksToEdit: 2,
		        listeners: {
			        beforeedit: function (editor, e) {
			        	Ext.getCmp('projrefid').setValue(0);
			        	if(e.field == "job_out"){
							editorDate = e.value;
			        	}else if(e.field == "itm_name"){
			        		Ext.getCmp('edit_itm').getStore().load({
								url: 'showProjectsReference.htm?id='+Ext.getCmp('projid').getValue()
							});
			        	}else if(e.field == "job_ref_status"){
//			        		if(myDept == "E-Studio"){
			        		deptRef = "";
			        		if(myDept.indexOf("E-Studio") !== -1){
//			        			Ext.getCmp('gjob_ref_status').bindStore('jobRefStatusEstudio');
			        			deptRef = "E-Studio";
			        		}else if(myDept == "Publication"){
//			        			Ext.getCmp('gjob_ref_status').bindStore('jobRefStatusPublication');
			        			deptRef = "Publication";
			        		}else{
			        			deptRef = "E-Studio";
			        		}
			        		var gjob_ref = Ext.getCmp('gjob_ref_status');
							
		        			gjob_ref.clearValue();
		        			gjob_ref.getStore().removeAll();
		        			gjob_ref.getStore().load({
								url: 'showJobReference.htm?kind=JobRefStatus&dept='+deptRef
							});
			        	}
//						alert(editorDate);
					},
					afteredit: function (editor, e) {
						if(e.field == "itm_name"){
							if(Ext.getCmp('projrefid').getValue() != 0){
								e.record.set('proj_ref_id', Ext.getCmp('projrefid').getValue());
							}
						}
					}
		        }
		    }],
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
			emptyMsg : "<b>No Job to display</b>",
			plugins : Ext.create('Ext.ux.ProgressBarPager', {}),
		})
	});

	grid.publication = Ext.create('Ext.grid.Panel', {
		id : 'publicationGrid',
		store : store.publicationJobRef,
		tbar : [
//		        {
//			xtype : 'button',
//			text : 'Report',
//			id : 'ireporttoday',
//			iconCls : 'icon-excel',
//			disabled: true,
//			handler : function() {
//				job_id = Ext.getCmp('jobid_ref').getValue();
//				myForm = Ext.getCmp('formPanel').getForm();
//				myForm.submit({
//					target : '_blank',
//	                        url: 'jobReport.htm?job_id='+job_id,
//	                        method: 'POST',
//	                        reset: true,
//	                        standardSubmit: true
//				})
//			}
//		},
		"->",
//		{
//			xtype: 'tbtext',
//			id: 'gridToday_tbar',
//	        text: 'Loading ...'
//		},{xtype: 'tbspacer', width: 5},
		{
			type:'refresh',
			iconCls: 'icon-refresh',
		    tooltip: 'Refresh grid below',
		    // hidden:true,
		    handler: function() {
		        // refresh logic
		    	store.publicationJobRef.reload();
		    }
	    },
		{
			iconCls: 'icon-save',
			text: 'Save All',
			id: 'isave-syncPub',
			iconAlign: 'right',
	        tooltip: 'Sync data from server',
	        disabled: false,
	        itemId: 'saveSync',
	        scope: this,
	        handler: function(){
	        	store.publicationJobRef.sync();
	        }
		}],
		minHeight: 608,
		columnLines : true,
		columns : [
			{
				text : "Date in",
				flex : 1,
				sortable : true,
				dataIndex : 'job_in',
				renderer: Ext.util.Format.dateRenderer('Y-m-d'),
				editor: {
					xtype: 'datefield',
					format: 'Y-m-d',
					editable: false
				}
			},
			{
				text : "Date out",
				flex : 1,
				sortable : true,
				dataIndex : 'job_out',
				renderer: function(value, meta, record, rowIndex, colIndex, store){
					myStatus = record.get('job_ref_status');
					today = new Date();
					getDay = today.getDay();
					if(getDay == 6){
						today.setDate(today.getDate()+2);
					}
					todayFormat = Ext.util.Format.date(today, 'Y-m-d');
					dateOut = Ext.util.Format.date(value, 'Y-m-d');
					if(myStatus != "Hold"){
						if(dateOut <= todayFormat){
							return '<b><span style="color:red;">'+Ext.util.Format.date(value, 'Y-m-d')+'</span></b>';
						}else{
							return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'Y-m-d')+'</span></b>';
						}
					}else{
						return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'Y-m-d')+'</span></b>';
					}
				},
				editor: {
					xtype: 'datefield',
					id: 'edit_date_today',
					format: 'Y-m-d        H:i',
					editable: false,
					listeners: {
						"change": function () {
							newDate = Ext.getCmp('edit_date_today').getValue();
							var myDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), editorDate.getHours(), editorDate.getMinutes());
							Ext.getCmp('edit_date_today').setValue(myDate);
						}
					}
				}
			},
			{
				text : "Time",
				flex : 0.6,
				sortable : true,
				dataIndex : 'job_out',
				renderer: function(value, meta, record, rowIndex, colIndex, store){
					myStatus = record.get('job_ref_status');
					today = new Date();
					getDay = today.getDay();
					if(getDay == 6){
						today.setDate(today.getDate()+2);
					}
					todayFormat = Ext.util.Format.date(today, 'Y-m-d');
					dateOut = Ext.util.Format.date(value, 'Y-m-d');
					if(myStatus != "Hold"){
						if(dateOut <= todayFormat){
							return '<b><span style="color:red;">'+Ext.util.Format.date(value, 'H:i')+'</span></b>';
						}else{
							return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'H:i')+'</span></b>';
						}
					}else{
						return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'H:i')+'</span></b>';
					}
				},
				editor: {
					xtype: 'timefield',
					id: 'edit_time_today',
					format: 'H:i',
					listeners: {
						blur: function () {
							myTime = Ext.getCmp('edit_time_today').getValue();
							var myDate = new Date(editorDate.getFullYear(), editorDate.getMonth(), editorDate.getDate(), myTime.getHours(), myTime.getMinutes());
							Ext.getCmp('edit_time_today').setValue(myDate);
						}
					}
				}
			},
			{
		    	text : "Customer Name",
		    	flex : 2.2,
		    	sortable : true,
		    	dataIndex : 'cus_name',
		    	renderer : renderCustomer
		    },
			{
				text : "Job Name",
				flex : 2.5,
				sortable : true,
				dataIndex : 'job_ref_name',
				editor: {
					xtype: 'textfield',
					allowBlank: false
				}
			},
			{
				text : "Item",
				flex : 1.5,
				sortable : true,
				dataIndex : 'itm_name',
				editor: {
					xtype: 'combobox',
					id: 'edit_itm_today',
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
					valueField : 'itm_name',
					displayField : 'itm_name',
//				    tpl: Ext.create('Ext.XTemplate',
//				        '<tpl for=".">',
//				        	"<tpl if='proj_ref_desc == \"\"'>",
//				        	'<div class="x-boundlist-item">{itm_name}</div>',
//				            '<tpl else>',
//				            '<div class="x-boundlist-item">{itm_name} - {proj_ref_desc}</div>',
//				            '</tpl>',
//			            '</tpl>'
//				    ),
//				    displayTpl: Ext.create('Ext.XTemplate',
//				        '<tpl for=".">',
//				        	"<tpl if='proj_ref_desc == \"\"'>",
//				        	'{itm_name}',
//				            '<tpl else>',
//				            '{itm_name} - {proj_ref_desc}',
//				            '</tpl>',
//				        '</tpl>'
//				    ),
				    listeners: {
				    	select : function(){
				    		var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var myValue = this.store.getAt(myIndex).data.proj_ref_id;
							Ext.getCmp('projrefidtoday').setValue(myValue);
				    	}
				    }
				}
			},
			{
				dataIndex : 'proj_ref_id',
				hidden : true,
				hideable : false
			},
			{
				text : "Amount",
				flex : 0.7,
				align : 'center',
				sortable : true,
				dataIndex : 'amount',
				editor: {
					xtype:'numberfield',
					minValue : 0,
					allowBlank: false
				}
			},
			{
				text : "Status",
				flex : 0.7,
				align : 'center',
				sortable : true,
				renderer : function(val){
					if(val == "New" || val == "New Pic" || val == "New Doc" || val == "New Pic+Doc"){
						return '<b><span style="color:blue;">' + val + '</span></b>';
					}else if(val == "Hold"){
						return '<b><span style="color:red;">' + val + '</span></b>';
					}else{
						return '<b>'+val+'</b>';
					}
				},
				dataIndex : 'job_ref_status',
				editor: {
					xtype: 'combobox',
//					store : 'jobRefStatusPublication',
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showJobReference.htm?kind=JobRefStatus&dept=Publication',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
					editable : false
				}
			},
			{
				text : "Approve",
				flex : 1.3,
				align : 'center',
				sortable : true,
				dataIndex : 'job_ref_approve',
				renderer : function(val){
					if(val == "Done" || val == "Sent PDF Vorab" || val == "Sent PDF K1" || val == "Sent PDF K2" || val == "Sent PDF Final" || val == "Up Proof" || val == "CC1" || val == "CC2" || val == "CC3" || val == "CC4"){
						return '<b><span style="color:#13baff;">' + val + '</span></b>';
//						}else if(val == "Hold Wait Mask" || val == "Hold Missing" || val == "Hold Low Quality" || val == "Hold Low Res" || val == "Hold Move Mask" || val == "Hold Ask Customer" || val == "Hold Other"){
					}else if(val == "Wait Mask" || val == "Wait Move Mask" || val == "Missing Pic" || val == "Low Quality Pic" || val == "Low Res Pic" || val == "Ask Customer" || val == "Hold Other"){	
						return '<b><span style="color:red;">' + val + '</span></b>';
					}else if(val == "Wait Final" || val == "Wait Check" || val == "Wait FI"){
						return '<b><span style="color:#ec8500;">' + val + '</span></b>';
					}else{
						return '<b>'+val+'</b>';
					}
				},
				editor : {
					xtype : 'combobox',
					id : 'edit_job_ref_approve_pub',
//					store : 'jobRefApprovePublication',
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showJobReference.htm?kind=JobRefApprove&dept=Publication',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
					editable : false
				}
			},
			{
				text : "Remark",
				flex : 2,
				dataIndex : 'job_ref_dtl',
				editor : {
					xtype : 'textfield'
				}
			},
		    {
				text : "Name",
				flex : 1.5,
				sortable : true,
				dataIndex : 'job_name',
				hidden : true,
			},
//		    {
//		    	text : "Dept",
//				flex : 1,
//				sortable : true,
//				dataIndex : 'dept'
//		    }
			],
			viewConfig: { 
		        stripeRows: false, 
		        getRowClass: function(record) { 
		            if(record.get('job_ref_status') == "Hold"){
		        		return 'hold-row';
		            }else if(record.get('job_ref_status') == "New" || record.get('job_ref_status') == "New Pic" || record.get('job_ref_status') == "New Doc" || record.get('job_ref_status') == "New Pic+Doc"){
		        		return 'process-row'; 
		        	}else{
		        		return 'cc-row';
		        	}
		        },
//		        listeners:{
//		            itemkeydown:function(view, record, item, index, e){
//		            	if(e.getKey() == 117){
//		            		Ext.get('isave-syncPub').dom.click();
//		            	}
//		            }
//		        }
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
				        	Ext.getCmp('projrefidtoday').setValue(0);
				        	if(e.field == "job_out"){
								editorDate = e.value;
				        	}else if(e.field == "itm_name"){
				        		Ext.getCmp('edit_itm_today').getStore().load({
									url: 'showProjectsReference.htm?id='+e.record.get('proj_id')
								});
				        	}
						},
						afteredit: function (editor, e) {
							if(e.field == "itm_name"){
								if(Ext.getCmp('projrefidtoday').getValue() != 0){
									e.record.set('proj_ref_id', Ext.getCmp('projrefidtoday').getValue());
								}
							}
						},
						edit: function (editor, e) {
							if(e.field == "job_out"){
								try{
									myTime = Ext.getCmp('edit_time_today').getValue();
									var myDate = new Date(editorDate.getFullYear(), editorDate.getMonth(), editorDate.getDate(), myTime.getHours(), myTime.getMinutes());
									Ext.getCmp('edit_time_today').setValue(myDate);
									e.record.set('job_out', myDate);
								}catch(e){
									console.log(e.message);
								}
							}
							if(e.field == "job_ref_approve"){
								if(Ext.getCmp('edit_job_ref_approve_pub').getValue() == "-"){
									e.record.set("job_ref_approve", "");
								}
							}
						}
			        }
			    }],
//		    bbar : ['->',{
//				xtype: 'tbtext',
//				id: 'gridToday_bbar',
//	            text: 'Loading ...'
//			},{xtype: 'tbspacer', width: 5}]
		    bbar : Ext.create('Ext.PagingToolbar', {
				store : store.publicationJobRef,
				displayInfo : true,
				displayMsg : '<b>Total Count : {2} <b>&nbsp;&nbsp;&nbsp;',
				emptyMsg : "<b>No Job to display</b>",
//					plugins : Ext.create('Ext.ux.ProgressBarPager', {}),
			})
	});

	grid.estudio = Ext.create('Ext.grid.Panel', {
		id : 'estudioGrid',
		store : store.estudioJobRef,
		tbar : [
//		        {
//			xtype : 'button',
//			text : 'Report',
//			id : 'ireporttoday',
//			iconCls : 'icon-excel',
//			disabled: true,
//			handler : function() {
//				job_id = Ext.getCmp('jobid_ref').getValue();
//				myForm = Ext.getCmp('formPanel').getForm();
//				myForm.submit({
//					target : '_blank',
//	                        url: 'jobReport.htm?job_id='+job_id,
//	                        method: 'POST',
//	                        reset: true,
//	                        standardSubmit: true
//				})
//			}
//		},
		"->",{
			type:'refresh',
			iconCls: 'icon-refresh',
		    tooltip: 'Refresh grid below',
		    handler: function() {
		        // refresh logic
		    	store.estudioJobRef.reload();
		    }
	    },
		{
			iconCls: 'icon-save',
			text: 'Save All',
			id: 'isave-syncEstudio',
			iconAlign: 'right',
	        tooltip: 'Sync data from server',
	        disabled: false,
	        itemId: 'saveSyncEstudio',
	        scope: this,
	        handler: function(){
	        	store.estudioJobRef.sync();
	        }
		}],
		minHeight: 608,
		columnLines : true,
		columns : [
			{
		    	text : "Customer Name",
		    	flex : 2.2,
		    	sortable : true,
		    	dataIndex : 'cus_name',
		    	renderer : renderCustomer
		    },
			{
				text : "Job Name",
				flex : 2.5,
				sortable : true,
				dataIndex : 'job_ref_name',
				editor: {
					xtype: 'textfield',
					allowBlank: false
				}
			},
			{
				text : "Item",
				flex : 1.5,
				sortable : true,
				hidden : true,
				dataIndex : 'itm_name',
				editor: {
					xtype: 'combobox',
					id: 'edit_itm_today',
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
					valueField : 'itm_name',
					displayField : 'itm_name',
				    listeners: {
				    	select : function(){
				    		var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var myValue = this.store.getAt(myIndex).data.proj_ref_id;
							Ext.getCmp('projrefidtoday').setValue(myValue);
				    	}
				    }
				}
			},
			{
				dataIndex : 'proj_ref_id',
				hidden : true,
				hideable : false
			},
			{
				text : "Amount",
				flex : 0.7,
				align : 'center',
				sortable : true,
				dataIndex : 'amount',
				editor: {
					xtype:'numberfield',
					minValue : 0,
					allowBlank: false
				}
			},
			{
				text : "Sent",
				flex : 0.5,
				align : 'center',
				sortable : true,
				dataIndex : 'sent_amount',
				editor: {
					xtype:'numberfield',
					id : 'esent_amount',
					minValue : 0,
					allowBlank: false
				}
			},
			{
				text : "Remain",
				flex : 0.7,
				align : 'center',
				sortable : true,
				dataIndex : 'total_amount'
			},
			{
				text : "Date in",
				flex : 1,
				sortable : true,
				dataIndex : 'job_in',
				renderer: Ext.util.Format.dateRenderer('Y-m-d'),
				editor: {
					xtype: 'datefield',
					format: 'Y-m-d',
					editable: false
				}
			},
			{
				text : "Date out",
				flex : 1,
				sortable : true,
				dataIndex : 'job_out',
				renderer: function(value, meta, record, rowIndex, colIndex, store){
					myStatus = record.get('job_ref_status');
					today = new Date();
					getDay = today.getDay();
					if(getDay == 6){
						today.setDate(today.getDate()+2);
					}
					todayFormat = Ext.util.Format.date(today, 'Y-m-d');
					dateOut = Ext.util.Format.date(value, 'Y-m-d');
					if(myStatus != "Hold"){
						if(dateOut <= todayFormat){
							return '<b><span style="color:red;">'+Ext.util.Format.date(value, 'Y-m-d')+'</span></b>';
						}else{
							return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'Y-m-d')+'</span></b>';
						}
					}else{
						return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'Y-m-d')+'</span></b>';
					}
				},
				editor: {
					xtype: 'datefield',
					id: 'edit_date_today',
					format: 'Y-m-d        H:i',
					editable: false,
					listeners: {
						"change": function () {
							newDate = Ext.getCmp('edit_date_today').getValue();
							var myDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), editorDate.getHours(), editorDate.getMinutes());
							Ext.getCmp('edit_date_today').setValue(myDate);
						}
					}
				}
			},
			{
				text : "Time",
				flex : 0.6,
				sortable : true,
				dataIndex : 'job_out',
				renderer: function(value, meta, record, rowIndex, colIndex, store){
					myStatus = record.get('job_ref_status');
					today = new Date();
					getDay = today.getDay();
					if(getDay == 6){
						today.setDate(today.getDate()+2);
					}
					todayFormat = Ext.util.Format.date(today, 'Y-m-d');
					dateOut = Ext.util.Format.date(value, 'Y-m-d');
					timeOut = Ext.util.Format.date(value, 'H:i');
					if(myStatus != "Hold"){
						if(dateOut <= todayFormat){
							if(timeOut == "00:00"){
								return '<b><span style="color:red;">ASAP</span></b>';
							}else{
								return '<b><span style="color:red;">'+Ext.util.Format.date(value, 'H:i')+'</span></b>';
							}
						}else{
							return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'H:i')+'</span></b>';
						}
					}else{
						return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'H:i')+'</span></b>';
					}
				},
				editor: {
					xtype: 'timefield',
					id: 'edit_time_today',
					format: 'H:i',
//					tpl: Ext.create('Ext.XTemplate',
//					        '<tpl for=".">',
//					        	"<tpl if='field1 == \"00:00\"'>",
//					        		'ASAP',
//					            '</tpl>',
//				            '</tpl>'
//					    ),
//					displayTpl: Ext.create('Ext.XTemplate',
//						    '<tpl for=".">',
//					        	"<tpl if='field1 == \"00:00\"'>",
//					        		'ASAP',
//					            '</tpl>',
//				            '</tpl>'
//					    ),
					listeners: {
						blur: function () {
							myTime = Ext.getCmp('edit_time_today').getValue();
							var myDate = new Date(editorDate.getFullYear(), editorDate.getMonth(), editorDate.getDate(), myTime.getHours(), myTime.getMinutes());
							Ext.getCmp('edit_time_today').setValue(myDate);
						}
					}
				}
			},
			{
				text : "Status",
				flex : 0.7,
				align : 'center',
				sortable : true,
				renderer : function(val){
					if(val == "New"){
						return '<b><span style="color:blue;">' + val + '</span></b>';
					}else if(val == "Hold"){
						return '<b><span style="color:red;">' + val + '</span></b>';
					}else{
						return '<b>'+val+'</b>';
					}
				},
				dataIndex : 'job_ref_status',
				editor: {
					xtype: 'combobox',
//					store : jobRefStatusEstudio,
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showJobReference.htm?kind=JobRefStatus&dept=E-Studio',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
					editable : false
				}
			},
			{
				text : "Approve",
				flex : 1.3,
				align : 'center',
				sortable : true,
				dataIndex : 'job_ref_approve',
				renderer : function(val){
					if(val == "Done"){
						return '<b><span style="color:#8F00FF;">' + val + '</span></b>';
					}else if(val == "Hold Wait Info" || val == "Hold Other"){	
						return '<b><span style="color:red;">' + val + '</span></b>';
					}else if(val == "Working" || val == "Checking" || val == "Wait FI"){
						return '<b><span style="color:#FF8F00;">' + val + '</span></b>';
					}else if(val.indexOf("Wait Check") !== -1){
						return '<b><span style="color:#0EB400;">' + val + '</span></b>';
					}else if(val.indexOf("Wait") !== -1){
						return '<b><span style="color:grey;">' + val + '</span></b>';
					}else if(val == "Finish Path"){
						return '<b><span style="color:#B99200;">' + val + '</span></b>';
					}else{
						return '<b>'+val+'</b>';
					}
				},
				editor : {
					xtype : 'combobox',
					id : 'edit_job_ref_approve_estudio',
//					store : jobRefApproveEstudio,
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : '',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
//						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
					editable : false
				}
			},
		    {
				text : "Name",
				flex : 1.5,
				sortable : true,
				dataIndex : 'job_name',
				hidden : true,
			},
			{
				text : "Remark",
				flex : 2,
				dataIndex : 'job_ref_dtl',
				editor : {
					xtype : 'textfield'
				}
			},
//		    {
//		    	text : "Dept",
//				flex : 1,
//				sortable : true,
//				dataIndex : 'dept'
//		    }
			],
			viewConfig: { 
		        stripeRows: false, 
		        getRowClass: function(record) { 
		        	if(record.get('job_ref_status') == "Hold"){
		        		return 'hold-row';
		            }else if(record.get('dept') == "E-Studio"){
		        		return 'process-row'; 
		        	}else if(record.get('dept') == "E-Studio_OTTO"){
		        		return 'estudio_otto-row'; 
		        	}else if(record.get('dept') == "E-Studio_MM"){
		        		return 'estudio_mm-row'; 
		        	}else{
		        		return 'estudio_masking-row';
		        	}
		        },
		        plugins: {
		            ptype: 'gridviewdragdrop',
		            dragText: 'Drag and drop to reorganize',
//		            listeners : {
//		            	drop : function(){alert("drop!")}
//		            }
		        },
		        listeners : {
		        	drop : function (node, data, overModel, dropPosition, eOpts) {
//		        		alert("Drop!");
//		        		console.log(node);
//		        		console.log(data);
//		        		console.log(overModel);
//		        		console.log(dropPosition);
//		        		console.log(eOpts);
		        		console.log(grid.estudio.store.indexOf(data.records[0]));
		        		var selectedRecord = grid.estudio.getSelectionModel().getSelection()[0];
		        		var row = grid.estudio.store.indexOf(selectedRecord);
		        		console.log(row);
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
		        },
		    },
		    plugins: 
			    [{ 
			        ptype: 'cellediting',
			        clicksToEdit: 2,
			        listeners: {
				        beforeedit: function (editor, e) {
				        	Ext.getCmp('projrefidtoday').setValue(0);
				        	if(e.field == "job_out"){
								editorDate = e.value;
				        	}else if(e.field == "itm_name"){
				        		Ext.getCmp('edit_itm_today').getStore().load({
									url: 'showProjectsReference.htm?id='+e.record.get('proj_id')
								});
				        	}
				        	if(e.field == "sent_amount"){
				        		Ext.getCmp('esent_amount').setMaxValue(e.record.get('amount'));
				        	}
				        	if(e.field == "job_ref_approve"){
				        		gjob_ref = Ext.getCmp('edit_job_ref_approve_estudio');
								
			        			gjob_ref.clearValue();
			        			gjob_ref.getStore().removeAll();
			        			gjob_ref.getStore().load({
									url: 'showJobReference.htm?kind=JobRefApprove&dept='+e.record.get('dept')
								});
				        	}
						},
						afteredit: function (editor, e) {
							if(e.field == "itm_name"){
								if(Ext.getCmp('projrefidtoday').getValue() != 0){
									e.record.set('proj_ref_id', Ext.getCmp('projrefidtoday').getValue());
								}
							}
						},
						edit: function (editor, e) {
							if(e.field == "job_out"){
								try{
									myTime = Ext.getCmp('edit_time_today').getValue();
									var myDate = new Date(editorDate.getFullYear(), editorDate.getMonth(), editorDate.getDate(), myTime.getHours(), myTime.getMinutes());
									Ext.getCmp('edit_time_today').setValue(myDate);
									e.record.set('job_out', myDate);
								}catch(e){
									console.log(e.message);
								}
							}
							if(e.field == "job_ref_approve"){
								if(Ext.getCmp('edit_job_ref_approve_estudio').getValue() == "-"){
									e.record.set("job_ref_approve", "");
								}
							}
						}
			        }
			    }],
//		    bbar : ['->',{
//				xtype: 'tbtext',
//				id: 'gridToday_bbar',
//	            text: 'Loading ...'
//			},{xtype: 'tbspacer', width: 5}]
		    bbar : Ext.create('Ext.PagingToolbar', {
				store : store.estudioJobRef,
				displayInfo : true,
				displayMsg : '<b>Total Count : {2} <b>&nbsp;&nbsp;&nbsp;',
				emptyMsg : "<b>No Job to display</b>",
//					plugins : Ext.create('Ext.ux.ProgressBarPager', {}),
			})
	});
	
	grid.pilot = Ext.create('Ext.grid.Panel', {
		id : 'pilotGrid',
		store : store.pilotJobRef,
		tbar : ["->",{
			type:'refresh',
			iconCls: 'icon-refresh',
		    tooltip: 'Refresh grid below',
		    handler: function() {
		        // refresh logic
		    	store.pilotJobRef.reload();
		    }
	    },
		{
			iconCls: 'icon-save',
			text: 'Save All',
			id: 'isave-syncPilot',
			iconAlign: 'right',
	        tooltip: 'Sync data from server',
	        disabled: false,
	        itemId: 'saveSyncPilot',
	        scope: this,
	        handler: function(){
	        	store.pilotJobRef.sync();
	        }
		}],
		minHeight: 608,
		columnLines : true,
		columns : [
			{
		    	text : "Customer Name",
		    	flex : 2.2,
		    	sortable : true,
		    	dataIndex : 'cus_name',
		    	renderer : renderCustomer
		    },
			{
				text : "Job Name",
				flex : 2.5,
				sortable : true,
				dataIndex : 'job_ref_name',
				editor: {
					xtype: 'textfield',
					allowBlank: false
				}
			},
			{
				text : "Item",
				flex : 1.5,
				sortable : true,
				hidden : true,
				dataIndex : 'itm_name',
				editor: {
					xtype: 'combobox',
					id: 'edit_itm_today',
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
					valueField : 'itm_name',
					displayField : 'itm_name',
				    listeners: {
				    	select : function(){
				    		var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var myValue = this.store.getAt(myIndex).data.proj_ref_id;
							Ext.getCmp('projrefidtoday').setValue(myValue);
				    	}
				    }
				}
			},
			{
				dataIndex : 'proj_ref_id',
				hidden : true,
				hideable : false
			},
			{
				text : "Amount",
				flex : 0.7,
				align : 'center',
				sortable : true,
				dataIndex : 'amount',
				editor: {
					xtype:'numberfield',
					minValue : 0,
					allowBlank: false
				}
			},
			{
				text : "Sent",
				flex : 0.5,
				align : 'center',
				sortable : true,
				dataIndex : 'sent_amount',
				editor: {
					xtype:'numberfield',
					id : 'esent_amount',
					minValue : 0,
					allowBlank: false
				}
			},
			{
				text : "Remain",
				flex : 0.7,
				align : 'center',
				sortable : true,
				dataIndex : 'total_amount'
			},
			{
				text : "Date in",
				flex : 1,
				sortable : true,
				dataIndex : 'job_in',
				renderer: Ext.util.Format.dateRenderer('Y-m-d'),
				editor: {
					xtype: 'datefield',
					format: 'Y-m-d',
					editable: false
				}
			},
			{
				text : "Date out",
				flex : 1,
				sortable : true,
				dataIndex : 'job_out',
				renderer: function(value, meta, record, rowIndex, colIndex, store){
					myStatus = record.get('job_ref_status');
					today = new Date();
					getDay = today.getDay();
					if(getDay == 6){
						today.setDate(today.getDate()+2);
					}
					todayFormat = Ext.util.Format.date(today, 'Y-m-d');
					dateOut = Ext.util.Format.date(value, 'Y-m-d');
					if(myStatus != "Hold"){
						if(dateOut <= todayFormat){
							return '<b><span style="color:red;">'+Ext.util.Format.date(value, 'Y-m-d')+'</span></b>';
						}else{
							return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'Y-m-d')+'</span></b>';
						}
					}else{
						return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'Y-m-d')+'</span></b>';
					}
				},
				editor: {
					xtype: 'datefield',
					id: 'edit_date_today',
					format: 'Y-m-d        H:i',
					editable: false,
					listeners: {
						"change": function () {
							newDate = Ext.getCmp('edit_date_today').getValue();
							var myDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), editorDate.getHours(), editorDate.getMinutes());
							Ext.getCmp('edit_date_today').setValue(myDate);
						}
					}
				}
			},
			{
				text : "Time",
				flex : 0.6,
				sortable : true,
				dataIndex : 'job_out',
				renderer: function(value, meta, record, rowIndex, colIndex, store){
					myStatus = record.get('job_ref_status');
					today = new Date();
					getDay = today.getDay();
					if(getDay == 6){
						today.setDate(today.getDate()+2);
					}
					todayFormat = Ext.util.Format.date(today, 'Y-m-d');
					dateOut = Ext.util.Format.date(value, 'Y-m-d');
					timeOut = Ext.util.Format.date(value, 'H:i');
					if(myStatus != "Hold"){
						if(dateOut <= todayFormat){
							if(timeOut == "00:00"){
								return '<b><span style="color:red;">ASAP</span></b>';
							}else{
								return '<b><span style="color:red;">'+Ext.util.Format.date(value, 'H:i')+'</span></b>';
							}
						}else{
							return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'H:i')+'</span></b>';
						}
					}else{
						return '<b><span style="color:green;">'+Ext.util.Format.date(value, 'H:i')+'</span></b>';
					}
				},
				editor: {
					xtype: 'timefield',
					id: 'edit_time_today',
					format: 'H:i',
					listeners: {
						blur: function () {
							myTime = Ext.getCmp('edit_time_today').getValue();
							var myDate = new Date(editorDate.getFullYear(), editorDate.getMonth(), editorDate.getDate(), myTime.getHours(), myTime.getMinutes());
							Ext.getCmp('edit_time_today').setValue(myDate);
						}
					}
				}
			},
			{
				text : "Status",
				flex : 0.7,
				align : 'center',
				sortable : true,
				renderer : function(val){
					if(val == "New"){
						return '<b><span style="color:blue;">' + val + '</span></b>';
					}else if(val == "Hold"){
						return '<b><span style="color:red;">' + val + '</span></b>';
					}else{
						return '<b>'+val+'</b>';
					}
				},
				dataIndex : 'job_ref_status',
				editor: {
					xtype: 'combobox',
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showJobReference.htm?kind=JobRefStatus&dept=E-Studio',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
					editable : false
				}
			},
			{
				text : "Approve",
				flex : 1.3,
				align : 'center',
				sortable : true,
				dataIndex : 'job_ref_approve',
				renderer : function(val){
					if(val == "Done"){
						return '<b><span style="color:#8F00FF;">' + val + '</span></b>';
					}else if(val == "Hold Wait Info" || val == "Hold Other"){	
						return '<b><span style="color:red;">' + val + '</span></b>';
					}else if(val == "Working" || val == "Checking" || val == "Wait FI"){
						return '<b><span style="color:#FF8F00;">' + val + '</span></b>';
					}else if(val.indexOf("Wait Check") !== -1){
						return '<b><span style="color:#0EB400;">' + val + '</span></b>';
					}else if(val.indexOf("Wait") !== -1){
						return '<b><span style="color:grey;">' + val + '</span></b>';
					}else if(val == "Finish Path"){
						return '<b><span style="color:#B99200;">' + val + '</span></b>';
					}else{
						return '<b>'+val+'</b>';
					}
				},
				editor : {
					xtype : 'combobox',
					id : 'edit_job_ref_approve_pilot',
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : '',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
					editable : false
				}
			},
		    {
				text : "Name",
				flex : 1.5,
				sortable : true,
				dataIndex : 'job_name',
				hidden : true,
			},
			{
				text : "Remark",
				flex : 2,
				dataIndex : 'job_ref_dtl',
				editor : {
					xtype : 'textfield'
				}
			},
			],
			viewConfig: { 
		        stripeRows: false, 
		        getRowClass: function(record) {
		        	if(record.get('job_ref_status') == "Hold"){
		        		return 'hold-row';
		        	}else{
		        		return 'process-row';
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
		        },
		    },
		    plugins: 
			    [{ 
			        ptype: 'cellediting',
			        clicksToEdit: 2,
			        listeners: {
				        beforeedit: function (editor, e) {
				        	Ext.getCmp('projrefidtoday').setValue(0);
				        	if(e.field == "job_out"){
								editorDate = e.value;
				        	}else if(e.field == "itm_name"){
				        		Ext.getCmp('edit_itm_today').getStore().load({
									url: 'showProjectsReference.htm?id='+e.record.get('proj_id')
								});
				        	}
				        	if(e.field == "sent_amount"){
				        		Ext.getCmp('esent_amount').setMaxValue(e.record.get('amount'));
				        	}
				        	if(e.field == "job_ref_approve"){
				        		gjob_ref = Ext.getCmp('edit_job_ref_approve_pilot');
								
			        			gjob_ref.clearValue();
			        			gjob_ref.getStore().removeAll();
			        			gjob_ref.getStore().load({
									url: 'showJobReference.htm?kind=JobRefApprove&dept='+e.record.get('dept')
								});
				        	}
						},
						afteredit: function (editor, e) {
							if(e.field == "itm_name"){
								if(Ext.getCmp('projrefidtoday').getValue() != 0){
									e.record.set('proj_ref_id', Ext.getCmp('projrefidtoday').getValue());
								}
							}
						},
						edit: function (editor, e) {
							if(e.field == "job_out"){
								try{
									myTime = Ext.getCmp('edit_time_today').getValue();
									var myDate = new Date(editorDate.getFullYear(), editorDate.getMonth(), editorDate.getDate(), myTime.getHours(), myTime.getMinutes());
									Ext.getCmp('edit_time_today').setValue(myDate);
									e.record.set('job_out', myDate);
								}catch(e){
									console.log(e.message);
								}
							}
							if(e.field == "job_ref_approve"){
								if(Ext.getCmp('edit_job_ref_approve_estudio').getValue() == "-"){
									e.record.set("job_ref_approve", "");
								}
							}
						}
			        }
			    }],
		    bbar : Ext.create('Ext.PagingToolbar', {
				store : store.pilotJobRef,
				displayInfo : true,
				displayMsg : '<b>Total Count : {2} <b>&nbsp;&nbsp;&nbsp;',
				emptyMsg : "<b>No Job to display</b>",
			})
	});

	
	panels.search = Ext.create('Ext.form.Panel', {
		title : 'Search Criteria',
		autoWidth : true,
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
//							var item = Ext.getCmp('sitm_id');
//							item.clearValue();
//							item.getStore().removeAll();
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
//							var item = Ext.getCmp('sitm_id');
//							item.clearValue();
//							item.getStore().removeAll();
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
				},
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
									fieldLabel : 'Job Status ',
									name : 'sjob_status',
									id : 'sjob_status',
									queryMode : 'local',
									labelWidth : 100,
									emptyText : 'Job Status',
									editable : false,
									width : 280,
									margin : '0 0 10 0',
									msgTarget: 'under',
//									store : jobStatus,
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
									xtype : 'combobox',
									fieldLabel : 'Department ',
									name : 'sdept',
									id : 'sdept',
									queryMode : 'local',
									labelWidth : 100,
									editable : false,
									emptyText : 'Department',
									width : 280,
									magin : '0 0 10 0',
//									store : 'deptStore',
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
								},
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
						url : 'searchJobsParam.htm?first=' + getParamValues(),
						success : function(response, opts) {
							panels.tabs.setActiveTab('projTabs');
							Ext.getCmp('jobTabs').setDisabled(true);
							Ext.getCmp('jobTabs').setTitle("Jobs");
							store.jobs.loadPage(1);
							store.publicationJobRef.reload();
							store.jobsToday.reload();
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
	
	panels.tabs = Ext.create('Ext.tab.Panel', {
		renderTo : document.body,
		deferredRender : false,
		width: 1500,
//		height: 548,
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
	    	items: grid.job
	    },{
	    	id: 'jobTabs',
	    	disabled: true,
	    	title: 'Jobs',
	    	items: grid.jobRef
	    },{
	    	id: 'publicationTabs',
	    	title: 'Publication Jobs',
	    	items: grid.publication
	    },{
	    	id: 'estudioTabs',
	    	title: 'E-Studio Jobs',
	    	items: grid.estudio
//	    },{
//	    	id: 'pilotTabs',
//	    	title: 'Pilot Jobs',
//	    	items: grid.pilot
	    }],
	    listeners: {
            'tabchange': function (tabPanel, tab) {
                if(tab.id == 'publicationTabs'){
                	store.publicationJobRef.reload();
                	grid.publication.getStore().reload();
//                	for(var xyz=0;xyz<store.jobsToday.count();xyz++){
//        				if(Ext.fly(publicationGrid.plugins[0].view.getNodes()[xyz]).hasCls(publicationGrid.plugins[0].rowCollapsedCls) == true){
//        					publicationGrid.plugins[0].toggleRow(xyz, publicationGrid.getStore().getAt(xyz));
//        				}
//        			}
//                	setTimeout(function(){
//                		Ext.getCmp('gridToday_tbar').setText('<b>Total Count : '+store.publicationJobRef.getCount()+'</b>');
//                	},500); 
                }else if(tab.id == 'estudioTabs'){
                	store.estudioJobRef.reload();
                	grid.estudio.getStore().reload();
                }else if(tab.id == 'pilotTabs'){
                	store.pilotJobRef.reload();
                	grid.pilot.getStore().reload();
                }else if(tab.id == 'jobTabs'){
                	store.jobs.reload();
                	Ext.getCmp('filterSearchField').setValue("");
                	store.jobs.clearFilter();
//                	setTimeout(function(){
//                		Ext.getCmp('gridRef_tbar').setText('<b>Total Amount : '+totalAmount+'</b>');
//                	},500); 
                }else if(tab.id == 'projTabs'){
                	store.jobs.reload();
                	Ext.getCmp('filterSearchField').setValue("");
                	store.jobs.clearFilter();
                }
            },
            'afterrender': function(){
            	grid.job.down('toolbar').add('->',{
            		xtype : 'button',
            		text : "Add Job's Project",
            		id : 'job_add',
            		iconCls : 'icon-add',
            		handler : function() {
            			addJob.show();
            		}
            	});
            	grid.job.down('statusbar').add('->',{
              		xtype : 'tbtext',
             		 id : 'grid_total',
              		text : '<b>Total Jobs : '+store.jobs.getTotalCount()+' <b>&nbsp;&nbsp;&nbsp;'
            	});
            }
        }
	})

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
//	    	    	minValue : 0,
	    	    	msgTarget : 'under',
	    	    	maxLength : 60,
	    	    	name: 'ajob_name',
	    	    	id: 'ajob_name',
	    	    	listeners: {
	            		 'blur': function(e){
	            			var name = Ext.getCmp('ajob_name').getValue();
	            			 Ext.Ajax.request({
	            				url : 'chkJobName.htm',
	            				params: {records : name},
	            				success: function(response, opts){
	            					var responseOject = Ext.decode(response.responseText);
	            					if(responseOject.records[0].job_id != 0){
	  	           						Ext.getCmp('ajob_name').setValue('');
	  	           						Ext.getCmp('ajob_name').markInvalid('"'+name+'" has been used');
	            					}
	            				},
	            				failure: function(response, opts){
	            					var responseOject = Ext.util.JSON.decode(response.responseText);
	            					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
	            				}
	            			});
	            		 }
	            	 }
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
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var myValue = this.store.getAt(myIndex).data.cus_name;
							var myId = this.store.getAt(myIndex).data.cus_id;
							Ext.getCmp('acus_name').setValue(myValue);
							
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
//					listeners : {
	//
//						select : function() {
//							var proj_ref = Ext.getCmp('aproj_ref_id');
//							var proj_id = Ext.getCmp('aproj_id').getValue();
	//
//							proj_ref.clearValue();
//							proj_ref.getStore().removeAll();
//							proj_ref.getStore().load({
//								url: 'showProjectsReference.htm?id='+proj_id
//							});
//							proj_ref.markInvalid('Item Required!');
//							proj_ref.allowBlank = false;
//						},
//						blur : function() {
//							var v = this.getValue();
//							var record = this.findRecord(this.valueField || this.displayField, v);
//							if(record == false){
//								Ext.getCmp('aproj_id').setValue("");
//								Ext.getCmp('aproj_ref_id').clearInvalid();
//								Ext.getCmp('aproj_ref_id').allowBlank = true;
//								Ext.getCmp('aproj_ref_id').clearValue();
//								Ext.getCmp('aproj_ref_id').getStore().removeAll();
//							}
//						}
//					}
				},
				{
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
//					store : 'deptStore',
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
				},{
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
//					store : jobStatus,
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
					value : 'Processing'
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
	          							Ext.getCmp('filterSearchField').setValue("");
	          		                	store.jobs.clearFilter();
	          							}
	          					});
	                            },
	                            failure : function(form, action) {
//									Ext.Msg.alert('Failed',
//											action.result ? action.result.message
//													: 'No response');
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
	    	    	listeners: {
	              		 'blur': function(e){
	              			var name = Ext.getCmp('ejob_name').getValue();
	              			var job_id = Ext.getCmp('ejob_id').getValue();
	              			 Ext.Ajax.request({
	              				url : 'chkJobName.htm',
	              				params: {records : name},
	              				success: function(response, opts){
	              					var responseOject = Ext.decode(response.responseText);
	              					if(responseOject.records[0].job_id != 0){
	              						if(responseOject.records[0].job_id != job_id){
	    	           						Ext.getCmp('ejob_name').setValue('');
	    	           						Ext.getCmp('ejob_name').markInvalid('"'+name+'" has been used');
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
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							var myIndex = this.store.indexOf(record);
							var myValue = this.store.getAt(myIndex).data.cus_name;
							var myId = this.store.getAt(myIndex).data.cus_id;
							Ext.getCmp('ecus_name').setValue(myValue);

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
//					store : 'deptStore',
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
//					store : jobStatus,
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
					listeners : {
						select : function() {
							var v = this.getValue();
							var record = store.jobs.findRecord('job_id',Ext.getCmp('ejob_id').getValue());
							var myIndex = store.jobs.indexOf(record);
							var myValue = store.jobs.getAt(myIndex).data.remain_job;
							var oldValue = store.jobs.getAt(myIndex).data.job_status;
							if(v != "Processing" && v != "Hold"){
								if(myValue != 0){
									Ext.getCmp('ejob_status').setValue(oldValue);
									Ext.MessageBox.show({
		          						title: 'Information',
		          						msg: "Still Have Jobs Remaining!",
		          						buttons: Ext.MessageBox.OK,
		          						icon: Ext.MessageBox.ERROR
		          					});
								}
							}
						}
					}
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
	          						msg: "Job's Project Has Been Updated!",
	          						buttons: Ext.MessageBox.OK,
	          						icon: Ext.MessageBox.INFO,
	          						animateTarget: 'ejob_btn',
	          						fn: function(){
	          							editJob.hide();
	          							store.jobs.reload();
	          							Ext.getCmp('filterSearchField').setValue("");
	          		                	store.jobs.clearFilter();
	          							}
	          					});
	                            },
	                            failure : function(form, action) {
//									Ext.Msg.alert('Failed',
//											action.result ? action.result.message
//													: 'No response');
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
	    pinned:true,
	    dynamic: true,
//	    resizeHandles: 'w e',
	    minWidth: 500,
	    minHeight: 526,
	    layout : 'fit',
	    closeAction: 'hide',
	    resizable: false,
//	    onResize : function(win, height, width, eOpts){
//	    	var myHeight = addJobRef.getHeight() - 526 + 150;
//	    	Ext.getCmp('ajob_ref_dtl').setHeight(myHeight);
//	    },
	    items :[{
	    	xtype:'form',
	        id:'addJobRefForm',
	        items:[{
	    		xtype:'fieldset',
	            title: 'Job Information',
	            defaultType: 'textfield',
//	            layout: 'anchor',
	            padding: 10,
//	            width:400,
	            style: {
	                "margin-left": "10px",
	                "margin-right": "10px",
	                "margin-top": "10px",
	                "margin-bottom": "10px"
	            },
	            defaults: {
	                anchor: '100%'
	            },
	            items :[{
	    	    	xtype:'textarea',
	    	    	labelWidth: 120,
	    	    	allowBlank: false,
	    	    	fieldLabel: 'Job Name <font color="red">*</font> ',
	    	    	emptyText : 'Job Name',
//	    	    	minValue : 0,
	    	    	msgTarget : 'under',
	    	    	maxLength : 500,
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
//					store : jobRefStatusPublication,
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showJobReference.htm?kind=JobRefStatus&dept=Publication',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
//					value : 'New'
				},
				{
					xtype: 'textfield',
					labelWidth: 120,
					fieldLabel: 'Job Number ',
					name: 'ajob_ref_number',
					id: 'ajob_ref_number',
					emptyText: 'Job Number',
					maxLength: 30
				},
				{
					xtype : 'datefield',
					fieldLabel : 'Job in ',
					name: 'ajob_in',
					id: 'ajob_in',
	                labelWidth : 120,
	                msgTarget : 'under',
//	                margin: '10 110 10 0',
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
					fieldLabel : 'Deadline ',
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
	                        name: 'ajob_out',
	                        id: 'ajob_out',
	                        labelSeparator : '',
	                        margin: '0 0 0 20',
	                        msgTarget : 'under',
	                        flex: 1.5,
	                        editable: false,
	                        format: 'Y-m-d',
	                        emptyText : 'Date out',
	                        listeners: {
	                        	   "change": function () {
	                        		   			var startDate = Ext.getCmp('ajob_in').getRawValue();
	                        		   			Ext.getCmp('ajob_out').setMinValue(startDate);
	                        		   			Ext.getCmp('atime').allowBlank = false;
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
	                        xtype: 'timefield',
	                        margin: '0 0 0 0',	
	                        name: 'atime',
	                        id: 'atime',
	                        labelSeparator : '',
	                        msgTarget : 'under',
	                        emptyText : 'Time',
	                        format: 'H:i'
	                    }
	                ]
				},
	    	    {
					xtype: 'combobox',
					fieldLabel : 'Item Name ',
					name : 'aproj_ref_id',
					id : 'aproj_ref_id',
//					allowBlank: false,
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
//					displayField : 'itm_name'
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
	    	    	height : 150,
	    	    	maxLength : 1000,
					maxLengthText : 'Maximum input 1000 Character',
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
	                        success: function(form, action) {
	                        	var responseObject = Ext.decode(action.response.responseText);
	                        	i=0;
	           					function openPDF(){
		           					setTimeout(function(){
	           							job_ref_id = responseObject.records[i].job_ref_id;
		           						window.open('printJobTicket.htm?job_ref_id='+job_ref_id, '_blank');
		           						i++;
		           						if(i < responseObject.total){
		           							openPDF();
		           						}
		           					},1000);
	           					}
	           					openPDF();
//	                        	Ext.Ajax.request({
//	    	           				url : 'chkJobRefName.htm',
//	    	           				params: {records : job_ref_name},
//	    	           				success: function(response, opts){
//	    	           					var responseOject = Ext.decode(response.responseText);
//	    	           					i=0;
//	    	           					function openPDF(){
//		    	           					setTimeout(function(){
//	    	           							job_ref_id = responseOject.records[i].job_ref_id;
//		    	           						window.open('printJobTicket.htm?job_ref_id='+job_ref_id, '_blank');
//		    	           						i++;
//		    	           						if(i < responseOject.total){
//		    	           							openPDF();
//		    	           						}
//		    	           					},1000);
//	    	           					}
//	    	           					openPDF();
//	    	           				},
//	    	           				failure: function(response, opts){
//	    	           					var responseOject = Ext.util.JSON.decode(response.responseText);
//	    	           					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
//	    	           				}
//	    	           			});	
	                       	 Ext.MessageBox.show({
	         						title: 'Information',
	         						msg: 'Job Has Been Add!',
	         						buttons: Ext.MessageBox.OK,
	         						icon: Ext.MessageBox.INFO,
	         						animateTarget: 'abtn',
	         						fn: function(){
	         							addJobRef.hide();
	         							store.jobs.reload();
	         							store.jobsRef.reload();
	         							}
	         					});
	                           },
	                           failure : function(form, action) {
//									Ext.Msg.alert('Failed',
//											action.result ? action.result.message
//													: 'No response');
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
	            },
//	            {xtype: 'tbspacer', width: 110}
	            '->'
	            ,{	
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
	          							store.jobs.reload();
	          							store.jobsRef.reload();
	          							}
	          					});
	                            },
	                            failure : function(form, action) {
	                            	var responseOject = Ext.decode(action.response.responseText);
//	                           	 	alert(responseOject.total);
//									Ext.Msg.alert('Failed',
//											action.result ? action.result.message
//													: 'No response');
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
	                	width:100,
	                	handler: function(){
	                		Ext.getCmp('addJobRefForm').getForm().reset();
	                		Ext.getCmp('atime').clearInvalid();
		                	Ext.getCmp('atime').allowBlank = true;
	                	}
	                }],
	               	listeners:{
	               		'beforehide':function(){
	               			Ext.getCmp('addJobRefForm').getForm().reset();
	               			Ext.getCmp('atime').clearInvalid();
		                	Ext.getCmp('atime').allowBlank = true;
		                	addJobRef.setSize(500,526);
		                	}
	               	}
	});

	editJobRef = new Ext.create('Ext.window.Window', {
		title: 'Edit Job',
	    animateTarget: 'edit',
	    modal : true,
	    pinned:true,
	    dynamic: true,
	    minWidth: 500,
	    minHeight: 473,
	    layout : 'fit',
	    closeAction: 'hide',
	    resizable:false,
//	    onResize : function(win, height, width, eOpts){
//	    	var myHeight = editJobRef.getHeight() - 473 + 150;
//	    	Ext.getCmp('ejob_ref_dtl').setHeight(myHeight);
//	    },
	    items :[{
	    	xtype:'form',
	        id:'editJobRefForm',
	        items:[{
	    		xtype:'fieldset',
	            title: 'Job Information',
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
	            items :[{
	    	    	xtype:'textfield',
	    	    	labelWidth: 120,
	    	    	fieldLabel: 'Job Name <font color="red">*</font> ',
	    	    	emptyText : 'Job Name',
	    	    	msgTarget : 'under',
	    	    	name: 'ejob_ref_name',
	    	    	id: 'ejob_ref_name',
	    	    	maxLength : 100,
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
//					store : jobRefStatusPublication,
					store : {
						fields : ['db_ref_name'],
						proxy : {
							type : 'ajax',
							url : 'showJobReference.htm?kind=JobRefStatus&dept=Publication',
							reader : {
								type : 'json',
								root : 'records',
							}
						},
						autoLoad : true
					},
					valueField : 'db_ref_name',
					displayField : 'db_ref_name',
				},{
					xtype: 'textfield',
					labelWidth: 120,
					fieldLabel: 'Job Number ',
					name: 'ejob_ref_number',
					id: 'ejob_ref_number',
					emptyText: 'Job Number',
					maxLength: 30
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
						autoLoad : true
					},
					valueField : 'proj_ref_id',
					//displayField : 'itm_name'
					tpl: Ext.create('Ext.XTemplate',
					        '<tpl for=".">',
					        	"<tpl if='proj_ref_desc == \"\"'>",
					        	'<div class="x-boundlist-item">{itm_name}</div>',
					            '<tpl else>',
					            '<div class="x-boundlist-item">{itm_name} - {proj_ref_desc}</div>',
					            '</tpl>',
				            '</tpl>'
				    ),
				    displayTpl: Ext.create('Ext.XTemplate',
				        '<tpl for=".">',
				        	"<tpl if='proj_ref_desc == \"\"'>",
				        	'{itm_name}',
				            '<tpl else>',
				            '{itm_name} - {proj_ref_desc}',
				            '</tpl>',
				        '</tpl>'
				    ),
				},
				{
					xtype : 'datefield',
					fieldLabel : 'Job in ',
					name: 'ejob_in',
					id: 'ejob_in',
	                labelWidth : 120,
	                msgTarget : 'under',
//	                margin: '10 110 10 0',
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
					fieldLabel : 'Deadline ',
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
	                        name: 'ejob_out',
	                        id: 'ejob_out',
	                        labelSeparator : '',
	                        margin: '0 0 0 20',
	                        msgTarget : 'under',
	                        flex: 1.5,
	                        editable: false,
	                        format: 'Y-m-d',
	                        emptyText : 'Date out',
	                        listeners: {
	                        	   "change": function () {
	                        		   			var startDate = Ext.getCmp('ejob_in').getRawValue();
	                        		   			Ext.getCmp('ejob_out').setMinValue(startDate);
	                        		   			Ext.getCmp('etime').allowBlank = false;
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
	                        xtype: 'timefield',
	                        margin: '0 0 0 0',	
	                        name: 'etime',
	                        id: 'etime',
	                        labelSeparator : '',
	                        msgTarget : 'under',
	                        emptyText : 'Time',
	                        format: 'H:i'
	                    }
	                ]
				},
				{
	    	    	xtype:'numberfield',
	    	    	labelWidth: 120,
	    	    	fieldLabel: 'Amount / Hours ',
//	    	    	allowBlank: false,
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
	    	    	height : 150,
	    	    	maxLength : 1000,
					maxLengthText : 'Maximum input 1000 Character',
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
	          						msg: 'Job Has Been Updated!',
	          						buttons: Ext.MessageBox.OK,
	          						icon: Ext.MessageBox.INFO,
	          						animateTarget: 'ebtn',
	          						fn: function(){
	          							editJobRef.hide();
	          							store.jobs.reload();
	          							store.jobsRef.reload();
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
	                	width:100,
	                	handler: function(){
	                		Ext.getCmp('editJobRefForm').getForm().reset();
	                		Ext.getCmp('etime').clearInvalid();
	                		Ext.getCmp('etime').allowBlank = true;
	                	}
	                }],
	               	listeners:{
	               		'beforehide':function(){
	               			Ext.getCmp('editJobRefForm').getForm().reset();
	               			Ext.getCmp('etime').clearInvalid();
	                		Ext.getCmp('etime').allowBlank = true;
	                		editJobRef.setSize(500,473);
	               		}
	               	}
	});
	
	addInvoice = new Ext.create('Ext.window.Window', {
		title: 'Create Invoice',
		width: 450,
		animateTarget: 'invoice-button',
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
	            		}],
	            		listeners: {
	            			load: function(){
	            				if(Ext.getCmp('ainv_company_id').store.count() > 8){
	            					setTimeout(function(){
	            						Ext.getCmp('ainv_company_id').getStore().removeAt(0);
	            					},500);
	            				}
	            			}
	            		}
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
	            	xtype : 'displayfield',
	            	fieldLabel : 'Customer Name ',
	            	id: 'ainv_cus_name',
	            	name: 'ainv_cus_name',
	            	labelWidth : 120,
	            	fieldStyle : 'font-size:12px;font-weight:bold;'
	            },{
	            	xtype : 'displayfield',
	            	fieldLabel : 'Customer Code ',
	            	id: 'ainv_cus_code',
	            	name: 'ainv_cus_code',
	            	labelWidth : 120,
	            	fieldStyle : 'font-size:12px;font-weight:bold;'
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
					xtype : 'numberfield',
					fieldLabel : 'Discount(%) <font color="red">*</font> ',
					name : 'ainv_discount',
					id : 'ainv_discount',
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
			},{
				xtype: 'hidden',
				id: 'ainv_job_id',
				name: 'ainv_job_id'
			},{
				xtype: 'hidden',
				id: 'ainv_job_name',
				name: 'ainv_job_name'
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
     							panels.tabs.setActiveTab('projTabs');
     							Ext.getCmp('jobTabs').setDisabled(true);
     							Ext.getCmp('jobTabs').setTitle("Jobs");
     							store.jobs.loadPage(1);
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
	})
	
	duplicateJobRef = new Ext.create('Ext.window.Window', {
		title: 'Duplicate Job',
		width: 450,
		animateTarget: 'duplicate_job_ref',
		resizable: false,
		closeAction: 'hide',
		items: [{
			xtype: 'form',
			id: 'duplicateJobRefForm',
			items: [{
				xtype: 'fieldset',
				title: 'Job Information',
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
	            	allowBlank: false,
	    	    	fieldLabel: 'Job Name <font color="red">*</font> ',
	            	labelWidth : 120,
	            	name: 'dup_job_ref_name',
	            	id: 'dup_job_ref_name',
	            	msgTarget: 'under'
	            },{
					xtype: 'combobox',
					fieldLabel : 'Item Name ',
					name : 'dup_proj_ref_id',
					id : 'dup_proj_ref_id',
//					allowBlank: false,
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
//					displayField : 'itm_name'
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
	    	    	name: 'dup_amount',
	    	    	id: 'dup_amount',
	    	    	emptyText : 'Amount or Hours',
	    	    }]
			},{
				xtype : 'hidden',
				id : 'dup_job_ref_id',
				name : 'dup_job_ref_id'
            }]
		}],
		buttons:[{
			text: 'Add',
			width: 100,
			id: 'duplicateJobRefBtn',
			handler: function(){
				var form = Ext.getCmp('duplicateJobRefForm').getForm();
				if (form.isValid()){
					 form.submit({
					 url: 'duplicateJobReference.htm',
					 waitTitle: 'Adding Job',
					 waitMsg: 'Please wait...',
					 standardSubmit: false,
	                success: function(form, action) {
	               	 Ext.MessageBox.show({
	 						title: 'Information',
	 						msg: "Job Has Been Add!",
	 						buttons: Ext.MessageBox.OK,
	 						icon: Ext.MessageBox.INFO,
	 						animateTarget: 'duplicate_job_ref',
	 						fn: function(){
	 							duplicateJobRef.hide();
	 							store.jobs.reload();
     							store.jobsRef.reload();
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
							animateTarget: 'duplicate_job_ref',
						});
					}
			}
		},{
			text: 'Cancel',
			width: 100,
			handler: function(){
				duplicateJobRef.hide();
			}
		}],
		listeners: {
			'beforehide': function(){
				Ext.getCmp('duplicateJobRefForm').getForm().reset();
			}
		}
	});
	
	addToExistInvoice = new Ext.create('Ext.window.Window', {
		title: 'Add To Exist Invoice',
		width: 450,
		animateTarget: 'invoice-button',
		resizable: false,
		closeAction: 'hide',
		items: [{
			xtype: 'form',
			id: 'addExistInvoiceForm',
			items: [{
				xtype: 'fieldset',
				title: 'Job List Information',
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
		            	xtype: 'monthfield',
		            	fieldLabel : 'Delivery Date <font color="red">*</font> ',
						name : 'aeinv_delivery_date',
						id : 'aeinv_delivery_date',
						labelWidth : 120,
						format: 'm/y',
						value: new Date(),
						allowBlank: false,
						editable: false
		            },{
		            	xtype: 'combobox',
		            	fieldLabel : 'Invoice Name <font color="red">*</font> ',
		            	name : 'aejob_inv_id',
		            	id : 'aejob_inv_id',
		            	allowBlank: false,
		            	queryMode: 'local',
		            	msgTarget: 'under',
		            	labelWidth: 120,
		            	editable: false,
		            	emptyText: 'Job Name',
		            	store: {
		            		fields: ['inv_id', 'inv_name'],
		            		proxy: {
		            			type: 'ajax',
		            			url: '',
		            			reader: {
		            				type: 'json',
		            				root: 'records',
		            				idProperty: 'inv_id'
		            			}
		            		},
		            		sorters: [{
		            			property: 'job_name',
		            			direction: 'ASC'
		            		}]
		            	},
		            	valueField: 'inv_id',
		            	displayField: 'inv_name'
	            }]
			},{
				xtype: 'hidden',
				id: 'aejob_id',
				name: 'aejob_id'
			},{
				xtype: 'hidden',
				id: 'aeinv_job_name',
				name: 'aeinv_job_name'
			}]
		}],
		buttons:[{
			text: 'Add',
			width: 100,
			id: 'addExistInvoiceBtn',
			handler: function(){
				var form = Ext.getCmp('addExistInvoiceForm').getForm();
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
	 						animateTarget: 'addExistInvoiceBtn',
	 						fn: function(){
	 							addToExistInvoice.hide();
	 							panels.tabs.setActiveTab('projTabs');
     							Ext.getCmp('jobTabs').setDisabled(true);
     							Ext.getCmp('jobTabs').setTitle("Jobs");
     							store.jobs.loadPage(1);
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
							msg: ' Please Select Invoice!',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR,
							animateTarget: 'addExistInvoiceBtn',
						});
					}
			}
		},{
			text: 'Cancel',
			width: 100,
			handler: function(){
				addToExistInvoice.hide();
			}
		}],
		listeners: {
			'beforehide': function(){
				Ext.getCmp('addExistInvoiceForm').getForm().reset();
			}
		}
	});
	
	Ext.Ajax.request({
		url : 'userModel.htm',
		success: function(response, opts){
			var responseOject = Ext.decode(response.responseText);
			userDept = responseOject.user[0].dept;
			userType = responseOject.user[0].usr_type;
			if(userDept == "Manager" || userDept == "Billing" || userDept == "IT"){
				panels.tabs.add({
					id: 'pilotTabs',
			    	title: 'Pilot Jobs',
			    	items: grid.pilot
			    });
			}
		},
		failure: function(response, opts){
			var responseOject = Ext.util.JSON.decode(response.responseText);
			Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
		}
	});
	
	setInterval(function(){store.publicationJobRef.reload()},240000);
	setInterval(function(){store.estudioJobRef.reload()},240000);
	setInterval(function(){store.pilotJobRef.reload()},240000);
	
}); //end onReady

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
		type : 'float'
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
	},{
		name : 'job_name',
		type : 'string'
	},{
		name : 'cus_name',
		type : 'string'
	},{
		name : 'proj_name',
		type : 'string'
	},{
		name : 'dept',
		type : 'string'
	},{
		name : 'job_ref_approve',
		type : 'string'
	},{
		name : 'sent_amount',
		type : 'float'
	},{
		name : 'total_amount',
		type : 'float'
	},{
		name : 'job_ref_number',
		type : 'string'
	}
	]
});

store.jobsRef = Ext.create('Ext.data.JsonStore', {
	model : 'jobRefModel',
	id : 'jobRefStore',
	pageSize : 20,
//	autoLoad : true,
//	autoSync : true,
	proxy : {
		type : 'ajax',
//		url : 'searchJobsReference.htm',
		api: {
			read: 'searchJobsReference.htm',
			update: 'updateJobReferenceBatch.htm'
		},
		reader : {
			type : 'json',
			root : 'records',
//			idProperty : 'job_ref_id',
			totalProperty : 'total'
		},
        writer: {
            type: 'json',
            root: 'data',
            encode: true,
            writeAllFields: true,
        },
        listeners: {
            exception: function(proxy, response, operation){
//            	console.log(operation.getError());
                Ext.MessageBox.show({
                    title: 'REMOTE EXCEPTION',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK,
                    fn: function(){location.reload()}
                });
            }
        }
	},
    listeners: {
        write: function(proxy, operation){
            if(operation.action == 'update'){
            	Ext.MessageBox.show({
						title: 'Information',
						msg: 'Job Has Been Updated!',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO,
						animateTarget: 'isave-sync',
						fn: function(){
							store.jobs.reload();
//							store.jobsRef.reload();
							}
					});
            }
            
        },
//        load: function(){
//        	totalAmount = 0;
//        	store.jobsRef.each(function(rec){
//        		totalAmount += rec.data.amount;
//			});
//        	setTimeout(function(){
//        		Ext.getCmp('gridRef_tbar').setText('<b>Total Amount : '+totalAmount+'</b>');
//        	},500);
//        }
    }
});

store.publicationJobRef = Ext.create('Ext.data.JsonStore', {
	model : 'jobRefModel',
	id : 'publicationJobRefStore',
	pageSize : 999,
	autoLoad : true,
	proxy : {
		type : 'ajax',
//		url : 'searchTodayJobsReference.htm',
		api: {
			read: 'searchTodayJobsReference.htm?grid_dept=Publication',
			update: 'updateJobReferenceBatch.htm'
		},
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'job_ref_id',
			totalProperty : 'total'
		},
		writer: {
            type: 'json',
            root: 'data',
            encode: true,
            writeAllFields: true,
        },
        listeners: {
            exception: function(proxy, response, operation){
//            	console.log(operation.getError());
                Ext.MessageBox.show({
                    title: 'REMOTE EXCEPTION',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK,
                    fn: function(){location.reload()}
                });
            }
        }
	},
    listeners: {
        write: function(proxy, operation){
            if(operation.action == 'update'){
            	Ext.MessageBox.show({
						title: 'Information',
						msg: 'Job Has Been Updated!',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO,
						animateTarget: 'isave-syncPub',
						fn: function(){
							store.publicationJobRef.reload();
							}
					});
            }
            
        },
    }
});

store.estudioJobRef = Ext.create('Ext.data.JsonStore', {
	model : 'jobRefModel',
	id : 'estudioJobRefStore',
	pageSize : 999,
	autoLoad : true,
	proxy : {
		type : 'ajax',
//		url : 'searchTodayJobsReference.htm',
		api: {
			read: 'searchTodayJobsReference.htm?grid_dept=E-Studio',
			update: 'updateJobReferenceBatch.htm'
		},
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'job_ref_id',
			totalProperty : 'total'
		},
		writer: {
            type: 'json',
            root: 'data',
            encode: true,
            writeAllFields: true,
        },
        listeners: {
            exception: function(proxy, response, operation){
//            	console.log(operation.getError());
                Ext.MessageBox.show({
                    title: 'REMOTE EXCEPTION',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK,
                    fn: function(){location.reload()}
                });
            }
        }
	},
    listeners: {
        write: function(proxy, operation){
            if(operation.action == 'update'){
            	Ext.MessageBox.show({
						title: 'Information',
						msg: 'Job Has Been Updated!',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO,
						animateTarget: 'isave-syncEstudio',
						fn: function(){
							store.estudioJobRef.reload();
							}
					});
            }
            
        },
    }
});

store.pilotJobRef = Ext.create('Ext.data.JsonStore', {
	model : 'jobRefModel',
	id : 'pilotJobRefStore',
	pageSize : 999,
	autoLoad : true,
	proxy : {
		type : 'ajax',
//		url : 'searchTodayJobsReference.htm',
		api: {
			read: 'searchTodayJobsReference.htm?grid_dept=Pilot',
			update: 'updateJobReferenceBatch.htm'
		},
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'job_ref_id',
			totalProperty : 'total'
		},
		writer: {
            type: 'json',
            root: 'data',
            encode: true,
            writeAllFields: true,
        },
        listeners: {
            exception: function(proxy, response, operation){
//            	console.log(operation.getError());
                Ext.MessageBox.show({
                    title: 'REMOTE EXCEPTION',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK,
                    fn: function(){location.reload()}
                });
            }
        }
	},
    listeners: {
        write: function(proxy, operation){
            if(operation.action == 'update'){
            	Ext.MessageBox.show({
						title: 'Information',
						msg: 'Job Has Been Updated!',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO,
						animateTarget: 'isave-syncPilot',
						fn: function(){
							store.pilotJobRef.reload();
							}
					});
            }
            
        },
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
	}, {
		name : 'total_amount',
		type : 'float'
	}, {
		name : 'remain_job',
		type : 'int'       
	}, {
		name : 'remain_item',
		type : 'int'       
	}, {
		name : 'payment_terms',
		type : 'int'       
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
	},
	listeners: {
		load : function(){
			setTimeout(function(){
          		Ext.getCmp('grid_total').setText('<b>Total Jobs : '+store.jobs.getTotalCount()+'</b>&nbsp;&nbsp;&nbsp;');
          	},500);
			try {
	 			var record = store.jobs.findRecord('job_id',Ext.getCmp('jobid_ref').getValue());
				var myIndex = store.jobs.indexOf(record);
				var myValue = store.jobs.getAt(myIndex).data.total_amount;
				store.jobsRef.reload();
				setTimeout(function(){
	          		Ext.getCmp('gridRef_tbar').setText('<b>Total Amount : '+myValue+'</b>');
	          	},500);
			} catch (err){
				console.log(err.message);
			}
		}
	}
});

store.jobsToday = Ext.create('Ext.data.JsonStore', {
	model : 'jobModel',
	id : 'jobTodayStore',
	pageSize : 20,
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'searchTodayJobs.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'job_id',
			totalProperty : 'total'
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
	}, {
		name : 'SGD',
		type : 'float'
	}

	]
});

store.exchangeRates = Ext.create('Ext.data.JsonStore', {
	model: 'exModel',
	id : 'exStore',
	autoLoad : false,
	proxy : {
		type : 'ajax',
		url : 'https://openexchangerates.org/api/latest.json?app_id=70ee2e9a9f814ea0a36bd0a00a11272c',
		reader : {
			type : 'json',
			root : 'rates',
		}
	},
	listeners: {
		load : function(){
			notLoaded = false;
			Ext.Ajax.request({
				url : 'invoiceCurrencyParam.htm?AUD='+store.exchangeRates.getAt(0).data.AUD+'&CHF='+store.exchangeRates.getAt(0).data.CHF+
				'&GBP='+store.exchangeRates.getAt(0).data.GBP+'&THB='+store.exchangeRates.getAt(0).data.THB+
				'&EUR='+store.exchangeRates.getAt(0).data.EUR+'&USD='+store.exchangeRates.getAt(0).data.USD+
				'&SGD='+store.exchangeRates.getAt(0).data.SGD,
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
        {"currency":"USD", "name":"US Dollar[USD]"},
        {"currency":"SGD", "name":"Singapore Dollar[SGD]"}
    ]
});

//var department = Ext.data.StoreManager.lookup('deptStore');
//var department = Ext.create('Ext.data.Store', {
//	fields: ['name'],
//	data : [
//	        {"name":"Publication"},
//	        {"name":"E-Studio"},
//	        {"name":"E-Studio_OTTO"},
//	        {"name":"E-Studio_MM"},
//	        {"name":"E-Studio_Masking"},
//	]
//});
//
//var jobStatus = Ext.create('Ext.data.Store', {
//	fields: ['name'],
//	data : [
//	        {"name":"Processing"},
//	        {"name":"Sent"},
//	        {"name":"Checked"},
//	        {"name":"Billed"},
//	        {"name":"Hold"}     
//	]
//});
//
//var jobRefStatusPublication = Ext.create('Ext.data.Store', {
//	fields: ['name'],
//	data : [
//	        {"name":"New"},
//	        {"name":"New Pic"},
//	        {"name":"New Doc"},
//	        {"name":"New Pic+Doc"},
//	        {"name":"CC"},
//	        {"name":"CC2"},
//	        {"name":"CC3"},
//	        {"name":"CC+Final"},
//	        {"name":"Final"},
//	        {"name":"Sent"},
//	        {"name":"Hold"}     
//	]
//});
//
//var jobRefApprovePublication = Ext.create('Ext.data.Store', {
//	fields: ['name'],
//	data : [
//	        {"name":"-"},
//	        {"name":"Done"},
//	        {"name":"Sent PDF Vorab"},
//	        {"name":"Sent PDF K1"},
//	        {"name":"Sent PDF K2"},
//	        {"name":"Sent PDF Final"},
//	        {"name":"Wait Final"},
//	        {"name":"Wait Check"},
//	        {"name":"Wait FI"},
//	        {"name":"Up Proof"},
//	        {"name":"CC1"},
//	        {"name":"CC2"},
//	        {"name":"CC3"},
//	        {"name":"CC4"},
//	        {"name":"Wait Mask"},
//	        {"name":"Wait Move Mask"},
//	        {"name":"Missing Pic"},
//	        {"name":"Low Quality Pic"},
//	        {"name":"Low Res Pic"},
//	        {"name":"Ask Customer"},
//	        {"name":"Hold Other"}
//	]
//});
//
//var jobRefStatusEstudio = Ext.create('Ext.data.Store', {
//	fields: ['name'],
//	data : [
//	        {"name":"New"},
//	        {"name":"CC"},
//	        {"name":"Sent"},
//	        {"name":"Hold"}     
//	]
//});
//
//var jobRefApproveEstudio = Ext.create('Ext.data.Store', {
//	fields: ['name'],
//	data : [
//	        {"name":"-"},
//	        {"name":"Done"},
//	        {"name":"Processing"},
//	        {"name":"Wait Path"},
//	        {"name":"Wait Check"},
//	        {"name":"Wait FI"},
//	        {"name":"Ask Customer"},
//	        {"name":"Hold Other"}
//	]
//});

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
								Ext.getCmp('filterSearchField').setValue("");
      		                	store.jobs.clearFilter();
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
							fn : function(){
								store.jobs.reload();
								store.jobsRef.reload();
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

function renderTime(value, meta, record, rowIndex, colIndex, store) {
    return record.get('time')+' mins';
} 
