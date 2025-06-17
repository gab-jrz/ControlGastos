using System;
using System.ComponentModel.DataAnnotations;

namespace AppGastos.Models
{
    public class Gasto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El monto es requerido")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0")]
        public decimal Monto { get; set; }

        [Required(ErrorMessage = "La descripción es requerida")]
        [StringLength(200, ErrorMessage = "La descripción no puede exceder los 200 caracteres")]
        public string Descripcion { get; set; }

        [Required(ErrorMessage = "La fecha es requerida")]
        public DateTime Fecha { get; set; }

        [Required(ErrorMessage = "La categoría es requerida")]
        public string Categoria { get; set; }
    }
} 