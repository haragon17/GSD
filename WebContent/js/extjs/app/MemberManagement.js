store= {};
panels= {};

Ext.onReady(function(){
	
	Ext.apply(Ext.form.field.VTypes, {
	    phone: function(val, field) {
	        var reg= /^[0-9,-]/i;
	        return reg.test(val);
	    },
	    phoneText: 'Must be a number with -',
	    phoneMask: /^[0-9,-]/i
	});
	
	Ext.apply(Ext.form.field.VTypes, {
		password: function(val, field) {
	        if (field.initialPassField) {
	            var pwd = Ext.getCmp('pass');
	            return (val == pwd.getValue());
	        }
	        return true;
	    },
	    passwordText: 'Passwords do not match'
	});
	
	usrid = new Ext.form.Hidden({
		name: 'usrid',
		id: 'usrid'
	});
	
	panels.search = Ext.create('Ext.form.Panel', {
	    title: 'Search Criteria',       
        autoWidth: true,
        id:'formPanel',
	    width: 750,
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
	                fieldLabel: 'User Name ',
	                name: 'usr_name',
	                labelWidth: 80,
	                margin: '0 0 10 0',
	                width: 260
	            	},{
		                fieldLabel: 'Email ',
		                name: 'email',
		                labelWidth: 80,
		                margin: '0 0 10 0',
		                width: 260
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
	                fieldLabel: 'First Name ',
	                name: 'fname',
	                labelWidth: 80,
	                margin: '0 0 10 0',
	                width: 260
	            	},{
		                fieldLabel: 'Last Name ',
		                name: 'lname',
		                labelWidth: 80,
		                margin: '0 0 10 0',
		                width: 260
	            	}]
	        }]
	    }],
	    
	    buttons: [{
	        text: 'Search',  
	        id: 'searchs',
	        handler : function() {
	        	var form = this.up('form').getForm();
	        	
	        	if (form.isValid()) {
	        		
	        		Ext.Ajax.request({
	        			url : 'searchMemberParam.htm'+getParamValues(),
	        			success: function(response, opts){
	        				store.searchMember.loadPage(1);
	        			}
	        		});
					
				} else {
					console.debug("MemberManagement.js Else conditions");
				}
			}
	    }
	    ,{
	        text: 'Reset',
	        handler: function() {
	            this.up('form').getForm().reset();

	        }
	    }]
	     
	});
	
	memberGrid = Ext.create('Ext.grid.Panel', {
		renderTo: document.body,
		title: 'Member',
		split: true,
		forceFit: true,
		loadMask: true,
	    autoWidth: true,
	    frame:true,
	    store: store.searchMember,
	    tools:[{
	    	xtype:'button',
	    	text:'Add Member',
	    	id:'icreate',
	    	iconCls:'icon-add',
	    	handler: function(){
	    		addMember.show();
	    	}
	    }],
	    style: {
	          "margin-left": "auto",
	          "margin-right": "auto",
		          "margin-top": "15px",
	          "margin-bottom": "auto"
	      },
	    width: 900,
	    height: 350,   
	    columns: [
	        {text: "User Name",		   flex:1.5, sortable: true, dataIndex:'usr_name' },
	        {text: "First Name",      flex:1.8, sortable: true, dataIndex:'fname'},
	        {text: "Last Name",      flex:1.8, sortable: true, dataIndex:'lname'},
	        {text: "Email",      flex:2, sortable: true, dataIndex:'email'},
	        {text: "Phone",      flex:1.5, sortable: true, dataIndex:'phone'},
	        {text: 'Edit',   xtype: 'actioncolumn', flex:1,  align: 'center', id: 'edit',
		            items: [{ iconCls : 'table-edit', 
		            	handler: function(grid, rowIndex, colIndex) {
		            		 usr_id = grid.getStore().getAt(rowIndex).get('usr_id');
		            		 usr_name = grid.getStore().getAt(rowIndex).get('usr_name');
		            		 fname = grid.getStore().getAt(rowIndex).get('fname');
		            		 lname = grid.getStore().getAt(rowIndex).get('lname');
		            		 email = grid.getStore().getAt(rowIndex).get('email');
//		            		 dob = grid.getStore().getAt(rowIndex).get('birthday');
		            		 phone = grid.getStore().getAt(rowIndex).get('phone');
		            		 type = grid.getStore().getAt(rowIndex).get('usr_type');
		            		 dept = grid.getStore().getAt(rowIndex).get('dept');
		            		 
		            		 Ext.getCmp('efname').setValue(fname);
		            		 Ext.getCmp('elname').setValue(lname);
		            		 Ext.getCmp('eemail').setValue(email);
//		            		 Ext.getCmp('edob').setValue(dob);
		            		 Ext.getCmp('ephone').setValue(phone);
		            		 Ext.getCmp('eusr_type').setValue({usr_type:type});
		            		 Ext.getCmp('eid').setValue(usr_id);
		            		 Ext.getCmp('edept').setValue(dept);
		            		 editMember.show();
		            		 }
		            }]
		        },
		        {text: 'Delete',   xtype: 'actioncolumn', flex:1,  align: 'center', id: 'del',
			            items: [{ iconCls: 'icon-delete', 
			            	handler: function(grid, rowIndex, colIndex) {
			            		 usr_id = grid.getStore().getAt(rowIndex).get('usr_id');
			            		 Ext.getCmp('usrid').setValue(usr_id);
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
	    	store: store.searchMember,
	        displayInfo: true,
	        displayMsg: 'Displaying Members {0} - {1} of {2}',
	        emptyMsg: "No Member to display",
	        plugins: Ext.create('Ext.ux.ProgressBarPager', {})
	    })
	});
	
});

Ext.define('mems', {
    extend: 'Ext.data.Model',
    fields: [
		{name: 'usr_id',         type: 'int'},     
		{name: 'usr_name',	 type: 'string'},
		{name: 'fname',     type: 'string'},
		{name: 'lname',     type: 'string'},
//		{name: 'birthday',     type: 'string'},
		{name: 'email',     type: 'string'},
		{name: 'phone',    type: 'string'},
		{name: 'dept',    type: 'string'},
		{name: 'usr_type', type: 'int'},
		{name: 'update_date', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		
     ]
});

store.searchMember = Ext.create('Ext.data.JsonStore', {
    model: 'mems',
    id: 'memstore',
    pageSize: 9,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'searchMember.htm',
        reader: {
            type: 'json',
            root: 'records',
            idProperty: 'usr_id',
            totalProperty: 'total'
        }
    },
//    sorters: [{
//        property: 'serv',
//        direction: 'ASC'
//    }]
});

var department = Ext.create('Ext.data.Store', {
	fields: ['name'],
	data : [
			{"name":"Publication"},
			{"name":"E-Studio"},
			{"name":"E-Studio_OTTO"},
			{"name":"E-Studio_MM"},
			{"name":"E-Studio_Masking"},
			{"name":"Catalog"},
			{"name":"Manager"}
	]
});

editMember = new Ext.create('Ext.window.Window', {
	title: 'Edit Member',
	    width: 500,
//	    height: 310,
	    animateTarget: 'edit',
	    modal : true,
	    resizable:false,
	    closeAction: 'hide',
	    items :[{
	            xtype:'form',
	            id:'editform',
	            items:[{
	                xtype:'fieldset',
	                title: 'User Information',	            
	                defaultType: 'textfield',
	                padding:10 ,
	                width:400,
	                autoHeight: true,
	                style: {
	                    "margin-left": "auto",
	                    "margin-right": "auto",
	                    "margin-top": "10px",
	                    "margin-bottom": "12px"
	                },
	                defaults: {anchor: '100%'},
	                items :[{
	           			allowBlank:false,
	           			fieldLabel: 'First Name <font color="red">*</font> ', 
	           			name: 'efname',
	           			id: 'efname',
	           			emptyText: 'First Name',
	           			labelWidth : 145,
	           			msgTarget: 'side',
	           			vtype: 'alpha',
	           			maxLength: 25,
	           			maxLengthText: 'Maximum input 25 Character',
	                     },
	                { allowBlank:false, 
	                	fieldLabel: 'Last Name <font color="red">*</font>  ', 
	                	name: 'elname', 
	                	id: 'elname',
	                	emptyText: 'Last Name', 
	                	labelWidth : 145,
	                	msgTarget: 'side',
	                	vtype: 'alpha',
	                	maxLength: 25,
	           		maxLengthText: 'Maximum input 25 Character',
	                },
//	                 { xtype: 'datefield',
//	                    fieldLabel: 'Date of Birth <font color="red">*</font>',
//	                    name: 'edob',
//	                    id: 'edob',
//	                    allowBlank: false,
//	                    maxValue: new Date(),
//	                    emptyText: 'Date of Birth',
//	                    format: 'Y-m-d',
//	                    editable: false,
//	                	labelWidth : 145, 
//	                	msgTarget: 'side',
//	                },
	                {
	               	 allowBlank:false,
	               	 fieldLabel: 'Email <font color="red">*</font>  ', 
	                 	 name: 'eemail', 
	                 	 id: 'eemail',
	                 	 emptyText: 'Email', 
	                 	 labelWidth : 145,
	                 	 msgTarget: 'side',
	                 	 vtype: 'email',
	                 	maxLength: 50,
	           		maxLengthText: 'Maximum input 50 Character',
	                },
	                {
	               	 allowBlank:true,
	               	 fieldLabel: 'Phone Number ', 
	                 	 name: 'ephone', 
	                 	 id: 'ephone',
	                 	 emptyText: 'Phone Number', 
	                 	 labelWidth : 145,
	                 	 msgTarget: 'side',
	                 	 vtype: 'phone',
	                 	maxLength: 20,
	           		maxLengthText: 'Maximum input 20 Character',
	                },
	                {
	               	 xtype: 'radiogroup',
	                    fieldLabel: 'User Type ',
	                    id: 'eusr_type',
	                    labelWidth : 145,
	                    // Arrange radio buttons into two columns, distributed vertically
	                    columns: 2,
//	                    vertical: true,
	                    horizon : true,
	                    items: [
							{ boxLabel: 'Admin', name: 'usr_type', inputValue: '0'},
							{ boxLabel: 'Manager', name: 'usr_type', inputValue: '1'},
							{ boxLabel: 'JMD', name: 'usr_type', inputValue: '2'},
							{ boxLabel: 'Staff', name: 'usr_type', inputValue: '3'},
	                    ]
	                },
	                {
	                	xtype : 'combobox',
	    				fieldLabel : 'Department <font color="red">*</font> ',
	    				name : 'edept',
	    				id : 'edept',
	    				queryMode : 'local',
	    				labelWidth : 145,
	    				emptyText : 'Department',
	    				allowBlank: false,
	    				editable : false,
	    				msgTarget: 'under',
	    				store : department,
	    				valueField : 'name',
	    				displayField : 'name',
	                },
	                {
	                	xtype: 'hidden',
		    	    	id: 'eid',
		    	    	name: 'eid'
	                }
	                   ]
	           }],
	    }],
        buttons:[{
        	text: 'Reset',
        	width:100,
        	handler: function(){
        		Ext.getCmp('editform').getForm().reset();
        	}
        },{	
       		  text: 'Update',
      		  width:100,
      		  id: 'ebtn',
             handler: function(){
            	 var form = Ext.getCmp('editform').getForm();
            	 if(form.isValid()){
					 form.submit({
					 url: 'updateMember.htm',
					 waitTitle: 'Update Member',
					 waitMsg: 'Please wait...',
					 standardSubmit: true,
	                 failure: function(form, action) {
	                	 Ext.MessageBox.show({
	  						title: 'Information',
	  						msg: 'Member Has Been Update!',
	  						buttons: Ext.MessageBox.OK,
	  						icon: Ext.MessageBox.INFO,
	  						animateTarget: 'ebtn',
	  						fn: function(){editMember.hide();}
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
           		}
           	}
		});

addMember = new Ext.create('Ext.window.Window', {
	title: 'Add Member',
	id: 'registForm',
    animateTarget: 'icreate',
    modal : true,
    resizable:false,
    closeAction: 'hide',
    autoScroll:true,
    width: 500,

    items:[{
        xtype:'fieldset',
        title: 'Login Information',	            
        defaultType: 'textfield',
        padding:10 ,
        width:400,
        autoHeight: true,
        style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "10px",
            "margin-bottom": "auto"
        },
        defaults: {anchor: '100%'},
        items :[{
			allowBlank:false,
			fieldLabel: 'User Name <font color="red">*</font> ', 
			name: 'username',
			id: 'username',
			emptyText: 'userName',
			labelWidth : 145,
			msgTarget: 'under',
			vtype: 'alphanum',
//			minLength: 6,
//			minLengthText: 'Minimum input 6 Character',
			maxLength: 12,
			maxLengthText: 'Maximum input 12 Character',
			listeners: {
       		 'blur': function(e){
      		 
       			 var userName = Ext.getCmp('username').getValue();
       			 Ext.Ajax.request({
       				url : 'chkUserName.htm',
       				params: {records : userName},
       				success: function(response, opts){
       					var responseOject = Ext.decode(response.responseText);
       					if(responseOject.records[0].usr_id != 0){
       						Ext.getCmp('username').setValue('');
       						Ext.getCmp('username').markInvalid('"'+userName+'" has been used');
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
        { allowBlank:false, 
        	fieldLabel: 'Password <font color="red">*</font>  ', 
        	name: 'pass', 
        	id: 'pass',
        	emptyText: 'Password', 
        	inputType: 'password',
        	labelWidth : 145,
        	vtype: 'alphanum',
        	msgTarget: 'under',
        	minLength: 6,
           	minLengthText: 'Minimum input 6 Character',
           	maxLength: 12,
           	maxLengthText: 'Maximum input 12 Character'
           	},
         { allowBlank:false, 
        	fieldLabel: 'Confirm Password <font color="red">*</font>  ', 
        	name: 'pass-cfrm',
        	id: 'pass-cfrm',
        	emptyText: 'Confirm Password', 
        	inputType: 'password',
        	labelWidth : 145, 
        	msgTarget: 'under',
           	vtype: 'password',
            initialPassField: 'pass'
        	}
        ]
 },
 {
     xtype:'fieldset',
     title: 'User Information',	            
     defaultType: 'textfield',
     padding:10 ,
     width:400,
     autoHeight: true,
     style: {
         "margin-left": "auto",
         "margin-right": "auto",
         "margin-top": "10px",
         "margin-bottom": "10px"
     },
     defaults: {anchor: '100%'},
     items :[{
			allowBlank:false,
			fieldLabel: 'First Name <font color="red">*</font> ', 
			name: 'fname',
			id: 'afname',
			emptyText: 'First Name',
			labelWidth : 145,
			msgTarget: 'side',
			vtype: 'alpha',
			maxLength: 25,
			maxLengthText: 'Maximum input 25 Character',
          },
     { allowBlank:false, 
     	fieldLabel: 'Last Name <font color="red">*</font>  ', 
     	name: 'lname', 
     	id: 'alname',
     	emptyText: 'Last Name', 
     	labelWidth : 145,
     	msgTarget: 'side',
     	vtype: 'alpha',
     	maxLength: 25,
		maxLengthText: 'Maximum input 25 Character',
     },
//      { xtype: 'datefield',
//         fieldLabel: 'Date of Birth <font color="red">*</font>',
//         name: 'dob',
//         id: 'adob',
//         allowBlank: false,
//         maxValue: new Date(),
//         emptyText: 'Date of Birth',
//         format: 'Y-m-d',
//         editable: false,
//     	labelWidth : 145, 
//     	msgTarget: 'side',
//     },
     {
    	 allowBlank:false,
    	 fieldLabel: 'Email <font color="red">*</font>  ', 
      	 name: 'email', 
      	 id: 'aemail',
      	 emptyText: 'Email', 
      	 labelWidth : 145,
      	 msgTarget: 'side',
      	 vtype: 'email',
      	maxLength: 50,
		maxLengthText: 'Maximum input 50 Character',
     },
     {
    	 allowBlank:true,
    	 fieldLabel: 'Phone Number ', 
      	 name: 'phone', 
      	 id: 'aphone',
      	 emptyText: 'Phone Number', 
      	 labelWidth : 145,
      	 msgTarget: 'side',
      	 vtype: 'phone',
      	maxLength: 20,
		maxLengthText: 'Maximum input 20 Character',
     },
     {
    	 xtype : 'combobox',
			fieldLabel : 'Department <font color="red">*</font>  ',
			name : 'adept',
			id : 'adept',
			queryMode : 'local',
			labelWidth : 145,
			emptyText : 'Department',
			allowBlank: false,
			editable : false,
			msgTarget: 'under',
			store : department,
			valueField : 'name',
			displayField : 'name',
     },
     {
    	 xtype: 'radiogroup',
         fieldLabel: 'User Type <font color="red">*</font>  ',
         labelWidth : 145,
         id:'type',
         // Arrange radio buttons into two columns, distributed vertically
         columns: 2,
//       vertical: true,
         horizon : true,
         items: [
            { boxLabel: 'Admin', name: 'usr_type', inputValue: '0'},
            { boxLabel: 'Manager', name: 'usr_type', inputValue: '1'},
            { boxLabel: 'JMD', name: 'usr_type', inputValue: '2'},
			{ boxLabel: 'Staff', name: 'usr_type', inputValue: '3', checked: true },
         ]
     },
     
        ]
}],
buttons: [{
  text: 'Add',
  id: 'btnRegist',
  handler: function(){
	  var username = Ext.getCmp('username');
	  var pass = Ext.getCmp('pass');
	  var passc = Ext.getCmp('pass-cfrm');
	  var fname = Ext.getCmp('afname');
	  var lname = Ext.getCmp('alname');
	  var dept = Ext.getCmp('adept');
	  var email = Ext.getCmp('aemail');
	  var phone = Ext.getCmp('aphone');
	  
	  if(username.validate() && pass.validate() && passc.validate() && fname.validate() && 
			  lname.validate() && email.validate() && phone.validate()){
		  var box1 = Ext.MessageBox.show({
              title: 'Adding Member',
              msg: 'Please wait...',
              wait: true,
              animateTarget: 'btnRegist',
          });
		 Ext.Ajax.request({
			url : 'register.htm',
			params: {username: username.getValue(),
				pass: pass.getValue(),
				fname: fname.getValue(),
				lname: lname.getValue(),
				dept: dept.getValue(),
				email: email.getValue(),
				phone: phone.getValue(),
				usr_type: Ext.getCmp('type').getValue().usr_type
			},
			success: function(response, opts){
				box1.hide();
				var responseOject = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					title: 'Information',
					msg: 'Register Successful!',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.INFO,
					fn: function(){addMember.hide();location.reload();},
					animateTarget: 'btnRegist',
				});
			},
			failure: function(response, opts){
				box1.hide();
				var responseOject = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					title: 'Information',
					msg: 'Register Successful!',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.INFO,
					fn: function(){addMember.hide();location.reload();},
					animateTarget: 'btnRegist',
				});
			}
		});
	  }else{
		  Ext.MessageBox.show({
				title: 'Failed',
				msg: ' Please Insert All Field',
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.ERROR,
				animateTarget: 'btnRegist',
			});
	  }
  }
},{
	  text: 'Reset',
	  handler: function(){
		  	Ext.getCmp('username').reset();
			Ext.getCmp('pass').reset();
			Ext.getCmp('pass-cfrm').reset();
			Ext.getCmp('afname').reset();
			Ext.getCmp('alname').reset();
			Ext.getCmp('adept').reset();
			Ext.getCmp('aemail').reset();
			Ext.getCmp('aphone').reset();
	  }
	}],
listeners:{
		'beforehide':function(){
			Ext.getCmp('aphone').focus(false,0);
			Ext.getCmp('username').reset();
			Ext.getCmp('pass').reset();
			Ext.getCmp('pass-cfrm').reset();
			Ext.getCmp('afname').reset();
			Ext.getCmp('alname').reset();
			Ext.getCmp('adept').reset();
			Ext.getCmp('aemail').reset();
			Ext.getCmp('aphone').reset();
		}
	}
});

function confirmChk(btn){
	if(btn == "yes"){
	Ext.Ajax.request({
		url : 'deleteMember.htm',
		params: {id: Ext.getCmp('usrid').getValue()},
		success: function(response, opts){
			window.location = "memberManagement.htm";
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
	
	for(param in panels.search.getValues()){
		
		count+=panels.search.getValues()[param].length;
		
		if(i==1){
			queryStr+=param+"="+panels.search.getValues()[param];
		}else{
			queryStr+="&"+param+"="+panels.search.getValues()[param];
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