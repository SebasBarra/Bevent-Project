using Bevent.Api.Application.Abstractions.Data;
using Bevent.Api.Domain.AvailableSchedules;
using Bevent.Api.Domain.EventHallImages;
using Bevent.Api.Domain.EventHalls;
using Bevent.Api.Domain.Reservations;
using Bevent.Api.Domain.ReservationServices;
using Bevent.Api.Domain.ReservationTasks;
using Bevent.Api.Domain.Services;
using Bevent.Api.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Bevent.Api.Infrastructure.Database;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options),
        IApplicationDbContext
{
    public DbSet<AvailableSchedule> AvailableSchedules { get; init; }
    public DbSet<EventHallImage> EventHallImages { get; init; }
    public DbSet<EventHall> EventHalls { get; init; }
    public DbSet<Reservation> Reservations { get; init; }
    public DbSet<ReservationService> ReservationServices { get; init; }
    public DbSet<ReservationTask> ReservationTasks { get; init; }
    public DbSet<Service> Services { get; init; }
    public DbSet<User> Users { get; init; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        modelBuilder.HasDefaultSchema(Schemas.Default);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        int result = await base.SaveChangesAsync(cancellationToken);

        return result;
    }
}
