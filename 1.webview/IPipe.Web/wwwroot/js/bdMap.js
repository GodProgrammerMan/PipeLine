let map;
var Laledata = [];
let showZoom = 19;
let currZoom;
let bdPolyline = [];
let bdPolylineID = [];
let bdholeList = [];
let dbholeOverlays = [];
let bdPSizeOverlays = [];
$(function () {
    //初始化地图
    initMap();

    //加载管线
    addLineOverlays();

});

function initMap() {
    map = new BMapGL.Map("bdmap");    // 创建Map实例
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
   // map.setTilt(73);
    map.centerAndZoom(new BMapGL.Point(113.93043624568712, 22.78495878251252), 21);  // 初始化地图,设置中心点坐标和地图级别

    var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
    map.addControl(scaleCtrl);

    var navi3DCtrl = new BMapGL.NavigationControl3D();  // 添加3D控件
    map.addControl(navi3DCtrl);

    //地图更改缩放级别结束时触发触发此事件
    map.addEventListener("zoomend", function (e) {
        Cesiumlinkage();
        var thisZoom = map.getZoom();
        if (thisZoom >= showZoom) {
            for (var i = 0; i < dbholeOverlays.length; i++) {
                dbholeOverlays[i].show();
            }
            for (var i = 0; i < bdPSizeOverlays.length; i++) {
                bdPSizeOverlays[i].show();
            }
        } else {
            for (var i = 0; i < dbholeOverlays.length; i++) {
                dbholeOverlays[i].hide();
            }
            for (var i = 0; i < bdPSizeOverlays.length; i++) {
                bdPSizeOverlays[i].hide();
            }
            // map.clearOverlays();
            //addAreaOverlay();//添加管线域覆盖物
        }
        currZoom = thisZoom;
    });
    //地图移动结束时触发
    map.addEventListener("dragend", function (e) {
        Cesiumlinkage();
    });


    //鼠标移动触发
    map.addEventListener("mousemove", function (e) {
        if (!$("#qhckbox").is(":checked") && !$("#plckbox").is(":checked")) {
            var f_gcjo2 = bd09togcj02(e.latlng.lng, e.latlng.lat);
            var f_wgs84 = gcj02towgs84(f_gcjo2[0], f_gcjo2[1]);

            $("#heght").html("层级" + map.getZoom());
            $("#lng").html(f_wgs84[0]);
            $("#lat").html(f_wgs84[1]);
        }
    });
}


function Cesiumlinkage() {
    var bounds = map.getBounds();
    //西南
    var sw = bounds.getSouthWest();
    //东北
    var ne = bounds.getNorthEast();

    var sw_wgs84 = bd09towgs84(sw.lng, sw.lat);

    var ne_wgs84 = bd09towgs84(ne.lng, ne.lat);

    IsDBdiv();
    if (IsBddiv && $("#plckbox").is(":checked")) {
        viewer.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(sw_wgs84[0], sw_wgs84[1], ne_wgs84[0], ne_wgs84[1])
        });
    }
}

