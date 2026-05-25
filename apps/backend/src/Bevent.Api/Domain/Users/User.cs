using Bevent.Api.Domain.EventHalls;
using Bevent.Api.Domain.Reservations;
using Bevent.Api.SharedKernel;

namespace Bevent.Api.Domain.Users;

public sealed class User : Entity
{
    public required string ClerkId { get; init; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public required UserRole Role { get; set; }

    public List<Reservation> Reservations { get; set; } = [];
    public List<EventHall> EventHalls { get; set; } = [];
}
