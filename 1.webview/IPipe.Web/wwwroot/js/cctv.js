var geoserverURLIP = "https://map.imlzx.cn:8082/geoserver/MSDI/wms",
	ioclayer, latval, lngval, oLyhLayer, cctvvideoArr = [{
		linid: 0,
		devid: 1
	}, {
		linid: 0,
		devid: 2
	}, {
		linid: 0,
		devid: 3
	}, {
		linid: 0,
		devid: 4
	}],
	oLcctvLayer, bingmaplayerMap, olMap, rate, format = 'image/png',
	areacode = $.cookie('area'),
	areid = 1,
	oLLayerArr = [];
$(function () {
	CookieChoohtml();
	GetSearchList('8');
	$('#load').fadeOut(2);
	document.onclick = function (e) {
		$(".msdi-sys-menu-ul").hide()
	};
	$("#sys-muen").on("click", function (e) {
		if ($(".msdi-sys-menu-ul").css("display") == "none") {
			$(".msdi-sys-menu-ul").show()
		} else {
			$(".msdi-sys-menu-ul").hide()
		}
		e = e || event;
		stopFunc(e)
	});
	$('video').on('click', function () {
		let devid = $(this).attr('data-index');
		if ($("#ccvt-label" + devid).hasClass('cctv_active')) {
			return
		}
		for (var i = 1; i <= 4; i++) {
			$("#line_content" + i).hide()
		}
		$("#line_content" + devid).show();
		$(".ccvt-label").each(function () {
			let obj = $(this);
			if (obj.attr("id") == "ccvt-label" + devid) {
				obj.addClass('cctv_active')
			} else obj.removeClass('cctv_active')
		})
	});
	layui.use(['rate', 'element'], function () {
		rate = layui.rate;
		var b = layui.form;
		b.on('checkbox(layercheckShow)', function (a) {
			let obj = this;
			let idvalue = $(obj).attr("id");
			switch (idvalue) {
				case 'yhlayerbj':
					if (a.elem.checked) oLyhLayer.setVisible(true);
					else oLyhLayer.setVisible(false);
					break;
				case 'cctvlayerbj':
					if (a.elem.checked) oLcctvLayer.setVisible(true);
					else oLcctvLayer.setVisible(false);
					break;
				case 'dtlayerbj':
					if (a.elem.checked) bingmaplayerMap.setVisible(true);
					else bingmaplayerMap.setVisible(false);
					break;
				default:
					layer.msg("当前状态不支持该操作")
			}
		})
	});
	$("#search_bnt").on('click', function () {
		if ($("#keyword").val() === "") {
			layer.msg("请输入关键字");
			return
		}
		let kw = $("#keyword").val();
		GetSearchList(kw)
	});
	initOL()
});

