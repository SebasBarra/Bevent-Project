using Bevent.Api.Application.Abstractions.Authentication;
using Bevent.Api.Application.Services.Reservations;
using Bevent.Api.Application.Services.Reservations.Dtos;
using Bevent.Api.Domain.Users;
using Bevent.Api.SharedKernel;
using Bevent.Api.Web.Api.Extensions;
using Bevent.Api.Web.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bevent.Api.Web.Api.Controllers;

[ApiController]
[Route("api/reservations")]
[Authorize]
public sealed class ReservationController(
    ReservationService reservationService,
    IUserContext userContext
) : ControllerBase
{
    /// <summary>
    /// Crea una nueva reservación (solo clientes)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = Role.Client)]
    [ProducesResponseType(typeof(ReservationIdDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IResult> CreateReservation(
        [FromBody] CreateReservationDto dto,
        CancellationToken cancellationToken = default
    )
    {
        Result<ReservationIdDto> result = await reservationService.CreateReservationAsync(
            userContext.UserId,
            dto,
            cancellationToken
        );
        return result.Match(Results.Ok, ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Actualiza una reservación existente (solo el cliente propietario, si está pendiente)
    /// </summary>
    [HttpPut("{reservationId:guid}")]
    [Authorize(Roles = Role.Client)]
    [ProducesResponseType(typeof(ReservationIdDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IResult> UpdateReservation(
        [FromRoute] Guid reservationId,
        [FromBody] UpdateReservationDto dto,
        CancellationToken cancellationToken = default
    )
    {
        Result<ReservationIdDto> result = await reservationService.UpdateReservationAsync(
            reservationId,
            userContext.UserId,
            dto,
            cancellationToken
        );
        return result.Match(Results.Ok, ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Cancela una reservación (solo el cliente propietario, si está pendiente)
    /// </summary>
    [HttpDelete("{reservationId:guid}")]
    [Authorize(Roles = Role.Client)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IResult> CancelReservation(
        [FromRoute] Guid reservationId,
        CancellationToken cancellationToken = default
    )
    {
        Result result = await reservationService.CancelReservationAsync(
            reservationId,
            userContext.UserId,
            cancellationToken
        );
        return result.Match(() => Results.NoContent(), ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Confirma una reservación pendiente (solo administradores)
    /// </summary>
    [HttpPost("{reservationId:guid}/confirm")]
    [Authorize(Roles = Role.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IResult> ConfirmReservation(
        [FromRoute] Guid reservationId,
        CancellationToken cancellationToken = default
    )
    {
        Result result = await reservationService.ConfirmReservationAsync(
            reservationId,
            cancellationToken
        );
        return result.Match(() => Results.NoContent(), ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Marca una reservación como completada (solo administradores)
    /// </summary>
    [HttpPost("{reservationId:guid}/complete")]
    [Authorize(Roles = Role.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IResult> CompleteReservation(
        [FromRoute] Guid reservationId,
        CancellationToken cancellationToken = default
    )
    {
        Result result = await reservationService.CompleteReservationAsync(
            reservationId,
            cancellationToken
        );
        return result.Match(() => Results.NoContent(), ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Obtiene el detalle de una reservación
    /// </summary>
    [HttpGet("{reservationId:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ReservationDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IResult> GetReservationDetail(
        [FromRoute] Guid reservationId,
        CancellationToken cancellationToken = default
    )
    {
        bool isAdmin = userContext.Role == UserRole.Admin;
        Result<ReservationDetailDto> result = await reservationService.GetReservationDetailAsync(
            reservationId,
            userContext.UserId,
            isAdmin,
            cancellationToken
        );
        return result.Match(Results.Ok, ProblemResultFactory.Problem);
    }

    /// <summary>
    /// Obtiene todas las reservaciones del cliente autenticado
    /// </summary>
    [HttpGet("my-reservations")]
    [Authorize(Roles = Role.Client)]
    [ProducesResponseType(typeof(List<ReservationSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IResult> GetMyReservations(CancellationToken cancellationToken = default)
    {
        Result<List<ReservationSummaryDto>> result =
            await reservationService.GetClientReservationsAsync(
                userContext.UserId,
                cancellationToken
            );
        return result.Match(Results.Ok, ProblemResultFactory.Problem);
    }
}
