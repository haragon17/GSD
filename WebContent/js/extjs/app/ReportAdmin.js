var panels = {};
var errMSG = errMessage;
var store = {};
var plugins = {};
var selModels = {};
var grids = {};

Ext.onReady(function(){  
    Ext.tip.QuickTipManager.init();
    console.debug("Main Panel Created...");

    panels.createReport = Ext.create('Ext.form.Panel', {
	    title: 'Search Criteria',       
        autoWidth: true,
        id:'formPanel',
	    width: 900,
	    height: 200,
	    collapsible:true,
	    renderTo: document.body,
	    style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "30px"
        },
	    layout:'column',
	    fieldDefaults: {
	        labelAlign: '',
	        msgTarget: 'side'
	    },
	    defaults : {
	        xtype:'container',
	        layout: 'form',
	        columnWidth: 1,
	        labelWidth: 0,
	        anchor:'100%',
	        hideBorders : false,
	        padding : '10 10 10 10'
	    },

	    items: [{
	        layout:'column',
	        border:false,
	        items:[{
	            columnWidth:0.62,
	            border:false,
	            layout: 'anchor',
	            style: {
	                "margin-left": "50px",
	                "margin-right": "auto",
	                "margin-top": "10px",
	                "margin-bottom": "10px"
	            },
	            defaultType: 'textfield',
	            items: [{
	                fieldLabel: 'Name ',
	                name: 'name',
	                labelWidth: 100,
	                margin: '0 0 10 0',
	                width: 340,
	                listeners: {
		          		  specialkey: function(field, e){
		          			  if (e.getKey() == e.ENTER) {
		          			  searchs.click();
		          			  }
		          		  }
		              }
	            	},{ ////// field create date
		            	xtype: 'fieldcontainer',
		                fieldLabel: 'Created Date ',
		                combineErrors: true,
		                msgTarget : 'side',
		                labelWidth : 100,
		                margin: '0 0 10 0',
		                layout: 'hbox',
		                defaults: {
		                    flex: 1,
		                },
		                items: [
		                    {
		                        xtype     : 'datefield',
		                        name      : 'screate',
		                        id	: 'start',
		                        labelSeparator : '',
		                        margin: '0 0 0 0',
		                        width: 50,
		                        editable: false,
		                        format: 'Y-m-d',
		                        listeners: {
		                        	"blur": function () {
		                        		   	var startDate = Ext.getCmp('start').getRawValue();
		                           			Ext.getCmp('end').setMinValue(startDate);
		                        	}
		                        }
		                    },{
		                    	 xtype: 'fieldcontainer',
		     	                fieldLabel: 'To ',
		     	                combineErrors: true,
		     	                msgTarget : 'side',
		     	                margin: '0 -20 0 5',
		                    	labelSeparator : '',
		                        Width : 20
		                    },
		                    {
		                        xtype     : 'datefield',
		                        margin: '0 150 0 -70',	
		                        name      : 'ecreate',
		                        id	: 'end',
		                        labelSeparator : '',
		                        width: 80,
		                        editable: false,
		                        format: 'Y-m-d',
		                        listeners: {
		                        	"blur": function () {
		                        		   	var endDate = Ext.getCmp('end').getRawValue();
		                           			Ext.getCmp('start').setMaxValue(endDate);
		                        	}
		                        }
		                    }
		                ]
		              },{///field update date
			                xtype: 'fieldcontainer',
			                fieldLabel: 'Updated Date ',
			                combineErrors: true,
			                msgTarget : 'side',
			                labelWidth : 100,
			                margin: '0 0 10 0',
			                layout: 'hbox',
			                defaults: {
			                    flex: 1,
			                },
			                items: [
			                    {
			                        xtype     : 'datefield',
			                        name      : 'supdate',
			                        id	: 'startDate',
			                        labelSeparator : '',
			                        margin: '0 0 0 0',
			                        width: 100,
			                        editable: false,
			                        format: 'Y-m-d',
			                        listeners: {
			                        	   "blur": function () {
			                        		   			var startDate = Ext.getCmp('startDate').getRawValue();
			                        		   			Ext.getCmp('endDate').setMinValue(startDate);
			                        	   }
			                        }
			                    },{
			                    	 xtype: 'fieldcontainer',
			     	                fieldLabel: 'To ',
			     	                combineErrors: true,
			     	                msgTarget : 'side',
			     	                margin: '0 -20 0 5',
			                    	labelSeparator : '',
			                        Width : 20
			                    },
			                    {
			                        xtype     : 'datefield',
			                        margin: '0 150 0 -70',	
			                        name      : 'eupdate',
			                        id	: 'endDate',
			                        labelSeparator : '',
			                        width: 100,
			                        editable: false,
			                        format: 'Y-m-d',
			                        listeners: {
			                        	"blur": function () {
			                        		   	var endDate = Ext.getCmp('endDate').getRawValue();
			                           			Ext.getCmp('startDate').setMaxValue(endDate);
			                        	}
			                        }
			                    }
			                ]
			              }
	            ]
	        },{
	            columnWidth: 0.36,
	            style: {
	                "margin-left": "-80px",
	                "margin-right": "10px",
	                "margin-top": "10px",
	            },
	            border:false,
	            layout: 'anchor',
	            defaultType: 'textfield',
	            items:[ {
	    	    	xtype:'combobox',
	    	    	labelWidth: 80,
	    	    	margin: '0 0 10 0',
	                width: 300,
	    	        fieldLabel: 'Category 1',
	    	        name: 'cate1',
	    	        id: 'cate1',
	    	        msgTarget: 'side',
	    	        emptyText: 'Category 1',
	    	        queryMode: 'local',
	    	        store: {
	    		 		fields: [ 'cate_id','cate_desc' ],
	    		         proxy: {
	    		         	type: 'ajax',
	    		         	url: 'showCate1.htm',
	    		         	reader: {
	    		             type: 'json',
	    		             root: 'records',
	    		             idProperty: 'cate_id'
	    		         }
	    		       },
	    		       autoLoad: true
	    		 	},
	    		 	valueField: 'cate_id',
	    		 	displayField: 'cate_desc',
	    		 	listeners: {
	    		 		
	    		        select: function(v){ 
	    		        	var cateId = Ext.getCmp('cate1').getValue();
	    		        	var cate2 = Ext.getCmp('cate2');
	    		        	var cate3 = Ext.getCmp('cate3');
	    		        	
//	    		        	cate2.setDisabled(false);
	    		        	cate2.clearValue();
	    		        	cate2.getStore().removeAll();
	    		        	cate3.getStore().removeAll();
//	    		        	cate3.setDisabled(true);
	    		        	cate3.clearValue();
	    		        	cate2.getStore().load({
	    		        		url: 'showCate2.htm?id='+cateId
	    					});
	    		        	console.log('Select Value = ['+cateId+']');
	    		        }
	    			
	    		    }
	    	    },{
	    	    	xtype:'combobox',
//	    	    	disabled:true,
	    	    	labelWidth: 80,
	                width: 300,
	                margin: '0 0 10 0',
	    	        fieldLabel: 'Category 2',
	    	        name: 'cate2',
	    	        id: 'cate2',
	    	        msgTarget: 'side',
	    	        emptyText: 'Category 2',
	    	        store: {
	    		 		fields: [ 'cate_id', 'cate_desc' ],
	    		         proxy: {
	    		        	 url:'',
	    		         	type: 'ajax',
	    		         	reader: {
	    			                type: 'json',
	    			                root: 'records2',
	    			                idProperty: 'cate_id'
	    			            }
	    					},
	    					autoLoad: false
	    		 	},
	    		 	valueField: 'cate_id',
	    		 	displayField: 'cate_desc',
	    		 	listeners: {
	    		 		
	    		        select: function(v){ 
	    		        	var cateId = Ext.getCmp('cate2').getValue();
	    		        	var cate3 = Ext.getCmp('cate3');
	    		        	
//	    		        	cate3.setDisabled(false);
	    		        	cate3.clearValue();
	    		        	cate3.getStore().removeAll();
	    		        	cate3.getStore().load({
	    		        		url: 'showCate3.htm?id='+cateId
	    					});
	    		        	console.log('Select Value = ['+cateId+']');
	    		        }
	    			
	    		    }
	    	    },{
	    	    	xtype:'combobox',
//	    	    	disabled:true,
	    	    	labelWidth: 80,
	                width: 300,
	                margin: '0 0 10 0',
	    	        fieldLabel: 'Category 3',
	    	        name: 'cate3',
	    	        id: 'cate3',
	    	        msgTarget: 'side',
	    	        emptyText: 'Category 3',
	    	        store: {
	    		 		fields: [ 'cate_id', 'cate_desc' ],
	    		         proxy: {
	    		        	 url:'',
	    		         	type: 'ajax',
	    		         	reader: {
	    			                type: 'json',
	    			                root: 'records3',
	    			                idProperty: 'cate_id'
	    			            }
	    					},
	    					autoLoad: false
	    		 	},
	    		 	valueField: 'cate_id',
	    		 	displayField: 'cate_desc',
	    	    }
		              ]
	        }]
	    }],
	    
	    buttons: [{
	        text: 'Search',  
	        id: 'searchs',
	        handler : function() {
	        	var form = this.up('form').getForm();
	        	
	        	if (form.isValid()) {
	        		Ext.getCmp('printer').setDisabled(false);
	        		Ext.Ajax.request({
	        			url : 'searchReportParam.htm'+getParamValues(),
	        			success: function(response, opts){
	        				store.searchReport.loadPage(1);
	        			}
	        		});
					
				} else {
					console.debug("ReportAdmin.js Else conditions");
				}
			}
	    }
	    ,{
	        text: 'Reset',
	        handler: function() {
	            this.up('form').getForm().reset();
	            Ext.getCmp('startDate').setMaxValue("");
	            Ext.getCmp('endDate').setMinValue("");
	            Ext.getCmp('start').setMaxValue("");
	            Ext.getCmp('end').setMinValue("");
	        }
	    }]
	     
	});
    
    grids.grid = Ext.create('Ext.grid.Panel', {
    	title: 'Report',
        //selModel: selModels.selModel,
    	store: store.searchReport,
        columnLines: true,
    	split: true,
    	forceFit: true,
    	loadMask: true,
        autoWidth: true,
        autoHeight: true,
        frame:true,
        width: 900,
        height: 350,
        style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "10px",
            "margin-bottom": "auto"
        } ,  
        tools:[{
			iconCls: 'icon-printer',
			id: 'printer',
			xtype:'button',
			disabled : true,
	        text: 'Generate Reports',
	        scope: this,
	        handler: function(){
	        	var form = Ext.getCmp('formPanel').getForm();
	        	if (form.isValid()) {
                    
                	console.debug("Valid genarate form...");
                	
                    form.submit({
                    	target : '_blank',
                        url: 'printReport.htm',
                        method: 'POST',
                        reset: true,
                        standardSubmit: true,
                    });
                }
	        }
	    }],
        columns: [
                  {text: "Workings Name", width: 180,dataIndex: 'wrk_name'},
                  {text: "Category 1", 	width: 120,dataIndex: 'cate1'},
                  {text: "Category 2", 	width: 120,dataIndex: 'cate2'},
                  {text: "Category 3", 	width: 120,dataIndex: 'cate3'},
    			  {text: "Created By", 	width: 140,dataIndex: 'usr_name'},
    			  {text: "Created Date", width: 120,dataIndex: 'cretd_date'},
    			  {text: "Updated Date", width: 120,dataIndex: 'update_date'},
		],
		renderTo: document.body,
        bbar: Ext.create('Ext.PagingToolbar', {
        	store: store.searchReport,
            displayInfo: true,
            displayMsg: 'Displaying Workings {0} - {1} of {2}',
            emptyMsg: "No Workings to display",
            plugins: Ext.create('Ext.ux.ProgressBarPager', {})
        }),
		    });
    
}); //End onReady
Ext.define('prm', {
	  extend: 'Ext.data.Model',
	  fields: [
			{name: 'wrk_name',         type: 'string'},     
			{name: 'cate1',   type: 'string'},
			{name: 'cate2',	 type: 'string'},
			{name: 'cate3',     type: 'string'},
			{name: 'usr_name',    type: 'string'},
			{name: 'cretd_date', type: 'string'},
			{name: 'update_date',	 type: 'string'},
	   ]
	});
	//JSON Store
	store.searchReport = Ext.create('Ext.data.JsonStore',{
	  // store configs
	  model: 'prm',
	  storeId: 'srchStore',
	  pageSize: 10,
	  autoLoad: false,
	  autoDestroy: true,
	//remoteSort: true,
	  proxy: {
		  method: 'GET',
	      type: 'ajax',
	      url: 'searchReport.htm',
	      reader: {
	          type: 'json',
	          root: 'records',
	          totalProperty: 'total'
	      }
	  }
	});

function getParamValues(){
	var url = "";
	var param = "";
	var prefix = "?";
	var queryStr = "";
	var i = 1;
	var count = 0;
	
	for(param in panels.createReport.getValues()){
		
		count+=panels.createReport.getValues()[param].length;
		
		if(i==1){
			queryStr+=param+"="+panels.createReport.getValues()[param];
		}else{
			queryStr+="&"+param+"="+panels.createReport.getValues()[param];
		}
				
		i++;
	}
	
	if(count==0){
		url = "";
	}else{
		url = prefix+queryStr;
	}
	
	return encodeURI(url);
}