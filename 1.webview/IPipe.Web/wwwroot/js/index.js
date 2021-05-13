var areacode = $.cookie('area');
$(function () {
    //删除加载动画
    $('#load').fadeOut(1000000);
    $.get("/home/getStatisticalAllDataData", { areacode: areacode}, function (data, status) {
        $('#load').remove();
        if (data.status == 200) {
            var res = data.response;
            //wscctvsum
            $("#wscctvsum").html(res.wscctvSum);
            $("#yscctvsum").html(res.yscctvSum);
            $("#holesum").html(res.pipeholeSum);
            $("#linesum").html(res.pipelineSum);
            $("#yhhole").html(res.yhpipehole);
            $("#yhline").html(res.yhpipeline);
            init_myChart1(res.holeTypeValues);
            init_myChart2(res.cctvStartList, res.cctvStartmodel, res.pipeTypeList);
            init_myChart3(res.linemtypeNameList,res.linemtypevalueList);
            init_myChart4(res.yhStateList, res.pipeTypeList, res.yhStartmodel);
            init_Chartarea(res.areaList, res.areamaxvalue);
        }
    });

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

function init_myChart1(data) {
    var myChart = echarts.init($("#char1")[0]);
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center',
            textStyle: {
                color: '#ffffff',

            }
        },
        series: [
            {
                name: '井盖类型',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '15',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function init_myChart2(cctvStartList, cctvStartmodel, pipeTypeList) {
    var myChart = echarts.init($("#char2")[0]);

    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: { show: 'true', borderWidth: '0' },
        legend: {
            data: cctvStartList,
            textStyle: {
                color: '#ffffff',

            }
        },

        calculable: false,
        xAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#f2f2f2'],
                        width: 0,
                        type: 'solid'
                    }
                }

            }
        ],
        yAxis: [
            {
                type: 'category',
                data: pipeTypeList,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                }
            }
        ],
        series: [
            {
                name: 'Ⅰ级',
                type: 'bar',
                stack: '总数',
                itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
                data: cctvStartmodel.list1
            },
            {
                name: 'Ⅱ级',
                type: 'bar',
                stack: '总数',
                itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
                data: cctvStartmodel.list2
            },
            {
                name: 'Ⅲ级',
                type: 'bar',
                stack: '总数',
                itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
                data: cctvStartmodel.list3
            },
            {
                name: 'Ⅳ级',
                type: 'bar',
                stack: '总数',
                itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
                data: cctvStartmodel.list4
            }

        ]
    };

    myChart.setOption(option);
}

function init_myChart3(linemtypeNameList, linemtypevalueList) {
    var myChart = echarts.init($("#char3")[0]);

    var option = {
        grid: { show: 'true', borderWidth: '0' },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },

            formatter: function (params) {
                var tar = params[0];
                return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
            }
        },

        xAxis: [
            {
                type: 'category',
                splitLine: { show: false },
                data: linemtypeNameList,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }

            }
        ],
        yAxis: [
            {
                type: 'value',
                splitLine: { show: false },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        series: [

            {
                name: '类型数量',
                type: 'bar',
                stack: '总量',
                itemStyle: { normal: { label: { show: true, position: 'inside' } } },
                data: linemtypevalueList
            }
        ]
    };
    myChart.setOption(option);
}
function init_myChart4(yhStateList, pipeTypeList, yhStartmodel) {
    var myChart = echarts.init($("#char4")[0]);

    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: { show: 'true', borderWidth: '0' },
        legend: {
            data: yhStateList,
            textStyle: {
                color: '#ffffff',

            }
        },

        calculable: false,
        xAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#f2f2f2'],
                        width: 0,
                        type: 'solid'
                    }
                }

            }
        ],
        yAxis: [
            {
                type: 'category',
                data: pipeTypeList,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        width: 0,
                        type: 'solid'
                    }
                }
            }
        ],
        series: [
            {
                name: '未处理',
                type: 'bar',
                stack: '总量',
                itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
                data: yhStartmodel.list1
            },
            {
                name: '已处理',
                type: 'bar',
                stack: '总量',
                itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
                data: yhStartmodel.list2
            },
            {
                name: '处理中',
                type: 'bar',
                stack: '总量',
                itemStyle: { normal: { label: { show: true, position: 'insideRight' } } },
                data: yhStartmodel.list3
            }
        ]
    };

    myChart.setOption(option);
}

function init_Chartarea(areaList,maxvalue) {

    var myChart = echarts.init($("#map_div")[0]);
    myChart.showLoading();
    let jsonUlr = "fs.json";
    let cityName = "佛山市";
    if (areacode == "gd_sz_gm") {
        jsonUlr = "sz.json";
        cityName = "深圳市";
    }else if(areacode=="gd_sz_sm"){
        jsonUlr = "sz_sm.json";
        cityName = "福田区";
    } 
    $.get('/json/' + jsonUlr, function (geoJson) {

        myChart.hideLoading();

        echarts.registerMap(cityName, geoJson);

        myChart.setOption(option = {
            title: {
                text: cityName + '管线与隐患GIS分布地图',
                textStyle: {
                    fontSize: 20,
                    color: '#a0a8b9'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (data) {
                    let res = data.data;
                    return res.name + '<br/>隐患 ' + res.value + '(个) <br/>污水管 ' + res.wsvalue + '(个)<br/>雨水管 ' + res.ysvalue +'(个)';
                }
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    dataView: { readOnly: false },
                    restore: {},
                    saveAsImage: {}
                }
            },
            visualMap: {
                min: 0,
                max: maxvalue,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['lightskyblue', 'yellow', 'orangered']
                },
                textStyle: {
                    fontSize: 10,
                    color: '#a0a8b9'
                }
            },
            series: [
                {
                    name: cityName + '管线与隐患分布统计',
                    type: 'map',
                    mapType: cityName, // 自定义扩展图表类型
                    itemStyle: {
                        normal: { label: { show: true } },
                        emphasis: { label: { show: true } }
                    },
                    zoom: 1, //当前视角的缩放比例
                    roam: true, //是否开启平游或缩放
                    label: {
                        show: true,
                        normal: {
                            textStyle: {
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#fff'
                            }
                        }
                    },
                    data: areaList
                }
            ]
        });
    });
}

