using Bevent.Api.SharedKernel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bevent.Api.Infrastructure.Database.Configurations;

public abstract class RegisterConfiguration<TRegister> : IEntityTypeConfiguration<TRegister>
    where TRegister : Register
{
    protected abstract void ConfigureEntity(EntityTypeBuilder<TRegister> builder);

    public virtual void Configure(EntityTypeBuilder<TRegister> builder)
    {
        builder
            .Property(r => r.CreatedOnUtc)
            .HasConversion(c => DateTime.SpecifyKind(c, DateTimeKind.Utc), v => v);

        builder
            .Property(r => r.UpdatedOnUtc)
            .HasConversion(
                u => u != null ? DateTime.SpecifyKind(u.Value, DateTimeKind.Utc) : u,
                v => v
            );

        builder.HasIndex(r => r.CreatedOnUtc);

        builder.HasQueryFilter(e => !e.IsDeleted);

        ConfigureEntity(builder);
    }
}
