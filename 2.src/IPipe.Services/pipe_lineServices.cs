
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

        public LineHoleDateModel GetLineHolesDate()
        {
            return _dal.GetLineHolesDate();
        }

        public List<QueryLineHoleMolde> GetQueryLineHolesDate(string kw)
        {
            return _dal.GetQueryLineHolesDate(kw);
        }
    }
}
                    