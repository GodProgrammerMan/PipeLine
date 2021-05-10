
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Repository.Base;
using Microsoft.AspNetCore.Http;
using NPOI.SS.Formula.Functions;
using System.Collections.Generic;

namespace IPipe.Repository
{
	/// <summary>
	/// pipe_holeRepository
	/// </summary>
    public class pipe_holeRepository : BaseRepository<pipe_hole>, Ipipe_holeRepository
    {
        public pipe_holeRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public List<HoleCoorXYMolde> GetHoleCoor()
        {
            return Db.Queryable<pipe_hole>().Select(t => new HoleCoorXYMolde() { id = t.id, CoorX = t.szCoorX,CoorY = t.szCoorY, hight = t.hight }).ToList();
        }

        public HoleInfoMolde GetHoleInfoByID(int id)
        {
            HoleInfoMolde  holeInfoMolde = new HoleInfoMolde();
            var model = Db.Queryable<pipe_hole>().Where(t => t.id == id).First();
            if (model == null || model.id == 0)
                return null;
            holeInfoMolde.model = model;
   
            holeInfoMolde.imgs = Db.Queryable<pipe_hole_img>().Where(t => t.holeID == id).ToList();
            holeInfoMolde.dangers = Db.Queryable<hidden_danger>().Where(t => t.objID == id && t.tableType == "pipe_hole").ToList();
            return holeInfoMolde;
        }

        public LineCCTVInfoMolde GetLineCCTVdata(int id, int areid)
        {
            var model = Db.Queryable<pipe_line>().Where(t => t.id == id && t.areid == areid).Select(t=> new LineCCTVInfoMolde {  sholeid = t.S_holeID, eholeid = t.E_holeID ,address = t.Address, belong = t.Belong, classType=t.line_Class, emBed = t.EmBed, epoint = t.E_Point, spoint = t.S_Point, pSize = t.PSize, lno = t.Lno, material = t.Material}).First();
            if (model == null) {
                return null;
            }
            var spoint = Db.Queryable<pipe_hole>().Where(t => t.id == model.sholeid && t.areid == areid).Select(t => new  { x = t.CoorWgsX, y = t.CoorWgsY}).First();
            var epoint = Db.Queryable<pipe_hole>().Where(t => t.id == model.eholeid && t.areid == areid).Select(t => new { x = t.CoorWgsX, y = t.CoorWgsY }).First();
            if (spoint == null || epoint == null) {
                return null;
            }
            model.clng = (spoint.y + epoint.y) / 2;
            model.clat = (spoint.x + epoint.x) / 2;
            //cctv
            var cctvdata = Db.Queryable<cctv>().Where(t => t.LineID == id && t.areid == areid).Select(t => new cctv { cctvJsonStr = t.cctvJsonStr, grade = t.grade }).First();
            if (cctvdata == null)
            {
                model.cctvJsonStr = "无cctv数据";
                model.isAnyCCTV = false;
            }
            else {
                model.isAnyCCTV = true;
                model.cctvJsonStr = cctvdata.cctvJsonStr;
                model.grade = cctvdata.grade.Value;
            }
            //隐患
            var yhdata = Db.Queryable<hidden_danger>().Where(t => t.tableType == "pipe_line" && t.areid == areid && t.objID==id).Select(t => new hidden_danger {  content = t.content,handleState = t.handleState}).First();
            if (yhdata == null)
            {
                model.yhcontent = "无隐患数据";
                model.isAnyYH = false;
            }
            else {
                model.yhcontent = yhdata.content;
                model.isAnyYH = true;
                model.handleState = yhdata.handleState;
            }
            return model;
        }

        public void UpdateMaxDeep(pipe_hole item)
        {
            var result = Db.Updateable(item).UpdateColumns(it => new { it.maxdeep }).ExecuteCommand();
        }

        public void UpdateWgsXY(double x, double y, int id)
        {
            Db.Updateable<pipe_hole>()
                .SetColumns(it => new pipe_hole() { CoorWgsX = x, CoorWgsY = y })
                .Where(t => t.id == id)
                .ExecuteCommand();
        }
    }
}
                    