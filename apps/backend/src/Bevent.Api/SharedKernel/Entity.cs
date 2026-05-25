namespace Bevent.Api.SharedKernel;

public abstract class Entity : Register
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
}
