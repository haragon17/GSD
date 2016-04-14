/* Global Variable
 */
var panels = {};
var errMSG = errMessage;
var store = {};
var grids = {};
var plugins = {};
var selModels = {};

Ext.onReady(function(){    
    Ext.tip.QuickTipManager.init();    
    console.debug("Main Panel Created...");
    
    
//Define Data Model
    Ext.define('Groups', {
        extend: 'Ext.data.Model',
        fields: [
    		{name: 'grp_id',   type: 'int'},     
    		{name: 'grp_nm',   type: 'string'},
    		{name: 'grp_cd',   type: 'string'},
    		{name: 'actv_flag',	type: 'bool'},
    		{name: 'grp_lv',	type: 'string'}
         ]
    });
    
    Ext.define('Wrks', {
    	extend: 'Ext.data.Model',
    	fields: [
    	    {name: 'wrk_id',	type: 'int'},
    	    {name: 'wrk_name',	type: 'string'},
    	    {name: 'cus_id',	type: 'int'},
    	    {name: 'cus_name',	type: 'string'},
    	    {name: 'wrk_sts_id',type: 'int'},
    	    {name: 'wrk_sts_name',type: 'string'},
    	    {name: 'wrk_amount',type: 'int'},
    	    {name: 'wrk_dtl',	type: 'string'},
    	    {name: 'wrk_in',	type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	    {name: 'wrk_out',	type: 'date', dateFormat: 'Y-m-d H:i:s'}
        ]
    });
    
    store.groupS = Ext.create('Ext.data.JsonStore', {
        model: 'Wrks',
        pageSize: 10,
        autoDestroy: true,
        autoLoad: true,
        autoSync:false,
        proxy: {
            type: 'ajax', 
            url: 'getGrpData.action',
            reader: {
                type: 'json',
                root: 'getGrpData',
                totalProperty: 'total',
            }
        }
    });

//JSON Store
    store.group = Ext.create('Ext.data.JsonStore', {
        model: 'Groups',
        id: 'gridStore',
        pageSize: 10,
        autoDestroy: true,
        autoLoad: false,
        autoSync:false,
        proxy: {
            type: 'ajax',           
            api: {
                read: 'getGrpData.action',
                //create: 'cretdGrp.action',
                update: 'updateGroup.action',
                //destroy: 'app.php/users/destroy'
            },
            reader: {
                type: 'json',
                root: 'getGrpData',
                totalProperty: 'total',
                successProperty: 'success',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                root: 'data',
                encode: true,
                writeAllFields: true,
               
            },
            listeners: {
                exception: function(proxy, response, operation){
                    Ext.MessageBox.show({
                        title: 'REMOTE EXCEPTION',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        },
        listeners: {
            write: function(proxy, operation){
                if (operation.action == 'destroy') {
                    //main.child('#form').setActiveRecord(null);
                }
                
                if(operation.action == 'create'){
                	Ext.MessageBox.show({
    	                title: 'Status',
    	                msg: 'Save successfull',
    	                icon: Ext.MessageBox.INFO,
    	                buttons: Ext.Msg.OK
    	            });
                }
                
                if(operation.action == 'update'){
                	Ext.MessageBox.show({
    	                title: 'Status',
    	                msg: 'Save successfull',
    	                icon: Ext.MessageBox.INFO,
    	                buttons: Ext.Msg.OK
    	            });
                }
                
            }
        }
    });
    
//Plugin RowEditing
    
    plugins.rowEdit = Ext.create('Ext.grid.plugin.RowEditing', {
    	clicksToMoveEditor: 1,
        autoCancel: false,
        listeners: {
            cancelEdit: function(rowEditing, context) {
                // Canceling editing of a locally added, unsaved record: remove it
                if (context.record.phantom) {
                	store.group.remove(context.record);
                }
            },
            afteredit: function(editor,e){
            	//Check Group Code
            	if(e.field == 'grp_cd'){
            	var userGroup = Ext.getCmp('usrGroup').getValue();
            	Ext.Ajax.request({
    				url : 'chkUserGroup.action',
    				params: {records : userGroup},
    				success: function(response, opts){
    					var responseOject = Ext.decode(response.responseText);
    					if(responseOject.userGr[0].grp_cd != null){
    						Ext.Msg.alert("Warning","Group code have been used!",function(){  
    							var index = store.groupS.find('grp_id',e.record.get('grp_id'));
    							var record = store.groupS.getAt(index);
    							if(record != null){
    							e.record.set('grp_cd',record.get('grp_cd'));
    							}
    						});
    					}else if(e.record.get('grp_cd') == ''){
    						Ext.Msg.alert("Warning","Group Code can not be null",function(){
    							var index = store.groupS.find('grp_id',e.record.get('grp_id'));
    							var record = store.groupS.getAt(index);
    							
    							e.record.set('grp_cd',record.get('grp_cd'));
    								
    						});
    					}
    				//	alert(responseOject.userGr[0].grp_cd);
    				},
    				failure: function(response, opts){
    					var responseOject = Ext.util.JSON.decode(response.responseText);
    					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
    				}
    			});
            	}
            }
            
        }
    });

//Plugin Paging
//Checkbox Model
    selModels.selModel = Ext.create('Ext.selection.CheckboxModel', {
        listeners: {
            selectionchange: function(sm, selections) {
            	//grids.grid.down('#delete').setDisabled(selections.length === 0);
            }
        }
    });
    
// Create the grid and specify what field you want
// to use for the editor at each column.   
    grids.grid = Ext.create('Ext.grid.Panel', {       
    	title: '<font color="orange">Search Results</font>',
    	store: store.group, 
    	id: 'grids',
    	//selModel: selModels.selModel,
    	//columnLines: true,
        width: 1000,
        height: 344,
        //frame: true,
     	split: true,
     	forceFit: true,
     	loadMask: true,
        autoWidth: true,
        autoHeight: true,
        style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "10px"
        },
        columns: [
            {text: "Group Code", 	width: 200, 	dataIndex: 'grp_cd',	sortable: true,	editor: {xtype: 'textfield',id: 'usrGroup',vtype: 'alphanum',allowBlank: true,
            }
            	},
            {text: "Group Name", 	width: 200, 	dataIndex: 'grp_nm',	sortable: true,	editor: {xtype: 'textfield',allowBlank: true}},
            {text: "Group Level", 	width: 100, 	dataIndex: 'grp_lv',	sortable: true,	editor: {xtype: 'combo', mode:'local',store: ['L1','L2','L3'], triggerAction: 'all', autoSelect: true, editable:false}},
            {xtype: 'checkcolumn',  text: 'Active ',dataIndex: 'actv_flag',	editor: {xtype: 'checkbox',allowBlank: true}}
        ],
        renderTo: document.body,
        plugins: [plugins.rowEdit],
        dockedItems: [{
            xtype: 'toolbar',
            items: [{
                iconCls: 'icon-add',
                text: 'Create',
                tooltip: 'Create new group',
                scope: this, 
               handler : function(){
            	   popCreate.show();
               }
                /*handler: function(){
                	plugins.rowEdit.cancelEdit();
                	var m = Ext.create('Groups',{                		
                		grp_cd: '',
                		grp_nm: '',
                                            
                	});
                	store.group.insert(0, m);
                    plugins.rowEdit.startEdit(0, 0);               
                    console.debug('Create new row');
                }*/
            },/* {
                iconCls: 'icon-delete',
                text: 'Delete',
                disabled: true,
                itemId: 'delete',
                tooltip: 'Delete select row',
                scope: this,
                handler: function(){
                	var selection = grids.grid.getView().getSelectionModel().getSelection();
                	var itemSelect = selection.length;
                    
                	for(var i=0;i<itemSelect;i++){
                		store.group.remove(selection[i]);
                		console.debug('Delete item where ext_id = '+selection[i].data.grp_id);
                	}
                    
                }
            },*/ {
                iconCls: 'icon-save',
                text: 'Save All',
                tooltip: 'Sync data from server',
                disabled: false,
                itemId: 'save',
                scope: this,
                handler: function(){
                	store.group.sync();
                    console.debug('Save all data');
                }
            }, '->',{
            	text: 'Auto Sync : Off',
                enableToggle: true,
    	        pressed: false,
    	        iconCls: 'icon-disconnect',
    	        itemId: 'autosync',
    	        tooltip: 'AutoSync data from server',
    	        scope: this,
    	        toggleHandler: function(btn, pressed){
    	        	var autoSync = grids.grid.down('#autosync');
    	        	var saveBtn = grids.grid.down('#save');
    	        	store.group.autoSync = pressed;
    	        	if(pressed){
    	        		autoSync.setIconCls('icon-connect');
    	        		autoSync.setText('Auto Sync : On');
    	        		saveBtn.setDisabled(true);
    	        	}else{
    	        		autoSync.setIconCls('icon-disconnect');
    	        		autoSync.setText('Auto Sync : Off');
    	        		saveBtn.setDisabled(false);
    	        	}
    	        	console.debug("Set autoSync = "+pressed);
    	        }
            }]
        }],
        bbar: Ext.create('Ext.PagingToolbar', {
        	store: store.group,
            displayInfo: true,
            displayMsg: 'Displaying logs {0} - {1} of {2}',
            emptyMsg: "No logs to display",
            plugins: Ext.create('Ext.ux.ProgressBarPager', {})

        }),
        listeners: {
    		selectionchange: function(view, records) {
    			//panels.grid.down('#delete').setDisabled(!records.length);
    		}
        }
    });
        
}); //End On Ready

var popCreate = Ext.create('Ext.window.Window', {
		title: '<font color="orange">Create Group</font>',
//		id: 'IdCreateGrp',
		autoHeight: true,
	    //height: 300,
	    width: 450,
	    padding: 5 ,
	    modal : true,
	    closeAction: 'hide',
	    items :[{
	    	 xtype: 'fieldset',
		   	 defaultType: 'textfield',
			 width: 430,
			 autoHeight: true,
			 //height: 300,
			 border: false,
			 style: {
	               "margin-left": "auto",
	               "margin-right": "auto",
	               "margin-top": "10px"
	        },
			 defaults: {
			         anchor: '100%'	        
			 },
			 items: [{	    			
	    			xtype: 'textfield',
	    			allowBlank: false,
					fieldLabel: 'Group Code <font color="red">*</font> ',
					name :'groupCode',
					id: 'IgrpCode',
					vtype: 'alphanum',
					labelWidth:125,
					defaults: {
                        anchor: '100%'
                    },
	    			width: 400,
					msgTarget: 'under',
	               	minLength: 6,
	               	minLengthText: 'Minimum input 6 charecter',	       
					//padding: 5 ,
					
	    			listeners: {	    		    				
               		 'blur': function(e){
              		 
               			 var userGroup = Ext.getCmp('IgrpCode').getValue();
               		 Ext.Ajax.request({
               				url : 'chkUserGroup.action',
               				params: {records : userGroup},
               				success: function(response, opts){
               					var responseOject = Ext.decode(response.responseText);
               					if(responseOject.userGr[0].grp_cd != null){
               						Ext.getCmp('IgrpCode').markInvalid('Group Code has been used');
               					}
               				},
               				failure: function(response, opts){
               					var responseOject = Ext.util.JSON.decode(response.responseText);
               					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
               				}
               			});
               		 }
               	 }
					},
				{
					xtype: 'textfield',
					fieldLabel: 'Group Name  ',
					name :'groupName',
					id: 'IgrpName',
					labelWidth:125,
					//padding: 5 ,
					defaults: {
	                        anchor: '100%'
	                },	
					width: 400,
					},								
					new Ext.form.ComboBox({
	                     fieldLabel: 'Group Level <font color="red">*</font> ',
	                     name:'groupLevel',
	                     id: 'IgrpLv',
	                     labelWidth : 125,
	                     allowBlank: false,
	                     defaults: {
	                         anchor: '100%'
	                     },
	                     store:['L1','L2','L3'],
//	                     valueField:'grp_id',
//	                     displayField:'grp_nm',
	                     
	                     typeAhead: true,
	                     mode: 'local',
	                     triggerAction: 'all',
	                     emptyText:'Select a Group Level ...',
	                     selectOnFocus:true,
	                     width:400,
	                     queryMode: 'local',
	                     msgTarget: 'under',
	                 }),
				{						
						xtype: 'checkbox',
	                     fieldLabel: 'Set Active  ',
	                     name: 'groupActive',
	                     id: 'IgrpAct',
	                     inputValue : 'true',
	                     uncheckedValue : 'false',
	                     labelWidth:125,
	                     //padding: 5 ,
	                     width:400
							}
					]
	    		}
	    		
         ],			                     		    
     	buttons:[{	
     		  text: 'Create',
        		  width:100,	
        		
        			  handler: function(){
                   	   	var grpCode = Ext.getCmp('IgrpCode').getValue();
	                   	var grpName = Ext.getCmp('IgrpName').getValue();
	                   	var grpLevel = Ext.getCmp('IgrpLv').getValue();
	                   	var grpActive = Ext.getCmp('IgrpAct').getValue();
                   	   if(grpCode!="" && grpCode!=null && grpCode!="null"){
                   		   window.location = 'cretdGrp.action?grp_cd='+grpCode+'&grp_nm='+grpName+'&grp_lv='+grpLevel+'&grp_act='+grpActive;
                   	   }
                   	   else {
                   		   Ext.MessageBox.alert('Error','Please select Create Group');
                   	   }
		           	}
     	},{
           	text: 'Cancel',
           	width:100,
           	handler: function() {
           		Ext.getCmp('IgrpCode').setValue('');
               	Ext.getCmp('IgrpName').setValue('');
               	Ext.getCmp('IgrpLv').setValue('');
               Ext.getCmp('IgrpAct').setValue('');
           		}
     	}]
		});


function getParamValues(){
	var url = "";
	var param = "";
	var prefix = "?";
	var queryStr = "";
	var i = 1;
	var count = 0;
	
	for(param in panels.panel1.getValues()){
		
		count+=panels.panel1.getValues()[param].length;
		
		if(i==1){
			queryStr+=param+"="+panels.panel1.getValues()[param];
		}else{
			queryStr+="&"+param+"="+panels.panel1.getValues()[param];
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


//var mainPanel;
//var panels = {};
//var stores = {};
//var plugins = {};
//var tabs = {};
//var selModels = {};
//
//Ext.Loader.setConfig({
//    enabled: true
//});
//
//Ext.onReady(function(){ 
//	Ext.tip.QuickTipManager.init();
//	
//	mainPanel = Ext.create('Ext.panel.Panel', {
//        title: 'CRUD Example',
//        iconCls: 'icon-bug',
//        layout: {
//            type: 'vbox',
//            pack: 'start',
//            align: 'center'
//            
//        },
//        autoWidth: true,
//        height: window.screen.height,
//        renderTo: Ext.getBody()
//    });
//	
//	mainPanel.add([tabs.tabPanel]);
//	tabs.tabPanel.add([panels.grid]);
//	
//});
//
//
////TabPanel
//tabs.tabPanel = Ext.create('Ext.tab.Panel', {
//    width: 1000,
//    height: 500,
//    activeTab: 0,
//    margin: '20 0 0 0'
//});
//
////Define Data Model
//Ext.define('ExampleModel', {
//    extend: 'Ext.data.Model',
//    fields: [
//		{name: 'ex_id',         type: 'string'},     
//		{name: 'ex_name',   	type: 'string'},
//		{name: 'ex_last_name',  type: 'string'},
//		{name: 'ex_email',    	type: 'string'},
//		{name: 'stringEx_date', type: 'date', 	dateFormat: 'Y-m-d H:i:s'}
//    ]
//});
//
////Store
//stores.example = Ext.create('Ext.data.Store', {
//    model: 'ExampleModel',
//    autoLoad: true,
//    autoSync: false,
//    autoDestroy: true,
//    proxy: {
//        type: 'ajax',
//        api: {
//            read: 'viewexam.action',
//            create: 'createexam.action',
//            update: 'updateexam.action',
//            destroy: 'destroyexam.action'
//        },
//        reader: {
//            type: 'json',           
//            root: 'data',
//            totalProperty: 'total',
//            successProperty: 'success',
//            messageProperty: 'message'
//        },
//        writer: {
//            type: 'json',          
//            root: 'data',
//            encode: true,
//            writeAllFields: true
//        },
//        listeners: {
//            exception: function(proxy, response, operation){
//                Ext.MessageBox.show({
//                    title: 'REMOTE EXCEPTION',
//                    msg: operation.getError(),
//                    icon: Ext.MessageBox.ERROR,
//                    buttons: Ext.Msg.OK
//                });
//            }
//        }
//    },
//    listeners: {
//        write: function(proxy, operation){
//            if (operation.action == 'destroy') {
//                //main.child('#form').setActiveRecord(null);
//            }else if(operation.action == 'create'){
//            	Ext.MessageBox.show({
//	                title: 'Status',
//	                msg: 'Save successfull',
//	                icon: Ext.MessageBox.INFO,
//	                buttons: Ext.Msg.OK
//	            });
//            }
//            
//        }
//    }
//});
//
////Plugin RowEditing
//plugins.rowEdit = Ext.create('Ext.grid.plugin.RowEditing', {
//	clicksToMoveEditor: 1,
//    autoCancel: false,
//    listeners: {
//        cancelEdit: function(rowEditing, context) {
//            // Canceling editing of a locally added, unsaved record: remove it
//            if (context.record.phantom) {
//            	stores.example.remove(context.record);
//            }
//        }
//    }
//});
//
////Plugin Paging
//
////Checkbox Model
//selModels.selModel = Ext.create('Ext.selection.CheckboxModel', {
//    listeners: {
//        selectionchange: function(sm, selections) {
//        	panels.grid.down('#delete').setDisabled(selections.length === 0);
//        }
//    }
//});
//
////Grid Panel
//panels.grid = Ext.create('Ext.grid.Panel', {
//	title: 'Example',
//	iconCls: 'icon-application',
//	store: stores.example,
//	selModel: selModels.selModel,
//	split: true,
//	forceFit: true,
//	loadMask: true,
//    autoWidth: true,
//    autoHeight: true,
//    columns: [
//        //Ext.create('Ext.grid.RowNumberer'),
//        {text: "ex_id", 		width: 20,  sortable: true, dataIndex: 'ex_id', 		align: 'right'},
//        {text: "ex_name",     	width: 50, 	sortable: true, dataIndex: 'ex_name', 		editor: {xtype: 'textfield', 	allowBlank: true}},
//        {text: "ex_last_name",  width: 50,  sortable: true, dataIndex: 'ex_last_name', 	editor: {xtype: 'textfield',	allowBlank: true}},
//        {text: "ex_email",      width: 80, 	sortable: true, dataIndex: 'ex_email', 		editor: {xtype: 'textfield',	allowBlank: true,	vtype: 'email'}},
//        {text: "stringEx_date", width: 100, sortable: true, dataIndex: 'stringEx_date', editor: {xtype: 'datefield',	allowBlank: true}, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')}
//    ],
//    plugins: [plugins.rowEdit],
//    dockedItems: [{
//        xtype: 'toolbar',
//        items: [{
//            iconCls: 'icon-add',
//            text: 'Create',
//            tooltip: 'Create new row',
//            scope: this,
//            handler: function(){
//            	plugins.rowEdit.cancelEdit();
//            	var m = Ext.create('ExampleModel',{
//            		ex_id: '',
//            		ex_name: '',
//            		ex_last_name: '',
//            		ex_email: '',
//            		stringEx_date: Ext.Date.format(new Date(), 'm/d/Y')
//            	});
//                stores.example.insert(0, m);
//                plugins.rowEdit.startEdit(0, 0);               
//                console.debug('Create new row');
//            }
//        }, {
//            iconCls: 'icon-delete',
//            text: 'Delete',
//            disabled: true,
//            itemId: 'delete',
//            tooltip: 'Delete select row',
//            scope: this,
//            handler: function(){
//            	var selection = panels.grid.getView().getSelectionModel().getSelection();
//            	var itemSelect = selection.length;
//                
//            	for(var i=0;i<itemSelect;i++){
//            		stores.example.remove(selection[i]);
//            		console.debug('Delete item where ext_id = '+selection[i].data.ex_id);
//            	}
//                
//            }
//        }, {
//            iconCls: 'icon-save',
//            text: 'Save All',
//            tooltip: 'Sync data from server',
//            disabled: false,
//            itemId: 'save',
//            scope: this,
//            handler: function(){
//            	stores.example.sync();
//                console.debug('Save all data');
//            }
//        }, '->',{
//        	text: 'Auto Sync : Off',
//            enableToggle: true,
//	        pressed: false,
//	        iconCls: 'icon-disconnect',
//	        itemId: 'autosync',
//	        tooltip: 'AutoSync data from server',
//	        scope: this,
//	        toggleHandler: function(btn, pressed){
//	        	var autoSync = panels.grid.down('#autosync');
//	        	var saveBtn = panels.grid.down('#save');
//	        	stores.example.autoSync = pressed;
//	        	if(pressed){
//	        		autoSync.setIconCls('icon-connect');
//	        		autoSync.setText('Auto Sync : On');
//	        		saveBtn.setDisabled(true);
//	        	}else{
//	        		autoSync.setIconCls('icon-disconnect');
//	        		autoSync.setText('Auto Sync : Off');
//	        		saveBtn.setDisabled(false);
//	        	}
//	        	console.debug("Set autoSync = "+pressed);
//	        }
//        }]
//    }],
//    bbar: Ext.create('Ext.PagingToolbar', {
//        store: stores.example,
//        displayInfo: true,
//        displayMsg: 'Displaying logs {0} - {1} of {2}',
//        emptyMsg: "No logs to display"
//
//    }),
//    listeners: {
//		selectionchange: function(view, records) {
//			panels.grid.down('#delete').setDisabled(!records.length);
//		}
//    }
//});