let map;
var Laledata = [];
let showZoom = 18;
let currZoom;
$(function () {
    //初始化地图
    initMap();

    //加载管线
    addLineOverlays();

});

function initMap() {
    map = new BMapGL.Map("allmap");    // 创建Map实例
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.setHeading(64.5);
    map.setTilt(73);
    map.centerAndZoom(new BMapGL.Point(113.91347, 22.73615), 20);  // 初始化地图,设置中心点坐标和地图级别

    //地图更改缩放级别结束时触发触发此事件
    map.addEventListener("zoomend", function (e) {
        var thisZoom = map.getZoom();

        if (thisZoom < showZoom) {
          //  map.clearOverlays();
        } else {
           // map.clearOverlays();
            addAreaOverlay();//添加管线域覆盖物
        }
        currZoom = thisZoom;
    });
    //地图更改缩放级别结束时触发触发此事件
    map.addEventListener("zoomend", function (e) {
        if (currZoom < showZoom) {
            //map.clearOverlays();
        } else {
            //map.clearOverlays();
            addAreaOverlay();//添加管线域覆盖物
        }
    });

    //地图移动结束时触发
    map.addEventListener("dragend", function (e) {
        var bounds = map.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        console.log(sw);
    });
}

//添加管线覆盖物
function addLineOverlays() {
    var loadindex = layer.open({
        type: 2
        , content: '加载管线数据中'
    });
    $.post("/home/getLineHolesDateForBd", {}, function (data, status) {
        layer.close(loadindex);
        if (!data.response) {
            layerMsg('msg', data.msg)
        } else {
            $.each(data.response.lineDateMoldes, function (i, item) {
                if (i>800 && i < 1000) {
                    var polyline = new BMapGL.Polyline([
                        new BMapGL.Point(item.sCoorWgsX, item.sCoorWgsY),
                        new BMapGL.Point(item.eCoorWgsX, item.eCoorWgsY)
                    ], { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 });

                    map.addOverlay(polyline);
                    //管径


                }
            });
            layerMsg('msg', data.msg)
        }
    }).error(function () {
        layer.close(loadindex);
        layerTS('请求数据出错，请稍后再试！')
    });
}

function layerTS(msg, bntMgs) {
    bntMgs = (bntMgs === undefined || bntMgs === "" || bntMgs === null ? '我知道了' : bntMgs); // b默认值为2
    //信息框
    layer.open({
        content: msg
        , btn: bntMgs
    });
}

function layerMsg(skin,msg) {
    layer.open({
        content: msg
        , skin: skin
        , time: 2 //2秒后自动关闭
    });
}