//添加管线覆盖物
function addLineOverlays() {
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });
    $.post("/home/getLineHolesDateForBd", {}, function (data, status) {
        layer.close(loadindex);
        if (!data.response) {
            layerMsg('msg', data.msg)
        } else {
            $.each(data.response.lineDateMoldes, function (i, item) {
                if ((i > 600 && i < 1000)|| i<100) {
                    var smyIcon = new BMapGL.Icon("/img/1-2.png", new BMapGL.Size(69, 69));
                    var emyIcon = new BMapGL.Icon("/img/1-2.png", new BMapGL.Size(69, 69));
                    var Scolor = "#ff50ff";
                    if (item.line_Class === "YS") {
                        smyIcon = new BMapGL.Icon("/img/2-1.png", new BMapGL.Size(69, 69));
                        emyIcon = new BMapGL.Icon("/img/2-1.png", new BMapGL.Size(69, 69));
                        Scolor = "#881212";
                    }

                    //管段
                    var polyline = new BMapGL.Polyline([
                        new BMapGL.Point(item.sCoorWgsX, item.sCoorWgsY),
                        new BMapGL.Point(item.eCoorWgsX, item.eCoorWgsY)
                    ], { strokeColor: Scolor, strokeWeight: 2, strokeOpacity: 0.5 });

                    map.addOverlay(polyline);

                    bdPolylineID.push(item.lineID);
                    bdPolyline.push(polyline);

                    //var opts = {
                    //    width: 200,     // 信息窗口宽度
                    //    height: 20,     // 信息窗口高度
                    //    title: "管段："+ item.lno
                    //}
                    //var infoWindow = new BMapGL.InfoWindow('点击查看详情：<button type="button" class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal" onclick="bdLineInfoClick(' + item.lineID + ',&#39' + item.lno + '&#39,&#39' + item.line_Class+'&#39);">详情</button>', opts);  // 创建信息窗口对象 
                    //polyline.addEventListener("mousemove", function () {
                    //    map.openInfoWindow(infoWindow, new BMapGL.Point(item.cCoorWgsX, item.cCoorWgsY)); //开启信息窗口
                    //}); 
                    //polyline.addEventListener("mousemove", function () {
                    //    recoveryLineColor();
                    //    recoveryHoleColor();
                    //    //map.centerAndZoom((),21)
                    //});

                    //polyline.addEventListener("mouseout", function () {
                    //    polyline.setStrokeColor(Scolor);
                    //    polyline.setStrokeColor("#01e5e6");
                    //});

                    //管井
                    if (!in_array(item.s_Point, bdholeList)) {//开始井
                        if (item.s_subsid === "雨篦") {
                            smyIcon = new BMapGL.Icon("/img/3-1.png", new BMapGL.Size(69, 69));
                        }
                        var smarker = new BMapGL.Marker(new BMapGL.Point(item.sCoorWgsX, item.sCoorWgsY), {
                            icon: smyIcon
                        });  // 创建标注
                        map.addOverlay(smarker);              // 将标注添加到地图中
                        bdholeList.push(item.s_Point);
                        //smarker.hide();
                        dbholeOverlays.push(smarker);
                    }
                    if (!in_array(item.e_Point, bdholeList)) {
                        if (item.e_subsid === "雨篦") {
                            emyIcon = new BMapGL.Icon("/img/3-1.png", new BMapGL.Size(69, 69));
                        }
                        var emarker = new BMapGL.Marker(new BMapGL.Point(item.eCoorWgsX, item.eCoorWgsY), {
                            icon: emyIcon
                        });  // 创建标注
                        map.addOverlay(emarker);              // 将标注添加到地图中
                        bdholeList.push(item.e_Point);
                        //emarker.hide();
                        dbholeOverlays.push(emarker);
                    }

                    //管径
                    var opts = {
                        position: new BMapGL.Point(item.cCoorWgsX, item.cCoorWgsY),    // 指定文本标注所在的地理位置
                        offset: new BMapGL.Size(0, 0)    //设置文本偏移量
                    }
                    var label = new BMapGL.Label(item.pSize, opts);  // 创建文本标注对象
                    label.setStyle({
                        color: 'red',
                        fontSize: '12px',
                        height: '20px',
                        lineHeight: '20px',
                        fontFamily: '微软雅黑',
                        background: 'transparent',
                        border:'0px'
                    });
                    map.addOverlay(label);
                    //label.hide();
                    bdPSizeOverlays.push(label);
                }
            });
            layerMsg('msg', data.msg);
        }
    }).error(function () {
        layer.close(loadindex);
        layerTS('请求数据出错，请稍后再试！')
    });
}

