var jsentities;
var buildingNumber;
var buildIndex=0;
$(function () {
    //getbuildList();

    getLineHoles();
})

function getLineHoles() {
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });
    $.post("/home/getLineHolesDate", {}, function (data, status) {
        layer.close(loadindex);
        if (!data.response) {
            os('error', data.msg, '');
        } else {

            console.log(data.response.lineDateMoldes);
            console.log(data.response.holeDateMoldes);

            os('success', data.msg, '');
        }
    }).error(function () {
        layer.close(loadindex);
        os('error', '请求出错了，请刷新页面后重试！', '');
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
