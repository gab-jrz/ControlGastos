namespace AppGastosAPI.DTOs
{
    public class GastoDto
    {
        public int Id { get; set; }
        public decimal Monto { get; set; }
        public required string Descripcion { get; set; }
        public DateTime Fecha { get; set; }
        public required string Categoria { get; set; }
    }
}
