using Bevent.Api.Application.Abstractions.Data;
using Bevent.Api.Application.Abstractions.DataTransfer;
using Bevent.Api.Application.Services.EventHalls.Dtos;
using Bevent.Api.Application.Services.Reservations.Dtos;
using Bevent.Api.Domain.AvailableSchedules;
using Bevent.Api.Domain.EventHallImages;
using Bevent.Api.Domain.EventHalls;
using Bevent.Api.Domain.Reservations;
using Bevent.Api.Domain.Services;
using Bevent.Api.SharedKernel;
using Microsoft.EntityFrameworkCore;

namespace Bevent.Api.Application.Services.EventHalls;

public sealed class EventHallService(
    IApplicationDbContext context,
    IDateTimeProvider dateTimeProvider,
    IImageStorageService imageStorageService
)
{
    public async Task<Result<EventHallIdDto>> CreateEventHallAsync(
        Guid adminId,
        CreateEventHallDto dto,
        List<FileUpload>? imageFiles = null,
        CancellationToken cancellationToken = default
    )
    {
        // Validate available schedules
        foreach (AvailableScheduleDto schedule in dto.AvailableSchedules)
        {
            if (schedule.DayOfWeek is < 0 or > 6)
            {
                return Result.Failure<EventHallIdDto>(AvailableScheduleErrors.InvalidDayOfWeek);
            }

            if (schedule.EndTime <= schedule.StartTime)
            {
                return Result.Failure<EventHallIdDto>(AvailableScheduleErrors.InvalidTimeRange);
            }
        }

        EventHall eventHall = new()
        {
            Name = dto.Name,
            Description = dto.Description,
            MaxCapacity = dto.MaxCapacity,
            BasePrice = dto.BasePrice,
            Location = dto.Location,
            AdminId = adminId,
            CreatedOnUtc = dateTimeProvider.UtcNow,
        };

        // Add services
        foreach (ServiceDto serviceDto in dto.Services)
        {
            Service service = new()
            {
                Name = serviceDto.Name,
                Description = serviceDto.Description,
                AdditionalCost = serviceDto.AdditionalCost,
                EventHallId = eventHall.Id,
                CreatedOnUtc = dateTimeProvider.UtcNow,
            };
            eventHall.Services.Add(service);
        }

        // Add available schedules
        foreach (AvailableScheduleDto scheduleDto in dto.AvailableSchedules)
        {
            AvailableSchedule schedule = new()
            {
                DayOfWeek = scheduleDto.DayOfWeek,
                StartTime = scheduleDto.StartTime,
                EndTime = scheduleDto.EndTime,
                EventHallId = eventHall.Id,
                CreatedOnUtc = dateTimeProvider.UtcNow,
            };
            eventHall.AvailableSchedules.Add(schedule);
        }

        // Upload images to Cloudinary
        if (imageFiles is not null && imageFiles.Count > 0)
        {
            foreach (FileUpload imageFile in imageFiles)
            {
                Result<(Uri Url, string PublicId)> uploadResult = await imageStorageService.UploadImageAsync(imageFile, cancellationToken: cancellationToken);
                if (uploadResult.IsSuccess)
                {
                    eventHall.EventHallImages.Add(new EventHallImage
                    {
                        ImageUrl = uploadResult.Value.Url,
                        ImagePublicId = uploadResult.Value.PublicId,
                        Description = $"{eventHall.Name} Image",
                        EventHallId = eventHall.Id,
                        CreatedOnUtc = dateTimeProvider.UtcNow
                    });
                }
            }
        }
        else
        {
            // Default image
            eventHall.EventHallImages.Add(new EventHallImage
            {
                ImageUrl = new Uri("https://res.cloudinary.com/dhbpvtom7/image/upload/v1779945310/DefaultImage_pbb47u.jpg"),
                ImagePublicId = "DefaultImage_pbb47u",
                Description = $"{eventHall.Name} Default Image",
                EventHallId = eventHall.Id,
                CreatedOnUtc = dateTimeProvider.UtcNow
            });
        }

        context.EventHalls.Add(eventHall);
        await context.SaveChangesAsync(cancellationToken);

        return new EventHallIdDto { EventHallId = eventHall.Id };
    }

    public async Task<Result<EventHallIdDto>> UpdateEventHallAsync(
        Guid adminId,
        Guid eventHallId,
        UpdateEventHallDto dto,
        List<FileUpload>? imageFiles = null,
        CancellationToken cancellationToken = default
    )
    {
        EventHall? eventHall = await context
            .EventHalls.Include(e => e.Services)
            .Include(e => e.AvailableSchedules)
            .Include(e => e.EventHallImages)
            .FirstOrDefaultAsync(e => e.Id == eventHallId && !e.IsDeleted, cancellationToken);

        if (eventHall is null)
        {
            return Result.Failure<EventHallIdDto>(EventHallErrors.NotFound);
        }

        // Verify ownership
        if (eventHall.AdminId != adminId)
        {
            return Result.Failure<EventHallIdDto>(EventHallErrors.NotOwned);
        }

        // Validate available schedules
        foreach (UpdateAvailableScheduleDto schedule in dto.AvailableSchedules)
        {
            if (schedule.DayOfWeek is < 0 or > 6)
            {
                return Result.Failure<EventHallIdDto>(AvailableScheduleErrors.InvalidDayOfWeek);
            }

            if (schedule.EndTime <= schedule.StartTime)
            {
                return Result.Failure<EventHallIdDto>(AvailableScheduleErrors.InvalidTimeRange);
            }
        }

        // Update basic properties
        eventHall.Name = dto.Name;
        eventHall.Description = dto.Description;
        eventHall.MaxCapacity = dto.MaxCapacity;
        eventHall.BasePrice = dto.BasePrice;
        eventHall.Location = dto.Location;
        eventHall.UpdatedOnUtc = dateTimeProvider.UtcNow;

        // Update services
        var existingServiceIds = dto
            .Services.Where(s => s.Id.HasValue)
            .Select(s => s.Id!.Value)
            .ToHashSet();

        // Remove services that are not in the update list
        var servicesToRemove = eventHall
            .Services.Where(s => !existingServiceIds.Contains(s.Id))
            .ToList();
        foreach (Service service in servicesToRemove)
        {
            service.IsDeleted = true;
            service.UpdatedOnUtc = dateTimeProvider.UtcNow;
        }

        // Update or add services
        foreach (UpdateServiceDto serviceDto in dto.Services)
        {
            if (serviceDto.Id.HasValue)
            {
                Service? existingService = eventHall.Services.FirstOrDefault(s =>
                    s.Id == serviceDto.Id.Value
                );
                if (existingService is not null && !existingService.IsDeleted)
                {
                    // Note: Service properties are init-only, so we need to handle this differently
                    // For now, we'll mark as deleted and create new
                    existingService.IsDeleted = true;
                    existingService.UpdatedOnUtc = dateTimeProvider.UtcNow;

                    Service newService = new()
                    {
                        Name = serviceDto.Name,
                        Description = serviceDto.Description,
                        AdditionalCost = serviceDto.AdditionalCost,
                        EventHallId = eventHall.Id,
                        CreatedOnUtc = dateTimeProvider.UtcNow,
                    };
                    context.Services.Add(newService);
                }
            }
            else
            {
                Service newService = new()
                {
                    Name = serviceDto.Name,
                    Description = serviceDto.Description,
                    AdditionalCost = serviceDto.AdditionalCost,
                    EventHallId = eventHall.Id,
                    CreatedOnUtc = dateTimeProvider.UtcNow,
                };
                context.Services.Add(newService);
            }
        }

        // Update available schedules
        var existingScheduleIds = dto
            .AvailableSchedules.Where(s => s.Id.HasValue)
            .Select(s => s.Id!.Value)
            .ToHashSet();

        // Remove schedules that are not in the update list
        var schedulesToRemove = eventHall
            .AvailableSchedules.Where(s => !existingScheduleIds.Contains(s.Id))
            .ToList();
        foreach (AvailableSchedule schedule in schedulesToRemove)
        {
            schedule.IsDeleted = true;
            schedule.UpdatedOnUtc = dateTimeProvider.UtcNow;
        }

        // Update or add schedules
        foreach (UpdateAvailableScheduleDto scheduleDto in dto.AvailableSchedules)
        {
            if (scheduleDto.Id.HasValue)
            {
                AvailableSchedule? existingSchedule = eventHall.AvailableSchedules.FirstOrDefault(
                    s => s.Id == scheduleDto.Id.Value
                );
                if (existingSchedule is not null && !existingSchedule.IsDeleted)
                {
                    existingSchedule.DayOfWeek = scheduleDto.DayOfWeek;
                    existingSchedule.StartTime = scheduleDto.StartTime;
                    existingSchedule.EndTime = scheduleDto.EndTime;
                    existingSchedule.UpdatedOnUtc = dateTimeProvider.UtcNow;
                }
            }
            else
            {
                AvailableSchedule newSchedule = new()
                {
                    DayOfWeek = scheduleDto.DayOfWeek,
                    StartTime = scheduleDto.StartTime,
                    EndTime = scheduleDto.EndTime,
                    EventHallId = eventHall.Id,
                    CreatedOnUtc = dateTimeProvider.UtcNow,
                };
                context.AvailableSchedules.Add(newSchedule);
            }
        }

        // Update images if new ones are provided
        if (imageFiles is not null && imageFiles.Count > 0)
        {
            // Soft-delete old images and remove from Cloudinary (except the default one)
            // NOTE: Using soft-delete (IsDeleted = true) instead of context.Remove() + .Clear()
            // to avoid DbUpdateConcurrencyException caused by EF Core double-tracking the same entities.
            foreach (EventHallImage oldImage in eventHall.EventHallImages)
            {
                if (oldImage.ImagePublicId != "DefaultImage_pbb47u")
                {
                    await imageStorageService.DeleteImageAsync(oldImage.ImagePublicId, cancellationToken);
                }
                oldImage.IsDeleted = true;
                oldImage.UpdatedOnUtc = dateTimeProvider.UtcNow;
            }

            // Upload and register new images
            foreach (FileUpload imageFile in imageFiles)
            {
                Result<(Uri Url, string PublicId)> uploadResult = await imageStorageService.UploadImageAsync(imageFile, cancellationToken: cancellationToken);
                if (uploadResult.IsSuccess)
                {
                    context.EventHallImages.Add(new EventHallImage
                    {
                        ImageUrl = uploadResult.Value.Url,
                        ImagePublicId = uploadResult.Value.PublicId,
                        Description = $"{eventHall.Name} Image",
                        EventHallId = eventHall.Id,
                        CreatedOnUtc = dateTimeProvider.UtcNow
                    });
                }
            }
        }

        await context.SaveChangesAsync(cancellationToken);

        return new EventHallIdDto { EventHallId = eventHall.Id };
    }

    public async Task<Result> DeleteEventHallAsync(
        Guid adminId,
        Guid eventHallId,
        CancellationToken cancellationToken = default
    )
    {
        EventHall? eventHall = await context
            .EventHalls.Include(e => e.Reservations)
            .Include(e => e.Services)
            .Include(e => e.AvailableSchedules)
            .Include(e => e.EventHallImages)
            .FirstOrDefaultAsync(e => e.Id == eventHallId && !e.IsDeleted, cancellationToken);

        if (eventHall is null)
        {
            return Result.Failure(EventHallErrors.NotFound);
        }

        // Verify ownership
        if (eventHall.AdminId != adminId)
        {
            return Result.Failure(EventHallErrors.NotOwned);
        }

        // Check for active reservations (Pending or Confirmed)
        bool hasActiveReservations = eventHall.Reservations.Any(r =>
            !r.IsDeleted
            && (r.Status == ReservationStatus.Pending || r.Status == ReservationStatus.Confirmed)
        );

        if (hasActiveReservations)
        {
            return Result.Failure(EventHallErrors.HasActiveReservations);
        }

        // Soft delete
        eventHall.IsDeleted = true;
        eventHall.UpdatedOnUtc = dateTimeProvider.UtcNow;

        // Also soft delete related services and schedules
        foreach (Service service in eventHall.Services)
        {
            service.IsDeleted = true;
            service.UpdatedOnUtc = dateTimeProvider.UtcNow;
        }

        foreach (AvailableSchedule schedule in eventHall.AvailableSchedules)
        {
            schedule.IsDeleted = true;
            schedule.UpdatedOnUtc = dateTimeProvider.UtcNow;
        }

        // Soft-delete images and remove from Cloudinary (except the default one)
        // NOTE: Using soft-delete instead of context.Remove() + .Clear() to avoid
        // DbUpdateConcurrencyException from EF Core double-tracking the same entities.
        foreach (EventHallImage img in eventHall.EventHallImages)
        {
            if (img.ImagePublicId != "DefaultImage_pbb47u")
            {
                await imageStorageService.DeleteImageAsync(img.ImagePublicId, cancellationToken);
            }
            img.IsDeleted = true;
            img.UpdatedOnUtc = dateTimeProvider.UtcNow;
        }

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result<List<EventHallListItemDto>>> GetAllEventHallsAsync(
        Guid? adminId = null,
        Guid? clientId = null,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<EventHall> eventHalls = context.EventHalls.Where(e => !e.IsDeleted);

        if (clientId is not null)
        {
            HashSet<Guid> eventHallIdsWithPendingReservations = await context
                .Reservations.Where(r =>
                    r.ClientId == clientId && !r.IsDeleted && r.Status == ReservationStatus.Pending
                )
                .Select(r => r.EventHallId)
                .ToHashSetAsync(cancellationToken);

            eventHalls = eventHalls.Where(e => !eventHallIdsWithPendingReservations.Contains(e.Id));
        }

        if (adminId is not null)
        {
            eventHalls = eventHalls.Where(e => e.AdminId == adminId);
        }

        List<EventHallListItemDto> response = await eventHalls
            .Include(e => e.EventHallImages)
            .Select(e => new EventHallListItemDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                MaxCapacity = e.MaxCapacity,
                BasePrice = e.BasePrice,
                Location = e.Location,
                EventHallImages = e.EventHallImages.Select(img => new EventHallImageDto
                {
                    Id = img.Id,
                    ImageUrl = img.ImageUrl.ToString(),
                    ImagePublicId = img.ImagePublicId,
                    Description = img.Description
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        return response;
    }

    public async Task<Result<EventHallResponseDto>> GetEventHallByIdAsync(
        Guid eventHallId,
        CancellationToken cancellationToken = default
    )
    {
        EventHall? eventHall = await context
            .EventHalls.Include(e => e.Services.Where(s => !s.IsDeleted))
            .Include(e => e.AvailableSchedules.Where(a => !a.IsDeleted))
            .Include(e => e.EventHallImages)
            .FirstOrDefaultAsync(e => e.Id == eventHallId && !e.IsDeleted, cancellationToken);

        if (eventHall is null)
        {
            return Result.Failure<EventHallResponseDto>(EventHallErrors.NotFound);
        }

        return new EventHallResponseDto
        {
            Id = eventHall.Id,
            Name = eventHall.Name,
            Description = eventHall.Description,
            MaxCapacity = eventHall.MaxCapacity,
            BasePrice = eventHall.BasePrice,
            Location = eventHall.Location,
            CreatedOnUtc = eventHall.CreatedOnUtc,
            UpdatedOnUtc = eventHall.UpdatedOnUtc,
            Services = eventHall
                .Services.Select(s => new ServiceResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    AdditionalCost = s.AdditionalCost,
                })
                .ToList(),
            AvailableSchedules = eventHall
                .AvailableSchedules.Select(a => new AvailableScheduleResponseDto
                {
                    Id = a.Id,
                    DayOfWeek = a.DayOfWeek,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime,
                })
                .ToList(),
            EventHallImages = eventHall
                .EventHallImages.Select(img => new EventHallImageDto
                {
                    Id = img.Id,
                    ImageUrl = img.ImageUrl.ToString(),
                    ImagePublicId = img.ImagePublicId,
                    Description = img.Description,
                })
                .ToList(),
        };
    }

    public async Task<Result<EventHallAdminDetailDto>> GetEventHallAdminDetailAsync(
        Guid adminId,
        Guid eventHallId,
        CancellationToken cancellationToken = default
    )
    {
        EventHall? eventHall = await context
            .EventHalls.Include(e => e.Services.Where(s => !s.IsDeleted))
            .Include(e => e.AvailableSchedules.Where(a => !a.IsDeleted))
            .Include(e => e.EventHallImages)
            .Include(e =>
                e.Reservations.Where(r =>
                    !r.IsDeleted
                    && (
                        r.Status == ReservationStatus.Pending
                        || r.Status == ReservationStatus.Confirmed
                    )
                )
            )
                .ThenInclude(r => r.Client)
            .FirstOrDefaultAsync(e => e.Id == eventHallId && !e.IsDeleted, cancellationToken);

        if (eventHall is null)
        {
            return Result.Failure<EventHallAdminDetailDto>(EventHallErrors.NotFound);
        }

        // Verify ownership
        if (eventHall.AdminId != adminId)
        {
            return Result.Failure<EventHallAdminDetailDto>(EventHallErrors.NotOwned);
        }

        return new EventHallAdminDetailDto
        {
            Id = eventHall.Id,
            Name = eventHall.Name,
            Description = eventHall.Description,
            MaxCapacity = eventHall.MaxCapacity,
            BasePrice = eventHall.BasePrice,
            Location = eventHall.Location,
            CreatedOnUtc = eventHall.CreatedOnUtc,
            UpdatedOnUtc = eventHall.UpdatedOnUtc,
            Services = eventHall
                .Services.Select(s => new ServiceResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    AdditionalCost = s.AdditionalCost,
                })
                .ToList(),
            AvailableSchedules = eventHall
                .AvailableSchedules.Select(a => new AvailableScheduleResponseDto
                {
                    Id = a.Id,
                    DayOfWeek = a.DayOfWeek,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime,
                })
                .ToList(),
            EventHallImages = eventHall
                .EventHallImages.Select(img => new EventHallImageDto
                {
                    Id = img.Id,
                    ImageUrl = img.ImageUrl.ToString(),
                    ImagePublicId = img.ImagePublicId,
                    Description = img.Description,
                })
                .ToList(),
            PendingReservations = eventHall
                .Reservations.Select(r => new ReservationSummaryDto
                {
                    Id = r.Id,
                    ReservationDate = r.ReservationDate,
                    StartTime = r.StartTime,
                    EndTime = r.EndTime,
                    Status = r.Status.ToDisplayString(),
                    ClientName = $"{r.Client.FirstName} {r.Client.LastName}",
                    ClientEmail = r.Client.Email,
                    ClientPhone = r.Client.PhoneNumber,
                    EventHallName = eventHall.Name,
                })
                .ToList(),
        };
    }
}

