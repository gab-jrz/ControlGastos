using AppGastosAPI.Models;

namespace AppGastosAPI.Repositories
{
    public interface IGastoRepository
    {
        Task<IEnumerable<Gasto>> GetAllAsync(int? año, int? mes, string categoria);
        Task<Gasto?> GetByIdAsync(int id);
        Task<Gasto> CreateAsync(Gasto gasto);
        Task<bool> UpdateAsync(Gasto gasto);
        Task<bool> DeleteAsync(int id);
    }
}
