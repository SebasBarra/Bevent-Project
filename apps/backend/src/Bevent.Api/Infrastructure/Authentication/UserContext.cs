using System.Security.Claims;
using Bevent.Api.Application.Abstractions.Authentication;
using Bevent.Api.Domain.Users;

namespace Bevent.Api.Infrastructure.Authentication;

public sealed class UserContextUnavailableException()
    : Exception("El contexto de usuario no está disponible");

internal sealed class UserContext(IHttpContextAccessor httpContextAccessor) : IUserContext
{
    private ClaimsPrincipal? User => httpContextAccessor.HttpContext?.User;

    public Guid UserId => User?.GetUserId() ?? throw new UserContextUnavailableException();

    public string ClerkSubject =>
        User?.GetClerkSubject() ?? throw new UserContextUnavailableException();

    public UserRole Role => User?.GetRole() ?? throw new UserContextUnavailableException();

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;
}
