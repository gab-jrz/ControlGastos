using Microsoft.AspNetCore.Mvc;
using AppGastosAPI.DTOs;
using AppGastosAPI.Services;

namespace AppGastosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
        public class GastosController : ControllerBase
    {
        private readonly IGastoService _service;

        public GastosController(IGastoService service)
        {
            _service = service;
        }

        // GET: api/gastos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GastoDto>>> GetAllAsync( int? año, int? mes, string? categoria)
        {
            var gastos = await _service.GetAllAsync(año, mes, categoria ?? string.Empty);
            return Ok(gastos);
        }

        // GET: api/gastos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GastoDto>> Get(int id)
        {
            var gasto = await _service.GetByIdAsync(id);
            if (gasto == null) return NotFound();
            return Ok(gasto);
        }

        // POST: api/gastos
        [HttpPost]
        public async Task<ActionResult<GastoDto>> Post([FromBody] GastoDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var creado = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = creado.Id }, creado);
        }

        // PUT: api/gastos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] GastoDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var actualizado = await _service.UpdateAsync(id, dto);
            if (!actualizado) return BadRequest("No se pudo actualizar el gasto");
            return NoContent();
        }

        // DELETE: api/gastos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _service.DeleteAsync(id);
            if (!eliminado) return NotFound();
            return NoContent();
        }
    }
}
