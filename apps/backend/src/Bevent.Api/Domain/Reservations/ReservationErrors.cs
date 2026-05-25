using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.Reservations;

public static class ReservationErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Reservation.NotFound",
        "La reservación no fue encontrada."
    );

    public static readonly Error NotOwned = Error.Forbidden(
        "Reservation.NotOwned",
        "No tienes permisos para modificar esta reservación."
    );

    public static readonly Error CannotModify = Error.Conflict(
        "Reservation.CannotModify",
        "No se puede modificar una reservación que ya está confirmada o completada."
    );

    public static readonly Error CannotCancel = Error.Conflict(
        "Reservation.CannotCancel",
        "No se puede cancelar una reservación que ya está confirmada o completada."
    );

    public static readonly Error AlreadyCancelled = Error.Conflict(
        "Reservation.AlreadyCancelled",
        "La reservación ya está cancelada."
    );

    public static readonly Error InvalidTimeRange = Error.Problem(
        "Reservation.InvalidTimeRange",
        "La hora de fin debe ser mayor a la hora de inicio."
    );

    public static readonly Error InvalidStatus = Error.Problem(
        "Reservation.InvalidStatus",
        "El estado de la reservación no es válido."
    );

    public static readonly Error ServiceNotAvailable = Error.Problem(
        "Reservation.ServiceNotAvailable",
        "Uno o más servicios no están disponibles para este salón."
    );

    public static readonly Error TimeSlotNotAvailable = Error.Conflict(
        "Reservation.TimeSlotNotAvailable",
        "El horario seleccionado no está disponible para este salón."
    );

    public static readonly Error CannotConfirm = Error.Conflict(
        "Reservation.CannotConfirm",
        "Solo se pueden confirmar reservaciones pendientes."
    );

    public static readonly Error CannotComplete = Error.Conflict(
        "Reservation.CannotComplete",
        "Solo se pueden completar reservaciones confirmadas."
    );
}

