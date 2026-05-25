using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.AvailableSchedules;

public static class AvailableScheduleErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "AvailableSchedule.NotFound",
        "El horario disponible no fue encontrado."
    );

    public static readonly Error InvalidTimeRange = Error.Problem(
        "AvailableSchedule.InvalidTimeRange",
        "La hora de fin debe ser mayor a la hora de inicio."
    );

    public static readonly Error InvalidDayOfWeek = Error.Problem(
        "AvailableSchedule.InvalidDayOfWeek",
        "El día de la semana debe estar entre 0 (Domingo) y 6 (Sábado)."
    );
}

