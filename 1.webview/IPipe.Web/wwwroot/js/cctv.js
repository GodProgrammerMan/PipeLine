
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
