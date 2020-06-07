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
            //查询绑数据的开始
            console.log(data.response);
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
    flyTo(113.9190928199, 22.7842061118, 300);
}