function GetSearchList(d) {
	var e = layer.load(1, {
		shade: [0.1, '#000']
	});
	$.post("/home/getPipeLineList", {
		kw: d
	}, function (b, c) {
		layer.close(e);
		let htmlstr = "";
		if (!b.success) {
			htmlstr = '<span>沒有找到相关管线...</span>';
			layer.msg(b.msg)
		} else {
			$.each(b.response, function (i, a) {
				htmlstr += '<div class="list__item" onclick="playcctv(' + a.id + ',&#x27;' + a.eNo + '&#x27;)">' + '<div class="list__item-content">' + '<div class="list__item-title">' + a.eNo + '</div>' + '<div class="list__item-description">地址：' + a.addreess + '</div>' + '</div>' + '</div>'
			})
		}
		$("#res_list").html(htmlstr)
	}).error(function () {
		layer.close(e);
		layer.msg("网络错误！")
	})
}
function playcctv(c, d) {
	for (var i = 0; i < cctvvideoArr.length; i++) {
		if (cctvvideoArr[i].linid == c) {
			layer.msg('该数据正在' + cctvvideoArr[i].devid + '设备上播放！', {
				time: 2000,
				icon: 6
			});
			return
		}
	}
	layer.confirm('请选择在哪个播放器设备播放管段编号' + d + '的CCTV？', {
		btn: ['取消', '1号设备', '2号设备', '3号设备', '4号设备'],
		btn3: function (a, b) {
			setplaycctv(c, 2)
		},
		btn4: function (a, b) {
			setplaycctv(c, 3)
		},
		btn5: function (a, b) {
			setplaycctv(c, 4)
		}
	}, function () {
		layer.msg('取消成功', {
			icon: 1
		})
	}, function () {
		setplaycctv(c, 1)
	})
}
function setplaycctv(g, h) {
	var j = layer.load(1, {
		shade: [0.1, '#000']
	});
	$.post("/home/getLineCCTVdata", {
		id: g
	}, function (c, d) {
		layer.close(j);
		let htmlstr = "";
		if (!c.success) {
			htmlstr = '<span>沒有找到相关管线...</span>';
			layer.msg(c.msg);
			return
		} else {
			let linemode = c.response;
			if (linemode.classType === "WS") linemode.classType = "污水管";
			else linemode.classType = "雨水管";
			htmlstr = '<p><span>管段编号：</span>' + linemode.lno + '<span></span></p>' + '<p><span>起始井编号：</span><span>' + linemode.spoint + '</span></p>' + '<p><span>结束井编号：</span><span>' + linemode.epoint + '</span></p>' + '<p><span>排水类型：</span><span>' + linemode.classType + '</span></p>' + '<p><span>管段材料：</span><span>' + linemode.material + '</span></p>' + '<p><span>管段大小：</span><span>' + linemode.pSize + '</span></p>' + '<p><span>填埋方式：</span><span>' + linemode.emBed + '</span></p>' + '<p><span>所属单位：</span><span>' + linemode.belong + '</span></p>' + '<p><span>所在位置：</span><span>' + linemode.address + '</span></p>' + '<p><span>隐患信息：</span><span class="mark_red">' + linemode.yhcontent + '</span></p>';
			$("#cctvvideo_lno" + h).html("管段编号：" + linemode.lno);
			if (linemode.isAnyCCTV) {
				let colorvlue = "#008000";
				if (linemode.grade == 2) colorvlue = '#FFFF00';
				else if (linemode.grade == 3) colorvlue = '#EE82E';
				else if (linemode.grade == 4) colorvlue = '#FF0000';
				rate.render({
					elem: '#video' + h + '_grade',
					length: 4,
					value: linemode.grade,
					readonly: true,
					theme: colorvlue,
					text: true,
					setText: function (a) {
						var b = {
							'1': '（Ⅰ级）',
							'2': '（Ⅱ级）',
							'3': '（Ⅲ级）',
							'4': '（Ⅳ级）'
						};
						this.span.text(b[a] || (a + "星"))
					}
				});
				try {
					let cctvjson = JSON.parse(linemode.cctvJsonStr);
					document.getElementById("video" + h).src = "https://image.imlzx.cn/cctv/" + cctvjson.msg.video + ".mp4";
					document.getElementById("video" + h).play();
					setTimeout(function () {
						let _video = document.getElementById("video" + h);
						if (_video.paused) {
							layer.msg('视频文件或已被锁定,无法播放', {
								icon: 4
							})
						}
					}, 3000)
				} catch (e) {
					layer.msg('视频文件或已被锁定', {
						icon: 4
					})
				}
				for (var i = 0; i < cctvvideoArr.length; i++) {
					if (cctvvideoArr[i].devid == h) {
						cctvvideoArr[i].linid = g;
						break
					}
				}
				let ofeature = ioclayer.getSource().getFeatureById("cctv" + h);
				if (ofeature != null) {
					try {
						ioclayer.getSource().removeFeature(ofeature)
					} catch (e) { }
				}
				let clat = linemode.clat + lngval;
				let clng = linemode.clng + latval;
				var f = new ol.Feature({
					geometry: new ol.geom.Point([clat, clng])
				});
				f.setId("cctv" + h);
				olMap.getView().setCenter([clat, clng]);
				olMap.getView().setZoom(22);
				f.setStyle(new ol.style.Style({
					image: new ol.style.Icon({
						src: '../img/icon_cctv' + h + '.png',
						size: [35, 35],
						anchorXUnits: 'pixels',
						anchorYUnits: 'pixels',
						opacity: 0.75,
					})
				}));
				ioclayer.getSource().addFeature(f)
			}
		}
		for (var i = 1; i <= 4; i++) {
			if (i != h) {
				$("#line_content" + i).hide()
			}
		}
		$("#line_content" + h).html(htmlstr);
		$("#line_content" + h).show()
	}).error(function () {
		layer.close(j);
		layer.msg("网络错误！");
		return
	});
	$(".ccvt-label").each(function () {
		let obj = $(this);
		if (obj.attr("id") == "ccvt-label" + h) {
			obj.addClass('cctv_active')
		} else obj.removeClass('cctv_active')
	})
}
function clearkw() {
	$("#keyword").val('');
	$("#res_list").html('')
}
function initOL() {
	var a = new ol.control.MousePosition({
		className: 'custom-mouse-position',
		target: document.getElementById('location'),
		coordinateFormat: ol.coordinate.createStringXY(5),
		undefinedHTML: '&nbsp;'
	});
	var b = new ol.control.Rotate({
		autoHide: false
	});
	ioclayer = new ol.layer.Vector({
		source: new ol.source.Vector(),
		zIndex: 20
	});
	oLLayerArr.push(ioclayer);
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
	var c = new ol.layer.Tile({
		id: "bzlayerMap",
		title: "天地图文字标注",
		zIndex: 3,
		visible: false,
		source: new ol.source.XYZ({
			url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=49ea1deec0ffd88ef13a3f69987e9a63'
		})
	});
	oLLayerArr.push(c);
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
		}).extend([a, b]),
		target: 'cctvmap',
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
	IDMSclear()
}
function olMouseEvents() {
	olMap.getView().on('change:resolution', function (a) { });
	olMap.on("moveend", function (a) { });
	olMap.on('singleclick', function (d) {
		IDMSclear();
		let dx = parseFloat(d.coordinate[0]);
		let dy = parseFloat(d.coordinate[1]);
		let view = olMap.getView();
		let viewResolution = view.getResolution();
		let source = oLpipeAllLayer.get('visible') ? oLpipeAllLayer.getSource() : null;
		if (source != null) {
			let url = source.getFeatureInfoUrl(d.coordinate, viewResolution, view.getProjection(), {
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
						if (isAnypoint) {
							showlayername = 'MSDI:ys_show_pipehole';
							featuresData = b.features[Anypointi]
						} else if (!isAnypoint && isAnyline) {
							showlayername = 'MSDI:ys_show_pipeline';
							featuresData = b.features[Anylinei];
							playcctv(featuresData.properties.mysqlid, featuresData.properties.lno)
						}
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
function stopFunc(e) {
	e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
}
function switchcity(a) {
	$.cookie('area', null);
	$.cookie('area', a);
	layer.msg("却换成功，正在跳转页面");
	window.setTimeout("window.location=''", 2000)
}
function showBox(a, b, c) {
	a = a || "信息";
	parent.layer.open({
		title: a,
		type: 2,
		area: c || ['90%', '90%'],
		fix: false,
		maxmin: true,
		content: b
	})
}
function initlocation() {
	var a = $.cookie('area');
	if (a == "gd_sz_gm") {
		flyTo(113.94314303246384, 22.746454084801524, 730.0222897488);
		try {
			map.centerAndZoom(new BMapGL.Point(113.93043624568712, 22.78495878251252, 21))
		} catch (e) { }
	} else if (a == "gd_fs") {
		flyTo(113.08343495207401, 22.949133135126246, 730.0222897488);
		try {
			map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21)
		} catch (e) { }
	} else if (a == "gd_sz_sm") {
		flyTo(114.0555891520, 22.5413770432, 730.0222897488);
		try {
			map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21)
		} catch (e) { }
	}
}
function CookieChoohtml() {
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
}
function enterFullscreen() {
	var a = document.documentElement;
	if (a.requestFullscreen) {
		a.requestFullscreen()
	} else if (a.mozRequestFullScreen) {
		a.mozRequestFullScreen()
	} else if (a.webkitRequestFullScreen) {
		a.webkitRequestFullScreen()
	} else if (a.msRequestFullscreen) {
		a.msRequestFullscreen()
	}
}
function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen()
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen()
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen()
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen()
	}
}
function IDMSclear() {
	console.clear()
}