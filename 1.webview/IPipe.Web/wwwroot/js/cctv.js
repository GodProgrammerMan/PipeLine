var geoserverURLIP = "https://map.imlzx.cn:8082/geoserver/MSDI/wms", ioclayer, latval, lngval, oLyhLayer, cctvvideoArr = [{ linid: 0, devid: 1 }, { linid: 0, devid: 2 }, { linid: 0, devid: 3 },{ linid: 0, devid: 4 }], oLcctvLayer, bingmaplayerMap, olMap, rate,format = 'image/png', areacode = $.cookie('area'), areid = 1,oLLayerArr = [];//ol- layer数组;
$(function () {
    CookieChoohtml();
    GetSearchList('8');
    //删除加载动画
    $('#load').fadeOut(2);
    document.onclick = function (e) {
        $(".msdi-sys-menu-ul").hide();
    };
    $("#sys-muen").on("click", function (e) {
        if ($(".msdi-sys-menu-ul").css("display") == "none") {
            $(".msdi-sys-menu-ul").show();
        } else {
            $(".msdi-sys-menu-ul").hide();
        }
        e = e || event;
        stopFunc(e);
    });

    $('video').on('click', function () {
        let devid = $(this).attr('data-index');
        if ($("#ccvt-label" + devid).hasClass('cctv_active')) {
            return;
        }
        for (var i = 1; i <= 4; i++) {
            $("#line_content" + i).hide();
        }
        $("#line_content" + devid).show();
        $(".ccvt-label").each(function () {
            let obj = $(this);
            if (obj.attr("id") == "ccvt-label" + devid) {
                obj.addClass('cctv_active');
            } else
                obj.removeClass('cctv_active');
        });
    });

    layui.use(['rate', 'element'], function () {
        rate = layui.rate;
        var form = layui.form;
        form.on('checkbox(layercheckShow)', function (data) {
            let obj = this;
            let idvalue = $(obj).attr("id");
            switch (idvalue) {
                case 'yhlayerbj'://隐患图层
                    if (data.elem.checked)
                        oLyhLayer.setVisible(true);
                    else
                        oLyhLayer.setVisible(false);
                    break;
                case 'cctvlayerbj'://cctv图层
                    if (data.elem.checked)
                        oLcctvLayer.setVisible(true);
                    else
                        oLcctvLayer.setVisible(false);
                    break;
                case 'dtlayerbj'://地图底图
                    if (data.elem.checked)
                        bingmaplayerMap.setVisible(true);
                    else
                        bingmaplayerMap.setVisible(false);
                    break;
                default:
                    layer.msg("当前状态不支持该操作");
            }
        });
    });
    $("#search_bnt").on('click', function () {
        if ($("#keyword").val() === "") {
            layer.msg("请输入关键字");
            return;
        }
        let kw = $("#keyword").val();
        GetSearchList(kw);
    });
    //ol地图加载二维
    initOL();
});

function GetSearchList(kw) {
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });

    $.post("/home/getPipeLineList", { kw: kw}, function (data, status) {
        layer.close(loadindex);
        let htmlstr = "";
        if (!data.success) {
            htmlstr = '<span>沒有找到相关管线...</span>';
            layer.msg(data.msg);
        } else {
            $.each(data.response, function (i, item) {
                htmlstr += '<div class="list__item" onclick="playcctv(' + item.id + ',&#x27;' + item.eNo + '&#x27;)">' +
                            '<div class="list__item-content">'+
                                '<div class="list__item-title">' + item.eNo+'</div>' +
                                '<div class="list__item-description">地址：' + item.addreess + '</div>' +
                            '</div>'+
                           '</div>';
            });
        }
        $("#res_list").html(htmlstr);
    }).error(function () {
        layer.close(loadindex);
        layer.msg("网络错误！");
    });
}

