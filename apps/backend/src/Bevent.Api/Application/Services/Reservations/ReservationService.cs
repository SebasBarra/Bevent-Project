using Bevent.Api.Application.Abstractions.Data;
using Bevent.Api.Application.Services.Reservations.Dtos;
using Bevent.Api.Domain.EventHalls;
using Bevent.Api.Domain.Reservations;
using Bevent.Api.Domain.ReservationTasks;
using Bevent.Api.Domain.Services;
using Bevent.Api.SharedKernel;
using Microsoft.EntityFrameworkCore;

namespace Bevent.Api.Application.Services.Reservations;

public sealed class ReservationService(
    IApplicationDbContext context,
    IDateTimeProvider dateTimeProvider
)
{
    public async Task<Result<ReservationIdDto>> CreateReservationAsync(
        Guid clientId,
        CreateReservationDto dto,
        CancellationToken cancellationToken = default
    )
    {
        if (dto.EndTime <= dto.StartTime)
        {
            return Result.Failure<ReservationIdDto>(ReservationErrors.InvalidTimeRange);
        }

        EventHall? eventHall = await context
            .EventHalls.Include(e => e.Services.Where(s => !s.IsDeleted))
            .FirstOrDefaultAsync(e => e.Id == dto.EventHallId && !e.IsDeleted, cancellationToken);

        if (eventHall is null)
        {
            return Result.Failure<ReservationIdDto>(EventHallErrors.NotFound);
        }

        var eventHallServiceIds = eventHall.Services.Select(s => s.Id).ToHashSet();
        foreach (Guid serviceId in dto.ServiceIds)
        {
            if (!eventHallServiceIds.Contains(serviceId))
            {
                return Result.Failure<ReservationIdDto>(ReservationErrors.ServiceNotAvailable);
            }
        }

        bool hasConflict = await context.Reservations.AnyAsync(
            r =>
                r.EventHallId == dto.EventHallId
                && !r.IsDeleted
                && r.Status != ReservationStatus.Cancelled
                && r.ReservationDate.Date == dto.ReservationDate.Date
                && (
                    dto.StartTime >= r.StartTime && dto.StartTime < r.EndTime
                    || dto.EndTime > r.StartTime && dto.EndTime <= r.EndTime
                    || dto.StartTime <= r.StartTime && dto.EndTime >= r.EndTime
                ),
            cancellationToken
        );

        if (hasConflict)
        {
            return Result.Failure<ReservationIdDto>(ReservationErrors.TimeSlotNotAvailable);
        }

        var selectedServices = eventHall
            .Services.Where(s => dto.ServiceIds.Contains(s.Id))
            .ToList();
        decimal totalCost = eventHall.BasePrice + selectedServices.Sum(s => s.AdditionalCost);

        Reservation reservation = new()
        {
            ReservationDate = dto.ReservationDate,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            TotalCost = totalCost,
            Status = ReservationStatus.Pending,
            Notes = dto.Notes,
            ClientId = clientId,
            EventHallId = dto.EventHallId,
            CreatedOnUtc = dateTimeProvider.UtcNow,
        };

        foreach (Service service in selectedServices)
        {
            Domain.ReservationServices.ReservationService reservationService = new()
            {
                ReservationId = reservation.Id,
                ServiceId = service.Id,
                PriceAtReservation = service.AdditionalCost,
                CreatedOnUtc = dateTimeProvider.UtcNow,
            };
            reservation.ReservationServices.Add(reservationService);
        }

        foreach (CreateReservationTaskDto taskDto in dto.Tasks)
        {
            ReservationTask task = new()
            {
                Description = taskDto.Description,
                IsCompleted = false,
                ReservationId = reservation.Id,
                CreatedOnUtc = dateTimeProvider.UtcNow,
            };
            reservation.ReservationTasks.Add(task);
        }

        context.Reservations.Add(reservation);
        await context.SaveChangesAsync(cancellationToken);

        return new ReservationIdDto { ReservationId = reservation.Id };
    }

    public async Task<Result<ReservationIdDto>> UpdateReservationAsync(
        Guid reservationId,
        Guid userId,
        UpdateReservationDto dto,
        CancellationToken cancellationToken = default
    )
    {
        if (dto.EndTime <= dto.StartTime)
        {
            return Result.Failure<ReservationIdDto>(ReservationErrors.InvalidTimeRange);
        }

        Reservation? reservation = await context
            .Reservations.Include(r => r.ReservationServices)
            .Include(r => r.ReservationTasks)
            .Include(r => r.EventHall)
                .ThenInclude(e => e.Services.Where(s => !s.IsDeleted))
            .FirstOrDefaultAsync(r => r.Id == reservationId && !r.IsDeleted, cancellationToken);

        if (reservation is null)
        {
            return Result.Failure<ReservationIdDto>(ReservationErrors.NotFound);
        }

        if (reservation.ClientId != userId)
        {
            return Result.Failure<ReservationIdDto>(ReservationErrors.NotOwned);
        }

        if (
            reservation.Status == ReservationStatus.Confirmed
            || reservation.Status == ReservationStatus.Completed
        )
        {
            return Result.Failure<ReservationIdDto>(ReservationErrors.CannotModify);
        }

        if (reservation.Status == ReservationStatus.Cancelled)
        {
            return Result.Failure<ReservationIdDto>(ReservationErrors.AlreadyCancelled);
        }

        var eventHallServiceIds = reservation.EventHall.Services.Select(s => s.Id).ToHashSet();
        foreach (Guid serviceId in dto.ServiceIds)
        {
            if (!eventHallServiceIds.Contains(serviceId))
            {
                return Result.Failure<ReservationIdDto>(ReservationErrors.ServiceNotAvailable);
            }
        }

        bool hasConflict = await context.Reservations.AnyAsync(
            r =>
                r.EventHallId == reservation.EventHallId
                && r.Id != reservationId
                && !r.IsDeleted
                && r.Status != ReservationStatus.Cancelled
                && r.ReservationDate.Date == dto.ReservationDate.Date
                && (
                    dto.StartTime >= r.StartTime && dto.StartTime < r.EndTime
                    || dto.EndTime > r.StartTime && dto.EndTime <= r.EndTime
                    || dto.StartTime <= r.StartTime && dto.EndTime >= r.EndTime
                ),
            cancellationToken
        );

        if (hasConflict)
        {
            return Result.Failure<ReservationIdDto>(ReservationErrors.TimeSlotNotAvailable);
        }

        var selectedServices = reservation
            .EventHall.Services.Where(s => dto.ServiceIds.Contains(s.Id))
            .ToList();
        decimal totalCost =
            reservation.EventHall.BasePrice + selectedServices.Sum(s => s.AdditionalCost);

        reservation.ReservationDate = dto.ReservationDate;
        reservation.StartTime = dto.StartTime;
        reservation.EndTime = dto.EndTime;
        reservation.Notes = dto.Notes;
        reservation.TotalCost = totalCost;
        reservation.UpdatedOnUtc = dateTimeProvider.UtcNow;

        foreach (
            Domain.ReservationServices.ReservationService existingService in reservation.ReservationServices.ToList()
        )
        {
            existingService.IsDeleted = true;
            existingService.UpdatedOnUtc = dateTimeProvider.UtcNow;
        }

        foreach (Service service in selectedServices)
        {
            Domain.ReservationServices.ReservationService reservationService = new()
            {
                ReservationId = reservation.Id,
                ServiceId = service.Id,
                PriceAtReservation = service.AdditionalCost,
                CreatedOnUtc = dateTimeProvider.UtcNow,
            };
            context.ReservationServices.Add(reservationService);
        }

        var existingTaskIds = dto
            .Tasks.Where(t => t.Id.HasValue)
            .Select(t => t.Id!.Value)
            .ToHashSet();

        foreach (
            ReservationTask task in reservation.ReservationTasks.Where(t =>
                !existingTaskIds.Contains(t.Id)
            )
        )
        {
            task.IsDeleted = true;
            task.UpdatedOnUtc = dateTimeProvider.UtcNow;
        }

        foreach (UpdateReservationTaskDto taskDto in dto.Tasks)
        {
            if (taskDto.Id.HasValue)
            {
                ReservationTask? existingTask = reservation.ReservationTasks.FirstOrDefault(t =>
                    t.Id == taskDto.Id.Value
                );
                if (existingTask is not null && !existingTask.IsDeleted)
                {
                    existingTask.Description = taskDto.Description;
                    existingTask.IsCompleted = taskDto.IsCompleted;
                    existingTask.UpdatedOnUtc = dateTimeProvider.UtcNow;
                }
            }
            else
            {
                ReservationTask newTask = new()
                {
                    Description = taskDto.Description,
                    IsCompleted = taskDto.IsCompleted,
                    ReservationId = reservation.Id,
                    CreatedOnUtc = dateTimeProvider.UtcNow,
                };
                context.ReservationTasks.Add(newTask);
            }
        }

        await context.SaveChangesAsync(cancellationToken);

        return new ReservationIdDto { ReservationId = reservation.Id };
    }

    public async Task<Result> CancelReservationAsync(
        Guid reservationId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        Reservation? reservation = await context.Reservations.FirstOrDefaultAsync(
            r => r.Id == reservationId && !r.IsDeleted,
            cancellationToken
        );

        if (reservation is null)
        {
            return Result.Failure(ReservationErrors.NotFound);
        }

        if (reservation.ClientId != userId)
        {
            return Result.Failure(ReservationErrors.NotOwned);
        }

        if (
            reservation.Status == ReservationStatus.Confirmed
            || reservation.Status == ReservationStatus.Completed
        )
        {
            return Result.Failure(ReservationErrors.CannotCancel);
        }

        if (reservation.Status == ReservationStatus.Cancelled)
        {
            return Result.Failure(ReservationErrors.AlreadyCancelled);
        }

        reservation.Status = ReservationStatus.Cancelled;
        reservation.UpdatedOnUtc = dateTimeProvider.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> ConfirmReservationAsync(
        Guid reservationId,
        CancellationToken cancellationToken = default
    )
    {
        Reservation? reservation = await context.Reservations.FirstOrDefaultAsync(
            r => r.Id == reservationId && !r.IsDeleted,
            cancellationToken
        );

        if (reservation is null)
        {
            return Result.Failure(ReservationErrors.NotFound);
        }

        if (reservation.Status != ReservationStatus.Pending)
        {
            return Result.Failure(ReservationErrors.CannotConfirm);
        }

        reservation.Status = ReservationStatus.Confirmed;
        reservation.UpdatedOnUtc = dateTimeProvider.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> CompleteReservationAsync(
        Guid reservationId,
        CancellationToken cancellationToken = default
    )
    {
        Reservation? reservation = await context.Reservations.FirstOrDefaultAsync(
            r => r.Id == reservationId && !r.IsDeleted,
            cancellationToken
        );

        if (reservation is null)
        {
            return Result.Failure(ReservationErrors.NotFound);
        }

        if (reservation.Status != ReservationStatus.Confirmed)
        {
            return Result.Failure(ReservationErrors.CannotComplete);
        }

        reservation.Status = ReservationStatus.Completed;
        reservation.UpdatedOnUtc = dateTimeProvider.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result<ReservationDetailDto>> GetReservationDetailAsync(
        Guid reservationId,
        Guid userId,
        bool isAdmin,
        CancellationToken cancellationToken = default
    )
    {
        Reservation? reservation = await context
            .Reservations.Include(r => r.Client)
            .Include(r => r.EventHall)
            .Include(r => r.ReservationServices.Where(rs => !rs.IsDeleted))
                .ThenInclude(rs => rs.Service)
            .Include(r => r.ReservationTasks.Where(rt => !rt.IsDeleted))
            .FirstOrDefaultAsync(r => r.Id == reservationId && !r.IsDeleted, cancellationToken);

        if (reservation is null)
        {
            return Result.Failure<ReservationDetailDto>(ReservationErrors.NotFound);
        }

        if (!isAdmin && reservation.ClientId != userId)
        {
            return Result.Failure<ReservationDetailDto>(ReservationErrors.NotOwned);
        }

        return new ReservationDetailDto
        {
            Id = reservation.Id,
            ReservationDate = reservation.ReservationDate,
            StartTime = reservation.StartTime,
            EndTime = reservation.EndTime,
            TotalCost = reservation.TotalCost,
            Status = reservation.Status.ToDisplayString(),
            Notes = reservation.Notes,
            CreatedOnUtc = reservation.CreatedOnUtc,
            UpdatedOnUtc = reservation.UpdatedOnUtc,
            Client = new ReservationClientDto
            {
                Id = reservation.Client.Id,
                FirstName = reservation.Client.FirstName,
                LastName = reservation.Client.LastName,
                Email = reservation.Client.Email,
                PhoneNumber = reservation.Client.PhoneNumber,
            },
            EventHall = new ReservationEventHallDto
            {
                Id = reservation.EventHall.Id,
                Name = reservation.EventHall.Name,
                Location = reservation.EventHall.Location,
                BasePrice = reservation.EventHall.BasePrice,
            },
            Services = reservation
                .ReservationServices.Select(rs => new ReservationServiceDto
                {
                    Id = rs.Service.Id,
                    Name = rs.Service.Name,
                    Description = rs.Service.Description,
                    PriceAtReservation = rs.PriceAtReservation,
                })
                .ToList(),
            Tasks = reservation
                .ReservationTasks.Select(rt => new ReservationTaskDto
                {
                    Id = rt.Id,
                    Description = rt.Description,
                    IsCompleted = rt.IsCompleted,
                })
                .ToList(),
        };
    }

    public async Task<Result<List<ReservationSummaryDto>>> GetClientReservationsAsync(
        Guid clientId,
        CancellationToken cancellationToken = default
    )
    {
        List<ReservationSummaryDto> reservations = await context
            .Reservations.Include(r => r.Client)
            .Include(r => r.EventHall)
            .Where(r => r.ClientId == clientId && !r.IsDeleted)
            .Select(r => new ReservationSummaryDto
            {
                Id = r.Id,
                ReservationDate = r.ReservationDate,
                StartTime = r.StartTime,
                EndTime = r.EndTime,
                Status = r.Status.ToDisplayString(),
                ClientName = $"{r.Client.FirstName} {r.Client.LastName}",
                ClientEmail =  r.Client.Email,
                ClientPhone = r.Client.PhoneNumber,
                EventHallName = r.EventHall.Name,
            })
            .ToListAsync(cancellationToken);

        return reservations;
    }
}