function bdLineInfoClick(LineID, lno, line_Class) {

    recoveryLineColor();//移除管井颜色
    recoveryHoleColor();//移除管段颜色

    $("#property").hide();

    var pickid = "pipe_line_" + lno + "_" + line_Class + "$" + LineID;

    if (lineCLICKID != pickid)
        removeFTcolor();
    lineCLICKID = pickid;
    //添加当前颜色的管线信息
    if ($("#plckbox").is(":checked")) {
        var attributes = linePrimitive.getGeometryInstanceAttributes(pickid);//三维
        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN);//三维
    }


    getLineInfoByID(LineID);
}

//添加颜色
function addcolorForBD(LineID,Scolor) {
    if ($("#plckbox").is(":checked")) {
        for (var i = 0; i < bdPolylineID.length; i++) {
            if (bdPolylineID[i] == LineID) {
                bdPolyline[i].setStrokeColor(Scolor);
                break;
            }
        }
    }
}



function layerTS(msg, bntMgs) {
    bntMgs = (bntMgs === undefined || bntMgs === "" || bntMgs === null ? '我知道了' : bntMgs); // b默认值为2
    //信息框
    layer.open({
        content: msg
        , btn: bntMgs
    });
}

function layerMsg(skin, msg) {
    layer.open({
        content: msg
        , skin: skin
        , time: 2 //2秒后自动关闭
    });
}

function addArrow(polyline, length, angleValue) { //绘制箭头的函数
    var linePoint = polyline.getPath();//线的坐标串
    var arrowCount = linePoint.length;
    for (var i = 1; i < arrowCount; i++) { //在拐点处绘制箭头
        var pixelStart = map.pointToPixel(linePoint[i - 1]);
        var pixelEnd = map.pointToPixel(linePoint[i]);
        var angle = angleValue;//箭头和主线的夹角
        var r = length; // r/Math.sin(angle)代表箭头长度
        var delta = 0; //主线斜率，垂直时无斜率
        var param = 0; //代码简洁考虑
        var pixelTemX, pixelTemY;//临时点坐标
        var pixelX, pixelY, pixelX1, pixelY1;//箭头两个点
        if (pixelEnd.x - pixelStart.x == 0) { //斜率不存在是时
            pixelTemX = pixelEnd.x;
            if (pixelEnd.y > pixelStart.y) {
                pixelTemY = pixelEnd.y - r;
            }
            else {
                pixelTemY = pixelEnd.y + r;
            }
            //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
            pixelX = pixelTemX - r * Math.tan(angle);
            pixelX1 = pixelTemX + r * Math.tan(angle);
            pixelY = pixelY1 = pixelTemY;
        }
        else  //斜率存在时
        {
            delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
            param = Math.sqrt(delta * delta + 1);

            if ((pixelEnd.x - pixelStart.x) < 0) //第二、三象限
            {
                pixelTemX = pixelEnd.x + r / param;
                pixelTemY = pixelEnd.y + delta * r / param;
            }
            else//第一、四象限
            {
                pixelTemX = pixelEnd.x - r / param;
                pixelTemY = pixelEnd.y - delta * r / param;
            }
            //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
            pixelX = pixelTemX + Math.tan(angle) * r * delta / param;
            pixelY = pixelTemY - Math.tan(angle) * r / param;

            pixelX1 = pixelTemX - Math.tan(angle) * r * delta / param;
            pixelY1 = pixelTemY + Math.tan(angle) * r / param;
        }

        var pointArrow = map.pixelToPoint(new BMapGL.Pixel(pixelX, pixelY));
        var pointArrow1 = map.pixelToPoint(new BMapGL.Pixel(pixelX1, pixelY1));
        console.log(pointArrow);
        var Arrow = new BMapGL.Polyline([
            pointArrow,
            linePoint[i],
            pointArrow1
        ], { strokeColor: "blue", strokeWeight: 3, strokeOpacity: 0.5 });
        map.addOverlay(Arrow);
    }
}

