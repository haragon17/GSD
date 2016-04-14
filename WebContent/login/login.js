Ext.onReady(function(){ 

	Ext.getCmp('j_username').focus(false, 200);
	
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
	
	mainPanel = Ext.create('Ext.panel.Panel', {
        title: '<font color="red">graphic solutions</font> <font color="darkgrey">digital</font>',
        layout: {
            type: 'hbox',
            pack: 'center',
            align: 'middle'
            
        },
        height: window.screen.height-70,
        tools:[{
            type:'refresh',
            tooltip: 'Refresh form Data',
            // hidden:true,
            handler: function(event, toolEl, panelHeader) {
                // refresh logic
                window.location.reload();
            }
        }],
        renderTo: Ext.getBody()
    });
	
	Ext.EventManager.onWindowResize(function () {
	    mainPanel.doComponentLayout();
	});

	mainPanel.add([loginForm]);
	
});

var	loginForm = Ext.create('Ext.form.Panel', {
    title: 'Login',
    renderTo: Ext.getBody(),
    frame:true,
    width: 320,
    bodyPadding: 10,
    
    defaultType: 'textfield',
    defaults: {
        anchor: '100%'
    },
    style: {
          "margin-left": "auto",
          "margin-right": "auto",
          "margin-top": "auto",
          "margin-bottom": "auto"
      },
    items: [
        {
            allowBlank: false,
            fieldLabel: 'User Name',
            name: 'j_username',
            id: 'j_username',
            emptyText: 'UserName'
        },
        {
            allowBlank: false,
            fieldLabel: 'Password',
            name: 'j_password',
            id: 'j_password',
            emptyText: 'Password',
            inputType: 'password',
            listeners: {
      		  specialkey: function(field, e){
      			  if (e.getKey() == e.ENTER) {
      				  login.click();
      			  }
      		  }
          },
        },
        {
            xtype:'checkbox',
            fieldLabel: 'Remember me',
            name: '_spring_security_remember_me',
            id: '_spring_security_remember_me'
        },
        {
        	xtype:'tbtext',
        	id:'forgot',
        	text:'<a href="javascript:forgotPassword();"><font color="grey">forgot password?</font></a>',
        	margin: '0 0 0 180',
        }
    ],
    
    buttons: [
        { text:'Register',
        	id: 'regist',
        	handler: function(){
        		regist.show();
        	}
        },
        { text:'Login' ,
        	id: 'login',
        	handler: function(){
        		var form = this.up('form').getForm();
	            if (form.isValid()) {
	            	form.submit({
						 url: '../j_spring_security_check',
						 standardSubmit: true,
	          			});
	            }else{
	            	Ext.MessageBox.show({
	                    title: 'Error',
	                    msg: 'Please insert Username and Password!',
	                    buttons: Ext.MessageBox.OK,
	                    fn: function(){Ext.getCmp('j_username').focus(false, 200);},
	                    icon: Ext.MessageBox.ERROR
	                });
	            }
        	}
        }
    ]
});

forget = new Ext.create('Ext.window.Window', {
	title: 'Forgot Password?',
	    height: 170,
	    width: 400,
	    animateTarget: 'forgot',
	    modal : true,
	    resizable:false,
	    closeAction: 'hide',
	    items :[{
	            xtype:'form',
	            id:'forget',
	            height: 110,
	            items:[{
	            	xtype:'textfield',
	            	margin: '20 0 0 30',
	                allowBlank: false,
	                fieldLabel: 'User Name',
	                labelWidth: 80,
	                width: 300,
	                name: 'fusername',
	                id: 'fusername',
	                msgTarget: 'side',
	                minLength: 6,
	                vtype: 'alphanum',
	                maxLength: 12,
	                emptyText: 'UserName'
	            },
	            {
	            	xtype:'textfield',
	            	margin: '10 0 20 30',
	                allowBlank: false,
	                fieldLabel: 'E-mail',
	                labelWidth: 80,
	                width: 300,
	                msgTarget: 'side',
	                name: 'femail',
	                id: 'femail',
	                vtype: 'email',
	                emptyText: 'Email'
	            }
	            ],
	    }],
        buttons:[{	
       		  text: 'Next',
      		  width:100,
      		  id: 'btn',
             handler: function(){
            	 var usr_name = Ext.getCmp('fusername').getValue();
            	 var mail = Ext.getCmp('femail').getValue();
            	 var form = Ext.getCmp('forget').getForm();
            	 if(form.isValid()){
            		 var box = Ext.MessageBox.show({
                         title: 'Sending Password to your E-mail',
                         msg: 'Please wait...',
                         wait: true,
                         animateTarget: 'btn',
                     });
            		 Ext.Ajax.request({
            			url : '../forgotPass.htm',
            			params: {usr_name : usr_name, email: mail},
            			success: function(response, opts){
            				box.hide();
	            		        var responseOject = Ext.decode(response.responseText);
		        				if(responseOject.user[0].usr_name == null || responseOject.user[0].usr_name == ""){
		      		   			Ext.MessageBox.show({
		                            title: 'Failed',
		                            msg: ' UserName or E-mail Wrong!',
		                            buttons: Ext.MessageBox.OK,
		                            icon: Ext.MessageBox.ERROR,
		                            animateTarget: 'btn',
		                            fn: function(){form.reset()}
		                        });
		        				}else{
			        						Ext.MessageBox.show({
					                            title: 'Information',
					                            msg: ' Your new password have been send to your E-mail',
					                            buttons: Ext.MessageBox.OK,
					                            icon: Ext.MessageBox.INFO,
					                            animateTarget: 'btn',
					                            fn: function(){form.reset();forget.hide();}
				        						});
// }
// });
		        				}
            			},
           				failure: function(response, opts){
           					var responseOject = Ext.util.JSON.decode(response.responseText);
           					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
           				}
          			});
            	 }else {
 					Ext.MessageBox.show({
 						title: 'Failed',
 						msg: ' Please Insert All Field',
 						buttons: Ext.MessageBox.OK,
 						icon: Ext.MessageBox.ERROR,
 						animateTarget: 'btn',
 					});
 				}
			}
           	}],
           	listeners:{
           		'beforehide':function(){
           			Ext.getCmp('forget').getForm().reset();
           		}
           	}
		});

