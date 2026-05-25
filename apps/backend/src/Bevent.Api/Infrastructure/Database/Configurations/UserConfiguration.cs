using Bevent.Api.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bevent.Api.Infrastructure.Database.Configurations;

internal sealed class UserConfiguration : EntityConfiguration<User>
{
    protected override void ConfigureEntity(EntityTypeBuilder<User> builder)
    {
        // Unique indexes
        builder.HasIndex(e => e.ClerkId).IsUnique();
        builder.HasIndex(x => x.Email).IsUnique();

        // Search indexes
        builder.HasIndex(x => x.Role);

        // Properties max lengths
        builder.Property(x => x.ClerkId).HasMaxLength(50);
        builder.Property(x => x.Email).HasMaxLength(255);
        builder.Property(x => x.FirstName).HasMaxLength(100);
        builder.Property(x => x.LastName).HasMaxLength(100);
        builder.Property(x => x.PhoneNumber).HasMaxLength(20);
        builder.Property(x => x.Role).HasConversion<string>().HasMaxLength(20);

        builder
            .HasMany(x => x.EventHalls)
            .WithOne(x => x.Admin)
            .HasForeignKey(x => x.AdminId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}
