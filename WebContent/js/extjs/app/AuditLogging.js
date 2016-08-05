store = {};
panels = {};

Ext.onReady(function() {

	panels.log = Ext.create('Ext.grid.Panel', {
		frame : true,
		title : 'GSD Item List',
//		bodyPadding : 5,
		renderTo : document.body,
		width : 1200,
		height : 500,
		split : true,
		forceFit : true,
		loadMask : true,
//		autoWidth : true,
		columnLines : true,
		style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "75px",
            "margin-bottom": "auto"
        },
		store : store.log,
		columns : [ {
			text : 'Object Name',
			flex : 2,
			sortable : true,
			dataIndex : 'parent_type'
		}, {
			text : 'Reference',
			flex : 3,
			sortable : true,
			dataIndex : 'parent_ref'
		}, {
			text : 'Field Name',
			flex : 1.5,
			sortable : true,
			dataIndex : 'field_name'
		}, {
			text : 'Old Value',
			flex : 2,
			sortable : true,
			dataIndex : 'old_value'
		}, {
			text : 'New Value',
			flex : 2,
			sortable : true,
			dataIndex : 'new_value'
		}, {
			text : 'Updated by',
			flex : 1,
			sortable : true,
			dataIndex : 'commit_by'
		}, {
			text : 'Updated Date',
			flex : 1.2,
			sortable : true,
			dataIndex : 'commit_date',
			renderer: Ext.util.Format.dateRenderer('Y-m-d')
		}, {
			text : 'Operation',
			flex : 1,
			sortable : true,
			dataIndex : 'commit_type'
		}
		],
		listeners: {
			viewready: function (grid) {
		        var view = grid.view;
		        this.toolTip = Ext.create('Ext.tip.ToolTip', {
		            target: view.el,
		            delegate: view.cellSelector,
//		            width: 'auto',
//		            autoWidth: true,
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
//		                        tip.update("<b>" + columnTitle + ":</b> " + columnText);
		                        tip.update("<b>"+(columnText.replace(/\r\n|\n/gi, "<br>"))+"</b>");
		                    } else {
		                        return false;
		                    }
		                }
		            }
		        });
	        }
	    },
		plugins: [{
	        ptype: 'rowexpander',
	        rowBodyTpl : new Ext.XTemplate(
	        		'{commit_desc:this.myDesc}',
	        		{
	        			myDesc: function(v){
	        				if(v.length > 7){
	        					myText = v.replace(/, /gi, "<br>");
	        					myText = myText.replace(/=/gi, " = ");
	        					myText = myText.replace('Created row on ', "");
	        					myText = myText.replace('Created ', "");

	        					var res = myText.split("<br>");
	        					var test = new Array();
	        					for (var i = 0; i < res.length; i++) {
	        						var x = res[i].split("=");
	        						if(x.length == 2){
	        							x[0] = x[0].replace('desc', "Description");
	        							x[0] = x[0].replace('_', " ");
	        							test.push("<b>"+x[0]+"</b>");
	        							test.push(x[1]);
	        						}else{
	        							var y = res[i].split(" on ");
	        							var y1 = y[0].split("=");
	        							var y2 = y[1].split("=");
	        							test.push("<b>"+y1[0]+"</b>");
	        							test.push(y1[1]);
	        							test.push("<b>"+y2[0]+"</b>");
	        							test.push(y2[1]);
	        						}
	        					};
	        					var sumText = test.toString();
	        					sumText = sumText.replace(/<\/b>,/gi, "</b> = ");
	        					sumText = sumText.replace(/,<b>/gi, "<br><b>");

	        					return sumText;
	        				}else{
	        					return v;
	        				}
	        			}
	        		}
	        )
	    }],
		bbar : Ext.create('Ext.PagingToolbar', {
			store : store.log,
			displayInfo : true,
			displayMsg : 'Displaying Logs {0} - {1} of {2}',
			emptyMsg : "No Logs to display",
			plugins : Ext.create('Ext.ux.ProgressBarPager', {})
		})

	});
	
});

Ext.define('logModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'aud_id',
		type : 'int'
	}, {
		name : 'parent_id',
		type : 'int'
	}, {
		name : 'parent_object',
		type : 'string'
	}, {
		name : 'commit_by',
		type : 'string'
	}, {
		name : 'commit_date',
		type : 'date',
		dateFormat: 'Y-m-d H:i:s.u'
	}, {
		name : 'field_name',
		type : 'string'
	}, {
		name : 'old_value',
		type : 'string'
	}, {
		name : 'new_value',
		type : 'string'
	}, {
		name : 'commit_desc',
		type : 'string'
	}, {
		name : 'parent_ref',
		type : 'string'
	}, {
		name : 'commit_type',
		type : 'string'
	}, {
		name : 'parent_type',
		type : 'string'
	}

	]
});

store.log = Ext.create('Ext.data.JsonStore', {
	model : 'logModel',
	id : 'logStore',
	pageSize : 15,
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'showAuditLogging.htm',
		reader : {
			type : 'json',
			root : 'records',
			idProperty : 'aud_id',
			totalProperty : 'total'
		}
	},
});