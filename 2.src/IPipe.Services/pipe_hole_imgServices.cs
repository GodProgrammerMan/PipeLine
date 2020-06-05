
using IPipe.IRepository;
using IPipe.IServices;
using IPipe.Model.Models;
using IPipe.Services.BASE;

namespace IPipe.Services
{
    public partial class pipe_hole_imgServices : BaseServices<pipe_hole_img>, Ipipe_hole_imgServices
    {
        Ipipe_hole_imgRepository _dal;
        public pipe_hole_imgServices(Ipipe_hole_imgRepository dal)
        {
            this._dal = dal;
            base.BaseDal = dal;
        }

    }
}
                    