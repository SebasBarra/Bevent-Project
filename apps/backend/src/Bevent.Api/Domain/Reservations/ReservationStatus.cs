using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.Reservations;

public enum ReservationStatus
{
    Pending = 0,
    Confirmed = 1,
    Cancelled = 2,
    Completed = 3,
}

public static class ReservationStatusExtensions
{
    public static ReservationStatus? ParseReservationStatus(this string? reservationStatus)
    {
        return reservationStatus switch
        {
            "Pendiente" => ReservationStatus.Pending,
            "Confirmado" => ReservationStatus.Confirmed,
            "Cancelado" => ReservationStatus.Cancelled,
            "Completado" => ReservationStatus.Completed,
            _ => null,
        };
    }

    public static string ToDisplayString(this ReservationStatus reservationStatus)
    {
        return reservationStatus switch
        {
            ReservationStatus.Pending => "Pendiente",
            ReservationStatus.Confirmed => "Confirmado",
            ReservationStatus.Cancelled => "Cancelado",
            ReservationStatus.Completed => "Completado",
            _ => throw new ArgumentOutOfRangeException(
                nameof(reservationStatus),
                reservationStatus,
                null
            ),
        };
    }
}

public static class ReservationStatusErrors
{
    public static Error NotFound(string? reservationStatus) =>
        Error.NotFound(
            "ReservationStatus.NotFound",
            $"El estado de la reserva '{reservationStatus}' no fue encontrado"
        );
}
