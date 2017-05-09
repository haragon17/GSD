store = {};
panels = {};

Ext.onReady(function() {

	itmid = new Ext.form.Hidden({
		name : 'keyaccid',
		id : 'keyaccid'
	});

	Ext.define('keyAccModel', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'key_acc_id',
			type : 'int'
		}, {
			name : 'key_acc_name',
			type : 'string'
		}

		]
	});

	formHead = new Ext.Container({
    	border : 0,
        layout:'column',
        layoutConfig: {
            padding:'5',
            pack:'center',
            align:'middle'
          },
        width: 500,
        style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "70px"
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
			columnWidth:0.32,
			xtype:'splitter',
		},{	
				columnWidth : 0.13,
			    xtype: 'label',
			    text: 'Search :',
			    style: 'padding: 3px; font-size: 15px; ',
			    width: 10
			  },
			  {
				columnWidth : 0.35,
			    xtype: 'trigger',
			    triggerCls : Ext.baseCSSPrefix + 'form-search-trigger',
			    name: 'quickSearch',
			    id: 'quickSearch',
			    emptyText: 'Search KeyAccMng',
			    allowBlank: true,
			    style: 'margin-left: 5px',
			    listeners: {
	        		  specialkey: function(field, e){
	        			  if (e.getKey() == e.ENTER) {
	        			  this.onTriggerClick();
	        			  }
	        		  }
	            },
			    onTriggerClick: function(){
			    	Ext.Ajax.request({
						url : 'searchKeyAccMngParam.htm?search='+Ext.getCmp('quickSearch').getValue().toLowerCase(),
						success : function(response, opts) {
							store.keyAccMng.loadPage(1);
						}
					});
                }
			  },
			  ],
			  renderTo: document.body
    });
	
	store.keyAccMng = Ext.create('Ext.data.JsonStore', {
		model : 'keyAccModel',
		id : 'keyAccStore',
		pageSize : 11,
		autoLoad : true,
		proxy : {
			type : 'ajax',
			url : 'searchKeyAccMng.htm',
			reader : {
				type : 'json',
				root : 'records',
				idProperty : 'key_acc_id',
				totalProperty : 'total'
			}
		},
	});

	panels.keyAccMng = Ext.create('Ext.grid.Panel', {
		frame : true,
		title : 'Key Account Manager',
		bodyPadding : 5,
		layout : 'column',
		renderTo : document.body,
		width : 325,
		style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "5px"
        },
        tools : [ {
			xtype : 'button',
			text : 'Add',
			id : 'icreate',
			iconCls : 'icon-add',
			handler : function() {
				addKeyAccMng.show();
			}
		} ],
			store : store.keyAccMng,
			height : 400,
			columns : [ {
				text : 'Key Acount Manager',
				width : 190,
				sortable : true,
				dataIndex : 'key_acc_name'
			}, {
				text : 'Edit',
				xtype : 'actioncolumn',
				width : 60,
				align : 'center',
				id : 'edit',
				items : [ {
					iconCls : 'table-edit',
					handler : function(grid, rowIndex, colIndex) {
						key_acc_id = grid.getStore().getAt(rowIndex).get('key_acc_id');
						key_acc_name = grid.getStore().getAt(rowIndex).get('key_acc_name');
						
						Ext.getCmp('ekey_acc_name').setValue(key_acc_name);
						Ext.getCmp('ekey_acc_id').setValue(key_acc_id);
						editKeyAccMng.show();
						}
				} ]
			},
			{
				text : 'Delete',
				xtype : 'actioncolumn',
				width : 60,
				align : 'center',
				id : 'del',
				items : [ {
					iconCls : 'icon-delete',
					handler : function(grid, rowIndex, colIndex) {
						key_acc_id = grid.getStore().getAt(rowIndex).get(
								'key_acc_id');
						Ext.getCmp('keyaccid').setValue(key_acc_id);
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
			}
			],
//			listeners : {
//				cellClick : {
//					fn: function(td, cellIndex, record, tr, rowIndex, e, eOpts){
//						itm_id = store.item.getAt(e).get('itm_id');
//						itm_name = store.item.getAt(e).get('itm_name');
//						itm_desc = store.item.getAt(e).get('itm_desc');
//						
//						Ext.getCmp('etn').setValue(itm_name);
//						Ext.getCmp('etd').setValue(itm_desc);
//						}
//				}
//			}
		bbar : Ext.create('Ext.PagingToolbar', {
			store : store.keyAccMng,
			displayInfo : true,
			displayMsg : 'Displaying {0} - {1} of {2}',
			emptyMsg : "No Key Account Manager",
			plugins : Ext.create('Ext.ux.ProgressBarPager', {})
		})

	});
	
	editKeyAccMng = new Ext.create('Ext.window.Window', {
		title : 'Edit Key Account Manager',
		width : 450,
		animateTarget : 'edit',
		modal : true,
		resizable : false,
		closeAction : 'hide',
		items : [ {
			xtype : 'form',
			id : 'editform',
			items : [ {
				xtype : 'fieldset',
				title : 'Key Account Manager Information',
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
					fieldLabel : 'Name <font color="red">*</font> ',
					name : 'ekey_acc_name',
					id : 'ekey_acc_name',
					emptyText : 'Key Account Manager Name',
					labelWidth : 145,
					msgTarget : 'under',
					// vtype: 'alpha',
					maxLength : 40,
					maxLengthText : 'Maximum input 40 Character',
				}, {
					xtype : 'hidden',
					id : 'ekey_acc_id',
					name : 'ekey_acc_id'
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
								url : 'updateKeyAccMng.htm',
								waitTitle : 'Updating Key Account',
								waitMsg : 'Please wait...',
								standardSubmit : false,
								success : function(form, action) {
									Ext.MessageBox.show({
										title : 'Information',
										msg : 'Key Account Manager Has Been Updated!',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.INFO,
										animateTarget : 'ebtn',
										fn : function() {
											editKeyAccMng.hide();
											store.keyAccMng.reload();
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

	addKeyAccMng = new Ext.create('Ext.window.Window', {
		title : 'Add Key Acouunt Manager',
		id : 'addKeyAccMngForm',
		animateTarget : 'icreate',
		modal : true,
		resizable : false,
		closeAction : 'hide',
		// autoScroll:true,
		width : 450,
		items : [ {
			xtype : 'form',
			id : 'addform',
			items : [ {
				xtype : 'fieldset',
				title : 'Key Account Manager Information',
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
					xtype: 'textfield',
					allowBlank : false,
					fieldLabel : 'Name <font color="red">*</font> ',
					name : 'akey_acc_name',
					id : 'akey_acc_name',
					emptyText : 'Key Account Manager Name',
					labelWidth : 145,
					msgTarget : 'under',
					// vtype: 'alpha',
					maxLength : 40,
					maxLengthText : 'Maximum input 40 Character',
				} ],
			} ]
		} ],
		buttons : [
				{
					text : 'Add',
					id : 'btnRegist',
					handler : function() {
						var form = Ext.getCmp('addform').getForm();
						if (form.isValid()) {
							form.submit({
								url : 'addKeyAccMng.htm',
								waitTitle : 'Adding Key Account Manager',
								waitMsg : 'Please wait...',
								standardSubmit : false,
								success : function(form, action) {
									Ext.MessageBox.show({
										title : 'Information',
										msg : 'Key Account Manager Has Been Created!',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.INFO,
										animateTarget : 'btnRegist',
										fn : function() {
											addKeyAccMng.hide();
											store.keyAccMng.reload();
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
					url : 'deleteKeyAccMng.htm',
					params : {
						id : Ext.getCmp('keyaccid').getValue()
					},
					success : function(response, opts) {
						// window.location = "memberManagement.htm";
						store.keyAccMng.reload();
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