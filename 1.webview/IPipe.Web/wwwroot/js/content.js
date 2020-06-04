$(function () {

    var promise = Cesium.GeoJsonDataSource.load('/js/cesiumhelp/json/szbuilding.json');
    promise.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        var jsentities = dataSource.entities.values;
        var j = 1;
        for (var i = 0; i < 10; i++) {
            var entity = jsentities[i];
            entity.polygon.material = Cesium.Color.WHITE;
            entity.polygon.outline = false;
            //建筑物高度
            entity.polygon.extrudedHeight = entity.properties.floor * 3;
        }

    });

})


