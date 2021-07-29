$(function () {
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
	$(".leftMenuid_select_top").click(function () {
		let thisobj = $(this);
		if (thisobj.children("i").hasClass("layui-icon-triangle-d")) {
			thisobj.next(".select-chcke").slideUp(300, function () {
				thisobj.children("i").removeClass("layui-icon-triangle-d");
				thisobj.children("i").addClass("layui-icon-triangle-r")
			})
		} else {
			thisobj.next(".select-chcke").slideDown(300, function () {
				thisobj.children("i").removeClass("layui-icon-triangle-r");
				thisobj.children("i").addClass("layui-icon-triangle-d")
			})
		}
	});
	$(".msdi-model-arrow").on("click", function () {
		var a = $(this).parent().parent();
		var b = $(this).parent().parent().find(".msdi-model-content");
		var c = $(this).parent().parent().find(".bar");
		if ($(this).hasClass("closestatus")) {
			b.slideDown(200, function () {
				a.css("height", a.attr('arr-height'));
				c.show()
			});
			$(this).removeClass("closestatus")
		} else {
			b.slideUp(200, function () {
				a.attr('arr-height', a.css('height'));
				a.css("height", 44);
				c.hide()
			});
			$(this).addClass("closestatus")
		}
	});
	$(".msdi-model-close").on('click', function () {
		let obj = $(this).parent().parent();
		let layermst = obj.attr("layermst");
		$(".map_box_tool li").each(function () {
			var a = $(this);
			if (a.attr("layermst") === layermst) {
				a.removeClass('active');
				a.find("a").removeClass('active');
				return false
			}
		});
		obj.hide()
	});
	$(".map_box_tool li").on('click', function () {
		let _this = $(this);
		let layername = _this.attr("layermst");
		switch (layername) {
			case 'layerSelect':
				if (_this.hasClass('active')) {
					_this.removeClass('active');
					_this.find("a").removeClass('active');
					$("#leftMenuid").hide()
				} else {
					_this.addClass('active');
					_this.find("a").addClass('active');
					$("#leftMenuid").show();
					$("#leftMenuid").css("z-index", "10")
				}
				break;
			case 'wdlayerTool':
				if (_this.hasClass('active')) {
					_this.removeClass('active');
					_this.find("a").removeClass('active');
					$("#wdlayerTool").hide()
				} else {
					_this.addClass('active');
					_this.find("a").addClass('active');
					$("#wdlayerTool").show();
					$("#wdlayerTool").css("z-index", "10")
				}
				break;
			case 'layerSearch':
				if (_this.hasClass('active')) {
					_this.removeClass('active');
					_this.find("a").removeClass('active');
					$("#left-panel").hide();
					$("#searchresbox").hide()
				} else {
					_this.addClass('active');
					_this.find("a").addClass('active');
					$("#left-panel").show();
					$("#layerTool").css("z-index", "10")
				}
				break;
			case 'fullScreen':
				if (_this.hasClass('active')) {
					_this.removeClass('active');
					_this.find("a").removeClass('active');
					exitFullscreen()
				} else {
					_this.addClass('active');
					_this.find("a").addClass('active');
					enterFullscreen()
				}
				break;
			default:
				layer.msg("正在开发中...")
		}
	});
	$(".msdi-model-header").mousedown(function (e) {
		$(".msdi-model-box").each(function () {
			$(this).css("z-index", "9")
		});
		var f = $(this).parent();
		f.css("z-index", "10");
		f.startX = e.clientX - Number(f.css("left").replace("px", ""));
		f.startY = e.clientY - Number(f.css("top").replace("px", ""));
		document.onmousemove = function (e) {
			var e = e || window.event;
			var a = e.clientX - f.startX + "px";
			var b = e.clientY - f.startY + "px";
			var c = Number($("#map_main").css("height").replace("px", "")) - 80;
			var d = Number($("#map_main").css("width").replace("px", "")) - 200;
			f.css("left", a);
			f.css("top", b);
			if ((e.clientX - f.startX) <= 3) {
				f.css("left", "3px")
			}
			if ((e.clientY - f.startY) <= 118) {
				f.css("top", "118px")
			}
			if ((e.clientX - f.startX) >= d) {
				f.css("left", d + "px")
			}
			if ((e.clientY - f.startY) >= c) {
				f.css("top", c + "px")
			}
		};
		document.onmouseup = function () {
			document.onmousemove = null;
			document.onmouseup = null
		}
	});
	$(".bar").mousedown(function (e) {
		var c = $(this).parent();
		c.startX = e.clientX - Number(c.css("width").replace("px", ""));
		c.startY = e.clientY - Number(c.css("height").replace("px", ""));
		document.onmousemove = function (e) {
			var e = e || window.event;
			var a = e.clientX - c.startX + "px";
			var b = e.clientY - c.startY + "px";
			c.css("width", a);
			c.css("height", b);
			if ((e.clientX - c.startX) <= 100) {
				c.css("width", 100)
			}
			if ((e.clientY - c.startY) <= 80) {
				c.css("height", 80)
			}
			if ((e.clientX - c.startX) >= 1600) {
				c.css("width", 1600)
			}
			if ((e.clientY - c.startY) >= 800) {
				c.css("height", 800)
			}
		};
		document.onmouseup = function () {
			document.onmousemove = null;
			document.onmouseup = null
		}
	})
});

