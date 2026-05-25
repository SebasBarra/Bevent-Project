using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.Users;

public enum UserRole
{
    Client = 0,
    Admin = 1,
}

public static class UserRoleExtensions
{
    public static UserRole? ParseUserRole(this string? role)
    {
        return role switch
        {
            "Cliente" => UserRole.Client,
            "Administrador" => UserRole.Admin,
            _ => null,
        };
    }

    public static string ToDisplayString(this UserRole role)
    {
        return role switch
        {
            UserRole.Client => "Cliente",
            UserRole.Admin => "Administrador",
            _ => throw new ArgumentOutOfRangeException(nameof(role), role, null),
        };
    }
}

public static class UserRoleErrors
{
    public static Error NotFound(string? role) =>
        Error.NotFound("UserRole.NotFound", $"El rol del usuario '{role}' no fue encontrado");
}
