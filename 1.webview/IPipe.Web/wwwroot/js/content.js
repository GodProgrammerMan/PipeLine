var jsentities;
var buildingNumber;
var buildIndex = 0;
var lablesShow = false;
var flowtoShow = false;
var lineCLICKID = "";
var holeCLICKID = null;
$(function () {
    getbuildList();

    getLineHoles();
    flyTo(113.9190928199, 22.7842061118, 300);

    //鼠标事件监听
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    //单击
    handler.setInputAction(function (movement) {
        let cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
        var pick = viewer.scene.pick(movement.position);
        console.log(pick);
        if ($('body').hasClass("cousline")) {
            console.log($('body').css("cursor"));
            if (Cesium.defined(pick) && (pick.id.indexOf != "undefined" || pick.id.indexOf != undefined) && (pick.id.indexOf('pipe_') > -1)) {
                let x = 0; 
                let y = 0; 
                let h = 0; 
                if (cartesian) {
                    let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                    x = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10);
                    y = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10);
                    h = (viewer.camera.positionCartographic.height / 1000).toFixed(10);
                }
                //在判断是井还是管段
                if (pick.id.indexOf('pipe_hole_') > -1) {
                    //添加管的隐患点
                    var holeID = pick.id.split('_')[2];
                    showBox('管点隐患上报', '/HiddenDanger/index?action=add&ty=1&x=' + x + '&y=' + y + '&h=' + h + '&objID=' + holeID, ['1100px', '700px']);
                    
                } else {
                    var LineID = lineCLICKID.split('_')[3];
                   //添加管段的隐患点
                    showBox('管段隐患上报', '/HiddenDanger/index?action=add&ty=2&x=' + x + '&y=' + y + '&h=' + h + '&objID=' + LineID, ['1100px', '700px']);

                }
            } else {
                os('info', "请选择存在隐患的管段或者井,双击则取消！", '');
            }
        }
        recoveryLineColor();
        recoveryHoleColor();
        if (Cesium.defined(pick) && (pick.id.indexOf('pipe_') > -1)) {
            //管点、点击
            if (pick.id.indexOf('pipe_hole_') > -1) {
                $("#property").hide();
                holeCLICKID = pick;
                pick.primitive.color = Cesium.Color.CHOCOLATE;
                //请求管点信息
                var holeID = pick.id.split('_')[2];
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
                        console.log(data.response);
                    }
                }).error(function () { layer.close(loadindex); os('error', data.msg, '请求出错了，请刷新页面后重试！'); });
            } else {
                recoveryHoleColor();
            }

            //管段点击
            if (pick.id.indexOf('pipe_line_') > -1) {
                $("#property").hide();
                lineCLICKID = pick.id;
                var attributes = linePrimitive.getGeometryInstanceAttributes(pick.id);
                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN);
                //请求管线信息
                var LineID = lineCLICKID.split('_')[3];
                var loadindex = layer.load(1, {
                    shade: [0.1, '#000']
                });
                $.post("/home/getLineInfoByID", { id: LineID}, function (data, status) {
                    layer.close(loadindex);
                    if (!data.success) {
                        os('error', data.msg, '');
                    } else {
                        os('success', data.msg, '');
                        $("#property").show();
                        //管段绑数据的开始
                        console.log(data.response);
                    }
                }).error(function () {layer.close(loadindex); os('error', data.msg, '请求出错了，请刷新页面后重试！'); });
            }

        } 
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //移动
    handler.setInputAction(function (movement) {
        //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
        let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
        if (cartesian) {
            let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            let lat_String = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10),
                log_String = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10),
                alti_String = (viewer.camera.positionCartographic.height / 1000).toFixed(10);
            $("#heght").html(alti_String);
            $("#lng").html(log_String);
            $("#lat").html(lat_String);
        }
        var pick = viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pick) && (pick.id.indexOf != "undefined" || pick.id.indexOf != undefined) && (pick.id.indexOf('pipe_') > -1)) {

        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //相机
    viewer.scene.camera.moveEnd.addEventListener(function () {
        //获取当前相机高度
        height = Math.ceil(viewer.camera.positionCartographic.height);

        //流向缩放出现和隐藏
        if (height <= 100 && flowtoShow == false) {
            flowtoPrimitive.show = true;
            flowtoShow = true;
        } else if (height > 100 && flowtoShow == true) {
            flowtoPrimitive.show = false;
            flowtoShow = false;
        }
        //flowtoPrimitive
        //标签缩放出现和隐藏
        if (height <= 77 && lablesShow == false) {
            for (var i = 0; i < labels.length; i++) {
                labels.get(i).show = true;
            }
            lablesShow = true;
        } else if (height > 77 && lablesShow == true) {
            for (var i = 0; i < labels.length; i++) {
                labels.get(i).show = false;
            }
            lablesShow = false;
        }
    })

})

