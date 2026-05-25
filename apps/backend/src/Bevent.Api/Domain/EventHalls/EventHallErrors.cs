using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.EventHalls;

public static class EventHallErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "EventHall.NotFound",
        "El salón de eventos no fue encontrado."
    );

    public static readonly Error NotOwned = Error.Forbidden(
        "EventHall.NotOwned",
        "No tienes permisos para modificar este salón de eventos."
    );

    public static readonly Error HasActiveReservations = Error.Conflict(
        "EventHall.HasActiveReservations",
        "No se puede eliminar el salón porque tiene reservaciones activas."
    );
}
