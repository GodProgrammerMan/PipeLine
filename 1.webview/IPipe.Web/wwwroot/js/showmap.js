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
let IsBddiv = true;
let isCesium = false;
let x;//鼠标的x
let y;//鼠标的y
let cctvflat = false;
let layerFrom;

//全局获取鼠标位置
$(document).mousemove(function (e) {
    x = e.pageX;
    y = e.pageY;
});



$(document).ready(function () {

    layui.use(['form', 'element'], function () {
        var element = layui.element;
        var form = layui.form;
        layerFrom = form; 
        form.on('checkbox(lineShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
        form.on('checkbox(hoelShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
        form.on('checkbox(CCTVShow)', function (data) {
            isCesium = $("#plckbox").is(":checked") || $("#qhckbox").is(":checked");
            cctvflat = data.elem.checked;
            if (data.elem.checked) {//显示
                initCesium();
                var loadindex = layer.load(1, {
                    shade: [0.1, '#000']
                });
                //并飞到该区域
                $.get('/home/getCCTVGrade', null, function (res, status) {
                    layer.close(loadindex);
                    cctvDate = res;
                    $.each(res, function (i, item) {
                        try {
                            if (item.grade === 1) {
                                if (isCesium) {
                                    var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GREEN);
                                }

                                addcolorForBD(item.lineID, "#008000");//百度二维
                            } else if (item.grade === 2) {
                                if (isCesium) {
                                    var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.YELLOW);
                                }

                                addcolorForBD(item.lineID, "#FFFF00");//百度二维
                            } else if (item.grade === 3) {
                                if (isCesium) {
                                    var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.VIOLET);
                                }

                                addcolorForBD(item.lineID, "#EE82EE");//百度二维
                            } else if (item.grade === 4) {
                                if (isCesium) {
                                    var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
                                }

                                addcolorForBD(item.lineID, "#FF0000");//百度二维
                            }
                        } catch (e) {
                            try {
                                if (item.grade === 1) {
                                    if (isCesium) {
                                        var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_YS$" + item.lineID);
                                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GREEN);
                                    }

                                    addcolorForBD(item.lineID, "#008000");//百度二维
                                } else if (item.grade === 2) {
                                    if (isCesium) {
                                        var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_YS$" + item.lineID);
                                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.YELLOW);
                                    }

                                    addcolorForBD(item.lineID, "#FFFF00");//百度二维
                                } else if (item.grade === 3) {
                                    if (isCesium) {
                                        var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_YS$" + item.lineID);
                                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.VIOLET);
                                    }

                                    addcolorForBD(item.lineID, "#EE82EE");//百度二维
                                } else if (item.grade === 4) {
                                    if (isCesium) {
                                        var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_YS$" + item.lineID);
                                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
                                    }

                                    addcolorForBD(item.lineID, "#FF0000");//百度二维
                                }
                            } catch (e) {

                            }
                        }
                    });
                });
            } else 
                cctvRecolor();
            
        });
        form.on('checkbox(psizeShow)', function (data) {
            if (data.elem.checked) {
                for (var i = 0; i < bdPSizeOverlays.length; i++) {
                    bdPSizeOverlays[i].show();
                }
                for (var i = 0; i < labels.length; i++) {
                    labels.get(i).show = true;
                }
            } else {
                for (var i = 0; i < bdPSizeOverlays.length; i++) {
                    bdPSizeOverlays[i].hide();
                }
                for (var i = 0; i < labels.length; i++) {
                    labels.get(i).show = false;
                }
            }
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
        homeButton: false,
        scene3DOnly: true,
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
        scene: scene,
        blendOption: Cesium.BlendOption.TRANSLUCENT
    }));
});


//城市切换
function citySwitching(citycoed) {
    //先执行去掉
    $.cookie('area',null);
    //在添加
    $.cookie('area', citycoed);
    //然后提示成功、跳转页面
    os('info', "转换成功，正在跳转获取数据！", '');
    window.setTimeout("window.location=''", 2000);
}

//颜色恢复
function cctvRecolor() {
    $.each(cctvDate, function (i, item) {
        try {
            if (isCesium) {
                var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
            }

            addcolorForBD(item.lineID, "#ff50ff");//百度二维
        } catch (e) {
            try {
                if (isCesium) {
                    var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_YS$" + item.lineID);
                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
                }
                addcolorForBD(item.lineID, "#881212");//百度二维
            } catch (e) {

            }
        }
    });
}

function reAddDange() {
    $('body').addClass("cousline");
}

