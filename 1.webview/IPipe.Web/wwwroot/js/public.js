
$(function () {

    //删除加载动画
    $('#load').fadeOut(2);
    document.onclick = function (e) {
        $(".msdi-sys-menu-ul").hide();
    }

    $("#sys-muen").on("click", function (e) {
        if ($(".msdi-sys-menu-ul").css("display") == "none") {
            $(".msdi-sys-menu-ul").show();
        } else {
            $(".msdi-sys-menu-ul").hide();
        }
        e = e || event;
        stopFunc(e);
    });

    //box里的收缩与合并
    $(".leftMenuid_select_top").click(function () {
        let thisobj = $(this);
        if (thisobj.children("i").hasClass("layui-icon-triangle-d")) {
            thisobj.next(".select-chcke").slideUp(300, function () {
                thisobj.children("i").removeClass("layui-icon-triangle-d");
                thisobj.children("i").addClass("layui-icon-triangle-r"); 
            });
        } else {
            thisobj.next(".select-chcke").slideDown(300, function () {
                thisobj.children("i").removeClass("layui-icon-triangle-r");
                thisobj.children("i").addClass("layui-icon-triangle-d"); 
            }); 
        }
    });
    //box的收缩与合并
    $(".msdi-model-arrow").on("click", function () {
        var objbox = $(this).parent().parent();//Box对象
        var objcontent = $(this).parent().parent().find(".msdi-model-content");//content对象
        var objbar = $(this).parent().parent().find(".bar");//bar对象
        if ($(this).hasClass("closestatus")) {
            objcontent.slideDown(200, function () {
                objbox.css("height", objbox.attr('arr-height'));
                objbar.show();
            });
            $(this).removeClass("closestatus");
        } else {
            objcontent.slideUp(200, function () {
                objbox.attr('arr-height', objbox.css('height'));
                objbox.css("height", 44);
                objbar.hide();
            });
            $(this).addClass("closestatus");
        }
    });
    $(".msdi-model-close").on('click', function () {
        let obj = $(this).parent().parent();//找父级div对象
        let layermst = obj.attr("layermst");

        $(".map_box_tool li").each(function () {
            var _self = $(this);
            if (_self.attr("layermst") === layermst) {
                _self.removeClass('active');
                _self.find("a").removeClass('active');
                return false;
            }
        });
        obj.hide();
    });

    $(".map_box_tool li").on('click', function () {
        let _this = $(this);
        let layername = _this.attr("layermst");
        switch (layername) {
            case 'layerSelect'://图层
                if (_this.hasClass('active')) {
                    _this.removeClass('active');
                    _this.find("a").removeClass('active');
                    $("#leftMenuid").hide(); 
                } else {
                    _this.addClass('active');
                    _this.find("a").addClass('active');
                    $("#leftMenuid").show();
                    $("#leftMenuid").css("z-index", "10")
                }
                break;
            case 'wdlayerTool'://分屏工具
                if (_this.hasClass('active')) {
                    _this.removeClass('active');
                    _this.find("a").removeClass('active');
                    $("#wdlayerTool").hide();
                } else {
                    _this.addClass('active');
                    _this.find("a").addClass('active');
                    $("#wdlayerTool").show();
                    $("#wdlayerTool").css("z-index", "10");
                }
                break;
            case 'layerSearch'://搜索工具
                if (_this.hasClass('active')) {
                    _this.removeClass('active');
                    _this.find("a").removeClass('active');
                    $("#left-panel").hide();
                    $("#searchresbox").hide();
                } else {
                    _this.addClass('active');
                    _this.find("a").addClass('active');
                    $("#left-panel").show();
                    $("#layerTool").css("z-index", "10")
                }
                break;
            case 'fullScreen'://全屏工具
                if (_this.hasClass('active')) {
                    _this.removeClass('active');
                    _this.find("a").removeClass('active');
                    exitFullscreen();
                } else {
                    _this.addClass('active');
                    _this.find("a").addClass('active');
                    enterFullscreen();
                }
                break;
            default:
                layer.msg("正在开发中...");
        }
    })


    $(".msdi-model-header").mousedown(function (e) {
        $(".msdi-model-box").each(function () {
            $(this).css("z-index", "9");
        });
        var osmall = $(this).parent();//找父级div对象
        osmall.css("z-index", "10");
        /*用于保存小的div拖拽前的坐标*/
        osmall.startX = e.clientX - Number(osmall.css("left").replace("px", ""));
        osmall.startY = e.clientY - Number(osmall.css("top").replace("px", ""));
        document.onmousemove = function (e) {
            var e = e || window.event;
            var osLeft = e.clientX - osmall.startX + "px";
            var ostop = e.clientY - osmall.startY + "px";
            var maxTop = Number($("#map_main").css("height").replace("px", "")) - 80;
            var maxLeft = Number($("#map_main").css("width").replace("px", "")) - 200;
            osmall.css("left", osLeft);
            osmall.css("top", ostop);
            /*对于大的DIV四个边界的判断*/
            if ((e.clientX - osmall.startX) <= 3) {
                osmall.css("left", "3px");
            }
            if ((e.clientY - osmall.startY) <= 118) {
                osmall.css("top", "118px");
            }
            if ((e.clientX - osmall.startX) >= maxLeft) {
                osmall.css("left", maxLeft + "px");
            }
            if ((e.clientY - osmall.startY) >= maxTop) {
                osmall.css("top", maxTop + "px");
            }
        };
        /*鼠标的抬起事件,终止拖动*/
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    });

    $(".bar").mousedown(function (e) {
        var osmall = $(this).parent();//找父级div对象
        /*用于保存小的div拖拽前的坐标*/
        osmall.startX = e.clientX - Number(osmall.css("width").replace("px", ""));
        osmall.startY = e.clientY - Number(osmall.css("height").replace("px", ""));
        document.onmousemove = function (e) {
            var e = e || window.event;
            var width = e.clientX - osmall.startX + "px";
            var height = e.clientY - osmall.startY + "px";
            osmall.css("width", width);
            osmall.css("height", height);
            /*对于大的DIV四个边界的判断*/
            if ((e.clientX - osmall.startX) <= 100) {
                osmall.css("width", 100);
            }
            if ((e.clientY - osmall.startY) <= 80) {
                osmall.css("height", 80);
            }
            if ((e.clientX - osmall.startX) >= 1600) {
                osmall.css("width", 1600);
            }
            if ((e.clientY - osmall.startY) >= 800) {
                osmall.css("height", 800);
            }
        };
        /*鼠标的抬起事件,终止拖动*/
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    });


});

