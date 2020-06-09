using IPipe.Common.Helper;
using IPipe.IServices;
using IPipe.Model;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;

namespace IPipe.Web.Controllers
{
    public class HomeController : Controller
    {
        readonly Ipipe_holeServices _ipipe_HoleServices;
        readonly Ipipe_lineServices _ipipe_LineServices;
        readonly Ihidden_dangerServices _ihidden_DangerServices;
        List<CctvIDsModel> cctvIDList = new List<CctvIDsModel>() {
                new CctvIDsModel { cctvID = 95, grade = 1, LineID = 8947,lno ="WS2016B00701001473001474", cctvJsonStr="{\"msg\":{\"id\":95,\"no\":1,\"video\":\"深圳市_BWB83~BWB85_181115112206\",\"smanhole\":\"BWB83\",\"fmanhole\":\"BWB85\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.55\",\"fdepth\":\"2.63\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"400\",\"direction\":\"逆流\",\"pipelength\":\"26.38\",\"testlength\":\"24.91\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BWB83~BWB85\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":169,\"no\":1,\"dist\":\"0\",\"code\":\"\",\"grade\":\"0\",\"location\":\"\",\"picture\":\"照片1\",\"remarks\":\"无异常\",\"path\":\"AC5080A1-65F9-4772-A760-4BF630E64F4D\",\"pipe\":{\"id\":95,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"code\":\"200\"}"},
                new CctvIDsModel {cctvID = 96,grade = 2, LineID = 8932 ,lno ="WS2016B00701001475001476",cctvJsonStr="{\"msg\":{\"id\":96,\"no\":6,\"video\":\"深圳市_BYB19~EWB1428_181115103221\",\"smanhole\":\"BYB19\",\"fmanhole\":\"EWB1428\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.55\",\"fdepth\":\"2.55\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"逆流\",\"pipelength\":\"39.52\",\"testlength\":\"25.15\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BYB19~EWB1428\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":170,\"no\":1,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"408\",\"picture\":\"照片1\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"07075DDD-355F-4C91-9D01-3B4F4E1A2F5B\",\"pipe\":{\"id\":96,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":171,\"no\":2,\"dist\":\"2.2\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"804\",\"picture\":\"照片2\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"79B70652-3D3E-4542-8F42-DF7252BCF2E0\",\"pipe\":{\"id\":96,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":172,\"no\":3,\"dist\":\"4.1\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"804\",\"picture\":\"照片3\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"4DA9163F-705A-4A0D-9B1E-4F13993DB5A1\",\"pipe\":{\"id\":96,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":173,\"no\":4,\"dist\":\"6.5\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"804\",\"picture\":\"照片4\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"2D91EA0C-B719-4138-9B67-DB3F15594CA4\",\"pipe\":{\"id\":96,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[2.0,1.7875,0.0,2.0,0.09046052631578948,0.0,0.0,0.0,0.0,0.0,6.5,0.0],\"sEvaluate\":{\"Ⅱ\":\"管道缺陷明显超过一级，具有变坏的趋势\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅱ\":\"结构在短期内不会发生破坏现象，但应做修复计划\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":1.4,\"mi\":0.0},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 97, grade = 3,LineID = 8967,lno ="WS2016B00701001476001726",cctvJsonStr="{\"msg\":{\"id\":97,\"no\":10,\"video\":\"深圳市_BYB52~BYB47_181120150057\",\"smanhole\":\"BYB52\",\"fmanhole\":\"BYB47\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.65\",\"fdepth\":\"3.78\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"顺流\",\"pipelength\":\"29.7\",\"testlength\":\"22.25\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BYB52~BYB47\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":174,\"no\":1,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"3\",\"location\":\"804\",\"picture\":\"照片1\",\"remarks\":\"重度腐蚀—粗骨料或钢筋完全显露。\",\"path\":\"78C56C80-CAE7-44A8-A8A7-9545FF02E804\",\"pipe\":{\"id\":97,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":175,\"no\":2,\"dist\":\"12.47\",\"code\":\"CJ\",\"grade\":\"3\",\"location\":\"507\",\"picture\":\"照片2\",\"remarks\":\"沉积物厚度在管径的40%~50% 。\",\"path\":\"2892ADAD-6847-4B20-B1BB-90E0F397E659\",\"pipe\":{\"id\":97,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[5.0,5.5,0.0,5.5,0.03367003367003367,5.0,0.0,0.0,5.0,0.0,5.0,0.0],\"sEvaluate\":{\"Ⅲ\":\"管段缺陷严重，结构状况受到影响\"},\"yEvaluate\":{\"Ⅲ\":\"管道过流受阻比较严重，运行受到明显影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅲ\":\"结构在短期内可能发生破坏，应尽快修复\"},\"mIEvaluate\":{\"Ⅲ\":\"根据基础数据进行全面的考虑，应尽快处理\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":4.85,\"mi\":5.5},\"code\":\"200\"}"},
                new CctvIDsModel {cctvID = 98,grade = 1, LineID = 8966 ,lno ="WS2016B00701001350001726",cctvJsonStr="{\"msg\":{\"id\":98,\"no\":16,\"video\":\"深圳市_EWB1425~XH15-3_181120164918\",\"smanhole\":\"BWB1425\",\"fmanhole\":\"HX15-3\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.33\",\"fdepth\":\"3.56\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"800\",\"direction\":\"顺流\",\"pipelength\":\"27.59\",\"testlength\":\"21.88\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BWB1425~HX15-3\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":176,\"no\":1,\"dist\":\"0.01\",\"code\":\"CJ\",\"grade\":\"1\",\"location\":\"507\",\"picture\":\"照片1\",\"remarks\":\"沉积物厚度为管径的20%~30% 。\",\"path\":\"BF38396D-A968-4FF9-9636-70BCAC2F7BA9\",\"pipe\":{\"id\":98,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.0,0.0,0.0,0.0,0.0,0.5,0.0,0.0,0.5,0.0,0.0,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.4},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 99,grade = 3, LineID = 387,lno ="WS2016B00701001855001350",cctvJsonStr="{\"msg\":{\"id\":99,\"no\":11,\"video\":\"深圳市_BYB52~BYB55_181120151216、深圳市_BYB55~BYB52_181120152143\",\"smanhole\":\"BYB52\",\"fmanhole\":\"BYB55\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.74\",\"fdepth\":\"3.77\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"逆流\",\"pipelength\":\"21.6\",\"testlength\":\"9.37\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BYB52~BYB55\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":177,\"no\":1,\"dist\":\"9.31\",\"code\":\"ZW\",\"grade\":\"3\",\"location\":\"507\",\"picture\":\"照片1,正向\",\"remarks\":\"过水断面损失在25%~50%之间。\",\"path\":\"32416CF1-BAD5-459A-A684-6876FFAA74A8\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":178,\"no\":2,\"dist\":\"9.31\",\"code\":\"CJ\",\"grade\":\"1\",\"location\":\"507\",\"picture\":\"照片2,正向\",\"remarks\":\"沉积物厚度为管径的20%~30% 。\",\"path\":\"DBAD65E4-17A0-4DCC-BB6F-0EF8DEA4573C\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":179,\"no\":3,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"3\",\"location\":\"804\",\"picture\":\"照片3,正向\",\"remarks\":\"重度腐蚀—粗骨料或钢筋完全显露。\",\"path\":\"B411B22E-D3EE-49B7-9294-2C4D27579BDF\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":180,\"no\":4,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"3\",\"location\":\"804\",\"picture\":\"照片4,反向\",\"remarks\":\"重度腐蚀—粗骨料或钢筋完全显露。\",\"path\":\"F50DF43B-6FE8-4A1D-B6E3-B0A3F19B3B0D\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":181,\"no\":5,\"dist\":\"0.01\",\"code\":\"CJ\",\"grade\":\"2\",\"location\":\"507\",\"picture\":\"照片5,反向\",\"remarks\":\"沉积物厚度在管径的30%~40%之间。\",\"path\":\"60F8EE98-A30B-441F-9CEE-E101779171DF\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":182,\"no\":6,\"dist\":\"6.83\",\"code\":\"ZW\",\"grade\":\"3\",\"location\":\"507\",\"picture\":\"照片6,反向\",\"remarks\":\"过水断面损失在25%~50%之间。\",\"path\":\"19F437A3-6309-44B9-A115-9C6F3BC20C90\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[5.0,5.5,0.0,5.5,0.09259259259259259,5.0,0.0,0.0,5.0,0.0,10.0,0.0],\"sEvaluate\":{\"Ⅲ\":\"管段缺陷严重，结构状况受到影响\"},\"yEvaluate\":{\"Ⅲ\":\"管道过流受阻比较严重，运行受到明显影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅲ\":\"结构在短期内可能发生破坏，应尽快修复\"},\"mIEvaluate\":{\"Ⅲ\":\"根据基础数据进行全面的考虑，应尽快处理\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":4.85,\"mi\":5.5},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 100,grade = 2, LineID = 386,lno ="WS2016B00701001854001855",cctvJsonStr="{\"msg\":{\"id\":100,\"no\":3,\"video\":\"深圳市_BYB18~BYB8_181115095857\",\"smanhole\":\"BYB18\",\"fmanhole\":\"BYB8\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.63\",\"fdepth\":\"2.51\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"顺流\",\"pipelength\":\"47.39\",\"testlength\":\"45.73\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BYB18~BYB8\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":183,\"no\":1,\"dist\":\"0.66\",\"code\":\"PL\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片1\",\"remarks\":\"裂痕-当下列一个或多个情况存在时：1）在管壁上可见细裂痕；2）在管壁上由细裂缝处冒出少量沉积物；3）轻度剥落。\",\"path\":\"A73482FB-0AF1-4A71-AB89-749DF9477A86\",\"pipe\":{\"id\":100,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":184,\"no\":2,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片2\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"CE4B54E6-9028-478B-A4DC-C19EF20066D2\",\"pipe\":{\"id\":100,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":185,\"no\":3,\"dist\":\"4.68\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"405\",\"picture\":\"照片3\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"434D7E9E-CA04-4034-AFE5-2B9965447C0D\",\"pipe\":{\"id\":100,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":186,\"no\":4,\"dist\":\"6.54\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"405\",\"picture\":\"照片4\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"036A313E-B7F4-47F6-AE91-8511B115DC12\",\"pipe\":{\"id\":100,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[2.0,1.375,0.0,2.0,0.058029120067524795,0.0,0.0,0.0,0.0,0.0,5.0,0.0],\"sEvaluate\":{\"Ⅱ\":\"管道缺陷明显超过一级，具有变坏的趋势\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅱ\":\"结构在短期内不会发生破坏现象，但应做修复计划\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":1.4,\"mi\":0.0},\"code\":\"200\"}"},
                new CctvIDsModel {cctvID = 101,grade = 3, LineID = 385 ,lno ="WS2016B00701001758001854",cctvJsonStr="{\"msg\":{\"id\":101,\"no\":12,\"video\":\"深圳市_BYB55~BYB58_181120152956\",\"smanhole\":\"BYB55\",\"fmanhole\":\"BYB58\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.86\",\"fdepth\":\"3.63\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"逆流\",\"pipelength\":\"25.63\",\"testlength\":\"24.24\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BYB55~BYB58\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":187,\"no\":1,\"dist\":\"0.01\",\"code\":\"CJ\",\"grade\":\"2\",\"location\":\"507\",\"picture\":\"照片1\",\"remarks\":\"沉积物厚度在管径的30%~40%之间。\",\"path\":\"0B8640CA-050B-4740-8CAA-13406373981E\",\"pipe\":{\"id\":101,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":188,\"no\":2,\"dist\":\"14.6\",\"code\":\"PL\",\"grade\":\"1\",\"location\":\"1100\",\"picture\":\"照片2\",\"remarks\":\"裂痕-当下列一个或多个情况存在时：1）在管壁上可见细裂痕；2）在管壁上由细裂缝处冒出少量沉积物；3）轻度剥落。\",\"path\":\"52BBC5D4-F98A-46EE-82B8-7D642637F999\",\"pipe\":{\"id\":101,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":189,\"no\":3,\"dist\":\"19.8\",\"code\":\"BX\",\"grade\":\"2\",\"location\":\"804\",\"picture\":\"照片3\",\"remarks\":\"变形为管道直径的5%~15% 。\",\"path\":\"927ED662-6371-43EF-9BB4-801C26A12C53\",\"pipe\":{\"id\":101,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":190,\"no\":4,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"3\",\"location\":\"804\",\"picture\":\"照片4\",\"remarks\":\"重度腐蚀—粗骨料或钢筋完全显露。\",\"path\":\"E62514BA-27E1-4EF5-99EE-8E4E419ED4A4\",\"pipe\":{\"id\":101,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[5.0,2.75,0.0,5.0,0.06437768240343347,2.0,0.0,0.0,2.0,0.0,7.5,0.0],\"sEvaluate\":{\"Ⅲ\":\"管段缺陷严重，结构状况受到影响\"},\"yEvaluate\":{\"Ⅱ\":\"管道过流有一定的受阻，运行受影响不大\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅲ\":\"结构在短期内可能发生破坏，应尽快修复\"},\"mIEvaluate\":{\"Ⅱ\":\"没有立即进行处理的必要，但宜安排处理计划\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":4.5,\"mi\":3.1},\"code\":\"200\"}"},
                new CctvIDsModel {cctvID = 102,grade = 1, LineID = 8931 ,lno ="WS2016B00701001699001350",cctvJsonStr="{\"msg\":{\"id\":102,\"no\":2,\"video\":\"深圳市_BYB9~BYB9-1_181115121434\",\"smanhole\":\"BYB9\",\"fmanhole\":\"BYB9-1\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.57\",\"fdepth\":\"3.51\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"800\",\"direction\":\"逆流\",\"pipelength\":\"29.61\",\"testlength\":\"28.27\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BYB9~BYB9-1\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":191,\"no\":1,\"dist\":\"3.56\",\"code\":\"TL\",\"grade\":\"1\",\"location\":\"1100\",\"picture\":\"照片1\",\"remarks\":\"接口材料在管道内水平方向中心线上部可见。\",\"path\":\"D1EEDA81-D72D-47F1-AE16-11ECB3AC2223\",\"pipe\":{\"id\":102,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[1.0,1.1,0.0,1.1,0.03377237419790611,0.0,0.0,0.0,0.0,0.0,1.0,0.0],\"sEvaluate\":{\"Ⅱ\":\"管道缺陷明显超过一级，具有变坏的趋势\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.77,\"mi\":0.0},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 103,grade = 1, LineID = 351,lno ="WS2016B00701001853001854",cctvJsonStr="{\"msg\":{\"id\":103,\"no\":14,\"video\":\"深圳市_EWB1424~BYB5_181120160505\",\"smanhole\":\"BWB1424\",\"fmanhole\":\"BYB5\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.59\",\"fdepth\":\"2.62\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"800\",\"direction\":\"逆流\",\"pipelength\":\"51.12\",\"testlength\":\"49.06\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BWB1424~BYB5\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":192,\"no\":1,\"dist\":\"22.92\",\"code\":\"TL\",\"grade\":\"1\",\"location\":\"203\",\"picture\":\"照片1\",\"remarks\":\"接口材料在管道内水平方向中心线上部可见。\",\"path\":\"A66A8BC9-E3AF-44A0-B13A-F9CA3BB15399\",\"pipe\":{\"id\":103,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[1.0,1.1,0.0,1.1,0.019561815336463225,0.0,0.0,0.0,0.0,0.0,1.0,0.0],\"sEvaluate\":{\"Ⅱ\":\"管道缺陷明显超过一级，具有变坏的趋势\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.77,\"mi\":0.0},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 104,grade = 1, LineID = 8976,lno ="WS2016B00701001728001726",cctvJsonStr="{\"msg\":{\"id\":104,\"no\":15,\"video\":\"深圳市_EWB1424~EWB1425_181120163324\",\"smanhole\":\"BWB1424\",\"fmanhole\":\"BWB1425\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.52\",\"fdepth\":\"3.41\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"800\",\"direction\":\"顺流\",\"pipelength\":\"40.51\",\"testlength\":\"38.74\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BWB1424~BWB1425\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":193,\"no\":1,\"dist\":\"0\",\"code\":\"\",\"grade\":\"0\",\"location\":\"\",\"picture\":\"照片1\",\"remarks\":\"\",\"path\":\"B87B9F71-992C-4C7E-9EA7-38E2030FDBC5\",\"pipe\":{\"id\":104,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 105,grade = 1, LineID = 8975,lno ="WS2016B00701001727001728",cctvJsonStr="{\"msg\":{\"id\":105,\"no\":5,\"video\":\"深圳市_BYB18~BYB19_181115102407\",\"smanhole\":\"BYB18\",\"fmanhole\":\"BYB19\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.41\",\"fdepth\":\"2.63\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"逆流\",\"pipelength\":\"29.95\",\"testlength\":\"25.22\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BYB18~BYB19\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":194,\"no\":1,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"1001\",\"picture\":\"照片1\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"7706388C-0A94-41FA-92E4-843827E76887\",\"pipe\":{\"id\":105,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.5,0.55,0.0,0.55,0.033388981636060105,0.0,0.0,0.0,0.0,0.0,0.5,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.385,\"mi\":0.0},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 106,grade = 1, LineID = 383,lno ="WS2016B00701001888001703",cctvJsonStr="{\"msg\":{\"id\":106,\"no\":4,\"video\":\"深圳市_BYB8~BYB5_181115100922\",\"smanhole\":\"BYB8\",\"fmanhole\":\"BYB5\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.51\",\"fdepth\":\"2.77\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"顺流\",\"pipelength\":\"30.97\",\"testlength\":\"30.07\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BYB8~BYB5\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":195,\"no\":1,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片1\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"01F94ACD-1E0B-455F-8A7F-DD2268EAA144\",\"pipe\":{\"id\":106,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.5,0.55,0.0,0.55,0.03228931223764934,0.0,0.0,0.0,0.0,0.0,0.5,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.385,\"mi\":0.0},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 107,grade = 1, LineID =  8961,lno ="WS2016B00701001703001477",cctvJsonStr="{\"msg\":{\"id\":107,\"no\":13,\"video\":\"深圳市_BYB58~BYB62_181120154047\",\"smanhole\":\"BYB58\",\"fmanhole\":\"BYB62\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.82\",\"fdepth\":\"3.71\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"逆流\",\"pipelength\":\"22.22\",\"testlength\":\"21.08\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BYB58~BYB62\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":196,\"no\":1,\"dist\":\"0.01\",\"code\":\"CJ\",\"grade\":\"1\",\"location\":\"507\",\"picture\":\"照片1\",\"remarks\":\"沉积物厚度为管径的20%~30% 。\",\"path\":\"EBB26CF5-E5F8-4C54-A89E-88120A937380\",\"pipe\":{\"id\":107,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":197,\"no\":2,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片2\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"2952541F-47E6-45BC-B5A8-9FEA0CB42540\",\"pipe\":{\"id\":107,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.5,0.55,0.0,0.55,0.04500450045004501,0.5,0.0,0.0,0.5,0.0,0.5,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.385,\"mi\":0.4},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 108,grade = 2, LineID = 8974,lno ="WS2016B00701001725001727",cctvJsonStr="{\"msg\":{\"id\":108,\"no\":9,\"video\":\"深圳市_BWB82~BWB83_181115111526\",\"smanhole\":\"BWB82\",\"fmanhole\":\"BWB83\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.55\",\"fdepth\":\"2.71\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"400\",\"direction\":\"逆流\",\"pipelength\":\"22.87\",\"testlength\":\"24.95\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BWB82~BWB83\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":198,\"no\":1,\"dist\":\"0.94\",\"code\":\"SG\",\"grade\":\"1\",\"location\":\"607\",\"picture\":\"照片1\",\"remarks\":\"过水断面损失不大于15% 。\",\"path\":\"395DBB93-8EC3-47A3-995B-739F182D181D\",\"pipe\":{\"id\":108,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":199,\"no\":2,\"dist\":\"2.75\",\"code\":\"SG\",\"grade\":\"1\",\"location\":\"205\",\"picture\":\"照片2\",\"remarks\":\"过水断面损失不大于15% 。\",\"path\":\"F2B965FF-1D47-4960-85D8-55E1755427B9\",\"pipe\":{\"id\":108,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":200,\"no\":3,\"dist\":\"6.64\",\"code\":\"SG\",\"grade\":\"1\",\"location\":\"610\",\"picture\":\"照片3\",\"remarks\":\"过水断面损失不大于15% 。\",\"path\":\"6D83C89E-EBCB-480F-9F16-2437F82F2C92\",\"pipe\":{\"id\":108,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":201,\"no\":4,\"dist\":\"11.71\",\"code\":\"SG\",\"grade\":\"1\",\"location\":\"203\",\"picture\":\"照片4\",\"remarks\":\"过水断面损失不大于15% 。\",\"path\":\"645E90B8-9EF1-4EA1-A483-84CAE4586F81\",\"pipe\":{\"id\":108,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":202,\"no\":5,\"dist\":\"6.64\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"1001\",\"picture\":\"照片5\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"0F86E464-05C9-4B35-939B-EE0B3A31D0AE\",\"pipe\":{\"id\":108,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[2.0,2.2,0.0,2.2,0.04372540445999125,0.5,0.0,0.0,0.5,0.0,2.0,0.0],\"sEvaluate\":{\"Ⅱ\":\"管道缺陷明显超过一级，具有变坏的趋势\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅱ\":\"结构在短期内不会发生破坏现象，但应做修复计划\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":1.54,\"mi\":0.4},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 109,grade = 1, LineID = 8949,lno ="WS2016B00701001701001477",cctvJsonStr="{\"msg\":{\"id\":109,\"no\":7,\"video\":\"深圳市_BWB82~BWB81_181115105333\",\"smanhole\":\"BWB82\",\"fmanhole\":\"BWB81\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.63\",\"fdepth\":\"2.68\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"400\",\"direction\":\"顺流\",\"pipelength\":\"44.67\",\"testlength\":\"43.2\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BWB82~BWB81\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":203,\"no\":1,\"dist\":\"1.95\",\"code\":\"SG\",\"grade\":\"1\",\"location\":\"408\",\"picture\":\"照片1\",\"remarks\":\"过水断面损失不大于15% 。\",\"path\":\"EDA16897-8EA6-4BF7-A241-8CE8A42E2CEB\",\"pipe\":{\"id\":109,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":204,\"no\":2,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片2\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"9A42DA92-03D0-4CDA-8615-FDD35BF39C4E\",\"pipe\":{\"id\":109,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":205,\"no\":3,\"dist\":\"0.01\",\"code\":\"BX\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片3\",\"remarks\":\"变形不大于管道直径的5%。\",\"path\":\"B27C11DB-336B-495D-A5B2-28D214699EE9\",\"pipe\":{\"id\":109,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[1.0,0.8250000000000001,0.0,1.0,0.036937541974479515,0.5,0.0,0.0,0.5,0.0,1.5,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.7,\"mi\":0.4},\"code\":\"200\"}"},
                new CctvIDsModel { cctvID = 110,grade = 1, LineID = 8951,lno ="WS2016B00701001478001479",cctvJsonStr="{\"msg\":{\"id\":110,\"no\":8,\"video\":\"深圳市_BWB81~BWB79_181115110258\",\"smanhole\":\"BWB81\",\"fmanhole\":\"BWB79\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.68\",\"fdepth\":\"2.89\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"400\",\"direction\":\"顺流\",\"pipelength\":\"42.48\",\"testlength\":\"41.82\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BWB81~BWB79\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":206,\"no\":1,\"dist\":\"4.28\",\"code\":\"ZW\",\"grade\":\"2\",\"location\":\"507\",\"picture\":\"照片1\",\"remarks\":\"过水断面损失在15%~25%之间。\",\"path\":\"976C84A2-D30A-4E4A-9250-B4946FDC3AF8\",\"pipe\":{\"id\":110,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":207,\"no\":2,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片2\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"F0A8F88B-C78E-4F8B-AB21-A1F4B0CEADB8\",\"pipe\":{\"id\":110,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.5,0.55,0.0,0.55,0.02354048964218456,2.0,0.0,0.0,2.0,0.0,0.5,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅱ\":\"管道过流有一定的受阻，运行受影响不大\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅱ\":\"没有立即进行处理的必要，但宜安排处理计划\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.385,\"mi\":1.6},\"code\":\"200\"}"}
            };

        public HomeController(Ihidden_dangerServices ihidden_DangerServices, Ipipe_holeServices ipipe_HoleServices, Ipipe_lineServices ipipe_LineServices)
        {
            _ihidden_DangerServices = ihidden_DangerServices;
            _ipipe_HoleServices = ipipe_HoleServices;
            _ipipe_LineServices = ipipe_LineServices;
        }
        /// <summary>
        /// 主界面加载主页
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            return View();
        }

        #region CCTV管线等级
        public IActionResult GetCCTVGrade()
        {
            return new JsonResult(cctvIDList);
        }
        #endregion

        #region 导入excel
        /// <summary>
        /// 先导入井
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult ImportHoleExcel()
        {
            var result = new MessageModel<bool>() { msg = "参数错误", response = false, success = true };
            try
            {
                var files = Request.Form.Files;
                if (files.Count <= 0)
                {
                    result.msg = "没有上传任何文件！";
                    return new JsonResult(result);
                }

                List<pipe_hole> holesList = new List<pipe_hole>();
                foreach (var file in files)
                {

                    DataTable dt = OfficeHelper.ReadStreamToDataTable(file.OpenReadStream());
                    for (int i = 1; i < dt.Rows.Count; i++)//从第二行开始读取数据
                    {
                        var szX = dt.Rows[i][6].ToString().Trim().ObjToMoney();
                        var szY = dt.Rows[i][7].ToString().Trim().ObjToMoney();
                        var szH = dt.Rows[i][8].ToString().Trim().ObjToMoney();
                        var coors = CoordinateCalculation.shenzhenTOWGS84(new double[] { szX, szY, szH });

                        pipe_hole model = new pipe_hole()
                        {
                            prj_No = dt.Rows[i][1].ToString().Trim(),
                            prj_Name = dt.Rows[i][2].ToString().Trim(),
                            Exp_No = dt.Rows[i][3].ToString().Trim(),
                            HType = dt.Rows[i][4].ToString().Trim(),
                            ZType = dt.Rows[i][5].ToString().Trim(),
                            szCoorX = szX,
                            szCoorY = szY,
                            hight = szH,
                            CoorWgsX = coors[0],
                            CoorWgsY = coors[1],
                            rotation = dt.Rows[i][10].ToString().ObjToInt(),
                            Code = dt.Rows[i][11].ToString(),
                            Feature = dt.Rows[i][12].ToString(),
                            Subsid = dt.Rows[i][13].ToString(),
                            FeaMateria = dt.Rows[i][15].ToString(),
                            Spec = dt.Rows[i][16].ToString(),
                            deep = dt.Rows[i][19].ToString().ObjToMoney(),
                            wellShape = dt.Rows[i][20].ToString(),
                            wellMater = dt.Rows[i][21].ToString(),
                            WellSize = dt.Rows[i][22].ToString(),
                            WellPipes = dt.Rows[i][23].ToString().ObjToMoney(),
                            Address = dt.Rows[i][24].ToString(),
                            Belong = dt.Rows[i][26].ToString(),
                            MDate = dt.Rows[i][27].ToString().ObjToDate(),
                            MapCode = dt.Rows[i][28].ToString(),
                            SUnit = dt.Rows[i][29].ToString(),
                            SDate = dt.Rows[i][30].ToString().ObjToDate(),
                            updateTime = dt.Rows[i][31].ToString().ObjToDate(),
                            Visibility = dt.Rows[i][36].ToString(),
                            status = dt.Rows[i][37].ObjToInt(),
                            pointPosit = dt.Rows[i][39].ToString().ObjToInt(),
                            Operator = dt.Rows[i][40].ToString(),
                            Note = dt.Rows[i][41].ToString(),
                            ljm = dt.Rows[i][42].ToString(),
                            Angel = dt.Rows[i][43].ToString(),
                            SymbolName = dt.Rows[i][44].ToString()
                        }
                      ;

                        holesList.Add(model);
                    }
                }
                if (holesList.Count > 0)
                {
                    var sum = _ipipe_HoleServices.Add(holesList).Result;
                    result.response = true;
                    result.msg = $"已导入井点记录{sum}条";
                }
                else
                    result.msg = "Excel没有数据!";
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                result.msg = $"上传文件错误信息列表错误:{ex.ToString()}";
                return new JsonResult(result);
            }
        }
        /// <summary>
        /// 再导入管线
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult ImportLineExcel()
        {
            var result = new MessageModel<bool>() { msg = "参数错误", response = false, success = true };
            try
            {
                var files = Request.Form.Files;
                if (files.Count <= 0)
                {
                    result.msg = "没有上传任何文件！";
                    return new JsonResult(result);
                }
                var holeList = _ipipe_HoleServices.Query().Result;
                if (holeList.Count <= 0)
                {
                    result.msg = "请先上传井点坐标！";
                    return new JsonResult(result);
                }
                List<pipe_line> lineList = new List<pipe_line>();
                foreach (var file in files)
                {
                    DataTable dt = OfficeHelper.ReadStreamToDataTable(file.OpenReadStream());
                    for (int i = 1; i < dt.Rows.Count; i++)//从第二行开始读取数据
                    {
                        if (!holeList.Any(t => t.Exp_No == dt.Rows[i][3].ToString()) || !holeList.Any(t => t.Exp_No == dt.Rows[i][5].ToString()))
                            continue;
                        var s_Point = holeList.Where(t => t.Exp_No == dt.Rows[i][3].ToString()).First();
                        var e_Point = holeList.Where(t => t.Exp_No == dt.Rows[i][5].ToString()).First();
                        var pSize = dt.Rows[i][14].ToString();

                        pipe_line model = new pipe_line()
                        {
                            S_holeID = s_Point.id,
                            S_Point = s_Point.Exp_No,
                            S_Deep = dt.Rows[i][4].ToString().ObjToMoney(),
                            E_holeID = e_Point.id,
                            E_Point = e_Point.Exp_No,
                            E_Deep = dt.Rows[i][6].ToString().ObjToMoney(),
                            line_Class = dt.Rows[i][7].ToString(),
                            code = dt.Rows[i][9].ToString(),
                            Material = dt.Rows[i][10].ToString(),
                            ServiceLif = dt.Rows[i][11].ToString().ObjToInt(),
                            PSize = pSize,
                            CabNum = dt.Rows[i][17].ToString().ObjToInt(),
                            TotalHole = dt.Rows[i][18].ToString().ObjToInt(),
                            UsedHole = dt.Rows[i][19].ToString().ObjToInt(),
                            FlowDir = dt.Rows[i][20].ToString(),
                            Address = dt.Rows[i][21].ToString(),
                            Roadcode = dt.Rows[i][22].ToString(),
                            EmBed = dt.Rows[i][23].ToString(),
                            MDate = dt.Rows[i][24].ToString().ObjToDate(),
                            Belong = dt.Rows[i][25].ToString(),
                            SUnit = dt.Rows[i][26].ToString(),
                            SDate = dt.Rows[i][27].ToString().ObjToDate(),
                            UpdateTime = dt.Rows[i][28].ToString().ObjToDate(),
                            Lno = dt.Rows[i][29].ToString(),
                            LineType = dt.Rows[i][30].ToString().ObjToInt(),
                            PDS = dt.Rows[i][31].ToString().ObjToInt(),
                            status = dt.Rows[i][32].ToString().ObjToInt(),
                            PipeLength = dt.Rows[i][33].ToString().ObjToMoney(),
                            Operator = dt.Rows[i][34].ToString(),
                            Note = dt.Rows[i][36].ToString(),
                            startbotto = dt.Rows[i][44].ToString().ObjToMoney(),
                            startcrow = dt.Rows[i][45].ToString().ObjToMoney(),
                            endbotto = dt.Rows[i][46].ToString().ObjToMoney(),
                            endcrow = dt.Rows[i][47].ToString().ObjToMoney(),
                            Angel = dt.Rows[i][49].ToString().ObjToMoney(),
                            SHAPE_Leng = dt.Rows[i][50].ToString().ObjToMoney()
                        };

                        lineList.Add(model);
                    }
                }
                if (lineList.Count > 0)
                {
                    var sum = _ipipe_LineServices.Add(lineList).Result;
                    result.response = true;
                    result.msg = $"已导入管段记录{sum}条";
                }
                else
                    result.msg = "Excel没有数据!";
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                result.msg = $"上传文件错误信息列表错误:{ex.ToString()}";
                return new JsonResult(result);
            }
        }
        #endregion

        #region 管段大范围请求
        [HttpPost]
        public IActionResult GetLineHolesDateForBd()
        {
            var result = new MessageModel<LineHoleDateModel>() { msg = "参数错误", response = null, success = true };
            var LineHoles = _ipipe_LineServices.GetLineHolesDate(0);
            if (LineHoles != null && LineHoles.holeDateMoldes.Count > 0 && LineHoles.lineDateMoldes.Count > 0)
            {
                result.response = LineHoles;
                result.msg = "获取管道数据成功！";
            }
            else
                result.msg = "目前还没有管道数据哦";


            return new JsonResult(result);
        }
        /// <summary>
        /// 获取管线和管井数据
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GetLineHolesDate()
        {
            var result = new MessageModel<LineHoleDateModel>() { msg = "参数错误", response = null, success = true };
            var LineHoles = _ipipe_LineServices.GetLineHolesDate();
            if (LineHoles != null && LineHoles.holeDateMoldes.Count > 0 && LineHoles.lineDateMoldes.Count > 0)
            {
                result.response = LineHoles;
                result.msg = "获取管道数据成功！";
            }
            else
                result.msg = "目前还没有管道数据哦";


            return new JsonResult(result);
        }
        /// <summary>
        /// 获取隐患
        /// </summary>
        /// <returns></returns>
        public IActionResult GetYhData() {
            var result = new MessageModel<List<YhDataMolde>>() { msg = "参数错误", response = null, success = true };
            var yhList = _ihidden_DangerServices.GetYhData();
            if (yhList != null && yhList.Count() > 0)
            {
                result.response = yhList;
                result.msg = "获取隐患数据成功！";
            }
            else
                result.msg = "目前还没有隐患数据哦";


            return new JsonResult(result);
        }
        #endregion

        #region 查询单个管段详细信息
        [HttpPost]
        public IActionResult GetLineInfoByID(IDParameter obj)
        {
            var result = new MessageModel<LineInfoMolde>() { msg = "参数错误", response = null, success = true };
            if (obj.id <= 0)
                return new JsonResult(result);

            var LineHoles = _ipipe_LineServices.GetLineInfoByID(obj.id);
            if (LineHoles != null)
            {
                if (cctvIDList.Any(t=>t.LineID == LineHoles.model.id)) {
                    LineHoles.cctvID = cctvIDList.Where(t => t.LineID == LineHoles.model.id).Select(t => t.cctvID).First();
                }
                result.response = LineHoles;
                result.msg = "获取管道数据成功！";
            }
            else
                result.msg = "目前还没有该管道数据哦";
            return new JsonResult(result);
        }
        /// <summary>
        /// 获取CCTV资料
        /// </summary>
        /// <returns></returns>
        public IActionResult GetCCTVInfoByID(int pipeid) {
            var result = new MessageModel<string>() { msg = "参数错误", response = null, success = true };
            if (pipeid == 0) 
                return new JsonResult(result);

            if (cctvIDList.Any(t=>t.cctvID == pipeid)) {
                result.msg = "获取CCTV资料成功！";
                result.response = cctvIDList.Where(t => t.cctvID == pipeid).Select(t => t.cctvJsonStr).First();
            }
            return new JsonResult(result);
        }
        #endregion

        #region 查询单个管井信息
        [HttpPost]
        public IActionResult GetHoleInfoByID(IDParameter obj)
        {
            var result = new MessageModel<HoleInfoMolde>() { msg = "参数错误", response = null, success = false };
            if (obj.id <= 0)
                return new JsonResult(result);

            var LineHoles = _ipipe_HoleServices.GetHoleInfoByID(obj.id);
            if (LineHoles != null)
            {
                result.success = true;
                result.response = LineHoles;
                result.msg = "获取管道数据成功！";
            }
            else
                result.msg = "目前还没有该管道数据哦";
            return new JsonResult(result);
        }
        #endregion

        #region 查询管点和管端
        /// <summary>
        /// 查询管
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GetQueryLineHolesDate(KWParameter obj)
        {
            var result = new MessageModel<List<QueryLineHoleMolde>>() { msg = "参数错误", response = null, success = false };
            if (string.IsNullOrWhiteSpace(obj.kw))
            {
                result.msg = "关键字为空！";
                return new JsonResult(result);
            }
            var LineHoles = _ipipe_LineServices.GetQueryLineHolesDate(obj.kw);
            if (LineHoles.Count > 0)
            {
                result.msg = $"共发现{LineHoles.Count}条管道记录";
                result.response = LineHoles;
                result.success = true;
            }
            else
            {
                result.msg = $"没有找到合适的管道记录";
                result.response = LineHoles;
            }
            //现将管
            return new JsonResult(result);
        }
        #endregion

    }
}