function cctvBSclike() {
    if (cctvflat) {
        //颜色变回来
        cctvRecolor();
        //并取消打勾
        $("input[name='CCTVShow']").prop("checked", false);
        layerFrom.render();
    }
}

function otherThing() {
    //二三维切换
    $("#qhckbox").change(function () {
        cctvBSclike();
        //true时为三维
        //false时为二维
        if (!$("#plckbox").is(":checked")) {
            if (this.checked) {
                $("#bdmap").css('display', 'none');
                $("#map").css('display', 'block');
                $("#map").css('width', '100%');
            } else {
                $("#bdmap").css('display', 'block');
                $("#map").css('display', 'none');
                $("#bdmap").css('width', '100%');
            }
        } else {
            os('info', "开启并列模式，无法转换！", '');
        }
    });
    //并列
    $("#plckbox").change(function () {
        cctvBSclike();
        //true时并列
        //false时，判定$("#qhckbox")
        if (this.checked) {
            $("#bdmap").css('display', 'block');
            $("#map").css('display', 'block');
            $("#bdmap").css('width', '50%');
            $("#map").css('width', '50%');
        } else {
            if ($("#qhckbox").is(":checked")) {
                $("#bdmap").css('display', 'none');
                $("#map").css('display', 'block');
                $("#map").css('width', '100%');
            } else {
                $("#bdmap").css('display', 'block');
                $("#map").css('display', 'none');
                $("#bdmap").css('width', '100%');
            }
        }
    });

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

    //判定鼠标是否在百度div上
    IsDBdiv();
}

function getHeightWidth() {
    var cliWidth = document.body.clientWidth; //浏览器宽
    var cliHeight = window.innerHeight;//浏览器高
    //根据浏览器宽高动态改变div的宽高
    $("#map_main").height(cliHeight - 54);
    $("#map_main").width(cliWidth);
}
function in_array(stringToSearch, arrayToSearch) {
    for (s = 0; s < arrayToSearch.length; s++) {
        thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}

function IsDBdiv() {
    //x的值相对于文档的左边缘。y的值相对于文档的上边缘
    //x,y是全局变量;
    //判断鼠标是否在某DIV中
    var div = $('#bdmap');//获取你想要的DIV
    var y1 = div.offset().top;  //div上面两个的点的y值
    var y2 = y1 + div.height();//div下面两个点的y值
    var x1 = div.offset().left;  //div左边两个的点的x值
    var x2 = x1 + div.width();  //div右边两个点的x的值

    if (x < x1 || x > x2 || y < y1 || y > y2) {
        IsBddiv = false;
    } else {
        IsBddiv = true;
    };
}


//定义一些常量
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
/**
* 百度坐标系 (BD-09)与 WGS84坐标系  的转换
* 即 百度 转 谷歌、高德
* @param bd_lon
* @param bd_lat
* @returns {*[]}
*/
function bd09towgs84(lng, lat) {
    var gcjo2 = bd09togcj02(lng, lat);
    var wgs84 = gcj02towgs84(gcjo2[0], gcjo2[1]);
    return wgs84;
}
/**
* WGS84坐标系 与 百度坐标系 (BD-09) 的转换
* 即 百度 转 谷歌、高德
* @param bd_lon
* @param bd_lat
* @returns {*[]}
*/
function wgs84tobd09(lng, lat) {
    var gcjo2 = wgs84togcj02(lng, lat);
    var bd09 = gcj02tobd09(gcjo2[0], gcjo2[1]);
    return bd09;
}

/**
* 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
* 即 百度 转 谷歌、高德
* @param bd_lon
* @param bd_lat
* @returns {*[]}
*/
function bd09togcj02(bd_lon, bd_lat) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat]
}

/**
* 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
* 即谷歌、高德 转 百度
* @param lng
* @param lat
* @returns {*[]}
*/
function gcj02tobd09(lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat]
}

/**
* WGS84转GCj02
* @param lng
* @param lat
* @returns {*[]}
*/
function wgs84togcj02(lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    }
    else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [mglng, mglat]
    }
}

/**
* GCJ02 转换为 WGS84
* @param lng
* @param lat
* @returns {*[]}
*/
function gcj02towgs84(lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    }
    else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat]
    }
}

function transformlat(lng, lat) {
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
}

function transformlng(lng, lat) {
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
}

/**
* 判断是否在国内，不在国内则不做偏移
* @param lng
* @param lat
* @returns {boolean}
*/
function out_of_china(lng, lat) {
    return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
}