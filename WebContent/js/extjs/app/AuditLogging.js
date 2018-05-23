store = {};
panels = {};

Ext.onReady(function() {

	panels.log = Ext.create('Ext.grid.Panel', {
		frame : true,
		title : 'History State',
//		bodyPadding : 5,
		renderTo : document.body,
		width : 1200,
		height : 737,
//		forceFit : true,
//		autoWidth : true,
		columnLines : true,
		loadMask: true,
        selModel: {
            pruneRemoved: false
        },
        multiSelect: true,
        viewConfig: {
            trackOver: false
        },
        features:[{
            ftype: 'grouping',
            hideGroupedHeader: false
        }],
		style: {
            "margin-left": "auto",
            "margin-right": "auto",
            "margin-top": "50px",
            "margin-bottom": "20px"
        },
		store : store.log,
		columns : [ {
			text : 'Object Name',
			flex : 2,
			sortable : true,
			dataIndex : 'parent_type'
		}, {
			text : 'Reference',
			flex : 2.5,
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
	        		'<head><META HTTP-EQUIV="content-type" CONTENT="text/html; charset=utf-8"></head>{commit_desc:this.myDesc}',
	        		{
	        			myDesc: function(v){
	        				if(v.length > 7){
	        					myText = v.replace(/, code=/gi, "<br>Code = ");
	        					myText = myText.replace(/, key_account=/gi, "<br>Key Account Manager = ");
	        					myText = myText.replace(/, address=/gi, "<br>Address = ");
	        					myText = myText.replace(/, contact_person=/gi, "<br>Contact Person = ");
	        					myText = myText.replace(/, e-mail=/gi, "<br>E-mail = ");
	        					myText = myText.replace(/, phone=/gi, "<br>Phone = ");
	        					myText = myText.replace(/, bill_to=/gi, "<br>Bill to = ");
	        					myText = myText.replace(/, payment=/gi, "<br>Payment = ");
	        					myText = myText.replace(/, transfer_dtl=/gi, "<br>Transfer detail = ");
	        					myText = myText.replace(/, regist_date=/gi, "<br>Register Date = ");
	        					myText = myText.replace(/, desc=/gi, "<br>Description = ");
	        					myText = myText.replace(/, customer=/gi, "<br>Customer = ");
	        					myText = myText.replace(/, file_Name=/gi, "<br>File Name = ");
	        					myText = myText.replace(/, target_time=/gi, "<br>Target Time = ");
	        					myText = myText.replace(/, actual_time=/gi, "<br>Actual Time = ");
	        					myText = myText.replace(/, price=/gi, "<br>Price = ");
	        					myText = myText.replace(/, currency=/gi, "<br>Currency = ");
	        					myText = myText.replace(/, item_desc=/gi, "<br>Description = ");
	        					myText = myText.replace(/, job_dtl=/gi, "<br>Description = ");
	        					myText = myText.replace(/, job_status=/gi, "<br>Status = ");
	        					myText = myText.replace(/, dept=/gi, "<br>Department = ");
	        					myText = myText.replace(/, Item name=/gi, "<br>Item Name = ");
	        					myText = myText.replace(/, amount=/gi, "<br>Amount = ");
	        					myText = myText.replace(/, job_in=/gi, "<br>Date in = ");
	        					myText = myText.replace(/, job_out=/gi, "<br>Date out = ");
	        					myText = myText.replace(/, job_ref_dtl=/gi, "<br>Description = ");
	        					myText = myText.replace(/, job_ref_number=/gi, "<br>Job Number = ");
	        					myText = myText.replace(/, inv_proj_no=/gi, "<br>Project Number = ");
	        					myText = myText.replace(/, inv_delivery_date=/gi, "<br>Delivery Date= ");
	        					myText = myText.replace(/, inv_payment_terms=/gi, "<br>Payment Terms= ");
	        					myText = myText.replace(/, inv_vat=/gi, "<br>Vat(%)= ");
	        					myText = myText.replace(/, inv_bill_type=/gi, "<br>Billing Type= ");
	        					myText = myText.replace(/, topix_cus_id=/gi, "<br>Customer ID(Topix) = ");
	        					myText = myText.replace(/, topix_article_id=/gi, "<br>Article ID(Topix) = ");
	        					myText = myText.replace(/, inv_ref_qty=/gi, "<br>QTY= ");
	        					myText = myText.replace(/, inv_ref_desc=/gi, "<br>Remark= ");
	        					myText = myText.replace(/, tpx_cfg_id=/gi, "<br>Topix Server= ");
	        					myText = myText.replace(/, tpx_cus_id=/gi, "<br>Customer ID= ");
	        					myText = myText.replace(/, tpx_res_nr=/gi, "<br>Response Number= ");
	        					myText = myText.replace(/, tpx_res_msg=/gi, "<br>Response Text= ");
	        					myText = myText.replace(/, tpx_inv_number=/gi, "<br>Topix Number= ");
	        					myText = myText.replace(/, tpx_ref_info=/gi, "<br>Topix Item= ");
	        					myText = myText.replace(/Item List/gi, "Item");
	        					myText = myText.replace('Created row on ', "");
	        					myText = myText.replace('Created ', "");
	        					myText = myText.replace('Error on ', "");
	        					myText = myText.replace(/name=/gi, "Name = ");
	        					myText = myText.replace(/\r\n|\n/gi, " ");
//
	        					var res = myText.split("<br>");
	        					var test = new Array();
	        					for (var i = 0; i < res.length; i++) {
	        						var x = res[i].split("=");
	        						if(x.length == 2){
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
	        					return '<b>'+v+'</b>';
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
	pageSize : 100,
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