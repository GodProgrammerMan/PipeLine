let viewer;
let scene;
let globe;
let canvas;
let ellipsoid;
let labels;
let linePrimitive;
let flowtoPrimitive;
let holePrimitive = [];
let cctvDate;

$(document).ready(function () {
    layui.use(['form', 'element'], function () {
        var element = layui.element;
        var form = layui.form;
        form.on('checkbox(lineShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
        form.on('checkbox(hoelShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
        form.on('checkbox(CCTVShow)', function (data) {
            if (data.elem.checked) {//显示
                initCesium();
                //并飞到该区域
                $.get('/home/getCCTVGrade', null, function (res, status) {
                    cctvDate = res;
                    $.each(res, function (i, item) {
                        if (item.grade === 1) {
                            var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GREEN);
                        } else if (item.grade === 2) {
                            var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.YELLOW);
                        } else if (item.grade === 3) {
                            var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.VIOLET);
                        } else if (item.grade === 4) {
                            var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
                        }
                    });
                });
            } else {
                $.each(cctvDate, function (i, item) {
                    var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
                });
            }
        });
        form.on('checkbox(psizeShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
        form.on('checkbox(flowShow)', function (data) {
            if (data.elem.checked) {
                for (var i = 0; i < labels.length; i++) {
                    labels.get(i).show = true;
                }
                lablesShow = true;
            } else {
                for (var i = 0; i < labels.length; i++) {
                    labels.get(i).show = false;
                }
                lablesShow = false;
            }
        });
        form.on('checkbox(yhShow)', function (data) {
            if (data.elem.checked) {
                for (var i = 0; i < yhPairList.length; i++) {
                    yhPairList[i].show = true;
                }
            } else {
                for (var i = 0; i < yhPairList.length; i++) {
                    yhPairList[i].show = false;
                }
            }
        });
        form.on('checkbox(exShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
        form.on('checkbox(buildShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
    });
    otherThing();
    // Cesium
    //Cesium token
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMzg4YWMyOS1mNDk4LTQyMzItOGU3NC0zMGRiZjRiODBjZTQiLCJpZCI6Mjg2MTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTEyNjM0NzN9.JYLFdGUWYl4HcjPbdH74RHHb1qJbe193tmL_Ccv-tLo';
    viewer = new Cesium.Viewer("map", {
        animation: false, //是否显示动画控件
        baseLayerPicker: true, //是否显示图层选择控件
        geocoder: false, //是否显示地名查找控件
        timeline: false, //是否显示时间线控件
        sceneModePicker: false, //是否显示投影方式控件
        navigationHelpButton: false, //是否显示帮助信息控件
        infoBox: false, //是否显示点击要素之后显示的信息
        //imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        //    url: '//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        //}),
        imageryProvider: new Cesium.MapboxImageryProvider(
            {
                mapId: "mapbox.satellite",
                accessToken: 'pk.eyJ1IjoibHp4bWFwYm94IiwiYSI6ImNqejcyYjgxODBhOWQzaG1qNG16MHZxaWEifQ.kJXpweRK26c7ZZy_EyT7Ig'
            }),
    });


    viewer._cesiumWidget._creditContainer.style.display = "none";//地图地下的logo

    //定义
    scene = viewer.scene;
    globe = scene.globe;
    canvas = viewer.scene.canvas;
    ellipsoid = viewer.scene.globe.ellipsoid;
    labels = scene.primitives.add(new Cesium.LabelCollection({
        scene: 2,
        blendOption: Cesium.BlendOption.TRANSLUCENT
    }
    ));
});


function reAddDange() {
    $('body').addClass("cousline");
}

function otherThing() {
    $('body').dblclick(function () {
        if ($("body").hasClass("cousline")) {
            $("body").removeClass("cousline");
        }
        return;
    });

    getHeightWidth();
    $(window).resize(function () {
        getHeightWidth();
    });
    $("#control").click(function () {
        if ($(this).attr("src").indexOf("j_") != -1) {
            $(this).attr("src", "/img/-ioc.png");
            $("#menu").show();
        } else {
            $(this).attr("src", "/img/j_ioc.png");
            $("#menu").hide();
        }
    });

    $("#rTitle a").click(function () {
        $("#result").hide();
    });

    //$("#map").click(function() {
    //	$("#property").show();
    //});

    // 关闭属性窗体
    $("#title a").click(function (event) {
        event.stopPropagation();
        $("#property").hide();
    });
}

function getHeightWidth() {
    var cliWidth = document.body.clientWidth; //浏览器宽
    var cliHeight = window.innerHeight;//浏览器高
    //根据浏览器宽高动态改变div的宽高
    $("#map").height(cliHeight - 54);
    $("#map").width(cliWidth);
}