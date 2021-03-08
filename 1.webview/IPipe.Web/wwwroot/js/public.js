
$(function () {
    //删除加载动画
    $('#load').fadeOut(2);
    CookieChoohtml();
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
        let layername = _this.attr("layermst")
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
            case 'layerTool'://分屏工具
                if (_this.hasClass('active')) {
                    _this.removeClass('active');
                    _this.find("a").removeClass('active');
                    $("#layerTool").hide();
                } else {
                    _this.addClass('active');
                    _this.find("a").addClass('active');
                    $("#layerTool").show();
                    $("#layerTool").css("z-index", "10")
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
            $("#result").show();
            // 查询绑数据的开始
            var context = "";
            for (var i = 0; i < data.response.length; i++) {
                var item = data.response[i];
                if (item.dataType == 1) {
                    context += "<div id='" + item.id + "' data-type='" + item.dataType + "' onclick='flytoByLineHole(" + item.id + ",1)'>管段：" + item.eNo + "</div>";
                } else {
                    context += "<div id='" + item.id + "' data-type='" + item.dataType + "' onclick='flytoByLineHole(" + item.id + ",2)'>管点：" + item.eNo + "</div>";
                }

            }
            $("#rValue").html(context);
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

function initCesium() {
    var areacode = $.cookie('area');
    if (areacode == "gd_sz_gm") {
        flyTo(113.9190282019, 22.7821815641, 300);
        try {
            map.centerAndZoom(new BMapGL.Point(113.93043624568712, 22.78495878251252, 21));
        } catch (e) {

        }
    } else {
        flyTo(113.07880230215, 22.9505263885339, 300);
        try {
            map.centerAndZoom(new BMapGL.Point(113.09084445075322, 22.95372333499535), 21);  // 初始化地图,设置中心点坐标和地图级别
        } catch (e) {

        }
    }
}
//根据cookie修改页面
function CookieChoohtml() {
    if (areacode == "gd_sz_gm") {
        areid = 1;
        $("#cityall").html("佛山数据");
    } else {
        areid = 2;
        $("#cityall").html("深圳数据");
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