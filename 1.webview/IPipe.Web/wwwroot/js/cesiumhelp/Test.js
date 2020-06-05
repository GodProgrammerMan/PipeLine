//Cesium token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTJlMDMzZi1kYjY4LTQ3M2ItYWJjMC0xMDczYjE1ODE1ZjYiLCJpZCI6Mjg2MTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTEyNjM4MTl9.oV3PVWMVf8AnQImbPeH0OeinxXT8K83iyl8ZVJwISyM';

var viewer = new Cesium.Viewer("cesiumContainer", {
    animation: false, //是否显示动画控件
    baseLayerPicker: true, //是否显示图层选择控件
    geocoder: false, //是否显示地名查找控件
    timeline: false, //是否显示时间线控件
    sceneModePicker: false, //是否显示投影方式控件
    navigationHelpButton: false, //是否显示帮助信息控件
    infoBox: false, //是否显示点击要素之后显示的信息
    imageryProvider: new Cesium.MapboxImageryProvider(
        {
            mapId: "mapbox.satellite",
            accessToken:'pk.eyJ1IjoibHp4bWFwYm94IiwiYSI6ImNqejcyYjgxODBhOWQzaG1qNG16MHZxaWEifQ.kJXpweRK26c7ZZy_EyT7Ig'
        }),
    baseLayerPicker: false
});
