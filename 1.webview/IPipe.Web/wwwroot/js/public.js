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


