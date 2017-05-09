var panel = {};
var store = {};
var selModels = {};
var plugins = {};
var cate1="";
var cate2="";

Ext.onReady(function(){
	
	cc1 = new Ext.form.Hidden({
		name: 'cc1',
		id: 'cc1'
	});
	cate1 = Ext.getCmp('cc1').getValue();
	
	cc2 = new Ext.form.Hidden({
		name: 'cc2',
		id: 'cc2'
	});
	
	formHead = new Ext.Container({
    	border : 0,
        layout:'column',
        layoutConfig: {
            padding:'5',
            pack:'center',
            align:'middle'
          },
        width: 1200,
        style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "55px",
        },
        defaults : {
            xtype:'container',
            layout: 'form',
            layoutConfig: {
                padding:'5',
                pack:'center',
                align:'middle'
              },
            columnWidth: 1,
            labelWidth: 0,
            anchor:'100%',
            hideBorders : false,
           
        },
		items: [{
			columnWidth:0.4,
			xtype:'splitter',
		},{
			columnWidth:0.2,
			xtype:'textfield',
			fieldLabel:'<b>Category 1 </b>',
			id:'hcate1',
			disabled: true,
			labelWidth: 80,
		},{
			columnWidth:0.12,
			xtype:'splitter',
		},{
			columnWidth:0.2,
			xtype:'textfield',
			id:'hcate2',
			disabled: true,
			fieldLabel:'<b>Category 2 </b>',
			labelWidth: 80,
		}
			  ],
			  renderTo: document.body
    });
	
	formCate = new Ext.Container({
    	border : 0,
        layout:'column',
        width: 1200,
        style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "50px"
        },
        defaults : {
            xtype:'container',
            layout: 'form',
            columnWidth: 1,
            labelWidth: 0,
            anchor:'100%',
            hideBorders : false,
          
           
        },
		items: [
			  {	
				columnWidth : 0.33,
			    items:[panel.grid1],
			  },
			  {
				columnWidth : 0.33,
				items:[panel.grid2],
			  },
			  {
				columnWidth : 0.33,
				items:[panel.grid3],
			  },
			  ],
			  renderTo: document.body
    });
	
});

/**Define Data Model*/
Ext.define('Category', {
    extend: 'Ext.data.Model',
    fields: [
		{name: 'cate_id',         type: 'int'},     
		{name: 'cate_desc',	 type: 'string'},
		{name: 'comment',     type: 'string'},
		{name: 'cate_ref',    type: 'int'},
		{name: 'cate_lv',    type: 'int'},
		{name: 'cretd_date' ,type:'date' ,dateFormat: 'Y-m-d H:i:s.u'}
     ]
});

store.cate1 = Ext.create('Ext.data.JsonStore', {
    model: 'Category',
    id: 'cate1',
    pageSize: 7,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
            read: 'showCate1.htm',
            update: 'updateCate.htm',
        },
        reader: {
            type: 'json',
            root: 'records',
            idProperty: 'cate_id',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message'
        },
        writer: {
            type: 'json',          
            root: 'data',
            encode: true,
            writeAllFields: true
        },
        listeners: {
            exception: function(proxy, response, operation){
            	test = operation.getError();
                Ext.MessageBox.show({
                    title: 'REMOTE EXCEPTION',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    animateTarget: 'isave1',
                    buttons: Ext.Msg.OK,
                    fn: function(){location.reload()}
                });
            }
        }
    },
    listeners: {
    	write: function(store, record, operation, eOpts){
        	Ext.MessageBox.show({
	                title: 'Information',
	                msg: 'Save Successful!',
	                buttons: Ext.MessageBox.OK,
	                animateTarget: 'isave1',
	                icon: Ext.MessageBox.INFO,
	            });
        }
    }
});

plugins.rowEdit = Ext.create('Ext.grid.plugin.RowEditing', {
	clicksToMoveEditor: 1,
    autoCancel: false,
});

selModels.selModel = Ext.create('Ext.selection.CheckboxModel', {
    listeners: {
        selectionchange: function(sm, selections) {
        	panel.grid1.down('#delete').setDisabled(selections.length === 0);
        }
    }
});

