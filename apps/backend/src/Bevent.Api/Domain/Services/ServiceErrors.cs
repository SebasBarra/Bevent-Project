using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.Services;

public static class ServiceErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Service.NotFound",
        "El servicio no fue encontrado."
    );
}

