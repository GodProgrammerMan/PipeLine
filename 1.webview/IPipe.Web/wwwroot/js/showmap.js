$(document).ready(function() {

	layui.use('element', function () {
		var element = layui.element;

	});

    let viewer;
    let scene;
    let globe;
    let canvas;
    let ellipsoid;
    let labels;
    $(function () {
        viewer = new Cesium.Viewer("map", {
            animation: false, //是否显示动画控件
            baseLayerPicker: true, //是否显示图层选择控件
            geocoder: false, //是否显示地名查找控件
            timeline: false, //是否显示时间线控件
            sceneModePicker: false, //是否显示投影方式控件
            navigationHelpButton: false, //是否显示帮助信息控件
			infoBox: false, //是否显示点击要素之后显示的信息
			imageryProvider: new Cesium.MapboxImageryProvider(
				{
					mapId: "mapbox.satellite",
				})
        });

        viewer._cesiumWidget._creditContainer.style.display = "none";//地图地下的logo

        //定义
        scene = viewer.scene;
        globe = scene.globe;
        canvas = viewer.scene.canvas;
        ellipsoid = viewer.scene.globe.ellipsoid;
        labels = scene.primitives.add(new Cesium.LabelCollection());

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