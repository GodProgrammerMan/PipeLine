var scene, globe, canvas, ellipsoid, labels, yhlabels, linePrimitive, flowtoPrimitive, holePrimitive, yhPrimitive,cctvDate, IsBddiv = true, Isgoemdiv = true;
let x,latval=0;//鼠标的x
let y,lngval=0;//鼠标的y
var cctvflat = false, wdflat = false, lengtvalue = 0, mlengtvalue = 0, bflengtvalue=0;
var layerFrom;
var olMap, map, viewer;//三大地图的jq dom对象
var oLpipeAllLayer, oLyhLayer, oLcctvLayer, showollayer, sylxollayer, bingmaplayerMap, ces_mapboxImager, palaceTileset;//地图对象和地图组
var geoserverURLIP = "https://map.imlzx.cn:8082/geoserver/MSDI/wms";
var oLLayerArr = [];//ol- layer数组
var format = 'image/png';
var areacode = $.cookie('area');
var areid = 1, jsentities, buildingNumber, buildIndex = 0, showZoom = 19, thismap = "2d";
var lablesShow = false, flowtoShow = false;
var lineCLICKID = "", holeCLICKID = null;
var  ceHoleList = [], holdListData, Laledata = [], currZoom, bdPolyline = [], bdPolylineID = [], bdholeList = [].dbholeOverlays = [], bdPSizeOverlays = [];
let pipetypeStr = "'WS'|'YS'|'null'";
var activeShapePoints = [];
var activeShape, shape,shopePoint=[];
var floatingPoint, floatingPointArr=[], drawingMode = 'polygon';
var projection = new ol.proj.Projection({
    code: 'EPSG:4326',
    units: 'degrees',
    axisOrientation: 'neu',
    global: false
});
//全局获取鼠标位置
$(document).mousemove(function (e) {
    x = e.pageX;
    y = e.pageY;
});
$(function () {
    CookieChoohtml(initOL);
    layui.use(['form', 'element'], function () {
        var element = layui.element;
        var form = layui.form;
        layerFrom = form;
        form.on('checkbox(lineShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
        form.on('radio(mapShow)', function (data) {
            let valueStr = $(this).val();
            if (thismap === valueStr)
                return false;
            thismap = valueStr;
            if (valueStr == "2d") {
                $("#map_geom").show();
                $("#map").hide();
                $("#bdmap").hide();
                $("#map_geom").css("width", "100%");
                olMap.updateSize();
            } else if (valueStr == "3d") {
                $("#map").show();
                $("#map_geom").hide();
                $("#bdmap").hide();
                $("#map").css("width", "100%");
            } else if (valueStr == "23d") {
                $("#map").css("width", "50%");
                $("#map").show();
                $("#map_geom").show();
                $("#map_geom").css("width", "50%");
                $("#bdmap").hide();
                olMap.updateSize();
            } else if (valueStr == "bd") {
                $("#map").hide();
                $("#map_geom").hide();
                $("#bdmap").show();
                $("#bdmap").css("width", "100%");
            }
        });
        form.on('checkbox(exShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
        form.on('checkbox(exShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
        //流向
        form.on('checkbox(ftLineckbox)', function (data) {
            let obj = this;
            var ftIDS = $("#ftLineckbox").val().split(',');
            var linetype = $("#ftLineckbox").attr('data-line');
            var ids = $("#ftLineckbox").attr('data-ids');

            if (data.elem.checked) {
                if ($("#syLineckbox").prop("checked")) {
                    $("#syLineckbox").next().click();
                }
                //OL的
                olsylxlayer(ids, 1);
                for (var i = 0; i < ftIDS.length; i++) {
                    if (ftIDS[i] != "") {
                        try {
                            var attributes = linePrimitive.getGeometryInstanceAttributes(ftIDS[i]);
                            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GREENYELLOW);
                        } catch (e) {
                        }
                        var LineID = ftIDS[i].split('$')[1];
                        addcolorForBD(LineID, '#c5e82b')//并列百度变颜色
                    }
                }
            } else {
                //OL的
                if (typeof (olMap) != 'undefined' && typeof (sylxollayer) != 'undefined')
                    olMap.removeLayer(sylxollayer);
                for (var i = 0; i < ftIDS.length; i++) {
                    if (ftIDS[i] != "") {
                        var LineID = ftIDS[i].split('$')[1];
                        if (linetype === "WS") {
                            try {
                                var attributes = linePrimitive.getGeometryInstanceAttributes(ftIDS[i]);
                                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
                            } catch (e) {
                            }
                            addcolorForBD(LineID, '#ff50ff')//并列百度变颜色
                        } else {
                            try {
                                var attributes = linePrimitive.getGeometryInstanceAttributes(ftIDS[i]);
                                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
                            } catch (e) {
                            }

                            addcolorForBD(LineID, '#881212')//并列百度变颜色
                        }
                    }
                }
            }
        });
        //溯源
        form.on('checkbox(syLineckbox)', function (data) {
            let obj = this;
            var syIDS = $("#syLineckbox").val().split(',');
            var linetype = $("#syLineckbox").attr('data-line');
            var ids = $("#syLineckbox").attr('data-ids');
            if (data.elem.checked) {
                if ($("#ftLineckbox").prop("checked")) {
                    $("#ftLineckbox").next().click();
                }
                olsylxlayer(ids, 2);
                for (var i = 0; i < syIDS.length; i++) {
                    if (syIDS[i] != "") {
                        try {
                            var attributes = linePrimitive.getGeometryInstanceAttributes(syIDS[i]);
                            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKORANGE);
                        } catch (e) {
                        }
                        var LineID = syIDS[i].split('$')[1];
                        addcolorForBD(LineID, '#e7aa00')//并列百度变颜色
                    }
                }
            } else {
                if (typeof (olMap) != 'undefined' && typeof (sylxollayer) != 'undefined')
                    olMap.removeLayer(sylxollayer);
                for (var i = 0; i < syIDS.length; i++) {
                    if (syIDS[i] != "") {
                        var LineID = syIDS[i].split('$')[1];
                        if (linetype === "WS") {
                            try {
                                var attributes = linePrimitive.getGeometryInstanceAttributes(syIDS[i]);
                                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
                            } catch (e) {
                            }

                            addcolorForBD(LineID, '#ff50ff')//并列百度变颜色
                        } else {
                            try {

                                var attributes = linePrimitive.getGeometryInstanceAttributes(syIDS[i]);
                                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
                            } catch (e) {
                            }
                            addcolorForBD(LineID, '#881212')//并列百度变颜色
                        }
                    }
                }
            }
        });
        form.on('checkbox(layercheckShow)', function (data) {
            let obj = this;
            let idvalue = $(obj).attr("id");
            switch (idvalue) {
                case 'yslayerms'://雨水图层
                    if (typeof (olMap) != 'undefined' && typeof (oLpipeAllLayer) != 'undefined') {
                        let parameterStr = "";
                        if (data.elem.checked) {
                            parameterStr = "'YS'|" + pipetypeStr;
                            olLayerTransformation(oLpipeAllLayer, parameterStr, 'MSDI:ys_pipe');
                        } else {
                            parameterStr = pipetypeStr.replace("'YS'|", "");
                            olLayerTransformation(oLpipeAllLayer, parameterStr, 'MSDI:ys_pipe');
                        }
                        pipetypeStr = parameterStr;
                    } else {
                        layer.msg("二维地图对象未初始化");
                    }
                    break;
                case 'wslayerms'://污水图层
                    if (typeof (olMap) != 'undefined' && typeof (oLpipeAllLayer) != 'undefined') {
                        let parameterStr = "";
                        if (data.elem.checked) {
                            parameterStr = "'WS'|" + pipetypeStr;
                            olLayerTransformation(oLpipeAllLayer, parameterStr, 'MSDI:ys_pipe');
                        } else {
                            parameterStr = pipetypeStr.replace("'WS'|", "");
                            olLayerTransformation(oLpipeAllLayer, parameterStr, 'MSDI:ys_pipe');
                        }
                        pipetypeStr = parameterStr;
                    } else {
                        layer.msg("二维地图对象未初始化");
                    }
                    break;
                case 'dllayerms'://电力图层
                    if (typeof (olMap) != 'undefined') {

                    } else {
                        layer.msg("二维地图对象未初始化");
                    }
                    break;
                case 'jslayerms'://给水图层
                    if (typeof (olMap) != 'undefined') {

                    } else {
                        layer.msg("二维地图对象未初始化");
                    }
                    break;
                case 'rqlayerms'://燃气图层
                    if (typeof (olMap) != 'undefined') {

                    } else {
                        layer.msg("二维地图对象未初始化");
                    }
                    break;
                case 'yhlayergn'://隐患图层
                    if (typeof (olMap) != 'undefined' && typeof (oLyhLayer) != 'undefined') {
                        if (data.elem.checked) {
                            oLyhLayer.setVisible(true);
                            yhPrimitive.show = true;
                            for (var i = 0; i < yhlabels.length; i++) {
                                yhlabels.get(i).show = true;
                            }
                        }
                        else {
                            oLyhLayer.setVisible(false);
                            yhPrimitive.show = false;
                            for (var i = 0; i < yhlabels.length; i++) {
                                yhlabels.get(i).show = false;
                            }
                        }
                    } else {
                        layer.msg("二维地图对象未初始化");
                    }
                    break;
                case 'cctvlayergn'://CCTV等级图层
                    if (typeof (olMap) != 'undefined' && typeof (oLcctvLayer) != 'undefined') {
                        cctvflat = data.elem.checked;
                        if (cctvflat) {
                            if (typeof (sylxollayer) != 'undefined')
                                olMap.removeLayer(sylxollayer);
                            oLcctvLayer.setVisible(true);
                            //oLpipeAllLayer.setVisible(false);

                            //cesium和百度的
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
                                            if (true) {
                                                var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                                                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GREEN);
                                            }

                                            addcolorForBD(item.lineID, "#008000");//百度二维
                                        } else if (item.grade === 2) {
                                            if (true) {
                                                var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                                                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.YELLOW);
                                            }

                                            addcolorForBD(item.lineID, "#FFFF00");//百度二维
                                        } else if (item.grade === 3) {
                                            if (true) {
                                                var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                                                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.VIOLET);
                                            }

                                            addcolorForBD(item.lineID, "#EE82EE");//百度二维
                                        } else if (item.grade === 4) {
                                            if (true) {
                                                var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                                                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED);
                                            }

                                            addcolorForBD(item.lineID, "#FF0000");//百度二维
                                        }
                                    } catch (e) {
                                        try {
                                            if (item.grade === 1) {
                                                if (true) {
                                                    var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_YS$" + item.lineID);
                                                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GREEN);
                                                }

                                                addcolorForBD(item.lineID, "#008000");//百度二维
                                            } else if (item.grade === 2) {
                                                if (true) {
                                                    var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_YS$" + item.lineID);
                                                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.YELLOW);
                                                }

                                                addcolorForBD(item.lineID, "#FFFF00");//百度二维
                                            } else if (item.grade === 3) {
                                                if (true) {
                                                    var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_YS$" + item.lineID);
                                                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.VIOLET);
                                                }

                                                addcolorForBD(item.lineID, "#EE82EE");//百度二维
                                            } else if (item.grade === 4) {
                                                if (true) {
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
                        }
                        else {
                            oLcctvLayer.setVisible(false);
                            //oLpipeAllLayer.setVisible(true);

                            cctvRecolor();
                        }
                    } else {
                        layer.msg("二维地图对象未初始化");
                    }
                    break;
                case 'gjlayergn'://管径图层
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
                    break;
                case 'lxlayergn'://流向图层
                    if (data.elem.checked) {
                        flowtoPrimitive.show = true;
                        flowtoShow = true;
                    } else {
                        flowtoPrimitive.show = false;
                        flowtoShow = false;
                    }
                    break;
                case 'wxlayerbj'://卫星图层-二维
                    if (data.elem.checked)
                        bingmaplayerMap.setVisible(true);
                    else
                        bingmaplayerMap.setVisible(false);
                    break;
                case 'dtlayerbj'://地图图层-二维
                    if (data.elem.checked)
                        bingmaplayerMap.setVisible(true);
                    else
                        bingmaplayerMap.setVisible(false);
                    break;
                case 'bzlayerbj'://标注图层-二维
                    if (data.elem.checked)
                        bingmaplayerMap.setVisible(true);
                    else
                        bingmaplayerMap.setVisible(false);
                    break;
                case 'wxlayer3d'://卫星图层-三维
                    if (data.elem.checked)
                        viewer.imageryLayers.addImageryProvider(ces_mapboxImager);
                    else
                        viewer.imageryLayers.removeAll();

                    break;
                case 'dtlayer3d'://地图图层-三维
                    if (data.elem.checked)
                        viewer.imageryLayers.addImageryProvider(ces_mapboxImager);
                    else
                        viewer.imageryLayers.removeAll();
                    break;
                case 'bzlayer3d'://标注图层-三维
                    if (data.elem.checked)
                        viewer.imageryLayers.addImageryProvider(ces_mapboxImager);
                    else
                        viewer.imageryLayers.removeAll();
                    break;
                case 'bmlayer3d'://白膜图层-三维
                    if (data.elem.checked)
                        palaceTileset.show = true;
                    else
                        palaceTileset.show = false;
                    break;
                case 'dxslayer3d'://地下模式
                    //if (data.elem.checked) {
                    //    globe.translucency.enabled = true;
                    //    globe.translucency.frontFaceAlpha = 0.5;
                    //}
                    //else {
                    //    globe.translucency.enabled = true;
                    //    globe.translucency.frontFaceAlpha = 1;
                    //}
                    break;
                case 'dqlayer3d'://地球图层-三维
                    if (data.elem.checked)
                        globe.show = true;
                    else
                        globe.show = false;
                    break;
                default:
                    layer.msg("当前状态不支持该操作");
            }
        });
        form.on('checkbox(buildShow)', function (data) {
            layer.msg("当前状态不支持该操作");
        });
    });
    otherThing();

});
//初始化 -- OL
function initOL(callback) {
    var mousePositionControl = new ol.control.MousePosition({
        className: 'custom-mouse-position',
        target: document.getElementById('location'),
        coordinateFormat: ol.coordinate.createStringXY(5),
        undefinedHTML: '&nbsp;'
    });
    var rotateControl = new ol.control.Rotate({
        autoHide: false
    });
    // 管线图层组
    let pipeAllLayer = new ol.layer.Image({//图层组
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: geoserverURLIP,
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                "LAYERS": 'MSDI:ys_pipe',
                "exceptions": 'application/vnd.ogc.se_inimage',
                "viewparams": "areid:" + areid,
            }
        }),
        className: "pipelineLayer",
        visible: true,
        zIndex: 8
    });
    oLpipeAllLayer = pipeAllLayer;
    oLLayerArr.push(pipeAllLayer);

    //隐患图层
    let yhLayer = new ol.layer.Image({//图层组
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: geoserverURLIP,
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                "LAYERS": 'MSDI:ys_pipe_yh',
                "exceptions": 'application/vnd.ogc.se_inimage',
                "viewparams": "areid:" + areid,
            }
        }),
        className: "yhLayer",
        visible: false,
        zIndex: 9
    });
    oLyhLayer = yhLayer;
    oLLayerArr.push(oLyhLayer);

    //CCTV管道层
    let cctvLayer = new ol.layer.Image({//图层组
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: geoserverURLIP,
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                "LAYERS": 'MSDI:ys_pipe_cctv',
                "exceptions": 'application/vnd.ogc.se_inimage',
                "viewparams": "areid:" + areid,
            }
        }),
        className: "cctvLayer",
        visible: false,
        zIndex: 10
    });
    oLcctvLayer = cctvLayer;
    oLLayerArr.push(oLcctvLayer);

    //天地图注记
    var tian_di_tu_annotation = new ol.layer.Tile({
        id: "bzlayerMap",
        title: "天地图文字标注",
        zIndex: 3,
        visible: false,
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=49ea1deec0ffd88ef13a3f69987e9a63'
        })
    });
    oLLayerArr.push(tian_di_tu_annotation);
    bingmaplayerMap = new ol.layer.Tile({
        id: "bingmaplayerMap",
        title: "bingMap地图",
        visible: true,
        zIndex: 2,
        source: new ol.source.BingMaps({
            key: 'AmiUqgOvVG1nQgYRp4Mcs65Is5A_tzJujqSWWSAV5aCLTgeKF4O3p4uClGCLWVv1',
            imagerySet: 'RoadOnDemand',
            culture: 'zh-cn'
        })
    });
    oLLayerArr.push(bingmaplayerMap);

    //创建ol地图
    olMap = new ol.Map({
        controls: ol.control.defaults({
            attribution: false
        }).extend([mousePositionControl, rotateControl]),
        target: 'map_geom',
        layers: oLLayerArr,//图层组 
        view: new ol.View({
            projection: 'EPSG:4326'
        }),
    });
    if (areid == 1) {
        olMap.getView().setCenter([113.08343495207401, 22.949133135126246]);
        olMap.getView().setZoom(18.703693552114576);
    } else if (areid == 2) {
        olMap.getView().setCenter([113.94314303246384, 22.746454084801524]);
        olMap.getView().setZoom(17.404315028416946);
    } else if (areid == 0) {
        olMap.getView().setCenter([114.05971697090581, 22.539934539441248]);
        olMap.getView().setZoom(17.404315028416946);
    }
    olMouseEvents();
    //olMap.getView().fit(bounds, olMap.getSize());//边界问题
    //放大缩小的控件
    $(".ol-zoom").css("top", "auto");
    $(".ol-zoom").css("bottom", "17.5em");
    $(".custom-mouse-position").hide();
    IDMSclear();
    callback && callback();
}
function olMouseEvents() {
    olMap.getView().on('change:resolution', function (evt) {  //放大和缩小事件
        var resolution = evt.target.get('resolution');
        var units = olMap.getView().getProjection().getUnits();
        var mpu = ol.proj.Units.METERS_PER_UNIT[units];
        let scale = resolution * mpu * 3779.5275590551 * 0.01;
        if (scale >= 1000) {
            scale = Math.round(scale / 1000) + "km";
        } else if (scale < 1000) {
            let scaleNum = Math.round(scale);
            scale = Math.round(scale) + "m";
            if (scaleNum >= 20) {
                //oLpipeAllLayer.setVisible(false);
                //oLProAllLayer.setVisible(true);
            } else {
                //oLpipeAllLayer.setVisible(true);
                //oLProAllLayer.setVisible(false);
            }
        }
        $("#scaleTxt").html(scale);
        ollcesium();
    });


    // 地图拖动事件
    olMap.on("moveend", function (evt) {
        ollcesium();
        //如果使用的是香港底图则在4m一下，没有改地图
        //if (baseMap.indexOf("hk") >= 0 && olMap.getView().getZoom() > 20.3) {
        //    //没发加载地图
        //}
    });
    olMap.on('singleclick', function (evt) {   //单击要素
        IDMSclear();
        let dx = parseFloat(evt.coordinate[0]);
        let dy = parseFloat(evt.coordinate[1]);
        let view = olMap.getView();
        let viewResolution = view.getResolution();
        let source = oLpipeAllLayer.get('visible') ? oLpipeAllLayer.getSource() : null;
        if (source != null) {
            let url = source.getFeatureInfoUrl(
                evt.coordinate, viewResolution, view.getProjection(),
                { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50, format_options: 'callback:getJson' });
            if (url) {
                let loadindex = layer.load();
                $.get(url, null, function (data, status) {
                    if (data.features != null && data.features.length > 0) {
                        //设置map中心点
                        view.setCenter([dx, dy]);

                        let isAnypoint = false, Anypointi = 0, isAnyline = false, Anylinei = 0, featuresData, showlayername = 'MSDI:ys_show_pipehole';
                        $.each(data.features, function (i, item) {
                            if (item.geometry.type === 'Point') {
                                isAnypoint = true;
                                Anypointi = i;
                            }
                            if (item.geometry.type === 'LineString') {
                                isAnyline = true;
                                Anylinei = i;
                            }
                        });
                        recoveryLineColor();
                        recoveryHoleColor();
                        if (isAnypoint) {
                            showlayername = 'MSDI:ys_show_pipehole';
                            featuresData = data.features[Anypointi];
                            getHoleInfoByID(featuresData.properties.mysqlid);

                            //olBindinfoData(featuresData.properties, 1);
                        } else if (!isAnypoint && isAnyline) {
                            showlayername = 'MSDI:ys_show_pipeline';
                            featuresData = data.features[Anylinei];
                            let model = featuresData.properties;
                            //针对cesium点击同步
                            let pick_id = "pipe_line_" + model.lno + "_" + model.lineclass + "$" + model.mysqlid;
                            if (lineCLICKID != pick_id)
                                removeFTcolor();
                            try {
                                var attributes = linePrimitive.getGeometryInstanceAttributes(pick_id);//三维
                                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN);//三维
                                lineCLICKID = pick_id;
                            } catch (e) {
                            }
                            getLineInfoByID(model.mysqlid);
                            //olBindinfoData(featuresData.properties, 2);
                        }
                        olshowlayer(featuresData.properties.mysqlid, showlayername);
                    }
                    layer.close(loadindex);
                });
            }
        }
    });

    // 鼠标移动事件
    olMap.on('pointermove', function (evt) {
        // 经纬度坐标
        var coord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    });
}
//ol联动cesium
function ollcesium() {
    //处理联动情况
    IsGoemdiv();
    if (thismap == "23d" && Isgoemdiv) {
        //23d联动
        let rotatuin = olMap.getView().getRotation();
        if (typeof (viewer) != 'undefined') {
            if (rotatuin == 0) {
                let sn_wgs84 = olMap.getView().calculateExtent(olMap.getSize());
                viewer.camera.flyTo({
                    destination: Cesium.Rectangle.fromDegrees(sn_wgs84[0] - lngval, sn_wgs84[1] - latval, sn_wgs84[2] - lngval, sn_wgs84[3] - latval)
                });
            } else {
                let ceterCoor = olMap.getView().getCenter();
                let zoomheight = getOLcesiumHeight(olMap.getView().getZoom());
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(ceterCoor[0] - lngval, ceterCoor[1] - latval, zoomheight),
                    orientation: {
                        roll: -rotatuin
                    }
                });
            }
        }
    }
}
//
function olsylxlayer(ids, lxclass) {
    //清理上次点击的图层
    if (typeof (sylxollayer) != 'undefined')
        olMap.removeLayer(sylxollayer);

    if (olMap.getView().getZoom() < 20.14)
        olMap.getView().setZoom(20.15);

    sylxollayer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: geoserverURLIP,
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                "LAYERS": 'MSDI:ys_pipe_sylx',
                "exceptions": 'application/vnd.ogc.se_inimage',
                "viewparams": "pipetypes:" + ids + ";areid:" + areid + ";lxclass:" + lxclass,
            }
        }),
        zIndex: 11,
        visible: true
    });
    olMap.addLayer(sylxollayer);
}
//
function olshowlayer(id, showlayername) {
    //清理上次点击的图层
    if (typeof (showollayer) != 'undefined')
        olMap.removeLayer(showollayer);
    if (typeof (sylxollayer) != 'undefined')
        olMap.removeLayer(sylxollayer);

    if (olMap.getView().getZoom() < 20.14)
        olMap.getView().setZoom(20.15);

    showollayer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: geoserverURLIP,
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                "LAYERS": showlayername,
                "exceptions": 'application/vnd.ogc.se_inimage',
                "viewparams": "id:" + id + ";areid:" + areid,
            }
        }),
        zIndex: 10,
        visible: true
    });
    olMap.addLayer(showollayer);
}
//初始化 - cesium 
function initCesium() {
    // Cesium
    //Cesium token
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMzg4YWMyOS1mNDk4LTQyMzItOGU3NC0zMGRiZjRiODBjZTQiLCJpZCI6Mjg2MTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTEyNjM0NzN9.JYLFdGUWYl4HcjPbdH74RHHb1qJbe193tmL_Ccv-tLo';
    //MapboxImageryProvider
    ces_mapboxImager = new Cesium.MapboxImageryProvider(
        {
            mapId: "mapbox.satellite",
            accessToken: 'pk.eyJ1IjoibHp4bWFwYm94IiwiYSI6ImNqejcyYjgxODBhOWQzaG1qNG16MHZxaWEifQ.kJXpweRK26c7ZZy_EyT7Ig'
        });
    viewer = new Cesium.Viewer("map", {
        requestRenderMode: false,//显示渲染提升性能
        maximumRenderTimeChange: Infinity,
        animation: false, //是否显示动画控件
        baseLayerPicker: false, //是否显示图层选择控件
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
        //imageryProvider: ces_mapboxImager,
    });
    viewer.imageryLayers.addImageryProvider(ces_mapboxImager);
    viewer._cesiumWidget._creditContainer.style.display = "none";//地图地下的logo
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
    //定义
    scene = viewer.scene;
    globe = scene.globe;
    canvas = viewer.scene.canvas;
    ellipsoid = viewer.scene.globe.ellipsoid;
    labels = scene.primitives.add(new Cesium.LabelCollection({
        scene: scene,
        blendOption: Cesium.BlendOption.TRANSLUCENT
    }));
    yhlabels = scene.primitives.add(new Cesium.LabelCollection({
        scene: scene,
        blendOption: Cesium.BlendOption.TRANSLUCENT
    }));

    if (areacode == "gd_sz_sm") {
        //倾斜模型
        getCivicCenter();
    } else {
        //建筑物
        getbuildList();
    }
    //线与井点数据
    getLineHoles(false);
    //隐患点数据
    getYhData();

    getMouseEventsForCesium();
    initlocation();
}
function getMouseEventsForCesium() {
    //鼠标事件监听
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    //单击
    handler.setInputAction(function (movement) {
        if (wdflat) {
            var earthPosition = viewer.scene.pickPosition(movement.position);
            if (Cesium.defined(earthPosition)) {
                let cartographic1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(earthPosition);
                if (activeShapePoints.length === 0) {
                    floatingPoint = createPoint(earthPosition);
                    activeShapePoints.push(earthPosition);
                    var dynamicPositions = new Cesium.CallbackProperty(function () {
                        if (drawingMode === 'polygon') {
                            return new Cesium.PolygonHierarchy(activeShapePoints);
                        }
                        return activeShapePoints;
                    }, false);
                    activeShape = drawShape(dynamicPositions, 'polygon');//绘制动态图
                }
                shopePoint.push({ lng: Cesium.Math.toDegrees(cartographic1.longitude), lat: Cesium.Math.toDegrees(cartographic1.latitude)});
                activeShapePoints.push(earthPosition);
                createPoint(earthPosition);
            }
        } else {
            var cartesian1 = viewer.scene.pickPosition(movement.position);
            if (cartesian1) {
                let cartographic1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian1);
                let lat_String = Cesium.Math.toDegrees(cartographic1.latitude).toFixed(10),
                    log_String = Cesium.Math.toDegrees(cartographic1.longitude).toFixed(10),
                    alti_String = (viewer.camera.positionCartographic.height).toFixed(10);

                //var cartographic2 = Cesium.Cartographic.fromDegrees(cartographic1.longitude, cartographic1.latitude, viewer.camera.positionCartographic.height);
                //var cartesian3 = ellipsoid.cartographicToCartesian(cartographic2);
            }
            var pick = viewer.scene.pick(movement.position);
            try {
                if ($('body').hasClass("cousline")) {
                    if (Cesium.defined(pick) && (pick.id != undefined && pick.id != "undefined") && (pick.id.indexOf('pipe_') > -1)) {
                        var cartesian = viewer.scene.pickPosition(movement.position);
                        let x = 0;
                        let y = 0;
                        let h = 0;
                        if (cartesian) {
                            let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                            y = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10);
                            x = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10);
                            h = (viewer.camera.positionCartographic.height / 1000).toFixed(10);
                        }
                        //在判断是井还是管段
                        var objID = pick.id.split('$')[1];
                        var name = pick.id.split('_')[2];
                        if (pick.id.indexOf('pipe_hole_') > -1) {
                            //添加管的隐患点
                            showBox('管点' + name + '隐患上报', '/HiddenDanger/index?action=add&ty=1&x=' + x + '&y=' + y + '&name=管点' + name + '隐患&objID=' + objID, ['1100px', '700px']);
                            //添加隐患成功后渲染
                            //addYHMolde("hole_hy_" + objID, y * 1, x * 1, 4, "井点" + name + "隐患");
                        } else {
                            //添加管段的隐患点
                            showBox('管段' + name + '隐患上报', '/HiddenDanger/index?action=add&ty=2&x=' + x + '&y=' + y + '&name=管段' + name + '隐患&objID=' + objID, ['1100px', '700px']);
                            //添加隐患成功后渲染
                            //addYHMolde("line_hy_" + objID, y * 1, x * 1, 1.6, "管段" + name + "隐患");
                        }
                    } else {
                        os('info', "请选择存在隐患的管段或者井,双击则取消！", '');
                    }
                }
                if (Cesium.defined(pick) && (pick.id != undefined && pick.id != "undefined") && (pick.id.indexOf('pipe_') > -1)) {
                    //管点、点击
                    if (pick.id.indexOf('pipe_hole_') > -1) {
                        recoveryLineColor();
                        recoveryHoleColor();
                        $("#property").hide();
                        if (lineCLICKID != pick.id) 
                            removeFTcolor();

                        holeCLICKID = pick.id;
                        pick.primitive.color = Cesium.Color.CHOCOLATE;
                        //请求管点信息
                        var holeID = pick.id.split('$')[1];
                        //获取数据
                        getHoleInfoByID(holeID);
                        //ol
                        olshowlayer(holeID, 'MSDI:ys_show_pipehole');
                    }
                    //管段点击
                    if (pick.id.indexOf('pipe_line_') > -1) {
                        recoveryLineColor();
                        recoveryHoleColor();
                        $("#property").hide();
                        if (lineCLICKID != pick.id)
                            removeFTcolor();
                        lineCLICKID = pick.id;
                        //添加当前颜色的管线信息 --- 加上ol点击方式
                        var attributes = linePrimitive.getGeometryInstanceAttributes(pick.id);//三维
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN);//三维


                        //请求管线信息
                        var LineID = lineCLICKID.split('$')[1];
                        addcolorForBD(LineID, "#01e5e6");//百度二维
                        //ol
                        olshowlayer(LineID, 'MSDI:ys_show_pipeline');
                        getLineInfoByID(LineID);
                    }
                }
            } catch (e) {
            }
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //移动
    handler.setInputAction(function (movement) {
        if (wdflat) {
            if (Cesium.defined(floatingPoint)) {
                var newPosition = viewer.scene.pickPosition(movement.endPosition);
                if (Cesium.defined(newPosition)) {
                    floatingPoint.position.setValue(newPosition);
                    activeShapePoints.pop();
                    activeShapePoints.push(newPosition);
                }
            }
        } else {
            //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
            let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesian) {
                let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                let lat_String = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10),
                    log_String = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10),
                    alti_String = (viewer.camera.positionCartographic.height).toFixed(10);
                $("#heght").html(alti_String);
                $("#lng").html(log_String);
                $("#lat").html(lat_String);
            }
            var pick = viewer.scene.pick(movement.endPosition);
            try {
                if (Cesium.defined(pick) && (pick.id != undefined && pick.id != "undefined") && (pick.id.indexOf('pipe_') > -1)) {

                }
            } catch (e) {
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function (event) {
        if (wdflat) {
            terminateShape("polygon");
            $("#map").css("cursor", "auto");
            wdflat = false;
            if (shopePoint.length >= 3) {
                //创建模型挖地
                let clippArr = [];
                let transformParea = getInverseTransform();
                if (!isClockWise(shopePoint)) {
                    shopePoint = shopePoint.reverse();
                }
                try {
                    for (var i = 0; i < shopePoint.length; i++) {
                        if (i == shopePoint.length - 1) {
                            clippArr.push(createPlane(shopePoint[i], shopePoint[0], transformParea));
                            break;
                        }
                        clippArr.push(createPlane(shopePoint[i], shopePoint[i + 1], transformParea));
                    }
                    palaceTileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
                        planes: clippArr,
                        edgeColor: Cesium.Color.RED,
                        edgeWidth: 1.0,
                        unionClippingRegions: false, //true 才能多个切割  
                    });
                    for (var i = 0; i < floatingPointArr.length; i++) {
                        viewer.entities.remove(floatingPointArr[i]);
                    }
                    shopePoint = [];
                    //移除创建的平面
                    viewer.entities.remove(shape);
                    viewer.entities.remove(floatingPoint);
                //建立挖地模型
                } catch (e) {
                    layer.msg("计算模型出现误差，请稍后刷新页面再试哦！");
                    //移除创建的平面
                    shopePoint = [];
                    viewer.entities.remove(shape);
                    viewer.entities.remove(floatingPoint);
                    for (var i = 0; i < floatingPointArr.length; i++) {
                        viewer.entities.remove(floatingPointArr[i]);
                    }
                }
            } else {
                layer.msg("至少选择三个点！");
            }
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    //相机
    //缩放和缩放
    viewer.scene.camera.moveEnd.addEventListener(function () {
        try {
            //获取当前相机中心点与高度 
            var centerPosition = getCenterPosition();
            let height = centerPosition.height;
            //var bd09 = wgs84tobd09(centerPosition.lon, centerPosition.lat);
            IsGoemdiv();
            if (!Isgoemdiv && thismap == "23d") {
                olMap.getView().setCenter([centerPosition.lon + lngval, centerPosition.lat + latval]);
                olMap.getView().setZoom(getolMapZoom(height));
                let roll = this.viewer.scene.camera.heading;
                olMap.getView().setRotation(-roll);
            }
            ////流向缩放出现和隐藏
            //if (height <= 100 && flowtoShow == false) {
            //    flowtoPrimitive.show = true;
            //    flowtoShow = true;
            //} else if (height > 100 && flowtoShow == true) {
            //    flowtoPrimitive.show = false;
            //    flowtoShow = false;
            //}
            ////标签缩放出现和隐藏
            //if (height <= 77 && lablesShow == false) {
            //    for (var i = 0; i < labels.length; i++) {
            //        labels.get(i).show = true;
            //    }
            //    lablesShow = true;

            //    for (var i = 0; i < yhPairList.length; i++) {
            //        yhPairList[i].show = true;
            //    }

            //} else if (height > 77 && lablesShow == true) {
            //    for (var i = 0; i < labels.length; i++) {
            //        labels.get(i).show = false;
            //    }
            //    lablesShow = false;

            //    for (var i = 0; i < yhPairList.length; i++) {
            //        yhPairList[i].show = false;
            //    }
            //}
        } catch (e) {

        }

    })
}
//初始化 bd map
function initMap() {
    map = new BMapGL.Map("bdmap");    // 创建Map实例
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    // map.setTilt(73);

    if (areacode == "gd_sz_gm")
        map.centerAndZoom(new BMapGL.Point(113.93043624568712, 22.78495878251252), 21);//深圳
    else if (areacode == "gd_fs")
        map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21);  // 初始化地图,设置中心点坐标和地图级别



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
            //for (var i = 0; i < bdPSizeOverlays.length; i++) {
            //    bdPSizeOverlays[i].show();
            //}
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

        //type.currentTarget.V.style.cursor = "default";

        if (!$("#qhckbox").is(":checked") && !$("#plckbox").is(":checked")) {
            var f_gcjo2 = bd09togcj02(e.latlng.lng, e.latlng.lat);
            var f_wgs84 = gcj02towgs84(f_gcjo2[0], f_gcjo2[1]);

            $("#heght").html("层级" + map.getZoom());
            $("#lng").html(f_wgs84[0]);
            $("#lat").html(f_wgs84[1]);
        }
    });

    //加载管线
    addLineOverlays();
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
                var flat = false;
                if (areacode == "gd_sz_gm") {
                    flat = i < 200;
                } else {
                    flat = i < 2000;
                }

                if (flat) {
                    var smyIcon = new BMapGL.Icon("/img/1-2.png", new BMapGL.Size(40, 40));
                    var emyIcon = new BMapGL.Icon("/img/1-2.png", new BMapGL.Size(40, 40));
                    var Scolor = "#ff50ff";
                    if (item.line_Class === "YS") {
                        smyIcon = new BMapGL.Icon("/img/2-1.png", new BMapGL.Size(40, 40));
                        emyIcon = new BMapGL.Icon("/img/2-1.png", new BMapGL.Size(40, 40));
                        Scolor = "#881212";
                        if (item.e_Feature == "出水口" && (item.e_subsid == null || item.e_subsid == ""))
                            emyIcon = new BMapGL.Icon("/img/mapico/YS出水口.png", new BMapGL.Size(40, 40));
                    } else {
                        if (item.e_Feature == "出水口" && (item.e_subsid == null || item.e_subsid == ""))
                            emyIcon = new BMapGL.Icon("/img/mapico/WS出水口.png", new BMapGL.Size(40, 40));
                    }


                    //管段
                    var polyline = new BMapGL.Polyline([
                        new BMapGL.Point(item.sCoorWgsX, item.sCoorWgsY),
                        new BMapGL.Point(item.eCoorWgsX, item.eCoorWgsY)
                    ], { strokeColor: Scolor, strokeWeight: 2, strokeOpacity: 0.5, enableClicking: true, lineID: item.lineID, line_Class: item.line_Class, lno: item.lno });

                    var flowToPolyline = new BMapGL.Polyline([
                        new BMapGL.Point(item.sCoorWgsX, item.sCoorWgsY),
                        new BMapGL.Point(item.cCoorWgsX, item.cCoorWgsY)
                    ], { strokeColor: Scolor, strokeWeight: 0, strokeOpacity: 0 });

                    polyline.addEventListener('click', function (e) {
                        let config = e.currentTarget._config;
                        recoveryLineColor();//移除上一选择的管段cesium
                        recoveryHoleColor();
                        let packid = "pipe_line_" + config.lno + "_" + config.line_Class + "$" + config.lineID;
                        $("#property").hide();
                        if (lineCLICKID != packid)
                            removeFTcolor();
                        lineCLICKID = packid;
                        addcolorForBD(config.lineID, "#01e5e6");//百度二维

                        try {
                            var attributes = linePrimitive.getGeometryInstanceAttributes(packid);//三维
                            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN);//三维
                        } catch (e) {

                        }
                        getLineInfoByID(e.currentTarget._config.lineID);//请求lineID数据
                        map.centerAndZoom(new BMapGL.Point(e.latLng.lng, e.latLng.lat), 21);  // 初始化地图,设置中心点坐标和地图级别
                    });

                    map.addOverlay(polyline);

                    bdPolylineID.push(item.lineID);
                    bdPolyline.push(polyline);

                    addArrow(flowToPolyline, 10, Math.PI / 7, Scolor);

                    //var opts = {
                    //    width: 200,     // 信息窗口宽度
                    //    height: 20,     // 信息窗口高度
                    //    title: "管段："+ item.lno
                    //}
                    //var infoWindow = new BMapGL.InfoWindow('点击查看详情：<button type="button" class="layui-btn layui-btn-sm layui-btn-radius layui-btn-normal" onclick="bdLineInfoClick(' + item.lineID + ',&#39' + item.lno + '&#39,&#39' + item.line_Class+'&#39);">详情</button>', opts);  // 创建信息窗口对象 
                    //polyline.addEventListener("click", function () {
                    //    if (IsBddiv) {
                    //        map.openInfoWindow(infoWindow, new BMapGL.Point(item.cCoorWgsX, item.cCoorWgsY)); //开启信息窗口
                    //    }
                    //}); 
                    //polyline.addEventListener("rightclick", function () {
                    //    console.log(1);
                    //    recoveryLineColor();
                    //    recoveryHoleColor();
                    //    //map.centerAndZoom((),21)
                    //});
                    //polyline.addEventListener("click", function () {
                    //    console.log(1);
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
                        if (item.s_subsid === "雨水篦")
                            smyIcon = new BMapGL.Icon("/img/3-1.png", new BMapGL.Size(40, 40));
                        else if (item.s_subsid === "污水篦")
                            emyIcon = new BMapGL.Icon("/img/mapico/3-2.png", new BMapGL.Size(40, 40));
                        else if (item.s_subsid == "化粪池") {//污水化粪池.png
                            emyIcon = new BMapGL.Icon("/img/mapico/污水化粪池.png", new BMapGL.Size(40, 40));
                        } else if (item.s_subsid == "沉淀池") {
                            emyIcon = new BMapGL.Icon("/img/mapico/WS沉淀池.png", new BMapGL.Size(40, 40));
                        }
                        var smarker = new BMapGL.Marker(new BMapGL.Point(item.sCoorWgsX, item.sCoorWgsY), {
                            icon: smyIcon
                        });  // 创建标注
                        smarker.setZIndex(10);
                        smarker.addEventListener('click', function (e) {
                            layer.msg("管井正在开发中");
                        });

                        map.addOverlay(smarker);              // 将标注添加到地图中
                        bdholeList.push(item.s_Point);
                        //smarker.hide();
                        dbholeOverlays.push(smarker);
                    }
                    if (!in_array(item.e_Point, bdholeList)) {
                        if (item.e_subsid === "雨水篦")
                            emyIcon = new BMapGL.Icon("/img/3-1.png", new BMapGL.Size(40, 40));
                        else if (item.s_subsid === "污水篦")
                            emyIcon = new BMapGL.Icon("/img/mapico/3-2.png", new BMapGL.Size(40, 40));

                        var emarker = new BMapGL.Marker(new BMapGL.Point(item.eCoorWgsX, item.eCoorWgsY), {
                            icon: emyIcon
                        });  // 创建标注
                        emarker.setZIndex(10);
                        emarker.addEventListener('click', function (e) {
                            layer.msg("管井正在开发中");
                        });

                        map.addOverlay(emarker);              // 将标注添加到地图中
                        bdholeList.push(item.e_Point);
                        //emarker.hide();
                        dbholeOverlays.push(emarker);
                    }

                    //管径
                    var opts = {
                        position: new BMapGL.Point(item.cCoorWgsX, item.cCoorWgsY),    // 指定文本标注所在的地理位置
                        offset: new BMapGL.Size(0, 0)    //设置文本偏移量
                    };
                    var label = new BMapGL.Label(item.pSize, opts);  // 创建文本标注对象
                    label.setStyle({
                        color: 'red',
                        fontSize: '12px',
                        height: '20px',
                        lineHeight: '20px',
                        fontFamily: '微软雅黑',
                        background: 'transparent',
                        border: '0px'
                    });
                    map.addOverlay(label);
                    label.hide();
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
    if ($("#plckbox").is(":checked") || $("#qhckbox").is(":checked")) {
        var attributes = linePrimitive.getGeometryInstanceAttributes(pickid);//三维
        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN);//三维
    }


    getLineInfoByID(LineID);
}
//添加颜色 
function addcolorForBD(LineID, Scolor) {
    if ($("#plckbox").is(":checked") || !$("#qhckbox").is(":checked")) {
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
/**
 * 在百度地图上给绘制的直线添加箭头
 * @param polyline 直线 var line = new BMap.Polyline([faydPoint,daohdPoint], {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});
 * @param length 箭头线的长度 一般是10
 * @param angleValue 箭头与直线之间的角度 一般是Math.PI/7
 */
function addArrow(polyline, length, angleValue, Scolor) { //绘制箭头的函数
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
        var Arrow = new BMapGL.Polyline([
            pointArrow,
            linePoint[i],
            pointArrow1
        ], { strokeColor: Scolor, strokeWeight: 2, strokeOpacity: 0.5 });
        map.addOverlay(Arrow);
        return Arrow;
    }
}
//城市切换
function citySwitching(citycoed) {
    //先执行去掉
    $.cookie('area', null);
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
            if (true) {
                var attributes = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + item.lno + "_WS$" + item.lineID);
                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
            }

            addcolorForBD(item.lineID, "#ff50ff");//百度二维
        } catch (e) {
            try {
                if (true) {
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

    $(".lables_scale").on('click', function () {
        let checkdivobj = $(this).prev();
        checkdivobj.click();
    });
    //判定鼠标是否在百度div上
    IsDBdiv();
    //挖地功能，绘制多边形
    $("#bnt_wd").on('click', function () {
        //判定是否开启三维模式
        if ($("#map").css("display") == "none") {
            os('error', "请开启三维模式！", '');
            return;
        }
        //将鼠标变成十字架的模式
        $("#map").css("cursor", "crosshair");
        wdflat = true;
    });
    $("#bnt_bsclear").on("click", function () {
        if ($("#map").css("display") == "none") {
            os('error', "请开启三维模式！", '');
            return;
        }
        $("#map").css("cursor", "auto");
        wdflat = false;
        try {
            palaceTileset.clippingPlanes.removeAll();
        } catch (e) { 
        }
    });
    $("#bnt_upheigt").on("click", function () {
        if ($("#map").css("display") == "none") {
            os('error', "请开启三维模式！", '');
            return;
        }
        lengtvalue = -1 * $("#wdheight").val();
        //销毁重建 labels, yhlabels, linePrimitive, flowtoPrimitive, holePrimitive, yhPrimitive
        labels.removeAll();
        yhlabels.removeAll();
        scene.primitives.remove(linePrimitive);//linePrimitive
        scene.primitives.remove(flowtoPrimitive);//flowtoPrimitive
        scene.primitives.remove(yhPrimitive);//yhPrimitive
        for (var i = 0; i < holePrimitive.length; ++i) {
            let sas = new Cesium.Cartesian3();
            Cesium.Matrix4.getTranslation(holePrimitive.get(i).modelMatrix, sas);
            let cats = ellipsoid.cartesianToCartographic(sas);
            let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cats.longitude), Cesium.Math.toDegrees(cats.latitude), cats.height - lengtvalue - bflengtvalue));
            holePrimitive.get(i).modelMatrix = modelMatrix;
        }
        bflengtvalue = -1 * lengtvalue;
        //线与井点数据 
        getLineHoles(true);
        //隐患点数据
        getYhData(true);
    });
    $("#bnt_clearup").on("click", function () {
        if ($("#map").css("display") == "none") {
            os('error', "请开启三维模式！", '');
            return;
        }
        //恢复默认值
        lengtvalue = -1 * mlengtvalue;
        //销毁重建 labels, yhlabels, linePrimitive, flowtoPrimitive, holePrimitive, yhPrimitive
        labels.removeAll();
        yhlabels.removeAll();
        scene.primitives.remove(linePrimitive);//linePrimitive
        scene.primitives.remove(flowtoPrimitive);//flowtoPrimitive
        scene.primitives.remove(yhPrimitive);//yhPrimitive
        for (var i = 0; i < holePrimitive.length; ++i) {
            let sas = new Cesium.Cartesian3();
            Cesium.Matrix4.getTranslation(holePrimitive.get(i).modelMatrix, sas);
            let cats = ellipsoid.cartesianToCartographic(sas);
            let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cats.longitude), Cesium.Math.toDegrees(cats.latitude), cats.height - lengtvalue - bflengtvalue));
            holePrimitive.get(i).modelMatrix = modelMatrix;
        }
        bflengtvalue = -1 * lengtvalue;
        //线与井点数据 
        getLineHoles(true);
        //隐患点数据
        getYhData(true);
    });
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
function IsGoemdiv() {
    //x的值相对于文档的左边缘。y的值相对于文档的上边缘
    //x,y是全局变量;
    //判断鼠标是否在某DIV中
    var div = $('#map_geom');//获取你想要的DIV
    var y1 = div.offset().top;  //div上面两个的点的y值
    var y2 = y1 + div.height();//div下面两个点的y值
    var x1 = div.offset().left;  //div左边两个的点的x值
    var x2 = x1 + div.width();  //div右边两个点的x的值

    if (x < x1 || x > x2 || y < y1 || y > y2) {
        Isgoemdiv = false;
    } else {
        Isgoemdiv = true;
    };
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
function IDMSclear() {
    //禁止所有输出
    console.clear();
}
//获取管段数据
function getLineInfoByID(LineID) {
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });
    $.post("/home/getLineInfoByID", { id: LineID }, function (data, status) {
        layer.close(loadindex);
        if (!data.success) {
            os('error', data.msg, '');
        } else {
            // os('success', data.msg, '');
            $("#property").show();
            //管段绑数据的开始
            bindingLineDate(data);
        }
    }).error(function () { layer.close(loadindex); os('error', '服务器信息', '请求出错了，请刷新页面后重试！'); });
}

