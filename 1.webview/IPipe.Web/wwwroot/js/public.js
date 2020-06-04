function importHoles_bnt() {
    $("#fileUploadHole").click();
}
$("#fileUploadHole").change(function () {
    var loadindex = layer.load(1, {
        shade: [0.1, '#000']
    });
    console.log($("#fileUploadHole").val()); 
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
    console.log($("#fileUploadLine").val()); 
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


//toastr提示 toast-top-full-width\toast-top-center
function os(msgtype, msg, title, time, positionClass) {
    time = (time === undefined || time === "" || time === null === undefined ? '7000' : time); // a默认值为1
    positionClass = (positionClass === undefined || positionClass === "" || positionClass === null  ? 'toast-top-center' : positionClass); // b默认值为2
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "progressBar": true,
        "positionClass": positionClass,
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": time,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr[msgtype](msg, title)
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