var scene, globe, canvas, ellipsoid, labels, linePrimitive, flowtoPrimitive, holePrimitive = [], cctvDate, IsBddiv = true, isCesium = false;
let x;//����x
let y;//����y
var cctvflat = false;
var layerFrom;
var olMap, map, viewer;//�����ͼ��jq dom����
var geoserverURLIP = "https://map.imlzx.cn:8082/geoserver/MSDI/wms";
var oLLayerArr = [];//ol- layer����
var format = 'image/png';
var areid = 2;
var jsentities;
var buildingNumber;
var buildIndex = 0;
var lablesShow = false;
var flowtoShow = false;
var lineCLICKID = "";
var holeCLICKID = null;
var yhPairList = [];
var ceHoleList = [];
var holdListData;
var Laledata = [];
let showZoom = 19;
let currZoom;
let bdPolyline = [];
let bdPolylineID = [];
let bdholeList = [];
let dbholeOverlays = [];
let bdPSizeOverlays = [];

$(function () {
    initOL();
});
//��ʼ�� -- OL
function initOL() {
    var bounds = [113.069695806788, 22.9192165060491,
        113.103322927028, 22.9697878620361];
    var mousePositionControl = new ol.control.MousePosition({
        className: 'custom-mouse-position',
        target: document.getElementById('location'),
        coordinateFormat: ol.coordinate.createStringXY(5),
        undefinedHTML: '&nbsp;'
    });

    // ����ͼ����
    let pipeAllLayer = new ol.layer.Image({//ͼ����areid
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: geoserverURLIP,
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                "LAYERS": 'MSDI:ys_pipe',
                "exceptions": 'application/vnd.ogc.se_inimage',
            }
        }),
        className: "pipelineLayer",
        visible: true,
        zIndex: 8
    });
    oLLayerArr.push(pipeAllLayer);

    var bingmap = new ol.layer.Tile({
        visible: true,
        preload: Infinity,
        source: new ol.source.BingMaps({
            key: 'AmiUqgOvVG1nQgYRp4Mcs65Is5A_tzJujqSWWSAV5aCLTgeKF4O3p4uClGCLWVv1',
            imagerySet: 'RoadOnDemand',
            culture:'zh-cn'
        })
    });
    oLLayerArr.push(bingmap);

    //���ͼ·��
    var tian_di_tu_road_layer = new ol.layer.Tile({
        //title: "���ͼ·��",
        source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=49ea1deec0ffd88ef13a3f69987e9a63"
        })
    });
    //oLLayerArr.push(tian_di_tu_road_layer);
    //���ͼע��
    var tian_di_tu_annotation = new ol.layer.Tile({
        title: "���ͼ���ֱ�ע",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=49ea1deec0ffd88ef13a3f69987e9a63'
        })
    });
    //oLLayerArr.push(tian_di_tu_annotation);
    //���ͼ����Ӱ��
    var tian_di_tu_satellite_layer = new ol.layer.Tile({
        title: "���ͼ����Ӱ��",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=49ea1deec0ffd88ef13a3f69987e9a63'
        })
    });


    //����ol��ͼ
    olMap = new ol.Map({
        controls: ol.control.defaults({
            attribution: false
        }).extend([mousePositionControl]),
        target: 'allmap',
        layers: oLLayerArr,//ͼ���� 
        view: new ol.View({
            projection: 'EPSG:4326',
            zoom: 2,
        }),
    });

    olMap.getView().setCenter([113.07880230215, 22.9505263885339]);
    olMap.getView().setZoom(11);


    olMap.getView().fit(bounds, olMap.getSize());//�߽�����
    //�Ŵ���С�Ŀؼ�
    $(".ol-zoom").css("top", "auto");
    $(".ol-zoom").css("bottom", "17.5em");
    $(".custom-mouse-position").hide();

    // ����ƶ��¼�
    olMap.on('singleclick', function (evt) {   //����Ҫ��
        console.log(evt.coordinate);   
    })
}

// Bing���ߵ�ͼ��url���캯��
function tileUrlFunction(coord, params1, params2) {
    return getVETileUrl(coord[0], coord[1], -coord[2] - 1);
}

function getVETileUrl(z, x, y) {
    for (var a = "", c = x, d = y, e = 0; e < z; e++) {
        a = ((c & 1) + 2 * (d & 1)).toString() + a;
        c >>= 1;
        d >>= 1
    }
    return 'http://dynamic.t0.tiles.ditu.live.com/comp/ch/' + a + '?it=G,VE,BX,L,LA&mkt=zh-cn,syr&n=z&og=111&ur=CN'
}
