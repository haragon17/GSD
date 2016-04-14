Ext.onReady(function(){
	
	Ext.create('Ext.form.Panel', {
	    title: 'Workings Form',
	    bodyPadding: 5,
	    width: 450,
	    frame: true,
	    style: {
	          "margin-left": "auto",
	          "margin-right": "auto",
	          "margin-top": "50px",
	          "margin-bottom": "auto"
	      },

	    // Fields will be arranged vertically, stretched to full width
	    layout: 'anchor',
	    defaults: {
	        anchor: '80%',
	        style: {
		          "margin-left": "50px",
		          "margin-right": "auto",
		          "margin-top": "10px",
		          "margin-bottom": "10px"
		      },
	    },

	    // The fields
	    defaultType: 'textfield',
	    items: [{
	        fieldLabel: 'Name',
	        name: 'name',
	        id: 'name',
	        msgTarget: 'side',
	        allowBlank: false,
	        margin: '15 0 0 50'
	    },{
	    	xtype:'combobox',
	        fieldLabel: 'Category 1',
	        name: 'cate1',
	        id: 'cate1',
	        msgTarget: 'side',
	        allowBlank: false
	    },{
	    	xtype:'combobox',
	        fieldLabel: 'Category 2',
	        name: 'cate2',
	        id: 'cate2',
	        msgTarget: 'side',
	        allowBlank: false
	    },{
	    	xtype:'combobox',
	        fieldLabel: 'Category 3',
	        name: 'cate3',
	        id: 'cate3',
	        msgTarget: 'side',
	        allowBlank: false
	    },{
	    	xtype:'filefield',
	        fieldLabel: 'File',
	        name: 'file',
	        id: 'file',
	        msgTarget: 'side',
	        allowBlank: false
	    },{
	    	fieldLabel: 'Keyword',
	    	name: 'keyword',
	    	id: 'keyword',
	    },{
	    	xtype: 'textarea',
	    	fieldLabel: 'Detail',
	    	name: 'detail',
	    	id: 'detail'
	    }],

	    // Reset and Submit buttons
	    buttons: [{
	        text: 'Reset',
	        handler: function() {
	            this.up('form').getForm().reset();
	        }
	    }, {
	        text: 'Create',
	        formBind: true, //only enabled once the form is valid
	        disabled: true,
	        handler: function() {
	            var form = this.up('form').getForm();
	            if (form.isValid()) {
	                form.submit({
	                    success: function(form, action) {
	                       Ext.Msg.alert('Success', action.result.msg);
	                    },
	                    failure: function(form, action) {
	                        Ext.Msg.alert('Failed', action.result.msg);
	                    }
	                });
	            }
	        }
	    }],
	    renderTo: document.body
	});
	
});