function stopFunc(e) {
	e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
}
function switchcity(a) {
	$.cookie('area', null);
	$.cookie('area', a);
	layer.msg("却换成功，正在跳转页面");
	window.setTimeout("window.location=''", 2000)
}
function kwColse() {
	$("#sole-input").val("")
}
function searchKW() {
	$("#result").hide();
	var e = $("#sole-input").val();
	if (e === "") {
		os('warning', '关键字为空！', '');
		return false
	}
	var f = layer.load(1, {
		shade: [0.1, '#000']
	});
	$.post("/home/getQueryLineHolesDate", {
		kw: e
	}, function (a, b) {
		layer.close(f);
		if (!a.success) {
			os('error', a.msg, '')
		} else {
			os('success', a.msg, '');
			$("#searchresbox").show();
			var c = "";
			for (var i = 0; i < a.response.length; i++) {
				var d = a.response[i];
				if (d.dataType == 1) {
					c += '<li onclick="flytoByLineHole(' + d.id + ',1)"><div class="search-div search-res-l"><img src="/img/定位.png" /></div><div class="search-div search-res-c"><div class="search-res-c-top"><span>' + d.eNo + '</span></div><div class="search-res-c-c"><span>隐患状态：暂无隐患</span></div<div class="search-res-c-f"><span>位置：' + d.addreess + '</span></div></div>' + '<div class="search-div search-res-r">' + '<img src="/img/ioc_sgd.png" />' + '</div>' + '</li>'
				} else {
					c += '<li onclick="flytoByLineHole(' + d.id + ',2)"><div class="search-div search-res-l"><img src="/img/定位.png" /></div><div class="search-div search-res-c"><div class="search-res-c-top"><span>' + d.eNo + '</span></div><div class="search-res-c-c"><span>隐患状态：暂无隐患</span></div<div class="search-res-c-f"><span>位置：' + d.addreess + '</span></div></div>' + '<div class="search-div search-res-r">' + '<img src="/img/ioc_sgj.png" />' + '</div>' + '</li>'
				}
			}
			$("#search-res-ul").html(c)
		}
	}).error(function () {
		layer.close(f);
		os('error', data.msg, '请求出错了，请刷新页面后重试！')
	})
}
function importHoles_bnt() {
	$("#fileUploadHole").click()
}
$("#fileUploadHole").change(function () {
	var e = layer.load(1, {
		shade: [0.1, '#000']
	});
	$.ajaxFileUpload({
		url: "/home/importHoleExcel",
		type: "POST",
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		timeout: 1900000,
		fileElementId: "fileUploadHole",
		success: function (a, b) {
			layer.close(e);
			var c = $(a).find("body").text();
			var d = $.parseJSON(c);
			layer.close(e);
			if (d.response) {
				$("#bnt_importLine").removeClass("layui-btn-disabled");
				os('success', d.msg, '')
			} else {
				os('error', d.msg, '')
			}
		},
		error: function (a) {
			layer.close(e);
			os('error', '请求出错了，请刷新页面后重试！', '')
		}
	})
});