function stopFunc(e) {
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
}
//城市切换
function switchcity(citycoed) {
    //先执行去掉
    $.cookie('area', null);
    //在添加
    $.cookie('area', citycoed);
    //然后提示成功、跳转页面
    layer.msg("却换成功，正在跳转页面");
    window.setTimeout("window.location=''", 2000);
}
function kwColse() {
    $("#sole-input").val("")
}

function searchKW() {
    $("#result").hide();
    var kw = $("#sole-input").val();
    if (kw === "") {
        os('warning', '关键字为空！', '');
        return;
    }
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });
    $.post("/home/getQueryLineHolesDate", { kw: kw}, function (data, status) {
        layer.close(loadindex);
        if (!data.success) {
            os('error', data.msg, '');
        } else {
            os('success', data.msg, '');
            $("#searchresbox").show();
            // 查询绑数据的开始
            var context = "";
            for (var i = 0; i < data.response.length; i++) {
                var item = data.response[i];
                if (item.dataType == 1) {
                    context += '<li onclick="flytoByLineHole(' + item.id + ',1)"><div class="search-div search-res-l"><img src="/img/定位.png" /></div><div class="search-div search-res-c"><div class="search-res-c-top"><span>' + item.eNo + '</span></div><div class="search-res-c-c"><span>隐患状态：暂无隐患</span></div<div class="search-res-c-f"><span>位置：' + item.addreess + '</span></div></div>' +
                                    '<div class="search-div search-res-r">'+
                                        '<img src="/img/ioc_sgd.png" />'+
                                    '</div>'+
                                '</li>';
                } else {
                    context += '<li onclick="flytoByLineHole(' + item.id + ',2)"><div class="search-div search-res-l"><img src="/img/定位.png" /></div><div class="search-div search-res-c"><div class="search-res-c-top"><span>'+item.eNo+'</span></div><div class="search-res-c-c"><span>隐患状态：暂无隐患</span></div<div class="search-res-c-f"><span>位置：' + item.addreess +'</span></div></div>'+
                                   '<div class="search-div search-res-r">'+
                                        '<img src="/img/ioc_sgj.png" />'+
                                   '</div>'+
                              '</li>';
                }

            }
            $("#search-res-ul").html(context);
        }
    }).error(function () { layer.close(loadindex); os('error', data.msg, '请求出错了，请刷新页面后重试！'); });
}

