using AppGastosAPI.DTOs;

namespace AppGastosAPI.Services
{
    public interface IGastoService
    {
        Task<IEnumerable<GastoDto>> GetAllAsync(int? año, int? mes, string categoria);
        Task<GastoDto?> GetByIdAsync(int id);
        Task<GastoDto> CreateAsync(GastoDto dto);
        Task<bool> UpdateAsync(int id, GastoDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
