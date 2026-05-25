using Bevent.Api.Domain.AvailableSchedules;
using Bevent.Api.Domain.EventHallImages;
using Bevent.Api.Domain.EventHalls;
using Bevent.Api.Domain.Reservations;
using Bevent.Api.Domain.ReservationServices;
using Bevent.Api.Domain.ReservationTasks;
using Bevent.Api.Domain.Services;
using Bevent.Api.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Bevent.Api.Application.Abstractions.Data;

public interface IApplicationDbContext
{
    DbSet<AvailableSchedule> AvailableSchedules { get; }
    DbSet<EventHallImage> EventHallImages { get; }
    DbSet<EventHall> EventHalls { get; }
    DbSet<Reservation> Reservations { get; }
    DbSet<ReservationService> ReservationServices { get; }
    DbSet<ReservationTask> ReservationTasks { get; }
    DbSet<Service> Services { get; }
    DbSet<User> Users { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
