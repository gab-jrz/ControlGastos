using Microsoft.EntityFrameworkCore;

namespace AppGastos.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Gasto> Gastos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Gasto>()
                .Property(g => g.Monto)
                .HasColumnType("decimal(18,2)");
        }
    }
} 