function importHoles_bnt() {
    $("#fileUploadHole").click();
}
$("#fileUploadHole").change(function () {
    var loadindex = layer.load(1, {
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
        success: function (data, status) {
            layer.close(loadindex);
            var datastr = $(data).find("body").text();
            var jsondata = $.parseJSON(datastr);
            layer.close(loadindex);
            if (jsondata.response) {
                $("#bnt_importLine").removeClass("layui-btn-disabled");
                os('success', jsondata.msg, '');
            } else {
                os('error', jsondata.msg, '');
            }
        },
        error: function (erro) {
            layer.close(loadindex);
            os('error', '请求出错了，请刷新页面后重试！', '');
        }
    });
});
function importLine_bnt() {
    if ($("#bnt_importLine").hasClass("layui-btn-disabled")) {
        os('warning', '请先导入井点Excel！', '');
        return;
    }
    $("#fileUploadLine").click();
}
$("#fileUploadLine").change(function () {
    var loadindex = layer.load(1, {
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
        success: function (data) {
            var datastr = $(data).find("body").text(); 
            var jsondata = $.parseJSON(datastr);
            layer.close(loadindex);
            if (jsondata.response) {
                os('success', jsondata.msg, '');
            } else {
                os('error', jsondata.msg, '');
            }
        },
        error: function (erro) {
            layer.close(loadindex);
            os('error', '请求出错了，请刷新页面后重试！', '');
        }
    });
});


function showBox(titleStr, urlstr, area) {
    titleStr = titleStr || "信息";
    parent.layer.open({
        title: titleStr,
        type: 2,
        area: area || ['90%', '90%'],
        fix: false, //不固定
        maxmin: true,
        content: urlstr
    });
}

