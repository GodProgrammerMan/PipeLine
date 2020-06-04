var jsentities;
var buildingNumber;
var buildIndex=0;
$(function () {
    //getbuildList();

    getLineHoles();
    flyTo(114.1390,22.8581,700);
    //鼠标事件监听
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    //单击
    handler.setInputAction(function (movement) {
        var pick = viewer.scene.pick(movement.position);
        if (Cesium.defined(pick) && (pick.id.indexOf('pipe_')>-1)) {
            console.log("管井");
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //移动
    handler.setInputAction(function (movement) {
        //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
        let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
        if (cartesian) {
            let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            let lat_String = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4),
                log_String = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4),
                alti_String = (viewer.camera.positionCartographic.height / 1000).toFixed(2);
            $("#heght").html(alti_String);
            $("#lng").html(log_String);
            $("#lat").html(lat_String);
        }
        var pick = viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pick) && (pick.id.indexOf('pipe_') > -1)) {
            console.log("管井");
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


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
            os('error', data.msg, '',7000,'');
        } else {
            //画管网
            var flyX;
            var flyY;
            $.each(data.response.holeDateMoldes, function (i, item) {
                if (i === 1) {
                    flyX = item.coorWgsX;
                    flyY = item.coorWgsY;
                }
                if (i<5000) {
                    //画井点
                    let holeUrl = '/js/cesiumhelp/model/S.glb';
                    if (item.hType == "WS")
                        holeUrl = '/js/cesiumhelp/model/F.glb';
                    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                        Cesium.Cartesian3.fromDegrees(item.coorWgsY, item.coorWgsX, 0.0));
                    var model = scene.primitives.add(Cesium.Model.fromGltf({
                        id: "pipe_hole_" + item.holeID,
                        url: holeUrl,
                        modelMatrix: modelMatrix,
                        scale: 10,
                        primitivesType: "holeType"
                    }));
                }
 
            });
            console.log(flyX + "----" + flyY);
            flyTo(flyY, flyX , 800);

            //画管段
            let line_instances = [];
            var solidWhite = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE);
            $.each(data.response.lineDateMoldes, function (i, item) {

                //添加psize标签
                if (i<500) {
                    labels.add({
                        position: new Cesium.Cartesian3(item.cCoorWgsY, item.cCoorWgsX , 1),
                        text: item.pSize
                    });
                    //画管
                    line_instances.push(new Cesium.GeometryInstance({
                        id: "pipe_line_" + item.lineID,
                        geometry: new Cesium.PolylineVolumeGeometry({
                            polylinePositions: Cesium.Cartesian3.fromDegreesArrayHeights([item.sCoorWgsY, item.sCoorWgsX, 0, item.eCoorWgsY , item.eCoorWgsX , 0]),
                            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                            shapePositions: computeCircle(0.9)
                        }),
                        attributes: {
                            color: solidWhite
                        }
                    }));

                }

                

            }); 

            viewer.scene.primitives.add(new Cesium.Primitive({
                geometryInstances: line_instances, //合并
                //某些外观允许每个几何图形实例分别指定某个属性，例如：
                appearance: new Cesium.PerInstanceColorAppearance()
            }));

            os('success', data.msg, '',7000,'');
        }
    }).error(function () {
        layer.close(loadindex);
        os('error', '请求出错了，请刷新页面后重试！', '',7000,'');
    });
}



function getbuildList() {
    var promise = Cesium.GeoJsonDataSource.load('/js/cesiumhelp/json/szbuilding.json');
    promise.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        jsentities = dataSource.entities.values;
        buildingNumber = jsentities.length;
        for (var i = 0; i < 20; i++) {
            if (buildIndex > buildingNumber) {
                clearTimeout(buildSetTime);
                break;
            }
            var entity = jsentities[buildIndex];
            entity.polygon.material = Cesium.Color.WHITE;
            entity.polygon.outline = false;
            entity.polygon.extrudedHeight = entity.properties.floor * 3;
            buildIndex++;
        }
    });
}

function buing() {
    var buildSetTime = setInterval(function () {
        for (var i = 0; i < 20; i++) {
            if (buildIndex > buildingNumber) {
                clearTimeout(buildSetTime);
                break;
            }
            var entity = jsentities[buildIndex];
            entity.polygon.material = Cesium.Color.WHITE;
            entity.polygon.outline = false;
            entity.polygon.extrudedHeight = entity.properties.floor * 3;
            buildIndex++;
        }
    }, 5000);
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