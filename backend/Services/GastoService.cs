using AppGastosAPI.DTOs;
using AppGastosAPI.Models;
using AppGastosAPI.Repositories;

namespace AppGastosAPI.Services
{
    public class GastoService : IGastoService
    {
        private readonly IGastoRepository _repo;

        public GastoService(IGastoRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<GastoDto>> GetAllAsync(int? año, int? mes, string categoria)
        {
            var gastos = await _repo.GetAllAsync(año, mes, categoria);
            return gastos.Select(MapToDto);
        }

        public async Task<GastoDto?> GetByIdAsync(int id)
        {
            var gasto = await _repo.GetByIdAsync(id);
            return gasto == null ? null : MapToDto(gasto);
        }

        public async Task<GastoDto> CreateAsync(GastoDto dto)
        {
            var nuevo = MapToEntity(dto);
            var creado = await _repo.CreateAsync(nuevo);
            return MapToDto(creado);
        }

        public async Task<bool> UpdateAsync(int id, GastoDto dto)
        {
            if (id != dto.Id) return false;
            var gasto = MapToEntity(dto);
            return await _repo.UpdateAsync(gasto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repo.DeleteAsync(id);
        }

        // Mappers
        private static GastoDto MapToDto(Gasto g) => new()
        {
            Id = g.Id,
            Monto = g.Monto,
            Descripcion = g.Descripcion,
            Fecha = g.Fecha,
            Categoria = g.Categoria
        };

        private static Gasto MapToEntity(GastoDto dto) => new()
        {
            Id = dto.Id,
            Monto = dto.Monto,
            Descripcion = dto.Descripcion,
            Fecha = dto.Fecha,
            Categoria = dto.Categoria
        };
    }
}