function initlocation() {
    var areacode = $.cookie('area');
    if (areacode == "gd_sz_gm") {
        flyTo(113.94314303246384, 22.746454084801524, 730.0222897488);
        try {
            map.centerAndZoom(new BMapGL.Point(113.93043624568712, 22.78495878251252, 21));
        } catch (e) {

        }
    } else if (areacode == "gd_fs") {
        flyTo(113.08343495207401, 22.949133135126246, 730.0222897488);
        try {
            map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21);  // 初始化地图,设置中心点坐标和地图级别
        } catch (e) {

        }
    } else if (areacode =="gd_sz_sm") {
        flyTo(114.0555891520, 22.5413770432, 730.0222897488);
        try {
            map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21);  // 初始化地图,设置中心点坐标和地图级别
        } catch (e) {

        }
    }
}
//根据cookie修改页面
function CookieChoohtml() {
    if (areacode == "gd_sz_gm") {
        areid = 2;
        latval = -0.002863038721292;
        lngval = 0.0049005903307;
        lengtvalue = 24;
        mlengtvalue = 24;
    } else if (areacode == "gd_fs") {
        areid = 1;
        latval = -0.0026169694041;
        lngval = 0.00544058017012;
        lengtvalue = 0;
        mlengtvalue = 0;
    } else if (areacode == "gd_sz_sm") {
        areid = 0;
        lengtvalue = 0;
        mlengtvalue = 0;
        latval = - 0.003045587501575;
        lngval = 0.00540591756882;
    }
}
function enterFullscreen() {
    var docElm = document.documentElement;
    //W3C
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    //FireFox
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    //Chrome等
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    //IE11
    else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
}
function exitFullscreen() {
    //W3C
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    //FireFox
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    //Chrome等
    else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    //IE11
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

//播放cctv视频
function PlayCCTV(srcurl) {
    $("#layercctv").show();
    $("#videoContainer").html("");
    /* 以下将定义视频插件常用的几个控件 */
    // 实例化一个“下一个”按钮控件
    var nextControl = new Super.NextControl()
    // 实例化一个倍速控件
    var Dbspeen = new Super.DbspeenControl()
    // 实例化一个弹幕输入框控件
    var BarrageControl = new Super.BarrageControl()
    // 实例化一个全屏按钮控件
    var fullScreenControl = new Super.FullScreenControl()
    // 实例化视频播放资源
    var source = new Super.VideoSource({
        // type: 视频类型 mp4:可播放浏览器支持的常见格式的视频文件(mp4/ogg/webm) m3u8: 可播放Hls形式推流直播视频(***.m3u8) flv: 可播放flv视频
        // src: 视频路径，可以是本地路径亦可是网络路径
        type: 'mp4',
        src: 'https://image.imlzx.cn/cctv/' + srcurl+'.mp4'
    })

    /* 插件的常用配置参数 */
    var config = {
        // 是否自动播放（该功能受限于浏览器安全策略，可能会失效，解决思路为初始化时设置为静音，加载完毕后取消静音）
        autoplay: true,
        currentTime: 0, // 设置视频初始播放时间，单位为秒
        loop: false, // 是否循环播放
        muted: false, // 是否默认静音
        playbackRate: 1, // 视频默认播放速度
        poster: '', // 视频首帧图片路径
        volume: 0.5, // 视频默认音量 0-1
        showPictureInPicture: false, // 是否启用画中画模式按钮（>=Chrome10有效）
        source: source, // 为视频插件设置资源
        leftControls: [nextControl], // 在底部控件栏左侧插入 “下一个”按钮控件
        rightControls: [Dbspeen, fullScreenControl], // 在底部控件栏左侧插入 “倍速” 控件和 “全屏” 控件
        centerControls: [BarrageControl] // 在底部控件栏中间插入 “弹幕输入控件”
    }

    //初始化插件superVideo('videoContainer')请对应好html中的插件容器id.
    var video = new Super.Svideo('videoContainer', config)

    /* 以下是控件类常用的监听事件 */

    // 监听“下一个”按钮控件点击事件
    nextControl.addEventListener('click', function (event) {
        alert('click next menu !!!')
    })
    // 监听进入全屏模式后触发（点击进入全屏按钮）
    fullScreenControl.addEventListener('fullscreen', function (event) {
        console.log('is fullscreen !!!')
    })
    // 监听退出全屏模式后触发（点击退出全屏按钮）
    fullScreenControl.addEventListener('cancelfullscreen', function (event) {
        console.log('cancel fullscreen !!!')
    })
    // 监听发送弹幕输入框输入并发送弹幕后触发
    BarrageControl.addEventListener('send', function (event) {
        var value = event.target.option.value
        console.log('send ' + value)
    })

    /* 以下是video类常用的监听事件 */
    // 视频准备就绪
    video.addEventListener('ready', function () {
        console.log('is ready!')
    })
    // 开始播放
    video.addEventListener('play', function () {
        console.log('is play!')
    })
    // 暂停播放
    video.addEventListener('pause', function () {
        console.log('is pause!')
    })
    // 监听进入全屏模式后触发
    video.addEventListener('fullscreen', function (event) {
        console.log('is fullscreen !!!')
    })
    // 监听退出全屏模式后触发
    video.addEventListener('cancelfullscreen', function (event) {
        console.log('cancel fullscreen !!!')
    })

    /* 下面将演示弹幕类的用法 */

    // 初始化一个弹幕实例
    var barrage1 = new Super.Barrage('我是一条红色的超大号字体弹幕', {
        color: 'red',
        fontSize: 30
    })
    // 将该弹幕加入播放器插件
    //video.addBarrage(barrage1)

    // 还可以在弹幕中插入一些dom节点
    var vipDom = document.createElement('span')
    vipDom.innerHTML = 'V'
    vipDom.style.color = 'green'
    vipDom.style.fontSize = '20px'
    vipDom.style.fontWeight = '600'
    vipDom.style.marginRight = '4px'
    var barrage2 = new Super.Barrage('我是超级会员VIP', {
        color: 'orange',
        fontSize: 15,
        leftDom: vipDom // 将DOM插入弹幕左侧
    })
    //video.addBarrage(barrage2);
    //video.addBarrage('冲鸭~~~~~~');
    //video.addBarrage('奥里给！！！！！！');
}