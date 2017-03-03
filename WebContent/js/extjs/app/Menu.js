var pfname = "";
var plname = "";
var pdob = "";
var pemail = "";
var pphone = "";
var pid = "";
Ext.onReady(function(){

	Ext.Ajax.request({
		url : 'userModel.htm',
		success: function(response, opts){
			var responseOject = Ext.decode(response.responseText);
			
			pfname = responseOject.user[0].fname;
		    plname = responseOject.user[0].lname;
		    pdob = responseOject.user[0].birthday;
		    pemail = responseOject.user[0].email;
		    pphone = responseOject.user[0].phone;
		    pid = responseOject.user[0].usr_id;
			
		    
		    
    
		    Ext.apply(Ext.form.field.VTypes, {
			    ephone: function(val, field) {
			        var reg= /^[0-9,-]/i;
			        return reg.test(val);
			    },
			    ephoneText: 'Must be a number with -',
			    ephoneMask: /^[0-9,-]/i
			});
			
			Ext.apply(Ext.form.field.VTypes, {
				epassword: function(val, field) {
			        if (field.initialPassField) {
			            var pwd = Ext.getCmp('npass');
			            return (val == pwd.getValue());
			        }
			        return true;
			    },
			    epasswordText: 'Passwords do not match'
			});
		    
	/**Create a top Panel*/
	mainPanels = new Ext.Panel({
        title: '<font color="red">graphic solutions</font> <font color="darkgrey">digital</font>',
        tools:[
            {
            	xtype: 'tbtext',
            	id: 'ep',
            	text: '<font color="white"><b>User&nbsp;:&nbsp;</b><a href="javascript:editProfile();"><font color="lime"><u>'+responseOject.user[0].usr_name+'</u></font></a></font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            },
            {
            	xtype: 'button',
            	text: 'Log out',
            	height: 23,
            	handler: function() {
                	window.location.href='j_spring_security_logout';
                }
            }
        ],
        renderTo: 'menu1',

    });
    
	/**Create a menu Panel*/     menuPanel = new Ext.Panel({
    	renderTo: 'menu2',
    	margin: '-1 0 0 0',
        tbar:[
          {
			  text: 'Projects',
			  href: 'projects.htm',
			  hrefTarget: '_self'
          },
          {
        	  text: 'Jobs',
        	  href: 'jobs.htm',
			  hrefTarget: '_self'
          },
          {
        	xtype: 'tbfill'  
          },
          {
        	  xtype: 'tbtext',
        	  text:  '<b>'+document.title+'</b>',
          }
        ]
    });
    Ext.EventManager.onWindowResize(function () {    		mainPanels.doComponentLayout();    		menuPanel.doComponentLayout();
	});
    window.onmousemove = function(e) {
    	mainPanels.doComponentLayout();
    	menuPanel.doComponentLayout();
    }
    
		},
		failure: function(response, opts){
			var responseOject = Ext.util.JSON.decode(response.responseText);
			Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
		}
	});	
});

edit = new Ext.create('Ext.window.Window', {
	title: 'Edit Profile',
    width: 500,
//    height: 285,
    animateTarget: 'ep',
    modal : true,
    resizable:false,
    closeAction: 'hide',
    items :[{
            xtype:'form',
            id:'epform',
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
           			name: 'pfname',
           			id: 'pfname',
           			emptyText: 'First Name',
           			labelWidth : 145,
           			msgTarget: 'side',
           			vtype: 'alpha',
           			maxLength: 25,
           			maxLengthText: 'Maximum input 25 Character',
                     },
                { allowBlank:false, 
                	fieldLabel: 'Last Name <font color="red">*</font>  ', 
                	name: 'plname', 
                	id: 'plname',
                	emptyText: 'Last Name', 
                	labelWidth : 145,
                	msgTarget: 'side',
                	vtype: 'alpha',
                	maxLength: 25,
           		maxLengthText: 'Maximum input 25 Character',
                },
//                 { xtype: 'datefield',
//                    fieldLabel: 'Date of Birth <font color="red">*</font>',
//                    name: 'pdob',
//                    id: 'pdob',
//                    allowBlank: false,
//                    maxValue: new Date(),
//                    emptyText: 'Date of Birth',
//                    format: 'd-m-Y',
//                    editable: false,
//                	labelWidth : 145, 
//                	msgTarget: 'side',
//                },
                {
               	 allowBlank:false,
               	 fieldLabel: 'Email <font color="red">*</font>  ', 
                 	 name: 'pemail', 
                 	 id: 'pemail',
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
                 	 name: 'pphone', 
                 	 id: 'pphone',
                 	 emptyText: 'Phone Number', 
                 	 labelWidth : 145,
                 	 msgTarget: 'side',
                 	 vtype: 'phone',
                 	maxLength: 20,
           		maxLengthText: 'Maximum input 20 Character',
                },
                {
                	xtype: 'hidden',
	    	    	id: 'pid',
	    	    	name: 'pid'
                }
                   ]
           }],
    }],
    buttons:[{	
   		  text: 'Update',
  		  width:100,
  		  id: 'epbtn',
         handler: function(){
        	 var form = Ext.getCmp('epform').getForm();
        	 var pfname = Ext.getCmp('pfname');
   		  	var plname = Ext.getCmp('plname');
//   		  	var pdob = Ext.getCmp('pdob');
   		  	var pemail = Ext.getCmp('pemail');
   		  	var pphone = Ext.getCmp('pphone');
            	 if(form.isValid()){
            		 var box1 = Ext.MessageBox.show({
                         title: 'Updating Your Profile',
                         msg: 'Please wait...',
                         wait: true,
                         animateTarget: 'epbtn',
                     });
       			 Ext.Ajax.request({
       				url : 'updateProfile.htm',
       				params: {pfname: pfname.getValue(),
    					plname: plname.getValue(),
//    					pdob: pdob.getValue(),
    					pemail: pemail.getValue(),
    					pphone: pphone.getValue(),
       				},
       				success: function(response, opts){
       					box1.hide();
       					var responseOject = Ext.decode(response.responseText);
	       					Ext.MessageBox.show({
	       						title: 'Information',
	       						msg: 'Your profile have been update!',
	       						buttons: Ext.MessageBox.OK,
	       						icon: Ext.MessageBox.INFO,
	       						fn: function(){window.location.href='j_spring_security_logout';},
	       						animateTarget: 'cpbtn',
	       					});
       				},
       				failure: function(response, opts){
       					var responseOject = Ext.util.JSON.decode(response.responseText);
       					Ext.Msg.alert(responseOject.messageHeader, responseOject.message);
       				}
       			});
        	 }else {
					Ext.MessageBox.show({
						title: 'Failed',
						msg: ' Please Insert All Required Field',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR,
						animateTarget: 'epbtn',
					});
				}
		}
       	},{
       		text: 'Change Password',
       		id: 'cp',
       		handler: function(){
       			changePass.show();
       		}
       	}],
       	listeners:{
       		'beforehide':function(){
       			Ext.getCmp('epform').getForm().reset();
       		}
       	}
	});

