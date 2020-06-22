var jsentities;
var buildingNumber;
var buildIndex = 0;
var lablesShow = false;
var flowtoShow = false;
var lineCLICKID = "";
var holeCLICKID = null;
var yhPairList = [];
let ceHoleList = [];
let holdListData;
$(function () {
    //建筑物
    getbuildList();
    //线与井点数据
    getLineHoles();
    //隐患点数据
    getYhData();

    initCesium();//起始点

    //鼠标事件监听
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    //单击
    handler.setInputAction(function (movement) {
        var pick = viewer.scene.pick(movement.position);

        if ($('body').hasClass("cousline")) {
            if (Cesium.defined(pick) && (pick.id != undefined && pick.id != "undefined" ) && (pick.id.indexOf('pipe_') > -1)) {
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
                
                holeCLICKID = pick;
                pick.primitive.color = Cesium.Color.CHOCOLATE;
                //请求管点信息
                var holeID = pick.id.split('$')[1];
                //获取数据
                getHoleInfoByID(holeID);

            }

            //管段点击
            if (pick.id.indexOf('pipe_line_') > -1) {
                recoveryLineColor();
                recoveryHoleColor();
                $("#property").hide();
                if(lineCLICKID != pick)
                    removeFTcolor();
                lineCLICKID = pick.id;
                //添加当前颜色的管线信息
                var attributes = linePrimitive.getGeometryInstanceAttributes(pick.id);//三维
                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN);//三维


                //请求管线信息
                var LineID = lineCLICKID.split('$')[1];
                addcolorForBD(LineID, "#01e5e6");//百度二维
                getLineInfoByID(LineID);
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
                alti_String = (viewer.camera.positionCartographic.height).toFixed(10);
            $("#heght").html(alti_String);
            $("#lng").html(log_String);
            $("#lat").html(lat_String);
        }
        var pick = viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pick) && (pick.id != undefined && pick.id != "undefined" ) && (pick.id.indexOf('pipe_') > -1)) {

        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //相机
    //缩放和缩放
    viewer.scene.camera.moveEnd.addEventListener(function () {
        //获取当前相机中心点与高度
        var centerPosition = getCenterPosition();
        height = centerPosition.height;
        var bd09 = wgs84tobd09(centerPosition.lon, centerPosition.lat);
        IsDBdiv();
        if (!IsBddiv && $("#plckbox").is(":checked")) {
            var zoom = getBDMapZoom(height);
            map.panTo(new BMapGL.Point(bd09[0], bd09[1]));
            map.setZoom(zoom);
        }
        //console.log(centerPosition);
        //console.log(bd09);
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

            for (var i = 0; i < yhPairList.length; i++) {
                yhPairList[i].show = true;
            }

        } else if (height > 77 && lablesShow == true) {
            for (var i = 0; i < labels.length; i++) {
                labels.get(i).show = false;
            }
            lablesShow = false;

            for (var i = 0; i < yhPairList.length; i++) {
                yhPairList[i].show = false; 
            }
        }
    })

})



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



