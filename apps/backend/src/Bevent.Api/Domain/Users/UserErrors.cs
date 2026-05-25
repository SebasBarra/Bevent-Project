using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.Users;

public static class UserErrors
{
    public static readonly Error EmailConflict = Error.Conflict(
        "User.Email.Conflict",
        "El email ingresado ya está en uso."
    );
}