function editProfile(){
	edit.show();
	Ext.getCmp('pfname').setValue(pfname);
    Ext.getCmp('plname').setValue(plname);
//    Ext.getCmp('pdob').setValue(pdob);
    Ext.getCmp('pemail').setValue(pemail);
    Ext.getCmp('pphone').setValue(pphone);
    Ext.getCmp('pid').setValue(pid);
}

changePass = new Ext.create('Ext.window.Window', {
	title: 'Change Password',
	    height: 220,
	    width: 400,
	    animateTarget: 'ep',
	    modal : true,
	    resizable:false,
	    closeAction: 'hide',
	    items :[{
	            xtype:'form',
	            id:'cpform',
	            height: 180,
	            items:[{
	            	xtype:'textfield',
	            	inputType: 'password',
	            	margin: '20 0 0 30',
	                allowBlank: false,
	                fieldLabel: 'Old Password <font color="red">*</font> ',
	                labelWidth: 125,
	                width: 300,
	                name: 'opass',
	                id: 'opass',
	                msgTarget: 'side',
	                emptyText: 'Old Password'
	            },
	            { allowBlank:false, 
	            	xtype:'textfield',
	            	fieldLabel: 'New Password <font color="red">*</font>  ', 
	            	name: 'npass', 
	            	id: 'npass',
	            	emptyText: 'New Password', 
	            	inputType: 'password',
	            	margin: '10 0 0 30',
	            	labelWidth: 125,
	                width: 300,
	            	vtype: 'alphanum',
	            	msgTarget: 'under',
	            	minLength: 6,
	               	minLengthText: 'Minimum input 6 Character',
	               	maxLength: 12,
	               	maxLengthText: 'Maximum input 12 Character'
	               	},
	             { allowBlank:false, 
	               		xtype:'textfield',
	            	fieldLabel: 'Confirm Password <font color="red">*</font>  ', 
	            	name: 'pass-cfrm',
	            	id: 'pass-cfrm',
	            	emptyText: 'Confirm New Password', 
	            	inputType: 'password',
	            	margin: '10 0 0 30',
	            	labelWidth: 125,
	                width: 300,
	            	msgTarget: 'under',
	               	vtype: 'password',
	                initialPassField: 'pass'
	            	},
	            ],
	    }],
        buttons:[{	
       		  text: 'Submit',
      		  width:100,
      		  id: 'cpbtn',
             handler: function(){
            	 var form = Ext.getCmp('cpform').getForm();
            	 if(form.isValid()){
            		 var box1 = Ext.MessageBox.show({
                         title: 'Changing Password',
                         msg: 'Please wait...',
                         wait: true,
                         animateTarget: 'cpbtn',
                     });
       			 Ext.Ajax.request({
       				url : 'changePassword.htm',
       				params: {opass: Ext.getCmp('opass').getValue(),
       						npass: Ext.getCmp('npass').getValue(),
       				},
       				success: function(response, opts){
       					box1.hide();
       					var responseOject = Ext.decode(response.responseText);
       					if(responseOject.user[0].usr_id == 0){
       						Ext.MessageBox.show({
	       						title: 'Error',
	       						msg: 'Your old password wrong!',
	       						buttons: Ext.MessageBox.OK,
	       						icon: Ext.MessageBox.ERROR,
	       						fn: function(){changePass.hide()},
	       						animateTarget: 'cpbtn',
	       					});
       					}else{
	       					Ext.MessageBox.show({
	       						title: 'Information',
	       						msg: 'Your password have been change!',
	       						buttons: Ext.MessageBox.OK,
	       						icon: Ext.MessageBox.INFO,
	       						fn: function(){window.location.href='j_spring_security_logout';},
	       						animateTarget: 'cpbtn',
	       					});
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
           			Ext.getCmp('cpform').getForm().reset();
           			
           		}
           	}
		});