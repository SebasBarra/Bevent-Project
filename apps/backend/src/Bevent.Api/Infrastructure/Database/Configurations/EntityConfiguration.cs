using Bevent.Api.SharedKernel;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bevent.Api.Infrastructure.Database.Configurations;

internal abstract class EntityConfiguration<TEntity> : RegisterConfiguration<TEntity>
    where TEntity : Entity
{
    public override void Configure(EntityTypeBuilder<TEntity> builder)
    {
        builder.HasKey(e => e.Id);

        base.Configure(builder);
    }
}
