using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppGastos.Models;
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
        public async Task<ActionResult<IEnumerable<Gasto>>> GetGastos(
            [FromQuery] int? año = null,
            [FromQuery] int? mes = null,
            [FromQuery] string categoria = null)
        {
            try
            {
                _logger.LogInformation("Obteniendo lista de gastos con filtros: Año={Año}, Mes={Mes}, Categoria={Categoria}", año, mes, categoria);
                
                if (_context.Gastos == null)
                {
                    _logger.LogError("DbSet Gastos es null");
                    return StatusCode(500, "Error en la configuración de la base de datos");
                }

                var query = _context.Gastos.AsQueryable();

                if (año.HasValue)
                {
                    _logger.LogInformation("Filtrando por año: {Año}", año.Value);
                    query = query.Where(g => g.Fecha.Year == año.Value);
                }

                if (mes.HasValue)
                {
                    _logger.LogInformation("Filtrando por mes: {Mes}", mes.Value);
                    query = query.Where(g => g.Fecha.Month == mes.Value);
                }

                if (!string.IsNullOrEmpty(categoria))
                {
                    _logger.LogInformation("Filtrando por categoría: {Categoria}", categoria);
                    query = query.Where(g => g.Categoria == categoria);
                }

                // Ordenar por fecha descendente (más reciente primero)
                query = query.OrderByDescending(g => g.Fecha);

                var gastos = await query.ToListAsync();
                _logger.LogInformation($"Se encontraron {gastos.Count} gastos después de aplicar los filtros");
                
                return Ok(gastos);
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
                if (_context.Gastos == null)
                {
                    return StatusCode(500, "Error en la configuración de la base de datos");
                }

                var gasto = await _context.Gastos.FindAsync(id);

                if (gasto == null)
                {
                    return NotFound();
                }

                return gasto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el gasto con ID {Id}", id);
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // PUT: api/Gastos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGasto(int id, Gasto gasto)
        {
            try
            {
                if (id != gasto.Id)
                {
                    return BadRequest("El ID del gasto no coincide");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _context.Entry(gasto).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GastoExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el gasto con ID {Id}", id);
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/Gastos
        [HttpPost]
        public async Task<ActionResult<Gasto>> PostGasto(Gasto gasto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _context.Gastos.Add(gasto);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetGasto", new { id = gasto.Id }, gasto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear un nuevo gasto");
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // DELETE: api/Gastos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGasto(int id)
        {
            try
            {
                if (_context.Gastos == null)
                {
                    return StatusCode(500, "Error en la configuración de la base de datos");
                }

                var gasto = await _context.Gastos.FindAsync(id);
                if (gasto == null)
                {
                    return NotFound();
                }

                _context.Gastos.Remove(gasto);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar el gasto con ID {Id}", id);
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        private bool GastoExists(int id)
        {
            return _context.Gastos.Any(e => e.Id == id);
        }
    }
} 