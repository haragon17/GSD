store= {};

Ext.onReady(function(){
	
	Ext.apply(Ext.form.field.VTypes, {
	    eng: function(val, field) {
	        var reg= /^[0-9, -a-z]/i;
	        return reg.test(val);
	    },
	    engText: 'Must be english',
	    engMask: /^[0-9, -a-z]/i
	});
	
	wrkid = new Ext.form.Hidden({
		name: 'wrkid',
		id: 'wrkid'
	});
	
	fid = new Ext.form.Hidden({
		name: 'fid',
		id: 'fid'
	});
	
	 head = Ext.create('Ext.form.Panel', {
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
		            	},{
			                fieldLabel: 'Create By ',
			                name: 'cname',
			                labelWidth: 100,
			                margin: '0 0 10 0',
			                width: 340,
			                
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
		    		        	
//		    		        	cate2.setDisabled(false);
		    		        	cate2.clearValue();
		    		        	cate2.getStore().removeAll();
		    		        	cate3.getStore().removeAll();
//		    		        	cate3.setDisabled(true);
		    		        	cate3.clearValue();
		    		        	cate2.getStore().load({
		    		        		url: 'showCate2.htm?id='+cateId
		    					});
		    		        	console.log('Select Value = ['+cateId+']');
		    		        }
		    			
		    		    }
		    	    },{
		    	    	xtype:'combobox',
//		    	    	disabled:true,
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
		    		        	
//		    		        	cate3.setDisabled(false);
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
//		    	    	disabled:true,
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
		        		
		        		Ext.Ajax.request({
		        			url : 'searchWorkingsParam.htm'+getParamValues(),
		        			success: function(response, opts){
		        				store.wrk.loadPage(1);
		        			}
		        		});
						
					} else {
						console.debug("WorkingsAdmin.js Else conditions");
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
	    
	
	Ext.create('Ext.grid.Panel', {
		renderTo: document.body,
		title: 'Workings',
		split: true,
		forceFit: true,
		loadMask: true,
	    autoWidth: true,
	    frame:true,
	    store: store.wrk,
//	    tools:[{
//	    	xtype:'button',
//	    	text:'Create',
//	    	id:'icreate',
//	    	iconCls:'icon-add',
//	    	handler: function(){
//	    		createWorkings.show();
//	    	}
//	    }],
	    style: {
	          "margin-left": "auto",
	          "margin-right": "auto",
		          "margin-top": "10px",
	          "margin-bottom": "auto"
	      },
	    width: 900,
	    height: 350,   
	    columns: [
	        {text: "Name",		   width: 150, sortable: true, dataIndex:'wrk_name' },
	        {text: "Category 1",      width: 100, sortable: true, dataIndex:'cateDesc1'},
	        {text: "Category 2",      width: 100, sortable: true, dataIndex:'cateDesc2'},
	        {text: "Category 3",      width: 100, sortable: true, dataIndex:'cateDesc3'},
	        {text: 'Details',   xtype: 'actioncolumn', width: 60,  align: 'center', id: 'dtl',
	            items: [{ iconCls: 'book-view', 
	            	handler: function(grid, rowIndex, colIndex) {
	            		 wrk_id = grid.getStore().getAt(rowIndex).get('wrk_id');
	            		 wrk_name = grid.getStore().getAt(rowIndex).get('wrk_name');
	            		 cate1 = grid.getStore().getAt(rowIndex).get('cateDesc1');
	            		 cate2 = grid.getStore().getAt(rowIndex).get('cateDesc2');
	            		 cate3 = grid.getStore().getAt(rowIndex).get('cateDesc3');
	            		 wrk_dtl = grid.getStore().getAt(rowIndex).get('wrk_dtl');
	            		 keyword = grid.getStore().getAt(rowIndex).get('keyword');
	            		 fname = grid.getStore().getAt(rowIndex).get('file_name');
	            		 fid = grid.getStore().getAt(rowIndex).get('file_id');
	            		 
	            		 if(cate1 == ""){
	            			 cate1 = "-";
	            		 }
	            		 if(cate2 == ""){
	            			 cate2 = "-";
	            		 }
	            		 if(cate3 == ""){
	            			 cate3 = "-";
	            		 }
	            		 if(wrk_dtl == ""){
	            			 wrk_dtl = "-";
	            		 }
	            		 if(keyword == ""){
	            			 keyword = "-";
	            		 }
	            		 
	            		 Ext.getCmp('vname').setText(wrk_name);
	            		 Ext.getCmp('vcate1').setText(cate1);
	            		 Ext.getCmp('vcate2').setText(cate2);
	            		 Ext.getCmp('vcate3').setText(cate3);
	            		 Ext.getCmp('vdetails').setText(wrk_dtl);
	            		 Ext.getCmp('vkeyword').setText(keyword);
	            		 Ext.getCmp('vfile').setText(fname);
	            		 viewWorkings.show();
	            		 }
	            }]
	           },
	           {text: 'Edit',   xtype: 'actioncolumn', width: 60,  align: 'center', id: 'edit',
		            items: [{ iconCls: 'icon-edit', 
		            	handler: function(grid, rowIndex, colIndex) {
		            		 wrk_id = grid.getStore().getAt(rowIndex).get('wrk_id');
		            		 wrk_name = grid.getStore().getAt(rowIndex).get('wrk_name');
		            		 cate1 = grid.getStore().getAt(rowIndex).get('cate_lv1');
		            		 cate2 = grid.getStore().getAt(rowIndex).get('cate_lv2');
		            		 cate3 = grid.getStore().getAt(rowIndex).get('cate_lv3');
		            		 wrk_dtl = grid.getStore().getAt(rowIndex).get('wrk_dtl');
		            		 keyword = grid.getStore().getAt(rowIndex).get('keyword');
		            		 fname = grid.getStore().getAt(rowIndex).get('file_name');
		            		 fid = grid.getStore().getAt(rowIndex).get('file_id');
		            		 
		            		 if(cate1 == 0){
		            			 	var ecate1 = Ext.getCmp('cate1');
			    		        	var ecate2 = Ext.getCmp('cate2');
			    		        	var ecate3 = Ext.getCmp('cate3');
			    		        	
			    		        	ecate1.clearValue();
			    		        	ecate2.clearValue();
			    		        	ecate3.clearValue();
			    		        	ecate1.getStore().removeAll();
			    		        	ecate2.getStore().removeAll();
			    		        	ecate3.getStore().removeAll();
		            		 }else if(cate2 == 0){
		            			 Ext.getCmp('ecate1').setValue(cate1);
		            			 var cateId = Ext.getCmp('ecate1').getValue();
			    		         var ecate2 = Ext.getCmp('ecate2');
			    		         var ecate3 = Ext.getCmp('ecate3');
			    		        	
			    		        	ecate2.clearValue();
			    		        	ecate2.getStore().removeAll();
			    		        	ecate3.getStore().removeAll();
			    		        	ecate3.clearValue();
			    		        	ecate2.getStore().load({
			    		        		url: 'showCate2.htm?id='+cateId
			    					});
		            		 }else if(cate3 == 0){
		            			 Ext.getCmp('ecate1').setValue(cate1);
		            			 var cateId = Ext.getCmp('ecate1').getValue();
			    		         var ecate2 = Ext.getCmp('ecate2');
			    		         var ecate3 = Ext.getCmp('ecate3');
			    		        	
			    		        	ecate2.clearValue();
			    		        	ecate2.getStore().removeAll();
			    		        	ecate3.getStore().removeAll();
			    		        	ecate3.clearValue();
			    		        	ecate2.getStore().load({
			    		        		url: 'showCate2.htm?id='+cateId
			    					});
			    		        
			    		        	Ext.getCmp('ecate2').setValue(cate2);
			    		        
			    		        	ecate3.getStore().load({
			    		        		url: 'showCate3.htm?id='+cate2
			    		        	});
		            		 }else{
		            			 Ext.getCmp('ecate1').setValue(cate1);
		            			 var cateId = Ext.getCmp('ecate1').getValue();
			    		         var ecate2 = Ext.getCmp('ecate2');
			    		         var ecate3 = Ext.getCmp('ecate3');
			    		        	
			    		        	ecate2.clearValue();
			    		        	ecate2.getStore().removeAll();
			    		        	ecate3.getStore().removeAll();
			    		        	ecate3.clearValue();
			    		        	ecate2.getStore().load({
			    		        		url: 'showCate2.htm?id='+cateId
			    					});
			    		        
			    		        	Ext.getCmp('ecate2').setValue(cate2);
			    		        
			    		        	ecate3.getStore().load({
			    		        		url: 'showCate3.htm?id='+cate2
			    		        	});
			    		        	
			    		        	Ext.getCmp('ecate3').setValue(cate3);
		            		 }
		            		 
		            		 Ext.getCmp('ename').setValue(wrk_name);
		            		 Ext.getCmp('edetail').setValue(wrk_dtl);
		            		 Ext.getCmp('ekeyword').setValue(keyword);
		            		 Ext.getCmp('eid').setValue(fid);
		            		 Ext.getCmp('wid').setValue(wrk_id);
		            		 editWorkings.show();
		            		 }
		            }]
		        },
		        {text: 'Delete',   xtype: 'actioncolumn', width: 60,  align: 'center', id: 'del',
			            items: [{ iconCls: 'icon-delete', 
			            	handler: function(grid, rowIndex, colIndex) {
			            		 wrk_id = grid.getStore().getAt(rowIndex).get('wrk_id');
			            		 fid = grid.getStore().getAt(rowIndex).get('file_id');
			            		 Ext.getCmp('wrkid').setValue(wrk_id);
			            		 Ext.getCmp('fid').setValue(fid);
			            		 Ext.MessageBox.show({
		            			        title: 'Confirm',
		            			        msg: 'Are you sure you want to delete this?',
		            			        buttons: Ext.MessageBox.YESNO,
		            			        animateTarget: 'del',
		            			        fn: confirmChk,
		            			        icon: Ext.MessageBox.QUESTION
		            			    });
			            		 }
			            }]
			           },
	    ],
	    columnLines: true,
	    bbar: Ext.create('Ext.PagingToolbar', {
	    	store: store.wrk,
	        displayInfo: true,
	        displayMsg: 'Displaying Workings {0} - {1} of {2}',
	        emptyMsg: "No Workings to display",
	        plugins: Ext.create('Ext.ux.ProgressBarPager', {})
	    })
	});
	
});