function getLineHoles() {
    var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteGreen.uniforms.color = Cesium.Color.LIME;
    silhouetteGreen.uniforms.length = 0.01;
    silhouetteGreen.selected = [];
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });
    $.post("/home/getLineHolesDate", {}, function (data, status) {
        layer.close(loadindex);
        if (!data.response) {
            os('error', data.msg, '', 7000, '');
        } else {
            //画管段
            let line_instances = [];
            var flowto_instances = [];
            let holecolor = Cesium.Color.ALICEBLUE;
            $.each(data.response.lineDateMoldes, function (i, item) {
                var attributes = Cesium.Color.DEEPPINK;
                let holeUrl = '/js/cesiumhelp/model/11.glb';
                if (item.line_Class === "WS") {
                    attributes = Cesium.Color.DEEPPINK;
                    holeUrl = '/js/cesiumhelp/model/11.glb';
                } else {
                    attributes = Cesium.Color.DARKRED;
                }
                //添加psize标签
                if (i < 1000) {
                    var SmodelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                        Cesium.Cartesian3.fromDegrees(item.sCoorWgsY, item.sCoorWgsX, 0.0));
                    //画S管点
                    var WSmodel = scene.primitives.add(Cesium.Model.fromGltf({
                        id: "pipe_hole_" + item.sholeID,
                        url: holeUrl,
                        modelMatrix: SmodelMatrix,
                        scale: 6,
                        primitivesType: "holeType",
                        color: holecolor
                    }));
                    holePrimitive.push(WSmodel);
                    //画E管点
                    var EmodelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                        Cesium.Cartesian3.fromDegrees(item.eCoorWgsY, item.eCoorWgsX, 0.0));
                    var YSmodel = scene.primitives.add(Cesium.Model.fromGltf({
                        id: "pipe_hole_" + item.eholeID,
                        url: holeUrl,
                        modelMatrix: EmodelMatrix,
                        scale: 6,
                        primitivesType: "holeType",
                        color: holecolor
                    }));
                    holePrimitive.push(YSmodel);


                    //管径
                    labels.add({
                        id: "line_labels_" + item.lineID,
                        position: Cesium.Cartesian3.fromDegrees(item.cCoorWgsY, item.cCoorWgsX, 1.2),
                        text: item.pSize,
                        font: '20px Helvetica',
                        fillColor: attributes,
                        show: false
                    });

                    //流向
                    flowto_instances.push(new Cesium.GeometryInstance({
                        id: "flowto_" + item.line_Class + "_" + item.lineID,
                        geometry: new Cesium.PolylineGeometry({
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([item.sCoorWgsY, item.sCoorWgsX, 6, item.eCoorWgsY, item.eCoorWgsX, 6]),
                            width: 20.0,
                            vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
                        })
                    }));

                    //画管
                    line_instances.push(new Cesium.GeometryInstance({
                        id: "pipe_line_" + item.line_Class+"_" + item.lineID,
                        geometry: new Cesium.PolylineVolumeGeometry({
                            polylinePositions: Cesium.Cartesian3.fromDegreesArrayHeights([item.sCoorWgsY, item.sCoorWgsX, 0.5, item.eCoorWgsY, item.eCoorWgsX, 0.5]),
                            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                            shapePositions: computeCircle(0.3)
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
                })
            });
            viewer.scene.primitives.add(flowtoPrimitive);

            //管段
            linePrimitive = new Cesium.Primitive({
                geometryInstances: line_instances, //合并
                //某些外观允许每个几何图形实例分别指定某个属性，例如：
                appearance: new Cesium.PerInstanceColorAppearance({ translucent: false, closed: true })
            });
            viewer.scene.primitives.add(linePrimitive);

            os('success', data.msg, '', 7000, '');
        }
    }).error(function () {
        layer.close(loadindex);
        os('error', '请求出错了，请刷新页面后重试！', '', 7000, '');
    });
}



function getbuildList() {
    var palaceTileset = new Cesium.Cesium3DTileset({
        url: '/js/cesiumhelp/3dTile/gm/tileset.json'
        //或者url: 'http://ip:port/www/DAEPalace/tileset.json'
    })
    viewer.scene.primitives.add(palaceTileset);  
}


function flyTo(lng, lat, height) {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat,
            height)
    });
}

function computeCircle(radius) {
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
    }
    toastr[msgtype](msg, title)
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
    if (lineCLICKID != "") {
        if (lineCLICKID.indexOf('WS') < 0) {
            var attributes = linePrimitive.getGeometryInstanceAttributes(lineCLICKID);
            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
        } else {
            var attributes = linePrimitive.getGeometryInstanceAttributes(lineCLICKID);
            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
        }
        lineCLICKID = "";
    }
}
function recoveryHoleColor() {
    if (holeCLICKID != null) {
        holeCLICKID.primitive.color = Cesium.Color.ALICEBLUE;
    }
    holeCLICKID = null;
}