function importLine_bnt() {
	if ($("#bnt_importLine").hasClass("layui-btn-disabled")) {
		os('warning', '请先导入井点Excel！', '');
		return false
	}
	$("#fileUploadLine").click()
}
$("#fileUploadLine").change(function () {
	var d = layer.load(1, {
		shade: [0.1, '#000']
	});
	$.ajaxFileUpload({
		url: "/home/importLineExcel",
		type: "POST",
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		timeout: 1900000,
		fileElementId: "fileUploadLine",
		success: function (a) {
			var b = $(a).find("body").text();
			var c = $.parseJSON(b);
			layer.close(d);
			if (c.response) {
				os('success', c.msg, '')
			} else {
				os('error', c.msg, '')
			}
		},
		error: function (a) {
			layer.close(d);
			os('error', '请求出错了，请刷新页面后重试！', '')
		}
	})
});

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
function PlayCCTV(c) {
	$("#layercctv").show();
	$("#videoContainer").html("");
	var d = new Super.NextControl();
	var e = new Super.DbspeenControl();
	var f = new Super.BarrageControl();
	var g = new Super.FullScreenControl();
	var h = new Super.VideoSource({
		type: 'mp4',
		src: 'https://image.imlzx.cn/cctv/' + c + '.mp4'
	});
	var i = {
		autoplay: true,
		currentTime: 0,
		loop: false,
		muted: false,
		playbackRate: 1,
		poster: '',
		volume: 0.5,
		showPictureInPicture: false,
		source: h,
		leftControls: [d],
		rightControls: [e, g],
		centerControls: [f]
	};
	var j = new Super.Svideo('videoContainer', i);
	d.addEventListener('click', function (a) {
		alert('click next menu !!!')
	});
	g.addEventListener('fullscreen', function (a) {
		console.log('is fullscreen !!!')
	});
	g.addEventListener('cancelfullscreen', function (a) {
		console.log('cancel fullscreen !!!')
	});
	f.addEventListener('send', function (a) {
		var b = a.target.option.value;
		console.log('send ' + b)
	});
	setTimeout(function () {
		let _video = $("#videoContainer video")[0];
		if (_video.paused) {
			layer.msg('视频文件或已被锁定,无法播放', {
				icon: 4
			})
		}
	}, 3000);
	j.addEventListener('ready', function () {
		console.log('is ready!')
	});
	j.addEventListener('play', function () {
		console.log('is play!')
	});
	j.addEventListener('pause', function () {
		console.log('is pause!')
	});
	j.addEventListener('fullscreen', function (a) {
		console.log('is fullscreen !!!')
	});
	j.addEventListener('cancelfullscreen', function (a) {
		console.log('cancel fullscreen !!!')
	});
	var k = new Super.Barrage('我是一条红色的超大号字体弹幕', {
		color: 'red',
		fontSize: 30
	});
	var l = document.createElement('span');
	l.innerHTML = 'V';
	l.style.color = 'green';
	l.style.fontSize = '20px';
	l.style.fontWeight = '600';
	l.style.marginRight = '4px';
	var m = new Super.Barrage('我是超级会员VIP', {
		color: 'orange',
		fontSize: 15,
		leftDom: l
	})
}