Ext.define('Wrks', {
    extend: 'Ext.data.Model',
    fields: [
		{name: 'wrk_id',         type: 'int'},     
		{name: 'wrk_name',	 type: 'string'},
		{name: 'cate_lv1',     type: 'int'},
		{name: 'cate_lv2',     type: 'int'},
		{name: 'cate_lv3',     type: 'int'},
		{name: 'cateDesc1',     type: 'string'},
		{name: 'cateDesc2',    type: 'string'},
		{name: 'cateDesc3',    type: 'string'},
		{name: 'wrk_dtl',	 type: 'string'},
		{name: 'keyword',  type: 'string'},
		{name: 'file_name', type: 'string'},
		{name: 'file_id', type: 'int'},
		{name: 'update_date', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		
     ]
});

store.wrk = Ext.create('Ext.data.JsonStore', {
    model: 'Wrks',
    id: 'wrkstore',
    pageSize: 7,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'showWorkingsAdmin.htm?search=',
        reader: {
            type: 'json',
            root: 'records',
            idProperty: 'wrk_id',
            totalProperty: 'total'
        }
    },
//    sorters: [{
//        property: 'serv',
//        direction: 'ASC'
//    }]
});

editWorkings = new Ext.create('Ext.window.Window', {
	title: 'Edit Workings',
	    width: 400,
	    height: 400,
	    animateTarget: 'edit',
	    modal : true,
	    resizable:false,
	    closeAction: 'hide',
	    items :[{
	            xtype:'form',
	            id:'editform',
	            items:[{
	            	xtype:'textfield',
	            	margin: '20 0 0 30',
	                allowBlank: false,
	                fieldLabel: 'Name <font color="red">*</font> ',
	                labelWidth: 80,
	                width: 300,
	                name: 'ename',
	                id: 'ename',
	                vtype: 'eng',
	                msgTarget: 'side',
	                emptyText: 'Workings Name'
	            },{
	    	    	xtype:'combobox',
	    	    	margin: '10 0 0 30',
	    	    	labelWidth: 80,
	                width: 300,
	    	        fieldLabel: 'Category 1',
	    	        name: 'ecate1',
	    	        id: 'ecate1',
	    	        msgTarget: 'side',
	    	        emptyText: 'Category 1',
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
	    		        	var cateId = Ext.getCmp('ecate1').getValue();
	    		        	var cate2 = Ext.getCmp('ecate2');
	    		        	var cate3 = Ext.getCmp('ecate3');
	    		        	
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
	    	    	margin: '10 0 0 30',
//	    	    	disabled:true,
	    	    	labelWidth: 80,
	                width: 300,
	    	        fieldLabel: 'Category 2',
	    	        name: 'ecate2',
	    	        id: 'ecate2',
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
	    		        	var cateId = Ext.getCmp('ecate2').getValue();
	    		        	var cate3 = Ext.getCmp('ecate3');
	    		        	
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
	    	    	margin: '10 0 0 30',
//	    	    	disabled:true,
	    	    	labelWidth: 80,
	                width: 300,
	    	        fieldLabel: 'Category 3',
	    	        name: 'ecate3',
	    	        id: 'ecate3',
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
	    	    },{
	    	    	xtype:'filefield',
	    	    	margin: '10 0 0 30',
	    	    	labelWidth: 80,
	                width: 300,
	    	        fieldLabel: 'File',
	    	        name: 'file',
	    	        id: 'efile',
	    	        msgTarget: 'side',
	    	        allowBlank: true,
	    	        emptyText: 'Browse to change..'
	    	    },{
	    	    	xtype:'textfield',
	    	    	margin: '10 0 0 30',
	    	    	labelWidth: 80,
	                width: 300,
	    	    	fieldLabel: 'Keyword',
	    	    	name: 'ekeyword',
	    	    	id: 'ekeyword',
	    	    	vtype: 'eng',
	    	    	emptyText: 'java,art,animal,etc...'
	    	    },{
	    	    	xtype: 'textarea',
	    	    	margin: '10 0 20 30',
	    	    	labelWidth: 80,
	                width: 300,
	    	    	fieldLabel: 'Detail',
	    	    	name: 'edetail',
	    	    	id: 'edetail',
	    	    	vtype: 'eng',
	    	    	emptyText: 'Workings Details'
	    	    },{
	    	    	xtype: 'hidden',
	    	    	id: 'eid',
	    	    	name: 'eid'
	    	    },{
	    	    	xtype: 'hidden',
	    	    	id : 'wid',
	    	    	name: 'wid'
 	    	    }],
	    }],
        buttons:[{
        	text: 'Reset',
        	width:100,
        	handler: function(){
        		Ext.getCmp('editform').getForm().reset();
        		Ext.getCmp('ecate2').getStore().removeAll();
        		Ext.getCmp('ecate3').getStore().removeAll();
        	}
        },{	
       		  text: 'Update',
      		  width:100,
      		  id: 'ebtn',
             handler: function(){
            	 var form = Ext.getCmp('editform').getForm();
            	 if(form.isValid()){
					 form.submit({
					 url: 'editWorkings.htm',
					 waitTitle: 'Update Workings',
					 waitMsg: 'Please wait...',
					 standardSubmit: true,
	                 failure: function(form, action) {
	                	 Ext.MessageBox.show({
	  						title: 'Information',
	  						msg: 'Workings Has Been Update!',
	  						buttons: Ext.MessageBox.OK,
	  						icon: Ext.MessageBox.INFO,
	  						animateTarget: 'ebtn',
	  						fn: function(){editWorkings.hide();}
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
           			Ext.getCmp('editform').getForm().reset();
           			Ext.getCmp('ecate2').getStore().removeAll();
	        		Ext.getCmp('ecate3').getStore().removeAll();
           		}
           	}
		});

viewWorkings = new Ext.create('Ext.window.Window', {
	title: 'Workings Details',
	    width: 600,
	    height: 320,
	    animateTarget: 'dtl',
	    modal : true,
	    resizable:true,
	    autoScroll: true,
	    closeAction: 'hide',
//	    border: false,
	    layout: 'column',
	    items :[{
	            columnWidth:0.45,
	            xtype: 'fieldset',
	            padding: 20 ,
	            border: false,
				style: {
		               "margin-left": "10px",
		               "margin-right": "auto",
		               "margin-top": "auto"
		        },
				defaults: {
				       anchor: '100%'	        
				},
				 items: [{
					 	xtype:'label',
					 	text: 'Name :'
				 },{
				        xtype:'text',
				        id: 'vname',
				        margin: '5 0 10 30',
				        style: {
				        	"font-weight":"bold",
				        	"color":"red"
				        }
				    },{
					 	xtype:'label',
					 	text: 'Category 1 :'
				 },{
				        xtype:'text',
				        id: 'vcate1',
				        margin: '5 0 10 30',
				        style: {
				        	"font-weight":"bold"
				        }
				    },{
					 	xtype:'label',
					 	text: 'Category 2 :'
				 },{
				        xtype:'text',
				        id: 'vcate2',
				        margin: '5 0 10 30',
				        style: {
				        	"font-weight":"bold"
				        }
				    },{
					 	xtype:'label',
					 	text: 'Category 3 :'
				 },{
				        xtype:'text',
				        id: 'vcate3',
				        margin: '5 0 0 30',
				        style: {
				        	"font-weight":"bold"
				        }
				    }]
	    },{
            columnWidth:0.45,
            xtype: 'fieldset',
            padding: 20 ,
            border: false,
			style: {
	               "margin-left": "10px",
	               "margin-right": "auto",
	               "margin-top": "auto"
	        },
			defaults: {
			       anchor: '100%'	        
			},
			 items: [{
				 	xtype:'label',
				 	text: 'File :'
			 },{
			        xtype:'text',
			        id: 'vfile',
			        margin: '5 0 10 30',
			        style: {
			        	"font-weight":"bold"
			        }
			    },{
				 	xtype:'label',
				 	text: 'Keyword :'
			 },{
			        xtype:'text',
			        id: 'vkeyword',
			        margin: '5 0 10 30',
			        style: {
			        	"font-weight":"bold"
			        }
			    },{
				 	xtype:'label',
				 	text: 'Details :'
			 },{
			        xtype:'text',
			        id: 'vdetails',
			        margin: '5 0 0 30',
			        style: {
			        	"font-weight":"bold"
			        }
			    }]
    }],
        buttons:[{
        	text: 'Download',
        	handler: function(){
        		window.open('download.htm?file='+Ext.getCmp('fi').getValue(),'_blank');
        	}
        }],
           	listeners:{
           		'beforehide':function(){
           			
           		}
           	}
		});

function confirmChk(btn){
	if(btn == "yes"){
	Ext.Ajax.request({
		url : 'deleteWorkings.htm',
		params: {id: Ext.getCmp('wrkid').getValue(),fid: Ext.getCmp('fid').getValue()},
		success: function(response, opts){
			window.location = "workings.htm";
		},
		failure: function(response, opts){
			var responseOject = Ext.util.JSON.decode(response.responseText);
			Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
		}
	});
	}
}

function getParamValues(){
	var url = "";
	var param = "";
	var prefix = "?";
	var queryStr = "";
	var i = 1;
	var count = 0;
	
	for(param in head.getValues()){
		
		count+=head.getValues()[param].length;
		
		if(i==1){
			queryStr+=param+"="+head.getValues()[param];
		}else{
			queryStr+="&"+param+"="+head.getValues()[param];
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