function forgotPassword(){
	forget.show();
}

regist = new Ext.create('Ext.window.Window', {
		title: 'Register',
		id: 'registForm',
	    animateTarget: 'regist',
	    modal : true,
	    resizable:false,
	    closeAction: 'hide',
	    autoScroll:true,
	    width: 500,
	    height: 500,

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
				minLength: 6,
				vtype: 'alphanum',
				minLengthText: 'Minimum input 6 Character',
				maxLength: 12,
				maxLengthText: 'Maximum input 12 Character',
				listeners: {
           		 'blur': function(e){
          		 
           			 var userName = Ext.getCmp('username').getValue();
           			 Ext.Ajax.request({
           				url : '../chkUserName.htm',
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
             "margin-bottom": "auto"
         },
         defaults: {anchor: '100%'},
         items :[{
				allowBlank:false,
				fieldLabel: 'First Name <font color="red">*</font> ', 
				name: 'fname',
				id: 'fname',
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
         	id: 'lname',
         	emptyText: 'Last Name', 
         	labelWidth : 145,
         	msgTarget: 'side',
         	vtype: 'alpha',
         	maxLength: 25,
			maxLengthText: 'Maximum input 25 Character',
         },
          { xtype: 'datefield',
             fieldLabel: 'Date of Birth <font color="red">*</font>',
             name: 'dob',
             id: 'dob',
             allowBlank: false,
             maxValue: new Date(),
             emptyText: 'Date of Birth',
             format: 'Y-m-d',
             editable: false,
         	labelWidth : 145, 
         	msgTarget: 'side',
         },
         {
        	 allowBlank:false,
        	 fieldLabel: 'Email <font color="red">*</font>  ', 
          	 name: 'email', 
          	 id: 'email',
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
          	 id: 'phone',
          	 emptyText: 'Phone Number', 
          	 labelWidth : 145,
          	 msgTarget: 'side',
          	 vtype: 'phone',
          	maxLength: 20,
			maxLengthText: 'Maximum input 20 Character',
         }
	        ]
  }],
  buttons: [{
	  text: 'Reset',
	  handler: function(){
		  	Ext.getCmp('username').reset();
			Ext.getCmp('pass').reset();
			Ext.getCmp('pass-cfrm').reset();
			Ext.getCmp('fname').reset();
			Ext.getCmp('lname').reset();
			Ext.getCmp('dob').reset();
			Ext.getCmp('email').reset();
			Ext.getCmp('phone').reset();
	  }
  },{
      text: 'Register',
      id: 'btnRegist',
      handler: function(){
    	  var username = Ext.getCmp('username');
    	  var pass = Ext.getCmp('pass');
    	  var passc = Ext.getCmp('pass-cfrm');
		  var fname = Ext.getCmp('fname');
		  var lname = Ext.getCmp('lname');
		  var dob = Ext.getCmp('dob');
		  var email = Ext.getCmp('email');
		  var phone = Ext.getCmp('phone');
		  
		  //alert(dob.getValue());
		  
		  if(username.validate() && pass.validate() && passc.validate() && fname.validate() && 
				  lname.validate() && dob.validate() && email.validate() && phone.validate()){
			  var box1 = Ext.MessageBox.show({
                  title: 'Registing Your Account',
                  msg: 'Please wait...',
                  wait: true,
                  animateTarget: 'btnRegist',
              });
			 Ext.Ajax.request({
				url : '../register.htm',
				params: {username: username.getValue(),
					pass: pass.getValue(),
					fname: fname.getValue(),
					lname: lname.getValue(),
					dob: dob.getValue(),
					email: email.getValue(),
					phone: phone.getValue(),
					usr_type: 1
				},
				success: function(response, opts){
					box1.hide();
					var responseOject = Ext.decode(response.responseText);
					Ext.MessageBox.show({
						title: 'Information',
						msg: 'Register Successful!',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO,
						fn: function(){regist.hide();},
						animateTarget: 'btnRegist',
					});
				},
				failure: function(response, opts){
					var responseOject = Ext.util.JSON.decode(response.responseText);
					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
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
  }],
  listeners:{
 		'beforehide':function(){
 			Ext.getCmp('phone').focus(false,0);
 			Ext.getCmp('username').reset();
 			Ext.getCmp('pass').reset();
 			Ext.getCmp('pass-cfrm').reset();
 			Ext.getCmp('fname').reset();
 			Ext.getCmp('lname').reset();
 			Ext.getCmp('dob').reset();
 			Ext.getCmp('email').reset();
 			Ext.getCmp('phone').reset();
 		}
 	}
});