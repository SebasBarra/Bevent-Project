using Bevent.Api.Domain.Users;

namespace Bevent.Api.Application.Abstractions.Authentication;

public interface IUserContext
{
    /// <summary>
    /// ID del usuario en el backend (extraído del unsafe_metadata de Clerk).
    /// </summary>
    Guid UserId { get; }

    /// <summary>
    /// Subject/ID del usuario en Clerk.
    /// </summary>
    string ClerkSubject { get; }

    /// <summary>
    /// Rol del usuario (extraído del unsafe_metadata de Clerk).
    /// </summary>
    UserRole Role { get; }

    /// <summary>
    /// Indica si el usuario está autenticado.
    /// </summary>
    bool IsAuthenticated { get; }
}
