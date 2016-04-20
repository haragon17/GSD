store = {};
panels = {};

Ext.onReady(function() {

	projid = new Ext.form.Hidden({
		name : 'projid',
		id : 'projid'
	});
	cusid = new Ext.form.Hidden({
		name : 'cusid',
		id : 'cusid'
	});
	fid = new Ext.form.Hidden({
		name : 'fid',
		id : 'fid'
	});
	
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
				items : [ 
				    {
				    fieldLabel : 'Project Name ',
				    name : 'sproj_name',
				    id : 'sproj_name',
				    labelWidth : 110,
					margin : '0 0 10 0',
					width : 260,
					emptyText : 'Project Name'
				    
				    }, {
					xtype : 'combobox',
					fieldLabel : 'Customer Name ',
					name : 'scus_name',
					id: 'scus_name',
					queryMode : 'local',
					labelWidth : 110,
					margin : '0 0 10 0',
					width : 260,
					emptyText : 'Customer Name',
					store : {
						fields : [ 'cus_id', 'cus_name', 'cus_code' ],
						proxy : {
							type : 'ajax',
							url : 'searchCustomer.htm',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'cus_id'
							}
						},
						autoLoad : true
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
							Ext.getCmp('cusid').setValue(myId);
							Ext.getCmp('scus_code').setValue(myValue);
							
							console.log("cus_code: "+myValue);
						},
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record !== false){
								var myIndex = this.store.indexOf(record);
								var myValue = this.store.getAt(myIndex).data.cus_name;
								var myId = this.store.getAt(myIndex).data.cus_id;
								Ext.getCmp('cusid').setValue(myId);
								Ext.getCmp('scus_code').setValue(myValue);
							}else{
								Ext.getCmp('cusid').setValue("");
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
					emptyText : 'Customer Code',
					store : {
						fields : [ 'cus_id', 'cus_code', 'cus_name' ],
						proxy : {
							type : 'ajax',
							url : 'searchCustomer.htm',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'cus_id'
							}
						},
						autoLoad : true
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
							Ext.getCmp('cusid').setValue(myId);
							Ext.getCmp('scus_name').setValue(myValue);
							
							console.log("cus_name: "+myValue);
						},
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record !== false){
								var myIndex = this.store.indexOf(record);
								var myValue = this.store.getAt(myIndex).data.cus_name;
								var myId = this.store.getAt(myIndex).data.cus_id;
								Ext.getCmp('cusid').setValue(myId);
								Ext.getCmp('scus_name').setValue(myValue);
							}else{
								Ext.getCmp('cusid').setValue("");
								Ext.getCmp('scus_code').setValue("");
								Ext.getCmp('scus_name').setValue("");
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
					fieldLabel : 'Item Name ',
					name : 'sitm_id',
					id : 'sitm_id',
					queryMode : 'local',
					labelWidth : 100,
					margin : '0 0 10 0',
					width : 280,
					emptyText : 'Item Name',
					store : {
						fields : [ 'itm_id', 'itm_name' ],
						proxy : {
							type : 'ajax',
							url : 'showItem.htm',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'itm_id'
							}
						},
						autoLoad : true
					},
					valueField : 'itm_id',
					displayField : 'itm_name'
				}, 
