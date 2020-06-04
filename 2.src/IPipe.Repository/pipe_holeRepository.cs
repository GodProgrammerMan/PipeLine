
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Repository.Base;

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
    }
}
                    