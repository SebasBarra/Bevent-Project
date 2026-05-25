using System.Security.Claims;
using Bevent.Api.Domain.Users;

namespace Bevent.Api.Infrastructure.Authentication;

internal static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal? principal)
    {
        string? userId = principal?.FindFirstValue("backend_user_id");

        return Guid.TryParse(userId, out Guid parsedUserId)
            ? parsedUserId
            : throw new ApplicationException("El ID de usuario del backend no está disponible");
    }

    public static string GetClerkSubject(this ClaimsPrincipal? principal)
    {
        return principal?.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new ApplicationException("El subject de Clerk no está disponible");
    }

    public static UserRole GetRole(this ClaimsPrincipal? principal)
    {
        string? role = principal?.FindFirstValue(ClaimTypes.Role);
        UserRole? parsedRole = role.ParseUserRole();

        return parsedRole
            ?? throw new ApplicationException($"El rol del usuario '{role}' no es válido");
    }
}
