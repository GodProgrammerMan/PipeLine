var scene, globe, canvas, ellipsoid, labels, yhlabels, linePrimitive, flowtoPrimitive, holePrimitive, yhPrimitive, cctvDate, IsBddiv = true,
	Isgoemdiv = true;
var x, latval = 0;
var y, lngval = 0;
var cctvflat = false,
	wdflat = false,
	lengtvalue = 0,
	mlengtvalue = 0,
	bflengtvalue = 0;
var layerFrom;
var olMap, map, viewer;
var oLpipeAllLayer, oLyhLayer, oLcctvLayer, showollayer, sylxollayer, bingmaplayerMap, ces_mapboxImager, palaceTileset, ioclayer;
var geoserverURLIP = "https://map.imlzx.cn:8082/geoserver/MSDI/wms";
var oLLayerArr = [];
var format = 'image/png';
var areacode = $.cookie('area');
var areid = 1,
	jsentities, buildingNumber, buildIndex = 0,
	showZoom = 19,
	thismap = "2d";
var lablesShow = false,
	flowtoShow = false;
var lineCLICKID = "",
	holeCLICKID = null;
var ceHoleList = [],
	holdListData, Laledata = [],
	currZoom, bdPolyline = [],
	bdPolylineID = [],
	bdholeList = [].dbholeOverlays = [],
	bdPSizeOverlays = [];
let pipetypeStr = "'WS'|'YS'|'null'";
var activeShapePoints = [];
var activeShape, shape, shopePoint = [];
var floatingPoint, floatingPointArr = [],
	drawingMode = 'polygon';
var projection = new ol.proj.Projection({
	code: 'EPSG:4326',
	units: 'degrees',
	axisOrientation: 'neu',
	global: false
});
$(document).mousemove(function (e) {
	x = e.pageX;
	y = e.pageY
});
$(function () {
	CookieChoohtml(initOL);
	layui.use(['form', 'element'], function () {
		var h = layui.element;
		var j = layui.form;
		layerFrom = j;
		j.on('checkbox(lineShow)', function (a) {
			layer.msg("当前状态不支持该操作")
		});
		j.on('radio(mapShow)', function (a) {
			let valueStr = $(this).val();
			if (thismap === valueStr) return false;
			thismap = valueStr;
			if (valueStr == "2d") {
				$("#map_geom").show();
				$("#map").hide();
				$("#bdmap").hide();
				$("#map_geom").css("width", "100%");
				olMap.updateSize();
			} else if (valueStr == "3d") {
				$("#map").show();
				$("#map_geom").hide();
				$("#bdmap").hide();
				$("#map").css("width", "100%")
			} else if (valueStr == "23d") {
				$("#map").css("width", "50%");
				$("#map").show();
				$("#map_geom").show();
				$("#map_geom").css("width", "50%");
				$("#bdmap").hide();
				olMap.updateSize();
			} else if (valueStr == "bd") {
				$("#map").hide();
				$("#map_geom").hide();
				$("#bdmap").show();
				$("#bdmap").css("width", "100%")
			}
		});
		j.on('checkbox(exShow)', function (a) {
			layer.msg("当前状态不支持该操作")
		});
		j.on('checkbox(exShow)', function (a) {
			layer.msg("当前状态不支持该操作")
		});
		j.on('checkbox(ftLineckbox)', function (a) {
			let obj = this;
			var b = $("#ftLineckbox").val().split(',');
			var c = $("#ftLineckbox").attr('data-line');
			var d = $("#ftLineckbox").attr('data-ids');
			if (a.elem.checked) {
				if ($("#syLineckbox").prop("checked")) {
					$("#syLineckbox").next().click()
				}
				olsylxlayer(d, 1);
				for (var i = 0; i < b.length; i++) {
					if (b[i] != "") {
						try {
							var f = linePrimitive.getGeometryInstanceAttributes(b[i]);
							f.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GREENYELLOW)
						} catch (e) { }
						var g = b[i].split('$')[1];
						addcolorForBD(g, '#c5e82b')
					}
				}
			} else {
				if (typeof (olMap) != 'undefined' && typeof (sylxollayer) != 'undefined') olMap.removeLayer(sylxollayer);
				for (var i = 0; i < b.length; i++) {
					if (b[i] != "") {
						var g = b[i].split('$')[1];
						if (c === "WS") {
							try {
								var f = linePrimitive.getGeometryInstanceAttributes(b[i]);
								f.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK)
							} catch (e) { }
							addcolorForBD(g, '#ff50ff')
						} else {
							try {
								var f = linePrimitive.getGeometryInstanceAttributes(b[i]);
								f.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED)
							} catch (e) { }
							addcolorForBD(g, '#881212')
						}
					}
				}
			}
		});
		j.on('checkbox(syLineckbox)', function (a) {
			let obj = this;
			var b = $("#syLineckbox").val().split(',');
			var c = $("#syLineckbox").attr('data-line');
			var d = $("#syLineckbox").attr('data-ids');
			if (a.elem.checked) {
				if ($("#ftLineckbox").prop("checked")) {
					$("#ftLineckbox").next().click()
				}
				olsylxlayer(d, 2);
				for (var i = 0; i < b.length; i++) {
					if (b[i] != "") {
						try {
							var f = linePrimitive.getGeometryInstanceAttributes(b[i]);
							f.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKORANGE)
						} catch (e) { }
						var g = b[i].split('$')[1];
						addcolorForBD(g, '#e7aa00')
					}
				}
			} else {
				if (typeof (olMap) != 'undefined' && typeof (sylxollayer) != 'undefined') olMap.removeLayer(sylxollayer);
				for (var i = 0; i < b.length; i++) {
					if (b[i] != "") {
						var g = b[i].split('$')[1];
						if (c === "WS") {
							try {
								var f = linePrimitive.getGeometryInstanceAttributes(b[i]);
								f.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK)
							} catch (e) { }
							addcolorForBD(g, '#ff50ff')
						} else {
							try {
								var f = linePrimitive.getGeometryInstanceAttributes(b[i]);
								f.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED)
							} catch (e) { }
							addcolorForBD(g, '#881212')
						}
					}
				}
			}
		});
		j.on('checkbox(layercheckShow)', function (f) {
			let obj = this;
			let idvalue = $(obj).attr("id");
			switch (idvalue) {
				case 'yslayerms':
					if (typeof (olMap) != 'undefined' && typeof (oLpipeAllLayer) != 'undefined') {
						let parameterStr = "";
						if (f.elem.checked) {
							parameterStr = "'YS'|" + pipetypeStr;
							olLayerTransformation(oLpipeAllLayer, parameterStr, 'MSDI:ys_pipe');
							$.each(holdListData.response.lineDateMoldes, function (i, a) {
								if (a.line_Class == 'YS') {
									try {
										var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_" + a.line_Class + "$" + a.lineID);
										b.show = Cesium.ShowGeometryInstanceAttribute.toValue(true);
										var c = flowtoPrimitive.getGeometryInstanceAttributes("flowto_" + a.line_Class + "_" + a.lineID);
										c.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(1.0, 1.0, 0.0, 1.0))
									} catch (e) { }
								}
							});
							for (var i = 0; i < holePrimitive.length; ++i) {
								if (holePrimitive.get(i).id.indexOf("YS") > -1) {
									holePrimitive.get(i).show = true
								}
							}
						} else {
							parameterStr = pipetypeStr.replace("'YS'|", "");
							olLayerTransformation(oLpipeAllLayer, parameterStr, 'MSDI:ys_pipe');
							$.each(holdListData.response.lineDateMoldes, function (i, a) {
								if (a.line_Class == 'YS') {
									try {
										var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_" + a.line_Class + "$" + a.lineID);
										b.show = Cesium.ShowGeometryInstanceAttribute.toValue(false);
										var c = flowtoPrimitive.getGeometryInstanceAttributes("flowto_" + a.line_Class + "_" + a.lineID);
										c.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.TRANSPARENT)
									} catch (e) { }
								}
							});
							for (var i = 0; i < holePrimitive.length; ++i) {
								if (holePrimitive.get(i).id.indexOf("YS") > -1) {
									holePrimitive.get(i).show = false
								}
							}
						}
						pipetypeStr = parameterStr
					} else {
						layer.msg("二维地图对象未初始化")
					}
					break;
				case 'wslayerms':
					if (typeof (olMap) != 'undefined' && typeof (oLpipeAllLayer) != 'undefined') {
						let parameterStr = "";
						if (f.elem.checked) {
							parameterStr = "'WS'|" + pipetypeStr;
							olLayerTransformation(oLpipeAllLayer, parameterStr, 'MSDI:ys_pipe');
							$.each(holdListData.response.lineDateMoldes, function (i, a) {
								if (a.line_Class == 'WS') {
									try {
										var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_" + a.line_Class + "$" + a.lineID);
										b.show = Cesium.ShowGeometryInstanceAttribute.toValue(true);
										var c = flowtoPrimitive.getGeometryInstanceAttributes("flowto_" + a.line_Class + "_" + a.lineID);
										c.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(1.0, 1.0, 0.0, 1.0))
									} catch (e) { }
								}
							});
							for (var i = 0; i < holePrimitive.length; ++i) {
								if (holePrimitive.get(i).id.indexOf("WS") > -1) {
									holePrimitive.get(i).show = true
								}
							}
						} else {
							parameterStr = pipetypeStr.replace("'WS'|", "");
							olLayerTransformation(oLpipeAllLayer, parameterStr, 'MSDI:ys_pipe');
							$.each(holdListData.response.lineDateMoldes, function (i, a) {
								if (a.line_Class == 'WS') {
									try {
										var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_" + a.line_Class + "$" + a.lineID);
										b.show = Cesium.ShowGeometryInstanceAttribute.toValue(false);
										var c = flowtoPrimitive.getGeometryInstanceAttributes("flowto_" + a.line_Class + "_" + a.lineID);
										c.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.TRANSPARENT)
									} catch (e) { }
								}
							});
							for (var i = 0; i < holePrimitive.length; ++i) {
								if (holePrimitive.get(i).id.indexOf("WS") > -1) {
									holePrimitive.get(i).show = false
								}
							}
						}
						pipetypeStr = parameterStr
					} else {
						layer.msg("二维地图对象未初始化");
					}
					break;
				case 'dllayerms':
					if (typeof (olMap) != 'undefined') { } else {
						layer.msg("二维地图对象未初始化")
					}
					break;
				case 'jslayerms':
					if (typeof (olMap) != 'undefined') { } else {
						layer.msg("二维地图对象未初始化")
					}
					break;
				case 'rqlayerms':
					if (typeof (olMap) != 'undefined') { } else {
						layer.msg("二维地图对象未初始化")
					}
					break;
				case 'yhlayergn':
					if (typeof (olMap) != 'undefined' && typeof (oLyhLayer) != 'undefined') {
						if (f.elem.checked) {
							oLyhLayer.setVisible(true);
							yhPrimitive.show = true;
							for (var i = 0; i < yhlabels.length; i++) {
								yhlabels.get(i).show = true
							}
						} else {
							oLyhLayer.setVisible(false);
							yhPrimitive.show = false;
							for (var i = 0; i < yhlabels.length; i++) {
								yhlabels.get(i).show = false
							}
						}
					} else {
						layer.msg("二维地图对象未初始化")
					}
					break;
				case 'cctvlayergn':
					if (typeof (olMap) != 'undefined' && typeof (oLcctvLayer) != 'undefined') {
						cctvflat = f.elem.checked;
						if (cctvflat) {
							if (typeof (sylxollayer) != 'undefined') olMap.removeLayer(sylxollayer);
							oLcctvLayer.setVisible(true);
							var g = layer.load(1, {
								shade: [0.1, '#000']
							});
							$.get('/home/getCCTVGrade', null, function (c, d) {
								layer.close(g);
								cctvDate = c;
								$.each(c, function (i, a) {
									try {
										if (a.grade === 1) {
											if (true) {
												var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_WS$" + a.lineID);
												b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GREEN)
											}
											addcolorForBD(a.lineID, "#008000")
										} else if (a.grade === 2) {
											if (true) {
												var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_WS$" + a.lineID);
												b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.YELLOW)
											}
											addcolorForBD(a.lineID, "#FFFF00")
										} else if (a.grade === 3) {
											if (true) {
												var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_WS$" + a.lineID);
												b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.VIOLET)
											}
											addcolorForBD(a.lineID, "#EE82EE")
										} else if (a.grade === 4) {
											if (true) {
												var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_WS$" + a.lineID);
												b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED)
											}
											addcolorForBD(a.lineID, "#FF0000")
										}
									} catch (e) {
										try {
											if (a.grade === 1) {
												if (true) {
													var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_YS$" + a.lineID);
													b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.GREEN)
												}
												addcolorForBD(a.lineID, "#008000")
											} else if (a.grade === 2) {
												if (true) {
													var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_YS$" + a.lineID);
													b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.YELLOW)
												}
												addcolorForBD(a.lineID, "#FFFF00")
											} else if (a.grade === 3) {
												if (true) {
													var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_YS$" + a.lineID);
													b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.VIOLET)
												}
												addcolorForBD(a.lineID, "#EE82EE")
											} else if (a.grade === 4) {
												if (true) {
													var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_YS$" + a.lineID);
													b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED)
												}
												addcolorForBD(a.lineID, "#FF0000")
											}
										} catch (e) { }
									}
								})
							})
						} else {
							oLcctvLayer.setVisible(false);
							cctvRecolor()
						}
					} else {
						layer.msg("二维地图对象未初始化")
					}
					break;
				case 'gjlayergn':
					if (f.elem.checked) {
						for (var i = 0; i < labels.length; i++) {
							labels.get(i).show = true
						}
						lablesShow = true
					} else {
						for (var i = 0; i < labels.length; i++) {
							labels.get(i).show = false
						}
						lablesShow = false
					}
					break;
				case 'lxlayergn':
					if (f.elem.checked) {
						flowtoPrimitive.show = true;
						flowtoShow = true
					} else {
						flowtoPrimitive.show = false;
						flowtoShow = false
					}
					break;
				case 'wxlayerbj':
					if (f.elem.checked) bingmaplayerMap.setVisible(true);
					else bingmaplayerMap.setVisible(false);
					break;
				case 'dtlayerbj':
					if (f.elem.checked) bingmaplayerMap.setVisible(true);
					else bingmaplayerMap.setVisible(false);
					break;
				case 'bzlayerbj':
					if (f.elem.checked) bingmaplayerMap.setVisible(true);
					else bingmaplayerMap.setVisible(false);
					break;
				case 'wxlayer3d':
					if (f.elem.checked) viewer.imageryLayers.addImageryProvider(ces_mapboxImager);
					else viewer.imageryLayers.removeAll();
					break;
				case 'dtlayer3d':
					if (f.elem.checked) viewer.imageryLayers.addImageryProvider(ces_mapboxImager);
					else viewer.imageryLayers.removeAll();
					break;
				case 'bzlayer3d':
					if (f.elem.checked) viewer.imageryLayers.addImageryProvider(ces_mapboxImager);
					else viewer.imageryLayers.removeAll();
					break;
				case 'bmlayer3d':
					if (f.elem.checked) palaceTileset.show = true;
					else palaceTileset.show = false;
					break;
				case 'dxslayer3d':
					break;
				case 'dqlayer3d':
					if (f.elem.checked) globe.show = true;
					else globe.show = false;
					break;
				default:
					layer.msg("当前状态不支持该操作")
			}
		});
		j.on('checkbox(buildShow)', function (a) {
			layer.msg("当前状态不支持该操作")
		})
	});
	otherThing()
});

