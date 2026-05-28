using System.Text.Json;
using Bevent.Api.Application.Abstractions.Authentication;
using Bevent.Api.Application.Abstractions.DataTransfer;
using Bevent.Api.Application.Services.EventHalls;
using Bevent.Api.Application.Services.EventHalls.Dtos;
using Bevent.Api.SharedKernel;
using Bevent.Api.Web.Api.Extensions;
using Bevent.Api.Web.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bevent.Api.Web.Api.Controllers;

public sealed class CreateEventHallRequest
{
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required int MaxCapacity { get; init; }
    public required decimal BasePrice { get; init; }
    public required string Location { get; init; }
    public string? Services { get; init; }
    public string? AvailableSchedules { get; init; }
    public List<IFormFile>? Images { get; init; }
}

public sealed class UpdateEventHallRequest
{
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required int MaxCapacity { get; init; }
    public required decimal BasePrice { get; init; }
    public required string Location { get; init; }
    public string? Services { get; init; }
    public string? AvailableSchedules { get; init; }
    public List<IFormFile>? Images { get; init; }
}

[ApiController]
[Route("api/event-halls")]
public sealed class EventHallController(EventHallService eventHallService, IUserContext userContext)
    : ControllerBase
{
    /// <summary>
    /// Crea un nuevo salón de eventos (solo administradores)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = Role.Admin)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(EventHallIdDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IResult> CreateEventHall(
        [FromForm] CreateEventHallRequest request,
        CancellationToken cancellationToken = default
    )
    {
        JsonSerializerOptions jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        List<ServiceDto> services = string.IsNullOrWhiteSpace(request.Services)
            ? []
            : JsonSerializer.Deserialize<List<ServiceDto>>(request.Services, jsonOptions) ?? [];

        List<AvailableScheduleDto> schedules = string.IsNullOrWhiteSpace(request.AvailableSchedules)
            ? []
            : JsonSerializer.Deserialize<List<AvailableScheduleDto>>(request.AvailableSchedules, jsonOptions) ?? [];

        CreateEventHallDto dto = new()
        {
            Name = request.Name,
            Description = request.Description,
            MaxCapacity = request.MaxCapacity,
            BasePrice = request.BasePrice,
            Location = request.Location,
            Services = services,
            AvailableSchedules = schedules
        };

        List<FileUpload> imageFiles = [];
        if (request.Images is not null)
        {
            foreach (IFormFile file in request.Images)
            {
                imageFiles.Add(new FileUpload(
                    file.OpenReadStream(),
                    file.FileName,
                    file.Length
                ));
            }
        }

        Result<EventHallIdDto> result = await eventHallService.CreateEventHallAsync(
            userContext.UserId,
            dto,
            imageFiles,
            cancellationToken
        );
        return result.Match(Results.Ok, ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Actualiza un salón de eventos existente (solo administradores)
    /// </summary>
    [HttpPut("{eventHallId:guid}")]
    [Authorize(Roles = Role.Admin)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(EventHallIdDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IResult> UpdateEventHall(
        [FromRoute] Guid eventHallId,
        [FromForm] UpdateEventHallRequest request,
        CancellationToken cancellationToken = default
    )
    {
        JsonSerializerOptions jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        List<UpdateServiceDto> services = string.IsNullOrWhiteSpace(request.Services)
            ? []
            : JsonSerializer.Deserialize<List<UpdateServiceDto>>(request.Services, jsonOptions) ?? [];

        List<UpdateAvailableScheduleDto> schedules = string.IsNullOrWhiteSpace(request.AvailableSchedules)
            ? []
            : JsonSerializer.Deserialize<List<UpdateAvailableScheduleDto>>(request.AvailableSchedules, jsonOptions) ?? [];

        UpdateEventHallDto dto = new()
        {
            Name = request.Name,
            Description = request.Description,
            MaxCapacity = request.MaxCapacity,
            BasePrice = request.BasePrice,
            Location = request.Location,
            Services = services,
            AvailableSchedules = schedules
        };

        List<FileUpload> imageFiles = [];
        if (request.Images is not null)
        {
            foreach (IFormFile file in request.Images)
            {
                imageFiles.Add(new FileUpload(
                    file.OpenReadStream(),
                    file.FileName,
                    file.Length
                ));
            }
        }

        Result<EventHallIdDto> result = await eventHallService.UpdateEventHallAsync(
            userContext.UserId,
            eventHallId,
            dto,
            imageFiles,
            cancellationToken
        );
        return result.Match(Results.Ok, ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Elimina un salón de eventos (solo administradores)
    /// </summary>
    [HttpDelete("{eventHallId:guid}")]
    [Authorize(Roles = Role.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IResult> DeleteEventHall(
        [FromRoute] Guid eventHallId,
        CancellationToken cancellationToken = default
    )
    {
        Result result = await eventHallService.DeleteEventHallAsync(
            userContext.UserId,
            eventHallId,
            cancellationToken
        );
        return result.Match(() => Results.NoContent(), ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Obtiene todos los salones de eventos (público)
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<EventHallListItemDto>), StatusCodes.Status200OK)]
    public async Task<IResult> GetAllEventHalls(
        [FromQuery] Guid? adminId = null,
        [FromQuery] Guid? clientId = null,
        CancellationToken cancellationToken = default
    )
    {
        Result<List<EventHallListItemDto>> result = await eventHallService.GetAllEventHallsAsync(
            adminId,
            clientId,
            cancellationToken
        );
        return result.Match(Results.Ok, ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Obtiene un salón de eventos por ID (público)
    /// </summary>
    [HttpGet("{eventHallId:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(EventHallResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IResult> GetEventHallById(
        [FromRoute] Guid eventHallId,
        CancellationToken cancellationToken = default
    )
    {
        Result<EventHallResponseDto> result = await eventHallService.GetEventHallByIdAsync(
            eventHallId,
            cancellationToken
        );
        return result.Match(Results.Ok, ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Obtiene el detalle de un salón de eventos para administradores (incluye reservaciones pendientes)
    /// </summary>
    [HttpGet("{eventHallId:guid}/admin")]
    [Authorize(Roles = Role.Admin)]
    [ProducesResponseType(typeof(EventHallAdminDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IResult> GetEventHallAdminDetail(
        [FromRoute] Guid eventHallId,
        CancellationToken cancellationToken = default
    )
    {
        Result<EventHallAdminDetailDto> result =
            await eventHallService.GetEventHallAdminDetailAsync(
                userContext.UserId,
                eventHallId,
                cancellationToken
            );
        return result.Match(Results.Ok, ProblemResultFactory.Problem);
    }
}
