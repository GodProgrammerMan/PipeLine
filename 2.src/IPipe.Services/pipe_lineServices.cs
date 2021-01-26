
using IPipe.IRepository;
using IPipe.IServices;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Services.BASE;
using System.Collections.Generic;

namespace IPipe.Services
{
    public partial class pipe_lineServices : BaseServices<pipe_line>, Ipipe_lineServices
    {
        Ipipe_lineRepository _dal;
        public pipe_lineServices(Ipipe_lineRepository dal)
        {
            this._dal = dal;
            base.BaseDal = dal;
        }

        public LineHoleDateModel GetLineHolesDate(int areid, int type=1)
        {
            return _dal.GetLineHolesDate(areid, type);
        }

        public LineInfoMolde GetLineInfoByID(int id)
        {
            return _dal.GetLineInfoByID(id);
        }

        public List<TreeLineMolde> getLineListBytree(int areid)
        {
            return _dal.getLineListBytree(areid);
        }

        public List<QueryLineHoleMolde> GetQueryLineHolesDate(string kw)
        {
            return _dal.GetQueryLineHolesDate(kw);
        }

        public void UpdateFlowToData(pipe_line item)
        {
            _dal.UpdateFlowToData(item);
        }

        public void UpdateHoleIDByID(int sholeID, int eholeID, int lineid)
        {
            _dal.UpdateHoleIDByID(sholeID, eholeID, lineid);
        }

        public void UpdateParentsIDSChildrsIDS(string parentsIDS, string ChildrsIDS, int id)
        {
             _dal.UpdateParentsIDSChildrsIDS(parentsIDS, ChildrsIDS, id);
        }
    }
}
                    