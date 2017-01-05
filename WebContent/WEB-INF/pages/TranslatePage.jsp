<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html> 
    <head> 
    <title>Translate Page</title> 
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="shortcut icon" type="image/png" href="<%=request.getContextPath()%>/image/gsd-icon.png">
    <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/js/extjs/resources/ext-theme-neptune-charcoal/ext-theme-neptune-charcoal-all.css" />
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/extjs/ext-all.js"></script>
	<script type="text/javascript">
		Ext.onReady(function(){ 
			mainPanel = Ext.create('Ext.panel.Panel', {
		        title: '<font color="red">graphic solutions</font> <font color="darkgrey">digital</font>',
		        /* layout: {
		            type: 'hbox',
		            pack: 'center',
		            align: 'middle'
		            
		        }, */
		        layout:'fit',
		        //height: window.screen.height,
		        tools:[{
		            type:'refresh',
		            tooltip: 'Refresh form Data',
		            // hidden:true,
		            handler: function(event, toolEl, panelHeader) {
		                // refresh logic
		                window.location.reload();
		            }
		        }],
		        items : [{
			        xtype : "component",
			        width : 1200,
			        height : 1000,
			        autoEl : {
			            tag : "iframe",
			            src : "http://www.bing.com/translator"
			        }
			    }],
		        renderTo: Ext.getBody()
		    });
			
			Ext.EventManager.onWindowResize(function () {
			    mainPanel.doComponentLayout();
			});
			
			/*new Ext.Window({
			    title : "iframe",
			    width : 300,
			    height: 300,
			    layout : 'fit',
			    items : [{
			        xtype : "component",
			        autoEl : {
			            tag : "iframe",
			            src : "http://www.bing.com/translator"
			        }
			    }]
			}).show(); */
		});
	</script>
	</head>

<body> 
    
    <!--iframe src="http://www.bing.com/translator" height=500 width=500></iframe-->

</body>
</html>
