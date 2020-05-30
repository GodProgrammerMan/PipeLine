function imgset(obj){
	var imgsrc = $(obj).attr("src");
	layer.open({
		  type: 1,
		  title: false,
		  closeBtn: 0,
		  area: '350px',
		  skin: 'layui-layer-nobg', //没有背景色
		  shadeClose: true,
		  content: '<div id="tong" class="hide" ><img style="width:350px;" src="'+imgsrc+'"></div>'
		});
}

function file1change(obj) {
	if (!obj.files || !obj.files[0])
		return false;
	var url = getURL(obj.files[0]);
	$("#video").attr("src", url);
	$("#video").attr("poster", "");
	obj.value = "";
}

/** 根据文件获取路径 */
function getURL(file) {
	var url = null;
	if (window.createObjectURL != undefined)
		url = window.createObjectURL(file);
	else if (window.URL != undefined)
		url = window.URL.createObjectURL(file);
	else if (window.webkitURL != undefined)
		url = window.webkitURL.createObjectURL(file);
	return url;
}

function tab3_tr(obj) {
	var path = "http://106.53.90.211:8080/cctvImage/";
	$("#tab3 tbody tr a").text("");
	$(obj).find("td:eq(0) a").text("▶");
	var value = $(obj).find("td:last").text();
	if (value != "" && value.length < 40)
		$("#image").attr("src", path + value + ".png");
	else
		$("#image").attr("src", "/cctv-ch/img/00001.png");
    
}

function dbvideo(obj) {
	$("#file1").click();
	console.log("");
}
function video(obj) {
	if ($(obj).attr("src") != undefined && $(obj).attr("src") != "")
		obj.paused ? obj.play() : obj.pause();
}