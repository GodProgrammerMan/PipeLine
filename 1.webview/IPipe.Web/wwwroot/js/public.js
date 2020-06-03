// 上传Excel
var importHole = function () {
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
        success: function (data) {
            layer.close(loadindex);
            if (data.response) {
                os('success', data.msg,'');
            } else {
                os('error', data.msg, '');
            }
        },
        error: function (erro) {
            layer.close(loadindex);
            os('error', '请求出错了，请刷新页面后重试！', '');
        }
    });
}
// 上传Excel
var importLine = function () {
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
            layer.close(loadindex);
            if (data.response) {
                os('success', data.msg, '');
            } else {
                os('error', data.msg, '');
            }
        },
        error: function (erro) {
            layer.close(loadindex);
            os('error', '请求出错了，请刷新页面后重试！', '');
        }
    });
}

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