using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebShop.Models;

namespace WebShop.DBConfiguration.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.FullName).HasMaxLength(60);
            builder.Property(x => x.FullName).IsRequired();

            builder.Property(x => x.Email).HasMaxLength(60);
            builder.Property(x => x.Email).IsRequired();
            builder.HasIndex(x => x.Email).IsUnique();

            builder.Property(x => x.Username).HasMaxLength(60);
            builder.Property(x => x.Username).IsRequired();
            builder.HasIndex(x => x.Username).IsUnique();

            builder.Property(x => x.Password).HasMaxLength(256);
            builder.Property(x => x.Password).IsRequired();

            builder.HasMany(user => user.Orders)
                .WithOne(order => order.Buyer)
                .HasForeignKey(order => order.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(user => user.Articles)
                .WithOne(article => article.Seller)
                .HasForeignKey(article => article.SellerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