function getLineHoles() {
    var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteGreen.uniforms.color = Cesium.Color.LIME;
    silhouetteGreen.uniforms.length = 0.01;
    silhouetteGreen.selected = [];
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });
    $.post("/home/getLineHolesDate", {}, function (data, status) {
        holdListData = data;
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
                let sholeUrl = '/js/cesiumhelp/model/ys.glb';
                let eholeUrl = '/js/cesiumhelp/model/ys.glb';
                let sscale = 6;
                let escale = 6;
                if (item.line_Class === "WS") {
                    attributes = Cesium.Color.DEEPPINK;
                    sholeUrl = '/js/cesiumhelp/model/ws.glb';
                    eholeUrl = '/js/cesiumhelp/model/ws.glb';
                } else {
                    attributes = Cesium.Color.DARKRED;
                }

                //添加psize标签
                if (i < 1000) {

                    var SmodelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                        Cesium.Cartesian3.fromDegrees(item.sCoorWgsX, item.sCoorWgsY, 0.0));

                    if (!in_array(item.s_Point, ceHoleList)) {
                        if (item.s_subsid === "雨篦") {
                            sholeUrl = '/js/cesiumhelp/model/yb.glb';
                            sscale = 3;
                        }
                        //画S管点
                        var WSmodel = scene.primitives.add(Cesium.Model.fromGltf({
                            id: "pipe_hole_" + item.s_Point + "_$" + item.sholeID,
                            url: sholeUrl,
                            modelMatrix: SmodelMatrix,
                            scale: sscale,
                            primitivesType: "holeType",
                            color: holecolor
                        }));
                        holePrimitive.push(WSmodel);
                        ceHoleList.push(item.s_Point);
                    }

                    //画E管点
                    if (!in_array(item.e_Point, ceHoleList)) {
                        if (item.e_subsid === "雨篦") {
                            eholeUrl = '/js/cesiumhelp/model/yb.glb';
                            escale = 3;
                        }

                        var EmodelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                            Cesium.Cartesian3.fromDegrees(item.eCoorWgsX, item.eCoorWgsY, 0.0));
                        var YSmodel = scene.primitives.add(Cesium.Model.fromGltf({
                            id: "pipe_hole_" + item.e_Point + "_$" + item.eholeID,
                            url: eholeUrl,
                            modelMatrix: EmodelMatrix,
                            scale: escale,
                            primitivesType: "holeType",
                            color: holecolor
                        }));
                        holePrimitive.push(YSmodel);
                        ceHoleList.push(item.e_Point);
                    }



                    //管径
                    labels.add({
                        id: "line_labels_" + item.lineID,
                        position: Cesium.Cartesian3.fromDegrees(item.cCoorWgsX, item.cCoorWgsY, 1.2),
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
                    flowto_instances.push(new Cesium.GeometryInstance({
                        id: "flowto_" + item.line_Class + "_" + item.lineID,
                        geometry: new Cesium.PolylineGeometry({
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([slx, sly, 1.5, elx, ely , 1.5]),
                            width: 20.0,
                            vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
                        })
                    }));

                    //画管
                    let shapePositions = computeCircle(0.3);
                    if (item.pSize.indexOf('X') >= 0) {//画正方体或者长方体管
                        shapePositions = computeRectangle(item.pSize);
                    }

                    line_instances.push(new Cesium.GeometryInstance({
                        id: "pipe_line_" + item.lno + "_" + item.line_Class + "$" + item.lineID,
                        geometry: new Cesium.PolylineVolumeGeometry({
                            polylinePositions: Cesium.Cartesian3.fromDegreesArrayHeights([item.sCoorWgsX, item.sCoorWgsY, 0.5, item.eCoorWgsX, item.eCoorWgsY, 0.5]),
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

function computeRectangle(psize) {
    var positions = [];
    positions
        .push(new Cesium.Cartesian2(0.25, 0.25));
    positions
        .push(new Cesium.Cartesian2(-0.25, 0.25));
    positions
        .push(new Cesium.Cartesian2(-0.25, -0.25));
    positions
        .push(new Cesium.Cartesian2(0.25, -0.25));
    return positions;
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
        //移除二维颜色
        var LineID = lineCLICKID.split('$')[1];
        if ($("#plckbox").is(":checked")) {
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

        lineCLICKID = "";
    }
}
function recoveryHoleColor() {
    if (holeCLICKID != null) {
        holeCLICKID.primitive.color = Cesium.Color.ALICEBLUE;
    }
    holeCLICKID = null;
}

//隐患点
function getYhData() {
    $.get('/home/getYhData', null, function (res, status) {
        if (res.response != null) {
            $.each(res.response, function (i, item) {
                var heg = 1.6;
                if (item.tableType === "pipe_hole") 
                    heg = 4;
                addYHMolde(item.id, item.coorWgsX, item.coorWgsY, heg, item.testMsg);
            });
        } 
    });
}

function addYHMolde(id, longitude, latitude, heght, yhtext) {
    //隐患lables
    labels.add({
        id: "yh_labels_" + id,
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 5),
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
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([longitude, latitude, 5, longitude, latitude, heght]),
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
    yhPairList.push(addyh);
    viewer.scene.primitives.add(addyh);
}

function bindingHoleDate(data) {
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
    $("#InfoTab2").html(context);
}
function bindingLineDate(data) {
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
        subclassIDsStr += "pipe_line_" + item.lno + "_" + item.line_Class + "$" + item.id + ",";
        fHtml += "<tr " + classSrt + "  onclick='flytoByLineHole(" + item.id + ",1)'><td>" + item.lno + "</td><td>" + item.pSize + "</td><td>" + eStr+"</td></tr>";
    });
    if (fHtml === "") 
        fHtml = "<tr><td colspan='3'>没有流向管数据</td></tr>";
    $("#FlowToBody").html(fHtml);
    //雨污
    ywEchatInit(data.response.flowToMolde.wsLineSum, data.response.flowToMolde.ysLineSum, "流向经过管段","wyFechat");
    //方与圆
    frEchatInit(data.response.flowToMolde.fLineSum, data.response.flowToMolde.rLineSum, "流向经过管段", "frFechat");

    //溯源分析
    var parentIDsStr="";
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
        parentIDsStr += "pipe_line_" + item.lno + "_" + item.line_Class + "$" + item.id + ",";
        sHtml += "<tr " + classSrt + " onclick='flytoByLineHole(" + item.id +",1)'><td>" + item.lno + "</td><td>" + item.pSize + "</td><td>" + eStr + "</td></tr>";
    });
    if (sHtml === "")
        sHtml = "<tr><td colspan='3'>没有溯源管数据</td></tr>";
    $("#syBody").html(sHtml);
    //雨污
    ywEchatInit(data.response.traceabilityMolde.wsLineSum, data.response.traceabilityMolde.ysLineSum, "来源经过管段", "wyTechat");
    //方与圆
    frEchatInit(data.response.traceabilityMolde.fLineSum, data.response.traceabilityMolde.rLineSum, "来源经过管段", "frTechat");

    if (parentIDsStr != "" && parentIDsStr != null) 
        parentIDsStr = parentIDsStr.substring(0, parentIDsStr.lastIndexOf(','));
    if (subclassIDsStr != "" && subclassIDsStr != null) {
        subclassIDsStr = subclassIDsStr.substring(0, subclassIDsStr.lastIndexOf(','));
    }

    $("#syLineckbox").val(parentIDsStr);
    $("#ftLineckbox").val(subclassIDsStr);

    //基本信息绑定
    var context = "";
    //context += "<tr><td>项目名称：</td><td>" + data.response.model.prj_Name + "</td></tr>";
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
    $("#InfoTab2").html(context);

    //cctv数据
    if (data.response.cctvID != 0) {
        var load  = layer.msg('正在获取CCTV资料...', {
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
                return false;
            }
        })
    } else {
        $.each(holdListData.response.lineDateMoldes, function (i, item) {
            if (item.e_holeID == lineID || item.s_holeID == lineID) {
                var alti_String = (viewer.camera.positionCartographic.height);
                flyTo(item.cCoorWgsX, item.cCoorWgsY, alti_String);
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
                        console.log("管线ID异常" + LineID);
                    }

                    addcolorForBD(LineID, '#ff50ff')//并列百度变颜色
                } else {
                    try {
                        var attributes = linePrimitive.getGeometryInstanceAttributes(ftIDS[i]);
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
                    } catch (e) {
                        console.log("管线ID异常" + LineID);
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
                        console.log("管线ID异常" + LineID);
                    }

                    addcolorForBD(LineID, '#ff50ff')//并列百度变颜色
                } else {
                    try {
                        var attributes = linePrimitive.getGeometryInstanceAttributes(syIDS[i]);
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
                    } catch (e) {
                        console.log("管线ID异常" + LineID);
                    }

                    addcolorForBD(LineID, '#881212')//并列百度变颜色
                }
            }
        }
    } catch (e) {

    }
}
//显示流向管段
$("#ftLineckbox").change(function () {
    var ftIDS = $("#ftLineckbox").val().split(',');
    var linetype = $("#ftLineckbox").attr('data-line');
    if (this.checked) {
        for (var i = 0; i < ftIDS.length; i++) {
            if (ftIDS[i] != "") {
                try {
                    var attributes = linePrimitive.getGeometryInstanceAttributes(ftIDS[i]);
                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GREENYELLOW);
                } catch (e) {
                    console.log("流向管线ID异常"+ftIDS[i]);
                }
                var LineID = ftIDS[i].split('$')[1];
                addcolorForBD(LineID,'#c5e82b')//并列百度变颜色
            }
        }
    } else {
        for (var i = 0; i < ftIDS.length; i++) {
            if (ftIDS[i] != "") {
                var LineID = ftIDS[i].split('$')[1];
                if (linetype === "WS") {
                    try {
                        var attributes = linePrimitive.getGeometryInstanceAttributes(ftIDS[i]);
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
                    } catch (e) {
                        console.log("流向管线ID异常" + LineID);
                    }
                    addcolorForBD(LineID, '#ff50ff')//并列百度变颜色
                } else {
                    try {
                        var attributes = linePrimitive.getGeometryInstanceAttributes(ftIDS[i]);
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
                    } catch (e) {
                        console.log("流向管线ID异常" + LineID);
                    }

                    addcolorForBD(LineID, '#881212')//并列百度变颜色
                }
            }
        }
    }

});

//显示溯源管段
$("#syLineckbox").change(function () {
    var syIDS = $("#syLineckbox").val().split(',');
    var linetype = $("#syLineckbox").attr('data-line');
    if (this.checked) {
        for (var i = 0; i < syIDS.length; i++) {
            if (syIDS[i] != "")
            {
                try {
                    var attributes = linePrimitive.getGeometryInstanceAttributes(syIDS[i]);
                    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKORANGE);
                } catch (e) {
                    console.log("溯源管线ID异常" + LineID);
                }
                var LineID = syIDS[i].split('$')[1];
                addcolorForBD(LineID, '#e7aa00')//并列百度变颜色
            }
        }
    } else {
        for (var i = 0; i < syIDS.length; i++) {
            if (syIDS[i] != "") {
                var LineID = syIDS[i].split('$')[1];
                if (linetype === "WS") {
                    try {
                        var attributes = linePrimitive.getGeometryInstanceAttributes(syIDS[i]);
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK);
                    } catch (e) {
                        console.log("溯源管线ID异常" + LineID);
                    }

                    addcolorForBD(LineID, '#ff50ff')//并列百度变颜色
                } else {
                    try {

                        var attributes = linePrimitive.getGeometryInstanceAttributes(syIDS[i]);
                        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED);
                    } catch (e) {
                        console.log("溯源管线ID异常" + LineID);
                    }
                    addcolorForBD(LineID, '#881212')//并列百度变颜色
                }
            }
        }
    }

});

