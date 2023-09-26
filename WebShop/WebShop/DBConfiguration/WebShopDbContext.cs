using Microsoft.EntityFrameworkCore;
using WebShop.Models;

namespace WebShop.DBConfiguration
{
    public class WebShopDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        public WebShopDbContext(DbContextOptions<WebShopDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(WebShopDbContext).Assembly);
        }
    }
}
