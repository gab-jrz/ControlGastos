using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppGastos.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace AppGastos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GastosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<GastosController> _logger;

        public GastosController(AppDbContext context, ILogger<GastosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Gastos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Gasto>>> GetGastos()
        {
            try
            {
                _logger.LogInformation("Obteniendo lista de gastos");
                var gastos = await _context.Gastos.ToListAsync();
                _logger.LogInformation($"Se encontraron {gastos.Count} gastos");
                return gastos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los gastos");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/Gastos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Gasto>> GetGasto(int id)
        {
            try
            {
                _logger.LogInformation("Buscando gasto con ID: {Id}", id);
                var gasto = await _context.Gastos.FindAsync(id);

                if (gasto == null)
                {
                    _logger.LogWarning("Gasto no encontrado con ID: {Id}", id);
                    return NotFound();
                }

                return gasto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el gasto con ID: {Id}", id);
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/Gastos
        [HttpPost]
        public async Task<ActionResult<Gasto>> PostGasto(Gasto gasto)
        {
            try
            {
                _logger.LogInformation("Intentando crear nuevo gasto: {@Gasto}", gasto);

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Modelo inválido: {@ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                // Asegurarse de que la fecha sea UTC
                gasto.Fecha = DateTime.SpecifyKind(gasto.Fecha, DateTimeKind.Utc);

                _context.Gastos.Add(gasto);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Gasto creado exitosamente con ID: {Id}", gasto.Id);

                return CreatedAtAction(nameof(GetGasto), new { id = gasto.Id }, gasto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear el gasto");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // PUT: api/Gastos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGasto(int id, Gasto gasto)
        {
            try
            {
                _logger.LogInformation("Intentando actualizar gasto con ID: {Id}", id);
                _logger.LogInformation("Datos recibidos: {@Gasto}", gasto);

                if (id != gasto.Id)
                {
                    _logger.LogWarning("ID no coincide: {Id} != {GastoId}", id, gasto.Id);
                    return BadRequest("El ID de la URL no coincide con el ID del gasto");
                }

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Modelo inválido: {@ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                // Verificar si el gasto existe
                var gastoExistente = await _context.Gastos.FindAsync(id);
                if (gastoExistente == null)
                {
                    _logger.LogWarning("Gasto no encontrado con ID: {Id}", id);
                    return NotFound($"No se encontró el gasto con ID {id}");
                }

                // Actualizar las propiedades
                gastoExistente.Monto = gasto.Monto;
                gastoExistente.Descripcion = gasto.Descripcion;
                gastoExistente.Fecha = DateTime.SpecifyKind(gasto.Fecha, DateTimeKind.Utc);
                gastoExistente.Categoria = gasto.Categoria;

                try
                {
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Gasto actualizado exitosamente");
                    return NoContent();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GastoExists(id))
                    {
                        _logger.LogWarning("Gasto no encontrado al intentar actualizar: {Id}", id);
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el gasto con ID: {Id}", id);
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // DELETE: api/Gastos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGasto(int id)
        {
            try
            {
                _logger.LogInformation("Intentando eliminar gasto con ID: {Id}", id);
                var gasto = await _context.Gastos.FindAsync(id);

                if (gasto == null)
                {
                    _logger.LogWarning("Gasto no encontrado al intentar eliminar: {Id}", id);
                    return NotFound();
                }

                _context.Gastos.Remove(gasto);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Gasto eliminado exitosamente");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar el gasto con ID: {Id}", id);
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        private bool GastoExists(int id)
        {
            return _context.Gastos.Any(e => e.Id == id);
        }
    }
} 