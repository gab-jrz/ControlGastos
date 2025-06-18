using System;
using System.ComponentModel.DataAnnotations;

namespace AppGastosAPI.Models
{
    public class Gasto
    {
        public int Id { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Monto { get; set; }

        [Required]
        [StringLength(200)]
        public required string Descripcion { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public required string Categoria { get; set; }
    }
}
