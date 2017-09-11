//Department
Ext.create('Ext.data.Store', {
	storeId: 'deptStore',
	fields: ['name'],
	data : [
	        {"name":"Publication"},
	        {"name":"E-Studio"},
	        {"name":"E-Studio_OTTO"},
	        {"name":"E-Studio_MM"},
	        {"name":"E-Studio_Masking"},
//	        {"name":"Catalog"},
//	        {"name":"PP"},
//	        {"name":"KK"},
	]
});

//Job's Status
Ext.create('Ext.data.Store', {
	storeId: 'jobStatus',
	fields: ['name'],
	data : [
	        {"name":"Processing"},
	        {"name":"Sent"},
	        {"name":"Checked"},
	        {"name":"Billed"},
	        {"name":"Hold"}     
	]
});

//Job Reference's Status Publication
Ext.create('Ext.data.Store', {
	storeId: 'jobRefStatusPublication',
	fields: ['name'],
	data : [
	        {"name":"New"},
	        {"name":"New Pic"},
	        {"name":"New Doc"},
	        {"name":"New Pic+Doc"},
	        {"name":"CC"},
	        {"name":"CC2"},
	        {"name":"CC3"},
	        {"name":"CC+Final"},
	        {"name":"Final"},
	        {"name":"Sent"},
	        {"name":"Hold"}     
	]
});

//Job's Approve Publication
Ext.create('Ext.data.Store', {
	storeId: 'jobRefApprovePublication',
	fields: ['name'],
	data : [
	        {"name":"-"},
	        {"name":"Done"},
	        {"name":"Sent PDF Vorab"},
	        {"name":"Sent PDF K1"},
	        {"name":"Sent PDF K2"},
	        {"name":"Sent PDF Final"},
	        {"name":"Wait Final"},
	        {"name":"Wait Check"},
	        {"name":"Wait FI"},
	        {"name":"Up Proof"},
	        {"name":"CC1"},
	        {"name":"CC2"},
	        {"name":"CC3"},
	        {"name":"CC4"},
	        {"name":"Wait Mask"},
	        {"name":"Wait Move Mask"},
	        {"name":"Missing Pic"},
	        {"name":"Low Quality Pic"},
	        {"name":"Low Res Pic"},
	        {"name":"Ask Customer"},
	        {"name":"Hold Other"}
	]
});

//Job Reference's Status E-Studio
Ext.create('Ext.data.Store', {
	storeId: 'jobRefStatusEstudio',
	fields: ['name'],
	data : [
	        {"name":"New"},
	        {"name":"CC"},
	        {"name":"Sent"},
	        {"name":"Hold"}     
	]
});

//Job's Approve E-Studio
Ext.create('Ext.data.Store', {
	storeId: 'jobRefApproveEstudio',
	fields: ['name'],
	data : [
	        {"name":"-"},
	        {"name":"Done"},
	        {"name":"Processing"},
	        {"name":"Wait Path"},
	        {"name":"Wait Check"},
	        {"name":"Wait FI"},
	        {"name":"Ask Customer"},
	        {"name":"Hold Other"}
	]
});