//				{
//					fieldLabel : 'Price €',
//					name : 'sprice',
//					combineErrors: true,
//					xtype: 'fieldcontainer',
//					labelWidth : 100,
//					margin : '0 0 10 0',
//					width : 290,
//					layout: 'hbox',
//	                defaults: {
//	                    flex: 1,
//	                },
//	                items: [
//	                    {
//	                        xtype     : 'numberfield',
//	                        name      : 'price_start',
//	                        id	: 'price_start',
//	                        labelSeparator : '',
//	                        margin: '0 0 0 0',
//	                        msgTarget : 'side',
//	                        minValue : 0,
//	                        width: 50,
//	                        listeners: {
//	                        	   "blur": function () {
//	                        		   			var startDate = Ext.getCmp('price_start').getRawValue();
//	                        		   			Ext.getCmp('price_limit').setMinValue(startDate);
//	                        	   }
//	                        }
//	                    },{
//	                    	 xtype: 'fieldcontainer',
//	     	                fieldLabel: 'To ',
//	     	                combineErrors: true,
//	     	                msgTarget : 'side',
//	     	                margin: '0 0 0 5',
//	                    	labelSeparator : '',
//	                        Width : 20
//	                    },
//	                    {
//	                        xtype     : 'numberfield',
//	                        margin: '0 10 0 -50',	
//	                        name      : 'price_limit',
//	                        id	: 'price_limit',
//	                        labelSeparator : '',
//	                        msgTarget : 'side',
//	                        minValue : 0,
//	                        width: 50,
//	                        listeners: {
//	                        	"blur": function () {
//	                        		   	var endDate = Ext.getCmp('price_limit').getRawValue();
//	                           			Ext.getCmp('price_start').setMaxValue(endDate);
//	                        	}
//	                        }
//	                    }
//	                ]
//				},
				,{
					xtype: 'combobox',
					fieldLabel : 'Key Acc Mng ',
					name : 'skey_acc_mng',
					id : 'skey_acc_mng',
					queryMode : 'local',
					labelWidth : 100,
					margin : '0 0 10 0',
					width : 280,
					emptyText : 'Key Acc Mng',
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
				},
				{
					fieldLabel : 'Time(minutes)',
					name : 'stime',
					combineErrors: true,
					xtype: 'fieldcontainer',
					labelWidth : 100,
					msgTarget : 'above',
					margin : '0 0 10 0',
					width : 290,
					layout: 'hbox',
	                defaults: {
	                    flex: 1,
	                },
	                items: [
	                    {
	                        xtype     : 'numberfield',
	                        name      : 'time_start',
	                        id	: 'time_start',
	                        labelSeparator : '',
	                        margin: '0 0 0 0',
	                        msgTarget : 'side',
	                        minValue : 0,
	                        width: 50,
	                        listeners: {
	                        	   "blur": function () {
	                        		   			var startDate = Ext.getCmp('time_start').getRawValue();
	                        		   			Ext.getCmp('time_limit').setMinValue(startDate);
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
	                        xtype     : 'numberfield',
	                        margin: '0 10 0 -50',	
	                        name      : 'time_limit',
	                        id	: 'time_limit',
	                        labelSeparator : '',
//	                        msgTarget : 'side',
	                        minValue : 0,
	                        width: 50,
	                        listeners: {
	                        	"blur": function () {
	                        		   	var endDate = Ext.getCmp('time_limit').getRawValue();
	                           			Ext.getCmp('time_start').setMaxValue(endDate);
	                        	}
	                        }
	                    }
	                ]
				},
//				{
//					fieldLabel : 'Update Date',
//					name : 'supdate_date',
//					combineErrors: true,
//					xtype: 'fieldcontainer',
//					labelWidth : 100,
//					margin : '0 0 10 0',
//					width : 290,
//					layout: 'hbox',
//	                defaults: {
//	                    flex: 1,
//	                },
//	                items: [
//	                    {
//	                        xtype     : 'datefield',
//	                        name      : 'update_start',
//	                        id	: 'update_start',
//	                        labelSeparator : '',
//	                        margin: '0 0 0 0',
//	                        msgTarget : 'side',
//	                        width: 50,
//	                        editable: false,
//	                        format: 'Y-m-d',
//	                        listeners: {
//	                        	   "blur": function () {
//	                        		   			var startDate = Ext.getCmp('update_start').getRawValue();
//	                        		   			Ext.getCmp('update_limit').setMinValue(startDate);
//	                        	   }
//	                        }
//	                    },{
//	                    	 xtype: 'fieldcontainer',
//	     	                fieldLabel: 'To ',
//	     	                combineErrors: true,
//	     	                msgTarget : 'side',
//	     	                margin: '0 0 0 5',
//	                    	labelSeparator : '',
//	                        Width : 20
//	                    },
//	                    {
//	                        xtype     : 'datefield',
//	                        margin: '0 10 0 -50',	
//	                        name      : 'update_limit',
//	                        id	: 'update_limit',
//	                        labelSeparator : '',
//	                        msgTarget : 'side',
//	                        editable: false,
//	                        format: 'Y-m-d',
//	                        width: 50,
//	                        listeners: {
//	                        	"blur": function () {
//	                        		   	var endDate = Ext.getCmp('update_limit').getRawValue();
//	                           			Ext.getCmp('update_start').setMaxValue(endDate);
//	                        	}
//	                        }
//	                    }
//	                ]
//				} 
				]
			} ]
		} ],

		buttons : [ {
			text : 'Search',
			id : 'searchs',
			handler : function() {
				var form = this.up('form').getForm();

				if (form.isValid()) {

					Ext.Ajax.request({
						url : 'searchProjectsParam.htm?AUD='+store.exchangeRates.getAt(0).data.AUD+'&CHF='+store.exchangeRates.getAt(0).data.CHF+
						'&GBP='+store.exchangeRates.getAt(0).data.GBP+'&THB='+store.exchangeRates.getAt(0).data.THB+
						'&EUR='+store.exchangeRates.getAt(0).data.EUR+'&cus_id='+Ext.getCmp('cusid').getValue() + getParamValues(),
						success : function(response, opts) {
							store.projectsRef.reload();
							store.projects.loadPage(1);
//							for(var xyz=0;xyz<store.projects.count();xyz++){
//								if(Ext.fly(panels.grid.plugins[0].view.getNodes()[xyz]).hasCls(panels.grid.plugins[0].rowCollapsedCls) == true){
//									panels.grid.plugins[0].toggleRow(xyz, panels.grid.getStore().getAt(xyz));
//								}
//							}
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
				Ext.getCmp('cusid').setValue("");
				
			}
		} ]

	});

	panels.grid = Ext.create('Ext.grid.Panel', {
		renderTo : document.body,
		xtype: 'row-expander-grid',
		title : 'Projects',
		split : true,
		forceFit : true,
		loadMask : true,
		autoWidth : true,
		frame : true,
		store : store.projects,
//		tbar: [{
//            text: 'Expand All',
//            scope: this,
//            handler: this.onAddClick
//        },{
//        	text: 'Collapse All',
//            scope: this,
//            handler: this.onAddClick
//        }],
//		tools : [ {
//			xtype : 'button',
//			text : 'Add Project',
//			id : 'icreate',
//			iconCls : 'icon-add',
//			handler : function() {
//				addProject.showAt(panels.search.getX()+125,panels.search.getY());
//			}
//		} ],
		style : {
			"margin-left" : "auto",
			"margin-right" : "auto",
			"margin-top" : "15px",
			"margin-bottom" : "15px"
		},
		width : 850,
		height : 400,
		columns : [
				{
					text : "Project Name",
					width : 150,
					sortable : true,
					dataIndex : 'proj_name'
				},
				{
					text : "Customer Name",
					width : 150,
					sortable : true,
					dataIndex : 'cus_name'
				},
				{
					text : "Project Description",
					width : 200,
					sortable : true,
					dataIndex : 'proj_desc'
				},
//				{
//					text : "Item Name",
//					width : 100,
//					sortable : true,
//					dataIndex : 'itm_name'
//				},
//				{
//					text : "Time",
//					width : 60,
//					sortable : true,
//					renderer : renderTime,
//					align : 'center',
//					dataIndex : 'time'
//				},
//				{
//					text : "Price",
//					width : 80,
//					sortable : true,
//					renderer : combinecols,
//					dataIndex : 'proj_ref_id'
//				},
//				{
//					text : "Price(Euro)",
//					width : 80,
//					sortable : true,
//					renderer : currencyToEuro,
//					dataIndex : 'proj_ref_id'
//				},
				{
					text : 'Briefing',
					width : 60,
					xtype : 'actioncolumn',
					align : 'center',
					id : 'open',
					items : [{
						iconCls : 'my-icon',
						tooltip : 'Download',
						handler : function(grid, rowIndex, colIndex){
							file_id = grid.getStore().getAt(rowIndex).get('file_id');
							if(file_id != 0){
								window.open('download.htm?file='+file_id,'_blank');
							}else{
								Ext.MessageBox.show({
									title : 'Infomation',
									msg : 'No Briefing Uploaded !',
									buttons : Ext.MessageBox.OK,
									animateTarget : 'open',
									icon : Ext.MessageBox.INFO
								});
							}
						}
					}]
				},
//				{
//					text : 'Add',
//					width : 50,
//					xtype : 'actioncolumn',
//					align : 'center',
//					id : 'add',
//					items : [{
//						iconCls : 'icon-add',
//						tooltip : 'Add',
//						handler : function(grid, rowIndex, colIndex){
//							proj_id = grid.getStore().getAt(rowIndex).get('proj_id');
//							Ext.getCmp('aproj_id').setValue(proj_id);
//							addItem.show();
//						}
//					}]
//				},
//				{
//					text : 'Edit',
//					xtype : 'actioncolumn',
//					width : 50,
//					align : 'center',
//					id : 'edit',
//					items : [ {
//						iconCls : 'table-edit',
//						handler : function(grid, rowIndex, colIndex) {
//							proj_ref_id = grid.getStore().getAt(rowIndex).get('proj_ref_id');
//							proj_name = grid.getStore().getAt(rowIndex).get('proj_name');
//							itm_id = grid.getStore().getAt(rowIndex).get('itm_id');
//							cus_id = grid.getStore().getAt(rowIndex).get('cus_id');
//							file_id = grid.getStore().getAt(rowIndex).get('file_id');
//							time = grid.getStore().getAt(rowIndex).get('time');
//							price = grid.getStore().getAt(rowIndex).get('price');
//							currency = grid.getStore().getAt(rowIndex).get('currency');
//							proj_ref_desc = grid.getStore().getAt(rowIndex).get('proj_ref_desc');
//							cus_name = grid.getStore().getAt(rowIndex).get('cus_name');
//							cus_code = grid.getStore().getAt(rowIndex).get('cus_code');
//
//							Ext.getCmp('eproj_name').setValue(proj_name);
//							Ext.getCmp('ecus_id').setValue(cus_id);
//							Ext.getCmp('ecus_name').setValue(cus_name);
//							Ext.getCmp('ecus_code').setValue(cus_code);
//							Ext.getCmp('eitm_id').setValue(itm_id);
//							Ext.getCmp('etime').setValue(time);
//							Ext.getCmp('eprice').setValue(price);
//							Ext.getCmp('ecurrency').setValue(currency);
//							Ext.getCmp('eproj_ref_desc').setValue(proj_ref_desc);
//							Ext.getCmp('eproj_ref_id').setValue(proj_ref_id);
//							Ext.getCmp('efile_id').setValue(file_id);
//							editProject.show();
//						}
//					} ]
//				},
//				{
//					text : 'Delete',
//					xtype : 'actioncolumn',
//					width : 50,
//					align : 'center',
//					id : 'del',
//					items : [ {
//						iconCls : 'icon-delete',
//						handler : function(grid, rowIndex, colIndex) {
//							proj_id = grid.getStore().getAt(rowIndex).get('proj_id');
//							file_id = grid.getStore().getAt(rowIndex).get('file_id');
//							Ext.getCmp('projid').setValue(proj_id);
//							Ext.getCmp('fid').setValue(file_id);
//							Ext.MessageBox.show({
//								title : 'Confirm',
//								msg : 'Are you sure you want to delete this?',
//								buttons : Ext.MessageBox.YESNO,
//								animateTarget : 'del',
//								fn : confirmChk,
//								icon : Ext.MessageBox.QUESTION
//							});
//						}
//					} ]
//				},
				],
		columnLines : true,
		plugins: [{
	        ptype: 'rowexpander',
	        rowBodyTpl : new Ext.XTemplate(
	        		'{proj_id:this.myTest}',
	        		{
	        			myTest: function(v){
		            		var myText = "";
		            		 store.projectsRef.each(function(rec){
//		            			 alert(rec.data.cus_id);
		            			 var myEuro = "";
		            			 var myDesc = "";
		            			 if(rec.data.proj_ref_desc != ""){
		            				 myDesc = rec.data.proj_ref_desc;
		            			 }else{
		            				 myDesc = "-";
		            			 }
//		            			 if(rec.data.currency == "USD"){
//		            				 myEuro = '€ '+(Math.round(((Math.round(rec.data.price*100)/100)*store.exchangeRates.getAt(0).data.EUR)*10000)/10000);
//		            					}else if(rec.data.currency == "EUR"){
//		            						myEuro = '€ '+(Math.round(rec.data.price*100)/100);
//		            					}else if(rec.data.currency == "THB"){
//		            						myEuro = '€ '+(Math.round(((Math.round(rec.data.price*100)/100)/store.exchangeRates.getAt(0).data.THB*store.exchangeRates.getAt(0).data.EUR)*10000)/10000);
//		            					}else if(rec.data.currency == "AUD"){
//		            						myEuro = '€ '+(Math.round(((Math.round(rec.data.price*100)/100)/store.exchangeRates.getAt(0).data.AUD*store.exchangeRates.getAt(0).data.EUR)*10000)/10000);
//		            					}else if(rec.data.currency == "GBP"){
//		            						myEuro = '€ '+(Math.round(((Math.round(rec.data.price*100)/100)/store.exchangeRates.getAt(0).data.GBP*store.exchangeRates.getAt(0).data.EUR)*10000)/10000);
//		            					}else if(rec.data.currency == "CHF"){
//		            						myEuro = '€ '+(Math.round(((Math.round(rec.data.price*100)/100)/store.exchangeRates.getAt(0).data.CHF*store.exchangeRates.getAt(0).data.EUR)*10000)/10000);
//		            					}else{
//		            						myEuro = '-';
//		            					}
		            			if(rec.data.proj_id == v){
		            				 myText += '<tr><td>Item: <b>'+rec.data.itm_name+'</b></td>'+
		            				 '<td>Time: <b>'+rec.data.time+'</b></td>'+
//		            				 '<td>Price: <b>'+(Math.round(rec.data.price*100)/100)+' '+rec.data.currency+'</b></td>'+
//		            				 '<td>Price(Euro): <b>'+myEuro+'</b></td>'+
		            				 '<td>Description: <b>'+myDesc+'</b></td></tr>';
		            			}
		            		})
		            		if(myText !== ""){
//		            			return "<table cellspacing=8 class=\"myTable\">"+myText+"</table>";
		            			return "<table cellspacing=8 bgcolor=#F0F0F0 class=\"myTable\">"+myText+"</table>";
		            		}else{
		            			return "<b>No Item Assign...</b>";
		            		}
		            	}
	        		}
	        )
	    }],
		bbar : Ext.create('Ext.PagingToolbar', {
			store : store.projects,
			displayInfo : true,
			displayMsg : 'Displaying Project {0} - {1} of {2}',
			emptyMsg : "No Project to display",
			plugins : Ext.create('Ext.ux.ProgressBarPager', {})
		})
	});

});

