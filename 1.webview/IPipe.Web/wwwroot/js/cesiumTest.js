$(function () {
    //初始化cesium
    init();
});

function init() {
    //Cesium token
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMzg4YWMyOS1mNDk4LTQyMzItOGU3NC0zMGRiZjRiODBjZTQiLCJpZCI6Mjg2MTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTEyNjM0NzN9.JYLFdGUWYl4HcjPbdH74RHHb1qJbe193tmL_Ccv-tLo';
    viewer = new Cesium.Viewer("cesiumContainer", {
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
    var scene = viewer.scene;
    var primitives = scene.primitives;
    var solidWhite = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE);
    // Combine instances for a rectangle, polygon, ellipse, and circle into a single primitive.
    var rectangle = Cesium.Rectangle.fromDegrees(-92.0, 20.0, -86.0, 27.0);


    function starPositions(arms, rOuter, rInner) {
        var angle = Math.PI / arms;
        var pos = [];
        for (var i = 0; i < 2 * arms; i++) {
            var r = (i % 2) === 0 ? rOuter : rInner;
            var p = new Cesium.Cartesian2(Math.cos(i * angle) * r, Math.sin(i * angle) * r);
            pos.push(p);
        }
        return pos;
    }

    var polylineVolume = new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineVolumeGeometry({
            polylinePositions: Cesium.Cartesian3.fromDegreesArray([-102.0, 15.0, -105.0, 20.0, -110.0, 20.0]),
            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
            shapePositions: starPositions(7, 30000, 20000)
        }),
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({
                alpha: 1.0
            }))
        }
    });

    function computeCircle(radius) {
        var positions = [];
        for (var i = 0; i < 360; i++) {
            var radians = Cesium.Math.toRadians(i);
            positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
        }
        return positions;
    }
    var tubeGeometry = new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineVolumeGeometry({
            polylinePositions: Cesium.Cartesian3.fromDegreesArray([-104.0, 13.0, -107.0, 18.0, -112.0, 18.0]),
            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
            shapePositions: computeCircle(40000.0)
        })
    });
    primitives.add(new Cesium.Primitive({
        geometryInstances: [tubeGeometry, polylineVolume],
        appearance: new Cesium.MaterialAppearance({
            material: Cesium.Material.fromType('RimLighting', {

            })
        }),
        asynchronous: false
    }));
}
