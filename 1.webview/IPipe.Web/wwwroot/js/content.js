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
        var pick = viewer.scene.pick(movement.position);
        console.log(pick);
        if ($('body').hasClass("cousline")) {
            console.log($('body').css("cursor"));
            if (Cesium.defined(pick) && (pick.id.indexOf != "undefined" || pick.id.indexOf != undefined) && (pick.id.indexOf('pipe_') > -1)) {
                //在判断是井还是管段
                if (pick.id.indexOf('pipe_hole_') > -1) {
                    //添加管的隐患点

                } else {
                   //添加管段的隐患点

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
                        $("#InfoTab2").html(context);

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
                        // os('success', data.msg, '');
                        $("#property").show();
                        //管段绑数据的开始
                        var context = "";
                        context += "<tr><td>项目名称：</td><td>" + data.response.model.prj_Name + "</td></tr>";
                        context += "<tr><td>起始井号：</td><td>" + data.response.model.s_Point + "</td></tr>";
                        context += "<tr><td>终止井号：</td><td>" + data.response.model.e_Point + "</td></tr>";
                        context += "<tr><td>起始井深度：</td><td>" + data.response.model.s_Deep + "</td></tr>";
                        context += "<tr><td>终止井深度：</td><td>" + data.response.model.e_Deep + "</td></tr>";
                        context += "<tr><td>材质：</td><td>" + data.response.model.material + "</td></tr>";
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
                        context += "<tr><td>PDS：</td><td>" + data.response.model.pDS + "</td></tr>";
                        context += "<tr><td>当前状态：</td><td>" + data.response.model.status + "</td></tr>";
                        context += "<tr><td>管道长度：</td><td>" + data.response.model.pipeLength + "</td></tr>";
                        context += "<tr><td>操作人员：</td><td>" + data.response.model.operator + "</td></tr>";
                        context += "<tr><td>记录：</td><td>" + data.response.model.note + "</td></tr>";
                        context += "<tr><td>startbotto：</td><td>" + data.response.model.startbotto + "</td></tr>";
                        context += "<tr><td>startcrow：</td><td>" + data.response.model.startcrow + "</td></tr>";
                        context += "<tr><td>endbotto：</td><td>" + data.response.model.endbotto + "</td></tr>";
                        context += "<tr><td>endcrow：</td><td>" + data.response.model.endcrow + "</td></tr>";
                        context += "<tr><td>Angel：</td><td>" + data.response.model.angel + "</td></tr>";
                        context += "<tr><td>SHAPE_Leng：</td><td>" + data.response.model.sHAPE_Leng + "</td></tr>";
                        context += "<tr><td>管道类型：</td><td>" + data.response.model.line_Class + "</td></tr>";
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
                        $("#InfoTab2").html(context);
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