Ext.define('projRefModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'proj_ref_id',
		type : 'int'
	}, {
		name : 'proj_id',
		type : 'int'
	}, {
		name : 'itm_id',
		type : 'int'
	}, {
		name : 'cus_id',
		type : 'int'
	}, {
		name : 'file_id',
		type : 'int'
	}, {
		name : 'time',
		type : 'int'
	}, {
		name : 'price',
		type : 'float'
	}, {
		name : 'itm_name',
		type : 'string'
	}, {
		name : 'currency',
		type : 'string'
	}, {
		name : 'cus_name',
		type : 'string'
	}, {
		name : 'cus_code',
		type : 'string'
	}, {
		name : 'proj_ref_desc',
		type : 'string'
	}, {
		name : 'file_name',
		type : 'string'
	}

	]
});

store.projectsRef = Ext.create('Ext.data.JsonStore', {
	model : 'projRefModel',
	id : 'projRefStore',
//	pageSize : 9,
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'searchProjectsReference.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'proj_ref_id',
			totalProperty : 'total'
		}
	},
});

Ext.define('projModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'proj_id',
		type : 'int'
	}, {
		name : 'proj_name',
		type : 'string'
	}, {
		name : 'proj_desc',
		type : 'string'
	}, {
		name : 'cus_id',
		type : 'int'
	}, {
		name : 'file_id',
		type : 'int'
	}, {
		name : 'proj_count',
		type : 'int'
	}, {
		name : 'cus_name',
		type : 'string'
	}, {
		name : 'cus_code',
		type : 'string'
	}

	]
});

