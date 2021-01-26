
using IPipe.IRepository;
using IPipe.IServices;
using IPipe.Model.Models;
using IPipe.Services.BASE;

namespace IPipe.Services
{
    public partial class cctvServices : BaseServices<cctv>, IcctvServices
    {
        IcctvRepository _dal;
        public cctvServices(IcctvRepository dal)
        {
            this._dal = dal;
            base.BaseDal = dal;
        }

    }
}
                    