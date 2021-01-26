
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Repository.Base;
using Microsoft.AspNetCore.Http;

namespace IPipe.Repository
{
	/// <summary>
	/// pipe_hole_imgRepository
	/// </summary>
    public class pipe_hole_imgRepository : BaseRepository<pipe_hole_img>, Ipipe_hole_imgRepository
    {
        public pipe_hole_imgRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
                    