panel.grid1 = Ext.create('Ext.grid.Panel', {
	title: 'Category 1',
	frame: true,
    selModel: selModels.selModel,
    store:store.cate1,
    style: {
          "margin-left": "auto",
          "margin-right": "auto",
      },
    width: 325,
    height: 450,   
    columns: [
        {text: "Description",  width: 110, sortable: true, dataIndex:'cate_desc', editor:{xtype : 'textfield' , allowBlank : false} },
        {text: "Comment",	   width: 90, sortable: true, dataIndex:'comment', editor:{xtype : 'textfield' , allowBlank : true}},
        {text: 'Manage Dtl',   xtype: 'actioncolumn', width: 90,  align: 'center', id: 'to11',sortable : false,
            items: [{ iconCls: 'my-icon', 
            	handler : function(grid, rowIndex, colIndex){
            		   cate1 = grid.getStore().getAt(rowIndex).get('cate_id');
            		   catedesc = grid.getStore().getAt(rowIndex).get('cate_desc');
            		   Ext.getCmp('cc1').setValue(cate1);
            		   Ext.getCmp('hcate1').setValue(catedesc);
            		   Ext.getCmp('hcate2').setValue('');
            		   store.cate2.load({
							url : 'showCate2.htm?id='+cate1
						});
	    			   Ext.getCmp('gridCate2').setDisabled(false);
	    			   Ext.getCmp('gridCate3').setDisabled(true);
	    			   Ext.getCmp('gridCate3').getStore().removeAll();
	    		   }
            }]
           }
    ],
    plugins: [plugins.rowEdit],
	   dockedItems: [{
	       xtype: 'toolbar',
	       items: [{
	           iconCls: 'icon-add',
	           text: 'Create',
	           id: 'icreate1',
	           tooltip: 'Create new row',
	           scope: this,
//	           disabled: true,
	           handler: function(){
	        	   createCate1.show();
	           }
	       }, {
	           iconCls: 'icon-delete',
	           id:'idel1',
	           text: 'Delete',
	           disabled: true,
	           itemId: 'delete',
	           tooltip: 'Delete select row',
	           scope: this,
	           handler: function(){
//	        	   Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?',del);
	        	   Ext.MessageBox.show({
   	                title: 'Confirm',
   	                msg: 'Are you sure you want to do this?',
   	                buttons: Ext.MessageBox.YESNO,
   	                animateTarget: 'idel1',
   	                icon: Ext.MessageBox.QUESTION,
   	                fn: del
   	            });
	           }
	       }, {
	           iconCls: 'icon-save',
	           text: 'Save All',
	           tooltip: 'Sync data from server',
//	           disabled: true,
	           itemId: 'save',
	           id:'isave1',
	           scope: this,
	           handler: function(){
	           	store.cate1.sync();
	           }
	       }]
	   }],
    columnLines: true,
    bbar: Ext.create('Ext.PagingToolbar', {
    	store:store.cate1,
        displayInfo: true,
        displayMsg: 'Displaying Category {0} - {1} of {2}',
        emptyMsg: "No Category to display",
        plugins: Ext.create('Ext.ux.ProgressBarPager', {})
    })
});

function del(btn){
	if(btn == 'yes'){
	
			var selection = panel.grid1.getView().getSelectionModel()
					.getSelection();
			var itemSelect = selection.length;
			var jsonArray = [];
			for ( var i = 0; i < itemSelect; i++) {
				store.cate1.remove(selection[i]);
				console.debug('Delete item where cate_id = '
						+ selection[i].data.cate_id);
				jsonArray.push(selection[i].data);
			}
		var params = {
       		method:'delete',
       		data : Ext.JSON.encode(jsonArray)
       	};
       	
       	Ext.Ajax.request({
       		url : 'deleteCate.htm',
       		params : params,
       		success : function (response,opts){
       			var responseObject = Ext.JSON.decode(response.responseText);
       			if(responseObject.success){
       				Ext.Msg.alert('Status','Delete Success',function(){
       					store.cate1.reload();
       					Ext.getCmp('gridCate2').setDisabled(true);
       					Ext.getCmp('gridCate2').getStore().removeAll();
 	    			    Ext.getCmp('gridCate3').setDisabled(true);
 	    			    Ext.getCmp('gridCate3').getStore().removeAll();
       				});
       			}
       			else{
       				Ext.Msg.alert('Warning','could not delete category!!' +responseObject.errorMessages);
       			}
       		}
       	});
	}
}

