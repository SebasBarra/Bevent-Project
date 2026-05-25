namespace Bevent.Api.Application.Services.Auth.Dtos;

public sealed class RegisterUserDto
{
    public required string ClerkId { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string Email { get; init; }
    public required string PhoneNumber { get; init; }
    public required string Role { get; init; }
}