function initOL(a) {
	var b = new ol.control.MousePosition({
		className: 'custom-mouse-position',
		target: document.getElementById('location'),
		coordinateFormat: ol.coordinate.createStringXY(5),
		undefinedHTML: '&nbsp;'
	});
	var c = new ol.control.Rotate({
		autoHide: false
	});
	let pipeAllLayer = new ol.layer.Image({
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
	let yhLayer = new ol.layer.Image({
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
	ioclayer = new ol.layer.Vector({
		source: new ol.source.Vector(),
		zIndex: 20
	});
	oLLayerArr.push(ioclayer);
	let cctvLayer = new ol.layer.Image({
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
	var d = new ol.layer.Tile({
		id: "bzlayerMap",
		title: "天地图文字标注",
		zIndex: 3,
		visible: false,
		source: new ol.source.XYZ({
			url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=49ea1deec0ffd88ef13a3f69987e9a63'
		})
	});
	oLLayerArr.push(d);
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
	olMap = new ol.Map({
		controls: ol.control.defaults({
			attribution: false
		}).extend([b, c]),
		target: 'map_geom',
		layers: oLLayerArr,
		view: new ol.View({
			projection: 'EPSG:4326'
		}),
	});
	if (areid == 1) {
		olMap.getView().setCenter([113.08343495207401, 22.949133135126246]);
		olMap.getView().setZoom(18.703693552114576)
	} else if (areid == 2) {
		olMap.getView().setCenter([113.94314303246384, 22.746454084801524]);
		olMap.getView().setZoom(17.404315028416946)
	} else if (areid == 0) {
		olMap.getView().setCenter([114.05971697090581, 22.539934539441248]);
		olMap.getView().setZoom(17.404315028416946)
	}
	olMouseEvents();
	$(".ol-zoom").css("top", "auto");
	$(".ol-zoom").css("bottom", "17.5em");
	$(".custom-mouse-position").hide();
	IDMSclear();
	a && a()
}
function olMouseEvents() {
	olMap.getView().on('change:resolution', function (a) {
		var b = a.target.get('resolution');
		var c = olMap.getView().getProjection().getUnits();
		var d = ol.proj.Units.METERS_PER_UNIT[c];
		let scale = b * d * 3779.5275590551 * 0.01;
		if (scale >= 1000) {
			scale = Math.round(scale / 1000) + "km"
		} else if (scale < 1000) {
			let scaleNum = Math.round(scale);
			scale = Math.round(scale) + "m";
			if (scaleNum >= 20) { } else { }
		}
		$("#scaleTxt").html(scale);
		ollcesium()
	});
	olMap.on("moveend", function (a) {
		ollcesium()
	});
	olMap.on('singleclick', function (f) {
		IDMSclear();
		let dx = parseFloat(f.coordinate[0]);
		let dy = parseFloat(f.coordinate[1]);
		let view = olMap.getView();
		let viewResolution = view.getResolution();
		let source = oLpipeAllLayer.get('visible') ? oLpipeAllLayer.getSource() : null;
		if (source != null) {
			let url = source.getFeatureInfoUrl(f.coordinate, viewResolution, view.getProjection(), {
				'INFO_FORMAT': 'application/json',
				'FEATURE_COUNT': 50,
				format_options: 'callback:getJson'
			});
			if (url) {
				let loadindex = layer.load();
				$.get(url, null, function (b, c) {
					if (b.features != null && b.features.length > 0) {
						view.setCenter([dx, dy]);
						let isAnypoint = false, Anypointi = 0, isAnyline = false, Anylinei = 0, featuresData, showlayername = 'MSDI:ys_show_pipehole';
						$.each(b.features, function (i, a) {
							if (a.geometry.type === 'Point') {
								isAnypoint = true;
								Anypointi = i
							}
							if (a.geometry.type === 'LineString') {
								isAnyline = true;
								Anylinei = i
							}
						});
						recoveryLineColor();
						recoveryHoleColor();
						if (isAnypoint) {
							showlayername = 'MSDI:ys_show_pipehole';
							featuresData = b.features[Anypointi];
							let model = featuresData.properties;
							let pick_id = "pipe_hole_" + model.exp_no + "_$" + model.mysqlid;
							removeFTcolor();
							holeCLICKID = pick_id;
							for (var i = 0; i < holePrimitive.length; i++) {
								if (holePrimitive.get(i).id == pick_id) {
									holePrimitive.get(i).color = Cesium.Color.CHOCOLATE;
									break
								}
							}
							getHoleInfoByID(featuresData.properties.mysqlid)
						} else if (!isAnypoint && isAnyline) {
							showlayername = 'MSDI:ys_show_pipeline';
							featuresData = b.features[Anylinei];
							let model = featuresData.properties;
							let pick_id = "pipe_line_" + model.lno + "_" + model.lineclass + "$" + model.mysqlid;
							if (lineCLICKID != pick_id) removeFTcolor();
							try {
								var d = linePrimitive.getGeometryInstanceAttributes(pick_id);
								d.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN);
								lineCLICKID = pick_id
							} catch (e) { }
							getLineInfoByID(model.mysqlid)
						}
						olshowlayer(featuresData.properties.mysqlid, showlayername)
					}
					layer.close(loadindex)
				})
			}
		}
	});
	olMap.on('pointermove', function (a) {
		var b = ol.proj.transform(a.coordinate, 'EPSG:3857', 'EPSG:4326')
	})
}
function ollcesium() {
	IsGoemdiv();
	if (thismap == "23d" && Isgoemdiv) {
		let rotatuin = olMap.getView().getRotation();
		if (typeof (viewer) != 'undefined') {
			if (rotatuin == 0) {
				let sn_wgs84 = olMap.getView().calculateExtent(olMap.getSize());
				viewer.camera.flyTo({
					destination: Cesium.Rectangle.fromDegrees(sn_wgs84[0] - lngval, sn_wgs84[1] - latval, sn_wgs84[2] - lngval, sn_wgs84[3] - latval)
				})
			} else {
				let ceterCoor = olMap.getView().getCenter();
				let zoomheight = getOLcesiumHeight(olMap.getView().getZoom());
				viewer.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(ceterCoor[0] - lngval, ceterCoor[1] - latval, zoomheight),
					orientation: {
						roll: -rotatuin
					}
				})
			}
		}
	}
}
function olsylxlayer(a, b) {
	if (typeof (sylxollayer) != 'undefined') olMap.removeLayer(sylxollayer);
	if (olMap.getView().getZoom() < 20.14) olMap.getView().setZoom(20.15);
	sylxollayer = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: geoserverURLIP,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				"LAYERS": 'MSDI:ys_pipe_sylx',
				"exceptions": 'application/vnd.ogc.se_inimage',
				"viewparams": "pipetypes:" + a + ";areid:" + areid + ";lxclass:" + b,
			}
		}),
		zIndex: 11,
		visible: true
	});
	olMap.addLayer(sylxollayer)
}
function olshowlayer(a, b) {
	if (typeof (showollayer) != 'undefined') olMap.removeLayer(showollayer);
	if (typeof (sylxollayer) != 'undefined') olMap.removeLayer(sylxollayer);
	if (olMap.getView().getZoom() < 20.14) olMap.getView().setZoom(20.15);
	showollayer = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: geoserverURLIP,
			params: {
				'FORMAT': format,
				'VERSION': '1.1.1',
				"LAYERS": b,
				"exceptions": 'application/vnd.ogc.se_inimage',
				"viewparams": "id:" + a + ";areid:" + areid,
			}
		}),
		zIndex: 10,
		visible: true
	});
	olMap.addLayer(showollayer)
}
function initCesium() {
	Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMzg4YWMyOS1mNDk4LTQyMzItOGU3NC0zMGRiZjRiODBjZTQiLCJpZCI6Mjg2MTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTEyNjM0NzN9.JYLFdGUWYl4HcjPbdH74RHHb1qJbe193tmL_Ccv-tLo';
	ces_mapboxImager = new Cesium.MapboxImageryProvider({
		mapId: "mapbox.satellite",
		accessToken: 'pk.eyJ1IjoibHp4bWFwYm94IiwiYSI6ImNqejcyYjgxODBhOWQzaG1qNG16MHZxaWEifQ.kJXpweRK26c7ZZy_EyT7Ig'
	});
	viewer = new Cesium.Viewer("map", {
		requestRenderMode: true,
		maximumRenderTimeChange: Infinity,
		animation: false,
		baseLayerPicker: false, 
		geocoder: false,
		timeline: false,
		sceneModePicker: false,
		navigationHelpButton: false,
		infoBox: false,
		homeButton: false,
		scene3DOnly: true,
	});
	viewer.imageryLayers.addImageryProvider(ces_mapboxImager);
	viewer._cesiumWidget._creditContainer.style.display = "none";
	viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
	scene = viewer.scene;
	globe = scene.globe;
	canvas = viewer.scene.canvas;
	ellipsoid = viewer.scene.globe.ellipsoid;
	labels = scene.primitives.add(new Cesium.LabelCollection({
		scene: scene,
		blendOption: Cesium.BlendOption.TRANSLUCENT
	}));
	yhlabels = scene.primitives.add(new Cesium.LabelCollection({
		scene: scene,
		blendOption: Cesium.BlendOption.TRANSLUCENT
	}));
	if (areacode == "gd_sz_sm") {
		getCivicCenter()
	} else {
		getbuildList()
	}
	getLineHoles(false);
	getYhData();
	getMouseEventsForCesium();
	initlocation()
}
function getMouseEventsForCesium() {
	var n = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	n.setInputAction(function (a) {
		if (wdflat) {
			var b = viewer.scene.pickPosition(a.position);
			if (Cesium.defined(b)) {
				let cartographic1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(b);
				if (activeShapePoints.length === 0) {
					floatingPoint = createPoint(b);
					activeShapePoints.push(b);
					var c = new Cesium.CallbackProperty(function () {
						if (drawingMode === 'polygon') {
							return new Cesium.PolygonHierarchy(activeShapePoints)
						}
						return activeShapePoints
					}, false);
					activeShape = drawShape(c, 'polygon')
				}
				shopePoint.push({
					lng: Cesium.Math.toDegrees(cartographic1.longitude),
					lat: Cesium.Math.toDegrees(cartographic1.latitude)
				});
				activeShapePoints.push(b);
				createPoint(b)
			}
		} else {
			var d = viewer.scene.pickPosition(a.position);
			if (d) {
				let cartographic1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(d);
				let lat_String = Cesium.Math.toDegrees(cartographic1.latitude).toFixed(10), log_String = Cesium.Math.toDegrees(cartographic1.longitude).toFixed(10), alti_String = (viewer.camera.positionCartographic.height).toFixed(10)
			}
			var f = viewer.scene.pick(a.position);
			try {
				if ($('body').hasClass("cousline")) {
					if (Cesium.defined(f) && (f.id != undefined && f.id != "undefined") && (f.id.indexOf('pipe_') > -1)) {
						var g = viewer.scene.pickPosition(a.position);
						let x = 0;
						let y = 0;
						let h = 0;
						if (g) {
							let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(g);
							y = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10);
							x = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10);
							h = (viewer.camera.positionCartographic.height / 1000).toFixed(10)
						}
						var i = f.id.split('$')[1];
						var j = f.id.split('_')[2];
						if (f.id.indexOf('pipe_hole_') > -1) {
							showBox('管点' + j + '隐患上报', '/HiddenDanger/index?action=add&ty=1&x=' + x + '&y=' + y + '&name=管点' + j + '隐患&objID=' + i, ['1100px', '700px'])
						} else {
							showBox('管段' + j + '隐患上报', '/HiddenDanger/index?action=add&ty=2&x=' + x + '&y=' + y + '&name=管段' + j + '隐患&objID=' + i, ['1100px', '700px'])
						}
					} else {
						os('info', "请选择存在隐患的管段或者井,双击则取消！", '')
					}
				}
				if (Cesium.defined(f) && (f.id != undefined && f.id != "undefined") && (f.id.indexOf('pipe_') > -1)) {
					if (f.id.indexOf('pipe_hole_') > -1) {
						recoveryLineColor();
						recoveryHoleColor();
						$("#property").hide();
						if (lineCLICKID != f.id) removeFTcolor();
						holeCLICKID = f.id;
						f.primitive.color = Cesium.Color.CHOCOLATE;
						var k = f.id.split('$')[1];
						getHoleInfoByID(k);
						olshowlayer(k, 'MSDI:ys_show_pipehole')
					}
					if (f.id.indexOf('pipe_line_') > -1) {
						recoveryLineColor();
						recoveryHoleColor();
						$("#property").hide();
						if (lineCLICKID != f.id) removeFTcolor();
						lineCLICKID = f.id;
						var l = linePrimitive.getGeometryInstanceAttributes(f.id);
						l.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN);
						var m = lineCLICKID.split('$')[1];
						addcolorForBD(m, "#01e5e6");
						olshowlayer(m, 'MSDI:ys_show_pipeline');
						getLineInfoByID(m)
					}
				}
			} catch (e) { }
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	n.setInputAction(function (a) {
		if (wdflat) {
			if (Cesium.defined(floatingPoint)) {
				var b = viewer.scene.pickPosition(a.endPosition);
				if (Cesium.defined(b)) {
					floatingPoint.position.setValue(b);
					activeShapePoints.pop();
					activeShapePoints.push(b)
				}
			}
		} else {
			let cartesian = viewer.camera.pickEllipsoid(a.endPosition, ellipsoid);
			if (cartesian) {
				let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
				let lat_String = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10), log_String = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10), alti_String = (viewer.camera.positionCartographic.height).toFixed(10);
				$("#heght").html(alti_String);
				$("#lng").html(log_String);
				$("#lat").html(lat_String)
			}
			var c = viewer.scene.pick(a.endPosition);
			try {
				if (Cesium.defined(c) && (c.id != undefined && c.id != "undefined") && (c.id.indexOf('pipe_') > -1)) { }
			} catch (e) { }
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	n.setInputAction(function (a) {
		if (wdflat) {
			terminateShape("polygon");
			$("#map").css("cursor", "auto");
			wdflat = false;
			if (shopePoint.length >= 3) {
				let clippArr = [];
				let transformParea = getInverseTransform();
				if (!isClockWise(shopePoint)) {
					shopePoint = shopePoint.reverse()
				}
				try {
					for (var i = 0; i < shopePoint.length; i++) {
						if (i == shopePoint.length - 1) {
							clippArr.push(createPlane(shopePoint[i], shopePoint[0], transformParea));
							break
						}
						clippArr.push(createPlane(shopePoint[i], shopePoint[i + 1], transformParea))
					}
					palaceTileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
						planes: clippArr,
						edgeColor: Cesium.Color.RED,
						edgeWidth: 1.0,
						unionClippingRegions: false,
					});
					for (var i = 0; i < floatingPointArr.length; i++) {
						viewer.entities.remove(floatingPointArr[i])
					}
					shopePoint = [];
					viewer.entities.remove(shape);
					viewer.entities.remove(floatingPoint)
				} catch (e) {
					layer.msg("计算模型出现误差，请稍后刷新页面再试哦！");
					shopePoint = [];
					viewer.entities.remove(shape);
					viewer.entities.remove(floatingPoint);
					for (var i = 0; i < floatingPointArr.length; i++) {
						viewer.entities.remove(floatingPointArr[i])
					}
				}
			} else {
				layer.msg("至少选择三个点！")
			}
		}
	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	viewer.scene.camera.moveEnd.addEventListener(function () {
		try {
			var a = getCenterPosition();
			let height = a.height;
			IsGoemdiv();
			if (!Isgoemdiv && thismap == "23d") {
				olMap.getView().setCenter([a.lon + lngval, a.lat + latval]);
				olMap.getView().setZoom(getolMapZoom(height));
				let roll = this.viewer.scene.camera.heading;
				olMap.getView().setRotation(-roll)
			}
		} catch (e) { }
	});
}
function initMap() {
	map = new BMapGL.Map("bdmap");
	map.enableScrollWheelZoom(true);
	if (areacode == "gd_sz_gm") map.centerAndZoom(new BMapGL.Point(113.93043624568712, 22.78495878251252), 21);
	else if (areacode == "gd_fs") map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21);
	var c = new BMapGL.ScaleControl();
	map.addControl(c);
	var d = new BMapGL.NavigationControl3D();
	map.addControl(d);
	map.addEventListener("zoomend", function (e) {
		Cesiumlinkage();
		var a = map.getZoom();
		if (a >= showZoom) {
			for (var i = 0; i < dbholeOverlays.length; i++) {
				dbholeOverlays[i].show()
			}
		} else {
			for (var i = 0; i < dbholeOverlays.length; i++) {
				dbholeOverlays[i].hide()
			}
			for (var i = 0; i < bdPSizeOverlays.length; i++) {
				bdPSizeOverlays[i].hide()
			}
		}
		currZoom = a
	});
	map.addEventListener("dragend", function (e) {
		Cesiumlinkage()
	});
	map.addEventListener("mousemove", function (e) {
		if (!$("#qhckbox").is(":checked") && !$("#plckbox").is(":checked")) {
			var a = bd09togcj02(e.latlng.lng, e.latlng.lat);
			var b = gcj02towgs84(a[0], a[1]);
			$("#heght").html("层级" + map.getZoom());
			$("#lng").html(b[0]);
			$("#lat").html(b[1])
		}
	});
	addLineOverlays()
}
function Cesiumlinkage() {
	var a = map.getBounds();
	var b = a.getSouthWest();
	var c = a.getNorthEast();
	var d = bd09towgs84(b.lng, b.lat);
	var e = bd09towgs84(c.lng, c.lat);
	IsDBdiv();
	if (IsBddiv && $("#plckbox").is(":checked")) {
		viewer.camera.flyTo({
			destination: Cesium.Rectangle.fromDegrees(d[0], d[1], e[0], e[1])
		})
	}
}
function addLineOverlays() {
	var q = layer.load(1, {
		shade: [0.1, '#000']
	});
	$.post("/home/getLineHolesDateForBd", {}, function (o, p) {
		layer.close(q);
		if (!o.response) {
			layerMsg('msg', o.msg)
		} else {
			$.each(o.response.lineDateMoldes, function (i, b) {
				var c = false;
				if (areacode == "gd_sz_gm") {
					c = i < 200
				} else {
					c = i < 2000
				}
				if (c) {
					var d = new BMapGL.Icon("/img/1-2.png", new BMapGL.Size(40, 40));
					var f = new BMapGL.Icon("/img/1-2.png", new BMapGL.Size(40, 40));
					var g = "#ff50ff";
					if (b.line_Class === "YS") {
						d = new BMapGL.Icon("/img/2-1.png", new BMapGL.Size(40, 40));
						f = new BMapGL.Icon("/img/2-1.png", new BMapGL.Size(40, 40));
						g = "#881212";
						if (b.e_Feature == "出水口" && (b.e_subsid == null || b.e_subsid == "")) f = new BMapGL.Icon("/img/mapico/YS出水口.png", new BMapGL.Size(40, 40))
					} else {
						if (b.e_Feature == "出水口" && (b.e_subsid == null || b.e_subsid == "")) f = new BMapGL.Icon("/img/mapico/WS出水口.png", new BMapGL.Size(40, 40))
					}
					var h = new BMapGL.Polyline([new BMapGL.Point(b.sCoorWgsX, b.sCoorWgsY), new BMapGL.Point(b.eCoorWgsX, b.eCoorWgsY)], {
						strokeColor: g,
						strokeWeight: 2,
						strokeOpacity: 0.5,
						enableClicking: true,
						lineID: b.lineID,
						line_Class: b.line_Class,
						lno: b.lno
					});
					var j = new BMapGL.Polyline([new BMapGL.Point(b.sCoorWgsX, b.sCoorWgsY), new BMapGL.Point(b.cCoorWgsX, b.cCoorWgsY)], {
						strokeColor: g,
						strokeWeight: 0,
						strokeOpacity: 0
					});
					h.addEventListener('click', function (e) {
						let config = e.currentTarget._config;
						recoveryLineColor();
						recoveryHoleColor();
						let packid = "pipe_line_" + config.lno + "_" + config.line_Class + "$" + config.lineID;
						$("#property").hide();
						if (lineCLICKID != packid) removeFTcolor();
						lineCLICKID = packid;
						addcolorForBD(config.lineID, "#01e5e6");
						try {
							var a = linePrimitive.getGeometryInstanceAttributes(packid);
							a.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN)
						} catch (e) { }
						getLineInfoByID(e.currentTarget._config.lineID);
						map.centerAndZoom(new BMapGL.Point(e.latLng.lng, e.latLng.lat), 21)
					});
					map.addOverlay(h);
					bdPolylineID.push(b.lineID);
					bdPolyline.push(h);
					addArrow(j, 10, Math.PI / 7, g);
					if (!in_array(b.s_Point, bdholeList)) {
						if (b.s_subsid === "雨水篦") d = new BMapGL.Icon("/img/3-1.png", new BMapGL.Size(40, 40));
						else if (b.s_subsid === "污水篦") f = new BMapGL.Icon("/img/mapico/3-2.png", new BMapGL.Size(40, 40));
						else if (b.s_subsid == "化粪池") {
							f = new BMapGL.Icon("/img/mapico/污水化粪池.png", new BMapGL.Size(40, 40))
						} else if (b.s_subsid == "沉淀池") {
							f = new BMapGL.Icon("/img/mapico/WS沉淀池.png", new BMapGL.Size(40, 40))
						}
						var k = new BMapGL.Marker(new BMapGL.Point(b.sCoorWgsX, b.sCoorWgsY), {
							icon: d
						});
						k.setZIndex(10);
						k.addEventListener('click', function (e) {
							layer.msg("管井正在开发中")
						});
						map.addOverlay(k);
						bdholeList.push(b.s_Point);
						dbholeOverlays.push(k)
					}
					if (!in_array(b.e_Point, bdholeList)) {
						if (b.e_subsid === "雨水篦") f = new BMapGL.Icon("/img/3-1.png", new BMapGL.Size(40, 40));
						else if (b.s_subsid === "污水篦") f = new BMapGL.Icon("/img/mapico/3-2.png", new BMapGL.Size(40, 40));
						var l = new BMapGL.Marker(new BMapGL.Point(b.eCoorWgsX, b.eCoorWgsY), {
							icon: f
						});
						l.setZIndex(10);
						l.addEventListener('click', function (e) {
							layer.msg("管井正在开发中")
						});
						map.addOverlay(l);
						bdholeList.push(b.e_Point);
						dbholeOverlays.push(l)
					}
					var m = {
						position: new BMapGL.Point(b.cCoorWgsX, b.cCoorWgsY),
						offset: new BMapGL.Size(0, 0)
					};
					var n = new BMapGL.Label(b.pSize, m);
					n.setStyle({
						color: 'red',
						fontSize: '12px',
						height: '20px',
						lineHeight: '20px',
						fontFamily: '微软雅黑',
						background: 'transparent',
						border: '0px'
					});
					map.addOverlay(n);
					n.hide();
					bdPSizeOverlays.push(n)
				}
			});
			layerMsg('msg', o.msg)
		}
	}).error(function () {
		layer.close(q);
		layerTS('请求数据出错，请稍后再试！')
	})
}
function bdLineInfoClick(a, b, c) {
	recoveryLineColor();
	recoveryHoleColor();
	$("#property").hide();
	var d = "pipe_line_" + b + "_" + c + "$" + a;
	if (lineCLICKID != d) removeFTcolor();
	lineCLICKID = d;
	if ($("#plckbox").is(":checked") || $("#qhckbox").is(":checked")) {
		var e = linePrimitive.getGeometryInstanceAttributes(d);
		e.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.CYAN)
	}
	getLineInfoByID(a)
}
function addcolorForBD(a, b) {
	if ($("#plckbox").is(":checked") || !$("#qhckbox").is(":checked")) {
		for (var i = 0; i < bdPolylineID.length; i++) {
			if (bdPolylineID[i] == a) {
				bdPolyline[i].setStrokeColor(b);
				break
			}
		}
	}
}
function layerTS(a, b) {
	b = (b === undefined || b === "" || b === null ? '我知道了' : b);
	layer.open({
		content: a,
		btn: b
	})
}
function layerMsg(a, b) {
	layer.open({
		content: b,
		skin: a,
		time: 2
	})
}
function addArrow(a, b, c, d) {
	var e = a.getPath();
	var f = e.length;
	for (var i = 1; i < f; i++) {
		var g = map.pointToPixel(e[i - 1]);
		var h = map.pointToPixel(e[i]);
		var j = c;
		var r = b;
		var k = 0;
		var l = 0;
		var m, pixelTemY;
		var n, pixelY, pixelX1, pixelY1;
		if (h.x - g.x == 0) {
			m = h.x;
			if (h.y > g.y) {
				pixelTemY = h.y - r
			} else {
				pixelTemY = h.y + r
			}
			n = m - r * Math.tan(j);
			pixelX1 = m + r * Math.tan(j);
			pixelY = pixelY1 = pixelTemY
		} else {
			k = (h.y - g.y) / (h.x - g.x);
			l = Math.sqrt(k * k + 1);
			if ((h.x - g.x) < 0) {
				m = h.x + r / l;
				pixelTemY = h.y + k * r / l
			} else {
				m = h.x - r / l;
				pixelTemY = h.y - k * r / l
			}
			n = m + Math.tan(j) * r * k / l;
			pixelY = pixelTemY - Math.tan(j) * r / l;
			pixelX1 = m - Math.tan(j) * r * k / l;
			pixelY1 = pixelTemY + Math.tan(j) * r / l
		}
		var o = map.pixelToPoint(new BMapGL.Pixel(n, pixelY));
		var p = map.pixelToPoint(new BMapGL.Pixel(pixelX1, pixelY1));
		var q = new BMapGL.Polyline([o, e[i], p], {
			strokeColor: d,
			strokeWeight: 2,
			strokeOpacity: 0.5
		});
		map.addOverlay(q);
		return q
	}
}
function citySwitching(a) {
	$.cookie('area', null);
	$.cookie('area', a);
	os('info', "转换成功，正在跳转获取数据！", '');
	window.setTimeout("window.location=''", 2000)
}
function cctvRecolor() {
	$.each(cctvDate, function (i, a) {
		try {
			if (true) {
				var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_WS$" + a.lineID);
				b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK)
			}
			addcolorForBD(a.lineID, "#ff50ff")
		} catch (e) {
			try {
				if (true) {
					var b = linePrimitive.getGeometryInstanceAttributes("pipe_line_" + a.lno + "_YS$" + a.lineID);
					b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED)
				}
				addcolorForBD(a.lineID, "#881212")
			} catch (e) { }
		}
	})
}
function reAddDange() {
	$('body').addClass("cousline")
}
function cctvBSclike() {
	if (cctvflat) {
		cctvRecolor();
		$("input[name='CCTVShow']").prop("checked", false);
		layerFrom.render()
	}
}
function otherThing() {
	$("#qhckbox").change(function () {
		cctvBSclike();
		if (!$("#plckbox").is(":checked")) {
			if (this.checked) {
				$("#bdmap").css('display', 'none');
				$("#map").css('display', 'block');
				$("#map").css('width', '100%')
			} else {
				$("#bdmap").css('display', 'block');
				$("#map").css('display', 'none');
				$("#bdmap").css('width', '100%')
			}
		} else {
			os('info', "开启并列模式，无法转换！", '')
		}
	});
	$("#plckbox").change(function () {
		cctvBSclike();
		if (this.checked) {
			$("#bdmap").css('display', 'block');
			$("#map").css('display', 'block');
			$("#bdmap").css('width', '50%');
			$("#map").css('width', '50%')
		} else {
			if ($("#qhckbox").is(":checked")) {
				$("#bdmap").css('display', 'none');
				$("#map").css('display', 'block');
				$("#map").css('width', '100%')
			} else {
				$("#bdmap").css('display', 'block');
				$("#map").css('display', 'none');
				$("#bdmap").css('width', '100%')
			}
		}
	});
	$('body').dblclick(function () {
		if ($("body").hasClass("cousline")) {
			$("body").removeClass("cousline")
		}
		return
	});
	$("#control").click(function () {
		if ($(this).attr("src").indexOf("j_") != -1) {
			$(this).attr("src", "/img/-ioc.png");
			$("#menu").show()
		} else {
			$(this).attr("src", "/img/j_ioc.png");
			$("#menu").hide()
		}
	});
	$("#rTitle a").click(function () {
		$("#result").hide()
	});
	$(".lables_scale").on('click', function () {
		let checkdivobj = $(this).prev();
		checkdivobj.click()
	});
	IsDBdiv();
	$("#bnt_wd").on('click', function () {
		if ($("#map").css("display") == "none") {
			os('error', "请开启三维模式！", '');
			return
		}
		$("#map").css("cursor", "crosshair");
		wdflat = true
	});
	$("#bnt_bsclear").on("click", function () {
		if ($("#map").css("display") == "none") {
			os('error', "请开启三维模式！", '');
			return
		}
		$("#map").css("cursor", "auto");
		wdflat = false;
		try {
			palaceTileset.clippingPlanes.removeAll()
		} catch (e) { }
	});
	$("#bnt_upheigt").on("click", function () {
		if ($("#map").css("display") == "none") {
			os('error', "请开启三维模式！", '');
			return
		}
		lengtvalue = -1 * $("#wdheight").val();
		labels.removeAll();
		yhlabels.removeAll();
		scene.primitives.remove(linePrimitive);
		scene.primitives.remove(flowtoPrimitive);
		scene.primitives.remove(yhPrimitive);
		for (var i = 0; i < holePrimitive.length; ++i) {
			let sas = new Cesium.Cartesian3();
			Cesium.Matrix4.getTranslation(holePrimitive.get(i).modelMatrix, sas);
			let cats = ellipsoid.cartesianToCartographic(sas);
			let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cats.longitude), Cesium.Math.toDegrees(cats.latitude), cats.height - lengtvalue - bflengtvalue));
			holePrimitive.get(i).modelMatrix = modelMatrix
		}
		bflengtvalue = -1 * lengtvalue;
		getLineHoles(true);
		getYhData(true)
	});
	$("#bnt_clearup").on("click", function () {
		if ($("#map").css("display") == "none") {
			os('error', "请开启三维模式！", '');
			return
		}
		lengtvalue = -1 * mlengtvalue;
		labels.removeAll();
		yhlabels.removeAll();
		scene.primitives.remove(linePrimitive);
		scene.primitives.remove(flowtoPrimitive);
		scene.primitives.remove(yhPrimitive);
		for (var i = 0; i < holePrimitive.length; ++i) {
			let sas = new Cesium.Cartesian3();
			Cesium.Matrix4.getTranslation(holePrimitive.get(i).modelMatrix, sas);
			let cats = ellipsoid.cartesianToCartographic(sas);
			let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cats.longitude), Cesium.Math.toDegrees(cats.latitude), cats.height - lengtvalue - bflengtvalue));
			holePrimitive.get(i).modelMatrix = modelMatrix
		}
		bflengtvalue = -1 * lengtvalue;
		getLineHoles(true);
		getYhData(true)
	})
}
function in_array(a, b) {
	for (s = 0; s < b.length; s++) {
		thisEntry = b[s].toString();
		if (thisEntry == a) {
			return true
		}
	}
	return false
}
function IsGoemdiv() {
	var a = $('#map_geom');
	var b = a.offset().top;
	var c = b + a.height();
	var d = a.offset().left;
	var e = d + a.width();
	if (x < d || x > e || y < b || y > c) {
		Isgoemdiv = false
	} else {
		Isgoemdiv = true
	}
}
function IsDBdiv() {
	var a = $('#bdmap');
	var b = a.offset().top;
	var c = b + a.height();
	var d = a.offset().left;
	var e = d + a.width();
	if (x < d || x > e || y < b || y > c) {
		IsBddiv = false
	} else {
		IsBddiv = true
	}
}
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