store.projects = Ext.create('Ext.data.JsonStore', {
	model : 'projModel',
	id : 'projStore',
	pageSize : 9,
//	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'searchProjects.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'proj_id',
			totalProperty : 'total'
		}
	},
	listeners: {
		'load' : function(){
			for(var xyz=0;xyz<store.projects.count();xyz++){
				if(Ext.fly(panels.grid.plugins[0].view.getNodes()[xyz]).hasCls(panels.grid.plugins[0].rowCollapsedCls) == true){
					panels.grid.plugins[0].toggleRow(xyz, panels.grid.getStore().getAt(xyz));
				}
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
		url : 'https://openexchangerates.org/api/latest.json?app_id=70ee2e9a9f814ea0a36bd0a00a11272c',
		reader : {
			type : 'json',
			root : 'rates',
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
        //...
    ]
});

editProject = new Ext.create('Ext.window.Window', {
	title : 'Edit Project',
	width : 420,
	height : 470,
	animateTarget : 'edit',
	modal : true,
	resizable : false,
	closeAction : 'hide',
	items : [ {
		xtype : 'form',
		id : 'editform',
		items:[{
        	xtype:'textfield',
        	margin: '20 0 0 30',
            allowBlank: false,
            fieldLabel: 'Project Name <font color="red">*</font> ',
            labelWidth: 120,
            width: 300,
            name: 'eproj_name',
            id: 'eproj_name',
            msgTarget: 'side',
            emptyText: 'Project Name'
        },{
			xtype : 'combobox',
			fieldLabel : 'Customer Name <font color="red">*</font> ',
			name : 'ecus_name',
			id: 'ecus_name',
			allowBlank: false,
			queryMode : 'local',
			labelWidth : 120,
			margin : '10 0 0 30',
			width : 300,
			emptyText : 'Customer Name',
			store : {
				fields : [ 'cus_id', 'cus_name', 'cus_code' ],
				proxy : {
					type : 'ajax',
					url : 'searchCustomer.htm',
					reader : {
						type : 'json',
						root : 'records',
						idProperty : 'cus_id'
					}
				},
				autoLoad : true
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
					Ext.getCmp('ccus_id').setValue(myId);
					Ext.getCmp('ccus_code').setValue(myValue);
					
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
			margin : '10 0 0 30',
			width : 300,
			emptyText : 'Customer Code',
			store : {
				fields : [ 'cus_id', 'cus_code', 'cus_name' ],
				proxy : {
					type : 'ajax',
					url : 'searchCustomer.htm',
					reader : {
						type : 'json',
						root : 'records',
						idProperty : 'cus_id'
					}
				},
				autoLoad : true
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
					Ext.getCmp('ccus_id').setValue(myId);
					Ext.getCmp('ccus_name').setValue(myValue);
					
					console.log("cus_name: "+myValue);
				}

			}
		},{
			xtype: 'combobox',
			fieldLabel : 'Item Name <font color="red">*</font> ',
			name : 'eitm_id',
			id : 'eitm_id',
			allowBlank: false,
			queryMode : 'local',
			labelWidth : 120,
			margin : '10 0 0 30',
			width : 300,
			emptyText : 'Item Name',
			store : {
				fields : [ 'itm_id', 'itm_name' ],
				proxy : {
					type : 'ajax',
					url : 'showItem.htm',
					reader : {
						type : 'json',
						root : 'records',
						idProperty : 'itm_id'
					}
				},
				autoLoad : true
			},
			valueField : 'itm_id',
			displayField : 'itm_name'
		},{
	    	xtype:'filefield',
	    	margin: '10 0 0 30',
	    	labelWidth: 120,
            width: 350,
	        fieldLabel: 'Briefing File ',
	        name: 'file',
	        id: 'efile',
	        msgTarget: 'side',
//	        allowBlank: false,
	        emptyText: 'Browse to change..',
	        listeners: {
                change: function(fld, value) {
                    var newValue = value.replace(/C:\\fakepath\\/g, '');
                    fld.setRawValue(newValue);
                }
            }
	    },{
	    	xtype:'numberfield',
	    	margin: '10 0 0 30',
	    	labelWidth: 120,
            width: 300,
	    	fieldLabel: 'Time(minutes) ',
	    	emptyText : 'Time in minutes',
	    	minValue : 0,
	    	msgTarget : 'under',
	    	name: 'etime',
	    	id: 'etime',
//	    	emptyText: 'java,art,animal,etc...'
	    },{
	    	xtype:'numberfield',
	    	margin: '10 0 0 30',
	    	labelWidth: 120,
            width: 300,
	    	fieldLabel: 'Price ',
	    	name: 'eprice',
	    	id: 'eprice',
	    	minValue : 0,
	    	msgTarget : 'under',
	    	emptyText : 'Project Price',
	    	listeners: {
	            change: function(field, value) {
	                if(value == null || value <= 0){
	                	Ext.getCmp('ecurrency').setValue("");
	                	Ext.getCmp('ecurrency').clearInvalid();
//	                	Ext.getCmp('ecurrency').setDisabled(true);
	                	Ext.getCmp('ecurrency').allowBlank = true;
	                }else{
	                	Ext.getCmp('ecurrency').markInvalid('Currency Required!');
	                	Ext.getCmp('ecurrency').allowBlank = false;
//	                	Ext.getCmp('ecurrency').setDisabled(false);
	                }
	            }
	        }
//	    	emptyText: 'java,art,animal,etc...'
	    },{
			xtype : 'combobox',
			fieldLabel : 'Currency ',
			name : 'ecurrency',
			id : 'ecurrency',
			queryMode : 'local',
			labelWidth : 120,
			margin : '10 0 0 30',
			width : 300,
			emptyText : 'Price Currency',
			editable : false,
			msgTarget : 'side',
			store : currency,
//			disabled : true,
			valueField : 'currency',
			displayField : 'name',
		},{
	    	xtype: 'textarea',
	    	margin: '10 0 20 30',
	    	labelWidth: 120,
            width: 300,
	    	fieldLabel: 'Project Detail',
	    	name: 'eproj_ref_desc',
	    	id: 'eproj_ref_desc',
	    	emptyText: 'Project Details'
	    },{
			xtype : 'hidden',
			id : 'ecus_id',
			name : 'ecus_id'
		},{
			xtype : 'hidden',
			id : 'eproj_ref_id',
			name : 'eproj_ref_id'
		},{
			xtype : 'hidden',
			id : 'efile_id',
			name : 'efile_id'
		}]
	} ],
	buttons : [
			{
				text : 'Reset',
				width : 100,
				handler : function() {
					Ext.getCmp('editform').getForm().reset();
				}
			},
			{
				text : 'Update',
				width : 100,
				id : 'ebtn',
				handler : function() {
					var form = Ext.getCmp('editform').getForm();
					if (form.isValid()) {
						form.submit({
							url : 'updateProjectsReference.htm',
							waitTitle : 'Update Project',
							waitMsg : 'Please wait...',
							standardSubmit : false,
							failure : function(form, action) {
								Ext.MessageBox.show({
									title : 'Information',
									msg : 'Project Has Been Update!',
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO,
									animateTarget : 'ebtn',
									fn : function() {
										editProject.hide();
										store.projectsRef.reload();
									}
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
			} ],
	listeners : {
		'beforehide' : function() {
			Ext.getCmp('editform').getForm().reset();
		}
	}
});

addItem = new Ext.create('Ext.window.Window', {
	title: 'Add Item',
    animateTarget: 'add',
    modal : true,
    resizable:false,
    width: 500,
    closeAction: 'hide',
    items :[{
    	xtype:'form',
        id:'addItemForm',
        items:[{
    		xtype:'fieldset',
            title: 'Item Information',
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
				xtype: 'combobox',
				fieldLabel : 'Item Name <font color="red">*</font> ',
				name : 'aitm_id',
				id : 'aitm_id',
				allowBlank: false,
				queryMode : 'local',
				labelWidth : 120,
				msgTarget: 'under',
				emptyText : 'Item Name',
				store : {
					fields : [ 'itm_id', 'itm_name' ],
					proxy : {
						type : 'ajax',
						url : 'showItem.htm',
						reader : {
							type : 'json',
							root : 'records',
							idProperty : 'itm_id'
						}
					},
					autoLoad : true
				},
				valueField : 'itm_id',
				displayField : 'itm_name'
			},{
    	    	xtype:'numberfield',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Time(minutes) ',
    	    	emptyText : 'Time in minutes',
    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	name: 'atime',
    	    	id: 'atime',
    	    },{
    	    	xtype:'numberfield',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Price ',
    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	name: 'aprice',
    	    	id: 'aprice',
    	    	emptyText : 'Project Price',
    	    	listeners: {
    	            change: function(field, value) {
    	                if(value == null || value <= 0){
    	                	Ext.getCmp('acurrency').clearInvalid();
    	                	Ext.getCmp('acurrency').allowBlank = true;
    	                }else{
    	                	Ext.getCmp('acurrency').markInvalid('Currency Required!');
    	                	Ext.getCmp('acurrency').allowBlank = false;
    	                }
    	            }
    	        }
//    	    	emptyText: 'java,art,animal,etc...'
    	    },{
				xtype : 'combobox',
				fieldLabel : 'Currency ',
				name : 'acurrency',
				id : 'acurrency',
				queryMode : 'local',
				labelWidth : 120,
				emptyText : 'Price Currency',
				editable : false,
				msgTarget : 'side',
				store : currency,
				valueField : 'currency',
				displayField : 'name',
			},{
    	    	xtype: 'textarea',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Item Detail',
    	    	name: 'aproj_ref_desc',
    	    	id: 'aproj_ref_desc',
    	    	emptyText: 'Item Details'
    	    }]
            }]},
            {
    				xtype : 'hidden',
    				id : 'aproj_id',
    				name : 'aproj_id'
            }],
            buttons:[{
            	text: 'Reset',
            	width:100,
            	handler: function(){
            		Ext.getCmp('addItemForm').getForm().reset();
            	}
            },{	
           		  text: 'Create',
          		  width:100,
          		  id: 'abtn',
                 handler: function(){
                	 var form = Ext.getCmp('addItemForm').getForm();
                	 if(form.isValid()){
        				 form.submit({
        				 url: 'createProjects.htm',
        				 waitTitle: 'Creating Project',
        				 waitMsg: 'Please wait...',
        				 standardSubmit: true,
                         failure: function(form, action) {
                        	 Ext.MessageBox.show({
          						title: 'Information',
          						msg: 'Project Has Been Created!',
          						buttons: Ext.MessageBox.OK,
          						icon: Ext.MessageBox.INFO,
          						animateTarget: 'abtn',
          						fn: function(){addProject.hide();}
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
               			Ext.getCmp('addItemForm').getForm().reset();
               		}
               	}
});

addProject = new Ext.create('Ext.window.Window', {
	title: 'Create Project',
    width: 500,
    animateTarget: 'icreate',
    modal : true,
    resizable:false,
    closeAction: 'hide',
    defaults: {
        anchor: '100%'
    },
    items :[{
            xtype:'form',
            id:'projectsform',
            items:[{
            	xtype:'fieldset',
                title: 'Project Information',
                collapsible: true,
                defaultType: 'textfield',
                layout: 'anchor',
                padding: 10,
                width:400,
                style: {
                    "margin-left": "auto",
                    "margin-right": "auto",
                    "margin-top": "10px",
                    "margin-bottom": "auto"
                },
                defaults: {
                    anchor: '100%'
                },
                items :[{
            	xtype:'textfield',
                allowBlank: false,
                fieldLabel: 'Project Name <font color="red">*</font> ',
                labelWidth: 120,
                name: 'cproj_name',
                id: 'cproj_name',
                msgTarget: 'under',
                emptyText: 'Project Name'
            },{
				xtype : 'combobox',
				fieldLabel : 'Customer Name <font color="red">*</font> ',
				name : 'ccus_name',
				id: 'ccus_name',
				allowBlank: false,
				queryMode : 'local',
				msgTarget: 'under',
				labelWidth : 120,
				emptyText : 'Customer Name',
				store : {
					fields : [ 'cus_id', 'cus_name', 'cus_code' ],
					proxy : {
						type : 'ajax',
						url : 'searchCustomer.htm',
						reader : {
							type : 'json',
							root : 'records',
							idProperty : 'cus_id'
						}
					},
					autoLoad : true
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
						Ext.getCmp('ccus_id').setValue(myId);
						Ext.getCmp('ccus_code').setValue(myValue);
						
						console.log("cus_code: "+myValue);
					}

				}
			}, {
				xtype : 'combobox',
				fieldLabel : 'Customer Code <font color="red">*</font> ',
				name : 'ccus_code',
				id : 'ccus_code',
				allowBlank: false,
				queryMode : 'local',
				labelWidth : 120,
				msgTarget: 'under',
				emptyText : 'Customer Code',
				store : {
					fields : [ 'cus_id', 'cus_code', 'cus_name' ],
					proxy : {
						type : 'ajax',
						url : 'searchCustomer.htm',
						reader : {
							type : 'json',
							root : 'records',
							idProperty : 'cus_id'
						}
					},
					autoLoad : true
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
						Ext.getCmp('ccus_id').setValue(myId);
						Ext.getCmp('ccus_name').setValue(myValue);
						
						console.log("cus_name: "+myValue);
					}

				}
			},{
    	    	xtype:'filefield',
    	    	labelWidth: 120,
    	        fieldLabel: 'Briefing File ',
    	        name: 'file',
    	        id: 'file',
    	        msgTarget: 'side',
    	        emptyText: 'Browse File...',
    	        listeners: {
                    change: function(fld, value) {
                        var newValue = value.replace(/C:\\fakepath\\/g, '');
                        fld.setRawValue(newValue);
                    }
                }
    	    },{
    	    	xtype: 'textarea',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Project Detail',
    	    	name: 'cproj_desc',
    	    	id: 'cproj_desc',
    	    	emptyText: 'Project Details'
    	    }]
            },{
            id: 'itmf',
    	    xtype:'fieldset',
            checkboxToggle:true,
            title: 'Item Information',
            defaultType: 'textfield',
            collapsed: true,
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
				xtype: 'combobox',
				fieldLabel : 'Item Name <font color="red">*</font> ',
				name : 'citm_id',
				id : 'citm_id',
//				allowBlank: false,
				queryMode : 'local',
				labelWidth : 120,
				msgTarget: 'under',
				emptyText : 'Item Name',
				store : {
					fields : [ 'itm_id', 'itm_name' ],
					proxy : {
						type : 'ajax',
						url : 'showItem.htm',
						reader : {
							type : 'json',
							root : 'records',
							idProperty : 'itm_id'
						}
					},
					autoLoad : true
				},
				valueField : 'itm_id',
				displayField : 'itm_name'
			},{
    	    	xtype:'numberfield',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Time(minutes) ',
    	    	emptyText : 'Time in minutes',
    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	name: 'ctime',
    	    	id: 'ctime',
    	    },{
    	    	xtype:'numberfield',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Price ',
    	    	minValue : 0,
    	    	msgTarget : 'under',
    	    	name: 'cprice',
    	    	id: 'cprice',
    	    	emptyText : 'Project Price',
    	    	listeners: {
    	            change: function(field, value) {
    	                if(value == null || value <= 0){
    	                	Ext.getCmp('ccurrency').clearInvalid();
    	                	Ext.getCmp('ccurrency').allowBlank = true;
    	                }else{
    	                	Ext.getCmp('ccurrency').markInvalid('Currency Required!');
    	                	Ext.getCmp('ccurrency').allowBlank = false;
    	                }
    	            }
    	        }
//    	    	emptyText: 'java,art,animal,etc...'
    	    },{
				xtype : 'combobox',
				fieldLabel : 'Currency ',
				name : 'ccurrency',
				id : 'ccurrency',
				queryMode : 'local',
				labelWidth : 120,
				emptyText : 'Price Currency',
				editable : false,
				msgTarget : 'side',
				store : currency,
				valueField : 'currency',
				displayField : 'name',
			},{
    	    	xtype: 'textarea',
    	    	labelWidth: 120,
    	    	fieldLabel: 'Item Detail',
    	    	name: 'cproj_ref_desc',
    	    	id: 'cproj_ref_desc',
    	    	emptyText: 'Item Details'
    	    }]
            },{
				xtype : 'hidden',
				id : 'ccus_id',
				name : 'ccus_id'
			}],
    }],
    buttons:[{
    	text: 'Reset',
    	width:100,
    	handler: function(){
    		Ext.getCmp('projectsform').getForm().reset();
    	}
    },{	
   		  text: 'Create',
  		  width:100,
  		  id: 'btn',
         handler: function(){
        	 var chkBox = Ext.getCmp('itmf').checkboxCmp.getValue();
        	 var form = Ext.getCmp('projectsform').getForm();
        	 if(chkBox){
        		 if(Ext.getCmp('citm_id').getValue() == null){
        			 Ext.getCmp('citm_id').markInvalid('Item Required!');
        		 }
        	 }else{
        		 Ext.getCmp('citm_id').clearInvalid();
        		 Ext.getCmp('citm_id').setValue('');
        		 Ext.getCmp('ctime').setValue('');
        		 Ext.getCmp('cprice').setValue('');
        		 Ext.getCmp('ccurrency').setValue('');
        		 Ext.getCmp('cproj_ref_desc').setValue('');
        	 }
        	 if(form.isValid()){
				 form.submit({
				 url: 'createProjects.htm',
				 waitTitle: 'Creating Project',
				 waitMsg: 'Please wait...',
				 standardSubmit: true,
                 failure: function(form, action) {
                	 Ext.MessageBox.show({
  						title: 'Information',
  						msg: 'Project Has Been Created!',
  						buttons: Ext.MessageBox.OK,
  						icon: Ext.MessageBox.INFO,
  						animateTarget: 'btn',
  						fn: function(){addProject.hide();}
  					});
                    }
      			});
        	 }else {
					Ext.MessageBox.show({
						title: 'Failed',
						msg: ' Please Insert All Required Field',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR,
						animateTarget: 'btn',
						fn: function(){
							if(chkBox){
								if(Ext.getCmp('citm_id').getValue() == null){
									Ext.getCmp('citm_id').markInvalid('Item Required!');
								}
							}
						}
					});
				}
		}
       	}],
       	listeners:{
       		'beforehide':function(){
       			Ext.getCmp('projectsform').getForm().reset();
       		}
       	}
	});


//addProject = new Ext.create('Ext.window.Window', {
//	title: 'Create Project',
//    width: 450,
//    height: 570,
//    animateTarget: 'icreate',
//    modal : true,
//    resizable:false,
//    closeAction: 'hide',
//    items :[{
//            xtype:'form',
//            id:'projectsform',
//            items:[{
//            	xtype:'textfield',
//            	margin: '20 0 0 30',
//                allowBlank: false,
//                fieldLabel: 'Project Name <font color="red">*</font> ',
//                labelWidth: 120,
//                width: 300,
//                name: 'cproj_name',
//                id: 'cproj_name',
//                msgTarget: 'side',
//                emptyText: 'Project Name'
//            },{
//				xtype : 'combobox',
//				fieldLabel : 'Customer Name <font color="red">*</font> ',
//				name : 'ccus_name',
//				id: 'ccus_name',
//				allowBlank: false,
//				queryMode : 'local',
//				labelWidth : 120,
//				margin : '10 0 0 30',
//				width : 300,
//				emptyText : 'Customer Name',
//				store : {
//					fields : [ 'cus_id', 'cus_name', 'cus_code' ],
//					proxy : {
//						type : 'ajax',
//						url : 'searchCustomer.htm',
//						reader : {
//							type : 'json',
//							root : 'records',
//							idProperty : 'cus_id'
//						}
//					},
//					autoLoad : true
//				},
//				valueField : 'cus_name',
//				displayField : 'cus_name',
//				listeners : {
//
//					select : function() {
//						
//						var v = this.getValue();
//						var record = this.findRecord(this.valueField || this.displayField, v);
//						var myIndex = this.store.indexOf(record);
//						var myValue = this.store.getAt(myIndex).data.cus_code;
//						var myId = this.store.getAt(myIndex).data.cus_id;
//						Ext.getCmp('ccus_id').setValue(myId);
//						Ext.getCmp('ccus_code').setValue(myValue);
//						
//						console.log("cus_code: "+myValue);
//					}
//
//				}
//			}, {
//				xtype : 'combobox',
//				fieldLabel : 'Customer Code <font color="red">*</font> ',
//				name : 'ccus_code',
//				id : 'ccus_code',
//				allowBlank: false,
//				queryMode : 'local',
//				labelWidth : 120,
//				margin : '10 0 0 30',
//				width : 300,
//				emptyText : 'Customer Code',
//				store : {
//					fields : [ 'cus_id', 'cus_code', 'cus_name' ],
//					proxy : {
//						type : 'ajax',
//						url : 'searchCustomer.htm',
//						reader : {
//							type : 'json',
//							root : 'records',
//							idProperty : 'cus_id'
//						}
//					},
//					autoLoad : true
//				},
//				valueField : 'cus_code',
//				displayField : 'cus_code',
//				listeners : {
//
//					select : function() {
//						
//						var v = this.getValue();
//						var record = this.findRecord(this.valueField || this.displayField, v);
//						var myIndex = this.store.indexOf(record);
//						var myValue = this.store.getAt(myIndex).data.cus_name;
//						var myId = this.store.getAt(myIndex).data.cus_id;
//						Ext.getCmp('ccus_id').setValue(myId);
//						Ext.getCmp('ccus_name').setValue(myValue);
//						
//						console.log("cus_name: "+myValue);
//					}
//
//				}
//			},{
//    	    	xtype:'filefield',
//    	    	margin: '10 0 0 30',
//    	    	labelWidth: 120,
//                width: 350,
//    	        fieldLabel: 'Briefing File ',
//    	        name: 'file',
//    	        id: 'file',
//    	        msgTarget: 'side',
////    	        allowBlank: false,
//    	        emptyText: 'Browse File...',
//    	        listeners: {
//                    change: function(fld, value) {
//                        var newValue = value.replace(/C:\\fakepath\\/g, '');
//                        fld.setRawValue(newValue);
//                    }
//                }
//    	    },{
//    	    	xtype: 'textarea',
//    	    	margin: '10 0 20 30',
//    	    	labelWidth: 120,
//                width: 300,
//    	    	fieldLabel: 'Project Detail',
//    	    	name: 'cproj_desc',
//    	    	id: 'cproj_desc',
//    	    	emptyText: 'Project Details'
//    	    },{
//				xtype: 'combobox',
//				fieldLabel : 'Item Name <font color="red">*</font> ',
//				name : 'citm_id',
//				id : 'citm_id',
//				allowBlank: false,
//				queryMode : 'local',
//				labelWidth : 120,
//				margin : '10 0 0 30',
//				width : 300,
//				emptyText : 'Item Name',
//				store : {
//					fields : [ 'itm_id', 'itm_name' ],
//					proxy : {
//						type : 'ajax',
//						url : 'showItem.htm',
//						reader : {
//							type : 'json',
//							root : 'records',
//							idProperty : 'itm_id'
//						}
//					},
//					autoLoad : true
//				},
//				valueField : 'itm_id',
//				displayField : 'itm_name'
//			},{
//    	    	xtype:'numberfield',
//    	    	margin: '10 0 0 30',
//    	    	labelWidth: 120,
//                width: 300,
//    	    	fieldLabel: 'Time(minutes) ',
//    	    	emptyText : 'Time in minutes',
//    	    	minValue : 0,
//    	    	msgTarget : 'under',
//    	    	name: 'ctime',
//    	    	id: 'ctime',
////    	    	emptyText: 'java,art,animal,etc...'
//    	    },{
//    	    	xtype:'numberfield',
//    	    	margin: '10 0 0 30',
//    	    	labelWidth: 120,
//                width: 300,
//    	    	fieldLabel: 'Price ',
//    	    	minValue : 0,
//    	    	msgTarget : 'under',
//    	    	name: 'cprice',
//    	    	id: 'cprice',
//    	    	emptyText : 'Project Price',
//    	    	listeners: {
//    	            change: function(field, value) {
//    	                if(value !== null){
//    	                	Ext.getCmp('ccurrency').markInvalid('Currency Required!');
//    	                	Ext.getCmp('ccurrency').allowBlank = false;
//    	                }else{
//    	                	Ext.getCmp('ccurrency').clearInvalid();
//    	                	Ext.getCmp('ccurrency').allowBlank = true;
//    	                }
//    	            }
//    	        }
////    	    	emptyText: 'java,art,animal,etc...'
//    	    },{
//				xtype : 'combobox',
//				fieldLabel : 'Currency ',
//				name : 'ccurrency',
//				id : 'ccurrency',
//				queryMode : 'local',
//				labelWidth : 120,
//				margin : '10 0 0 30',
//				width : 300,
//				emptyText : 'Price Currency',
//				editable : false,
//				msgTarget : 'side',
//				store : currency,
//				valueField : 'currency',
//				displayField : 'name',
//			},{
//    	    	xtype: 'textarea',
//    	    	margin: '10 0 20 30',
//    	    	labelWidth: 120,
//                width: 300,
//    	    	fieldLabel: 'Item Detail',
//    	    	name: 'cproj_ref_desc',
//    	    	id: 'cproj_ref_desc',
//    	    	emptyText: 'Item Details'
//    	    },{
//				xtype : 'hidden',
//				id : 'ccus_id',
//				name : 'ccus_id'
//			}],
//    }],
//    buttons:[{
//    	text: 'Reset',
//    	width:100,
//    	handler: function(){
//    		Ext.getCmp('projectsform').getForm().reset();
//    	}
//    },{	
//   		  text: 'Create',
//  		  width:100,
//  		  id: 'btn',
//         handler: function(){
////        	 var desc = Ext.getCmp('desc1').getValue();
////        	 var comment = Ext.getCmp('comment1').getValue();
//        	 var form = Ext.getCmp('projectsform').getForm();
//        	 if(form.isValid()){
//				 form.submit({
//				 url: 'createProjects.htm',
//				 waitTitle: 'Creating Project',
//				 waitMsg: 'Please wait...',
//				 standardSubmit: true,
//                 failure: function(form, action) {
//                	 Ext.MessageBox.show({
//  						title: 'Information',
//  						msg: 'Project Has Been Created!',
//  						buttons: Ext.MessageBox.OK,
//  						icon: Ext.MessageBox.INFO,
//  						animateTarget: 'btn',
//  						fn: function(){addProject.hide();}
//  					});
//                    }
//      			});
//        	 }else {
//					Ext.MessageBox.show({
//						title: 'Failed',
//						msg: ' Please Insert All Required Field',
//						buttons: Ext.MessageBox.OK,
//						icon: Ext.MessageBox.ERROR,
//						animateTarget: 'btn',
//					});
//				}
//		}
//       	}],
//       	listeners:{
//       		'beforehide':function(){
//       			Ext.getCmp('projectsform').getForm().reset();
//       		}
//       	}
//	});

function confirmChk(btn) {
	if (btn == "yes") {
		Ext.Ajax
				.request({
					url : 'deleteProjects.htm',
					params : {
						id : Ext.getCmp('projid').getValue(),
						fid : Ext.getCmp('fid').getValue()
					},
					success : function(response, opts) {
						// window.location = "memberManagement.htm";
						store.projectsRef.reload();
						store.projects.reload();
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

function combinecols(value, meta, record, rowIndex, colIndex, store) {
	if(record.get('currency') !== ""){
		return record.get('currency')+": "+(Math.round(record.get('price')*100)/100);
	}else{
		return record.get('price');
	}
}

function combinecols2(value, meta, record, rowIndex, colIndex, store) {
    return record.get('cus_name')+' - '+record.get('cus_code');
}

function renderTime(value, meta, record, rowIndex, colIndex, store) {
    return record.get('time')+' mins';
} 

function currencyToEuro(value, meta, record, rowIndex, colIndex) {
	if(record.get('currency') == "USD"){
    return '€ '+(Math.round(((Math.round(record.get('price')*100)/100)*store.exchangeRates.getAt(0).data.EUR)*10000)/10000);
	}else if(record.get('currency') == "EUR"){
		return '€ '+(Math.round(record.get('price')*100)/100);
	}else if(record.get('currency') == "THB"){
		return '€ '+(Math.round(((Math.round(record.get('price')*100)/100)/store.exchangeRates.getAt(0).data.THB*store.exchangeRates.getAt(0).data.EUR)*10000)/10000);
	}else if(record.get('currency') == "AUD"){
		return '€ '+(Math.round(((Math.round(record.get('price')*100)/100)/store.exchangeRates.getAt(0).data.AUD*store.exchangeRates.getAt(0).data.EUR)*10000)/10000);
	}else if(record.get('currency') == "GBP"){
		return '€ '+(Math.round(((Math.round(record.get('price')*100)/100)/store.exchangeRates.getAt(0).data.GBP*store.exchangeRates.getAt(0).data.EUR)*10000)/10000);
	}else if(record.get('currency') == "CHF"){
		return '€ '+(Math.round(((Math.round(record.get('price')*100)/100)/store.exchangeRates.getAt(0).data.CHF*store.exchangeRates.getAt(0).data.EUR)*10000)/10000);
	}else{
		return '-';
	}
} 