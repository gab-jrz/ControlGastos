using AppGastosAPI.Models;
using AppGastosAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace AppGastosAPI.Repositories
{
    public class GastoRepository : IGastoRepository
    {
        private readonly AppDbContext _context;

        public GastoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Gasto>> GetAllAsync(int? año, int? mes, string categoria)
        {
            var query = _context.Gastos.AsQueryable();

            if (año.HasValue)
                query = query.Where(g => g.Fecha.Year == año.Value);

            if (mes.HasValue)
                query = query.Where(g => g.Fecha.Month == mes.Value);

            if (!string.IsNullOrEmpty(categoria))
                query = query.Where(g => g.Categoria == categoria);

            return await query.OrderByDescending(g => g.Fecha).ToListAsync();
        }

        public async Task<Gasto?> GetByIdAsync(int id)
        {
            return await _context.Gastos.FindAsync(id);
        }

        public async Task<Gasto> CreateAsync(Gasto gasto)
        {
            _context.Gastos.Add(gasto);
            await _context.SaveChangesAsync();
            return gasto;
        }

        public async Task<bool> UpdateAsync(Gasto gasto)
        {
            _context.Entry(gasto).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var gasto = await _context.Gastos.FindAsync(id);
            if (gasto == null) return false;

            _context.Gastos.Remove(gasto);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