//获取管点数据
function getHoleInfoByID(holeID) {
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });
    $.post("/home/getHoleInfoByID", { id: holeID }, function (data, status) {
        layer.close(loadindex);
        if (!data.success) {
            os('error', data.msg, '');
        } else {
            os('success', data.msg, '');
            $("#property").show();
            //管点绑数据的开始
            bindingHoleDate(data);
        }
    }).error(function () { layer.close(loadindex); os('error', '服务器信息', '请求出错了，请刷新页面后重试！'); })
}
/* 获取层级 */
function getOLcesiumHeight(zoom) {
    var height = 17.5;
    if (zoom >= 22.7) {
        height = 17.5;
    } else if (zoom >= 22 && zoom < 22.7) {
        height = 25.04;
    } else if (zoom >= 21.71071131199397 && zoom < 22) {
        height = 36.8;
    } else if (zoom >= 21 && zoom < 21.71071131199397) {
        height = 58.5;
    } else if (zoom >= 20.3 && zoom < 21) {
        height = 93;
    } else if (zoom >= 19.5 && zoom < 20.3) {
        height = 178;
    } else if (zoom >= 19 && zoom < 19.5) {
        height = 225;
    } else if (zoom >= 18.5 && zoom < 19) {
        height = 357.2;
    } else if (zoom >= 17.77286058647078 && zoom < 18.5) {
        height = 565;
    } else if (zoom >= 17.43952725313745 && zoom < 17.77286058647078) {
        height = 712;
    } else if (zoom >= 17.10619391980411 && zoom < 17.43952725313745) {
        height = 897.58;
    } else if (zoom >= 16.439527253137452 && zoom < 17.10619391980411) {
        height = 1424.8148103364;
    } else if (zoom >= 16 && zoom < 16.439527253137452) {
        height = 1795.1369600243;
    } else if (zoom >= 15.772860586470786 && zoom < 16) {
        height = 2261.7034978329;
    } else if (zoom >= 15 && zoom < 15.772860586470786) {
        height = 3590.1068660782;
    } else if (zoom >= 14.772860586470786 && zoom < 15) {
        height = 4523.1421528978;
    } else if (zoom >= 14 && zoom < 14.772860586470786) {
        height = 7179.5462919873;
    } else if (zoom >= 13.77390617495334 && zoom < 14) {
        height = 9045.2241461916;
    } else if (zoom >= 13.3 && zoom < 13.77390617495334) {
        height = 11395.5728008447;
    } else if (zoom >= 12.8 && zoom < 13.3) {
        height = 18086;
    } else if (zoom >= 12.3 && zoom < 12.8) {
        height = 22784.3704362216;
    } else {
        height = 36155.4557603476;
    }
    return height;
}
/* 获取openlayer层级 */
function getolMapZoom(height) {
    var zoom = 21;
    if (height <= 17.49) {
        zoom = 23.611944225500256;
    } else if (height <= 25.0399999979 && height > 17.49) {
        zoom = 22.05497038908147;
    } else if (height <= 58.4999999997 && height > 25.0399999979) {
        zoom = 21.169767440745293;
    } else if (height <= 93 && height > 58.4999999997) {
        zoom = 20.521702577882706;
    } else if (height <= 178 && height > 93) {
        zoom = 20.188369244549374;
    } else if (height <= 357.2 && height > 178) {
        zoom = 18.855035911216046;
    } else if (height <= 565 && height > 357.2) {
        zoom = 18.18836924454938;
    } else if (height <= 712 && height > 565) {
        zoom = 17.52170257788272;
    } else if (height <= 1424.8 && height > 712) {
        zoom = 17;
    } else if (height <= 1795.137 && height > 1424.8) {
        zoom = 16.4;
    } else if (height <= 3590.1 && height > 1795.137) {
        zoom = 15.7;
    } else if (height <= 4868.5984 && height > 3590.1) {
        zoom = 14.7;
    } else if (height <= 3133.85 && height > 4868.5984) {
        zoom = 14.33;
    } else if (height <= 7727.8479 && height > 3133.85) {
        zoom = 14;
    } else if (height <= 9735.96934 && height > 7727.8479) {
        zoom = 13.666667;
    } else if (height <= 12265.747 && height > 9735.96934) {
        zoom = 13.33;
    } else if (height <= 19467 && height > 12265.747) {
        zoom = 12.66;
    } else if (height <= 24523.69 && height > 19467) {
        zoom = 12.3;
    } else if (height <= 30892.8 && height > 24523.69) {
        zoom = 12;
    } else if (height <= 38914.4 && height > 30892.8) {
        zoom = 11.66;
    } else if (height <= 49016.15855 && height > 38914.4) {
        zoom = 11.333;
    } else {
        zoom = 10;
    }
    return zoom;
}
/* 获取百度层级 */
function getBDMapZoom(height) {
    var zoom = 21;
    if (height <= 99.6) {
        zoom = 21;
    } else if (height <= 114.3 && height > 99.6) {
        zoom = 20.8;
    } else if (height <= 131.3 && height > 114.3) {
        zoom = 20.6;
    } else if (height <= 150.9 && height > 131.3) {
        zoom = 20.4;
    } else if (height <= 173.3 && height > 150.9) {
        zoom = 20.2;
    } else if (height <= 200 && height > 173.3) {
        zoom = 20;
    } else if (height <= 228.6 && height > 200) {
        zoom = 19.8;
    } else if (height <= 262.6 && height > 228.6) {
        zoom = 19.6;
    } else if (height <= 300 && height > 262.6) {
        zoom = 19.4;
    } else if (height <= 346.6 && height > 300) {
        zoom = 19.2;
    } else if (height <= 399 && height > 346.6) {
        zoom = 19;
    } else if (height <= 457 && height > 399) {
        zoom = 18.8;
    } else if (height <= 525 && height > 457) {
        zoom = 18.6;
    } else if (height <= 604 && height > 525) {
        zoom = 18.4;
    } else if (height <= 693 && height > 604) {
        zoom = 18.2;
    } else if (height <= 796 && height > 693) {
        zoom = 18;
    } else if (height <= 915 && height > 796) {
        zoom = 17.8;
    } else if (height <= 1051 && height > 915) {
        zoom = 17.6;
    } else if (height <= 1207 && height > 1051) {
        zoom = 17.4;
    } else if (height <= 1387.4 && height > 1207) {
        zoom = 17.2;
    } else if (height <= 1594 && height > 1387.4) {
        zoom = 17;
    } else {
        zoom = 16.8;
    }
    return zoom;
}
/* 获取camera中心点坐标 */
function getCenterPosition() {
    try {
        var result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas
            .clientHeight / 2));
        var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
        var lon = curPosition.longitude * 180 / Math.PI;
        var lat = curPosition.latitude * 180 / Math.PI;
        var height = getHeight();
        return {
            lon: lon,
            lat: lat,
            height: height
        };
    } catch (e) {

    }

}
/* 获取camera高度  */
function getHeight() {
    if (viewer) {
        var scene = viewer.scene;
        var ellipsoid = scene.globe.ellipsoid;
        var height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
        return height;
    }
}
function getLineHoles(iswid) {
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });
    $.post("/home/getLineHolesDate", {}, function (data, status) {
        holdListData = data;
        layer.close(loadindex);
        if (!data.response) {
            os('error', data.msg, '', 7000, '');
        } else {
            //flyTo(113.07880230215, 22.9505263885339, 80);
            //画管段
            let line_instances = [];
            var flowto_instances = [];
            let holecolor = Cesium.Color.ALICEBLUE;
            let msa = 0;
            if (!iswid) 
                holePrimitive = new Cesium.PrimitiveCollection();
            else
                msa = mlengtvalue; 
            $.each(data.response.lineDateMoldes, function (i, item) {
                let e_pipealtitude = Number(item.ehight - item.eDeep) - lengtvalue - msa;
                let s_pipealtitude = Number(item.shight - item.sDeep) - lengtvalue - msa;

                let attributes = Cesium.Color.DEEPPINK;
                let sholeUrl = '/js/cesiumhelp/model/ys22.glb';
                let eholeUrl = '/js/cesiumhelp/model/ys22.glb';
                if (item.smaxdeep >= 3.15) {
                    sholeUrl = '/js/cesiumhelp/model/ys1.glb';
                }
                if (item.emaxdeep >= 3.15) {
                    eholeUrl = '/js/cesiumhelp/model/ys1.glb';
                }
                let sscale = 6;
                let escale = 6;
                let sheight = 0;
                let eheight = 0;
                let spipeheight = 0.5;
                let epipeheight = 0.5;
                if (item.line_Class === "WS") {
                    attributes = Cesium.Color.DEEPPINK;
                    sholeUrl = '/js/cesiumhelp/model/ws22.glb';
                    eholeUrl = '/js/cesiumhelp/model/ws22.glb';
                    if (item.smaxdeep >= 3.15) {
                        sholeUrl = '/js/cesiumhelp/model/ws1.glb';
                    }
                    if (item.emaxdeep >= 3.15) {
                        eholeUrl = '/js/cesiumhelp/model/ws1.glb';
                    }
                } else {
                    attributes = Cesium.Color.DARKRED;
                }

                var flat = false;
                if (areacode == "gd_sz_gm") {
                    flat = i > 1500;
                    //cesium
                } else {
                    flat = i < 20000000;
                }
                //添加psize标签
                if (flat) {
                    if (!iswid) {
                        if (!in_array(item.s_Point, ceHoleList)) {
                            if (item.s_subsid == "雨水篦" || item.s_subsid == "污水篦") {
                                sholeUrl = '/js/cesiumhelp/model/yb22.glb';
                                sscale = 3;
                                sheight = 1.3;
                                spipeheight = 1.3;
                            }
                            var SmodelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                                Cesium.Cartesian3.fromDegrees(item.sCoorWgsX, item.sCoorWgsY, item.shight - lengtvalue - msa));
                            //画S管点
                            var WSmodel = Cesium.Model.fromGltf({
                                id: "pipe_hole_" + item.s_Point + "_$" + item.sholeID,
                                url: sholeUrl,
                                modelMatrix: SmodelMatrix,
                                scale: sscale,
                                primitivesType: "holeType",
                                color: holecolor
                            });
                            holePrimitive.add(WSmodel);
                            ceHoleList.push(item.s_Point);
                        } else {
                            if (item.s_subsid == "雨水篦" || item.s_subsid == "污水篦")
                                spipeheight = 1.3;
                        }
                        //画E管点
                        if (!in_array(item.e_Point, ceHoleList) && ((item.e_subsid == null || item.e_subsid == "") && item.e_Feature != "出水口")) {
                            if (item.e_subsid == "雨水篦" || item.e_subsid == "污水篦") {
                                eholeUrl = '/js/cesiumhelp/model/yb22.glb';
                                escale = 3;
                                eheight = 1.3;
                                epipeheight = 1.3;
                            }
                            var EmodelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                                Cesium.Cartesian3.fromDegrees(item.eCoorWgsX, item.eCoorWgsY, item.ehight - lengtvalue - msa));
                            var YSmodel = Cesium.Model.fromGltf({
                                id: "pipe_hole_" + item.e_Point + "_$" + item.eholeID,
                                url: eholeUrl,
                                modelMatrix: EmodelMatrix,
                                scale: escale,
                                primitivesType: "holeType",
                                color: holecolor
                            });
                            holePrimitive.add(YSmodel);
                            ceHoleList.push(item.e_Point);
                        } else {
                            if (item.e_subsid == "雨水篦" || item.e_subsid == "污水篦")
                                epipeheight = 1.3;
                        }
                    }

                    //管径
                    labels.add({
                        id: "line_labels_" + item.lineID,
                        position: Cesium.Cartesian3.fromDegrees(item.cCoorWgsX, item.cCoorWgsY, item.shight - lengtvalue - msa),
                        text: item.pSize,
                        font: '20px Helvetica',
                        fillColor: attributes,
                        show: false
                    });
                    //流向
                    let slx = (item.sCoorWgsX + item.cCoorWgsX) / 2;
                    slx = (slx + item.cCoorWgsX) / 2;
                    slx = (slx + item.cCoorWgsX) / 2;
                    let sly = (item.sCoorWgsY + item.cCoorWgsY) / 2;
                    sly = (sly + item.cCoorWgsY) / 2;
                    sly = (sly + item.cCoorWgsY) / 2;
                    let elx = (item.cCoorWgsX + item.eCoorWgsX) / 2;
                    elx = (elx + item.cCoorWgsX) / 2;
                    elx = (elx + item.cCoorWgsX) / 2;
                    let ely = (item.cCoorWgsY + item.eCoorWgsY) / 2;
                    ely = (ely + item.cCoorWgsY) / 2;
                    ely = (ely + item.cCoorWgsY) / 2;
                    let ceshight = item.shight - item.ehight;
                    flowto_instances.push(new Cesium.GeometryInstance({
                        id: "flowto_" + item.line_Class + "_" + item.lineID,
                        geometry: new Cesium.PolylineGeometry({
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([slx, sly, (ceshight / 4) + item.ehight - (item.sDeep / 2) - lengtvalue - msa, elx, ely, (ceshight / 4) + item.ehight - (item.sDeep / 2) - lengtvalue - msa]),
                            width: 20.0,
                            vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
                        })
                    }));
                    //画管
                    let shapePositions = computeCircle(0.3);
                    if (item.pSize.indexOf('X') >= 0) //画正方体或者长方体管
                        shapePositions = computeRectangle(item.pSize);
                    else
                        shapePositions = computeCircle(item.pSize);
                    line_instances.push(new Cesium.GeometryInstance({
                        id: "pipe_line_" + item.lno + "_" + item.line_Class + "$" + item.lineID,
                        geometry: new Cesium.PolylineVolumeGeometry({
                            polylinePositions: Cesium.Cartesian3.fromDegreesArrayHeights([item.sCoorWgsX, item.sCoorWgsY, s_pipealtitude, item.eCoorWgsX, item.eCoorWgsY, e_pipealtitude]),
                            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                            shapePositions: shapePositions
                        }),
                        attributes: {
                            color: Cesium.ColorGeometryInstanceAttribute.fromColor(attributes)
                        }
                    }));
                }
            });

            //流向
            flowtoPrimitive = new Cesium.Primitive({
                geometryInstances: flowto_instances, //合并
                //某些外观允许每个几何图形实例分别指定某个属性，例如：
                appearance: new Cesium.PolylineMaterialAppearance({
                    material: new Cesium.Material({
                        fabric: {
                            type: 'PolylineArrow',
                            uniforms: {
                                color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
                            }
                        }
                    })
                }),
                show: false
            });
            viewer.scene.primitives.add(flowtoPrimitive);

            //管段
            linePrimitive = new Cesium.Primitive({
                geometryInstances: line_instances, //合并
                //某些外观允许每个几何图形实例分别指定某个属性，例如：
                appearance: new Cesium.PerInstanceColorAppearance({ translucent: false, closed: true })
            });
            viewer.scene.primitives.add(linePrimitive);
            viewer.scene.primitives.add(holePrimitive);
            //os('success', data.msg, '', 7000, '');
        }
    }).error(function () {
        layer.close(loadindex);
        os('error', '请求出错了，请刷新页面后重试！', '', 7000, '');
    });
}
function getbuildList() {
    let url = "https://image.imlzx.cn/3dTile/fs/tileset.json";
    if (areacode == "gd_sz_gm")
        url = "https://image.imlzx.cn/3dTile/gm/tileset.json";

    palaceTileset = new Cesium.Cesium3DTileset({
        url: url
        //或者url: 'http://ip:port/www/DAEPalace/tileset.json'
    });
    viewer.scene.primitives.add(palaceTileset);
}
function getCivicCenter() {
    let url = "https://image.imlzx.cn/3dTile/qx/tileset.json";
    palaceTileset = new Cesium.Cesium3DTileset({
        url: url
    });
    let tileset = viewer.scene.primitives.add(palaceTileset);
    tileset.readyPromise.then(function (argument) {
        var longitude = 114.20115646;
        var latitude = 22.7471369382;
        var height = 0;
        // 1、旋转
        let hpr = new Cesium.Matrix3();
        // new Cesium.HeadingPitchRoll(heading, pitch, roll)
        // heading围绕负z轴的旋转。pitch是围绕负y轴的旋转。Roll是围绕正x轴的旋转
        let hprObj = new Cesium.HeadingPitchRoll(Math.PI, Math.PI, Math.PI);
        //  Cesium.Matrix3.fromHeadingPitchRoll （headingPitchRoll，result）
        hpr = Cesium.Matrix3.fromHeadingPitchRoll(hprObj, hpr);
        // 2、平移
        // 2.3储存平移的结果
        let modelMatrix = Cesium.Matrix4.multiplyByTranslation(
            // 2.1从以度为单位的经度和纬度值返回Cartesian3位置
            // 2.2计算4x4变换矩阵
            Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(longitude, latitude, height)), new Cesium.Cartesian3(), new Cesium.Matrix4()
        );
        /// 3、应用旋转
        // Cesium.Matrix4.multiplyByMatrix3 （矩阵，旋转，结果）
        Cesium.Matrix4.multiplyByMatrix3(modelMatrix, hpr, modelMatrix);
        tileset._root.transform = modelMatrix;
    });
}
function flyTo(lng, lat, height) {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat,
            height)
    });
}
function computeRectangle(psize) {
    let psizeArr = psize.split('X');

    let wide = Number(psizeArr[0]) / 2000;
    let long = Number(psizeArr[1]) / 2000;
    var positions = [];
    positions
        .push(new Cesium.Cartesian2(wide, long));
    positions
        .push(new Cesium.Cartesian2(-wide, long));
    positions
        .push(new Cesium.Cartesian2(-wide, -long));
    positions
        .push(new Cesium.Cartesian2(wide, -long));
    return positions;
}
function computeCircle(radius) {
    radius = Number(radius) / 1000;//并转为米
    radius = radius / 2;//半径
    var positions = [];
    for (var i = 0; i < 360; i++) {
        var radians = Cesium.Math.toRadians(i);
        positions
            .push(new Cesium.Cartesian2(radius * Math.cos(radians),
                radius * Math.sin(radians)));
    }
    return positions;
}
//toastr提示 toast-top-full-width\toast-top-center
function os(msgtype, msg, title, time, positionClass) {
    time = (time === undefined || time === "" || time === null === undefined ? '7000' : time); // a默认值为1
    positionClass = (positionClass === undefined || positionClass === "" || positionClass === null ? 'toast-top-center' : positionClass); // b默认值为2
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "progressBar": true,
        "positionClass": positionClass,
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": time,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr[msgtype](msg, title);
}
function validationNumber(e, num) {
    var regu = /^[0-9]+\.?[0-9]*$/;
    if (e.value != "") {
        if (!regu.test(e.value)) {
            alert("请输入正确的数字");
            e.value = e.value.substring(0, e.value.length - 1);
            e.focus();
        } else {
            if (num == 0) {
                if (e.value.indexOf('.') > -1) {
                    e.value = e.value.substring(0, e.value.length - 1);
                    e.focus();
                }
            }
            if (e.value.indexOf('.') > -1) {
                if (e.value.split('.')[1].length > num) {
                    e.value = e.value.substring(0, e.value.length - 1);
                    e.focus();
                }
            }
        }
    }
}
function recoveryLineColor() {
    try {
        if (lineCLICKID != "") {
            //移除二维颜色
            var LineID = lineCLICKID.split('$')[1];
            if ($("#plckbox").is(":checked") || !$("#qhckbox").is(":checked")) {
                for (var i = 0; i < bdPolylineID.length; i++) {
                    if (bdPolylineID[i] == LineID) {
                        if (lineCLICKID.indexOf('WS') < 0)
                            bdPolyline[i].setStrokeColor("#881212");
                        else
                            bdPolyline[i].setStrokeColor("#ff50ff");
                        break;
                    }
                }
            }
            if (lineCLICKID.indexOf('WS') < 0) {
                var attributes = linePrimitive.getGeometryInstanceAttributes(lineCLICKID);
                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
            } else {
                var attributes = linePrimitive.getGeometryInstanceAttributes(lineCLICKID);
                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
            }
            lineCLICKID = "";
        }
    } catch (e) {

    }

}
function recoveryHoleColor() {
    try {
        if (holeCLICKID != null) {
            holeCLICKID.primitive.color = Cesium.Color.ALICEBLUE;
        }
        holeCLICKID = null;
    } catch (e) {

    }

}
//隐患点
function getYhData(iswd) {
    $.get('/home/getYhData', null, function (res, status) {
        if (res.response != null) {
            let yh_instances = [];
            $.each(res.response, function (i, item) {
                let heg = 1.6;
                let msa = 0;
                if (iswd)
                    msa = mlengtvalue;
                if (item.tableType === "pipe_hole") {
                    heg = item.height - lengtvalue - msa;
                } else {
                    heg = ((item.height - lengtvalue - msa + item.eheight - lengtvalue - msa) / 2) - 1;
                }
                yh_instances.push(new Cesium.GeometryInstance({
                    id: "yh_" + item.id,
                    geometry: new Cesium.PolylineGeometry({
                        positions: Cesium.Cartesian3.fromDegreesArrayHeights([item.coorWgsX, item.coorWgsY, heg + 1 +0.5, item.coorWgsX, item.coorWgsY, heg + 1]),
                        width: 20.0,
                        vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
                    })
                }));
                //隐患lables
                yhlabels.add({
                    id: "yh_labels_" + item.id,
                    position: Cesium.Cartesian3.fromDegrees(item.coorWgsX, item.coorWgsY, heg + 1+0.5),
                    text: item.testMsg,
                    font: '20px Helvetica',
                    fillColor: Cesium.Color.RED,
                    show: false
                });
            });
            //隐患
            yhPrimitive = new Cesium.Primitive({
                geometryInstances: yh_instances, //合并
                //某些外观允许每个几何图形实例分别指定某个属性，例如：
                appearance: new Cesium.PolylineMaterialAppearance({
                    material: new Cesium.Material({
                        fabric: {
                            type: 'PolylineArrow',
                            uniforms: {
                                color: Cesium.Color.RED
                            }
                        }
                    })
                }),
                show: false
            });
            viewer.scene.primitives.add(yhPrimitive);
        }
    });
}

