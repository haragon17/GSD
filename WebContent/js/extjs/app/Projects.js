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
								Ext.getCmp('cusid').setValue(myId);
								Ext.getCmp('scus_code').setValue(myValue);
								
								console.log("cus_code: "+myValue);
							},
							blur : function() {
								var v = this.getValue();
								var record = this.findRecord(this.valueField || this.displayField, v);
								if(record == false){
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
								Ext.getCmp('cusid').setValue(myId);
								Ext.getCmp('scus_name').setValue(myValue);
								
								console.log("cus_name: "+myValue);
							},
							blur : function() {
								var v = this.getValue();
								var record = this.findRecord(this.valueField || this.displayField, v);
								if(record == false){
									Ext.getCmp('cusid').setValue("");
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
							url : 'showItem.htm?id=0',
							reader : {
								type : 'json',
								root : 'records',
								idProperty : 'itm_id'
							}
						},
						autoLoad : true
					},
					valueField : 'itm_id',
					displayField : 'itm_name',
					listeners : {
						blur : function() {
							var v = this.getValue();
							var record = this.findRecord(this.valueField || this.displayField, v);
							if(record == false){
								Ext.getCmp('sitm_id').setValue("");
							}
						}
					}
				}, 
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
						url : 'searchProjectsParam.htm?cus_id='+Ext.getCmp('cusid').getValue() + getParamValues(),
						success : function(response, opts) {
							store.projectsRef.reload();
							store.projects.loadPage(1);
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
		style : {
			"margin-left" : "auto",
			"margin-right" : "auto",
			"margin-top" : "15px",
			"margin-bottom" : "15px"
		},
		width : 1200,
		height : 500,
		columns : [
				{
					text : "Project Name",
					flex : 1.5,
					sortable : true,
					dataIndex : 'proj_name'
				},
				{
					text : "Customer Name",
					flex : 1.5,
					sortable : true,
					dataIndex : 'cus_name'
				},
				{
					text : "Project Description",
					flex : 2,
					sortable : true,
					dataIndex : 'proj_desc'
				},
				{
					text : 'Briefing',
					flex : 0.5,
					xtype : 'actioncolumn',
					align : 'center',
					id : 'open',
					items : [{
						getClass: function(v, meta, rec) {
							
							if(rec.get('file_id') != 0){
								this.items[0].tooltip = 'd1';
								return 'icon-d1';
							} else {
								this.items[0].tooltip = 'd2';
								
								return 'icon-d2';
							}
							
						},
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
		            			if(rec.data.proj_id == v){
		            				var topix_id = "";
		            				if(rec.data.topix_article_id == "" || rec.data.topix_article_id == null){
		            					topix_id = "-";
		            				}else{
		            					topix_id = rec.data.topix_article_id;
		            				}
		            				 myText += '<tr><td bgcolor=#F0F0F0>Topix ID: <b>'+topix_id+'</b></td>'+ 
			            			 '<td bgcolor=#F0F0F0>Item: <b>'+rec.data.itm_name+'</b></td>'+
		            				 '<td>Target Time: <b>'+(Math.round(rec.data.time*100)/100)+'</b></td>'+
		            				 '<td>Actual Time: <b>'+(Math.round(rec.data.actual_time*100)/100)+'</b></td></tr>';
//		            				 '<td>Description: <b>'+myDesc+'</b></td></tr>';
		            			}
		            		})
		            		if(myText !== ""){
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
		type : 'float'
	}, {
		name : 'time',
		type : 'float'
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
	}, {
		name : 'actual_time',
		type : 'int'
	}, {
		name : 'topix_article_id',
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