createCate1 = new Ext.create('Ext.window.Window', {
	title: 'Create Category 1',
	    height: 170,
	    width: 400,
	    animateTarget: 'icreate1',
	    modal : true,
	    resizable:false,
	    closeAction: 'hide',
	    items :[{
	            xtype:'form',
	            id:'cCate1',
	            height: 110,
	            items:[{
	            	xtype:'textfield',
	            	margin: '20 0 0 30',
	                allowBlank: false,
	                fieldLabel: 'Description <font color="red">*</font> ',
	                labelWidth: 90,
	                width: 300,
	                name: 'desc1',
	                id: 'desc1',
	                msgTarget: 'side',
	                emptyText: 'Description'
	            },
	            {
	            	xtype:'textfield',
	            	margin: '10 0 20 30',
	                allowBlank: true,
	                fieldLabel: 'Comment',
	                labelWidth: 90,
	                width: 300,
	                msgTarget: 'side',
	                name: 'comment1',
	                id: 'comment1',
	                emptyText: 'Comment'
	            }
	            ],
	    }],
        buttons:[{	
       		  text: 'Create',
      		  width:100,
      		  id: 'btn',
             handler: function(){
//            	 var desc = Ext.getCmp('desc1').getValue();
//            	 var comment = Ext.getCmp('comment1').getValue();
            	 var form = Ext.getCmp('cCate1').getForm();
            	 if(form.isValid()){
					 form.submit({
					 url: 'createCate1.htm',
					 waitTitle: 'Creating Category',
					 waitMsg: 'Please wait...',
					 standardSubmit: false,
					 success: function(form, action) {
						 Ext.MessageBox.show({
		  						title: 'Information',
		  						msg: 'Category Has Been Created!',
		  						buttons: Ext.MessageBox.OK,
		  						icon: Ext.MessageBox.INFO,
		  						animateTarget: 'icreate1',
		  						fn: function(){createCate1.hide();store.cate1.reload();}
		  					});
				        },
				        failure: function(form, action) {
//				            Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
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
 						animateTarget: 'btn',
 					});
 				}
			}
           	}],
           	listeners:{
           		'beforehide':function(){
           			Ext.getCmp('cCate1').getForm().reset();
           			
           		}
           	}
		});

store.cate2 = Ext.create('Ext.data.JsonStore', {
    model: 'Category',
    id: 'cate2',
    pageSize: 7,
    autoLoad: false,
    proxy: {
        type: 'ajax',
        api: {
            read: 'showCate2.htm?id='+cate1,
            update: 'updateCate.htm',
        },
        reader: {
            type: 'json',
            root: 'records2',
            idProperty: 'cate_id',
            totalProperty: 'total2',
            successProperty: 'success',
            messageProperty: 'message'
        },
        writer: {
            type: 'json',          
            root: 'data',
            encode: true,
            writeAllFields: true
        },
        listeners: {
            exception: function(proxy, response, operation){
            	test = operation.getError();
                Ext.MessageBox.show({
                    title: 'REMOTE EXCEPTION',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    animateTarget: 'isave2',
                    buttons: Ext.Msg.OK,
                    fn: function(){location.reload()}
                });
            }
        }
    },
    listeners: {
    	write: function(store, record, operation, eOpts){
        	Ext.MessageBox.show({
	                title: 'Information',
	                msg: 'Save Successful!',
	                buttons: Ext.MessageBox.OK,
	                animateTarget: 'isave2',
	                icon: Ext.MessageBox.INFO,
	            });
        }
    }
});

plugins.rowEdit2 = Ext.create('Ext.grid.plugin.RowEditing', {
	clicksToMoveEditor: 1,
    autoCancel: false,
});

selModels.selModel2 = Ext.create('Ext.selection.CheckboxModel', {
    listeners: {
        selectionchange: function(sm, selections) {
        	panel.grid2.down('#delete').setDisabled(selections.length === 0);
        }
    }
});

panel.grid2 = Ext.create('Ext.grid.Panel', {
	title: 'Category 2',
	id: 'gridCate2',
	frame: true,
	disabled: true,
    selModel: selModels.selModel2,
    store:store.cate2,
    style: {
          "margin-left": "auto",
          "margin-right": "auto",
      },
    width: 325,
    height: 450,   
    columns: [
        {text: "Description",  width: 110, sortable: true, dataIndex:'cate_desc', editor:{xtype : 'textfield' , allowBlank : false} },
        {text: "Comment",	   width: 90, sortable: true, dataIndex:'comment', editor:{xtype : 'textfield' , allowBlank : true}},
        {text: 'Manage Dtl',   xtype: 'actioncolumn', width: 90,  align: 'center', id: 'to12',sortable : false,
            items: [{ iconCls: 'my-icon', 
            	handler : function(grid, rowIndex, colIndex){
	    			   cate2 = grid.getStore().getAt(rowIndex).get('cate_id');
	    			   catedesc = grid.getStore().getAt(rowIndex).get('cate_desc');
	    			   Ext.getCmp('hcate2').setValue(catedesc);
	    			   store.cate3.load({
							url : 'showCate3.htm?id='+cate2
						});
	    			   Ext.getCmp('gridCate3').setDisabled(false);
	    			   
	    		   }
            }]
           }
    ],
    plugins: [plugins.rowEdit2],
	   dockedItems: [{
	       xtype: 'toolbar',
	       items: [{
	           iconCls: 'icon-add',
	           text: 'Create',
	           id: 'icreate2',
	           tooltip: 'Create new row',
	           scope: this,
//	           disabled: true,
	           handler: function(){
	        	   createCate2.show();
	           }
	       }, {
	           iconCls: 'icon-delete',
	           id:'idel2',
	           text: 'Delete',
	           disabled: true,
	           itemId: 'delete',
	           tooltip: 'Delete select row',
	           scope: this,
	           handler: function(){
//	        	   Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?',del);
	        	   Ext.MessageBox.show({
   	                title: 'Confirm',
   	                msg: 'Are you sure you want to do this?',
   	                buttons: Ext.MessageBox.YESNO,
   	                animateTarget: 'idel2',
   	                icon: Ext.MessageBox.QUESTION,
   	                fn: del2
   	            });
	           }
	       }, {
	           iconCls: 'icon-save',
	           text: 'Save All',
	           tooltip: 'Sync data from server',
//	           disabled: true,
	           itemId: 'save',
	           id:'isave2',
	           scope: this,
	           handler: function(){
	           	store.cate2.sync();
	           }
	       }]
	   }],
    columnLines: true,
    bbar: Ext.create('Ext.PagingToolbar', {
    	store:store.cate2,
        displayInfo: true,
        displayMsg: 'Displaying Category {0} - {1} of {2}',
        emptyMsg: "No Category to display",
//        plugins: Ext.create('Ext.ux.ProgressBarPager', {})
    })
});

function del2(btn){
	if(btn == 'yes'){
	
			var selection = panel.grid2.getView().getSelectionModel()
					.getSelection();
			var itemSelect = selection.length;
			var jsonArray = [];
			for ( var i = 0; i < itemSelect; i++) {
				store.cate3.remove(selection[i]);
				console.debug('Delete item where cate_id = '
						+ selection[i].data.cate_id);
				jsonArray.push(selection[i].data);
			}
		var params = {
       		method:'delete',
       		data : Ext.JSON.encode(jsonArray)
       	};
       	
       	Ext.Ajax.request({
       		url : 'deleteCate.htm',
       		params : params,
       		success : function (response,opts){
       			var responseObject = Ext.JSON.decode(response.responseText);
       			if(responseObject.success){
       				Ext.Msg.alert('Status','Delete Success',function(){
       					store.cate2.reload();
       					Ext.getCmp('gridCate3').setDisabled(true);
 	    			    Ext.getCmp('gridCate3').getStore().removeAll();
       				});
       			}
       			else{
       				Ext.Msg.alert('Warning','could not delete category!!' +responseObject.errorMessages);
       			}
       		}
       	});
	}
}

createCate2 = new Ext.create('Ext.window.Window', {
	title: 'Create Category 2',
	    height: 170,
	    width: 400,
	    animateTarget: 'icreate2',
	    modal : true,
	    resizable:false,
	    closeAction: 'hide',
	    items :[{
	            xtype:'form',
	            id:'cCate2',
	            height: 110,
	            items:[{
	            	xtype:'textfield',
	            	margin: '20 0 0 30',
	                allowBlank: false,
	                fieldLabel: 'Description <font color="red">*</font> ',
	                labelWidth: 90,
	                width: 300,
	                name: 'desc2',
	                id: 'desc2',
	                msgTarget: 'side',
	                emptyText: 'Description'
	            },
	            {
	            	xtype:'textfield',
	            	margin: '10 0 20 30',
	                allowBlank: true,
	                fieldLabel: 'Comment',
	                labelWidth: 90,
	                width: 300,
	                msgTarget: 'side',
	                name: 'comment2',
	                id: 'comment2',
	                emptyText: 'Comment'
	            },
	            {
	            	xtype:'hiddenfield',
	            	id: 'ref2',
	            }
	            ],
	    }],
        buttons:[{	
       		  text: 'Create',
      		  width:100,
      		  id: 'btn2',
             handler: function(){
//            	 var desc = Ext.getCmp('desc1').getValue();
//            	 var comment = Ext.getCmp('comment1').getValue();
            	 Ext.getCmp('ref2').setValue(cate1);
            	 var form = Ext.getCmp('cCate2').getForm();
            	 if(form.isValid()){
					 form.submit({
					 url: 'createCate2.htm',
					 waitTitle: 'Creating Category',
					 waitMsg: 'Please wait...',
					 standardSubmit: false,
	                 success: function(form, action) {
	                	 Ext.MessageBox.show({
	  						title: 'Information',
	  						msg: 'Category Has Been Created!',
	  						buttons: Ext.MessageBox.OK,
	  						icon: Ext.MessageBox.INFO,
	  						animateTarget: 'icreate2',
	  						fn: function(){createCate2.hide();store.cate2.reload();}
	  					});
	                    },
				        failure: function(form, action) {
//				            Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
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
 						animateTarget: 'btn2',
 					});
 				}
			}
           	}],
           	listeners:{
           		'beforehide':function(){
           			Ext.getCmp('cCate2').getForm().reset();
           			
           		}
           	}
		});

store.cate3 = Ext.create('Ext.data.JsonStore', {
    model: 'Category',
    id: 'cate3',
    pageSize: 7,
    autoLoad: false,
    proxy: {
        type: 'ajax',
        api: {
            read: 'showCate3.htm?id='+cate2,
            update: 'updateCate.htm',
        },
        reader: {
            type: 'json',
            root: 'records3',
            idProperty: 'cate_id',
            totalProperty: 'total3',
            successProperty: 'success',
            messageProperty: 'message'
        },
        writer: {
            type: 'json',          
            root: 'data',
            encode: true,
            writeAllFields: true
        },
        listeners: {
            exception: function(proxy, response, operation){
            	test = operation.getError();
                Ext.MessageBox.show({
                    title: 'REMOTE EXCEPTION',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    animateTarget: 'isave3',
                    buttons: Ext.Msg.OK,
                    fn: function(){location.reload()}
                });
            }
        }
    },
    listeners: {
    	write: function(store, record, operation, eOpts){
        	Ext.MessageBox.show({
	                title: 'Information',
	                msg: 'Save Successful!',
	                buttons: Ext.MessageBox.OK,
	                animateTarget: 'isave3',
	                icon: Ext.MessageBox.INFO,
	            });
        }
    }
});

plugins.rowEdit3 = Ext.create('Ext.grid.plugin.RowEditing', {
	clicksToMoveEditor: 1,
    autoCancel: false,
});

selModels.selModel3 = Ext.create('Ext.selection.CheckboxModel', {
    listeners: {
        selectionchange: function(sm, selections) {
        	panel.grid3.down('#delete').setDisabled(selections.length === 0);
        }
    }
});

panel.grid3 = Ext.create('Ext.grid.Panel', {
	title: 'Category 3',
	id: 'gridCate3',
	frame: true,
	disabled: true,
    selModel: selModels.selModel3,
    store:store.cate3,
    style: {
          "margin-left": "auto",
          "margin-right": "auto",
      },
    width: 325,
    height: 450,   
    columns: [
        {text: "Description",  width: 110, sortable: true, dataIndex:'cate_desc', editor:{xtype : 'textfield' , allowBlank : false} },
        {text: "Comment",	   width: 90, sortable: true, dataIndex:'comment', editor:{xtype : 'textfield' , allowBlank : true}},
        {text: 'Manage Dtl',   xtype: 'actioncolumn', width: 90,  align: 'center', id: 'to13',sortable : false,
            items: [{ iconCls: 'my-icon', 
              	 handler: function() {
            			 Ext.MessageBox.show({
            	                title: 'Warning',
            	                msg: 'Admin can not take log!',
            	                buttons: Ext.MessageBox.OK,
            	                animateTarget: 'to13',
            	                icon: Ext.MessageBox.WARNING
            	            });
            		 }
            }]
           }
    ],
    plugins: [plugins.rowEdit3],
	   dockedItems: [{
	       xtype: 'toolbar',
	       items: [{
	           iconCls: 'icon-add',
	           text: 'Create',
	           id: 'icreate3',
	           tooltip: 'Create new row',
	           scope: this,
//	           disabled: true,
	           handler: function(){
	        	   createCate3.show();
	           }
	       }, {
	           iconCls: 'icon-delete',
	           id:'idel3',
	           text: 'Delete',
	           disabled: true,
	           itemId: 'delete',
	           tooltip: 'Delete select row',
	           scope: this,
	           handler: function(){
//	        	   Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?',del);
	        	   Ext.MessageBox.show({
   	                title: 'Confirm',
   	                msg: 'Are you sure you want to do this?',
   	                buttons: Ext.MessageBox.YESNO,
   	                animateTarget: 'idel3',
   	                icon: Ext.MessageBox.QUESTION,
   	                fn: del3
   	            });
	           }
	       }, {
	           iconCls: 'icon-save',
	           text: 'Save All',
	           tooltip: 'Sync data from server',
//	           disabled: true,
	           itemId: 'save',
	           id:'isave3',
	           scope: this,
	           handler: function(){
	           	store.cate3.sync();
	           }
	       }]
	   }],
    columnLines: true,
    bbar: Ext.create('Ext.PagingToolbar', {
    	store:store.cate3,
        displayInfo: true,
        displayMsg: 'Displaying Category {0} - {1} of {2}',
        emptyMsg: "No Category to display",
        plugins: Ext.create('Ext.ux.ProgressBarPager', {})
    })
});

function del3(btn){
	if(btn == 'yes'){
	
			var selection = panel.grid3.getView().getSelectionModel()
					.getSelection();
			var itemSelect = selection.length;
			var jsonArray = [];
			for ( var i = 0; i < itemSelect; i++) {
				store.cate3.remove(selection[i]);
				console.debug('Delete item where cate_id = '
						+ selection[i].data.cate_id);
				jsonArray.push(selection[i].data);
			}
		var params = {
       		method:'delete',
       		data : Ext.JSON.encode(jsonArray)
       	};
       	
       	Ext.Ajax.request({
       		url : 'deleteCate.htm',
       		params : params,
       		success : function (response,opts){
       			var responseObject = Ext.JSON.decode(response.responseText);
       			if(responseObject.success){
       				Ext.Msg.alert('Status','Delete Success',function(){
       					store.cate3.reload();
       				});
       			}
       			else{
       				Ext.Msg.alert('Warning','could not delete category!!' +responseObject.errorMessages);
       			}
       		}
       	});
	}
}

createCate3 = new Ext.create('Ext.window.Window', {
	title: 'Create Category 3',
	    height: 170,
	    width: 400,
	    animateTarget: 'icreate3',
	    modal : true,
	    resizable:false,
	    closeAction: 'hide',
	    items :[{
	            xtype:'form',
	            id:'cCate3',
	            height: 110,
	            items:[{
	            	xtype:'textfield',
	            	margin: '20 0 0 30',
	                allowBlank: false,
	                fieldLabel: 'Description <font color="red">*</font> ',
	                labelWidth: 90,
	                width: 300,
	                name: 'desc3',
	                id: 'desc3',
	                msgTarget: 'side',
	                emptyText: 'Description'
	            },
	            {
	            	xtype:'textfield',
	            	margin: '10 0 20 30',
	                allowBlank: true,
	                fieldLabel: 'Comment',
	                labelWidth: 90,
	                width: 300,
	                msgTarget: 'side',
	                name: 'comment3',
	                id: 'comment3',
	                emptyText: 'Comment'
	            },
	            {
	            	xtype:'hiddenfield',
	            	id: 'ref3',
	            }
	            ],
	    }],
        buttons:[{	
       		  text: 'Create',
      		  width:100,
      		  id: 'btn3',
             handler: function(){
//            	 var desc = Ext.getCmp('desc1').getValue();
//            	 var comment = Ext.getCmp('comment1').getValue();
            	 Ext.getCmp('ref3').setValue(cate2);
            	 var form = Ext.getCmp('cCate3').getForm();
            	 if(form.isValid()){
					 form.submit({
					 url: 'createCate3.htm',
					 waitTitle: 'Creating Category',
					 waitMsg: 'Please wait...',
					 standardSubmit: false,
	                 success: function(form, action) {
	                	 Ext.MessageBox.show({
	  						title: 'Information',
	  						msg: 'Category Has Been Created!',
	  						buttons: Ext.MessageBox.OK,
	  						icon: Ext.MessageBox.INFO,
	  						animateTarget: 'icreate3',
	  						fn: function(){createCate3.hide();store.cate3.reload();}
	  					});
	                    },
				        failure: function(form, action) {
//				            Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
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
 						animateTarget: 'btn3',
 					});
 				}
			}
           	}],
           	listeners:{
           		'beforehide':function(){
           			Ext.getCmp('cCate3').getForm().reset();
           			
           		}
           	}
		});