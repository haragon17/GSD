<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<style type="text/css">
table.myTable { 
  border-collapse: collapse; 
  }
table.myTable td, 
table.myTable th { 
  border: 2px solid white;
  padding: 5px; 
  }
</style>
<%@ include file="Menu.jsp" %>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript">
 var errMessage = '${msg}';
</script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/extjs/app/TimeRecord.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/extjs/app/Store.js"></script>
<title>Time Report</title>
</head>
<body>
</body>
</html>