function playcctv(lineid,lno) {
    //检测是否正在播放的管线
    for (var i = 0; i < cctvvideoArr.length; i++) {
        if (cctvvideoArr[i].linid == lineid) {
            layer.msg('该数据正在' + cctvvideoArr[i].devid + '设备上播放！', { time: 2000, icon: 6 });
            return;
        } 
    }
    layer.confirm('请选择在哪个播放器设备播放管段编号' + lno + '的CCTV？', {
        btn: ['取消', '1号设备', '2号设备', '3号设备', '4号设备']
        , btn3: function (index, layero) {
            setplaycctv(lineid,2);
        }, btn4: function (index, layero) {
            setplaycctv(lineid,3);
        }, btn5: function (index, layero) {
            setplaycctv(lineid,4);
        }
    }, function () {
            layer.msg('取消成功', { icon: 1 });
    }, function () {
            setplaycctv(lineid,1);
    });
}
function setplaycctv(lineid,devid) {
    //获取cctv数据并绑定管线数据
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });
    $.post("/home/getLineCCTVdata", { id: lineid }, function (data, status) {
        layer.close(loadindex);
        let htmlstr = "";
        if (!data.success) {
            htmlstr = '<span>沒有找到相关管线...</span>';
            layer.msg(data.msg);
            return;
        } else {
            let linemode = data.response;
            if (linemode.classType === "WS") 
                linemode.classType = "污水管";
             else
                linemode.classType = "雨水管";
            htmlstr = '<p><span>管段编号：</span>' + linemode.lno +'<span></span></p>'+
                        '<p><span>起始井编号：</span><span>'+linemode.spoint+'</span></p>'+
                        '<p><span>结束井编号：</span><span>'+linemode.epoint+'</span></p>'+
                        '<p><span>排水类型：</span><span>'+linemode.classType+'</span></p>'+
                        '<p><span>管段材料：</span><span>'+linemode.material+'</span></p>'+
                        '<p><span>管段大小：</span><span>'+linemode.pSize+'</span></p>'+
                        '<p><span>填埋方式：</span><span>' + linemode.emBed + '</span></p>' +
                        '<p><span>所属单位：</span><span>' + linemode.belong + '</span></p>' +
                        '<p><span>所在位置：</span><span>' + linemode.address + '</span></p>'+
                        '<p><span>隐患信息：</span><span class="mark_red">' + linemode.yhcontent + '</span></p>';
            $("#cctvvideo_lno" + devid).html("管段编号：" + linemode.lno);
            if (linemode.isAnyCCTV) {
                let colorvlue = "#008000";
                if (linemode.grade == 2) 
                    colorvlue = '#FFFF00';
                else if (linemode.grade == 3) 
                    colorvlue = '#EE82E';
                else if (linemode.grade == 4) 
                    colorvlue = '#FF0000';
                rate.render({
                    elem: '#video' + devid + '_grade'
                    , length: 4
                    , value: linemode.grade
                    , readonly: true
                    , theme: colorvlue
                    , text: true
                    , setText: function (value) {
                        var arrs = {
                            '1': '（Ⅰ级）'
                            , '2': '（Ⅱ级）'
                            , '3': '（Ⅲ级）'
                            , '4': '（Ⅳ级）'
                        };
                        this.span.text(arrs[value] || (value + "星"));
                    }
                });
                //获取视频
                try {
                    let cctvjson = JSON.parse(linemode.cctvJsonStr);
                    document.getElementById("video" + devid).src = "https://image.imlzx.cn/cctv/" + cctvjson.msg.video + ".mp4";
                    document.getElementById("video" + devid).play();
                    setTimeout(function () {
                        let _video = document.getElementById("video" + devid);
                        if (_video.paused) {
                            layer.msg('视频文件或已被锁定,无法播放', { icon: 4 });
                        } 
                    }, 3000);
                } catch (e) {
                    layer.msg('视频文件或已被锁定', { icon: 4 });
                }
                for (var i = 0; i < cctvvideoArr.length; i++) {
                    if (cctvvideoArr[i].devid == devid) {
                        cctvvideoArr[i].linid = lineid;
                        break;
                    } 
                }
                //移除原先查看的cctv 
                let ofeature = ioclayer.getSource().getFeatureById("cctv" + devid);
                if (ofeature != null) {
                    try {
                        ioclayer.getSource().removeFeature(ofeature);
                    } catch (e) {
                    }
                }
                let clat = linemode.clat + lngval;
                let clng = linemode.clng + latval;
                //地图中找出位置，并标明设备号
                var anchor = new ol.Feature({
                    geometry: new ol.geom.Point([clat, clng])
                });
                anchor.setId("cctv" + devid);
                olMap.getView().setCenter([clat, clng]);
                olMap.getView().setZoom(22);
                // 设置样式，在样式中就可以设置图标D:\NetWork\PipeLine\1.webview\Ipipe.Web\wwwroot\img\icon_cctv1.png
                anchor.setStyle(new ol.style.Style({
                    image: new ol.style.Icon({
                        src: '../img/icon_cctv' + devid + '.png',
                        size: [35, 35],
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        opacity: 0.75, 
                    })
                }));
                // 添加到之前的创建的layer中去
                ioclayer.getSource().addFeature(anchor);
            }
        }
        for (var i = 1; i <= 4; i++) {
            if (i != devid) {
                $("#line_content" + i).hide();
            }
        }
        $("#line_content" + devid).html(htmlstr);
        $("#line_content" + devid).show();
    }).error(function () {
        layer.close(loadindex);
        layer.msg("网络错误！");
        return;
    });

    $(".ccvt-label").each(function () {
        let obj = $(this);
        if (obj.attr("id") == "ccvt-label" + devid) {
            obj.addClass('cctv_active');
        } else 
            obj.removeClass('cctv_active');
    });
}
function clearkw() {
    $("#keyword").val('');
    $("#res_list").html('');
}
function initOL() {
    var mousePositionControl = new ol.control.MousePosition({
        className: 'custom-mouse-position',
        target: document.getElementById('location'),
        coordinateFormat: ol.coordinate.createStringXY(5),
        undefinedHTML: '&nbsp;'
    });
    var rotateControl = new ol.control.Rotate({
        autoHide: false
    });


    ioclayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        zIndex: 20
    });
    oLLayerArr.push(ioclayer);

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
        target: 'cctvmap',
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
}
function olMouseEvents() {
    olMap.getView().on('change:resolution', function (evt) {  //放大和缩小事件
    });
    // 地图拖动事件
    olMap.on("moveend", function (evt) {
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
                        if (isAnypoint) {
                            showlayername = 'MSDI:ys_show_pipehole';
                            featuresData = data.features[Anypointi];

                        } else if (!isAnypoint && isAnyline) {
                            showlayername = 'MSDI:ys_show_pipeline';
                            featuresData = data.features[Anylinei];
                            playcctv(featuresData.properties.mysqlid, featuresData.properties.lno);
                        }
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
function stopFunc(e) {
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
}
//城市切换
function switchcity(citycoed) {
    //先执行去掉
    $.cookie('area', null);
    //在添加
    $.cookie('area', citycoed);
    //然后提示成功、跳转页面
    layer.msg("却换成功，正在跳转页面");
    window.setTimeout("window.location=''", 2000);
}
function showBox(titleStr, urlstr, area) {
    titleStr = titleStr || "信息";
    parent.layer.open({
        title: titleStr,
        type: 2,
        area: area || ['90%', '90%'],
        fix: false, //不固定
        maxmin: true,
        content: urlstr
    });
}

function initlocation() {
    var areacode = $.cookie('area');
    if (areacode == "gd_sz_gm") {
        flyTo(113.94314303246384, 22.746454084801524, 730.0222897488);
        try {
            map.centerAndZoom(new BMapGL.Point(113.93043624568712, 22.78495878251252, 21));
        } catch (e) {

        }
    } else if (areacode == "gd_fs") {
        flyTo(113.08343495207401, 22.949133135126246, 730.0222897488);
        try {
            map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21);  // 初始化地图,设置中心点坐标和地图级别
        } catch (e) {

        }
    } else if (areacode =="gd_sz_sm") {
        flyTo(114.0555891520, 22.5413770432, 730.0222897488);
        try {
            map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21);  // 初始化地图,设置中心点坐标和地图级别
        } catch (e) {

        }
    }
}
//根据cookie修改页面
function CookieChoohtml() {
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
    }
}
function enterFullscreen() {
    var docElm = document.documentElement;
    //W3C
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    //FireFox
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    //Chrome等
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    //IE11
    else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
}
function exitFullscreen() {
    //W3C
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    //FireFox
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    //Chrome等
    else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    //IE11
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
function IDMSclear() {
    //禁止所有输出
    console.clear();
}