using Bevent.Api.Application.Abstractions.Data;
using Bevent.Api.Application.Services.Auth.Dtos;
using Bevent.Api.Domain.Users;
using Bevent.Api.SharedKernel;
using Microsoft.EntityFrameworkCore;

namespace Bevent.Api.Application.Services.Auth;

public sealed class AuthService(IApplicationDbContext context, IDateTimeProvider dateTimeProvider)
{
    public async Task<Result<UserIdDto>> RegisterUserAsync(
        RegisterUserDto dto,
        CancellationToken cancellationToken = default
    )
    {
        bool emailExists = await context
            .Users.Where(u => u.Email == dto.Email)
            .AnyAsync(cancellationToken);

        if (emailExists)
        {
            return Result.Failure<UserIdDto>(UserErrors.EmailConflict);
        }

        UserRole? role = dto.Role.ParseUserRole();

        if (role is null)
        {
            return Result.Failure<UserIdDto>(UserRoleErrors.NotFound(dto.Role));
        }

        var newUser = new User
        {
            ClerkId = dto.ClerkId,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PhoneNumber = dto.PhoneNumber,
            Role = role.Value,
            CreatedOnUtc = dateTimeProvider.UtcNow,
        };

        context.Users.Add(newUser);

        await context.SaveChangesAsync(cancellationToken);

        return new UserIdDto { UserId = newUser.Id };
    }
}
