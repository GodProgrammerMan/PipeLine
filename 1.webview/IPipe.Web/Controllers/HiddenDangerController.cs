using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using IPipe.Common;
using IPipe.Common.Helper;
using IPipe.IServices;
using IPipe.Model;
using IPipe.Model.Models;
using IPipe.Web.Models;
using Microsoft.AspNetCore.Mvc;
using NPOI.SS.Formula.Functions;

namespace IPipe.Web.Controllers
{
    public class HiddenDangerController : BaseController
    {
        readonly Ihidden_dangerServices  _ihidden_DangerServices;
        readonly Ipipe_lineServices _ipipe_LineServices;

        public HiddenDangerController(Ihidden_dangerServices  ihidden_DangerServices, Ipipe_lineServices ipipe_LineServices)
        {
            _ihidden_DangerServices = ihidden_DangerServices;
            _ipipe_LineServices = ipipe_LineServices;
        }
        public IActionResult Index(string action="add",int ty=1,double x=0,double y=0,string name="",int objID=0,int id=0)
        {
            //创建和编辑隐患
            hidden_danger model = new hidden_danger();
            if (objID == 0 || "add".Equals(action) || !_ihidden_DangerServices.IsAny(t => t.id == id))
            {
                model = null;
                action = "add";
            }
            else
            {
                model = _ihidden_DangerServices.Query(t => t.id == id).Result.First();
                action = "edit";
            }
            //固定添加的参数附上
            ViewBag.ty = ty == 1 ? "pipe_hole" : "pipe_line";
            ViewBag.x = x;
            ViewBag.y = y;
            ViewBag.name = name;
            ViewBag.objID = objID;
            ViewBag.action = action;
            return View(model);
        }


        [HttpPost]
        public IActionResult EditHiddenDanger(EditHiddenDangerModel obj) {
            var result = new MessageModel<bool>() { msg = "参数错误", response = false, success = true };

            #region 参数验证
            if (string.IsNullOrWhiteSpace(obj.hd_name))
            {
                result.msg = "请填写隐患名称";
                return new JsonResult(result);
            }
            if (string.IsNullOrWhiteSpace(obj.content))
            {
                result.msg = "请填写隐患内容";
                return new JsonResult(result);
            }
            if (string.IsNullOrWhiteSpace(obj.tableType))
            {
                result.msg = "参数有误";
                return new JsonResult(result);
            }
            if (obj.objID == 0)
            {
                result.msg = "参数有误";
                return new JsonResult(result);
            }
            if (string.IsNullOrWhiteSpace(obj.action) || (!"add".Equals(obj.action) && !"edit".Equals(obj.action)))
                return new JsonResult(result);
            #endregion
            //上传图片
            string GR_img = "";//编辑时为空则不改图片
            if (!string.IsNullOrWhiteSpace(obj.GR_img))
            {

                GR_img = Utils.UploadImage(obj.GR_img, $"ipipe/headPortrait/",
                    RandomHelper.GetGuid(), "账号头像", 10, 10, Color.Red, false);
            }
            pipe_line osl=null;
            try
            {
                osl = _ipipe_LineServices.QuerySql($"SELECT areatwo from pipe_line where areid={areid} LIMIT 1").Result.First();
            }
            catch (Exception)
            {
                osl = new pipe_line();
            }

            hidden_danger model = new hidden_danger()
            {
                GR_img = GR_img,
                objID = obj.objID,
                content = obj.content,
                tableType = obj.tableType,
                hd_time = obj.hd_time,
                handleState = obj.handleState,
                handUnit = obj.handUnit,
                handleTime = obj.handleTime,
                CoorWgsX = obj.CoorWgsX,
                CoorWgsY = obj.CoorWgsY,
                hd_name = obj.hd_name,
                areatwo = osl.areatwo,
                areid = areid
            };

            if ("add".Equals(obj.action))
            {
                #region 添加
                var row = _ihidden_DangerServices.Add(model).Result;
                if (row > 0)
                {
                    result.msg = "添加成功";
                    result.response = true;
                    return new JsonResult(result);
                }
                else
                {
                    result.msg = "添加失败，请稍后再试！";
                    result.response = false;
                    return new JsonResult(result);
                }
                #endregion
            }
            else
            {
                #region 编辑
                if (!_ihidden_DangerServices.IsAny(t => t.id == obj.id))
                {
                    result.msg = "编辑操作失败，请从新刷新页面再试！";
                    return new JsonResult(result);
                }
                var oldMolde = _ihidden_DangerServices.Query(t => t.id == obj.id).Result.First();
                model.GR_img = string.IsNullOrWhiteSpace(GR_img) ? oldMolde.GR_img : GR_img;
                var row = _ihidden_DangerServices.Update(model).Result;
                if (row)
                {
                    result.msg = "编辑成功";
                    result.response = true;
                    return new JsonResult(result);
                }
                else
                {
                    result.msg = "编辑失败，请稍后再试！";
                    result.response = false;
                    return new JsonResult(result);
                }
                #endregion
            }
        }

    }
}