function addYHMolde(id, longitude, latitude, heght, yhtext) {
    //隐患lables
    yhlabels.add({
        id: "yh_labels_" + id,
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, heght + 1),
        text: yhtext,
        font: '20px Helvetica',
        fillColor: Cesium.Color.RED,
        show: false
    });

    //隐患箭头
    var addyh = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            id: "yh_" + id,
            geometry: new Cesium.PolylineGeometry({ 
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([longitude, latitude, heght + 1, longitude, latitude, heght + 0.5]),
                width: 20.0,
                vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
            })
        }), //合并
        //某些外观允许每个几何图形实例分别指定某个属性，例如：
        appearance: new Cesium.PolylineMaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    type: 'PolylineArrow',
                    uniforms: {
                        color: Cesium.Color.RED
                    }
                }
            })
        }),
        show: false
    });
    viewer.scene.primitives.add(addyh);
}
function bindingHoleDate(data) {
    $("#layercctv").hide();
    $("#videoContainer").html("");
    //处理第一次展示的详情
    $("#property .layui-tab-title li").each(function () {
        $(this).removeClass("layui-this");
    });
    $("#infoTab").addClass("layui-this");
    $("#property .layui-tab-content div").each(function () {
        $(this).removeClass("layui-show");
    });
    $("#infoDIV").addClass("layui-show");
    $("#cctvInfoTab").hide();
    $("#cctvinfdiv").hide();
    $("#syinfoTab").hide();
    $("#flowTOinfoTab").hide();
    $("#syinfoDIV").removeClass('layui-show');
    $("#flowTOinfoDIV").removeClass('layui-show');

    var context = "";
    context += "<tr><td>项目名称：</td><td>" + data.response.model.prj_Name + "</td></tr>";
    context += "<tr><td>Exp_No：</td><td>" + data.response.model.exp_No + "</td></tr>";
    context += "<tr><td>井盖类型：</td><td>" + data.response.model.hType + "</td></tr>";
    context += "<tr><td>ZType：</td><td>" + data.response.model.zType + "</td></tr>";
    context += "<tr><td>深圳独立坐标：</td><td>" + data.response.model.szCoorX + "," + data.response.model.szCoorY + "</td></tr>";
    context += "<tr><td>高度：</td><td>" + data.response.model.hight + "</td></tr>";
    context += "<tr><td>角度：</td><td>" + data.response.model.rotation + "</td></tr>";
    context += "<tr><td>沙井特点：</td><td>" + data.response.model.feature + "</td></tr>";
    context += "<tr><td>沙井类型：</td><td>" + data.response.model.subsid + "</td></tr>";
    context += "<tr><td>材质：</td><td>" + data.response.model.feaMateria + "</td></tr>";
    context += "<tr><td>Spec：</td><td>" + data.response.model.spec + "</td></tr>";
    context += "<tr><td>深度：</td><td>" + data.response.model.deep + "</td></tr>";
    context += "<tr><td>沙井形状：</td><td>" + data.response.model.wellShape + "</td></tr>";
    context += "<tr><td>沙井材质：</td><td>" + data.response.model.wellMater + "</td></tr>";
    context += "<tr><td>井管数：</td><td>" + data.response.model.wellPipes + "</td></tr>";
    context += "<tr><td>沙井大小：</td><td>" + data.response.model.wellSize + "</td></tr>";
    context += "<tr><td>地址：</td><td>" + data.response.model.address + "</td></tr>";
    context += "<tr><td>归属：</td><td>" + data.response.model.belong + "</td></tr>";
    context += "<tr><td>时间：</td><td>" + data.response.model.mDate + "</td></tr>";
    context += "<tr><td>地图编码：</td><td>" + data.response.model.mapCode + "</td></tr>";
    context += "<tr><td>所属单位：</td><td>" + data.response.model.sUnit + "</td></tr>";
    context += "<tr><td>所属单位：</td><td>" + data.response.model.sUnit + "</td></tr>";
    context += "<tr><td>日期：</td><td>" + data.response.model.sDate + "</td></tr>";
    context += "<tr><td>更新日期：</td><td>" + data.response.model.updateTime + "</td></tr>";
    context += "<tr><td>可见度：</td><td>" + data.response.model.visibility + "</td></tr>";
    context += "<tr><td>状态：</td><td>" + data.response.model.status + "</td></tr>";
    context += "<tr><td>pointPosit：</td><td>" + data.response.model.pointPosit + "</td></tr>";
    context += "<tr><td>操作人员：</td><td>" + data.response.model.operator + "</td></tr>";
    context += "<tr><td>备注：</td><td>" + data.response.model.note + "</td></tr>";
    $("#InfoTab1").html(context);
    $("#InfoTab1 tr td:even").addClass("title");
    $("#InfoTab1 tr td:odd").addClass("value");

    var context = "";
    for (var i = 0; i < data.response.dangers.length; i++) {
        var item = data.response.dangers[i];
        context += "<tr><td colspan='2'>" + item.content + "</td></tr>";
        context += "<tr><td colspan='2'>位置：" + item.coorWgsX + "," + item.coorWgsY + "</td></tr>";
        context += "<tr><td width='50%' align='center'>" + item.handUnit + "</td><td width='50%' align='center'>" + item.handleTime + "</td></tr>";
        context += "<tr><td colspan='2'><img src='" + item.gR_img + "'/></td></tr>";
        context += "<tr><td colspan='2' style='height:12px;'></td></tr>";
    }
    if (context === "") {
        context = "暂无隐患信息";
    }
    $("#InfoTab2").html(context);
}
function bindingLineDate(data) {
    $("#layercctv").hide();
    $("#videoContainer").html("");
    //处理第一次展示的详情
    if ($("#ftLineckbox").prop("checked")) {
        $("#ftLineckbox").next().click();
    } if ($("#syLineckbox").prop("checked")) {
        $("#syLineckbox").next().click();
    }
    $("#property .layui-tab-title li").each(function () {
        $(this).removeClass("layui-this");
    });
    $("#infoTab").addClass("layui-this");
    $("#property .layui-tab-content div").each(function () {
        $(this).removeClass("layui-show");
    });
    $("#infoDIV").addClass("layui-show");
    $("#cctvinfdiv").removeClass('layui-show');
    $("#cctvInfo").html("");
    $("#syinfoTab").show();
    $("#flowTOinfoTab").show();

    $("#syLineckbox").prop("checked", false);
    $("#ftLineckbox").prop("checked", false);
    $("#ftLineckbox").attr("data-line", data.response.model.line_Class);
    $("#syLineckbox").attr("data-line", data.response.model.line_Class);


    //流向分析
    var subclassIDsStr = "";
    var subclassIDs = "";
    var fHtml = "";
    var fsum = 0;
    $.each(data.response.flowToMolde.seLineMoldes, function (index, item) {
        var eStr = "否";
        var classSrt = '';
        if (item.e_holeID > 0) {
            eStr = "是";
            classSrt = 'style="background: #fff5d1;"';
            fsum++;
        }
        subclassIDs += "'" + item.id + "'|";
        subclassIDsStr += "pipe_line_" + item.lno + "_" + item.line_Class + "$" + item.id + ",";
        fHtml += "<tr " + classSrt + "  onclick='flytoByLineHole(" + item.id + ",1)'><td>" + item.lno + "</td><td>" + item.pSize + "</td><td>" + eStr + "</td></tr>";
    });
    if (fHtml === "")
        fHtml = "<tr><td colspan='3'>没有流向管数据</td></tr>";
    $("#FlowToBody").html(fHtml);
    //雨污
    ywEchatInit(data.response.flowToMolde.wsLineSum, data.response.flowToMolde.ysLineSum, "流向经过管段", "wyFechat");
    //方与圆
    frEchatInit(data.response.flowToMolde.fLineSum, data.response.flowToMolde.rLineSum, "流向经过管段", "frFechat");

    //溯源分析
    var parentIDsStr = "";
    var parentIDs = "";
    var sHtml = "";
    var sSum = 0;
    $.each(data.response.traceabilityMolde.seLineMoldes, function (index, item) {
        var eStr = "否";
        var classSrt = '';
        if (item.s_holeID > 0) {
            eStr = "是";
            classSrt = 'style="background: #fff5d1;"';
            sSum++;
        }
        parentIDs += "'" + item.id + "'|";
        parentIDsStr += "pipe_line_" + item.lno + "_" + item.line_Class + "$" + item.id + ",";
        sHtml += "<tr " + classSrt + " onclick='flytoByLineHole(" + item.id + ",1)'><td>" + item.lno + "</td><td>" + item.pSize + "</td><td>" + eStr + "</td></tr>";
    });
    if (sHtml === "")
        sHtml = "<tr><td colspan='3'>没有溯源管数据</td></tr>";
    $("#syBody").html(sHtml);
    //雨污
    ywEchatInit(data.response.traceabilityMolde.wsLineSum, data.response.traceabilityMolde.ysLineSum, "来源经过管段", "wyTechat");
    //方与圆
    frEchatInit(data.response.traceabilityMolde.fLineSum, data.response.traceabilityMolde.rLineSum, "来源经过管段", "frTechat");

    if (parentIDsStr != "" && parentIDsStr != null) {
        parentIDsStr = parentIDsStr.substring(0, parentIDsStr.lastIndexOf(','));
        parentIDs = parentIDs.substring(0, parentIDs.lastIndexOf('|'));
    }
    if (subclassIDsStr != "" && subclassIDsStr != null) {
        subclassIDsStr = subclassIDsStr.substring(0, subclassIDsStr.lastIndexOf(','));
        subclassIDs = subclassIDs.substring(0, subclassIDs.lastIndexOf('|'));
    }

    $("#syLineckbox").val(parentIDsStr);
    $("#ftLineckbox").val(subclassIDsStr);
    $("#syLineckbox").attr("data-ids", parentIDs);
    $("#ftLineckbox").attr("data-ids", subclassIDs);

    //基本信息绑定
    var context = "";
    context += "<tr><td>起始井号：</td><td>" + data.response.model.s_Point + "</td></tr>";
    context += "<tr><td>终止井号：</td><td>" + data.response.model.e_Point + "</td></tr>";
    context += "<tr><td>起始井深度：</td><td>" + data.response.model.s_Deep + "</td></tr>";
    context += "<tr><td>终止井深度：</td><td>" + data.response.model.e_Deep + "</td></tr>";
    context += "<tr><td>材质：</td><td>" + data.response.model.material + "</td></tr>";
    context += "<tr><td>管道类型：</td><td>" + data.response.model.line_Class + "</td></tr>";
    context += "<tr><td>code：</td><td>" + data.response.model.code + "</td></tr>";
    context += "<tr><td>ServiceLif：</td><td>" + data.response.model.serviceLif + "</td></tr>";
    context += "<tr><td>管径大小：</td><td>" + data.response.model.pSize + "</td></tr>";
    context += "<tr><td>数量：</td><td>" + data.response.model.cabNum + "</td></tr>";
    context += "<tr><td>总数：</td><td>" + data.response.model.totalHole + "</td></tr>";
    context += "<tr><td>流向：</td><td>" + data.response.model.flowDir + "</td></tr>";
    context += "<tr><td>地址：</td><td>" + data.response.model.address + "</td></tr>";
    context += "<tr><td>道路编号：</td><td>" + data.response.model.roadcode + "</td></tr>";
    context += "<tr><td>填埋方式：</td><td>" + data.response.model.emBed + "</td></tr>";
    context += "<tr><td>调查日期：</td><td>" + data.response.model.mDate + "</td></tr>";
    context += "<tr><td>SUnit：</td><td>" + data.response.model.sUnit + "</td></tr>";
    context += "<tr><td>SDate：</td><td>" + data.response.model.sDate + "</td></tr>";
    context += "<tr><td>更新日期：</td><td>" + data.response.model.updateTime + "</td></tr>";
    context += "<tr><td>管线编号：</td><td>" + data.response.model.lno + "</td></tr>";
    context += "<tr><td>管线类型：</td><td>" + data.response.model.lineType + "</td></tr>";
    //context += "<tr><td>PDS：</td><td>" + data.response.model.pDS + "</td></tr>";
    context += "<tr><td>当前状态：</td><td>" + data.response.model.status + "</td></tr>";
    context += "<tr><td>管道长度：</td><td>" + data.response.model.pipeLength + "</td></tr>";
    context += "<tr><td>操作人员：</td><td>" + data.response.model.operator + "</td></tr>";
    context += "<tr><td>记录：</td><td>" + data.response.model.note + "</td></tr>";
    //context += "<tr><td>SHAPE_Leng：</td><td>" + data.response.model.sHAPE_Leng + "</td></tr>";

    $("#InfoTab1").html(context);

    $("#InfoTab1 tr td:even").addClass("title");
    $("#InfoTab1 tr td:odd").addClass("value");

    var context = "";
    for (var i = 0; i < data.response.dangers.length; i++) {
        var item = data.response.dangers[i];
        context += "<tr><td colspan='2'>" + item.content + "</td></tr>";
        context += "<tr><td colspan='2'>位置：" + item.coorWgsX + "," + item.coorWgsY + "</td></tr>";
        context += "<tr><td width='50%' align='center'>" + item.handUnit + "</td><td width='50%' align='center'>" + item.handleTime + "</td></tr>";
        context += "<tr><td colspan='2'><img src='" + item.gR_img + "'/></td></tr>";
        context += "<tr><td colspan='2' style='height:12px;'></td></tr>";
    }
    if (context === "") {
        context = "暂无隐患信息";
    }
    $("#InfoTab2").html(context);

    //cctv数据
    if (data.response.cctvID != 0) {
        var load = layer.msg('正在获取CCTV资料...', {
            icon: 16
            , shade: 0.01
        });
        //获取cctv信息
        $.get('/home/getCCTVInfoByID', { pipeid: data.response.cctvID }, function (res, status) {
            layer.close(load);
            if (res.response != null) {
                let cctvdata = $.parseJSON(res.response);
                $("#cctvInfo").html(bindingCCTVDate(cctvdata.msg));
                os('success', "获取cctv资料成功！", '');
            } else {
                os('error', "该CCTV数据远程系统正在占用，请稍后再试！", '');
            }
        });

        $("#cctvInfoTab").show();
    } else {
        $("#cctvInfoTab").hide();
    }
}
function flytoByLineHole(lineID, type) {
    if (type == 1) {
        $.each(holdListData.response.lineDateMoldes, function (i, item) {
            if (item.lineID == lineID) {
                var alti_String = (viewer.camera.positionCartographic.height);
                flyTo(item.cCoorWgsX, item.cCoorWgsY, alti_String);
                if (typeof (map) != 'undefined')
                    map.centerAndZoom(new BMapGL.Point(item.dbCoor[0], item.dbCoor[1]), 21);

                return false;
            }
        })
    } else {
        $.each(holdListData.response.lineDateMoldes, function (i, item) {
            if (item.e_holeID == lineID || item.s_holeID == lineID) {
                var alti_String = (viewer.camera.positionCartographic.height);
                flyTo(item.cCoorWgsX, item.cCoorWgsY, alti_String);
                if (typeof (map) != 'undefined')
                    map.centerAndZoom(new BMapGL.Point(item.dbCoor[0], item.dbCoor[1]), 21);

                return false;
            }
        })
    }

}
//移除当前溯源与流向的颜色管
function removeFTcolor() {
    try {
        var ftIDS = $("#ftLineckbox").val().split(',');
        var linetype = $("#ftLineckbox").attr('data-line');

        for (var i = 0; i < ftIDS.length; i++) {
            if (ftIDS[i] != "") {
                var LineID = ftIDS[i].split('$')[1];
                if (linetype === "WS") {
                    try {
                        var attributes = linePrimitive.getGeometryInstanceAttributes(ftIDS[i]);
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
                    } catch (e) {
                    }

                    addcolorForBD(LineID, '#ff50ff')//并列百度变颜色
                } else {
                    try {
                        var attributes = linePrimitive.getGeometryInstanceAttributes(ftIDS[i]);
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
                    } catch (e) {
                    }

                    addcolorForBD(LineID, '#881212')//并列百度变颜色
                }
            }
        }

        var syIDS = $("#syLineckbox").val().split(',');
        var linetype = $("#syLineckbox").attr('data-line');
        for (var i = 0; i < syIDS.length; i++) {
            if (syIDS[i] != "") {
                var LineID = syIDS[i].split('$')[1];
                if (linetype === "WS") {
                    try {
                        var attributes = linePrimitive.getGeometryInstanceAttributes(syIDS[i]);
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
                    } catch (e) {
                    }

                    addcolorForBD(LineID, '#ff50ff')//并列百度变颜色
                } else {
                    try {
                        var attributes = linePrimitive.getGeometryInstanceAttributes(syIDS[i]);
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
                    } catch (e) {

                    }

                    addcolorForBD(LineID, '#881212')//并列百度变颜色
                }
            }
        }
    } catch (e) {

    }
}
//雨水、污水
function ywEchatInit(wsLineSum, ysLineSum, name, Eleid) {
    var myChart = echarts.init(document.getElementById(Eleid));
    option = {
        title: {
            text: name,
            subtext: 'MSDI管段数据'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['管段数量']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 1]
        },
        yAxis: {
            type: 'category',
            data: ['污水管段', '雨水管段']
        },
        series: [
            {
                name: '管段数量',
                type: 'bar',
                data: [wsLineSum, ysLineSum]
            }
        ]
    };
    myChart.setOption(option);
}
//方形管与圆形管
function frEchatInit(fLineSum, rLineSum, name, Eleid) {
    var myChart = echarts.init(document.getElementById(Eleid));
    option = {
        title: {
            text: name,
            subtext: 'MSDI管段数据'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['管段数量']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 1]
        },
        yAxis: {
            type: 'category',
            data: ['方形管', '圆管']
        },
        series: [
            {
                name: '管段数量',
                type: 'bar',
                data: [fLineSum, rLineSum]
            }
        ]
    };
    myChart.setOption(option);
}
function bindingCCTVDate(pipe) {
    var path = "http://106.53.90.211:8080/cctvImage/";
    var itemhtml = '';
    var imgs1Src = '/cctv-ch/img/00001.png';
    if (pipe.items != null) {
        $.each(pipe.items, function (index, item) {
            var aStr = "";
            if (item.path == null || item.path.length <= 0) {
                item.path = '';
            } else if (index == 0) {
                imgs1Src = path + item.path + ".png";
            }
            if (index == 0) {
                aStr = "▶";
            }
            itemhtml += '<tr onclick="tab3_tr(this)">' +
                '<td align="center"><a style="color: #fff;">' + aStr + '</a></td>' +
                '<td>' + item.dist + '</td>' +
                '<td>' + item.code + '</td>' +
                '<td>' + item.grade + '</td>' +
                '<td>' + item.location + '</td>' +
                '<td>' + item.picture + '</td>' +
                '<td>' + item.remarks + '</td>' +
                '<td style="display:none">' + item.path + '</td>' +
                '</tr>';
        });
    }

    if (itemhtml == "" || itemhtml.length <= 0) {
        itemhtml = '<tr onclick="tab3_tr(this)">' +
            '<td align="center"><a style="color: #fff;">▶</a></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td style="display:none"></td>' +
            '</tr>' +
            '<tr onclick="tab3_tr(this)">' +
            '<td align="center"><a></a></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td style="display:none"></td>' +
            '</tr>';
    }


    var s_Str = "";
    if (pipe.value[3] != 0)
        s_Str = '<div class="tishi">管段结构性缺陷等级为' + getkeyvlaue(pipe.sMEvaluate)[0] + ',' + getkeyvlaue(pipe.sMEvaluate)[1] + ',' + getkeyvlaue(pipe.sEvaluate)[1] + '。</div>';

    var m_Str = "";
    if (pipe.value[8] != 0)
        m_Str = '<div class="tishi">管段功能性缺陷等级为' + getkeyvlaue(pipe.yEvaluate)[0] + ',' + getkeyvlaue(pipe.yMEvaluate)[1] + ',' + getkeyvlaue(pipe.yEvaluate)[1] + '。</div>';


    var sm_Str = '<div class="tishi">管段修复等级为' + getkeyvlaue(pipe.rIEvaluate)[0] + ',' + getkeyvlaue(pipe.rIEvaluate)[1] + '；养护等级为' + getkeyvlaue(pipe.mIEvaluate)[0] + ',' + getkeyvlaue(pipe.mIEvaluate)[1] + '。</div>';

    var html = '<table id="tab1" class="cesium-infoBox-defaultTable">' +
        '<tbody><tr>' +
        '<td  align="right">录像文件：</td>' +
        '<td  align="center" id="videoid">' + pipe.video + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td align="right">检测方向：</td>' +
        '<td align="center" id="direction">' + pipe.direction + '</td>' +
        '<td align="right">检测日期：</td>' +
        '<td align="center" id="date">' + pipe.date + '</td>' +
        '</tr>' +
        '</tbody></table>' +
        '<table id="tab2">' +
        '<tbody><tr height="30px">' +
        '<td style="text-indent:10px;">视频</td>' +
        '<td style="text-indent:10px;">图片</td>' +
        '</tr>' +
        '<tr align="center">' +
        "<td><img src='/img/ioc_cctvs.png' title='点击播放CCTV' onclick='PlayCCTV(&#x27;" + pipe.video + "&#x27;)'  style='width: 240px;'></td>" +
        '<td><img id="image" src="' + imgs1Src + '" title="图片浏览" onclick="imgset(this)"  style="width: 240px;"></td>' +
        '</tr>' +
        '</tbody></table><div class="clear"></div>' +
        '<div id="itemMemu">' +
        '<div style="color: #ff6767;">记录数据</div>' +
        '</div>' +
        '<div id="showItem">' +
        '<table id="tab3">' +
        '<thead>' +
        '<tr height="30px">' +
        '<th width="4%" rowspan="2"></th>' +
        '<th width="12%" rowspan="2">距离(m)</th>' +
        '<th width="12%" rowspan="2">缺陷代码</th>' +
        '<th width="12%" rowspan="2">等级</th>' +
        '<th width="12%" rowspan="2">位置</th>' +
        '<th width="12%" rowspan="2">照片序号</th>' +
        '<th width="36%" rowspan="2">备注</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="pipeItem">' + itemhtml +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<input type="file" id="file1" accept="video/*" style="display:none" onchange="file1change(this)"><input type="file" id="file2" accept="image/*" style="display:none">' +
        '<div class="footerShell">' +
        '<div class="footer">' +
        '<div>' +
        '<div class="layui-card-header" style="color: #ff6767;">管段分析</div>' +
        '</div>' + s_Str + m_Str + sm_Str +
        '</div>' +
        '</div>';
    return html;
}
function getkeyvlaue(kv) {
    var keyvlaue = [];
    for (var key in kv) {
        keyvlaue[0] = key;
        keyvlaue[1] = kv[key];
    }
    return keyvlaue;
}
function imgset(obj) {
    var imgsrc = $(obj).attr("src");
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        area: '350px',
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: true,
        content: '<div id="tong"><img style="width:350px;" src="' + imgsrc + '"></div>'
    });
}
function file1change(obj) {
    if (!obj.files || !obj.files[0])
        return false;
    var url = getURL(obj.files[0]);
    $("#video").attr("src", url);
    $("#video").attr("poster", "");
    obj.value = "";
}
/** 根据文件获取路径 */
function getURL(file) {
    var url = null;
    if (window.createObjectURL != undefined)
        url = window.createObjectURL(file);
    else if (window.URL != undefined)
        url = window.URL.createObjectURL(file);
    else if (window.webkitURL != undefined)
        url = window.webkitURL.createObjectURL(file);
    return url;
}
function tab3_tr(obj) {
    var path = "http://106.53.90.211:8080/cctvImage/";
    $("#tab3 tbody tr a").text("");
    $(obj).find("td:eq(0) a").text("▶");
    var value = $(obj).find("td:last").text();
    if (value != "" && value.length < 40)
        $("#image").attr("src", path + value + ".png");
    else
        $("#image").attr("src", "/cctv-ch/img/00001.png");

}
function dbvideo(obj) {
    $("#file1").click();
}
function video(obj) {
    if ($(obj).attr("src") != undefined && $(obj).attr("src") != "")
        obj.paused ? obj.play() : obj.pause();
}
//管线图层转换
function olLayerTransformation(ollayer, paramStr, layersName) {
    olMap.removeLayer(ollayer);
    for (var i = 0; i < oLLayerArr.length; i++) {
        if (oLLayerArr[i].className_.indexOf("pipe") >= 0) {
            oLLayerArr.splice(i, 1);
            break;
        }
    }
    let params = {
        'FORMAT': format,
        'VERSION': '1.1.1',
        "LAYERS": layersName,
        "exceptions": 'application/vnd.ogc.se_inimage',
        "viewparams": "areid:" + areid + ";pipetypes:" + paramStr,
    };

    let newSource = ollayer.getSource();
    newSource.updateParams(params);
    ollayer.setSource(newSource);

    oLLayerArr.push(ollayer);
    olMap.addLayer(ollayer);
}
//动态绘制多边形
function createPoint(worldPosition) {
    var point = viewer.entities.add({
        position: worldPosition,
        point: {
            color: Cesium.Color.WHITE,
            pixelSize: 5,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    });
    floatingPointArr.push(point);
    return point;
}
function drawShape(positionData, dbtypes) {
    if (dbtypes === 'line') {
        shape = viewer.entities.add({
            polyline: {
                positions: positionData,
                clampToGround: true,
                width: 3
            }
        });
    }
    else if (dbtypes === 'polygon') {
        shape = viewer.entities.add({
            polygon: {
                hierarchy: positionData,
                material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7))
            }
        });
    } else if (dbtypes === 'circle') {
        //当positionData为数组时绘制最终图，如果为function则绘制动态图
        var value = typeof positionData.getValue === 'function' ? positionData.getValue(0) : positionData;
        //var start = activeShapePoints[0];
        //var end = activeShapePoints[activeShapePoints.length - 1];
        //var r = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
        //r = r ? r : r + 1;
        shape = viewer.entities.add({
            position: activeShapePoints[0],
            name: 'Blue translucent, rotated, and extruded ellipse with outline',
            type: 'Selection tool',
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(function () {
                    //半径 两点间距离
                    var r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
                    return r ? r : r + 1;
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty(function () {
                    var r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
                    return r ? r : r + 1;
                }, false),
                material: Cesium.Color.BLUE.withAlpha(0.5),
                outline: true
            }
        });
    } else if (dbtypes === 'rectangle') {
        //当positionData为数组时绘制最终图，如果为function则绘制动态图
        var arr = typeof positionData.getValue === 'function' ? positionData.getValue(0) : positionData;
        shape = viewer.entities.add({
            name: 'Blue e',
            rectangle: {
                coordinates: new Cesium.CallbackProperty(function () {
                    var obj = Cesium.Rectangle.fromCartesianArray(arr);
                    //if(obj.west==obj.east){ obj.east+=0.000001};
                    //if(obj.south==obj.north){obj.north+=0.000001};
                    return obj;
                }, false),
                material: Cesium.Color.RED.withAlpha(0.5)
            }
        });
    }
    return shape;
}
function terminateShape(dbtype) {
    activeShapePoints.pop();//去除最后一个动态点
    if (activeShapePoints.length) {
        drawShape(activeShapePoints, dbtype);//绘制最终图
    }
    viewer.entities.remove(floatingPoint);//去除动态点图形（当前鼠标点）
    viewer.entities.remove(activeShape);//去除动态图形
    floatingPoint = undefined;
    activeShape = undefined;
    activeShapePoints = [];
}
function getInverseTransform() {
    let transform;
    let tmp = palaceTileset.root.transform;
    if ((tmp && tmp.equals(Cesium.Matrix4.IDENTITY)) || !tmp) {
        // 如果root.transform不存在，则3DTiles的原点变成了boundingSphere.center
        transform = Cesium.Transforms.eastNorthUpToFixedFrame(palaceTileset.boundingSphere.center);
    } else {
        transform = Cesium.Matrix4.fromArray(palaceTileset.root.transform);
    }
    return Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4());
}
function getOriginCoordinateSystemPoint(point, inverseTransform) {
    let val = Cesium.Cartesian3.fromDegrees(point.lng, point.lat);
    return Cesium.Matrix4.multiplyByPoint(
        inverseTransform, val, new Cesium.Cartesian3(0, 0, 0));
}
function createPlane(p1, p2, inverseTransform) {
    // 将仅包含经纬度信息的p1,p2，转换为相应坐标系的cartesian3对象
    let p1C3 = getOriginCoordinateSystemPoint(p1, inverseTransform);
    let p2C3 = getOriginCoordinateSystemPoint(p2, inverseTransform);
    // 定义一个垂直向上的向量up
    let up = new Cesium.Cartesian3(0, 0, -10);
    //  right 实际上就是由p1指向p2的向量
    let right = Cesium.Cartesian3.subtract(p2C3, p1C3, new Cesium.Cartesian3());
    // 计算normal， right叉乘up，得到平面法向量，这个法向量指向right的右侧
    let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
    normal = Cesium.Cartesian3.normalize(normal, normal);
    //由于已经获得了法向量和过平面的一点，因此可以直接构造Plane,并进一步构造ClippingPlane
    let planeTmp = Cesium.Plane.fromPointNormal(p1C3, normal);
    return Cesium.ClippingPlane.fromPlane(planeTmp);
}
function isClockWise(latLngArr) {
    if (latLngArr.length < 3) {
        return null;
    }
    if (latLngArr[0] === latLngArr[latLngArr.length - 1]) {
        latLngArr = latLngArr.slice(0, latLngArr.length - 1);
    }
    let latMin = { i: -1, val: 90 };
    for (let i = 0; i < latLngArr.length; i++) {
        let { lat } = latLngArr[i];
        if (lat < latMin.val) {
            latMin.val = lat;
            latMin.i = i;
        }
    };
    let i1 = (latMin.i + latLngArr.length - 1) % latLngArr.length;
    let i2 = latMin.i;
    let i3 = (latMin.i + 1) % latLngArr.length;

    let v2_1 = {
        lat: latLngArr[i2].lat - latLngArr[i1].lat,
        lng: latLngArr[i2].lng - latLngArr[i1].lng
    };
    let v3_2 = {
        lat: latLngArr[i3].lat - latLngArr[i2].lat,
        lng: latLngArr[i3].lng - latLngArr[i2].lng
    };
    let result = v3_2.lng * v2_1.lat - v2_1.lng * v3_2.lat;
    // result>0 3-2在2-1的顺时针方向 result<0 3-2在2-1的逆时针方向 result==0 3-2和2-1共线，可能同向也可能反向
    return result === 0 ? (latLngArr[i3].lng < latLngArr[i1].lng) : (result > 0);
}
//根据cookie修改页面
function CookieChoohtml(callback) {
    if (areacode == "gd_sz_gm") {
        areid = 2;
        latval = -0.002863038721292;
        lngval = 0.0049005903307;
        lengtvalue = 24;
        mlengtvalue = 24;
    } else if (areacode == "gd_fs") {
        areid = 1;
        latval = -0.0026169694041;
        lngval = 0.00544058017012;
        lengtvalue = 0;
        mlengtvalue = 0;
    } else if (areacode == "gd_sz_sm") {
        areid = 0;
        lengtvalue = 0;
        mlengtvalue = 0;
        latval = - 0.003045587501575;
        lngval = 0.00540591756882;
    } else {
        areid = 1;
        latval = -0.0026169694041;
        lngval = 0.00544058017012;
        lengtvalue = 0;
        mlengtvalue = 0;
    }
    callback && callback(initCesium);
}
function initlocation() {
    if (areacode == "gd_sz_gm") {
        flyTo(113.94314303246384, 22.746454084801524, 730.0222897488);
        olMap.getView().setCenter([113.94314303246384, 22.746454084801524]);
        olMap.getView().setZoom(17.404315028416946);
        try {
            map.centerAndZoom(new BMapGL.Point(113.93043624568712, 22.78495878251252, 21));
        } catch (e) {

        }
    } else if (areacode == "gd_fs") {
        flyTo(113.08343495207401, 22.949133135126246, 730.0222897488);
        olMap.getView().setCenter([113.08343495207401, 22.949133135126246]);
        olMap.getView().setZoom(18.703693552114576);
        try {
            map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21);  // 初始化地图,设置中心点坐标和地图级别
        } catch (e) {

        }
    } else if (areacode == "gd_sz_sm") {
        flyTo(114.0555891520, 22.5413770432, 730.0222897488);
        olMap.getView().setCenter([114.05971697090581, 22.539934539441248]);
        olMap.getView().setZoom(17.404315028416946);
        try {
            map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21);  // 初始化地图,设置中心点坐标和地图级别
        } catch (e) {

        }
    }
}