function bd09towgs84(a, b) {
	var c = bd09togcj02(a, b);
	var d = gcj02towgs84(c[0], c[1]);
	return d
}
function wgs84tobd09(a, b) {
	var c = wgs84togcj02(a, b);
	var d = gcj02tobd09(c[0], c[1]);
	return d
}
function bd09togcj02(a, b) {
	var c = 3.14159265358979324 * 3000.0 / 180.0;
	var x = a - 0.0065;
	var y = b - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * c);
	var d = Math.atan2(y, x) - 0.000003 * Math.cos(x * c);
	var e = z * Math.cos(d);
	var f = z * Math.sin(d);
	return [e, f]
}
function gcj02tobd09(a, b) {
	var z = Math.sqrt(a * a + b * b) + 0.00002 * Math.sin(b * x_PI);
	var c = Math.atan2(b, a) + 0.000003 * Math.cos(a * x_PI);
	var d = z * Math.cos(c) + 0.0065;
	var e = z * Math.sin(c) + 0.006;
	return [d, e]
}
function wgs84togcj02(b, c) {
	if (out_of_china(b, c)) {
		return [b, c]
	} else {
		var d = transformlat(b - 105.0, c - 35.0);
		var e = transformlng(b - 105.0, c - 35.0);
		var f = c / 180.0 * PI;
		var g = Math.sin(f);
		g = 1 - ee * g * g;
		var h = Math.sqrt(g);
		d = (d * 180.0) / ((a * (1 - ee)) / (g * h) * PI);
		e = (e * 180.0) / (a / h * Math.cos(f) * PI);
		var i = c + d;
		var j = b + e;
		return [j, i]
	}
}
function gcj02towgs84(b, c) {
	if (out_of_china(b, c)) {
		return [b, c]
	} else {
		var d = transformlat(b - 105.0, c - 35.0);
		var e = transformlng(b - 105.0, c - 35.0);
		var f = c / 180.0 * PI;
		var g = Math.sin(f);
		g = 1 - ee * g * g;
		var h = Math.sqrt(g);
		d = (d * 180.0) / ((a * (1 - ee)) / (g * h) * PI);
		e = (e * 180.0) / (a / h * Math.cos(f) * PI);
		mglat = c + d;
		mglng = b + e;
		return [b * 2 - mglng, c * 2 - mglat]
	}
}
function transformlat(a, b) {
	var c = -100.0 + 2.0 * a + 3.0 * b + 0.2 * b * b + 0.1 * a * b + 0.2 * Math.sqrt(Math.abs(a));
	c += (20.0 * Math.sin(6.0 * a * PI) + 20.0 * Math.sin(2.0 * a * PI)) * 2.0 / 3.0;
	c += (20.0 * Math.sin(b * PI) + 40.0 * Math.sin(b / 3.0 * PI)) * 2.0 / 3.0;
	c += (160.0 * Math.sin(b / 12.0 * PI) + 320 * Math.sin(b * PI / 30.0)) * 2.0 / 3.0;
	return c
}
function transformlng(a, b) {
	var c = 300.0 + a + 2.0 * b + 0.1 * a * a + 0.1 * a * b + 0.1 * Math.sqrt(Math.abs(a));
	c += (20.0 * Math.sin(6.0 * a * PI) + 20.0 * Math.sin(2.0 * a * PI)) * 2.0 / 3.0;
	c += (20.0 * Math.sin(a * PI) + 40.0 * Math.sin(a / 3.0 * PI)) * 2.0 / 3.0;
	c += (150.0 * Math.sin(a / 12.0 * PI) + 300.0 * Math.sin(a / 30.0 * PI)) * 2.0 / 3.0;
	return c
}
function out_of_china(a, b) {
	return (a < 72.004 || a > 137.8347) || ((b < 0.8293 || b > 55.8271) || false)
}
function IDMSclear() {
	console.clear()
}
function getLineInfoByID(c) {
	var d = layer.load(1, {
		shade: [0.1, '#000']
	});
	$.post("/home/getLineInfoByID", {
		id: c
	}, function (a, b) {
		layer.close(d);
		if (!a.success) {
			os('error', a.msg, '')
		} else {
			$("#property").show();
			bindingLineDate(a)
		}
	}).error(function () {
		layer.close(d);
		os('error', '服务器信息', '请求出错了，请刷新页面后重试！')
	})
}
function getHoleInfoByID(c) {
	var d = layer.load(1, {
		shade: [0.1, '#000']
	});
	$.post("/home/getHoleInfoByID", {
		id: c
	}, function (a, b) {
		layer.close(d);
		if (!a.success) {
			os('error', a.msg, '')
		} else {
			os('success', a.msg, '');
			$("#property").show();
			bindingHoleDate(a)
		}
	}).error(function () {
		layer.close(d);
		os('error', '服务器信息', '请求出错了，请刷新页面后重试！')
	})
}
function getOLcesiumHeight(a) {
	var b = 17.5;
	if (a >= 22.7) {
		b = 17.5
	} else if (a >= 22 && a < 22.7) {
		b = 25.04
	} else if (a >= 21.71071131199397 && a < 22) {
		b = 36.8
	} else if (a >= 21 && a < 21.71071131199397) {
		b = 58.5
	} else if (a >= 20.3 && a < 21) {
		b = 93
	} else if (a >= 19.5 && a < 20.3) {
		b = 178
	} else if (a >= 19 && a < 19.5) {
		b = 225
	} else if (a >= 18.5 && a < 19) {
		b = 357.2
	} else if (a >= 17.77286058647078 && a < 18.5) {
		b = 565
	} else if (a >= 17.43952725313745 && a < 17.77286058647078) {
		b = 712
	} else if (a >= 17.10619391980411 && a < 17.43952725313745) {
		b = 897.58
	} else if (a >= 16.439527253137452 && a < 17.10619391980411) {
		b = 1424.8148103364
	} else if (a >= 16 && a < 16.439527253137452) {
		b = 1795.1369600243
	} else if (a >= 15.772860586470786 && a < 16) {
		b = 2261.7034978329
	} else if (a >= 15 && a < 15.772860586470786) {
		b = 3590.1068660782
	} else if (a >= 14.772860586470786 && a < 15) {
		b = 4523.1421528978
	} else if (a >= 14 && a < 14.772860586470786) {
		b = 7179.5462919873
	} else if (a >= 13.77390617495334 && a < 14) {
		b = 9045.2241461916
	} else if (a >= 13.3 && a < 13.77390617495334) {
		b = 11395.5728008447
	} else if (a >= 12.8 && a < 13.3) {
		b = 18086
	} else if (a >= 12.3 && a < 12.8) {
		b = 22784.3704362216
	} else {
		b = 36155.4557603476
	}
	return b
}
function getolMapZoom(a) {
	var b = 21;
	if (a <= 17.49) {
		b = 23.611944225500256
	} else if (a <= 25.0399999979 && a > 17.49) {
		b = 22.05497038908147
	} else if (a <= 58.4999999997 && a > 25.0399999979) {
		b = 21.169767440745293
	} else if (a <= 93 && a > 58.4999999997) {
		b = 20.521702577882706
	} else if (a <= 178 && a > 93) {
		b = 20.188369244549374
	} else if (a <= 357.2 && a > 178) {
		b = 18.855035911216046
	} else if (a <= 565 && a > 357.2) {
		b = 18.18836924454938
	} else if (a <= 712 && a > 565) {
		b = 17.52170257788272
	} else if (a <= 1424.8 && a > 712) {
		b = 17
	} else if (a <= 1795.137 && a > 1424.8) {
		b = 16.4
	} else if (a <= 3590.1 && a > 1795.137) {
		b = 15.7
	} else if (a <= 4868.5984 && a > 3590.1) {
		b = 14.7
	} else if (a <= 3133.85 && a > 4868.5984) {
		b = 14.33
	} else if (a <= 7727.8479 && a > 3133.85) {
		b = 14
	} else if (a <= 9735.96934 && a > 7727.8479) {
		b = 13.666667
	} else if (a <= 12265.747 && a > 9735.96934) {
		b = 13.33
	} else if (a <= 19467 && a > 12265.747) {
		b = 12.66
	} else if (a <= 24523.69 && a > 19467) {
		b = 12.3
	} else if (a <= 30892.8 && a > 24523.69) {
		b = 12
	} else if (a <= 38914.4 && a > 30892.8) {
		b = 11.66
	} else if (a <= 49016.15855 && a > 38914.4) {
		b = 11.333
	} else {
		b = 10
	}
	return b
}
function getBDMapZoom(a) {
	var b = 21;
	if (a <= 99.6) {
		b = 21
	} else if (a <= 114.3 && a > 99.6) {
		b = 20.8
	} else if (a <= 131.3 && a > 114.3) {
		b = 20.6
	} else if (a <= 150.9 && a > 131.3) {
		b = 20.4
	} else if (a <= 173.3 && a > 150.9) {
		b = 20.2
	} else if (a <= 200 && a > 173.3) {
		b = 20
	} else if (a <= 228.6 && a > 200) {
		b = 19.8
	} else if (a <= 262.6 && a > 228.6) {
		b = 19.6
	} else if (a <= 300 && a > 262.6) {
		b = 19.4
	} else if (a <= 346.6 && a > 300) {
		b = 19.2
	} else if (a <= 399 && a > 346.6) {
		b = 19
	} else if (a <= 457 && a > 399) {
		b = 18.8
	} else if (a <= 525 && a > 457) {
		b = 18.6
	} else if (a <= 604 && a > 525) {
		b = 18.4
	} else if (a <= 693 && a > 604) {
		b = 18.2
	} else if (a <= 796 && a > 693) {
		b = 18
	} else if (a <= 915 && a > 796) {
		b = 17.8
	} else if (a <= 1051 && a > 915) {
		b = 17.6
	} else if (a <= 1207 && a > 1051) {
		b = 17.4
	} else if (a <= 1387.4 && a > 1207) {
		b = 17.2
	} else if (a <= 1594 && a > 1387.4) {
		b = 17
	} else {
		b = 16.8
	}
	return b
}
function getCenterPosition() {
	try {
		var a = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
		var b = Cesium.Ellipsoid.WGS84.cartesianToCartographic(a);
		var c = b.longitude * 180 / Math.PI;
		var d = b.latitude * 180 / Math.PI;
		var f = getHeight();
		return {
			lon: c,
			lat: d,
			height: f
		}
	} catch (e) { }
}
function getHeight() {
	if (viewer) {
		var a = viewer.scene;
		var b = a.globe.ellipsoid;
		var c = b.cartesianToCartographic(viewer.camera.position).height;
		return c
	}
}
function getLineHoles(k) {
	var l = layer.load(1, {
		shade: [0.1, '#000']
	});
	$.post("/home/getLineHolesDate", {}, function (g, h) {
		holdListData = g;
		layer.close(l);
		if (!g.response) {
			os('error', g.msg, '', 7000, '')
		} else {
			let line_instances = [];
			var j = [];
			let holecolor = Cesium.Color.ALICEBLUE;
			let msa = 0;
			if (!k) holePrimitive = new Cesium.PrimitiveCollection();
			else msa = mlengtvalue;
			$.each(g.response.lineDateMoldes, function (i, a) {
				let e_pipealtitude = Number(a.ehight - a.eDeep) - lengtvalue - msa;
				let s_pipealtitude = Number(a.shight - a.sDeep) - lengtvalue - msa;
				let attributes = Cesium.Color.DEEPPINK;
				let sholeUrl = '/js/cesiumhelp/model/ys22.glb';
				let eholeUrl = '/js/cesiumhelp/model/ys22.glb';
				if (a.smaxdeep >= 3.15) {
					sholeUrl = '/js/cesiumhelp/model/ys1.glb'
				}
				if (a.emaxdeep >= 3.15) {
					eholeUrl = '/js/cesiumhelp/model/ys1.glb'
				}
				let sscale = 6;
				let escale = 6;
				let sheight = 0;
				let eheight = 0;
				let spipeheight = 0.5;
				let epipeheight = 0.5;
				if (a.line_Class === "WS") {
					attributes = Cesium.Color.DEEPPINK;
					sholeUrl = '/js/cesiumhelp/model/ws22.glb';
					eholeUrl = '/js/cesiumhelp/model/ws22.glb';
					if (a.smaxdeep >= 3.15) {
						sholeUrl = '/js/cesiumhelp/model/ws1.glb'
					}
					if (a.emaxdeep >= 3.15) {
						eholeUrl = '/js/cesiumhelp/model/ws1.glb'
					}
				} else {
					attributes = Cesium.Color.DARKRED
				}
				var b = false;
				if (areacode == "gd_sz_gm") {
					b = i > 1500
				} else {
					b = i < 20000000
				}
				if (b) {
					if (!k) {
						if (!in_array(a.s_Point, ceHoleList)) {
							if (a.s_subsid == "雨水篦" || a.s_subsid == "污水篦") {
								sholeUrl = '/js/cesiumhelp/model/yb22.glb';
								sscale = 3;
								sheight = 1.3;
								spipeheight = 1.3
							}
							var c = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(a.sCoorWgsX, a.sCoorWgsY, a.shight - lengtvalue - msa));
							var d = Cesium.Model.fromGltf({
								id: "pipe_hole_" + a.s_Point + "_$" + a.sholeID,
								url: sholeUrl,
								modelMatrix: c,
								scale: sscale,
								primitivesType: "holeType",
								color: holecolor
							});
							holePrimitive.add(d, a.sholeID);
							ceHoleList.push(a.s_Point)
						} else {
							if (a.s_subsid == "雨水篦" || a.s_subsid == "污水篦") spipeheight = 1.3
						}
						if (!in_array(a.e_Point, ceHoleList) && ((a.e_subsid == null || a.e_subsid == "") && a.e_Feature != "出水口")) {
							if (a.e_subsid == "雨水篦" || a.e_subsid == "污水篦") {
								eholeUrl = '/js/cesiumhelp/model/yb22.glb';
								escale = 3;
								eheight = 1.3;
								epipeheight = 1.3
							}
							var e = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(a.eCoorWgsX, a.eCoorWgsY, a.ehight - lengtvalue - msa));
							var f = Cesium.Model.fromGltf({
								id: "pipe_hole_" + a.e_Point + "_$" + a.eholeID,
								url: eholeUrl,
								modelMatrix: e,
								scale: escale,
								primitivesType: "holeType",
								color: holecolor
							});
							holePrimitive.add(f, a.eholeID);
							ceHoleList.push(a.e_Point)
						} else {
							if (a.e_subsid == "雨水篦" || a.e_subsid == "污水篦") epipeheight = 1.3
						}
					}
					labels.add({
						id: "line_labels_" + a.lineID,
						position: Cesium.Cartesian3.fromDegrees(a.cCoorWgsX, a.cCoorWgsY, a.shight - lengtvalue - msa),
						text: a.pSize,
						font: '20px Helvetica',
						fillColor: attributes,
						show: false
					});
					let slx = (a.sCoorWgsX + a.cCoorWgsX) / 2;
					slx = (slx + a.cCoorWgsX) / 2;
					slx = (slx + a.cCoorWgsX) / 2;
					let sly = (a.sCoorWgsY + a.cCoorWgsY) / 2;
					sly = (sly + a.cCoorWgsY) / 2;
					sly = (sly + a.cCoorWgsY) / 2;
					let elx = (a.cCoorWgsX + a.eCoorWgsX) / 2;
					elx = (elx + a.cCoorWgsX) / 2;
					elx = (elx + a.cCoorWgsX) / 2;
					let ely = (a.cCoorWgsY + a.eCoorWgsY) / 2;
					ely = (ely + a.cCoorWgsY) / 2;
					ely = (ely + a.cCoorWgsY) / 2;
					let ceshight = a.shight - a.ehight;
					j.push(new Cesium.GeometryInstance({
						id: "flowto_" + a.line_Class + "_" + a.lineID,
						geometry: new Cesium.PolylineGeometry({
							positions: Cesium.Cartesian3.fromDegreesArrayHeights([slx, sly, (ceshight / 4) + a.ehight - (a.sDeep / 2) - lengtvalue - msa, elx, ely, (ceshight / 4) + a.ehight - (a.sDeep / 2) - lengtvalue - msa]),
							width: 20.0,
							vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
						})
					}));
					let shapePositions = computeCircle(0.3);
					if (a.pSize.indexOf('X') >= 0) shapePositions = computeRectangle(a.pSize);
					else shapePositions = computeCircle(a.pSize);
					line_instances.push(new Cesium.GeometryInstance({
						id: "pipe_line_" + a.lno + "_" + a.line_Class + "$" + a.lineID,
						geometry: new Cesium.PolylineVolumeGeometry({
							polylinePositions: Cesium.Cartesian3.fromDegreesArrayHeights([a.sCoorWgsX, a.sCoorWgsY, s_pipealtitude, a.eCoorWgsX, a.eCoorWgsY, e_pipealtitude]),
							vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
							shapePositions: shapePositions
						}),
						attributes: {
							color: Cesium.ColorGeometryInstanceAttribute.fromColor(attributes),
							show: new Cesium.ShowGeometryInstanceAttribute(true)
						}
					}))
				}
			});
			flowtoPrimitive = new Cesium.Primitive({
				geometryInstances: j,
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
			linePrimitive = new Cesium.Primitive({
				geometryInstances: line_instances,
				appearance: new Cesium.PerInstanceColorAppearance({
					translucent: false,
					closed: true
				})
			});
			viewer.scene.primitives.add(linePrimitive);
			viewer.scene.primitives.add(holePrimitive)
		}
	}).error(function () {
		layer.close(l);
		os('error', '请求出错了，请刷新页面后重试！', '', 7000, '')
	})
}
function getbuildList() {
	let url = "https://image.imlzx.cn/3dTile/fs/tileset.json";
	if (areacode == "gd_sz_gm") url = "https://image.imlzx.cn/3dTile/gm/tileset.json";
	palaceTileset = new Cesium.Cesium3DTileset({
		url: url
	});
	viewer.scene.primitives.add(palaceTileset)
}
function getCivicCenter() {
	let url = "https://image.imlzx.cn/3dTile/qx/tileset.json";
	palaceTileset = new Cesium.Cesium3DTileset({
		url: url
	});
	let tileset = viewer.scene.primitives.add(palaceTileset);
	tileset.readyPromise.then(function (a) {
		var b = 114.20115646;
		var c = 22.7471369382;
		var d = 0;
		let hpr = new Cesium.Matrix3();
		let hprObj = new Cesium.HeadingPitchRoll(Math.PI, Math.PI, Math.PI);
		hpr = Cesium.Matrix3.fromHeadingPitchRoll(hprObj, hpr);
		let modelMatrix = Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(b, c, d)), new Cesium.Cartesian3(), new Cesium.Matrix4());
		Cesium.Matrix4.multiplyByMatrix3(modelMatrix, hpr, modelMatrix);
		tileset._root.transform = modelMatrix
	})
}
function flyTo(a, b, c) {
	viewer.camera.flyTo({
		destination: Cesium.Cartesian3.fromDegrees(a, b, c)
	})
}
function computeRectangle(a) {
	let psizeArr = a.split('X');
	let wide = Number(psizeArr[0]) / 2000;
	let long = Number(psizeArr[1]) / 2000;
	var b = [];
	b.push(new Cesium.Cartesian2(wide, long));
	b.push(new Cesium.Cartesian2(-wide, long));
	b.push(new Cesium.Cartesian2(-wide, -long));
	b.push(new Cesium.Cartesian2(wide, -long));
	return b
}
function computeCircle(a) {
	a = Number(a) / 1000;
	a = a / 2;
	var b = [];
	for (var i = 0; i < 360; i++) {
		var c = Cesium.Math.toRadians(i);
		b.push(new Cesium.Cartesian2(a * Math.cos(c), a * Math.sin(c)))
	}
	return b
}
function os(a, b, c, d, e) {
	d = (d === undefined || d === "" || d === null === undefined ? '7000' : d);
	e = (e === undefined || e === "" || e === null ? 'toast-top-center' : e);
	toastr.options = {
		"closeButton": true,
		"debug": false,
		"progressBar": true,
		"positionClass": e,
		"showDuration": "400",
		"hideDuration": "1000",
		"timeOut": d,
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};
	toastr[a](b, c)
}
function validationNumber(e, a) {
	var b = /^[0-9]+\.?[0-9]*$/;
	if (e.value != "") {
		if (!b.test(e.value)) {
			alert("请输入正确的数字");
			e.value = e.value.substring(0, e.value.length - 1);
			e.focus()
		} else {
			if (a == 0) {
				if (e.value.indexOf('.') > -1) {
					e.value = e.value.substring(0, e.value.length - 1);
					e.focus()
				}
			}
			if (e.value.indexOf('.') > -1) {
				if (e.value.split('.')[1].length > a) {
					e.value = e.value.substring(0, e.value.length - 1);
					e.focus()
				}
			}
		}
	}
}
function recoveryLineColor() {
	try {
		if (lineCLICKID != "") {
			var a = lineCLICKID.split('$')[1];
			if ($("#plckbox").is(":checked") || !$("#qhckbox").is(":checked")) {
				for (var i = 0; i < bdPolylineID.length; i++) {
					if (bdPolylineID[i] == a) {
						if (lineCLICKID.indexOf('WS') < 0) bdPolyline[i].setStrokeColor("#881212");
						else bdPolyline[i].setStrokeColor("#ff50ff");
						break
					}
				}
			}
			if (lineCLICKID.indexOf('WS') < 0) {
				var b = linePrimitive.getGeometryInstanceAttributes(lineCLICKID);
				b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED)
			} else {
				var b = linePrimitive.getGeometryInstanceAttributes(lineCLICKID);
				b.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK)
			}
			lineCLICKID = ""
		}
	} catch (e) { }
}
function recoveryHoleColor() {
	try {
		if (holeCLICKID != null) {
			for (var i = 0; i < holePrimitive.length; i++) {
				if (holePrimitive.get(i).id == holeCLICKID) {
					holePrimitive.get(i).color = Cesium.Color.ALICEBLUE;
					break
				}
			}
		}
		holeCLICKID = null
	} catch (e) { }
}
function getYhData(d) {
	$.get('/home/getYhData', null, function (b, c) {
		if (b.response != null) {
			let yh_instances = [];
			$.each(b.response, function (i, a) {
				let heg = 1.6;
				let msa = 0;
				if (d) msa = mlengtvalue;
				if (a.tableType === "pipe_hole") {
					heg = a.height - lengtvalue - msa
				} else {
					heg = ((a.height - lengtvalue - msa + a.eheight - lengtvalue - msa) / 2) - 1
				}
				yh_instances.push(new Cesium.GeometryInstance({
					id: "yh_" + a.id,
					geometry: new Cesium.PolylineGeometry({
						positions: Cesium.Cartesian3.fromDegreesArrayHeights([a.coorWgsX, a.coorWgsY, heg + 1 + 0.5, a.coorWgsX, a.coorWgsY, heg + 1]),
						width: 20.0,
						vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
					})
				}));
				yhlabels.add({
					id: "yh_labels_" + a.id,
					position: Cesium.Cartesian3.fromDegrees(a.coorWgsX, a.coorWgsY, heg + 1 + 0.5),
					text: a.testMsg,
					font: '20px Helvetica',
					fillColor: Cesium.Color.RED,
					show: false
				})
			});
			yhPrimitive = new Cesium.Primitive({
				geometryInstances: yh_instances,
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
			viewer.scene.primitives.add(yhPrimitive)
		}
	})
}
function addYHMolde(a, b, c, d, e) {
	yhlabels.add({
		id: "yh_labels_" + a,
		position: Cesium.Cartesian3.fromDegrees(b, c, d + 1),
		text: e,
		font: '20px Helvetica',
		fillColor: Cesium.Color.RED,
		show: false
	});
	var f = new Cesium.Primitive({
		geometryInstances: new Cesium.GeometryInstance({
			id: "yh_" + a,
			geometry: new Cesium.PolylineGeometry({
				positions: Cesium.Cartesian3.fromDegreesArrayHeights([b, c, d + 1, b, c, d + 0.5]),
				width: 20.0,
				vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
			})
		}),
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
	viewer.scene.primitives.add(f)
}
function bindingHoleDate(a) {
	$("#layercctv").hide();
	$("#videoContainer").html("");
	$("#property .layui-tab-title li").each(function () {
		$(this).removeClass("layui-this")
	});
	$("#infoTab").addClass("layui-this");
	$("#property .layui-tab-content div").each(function () {
		$(this).removeClass("layui-show")
	});
	$("#infoDIV").addClass("layui-show");
	$("#cctvInfoTab").hide();
	$("#cctvinfdiv").hide();
	$("#syinfoTab").hide();
	$("#flowTOinfoTab").hide();
	$("#syinfoDIV").removeClass('layui-show');
	$("#flowTOinfoDIV").removeClass('layui-show');
	var b = "";
	b += "<tr><td>项目名称：</td><td>" + a.response.model.prj_Name + "</td></tr>";
	b += "<tr><td>Exp_No：</td><td>" + a.response.model.exp_No + "</td></tr>";
	b += "<tr><td>井盖类型：</td><td>" + a.response.model.hType + "</td></tr>";
	b += "<tr><td>ZType：</td><td>" + a.response.model.zType + "</td></tr>";
	b += "<tr><td>深圳独立坐标：</td><td>" + a.response.model.szCoorX + "," + a.response.model.szCoorY + "</td></tr>";
	b += "<tr><td>高度：</td><td>" + a.response.model.hight + "</td></tr>";
	b += "<tr><td>角度：</td><td>" + a.response.model.rotation + "</td></tr>";
	b += "<tr><td>沙井特点：</td><td>" + a.response.model.feature + "</td></tr>";
	b += "<tr><td>沙井类型：</td><td>" + a.response.model.subsid + "</td></tr>";
	b += "<tr><td>材质：</td><td>" + a.response.model.feaMateria + "</td></tr>";
	b += "<tr><td>Spec：</td><td>" + a.response.model.spec + "</td></tr>";
	b += "<tr><td>深度：</td><td>" + a.response.model.deep + "</td></tr>";
	b += "<tr><td>沙井形状：</td><td>" + a.response.model.wellShape + "</td></tr>";
	b += "<tr><td>沙井材质：</td><td>" + a.response.model.wellMater + "</td></tr>";
	b += "<tr><td>井管数：</td><td>" + a.response.model.wellPipes + "</td></tr>";
	b += "<tr><td>沙井大小：</td><td>" + a.response.model.wellSize + "</td></tr>";
	b += "<tr><td>地址：</td><td>" + a.response.model.address + "</td></tr>";
	b += "<tr><td>归属：</td><td>" + a.response.model.belong + "</td></tr>";
	b += "<tr><td>时间：</td><td>" + a.response.model.mDate + "</td></tr>";
	b += "<tr><td>地图编码：</td><td>" + a.response.model.mapCode + "</td></tr>";
	b += "<tr><td>所属单位：</td><td>" + a.response.model.sUnit + "</td></tr>";
	b += "<tr><td>所属单位：</td><td>" + a.response.model.sUnit + "</td></tr>";
	b += "<tr><td>日期：</td><td>" + a.response.model.sDate + "</td></tr>";
	b += "<tr><td>更新日期：</td><td>" + a.response.model.updateTime + "</td></tr>";
	b += "<tr><td>可见度：</td><td>" + a.response.model.visibility + "</td></tr>";
	b += "<tr><td>状态：</td><td>" + a.response.model.status + "</td></tr>";
	b += "<tr><td>pointPosit：</td><td>" + a.response.model.pointPosit + "</td></tr>";
	b += "<tr><td>操作人员：</td><td>" + a.response.model.operator + "</td></tr>";
	b += "<tr><td>备注：</td><td>" + a.response.model.note + "</td></tr>";
	$("#InfoTab1").html(b);
	$("#InfoTab1 tr td:even").addClass("title");
	$("#InfoTab1 tr td:odd").addClass("value");
	var b = "";
	for (var i = 0; i < a.response.dangers.length; i++) {
		var c = a.response.dangers[i];
		b += "<tr><td colspan='2'>" + c.content + "</td></tr>";
		b += "<tr><td colspan='2'>位置：" + c.coorWgsX + "," + c.coorWgsY + "</td></tr>";
		b += "<tr><td width='50%' align='center'>" + c.handUnit + "</td><td width='50%' align='center'>" + c.handleTime + "</td></tr>";
		b += "<tr><td colspan='2'><img src='" + c.gR_img + "'/></td></tr>";
		b += "<tr><td colspan='2' style='height:12px;'></td></tr>"
	}
	if (b === "") {
		b = "暂无隐患信息"
	}
	$("#InfoTab2").html(b)
}
function bindingLineDate(e) {
	$("#layercctv").hide();
	$("#videoContainer").html("");
	if ($("#ftLineckbox").prop("checked")) {
		$("#ftLineckbox").next().click()
	}
	if ($("#syLineckbox").prop("checked")) {
		$("#syLineckbox").next().click()
	}
	$("#property .layui-tab-title li").each(function () {
		$(this).removeClass("layui-this")
	});
	$("#infoTab").addClass("layui-this");
	$("#property .layui-tab-content div").each(function () {
		$(this).removeClass("layui-show")
	});
	$("#infoDIV").addClass("layui-show");
	$("#cctvinfdiv").removeClass('layui-show');
	$("#cctvInfo").html("");
	$("#syinfoTab").show();
	$("#flowTOinfoTab").show();
	$("#syLineckbox").prop("checked", false);
	$("#ftLineckbox").prop("checked", false);
	$("#ftLineckbox").attr("data-line", e.response.model.line_Class);
	$("#syLineckbox").attr("data-line", e.response.model.line_Class);
	var f = "";
	var g = "";
	var h = "";
	var j = 0;
	$.each(e.response.flowToMolde.seLineMoldes, function (a, b) {
		var c = "否";
		var d = '';
		if (b.e_holeID > 0) {
			c = "是";
			d = 'style="background: #fff5d1;"';
			j++
		}
		g += "'" + b.id + "'|";
		f += "pipe_line_" + b.lno + "_" + b.line_Class + "$" + b.id + ",";
		h += "<tr " + d + "  onclick='flytoByLineHole(" + b.id + ",1)'><td>" + b.lno + "</td><td>" + b.pSize + "</td><td>" + c + "</td></tr>"
	});
	if (h === "") h = "<tr><td colspan='3'>没有流向管数据</td></tr>";
	$("#FlowToBody").html(h);
	ywEchatInit(e.response.flowToMolde.wsLineSum, e.response.flowToMolde.ysLineSum, "流向经过管段", "wyFechat");
	frEchatInit(e.response.flowToMolde.fLineSum, e.response.flowToMolde.rLineSum, "流向经过管段", "frFechat");
	var k = "";
	var l = "";
	var m = "";
	var n = 0;
	$.each(e.response.traceabilityMolde.seLineMoldes, function (a, b) {
		var c = "否";
		var d = '';
		if (b.s_holeID > 0) {
			c = "是";
			d = 'style="background: #fff5d1;"';
			n++
		}
		l += "'" + b.id + "'|";
		k += "pipe_line_" + b.lno + "_" + b.line_Class + "$" + b.id + ",";
		m += "<tr " + d + " onclick='flytoByLineHole(" + b.id + ",1)'><td>" + b.lno + "</td><td>" + b.pSize + "</td><td>" + c + "</td></tr>"
	});
	if (m === "") m = "<tr><td colspan='3'>没有溯源管数据</td></tr>";
	$("#syBody").html(m);
	ywEchatInit(e.response.traceabilityMolde.wsLineSum, e.response.traceabilityMolde.ysLineSum, "来源经过管段", "wyTechat");
	frEchatInit(e.response.traceabilityMolde.fLineSum, e.response.traceabilityMolde.rLineSum, "来源经过管段", "frTechat");
	if (k != "" && k != null) {
		k = k.substring(0, k.lastIndexOf(','));
		l = l.substring(0, l.lastIndexOf('|'))
	}
	if (f != "" && f != null) {
		f = f.substring(0, f.lastIndexOf(','));
		g = g.substring(0, g.lastIndexOf('|'))
	}
	$("#syLineckbox").val(k);
	$("#ftLineckbox").val(f);
	$("#syLineckbox").attr("data-ids", l);
	$("#ftLineckbox").attr("data-ids", g);
	var o = "";
	o += "<tr><td>起始井号：</td><td>" + e.response.model.s_Point + "</td></tr>";
	o += "<tr><td>终止井号：</td><td>" + e.response.model.e_Point + "</td></tr>";
	o += "<tr><td>起始井深度：</td><td>" + e.response.model.s_Deep + "</td></tr>";
	o += "<tr><td>终止井深度：</td><td>" + e.response.model.e_Deep + "</td></tr>";
	o += "<tr><td>材质：</td><td>" + e.response.model.material + "</td></tr>";
	o += "<tr><td>管道类型：</td><td>" + e.response.model.line_Class + "</td></tr>";
	o += "<tr><td>code：</td><td>" + e.response.model.code + "</td></tr>";
	o += "<tr><td>ServiceLif：</td><td>" + e.response.model.serviceLif + "</td></tr>";
	o += "<tr><td>管径大小：</td><td>" + e.response.model.pSize + "</td></tr>";
	o += "<tr><td>数量：</td><td>" + e.response.model.cabNum + "</td></tr>";
	o += "<tr><td>总数：</td><td>" + e.response.model.totalHole + "</td></tr>";
	o += "<tr><td>流向：</td><td>" + e.response.model.flowDir + "</td></tr>";
	o += "<tr><td>地址：</td><td>" + e.response.model.address + "</td></tr>";
	o += "<tr><td>道路编号：</td><td>" + e.response.model.roadcode + "</td></tr>";
	o += "<tr><td>填埋方式：</td><td>" + e.response.model.emBed + "</td></tr>";
	o += "<tr><td>调查日期：</td><td>" + e.response.model.mDate + "</td></tr>";
	o += "<tr><td>SUnit：</td><td>" + e.response.model.sUnit + "</td></tr>";
	o += "<tr><td>SDate：</td><td>" + e.response.model.sDate + "</td></tr>";
	o += "<tr><td>更新日期：</td><td>" + e.response.model.updateTime + "</td></tr>";
	o += "<tr><td>管线编号：</td><td>" + e.response.model.lno + "</td></tr>";
	o += "<tr><td>管线类型：</td><td>" + e.response.model.lineType + "</td></tr>";
	o += "<tr><td>当前状态：</td><td>" + e.response.model.status + "</td></tr>";
	o += "<tr><td>管道长度：</td><td>" + e.response.model.pipeLength + "</td></tr>";
	o += "<tr><td>操作人员：</td><td>" + e.response.model.operator + "</td></tr>";
	o += "<tr><td>记录：</td><td>" + e.response.model.note + "</td></tr>";
	$("#InfoTab1").html(o);
	$("#InfoTab1 tr td:even").addClass("title");
	$("#InfoTab1 tr td:odd").addClass("value");
	var o = "";
	for (var i = 0; i < e.response.dangers.length; i++) {
		var p = e.response.dangers[i];
		o += "<tr><td colspan='2'>" + p.content + "</td></tr>";
		o += "<tr><td colspan='2'>位置：" + p.coorWgsX + "," + p.coorWgsY + "</td></tr>";
		o += "<tr><td width='50%' align='center'>" + p.handUnit + "</td><td width='50%' align='center'>" + p.handleTime + "</td></tr>";
		o += "<tr><td colspan='2'><img src='" + p.gR_img + "'/></td></tr>";
		o += "<tr><td colspan='2' style='height:12px;'></td></tr>"
	}
	if (o === "") {
		o = "暂无隐患信息"
	}
	$("#InfoTab2").html(o);
	if (e.response.cctvID != 0) {
		var q = layer.msg('正在获取CCTV资料...', {
			icon: 16,
			shade: 0.01
		});
		$.get('/home/getCCTVInfoByID', {
			pipeid: e.response.cctvID
		}, function (a, b) {
			layer.close(q);
			if (a.response != null) {
				let cctvdata = $.parseJSON(a.response);
				$("#cctvInfo").html(bindingCCTVDate(cctvdata.msg));
				os('success', "获取cctv资料成功！", '')
			} else {
				os('error', "该CCTV数据远程系统正在占用，请稍后再试！", '')
			}
		});
		$("#cctvInfoTab").show()
	} else {
		$("#cctvInfoTab").hide()
	}
}
function flytoByLineHole(d, f) {
	let ofeature = ioclayer.getSource().getFeatureById("ol_bz");
	if (ofeature != null) {
		try {
			ioclayer.getSource().removeFeature(ofeature)
		} catch (e) { }
	}
	if (f == 1) {
		$.each(holdListData.response.lineDateMoldes, function (i, a) {
			if (a.lineID == d) {
				var b = (viewer.camera.positionCartographic.height);
				flyTo(a.cCoorWgsX, a.cCoorWgsY, b);
				if (typeof (map) != 'undefined') map.centerAndZoom(new BMapGL.Point(a.dbCoor[0], a.dbCoor[1]), 21);
				if (typeof (olMap) != 'undefined') {
					olMap.getView().setCenter([a.cCoorWgsX + lngval, a.cCoorWgsY + latval]);
					olMap.getView().setZoom(21.703693552114576);
					var c = new ol.Feature({
						geometry: new ol.geom.Point([a.cCoorWgsX + lngval, a.cCoorWgsY + latval])
					});
					c.setId("ol_bz");
					c.setStyle(new ol.style.Style({
						image: new ol.style.Icon({
							src: '../img/ioc_point.png',
							size: [35, 35]
						})
					}));
					ioclayer.getSource().addFeature(c)
				}
				return false
			}
		})
	} else {
		$.each(holdListData.response.lineDateMoldes, function (i, a) {
			if (a.sholeID == d || a.eholeID == d) {
				var b = (viewer.camera.positionCartographic.height);
				flyTo(a.cCoorWgsX, a.cCoorWgsY, b);
				if (typeof (map) != 'undefined') map.centerAndZoom(new BMapGL.Point(a.dbCoor[0], a.dbCoor[1]), 21);
				if (typeof (olMap) != 'undefined') {
					olMap.getView().setCenter([a.cCoorWgsX + lngval, a.cCoorWgsY + latval]);
					olMap.getView().setZoom(21.703693552114576);
					var c = new ol.Feature({
						geometry: new ol.geom.Point([a.cCoorWgsX + lngval, a.cCoorWgsY + latval])
					});
					c.setId("ol_bz");
					c.setStyle(new ol.style.Style({
						image: new ol.style.Icon({
							src: '../img/ioc_point.png',
							size: [35, 35]
						})
					}));
					ioclayer.getSource().addFeature(c)
				}
				return false
			}
		})
	}
}
function removeFTcolor() {
	try {
		var a = $("#ftLineckbox").val().split(',');
		var b = $("#ftLineckbox").attr('data-line');
		for (var i = 0; i < a.length; i++) {
			if (a[i] != "") {
				var c = a[i].split('$')[1];
				if (b === "WS") {
					try {
						var d = linePrimitive.getGeometryInstanceAttributes(a[i]);
						d.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK)
					} catch (e) { }
					addcolorForBD(c, '#ff50ff')
				} else {
					try {
						var d = linePrimitive.getGeometryInstanceAttributes(a[i]);
						d.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED)
					} catch (e) { }
					addcolorForBD(c, '#881212')
				}
			}
		}
		var f = $("#syLineckbox").val().split(',');
		var b = $("#syLineckbox").attr('data-line');
		for (var i = 0; i < f.length; i++) {
			if (f[i] != "") {
				var c = f[i].split('$')[1];
				if (b === "WS") {
					try {
						var d = linePrimitive.getGeometryInstanceAttributes(f[i]);
						d.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DEEPPINK)
					} catch (e) { }
					addcolorForBD(c, '#ff50ff')
				} else {
					try {
						var d = linePrimitive.getGeometryInstanceAttributes(f[i]);
						d.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.DARKRED)
					} catch (e) { }
					addcolorForBD(c, '#881212')
				}
			}
		}
	} catch (e) { }
}
function ywEchatInit(a, b, c, d) {
	var e = echarts.init(document.getElementById(d));
	option = {
		title: {
			text: c,
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
		series: [{
			name: '管段数量',
			type: 'bar',
			data: [a, b]
		}]
	};
	e.setOption(option)
}
function frEchatInit(a, b, c, d) {
	var e = echarts.init(document.getElementById(d));
	option = {
		title: {
			text: c,
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
		series: [{
			name: '管段数量',
			type: 'bar',
			data: [a, b]
		}]
	};
	e.setOption(option)
}
function bindingCCTVDate(d) {
	var e = "http://106.53.90.211:8080/cctvImage/";
	var f = '';
	var g = '/cctv-ch/img/00001.png';
	if (d.items != null) {
		$.each(d.items, function (a, b) {
			var c = "";
			if (b.path == null || b.path.length <= 0) {
				b.path = ''
			} else if (a == 0) {
				g = e + b.path + ".png"
			}
			if (a == 0) {
				c = "▶"
			}
			f += '<tr onclick="tab3_tr(this)">' + '<td align="center"><a style="color: #fff;">' + c + '</a></td>' + '<td>' + b.dist + '</td>' + '<td>' + b.code + '</td>' + '<td>' + b.grade + '</td>' + '<td>' + b.location + '</td>' + '<td>' + b.picture + '</td>' + '<td>' + b.remarks + '</td>' + '<td style="display:none">' + b.path + '</td>' + '</tr>'
		})
	}
	if (f == "" || f.length <= 0) {
		f = '<tr onclick="tab3_tr(this)">' + '<td align="center"><a style="color: #fff;">▶</a></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td style="display:none"></td>' + '</tr>' + '<tr onclick="tab3_tr(this)">' + '<td align="center"><a></a></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td style="display:none"></td>' + '</tr>'
	}
	var h = "";
	if (d.value[3] != 0) h = '<div class="tishi">管段结构性缺陷等级为' + getkeyvlaue(d.sMEvaluate)[0] + ',' + getkeyvlaue(d.sMEvaluate)[1] + ',' + getkeyvlaue(d.sEvaluate)[1] + '。</div>';
	var i = "";
	if (d.value[8] != 0) i = '<div class="tishi">管段功能性缺陷等级为' + getkeyvlaue(d.yEvaluate)[0] + ',' + getkeyvlaue(d.yMEvaluate)[1] + ',' + getkeyvlaue(d.yEvaluate)[1] + '。</div>';
	var j = '<div class="tishi">管段修复等级为' + getkeyvlaue(d.rIEvaluate)[0] + ',' + getkeyvlaue(d.rIEvaluate)[1] + '；养护等级为' + getkeyvlaue(d.mIEvaluate)[0] + ',' + getkeyvlaue(d.mIEvaluate)[1] + '。</div>';
	let videoname;
	if (areid == 1) {
		videoname = d.video.replace(/深圳/g, '佛山')
	} else {
		videoname = d.video
	}
	var k = '<table id="tab1" class="cesium-infoBox-defaultTable">' + '<tbody><tr>' + '<td  align="right">录像文件：</td>' + '<td  align="center" id="videoid">' + videoname + '</td>' + '</tr>' + '<tr>' + '<td align="right">检测方向：</td>' + '<td align="center" id="direction">' + d.direction + '</td>' + '<td align="right">检测日期：</td>' + '<td align="center" id="date">' + d.date + '</td>' + '</tr>' + '</tbody></table>' + '<table id="tab2">' + '<tbody><tr height="30px">' + '<td style="text-indent:10px;">视频</td>' + '<td style="text-indent:10px;">图片</td>' + '</tr>' + '<tr align="center">' + "<td><img src='/img/ioc_cctvs.png' title='点击播放CCTV' onclick='PlayCCTV(&#x27;" + d.video + "&#x27;)'  style='width: 240px;'></td>" + '<td><img id="image" src="' + g + '" title="图片浏览" onclick="imgset(this)"  style="width: 240px;"></td>' + '</tr>' + '</tbody></table><div class="clear"></div>' + '<div id="itemMemu">' + '<div style="color: #ff6767;">记录数据</div>' + '</div>' + '<div id="showItem">' + '<table id="tab3">' + '<thead>' + '<tr height="30px">' + '<th width="4%" rowspan="2"></th>' + '<th width="12%" rowspan="2">距离(m)</th>' + '<th width="12%" rowspan="2">缺陷代码</th>' + '<th width="12%" rowspan="2">等级</th>' + '<th width="12%" rowspan="2">位置</th>' + '<th width="12%" rowspan="2">照片序号</th>' + '<th width="36%" rowspan="2">备注</th>' + '</tr>' + '</thead>' + '<tbody id="pipeItem">' + f + '</tbody>' + '</table>' + '</div>' + '<input type="file" id="file1" accept="video/*" style="display:none" onchange="file1change(this)"><input type="file" id="file2" accept="image/*" style="display:none">' + '<div class="footerShell">' + '<div class="footer">' + '<div>' + '<div class="layui-card-header" style="color: #ff6767;">管段分析</div>' + '</div>' + h + i + j + '</div>' + '</div>';
	return k
}
function getkeyvlaue(a) {
	var b = [];
	for (var c in a) {
		b[0] = c;
		b[1] = a[c]
	}
	return b
}
function imgset(a) {
	var b = $(a).attr("src");
	layer.open({
		type: 1,
		title: false,
		closeBtn: 0,
		area: '350px',
		skin: 'layui-layer-nobg',
		shadeClose: true,
		content: '<div id="tong"><img style="width:350px;" src="' + b + '"></div>'
	})
}
function file1change(a) {
	if (!a.files || !a.files[0]) return false;
	var b = getURL(a.files[0]);
	$("#video").attr("src", b);
	$("#video").attr("poster", "");
	a.value = ""
}
function getURL(a) {
	var b = null;
	if (window.createObjectURL != undefined) b = window.createObjectURL(a);
	else if (window.URL != undefined) b = window.URL.createObjectURL(a);
	else if (window.webkitURL != undefined) b = window.webkitURL.createObjectURL(a);
	return b
}
function tab3_tr(a) {
	var b = "http://106.53.90.211:8080/cctvImage/";
	$("#tab3 tbody tr a").text("");
	$(a).find("td:eq(0) a").text("▶");
	var c = $(a).find("td:last").text();
	if (c != "" && c.length < 40) $("#image").attr("src", b + c + ".png");
	else $("#image").attr("src", "/cctv-ch/img/00001.png")
}
function dbvideo(a) {
	$("#file1").click()
}
function video(a) {
	if ($(a).attr("src") != undefined && $(a).attr("src") != "") a.paused ? a.play() : a.pause()
}
function olLayerTransformation(a, b, c) {
	olMap.removeLayer(a);
	for (var i = 0; i < oLLayerArr.length; i++) {
		if (oLLayerArr[i].className_.indexOf("pipe") >= 0) {
			oLLayerArr.splice(i, 1);
			break
		}
	}
	let params = {
		'FORMAT': format,
		'VERSION': '1.1.1',
		"LAYERS": c,
		"exceptions": 'application/vnd.ogc.se_inimage',
		"viewparams": "areid:" + areid + ";pipetypes:" + b,
	};
	let newSource = a.getSource();
	newSource.updateParams(params);
	a.setSource(newSource);
	oLLayerArr.push(a);
	olMap.addLayer(a)
}
function createPoint(a) {
	var b = viewer.entities.add({
		position: a,
		point: {
			color: Cesium.Color.WHITE,
			pixelSize: 5,
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
		}
	});
	floatingPointArr.push(b);
	return b
}
function drawShape(b, c) {
	if (c === 'line') {
		shape = viewer.entities.add({
			polyline: {
				positions: b,
				clampToGround: true,
				width: 3
			}
		})
	} else if (c === 'polygon') {
		shape = viewer.entities.add({
			polygon: {
				hierarchy: b,
				material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7))
			}
		})
	} else if (c === 'circle') {
		var d = typeof b.getValue === 'function' ? b.getValue(0) : b;
		shape = viewer.entities.add({
			position: activeShapePoints[0],
			name: 'Blue translucent, rotated, and extruded ellipse with outline',
			type: 'Selection tool',
			ellipse: {
				semiMinorAxis: new Cesium.CallbackProperty(function () {
					var r = Math.sqrt(Math.pow(d[0].x - d[d.length - 1].x, 2) + Math.pow(d[0].y - d[d.length - 1].y, 2));
					return r ? r : r + 1
				}, false),
				semiMajorAxis: new Cesium.CallbackProperty(function () {
					var r = Math.sqrt(Math.pow(d[0].x - d[d.length - 1].x, 2) + Math.pow(d[0].y - d[d.length - 1].y, 2));
					return r ? r : r + 1
				}, false),
				material: Cesium.Color.BLUE.withAlpha(0.5),
				outline: true
			}
		})
	} else if (c === 'rectangle') {
		var e = typeof b.getValue === 'function' ? b.getValue(0) : b;
		shape = viewer.entities.add({
			name: 'Blue e',
			rectangle: {
				coordinates: new Cesium.CallbackProperty(function () {
					var a = Cesium.Rectangle.fromCartesianArray(e);
					return a
				}, false),
				material: Cesium.Color.RED.withAlpha(0.5)
			}
		})
	}
	return shape
}
function terminateShape(a) {
	activeShapePoints.pop();
	if (activeShapePoints.length) {
		drawShape(activeShapePoints, a)
	}
	viewer.entities.remove(floatingPoint);
	viewer.entities.remove(activeShape);
	floatingPoint = undefined;
	activeShape = undefined;
	activeShapePoints = []
}
function getInverseTransform() {
	let transform;
	let tmp = palaceTileset.root.transform;
	if ((tmp && tmp.equals(Cesium.Matrix4.IDENTITY)) || !tmp) {
		transform = Cesium.Transforms.eastNorthUpToFixedFrame(palaceTileset.boundingSphere.center)
	} else {
		transform = Cesium.Matrix4.fromArray(palaceTileset.root.transform)
	}
	return Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4())
}
function getOriginCoordinateSystemPoint(a, b) {
	let val = Cesium.Cartesian3.fromDegrees(a.lng, a.lat);
	return Cesium.Matrix4.multiplyByPoint(b, val, new Cesium.Cartesian3(0, 0, 0))
}
function createPlane(a, b, c) {
	let p1C3 = getOriginCoordinateSystemPoint(a, c);
	let p2C3 = getOriginCoordinateSystemPoint(b, c);
	let up = new Cesium.Cartesian3(0, 0, -10);
	let right = Cesium.Cartesian3.subtract(p2C3, p1C3, new Cesium.Cartesian3());
	let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
	normal = Cesium.Cartesian3.normalize(normal, normal);
	let planeTmp = Cesium.Plane.fromPointNormal(p1C3, normal);
	return Cesium.ClippingPlane.fromPlane(planeTmp)
}
function isClockWise(a) {
	if (a.length < 3) {
		return null
	}
	if (a[0] === a[a.length - 1]) {
		a = a.slice(0, a.length - 1)
	}
	let latMin = {
		i: -1,
		val: 90
	};
	for (let i = 0; i < a.length; i++) {
		let {
			lat
		} = a[i];
		if (lat < latMin.val) {
			latMin.val = lat;
			latMin.i = i
		}
	};
	let i1 = (latMin.i + a.length - 1) % a.length;
	let i2 = latMin.i;
	let i3 = (latMin.i + 1) % a.length;
	let v2_1 = {
		lat: a[i2].lat - a[i1].lat,
		lng: a[i2].lng - a[i1].lng
	};
	let v3_2 = {
		lat: a[i3].lat - a[i2].lat,
		lng: a[i3].lng - a[i2].lng
	};
	let result = v3_2.lng * v2_1.lat - v2_1.lng * v3_2.lat;
	return result === 0 ? (a[i3].lng < a[i1].lng) : (result > 0)
}
function CookieChoohtml(a) {
	if (areacode == "gd_sz_gm") {
		areid = 2;
		latval = -0.002863038721292;
		lngval = 0.0049005903307;
		lengtvalue = 24;
		mlengtvalue = 24
	} else if (areacode == "gd_fs") {
		areid = 1;
		latval = -0.0026169694041;
		lngval = 0.00544058017012;
		lengtvalue = 0;
		mlengtvalue = 0
	} else if (areacode == "gd_sz_sm") {
		areid = 0;
		lengtvalue = 0;
		mlengtvalue = 0;
		latval = -0.003045587501575;
		lngval = 0.00540591756882
	} else {
		areid = 1;
		latval = -0.0026169694041;
		lngval = 0.00544058017012;
		lengtvalue = 0;
		mlengtvalue = 0
	}
	a && a(initCesium)
}
function initlocation() {
	if (areacode == "gd_sz_gm") {
		flyTo(113.94314303246384, 22.746454084801524, 730.0222897488);
		olMap.getView().setCenter([113.94314303246384, 22.746454084801524]);
		olMap.getView().setZoom(17.404315028416946);
		try {
			map.centerAndZoom(new BMapGL.Point(113.93043624568712, 22.78495878251252, 21))
		} catch (e) { }
	} else if (areacode == "gd_fs") {
		flyTo(113.08343495207401, 22.949133135126246, 730.0222897488);
		olMap.getView().setCenter([113.08343495207401, 22.949133135126246]);
		olMap.getView().setZoom(18.703693552114576);
		try {
			map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21)
		} catch (e) { }
	} else if (areacode == "gd_sz_sm") {
		flyTo(114.0555891520, 22.5413770432, 730.0222897488);
		olMap.getView().setCenter([114.05971697090581, 22.539934539441248]);
		olMap.getView().setZoom(17.404315028416946);
		try {
			map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21)
		} catch (e) { }
	}
}