//雨水、污水
function ywEchatInit(wsLineSum, ysLineSum, name,Eleid) {
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
                '<td align="center"><a>' + aStr + '</a></td>' +
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
            '<td align="center"><a>▶</a></td>' +
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
        m_Str = '<div class="tishi">管段结构性缺陷等级为' + getkeyvlaue(pipe.yEvaluate)[0] + ',' + getkeyvlaue(pipe.yMEvaluate)[1] + ',' + getkeyvlaue(pipe.yEvaluate)[1] + '。</div>';


    var sm_Str = '<div class="tishi">管段修复等级为' + getkeyvlaue(pipe.rIEvaluate)[0] + ',' + getkeyvlaue(pipe.rIEvaluate)[1] + '；养护等级为' + getkeyvlaue(pipe.mIEvaluate)[0] + ',' + getkeyvlaue(pipe.mIEvaluate)[1] + '。</div>';

    var html = '<table id="tab1" class="cesium-infoBox-defaultTable">' +
        '<tbody><tr>' +
        '<td  align="right">录像文件</td>' +
        '<td  align="center" id="videoid">' + pipe.video + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td align="right">检测方向</td>' +
        '<td align="center" id="direction">' + pipe.direction + '</td>' +
        '<td align="right">检测日期</td>' +
        '<td align="center" id="date">' + pipe.date + '</td>' +
        '</tr>' +
        '</tbody></table>' +
        '<table id="tab2">' +
        '<tbody><tr height="30px">' +
        '<td style="text-indent:10px;">视频</td>' +
        '<td style="text-indent:10px;">图片</td>' +
        '</tr>' +
        '<tr align="center">' +
        '<td><video onclick="video(this)" ondblclick="dbvideo(this)" id="video" poster="/img/poster.png" controls="controls" style="width: 186px;"></video></td>' +
        '<td><img id="image" src="' + imgs1Src + '" title="图片浏览" onclick="imgset(this)"  style="width: 240px;"></td>' +
        '</tr>' +
        '</tbody></table><div class="clear"></div>' +
        '<div id="itemMemu">' +
        '<div>记录数据</div>' +
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
        '<div class="layui-card-header">管段分析</div>' +
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
        content: '<div id="tong" class="hide" ><img style="width:350px;" src="' + imgsrc + '"></div>'
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