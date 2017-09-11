store = {};
panels = {};

Ext.onReady(function() {

	itmid = new Ext.form.Hidden({
		name : 'itmid',
		id : 'itmid'
	});

	Ext.define('cusModel', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'itm_id',
			type : 'int'
		}, {
			name : 'itm_name',
			type : 'string'
		}, {
			name : 'itm_desc',
			type : 'string'
		}

		]
	});

//	formHead = new Ext.Container({
//    	border : 0,
//        layout:'column',
//        layoutConfig: {
//            padding:'5',
//            pack:'center',
//            align:'middle'
//          },
//        width: 560,
//        style: {
//            "margin-left": "auto",
//            "margin-right": "auto",
//            "margin-top": "70px"
//        },
//        defaults : {
//            xtype:'container',
//            layout: 'form',
//            layoutConfig: {
//                padding:'5',
//                pack:'center',
//                align:'middle'
//              },
//            columnWidth: 1,
//            labelWidth: 0,
//            anchor:'100%',
//            hideBorders : false,
//           
//        },
//		items: [{
//			columnWidth:0.57,
//			xtype:'splitter',
//		},{	
//				columnWidth : 0.12,
//			    xtype: 'label',
//			    text: 'Search :',
//			    style: 'padding: 3px; font-size: 15px; ',
//			    width: 10
//			  },
//			  {
//				columnWidth : 0.3,
//			    xtype: 'trigger',
//			    triggerCls : Ext.baseCSSPrefix + 'form-search-trigger',
//			    name: 'quickSearch',
//			    id: 'quickSearch',
//			    emptyText: 'Search Items',
//			    allowBlank: true,
//			    style: 'margin-left: 5px',
//			    listeners: {
//	        		  specialkey: function(field, e){
//	        			  if (e.getKey() == e.ENTER) {
//	        			  this.onTriggerClick();
//	        			  }
//	        		  }
//	            },
//			    onTriggerClick: function(){
//			    	Ext.Ajax.request({
//						url : 'searchItemParam.htm?search='+Ext.getCmp('quickSearch').getValue().toLowerCase(),
//						success : function(response, opts) {
//							store.item.loadPage(1);
//						}
//			    	});
//                }
//			  },
//			  ],
//			  renderTo: document.body
//    });
	
	store.item = Ext.create('Ext.data.JsonStore', {
		model : 'cusModel',
		id : 'cusStore',
		pageSize : 30,
		autoLoad : true,
		proxy : {
			type : 'ajax',
			url : 'showItem.htm?id=0',
			reader : {
				type : 'json',
				root : 'records',
				idProperty : 'itm_id',
				totalProperty : 'total'
			}
		},
		sorters: [{
	         property: 'itm_name',
	         direction: 'ASC'
	     }]
	});

	panels.itemList = Ext.create('Ext.ux.LiveFilterGridPanel', {
		frame : true,
		id : 'itemPanel',
		title : 'GSD Item List',
//		bodyPadding : 5,
//		layout : 'column',
		renderTo : document.body,
		indexes : ['itm_name','itm_desc'],
		width : 700,
		height : 500,
		style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "75px"
        },
        tools : [ {
			xtype : 'button',
			text : 'Add Item',
			id : 'icreate',
			iconCls : 'icon-add',
			handler : function() {
				addItem.show();
			}
		} ],
			store : store.item,
			columns : [ {
				text : 'Item Name',
				flex : 4,
				sortable : true,
				dataIndex : 'itm_name'
			}, {
				text : 'Item Description',
				flex : 4,
				sortable : true,
				dataIndex : 'itm_desc'
			}
			, {
				text : 'Edit',
				xtype : 'actioncolumn',
				flex : 1,
				align : 'center',
				id : 'edit',
				items : [ {
					iconCls : 'table-edit',
					handler : function(grid, rowIndex, colIndex) {
						itm_id = grid.getStore().getAt(rowIndex).get('itm_id');
						itm_name = grid.getStore().getAt(rowIndex).get('itm_name');
						itm_desc = grid.getStore().getAt(rowIndex).get('itm_desc');
						
						Ext.getCmp('eitm_name').setValue(itm_name);
						Ext.getCmp('eitm_desc').setValue(itm_desc);
						Ext.getCmp('eitm_id').setValue(itm_id);
						editItem.show();
						}
				} ]
			},
			{
				text : 'Delete',
				xtype : 'actioncolumn',
				flex : 1,
				align : 'center',
				id : 'del',
				items : [ {
					iconCls : 'icon-delete',
					handler : function(grid, rowIndex, colIndex) {
						itm_id = grid.getStore().getAt(rowIndex).get(
								'itm_id');
						Ext.getCmp('itmid').setValue(itm_id);
//						Ext.MessageBox.show({
//							title : 'Confirm',
//							msg : 'Are you sure you want to delete this?',
//							buttons : Ext.MessageBox.YESNO,
//							animateTarget : 'del',
//							fn : confirmChk,
//							icon : Ext.MessageBox.QUESTION
//						});
						Ext.MessageBox.show({
							title : 'Information',
							msg : 'Please contact IT Department for delete !',
							buttons : Ext.MessageBox.OK,
							animateTarget : 'del',
							icon : Ext.MessageBox.INFO
						});
					}
				} ]
			}
			],
			listeners: {
				viewready: function (grid) {
			        var view = grid.view;
			        this.toolTip = Ext.create('Ext.tip.ToolTip', {
			            target: view.el,
			            delegate: view.cellSelector,
//			            width: 'auto',
//			            autoWidth: true,
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
//			                        tip.update("<b>" + columnTitle + ":</b> " + columnText);
			                        tip.update("<b>"+(columnText.replace(/\r\n|\n/gi, "<br>"))+"</b>");
			                    } else {
			                        return false;
			                    }
			                }
			            }
			        });
		        }
		    },
	});
	
	editItem = new Ext.create('Ext.window.Window', {
		title : 'Edit Item',
		width : 450,
//		height : 260,
		animateTarget : 'edit',
		modal : true,
		resizable : false,
		closeAction : 'hide',
		items : [ {
			xtype : 'form',
			id : 'editform',
			items : [ {
				xtype : 'fieldset',
				title : 'Item Information',
				defaultType : 'textfield',
				padding : 10,
				width : 400,
				autoHeight : true,
				style : {
					"margin-left" : "auto",
					"margin-right" : "auto",
					"margin-top" : "10px",
					"margin-bottom" : "12px"
				},
				defaults : {
					anchor : '100%'
				},
				items : [ {
					allowBlank : false,
					fieldLabel : 'Item Name <font color="red">*</font> ',
					name : 'eitm_name',
					id : 'eitm_name',
					emptyText : 'Item Name',
					labelWidth : 145,
					msgTarget : 'under',
					// vtype: 'alpha',
					maxLength : 100,
					maxLengthText : 'Maximum input 100 Character',
					listeners: {
		           		 'blur': function(e){
		           			var itm_name = Ext.getCmp('eitm_name').getValue();
		           			var itm_id = Ext.getCmp('eitm_id').getValue();
		           			 Ext.Ajax.request({
		           				url : 'chkItmName.htm',
		           				params: {records : itm_name},
		           				success: function(response, opts){
		           					var responseOject = Ext.decode(response.responseText);
		           					if(responseOject.records[0].itm_id != 0){
		           						if(responseOject.records[0].itm_id != itm_id){
			           						Ext.getCmp('eitm_name').setValue('');
			           						Ext.getCmp('eitm_name').markInvalid('"'+itm_name+'" has been used');
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
				},  {
					xtype : 'textareafield',
					allowBlank : true,
					fieldLabel : 'Item Description ',
					name : 'eitm_desc',
					id : 'eitm_desc',
					emptyText : 'Description',
					labelWidth : 145,
					msgTarget : 'under',
					maxLength : 100,
					maxLengthText : 'Maximum input 100 Character',
				}, {
					xtype : 'hidden',
					id : 'eitm_id',
					name : 'eitm_id'
				} ]
			} ],
		} ],
		buttons : [
				{
					text : 'Update',
					width : 100,
					id : 'ebtn',
					handler : function() {
						var form = Ext.getCmp('editform').getForm();
						if (form.isValid()) {
							form.submit({
								url : 'updateItem.htm',
								waitTitle : 'Update Item',
								waitMsg : 'Please wait...',
								standardSubmit : false,
								success : function(form, action) {
									Ext.MessageBox.show({
										title : 'Information',
										msg : 'Item Has Been Update!',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.INFO,
										animateTarget : 'ebtn',
										fn : function() {
											editItem.hide();
											store.item.reload();
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
				},{
					text : 'Reset',
					width : 100,
					handler : function() {
						Ext.getCmp('editform').getForm().reset();
					}
				} ],
		listeners : {
			'beforehide' : function() {
				Ext.getCmp('editform').getForm().reset();
			}
		}
	});

	addItem = new Ext.create('Ext.window.Window', {
		title : 'Add Item',
		id : 'addItmForm',
		animateTarget : 'icreate',
		modal : true,
		resizable : false,
		closeAction : 'hide',
		// autoScroll:true,
		width : 450,
//		height : 260,

		items : [ {
			xtype : 'form',
			id : 'addform',
			items : [ {
				xtype : 'fieldset',
				title : 'Item Information',
				defaultType : 'textfield',
				padding : 10,
				width : 400,
				autoHeight : true,
				style : {
					"margin-left" : "auto",
					"margin-right" : "auto",
					"margin-top" : "10px",
					"margin-bottom" : "12px"
				},
				defaults : {
					anchor : '100%'
				},
				items : [ {
					allowBlank : false,
					fieldLabel : 'Item Name <font color="red">*</font> ',
					name : 'aitm_name',
					id : 'aitm_name',
					emptyText : 'Item Name',
					labelWidth : 145,
					msgTarget : 'under',
					// vtype: 'alpha',
					maxLength : 100,
					maxLengthText : 'Maximum input 100 Character',
					listeners: {
		           		 'blur': function(e){
		           			var itm_name = Ext.getCmp('aitm_name').getValue();
		           			 Ext.Ajax.request({
		           				url : 'chkItmName.htm',
		           				params: {records : itm_name},
		           				success: function(response, opts){
		           					var responseOject = Ext.decode(response.responseText);
		           					if(responseOject.records[0].itm_id != 0){
		           						Ext.getCmp('aitm_name').setValue('');
		           						Ext.getCmp('aitm_name').markInvalid('"'+itm_name+'" has been used');
		           					}
		           				},
		           				failure: function(response, opts){
		           					var responseOject = Ext.util.JSON.decode(response.responseText);
		           					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
		           				}
		           			});
		           		 }
		           	 }
				},  {
					xtype : 'textareafield',
					allowBlank : true,
					fieldLabel : 'Item Description ',
					name : 'aitm_desc',
					id : 'aitm_desc',
					emptyText : 'Description',
					labelWidth : 145,
					msgTarget : 'under',
					maxLength : 100,
					maxLengthText : 'Maximum input 100 Character',
				} ]
			} ],
		} ],
		buttons : [
				{
					text : 'Add',
					id : 'btnRegist',
					handler : function() {
						var form = Ext.getCmp('addform').getForm();
						if (form.isValid()) {
							form.submit({
								url : 'addItem.htm',
								waitTitle : 'Adding Item',
								waitMsg : 'Please wait...',
								standardSubmit : false,
								success : function(form, action) {
									Ext.MessageBox.show({
										title : 'Information',
										msg : 'Item Has Been Created!',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.INFO,
										animateTarget : 'btnRegist',
										fn : function() {
											addItem.hide();
											store.item.reload();
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
						} else {
							Ext.MessageBox.show({
								title : 'Failed',
								msg : ' Please Insert All Field',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR,
								animateTarget : 'btnRegist',
							});
						}
					}
				},{
					text : 'Reset',
					handler : function() {
						Ext.getCmp('addform').getForm().reset();
					}
				} ],
		listeners : {
			'beforehide' : function() {
				Ext.getCmp('addform').getForm().reset();
			}
		}
	});
	
});

function confirmChk(btn) {
	if (btn == "yes") {
		Ext.Ajax
				.request({
					url : 'deleteItem.htm',
					params : {
						id : Ext.getCmp('itmid').getValue()
					},
					success : function(response, opts) {
						// window.location = "memberManagement.htm";
						store.item.reload();
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