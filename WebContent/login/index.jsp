<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="ISO-8859-1"%>
     <%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
    <%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<sec:authorize access="isAuthenticated()">
   <script type="text/javascript">
   window.location = "/GSD";
   </script>
</sec:authorize>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript">
 var errMessage = '${msg}';
</script>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/js/extjs/resources/ext-theme-neptune-charcoal/ext-theme-neptune-charcoal-all.css">
<script type="text/javascript" src="<%=request.getContextPath()%>/js/extjs/ext-all.js"></script>
<script type="text/javascript" src="login.js"></script>
<link rel="shortcut icon" type="image/png" href="<%=request.getContextPath()%>/image/gsd-icon.png">
<title>Login Page</title>
</head>
<body>
<c:if test="${not empty SPRING_SECURITY_LAST_EXCEPTION.message}">
<script type="text/javascript">
Ext.onReady(function(){
	Ext.MessageBox.show({
        title: 'Error',
        msg: 'Invalided User Name or Password , please try again.',
        buttons: Ext.MessageBox.OK,
        fn: focus,
        icon: Ext.MessageBox.ERROR
    });
});
function focus(){
	Ext.getCmp('j_username').focus(false, 200);
}
</script>
<c:remove scope="session" var="SPRING_SECURITY_LAST_EXCEPTION"/>
</c:if>
</body>
</html>