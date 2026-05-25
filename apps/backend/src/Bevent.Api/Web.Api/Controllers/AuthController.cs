using Bevent.Api.Application.Services.Auth;
using Bevent.Api.Application.Services.Auth.Dtos;
using Bevent.Api.SharedKernel;
using Bevent.Api.Web.Api.Extensions;
using Bevent.Api.Web.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bevent.Api.Web.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost]
    [Route("register")]
    [ProducesResponseType(typeof(UserIdDto), StatusCodes.Status200OK)]
    [AllowAnonymous]
    public async Task<IResult> RegisterUser(
        [FromBody] RegisterUserDto dto,
        CancellationToken cancellationToken = default
    )
    {
        Result<UserIdDto> result = await authService.RegisterUserAsync(dto, cancellationToken);
        return result.Match(Results.Ok, ProblemResultFactory.Problem);
    }
}
