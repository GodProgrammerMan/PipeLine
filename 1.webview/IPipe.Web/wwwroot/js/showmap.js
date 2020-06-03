$(document).ready(function() {

	layui.use('element', function () {
		var element = layui.element;

	});

	getHeightWidth();
	$(window).resize(function () {
		getHeightWidth();
	});
	
	$("#control").click(function() {
		if ($(this).attr("src").indexOf("j_") != -1) {
			$(this).attr("src", "/img/-ioc.png");
			$("#menu").show();
		} else {
			$(this).attr("src", "/img/j_ioc.png");
			$("#menu").hide();
		}
	});
	
	$("#rTitle a").click(function() {
		$("#result").hide();
	});
	
	//$("#map").click(function() {
	//	$("#property").show();
	//});
	
	// 关闭属性窗体
	$("#title a").click(function(event) {
		event.stopPropagation();
		$("#property").hide();
	});
	
});

function getHeightWidth() {
	var cliWidth = document.body.clientWidth; //浏览器宽
	var cliHeight = window.innerHeight;//浏览器高
	//根据浏览器宽高动态改变div的宽高

	$("#map").height(cliHeight - 50);
	$("#map").width(cliWidth);
}