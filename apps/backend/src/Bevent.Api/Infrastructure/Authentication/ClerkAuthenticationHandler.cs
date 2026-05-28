using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Clerk.BackendAPI.Helpers.Jwks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace Bevent.Api.Infrastructure.Authentication;

internal sealed class ClerkAuthenticationOptions : AuthenticationSchemeOptions
{
    public string? SecretKey { get; set; }
    public string[] AllowedOrigins { get; set; } = [];
}

internal sealed class ClerkAuthenticationHandler(
    IOptionsMonitor<ClerkAuthenticationOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder
) : AuthenticationHandler<ClerkAuthenticationOptions>(options, logger, encoder)
{
    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        string? authHeader = Request.Headers.Authorization.FirstOrDefault();

        if (
            string.IsNullOrEmpty(authHeader)
            || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
        )
        {
            return AuthenticateResult.NoResult();
        }

        string token = authHeader["Bearer ".Length..];

        if (string.IsNullOrEmpty(Options.SecretKey))
        {
            Logger.LogWarning("[Clerk Auth] SecretKey no está configurado");
            return AuthenticateResult.Fail("La validación del token no está configurada");
        }

        try
        {
            if (Logger.IsEnabled(LogLevel.Information))
{
    string tokenPreview = token.Length > 20 ? token[..20] : token;

    Logger.LogInformation(
        "[Clerk Auth] Validando token: {TokenPreview}...",
        tokenPreview
    );
}
            var requestOptions = new AuthenticateRequestOptions(
                secretKey: Options.SecretKey,
                authorizedParties: Options.AllowedOrigins
            );

            RequestState requestState = await AuthenticateRequest.AuthenticateRequestAsync(
                Request,
                requestOptions
            );

            if (!requestState.IsAuthenticated)
            {
                Logger.LogWarning("[Clerk Auth] La solicitud no está autenticada por Clerk");
                return AuthenticateResult.Fail("Solicitud no autenticada");
            }

            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(token))
            {
                Logger.LogWarning("[Clerk Auth] No se puede leer el token JWT");
                return AuthenticateResult.Fail("Token JWT inválido");
            }

            JwtSecurityToken jwtToken = handler.ReadJwtToken(token);

            string? clerkUserId = jwtToken.Subject;

            if (string.IsNullOrEmpty(clerkUserId))
            {
                Logger.LogWarning("[Clerk Auth] El token no contiene un subject (sub) válido");
                return AuthenticateResult.Fail("Token inválido: falta el subject");
            }

            string? role = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
            if (string.IsNullOrEmpty(role))
            {
                Logger.LogWarning("[Clerk Auth] El token no contiene el claim 'role'");
                return AuthenticateResult.Fail("Token inválido: falta el rol del usuario");
            }

            string? backendUserId = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            if (string.IsNullOrEmpty(backendUserId))
            {
                Logger.LogWarning("[Clerk Auth] El token no contiene el claim 'userId'");
                return AuthenticateResult.Fail("Token inválido: falta el userId del backend");
            }

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, clerkUserId),
                new(ClaimTypes.Role, role),
                new("backend_user_id", backendUserId),
            };

            if (Logger.IsEnabled(LogLevel.Information))
{
    Logger.LogInformation(
        "[Clerk Auth] ✓ Token validado exitosamente. ClerkUserId: {ClerkUserId}, BackendUserId: {BackendUserId}, Role: {Role}",
        clerkUserId,
        backendUserId,
        role
    );
}

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "[Clerk Auth] Error validando token");
            return AuthenticateResult.Fail($"Error de validación: {ex.Message}");
        }
    }

    protected override Task HandleChallengeAsync(AuthenticationProperties properties)
    {
        Response.StatusCode = StatusCodes.Status401Unauthorized;
        Response.ContentType = "application/json";

        var problemDetails = new
        {
            status = 401,
            title = "No autorizado",
            detail = "Se requiere autenticación para acceder a este recurso.",
            type = "https://tools.ietf.org/html/rfc7235#section-3.1",
        };

        return Response.WriteAsJsonAsync(problemDetails);
    }

    protected override Task HandleForbiddenAsync(AuthenticationProperties properties)
    {
        Response.StatusCode = StatusCodes.Status403Forbidden;
        Response.ContentType = "application/json";

        var problemDetails = new
        {
            status = 403,
            title = "Prohibido",
            detail = "No tiene permisos para acceder a este recurso.",
            type = "https://tools.ietf.org/html/rfc7231#section-6.5.3",
        };

        return Response.WriteAsJsonAsync(problemDetails);
    }
}
