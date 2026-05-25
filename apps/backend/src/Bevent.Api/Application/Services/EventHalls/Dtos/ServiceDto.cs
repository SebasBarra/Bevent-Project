namespace Bevent.Api.Application.Services.EventHalls.Dtos;

public sealed class ServiceDto
{
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required decimal AdditionalCost { get; init; }
}

public sealed class ServiceResponseDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required decimal AdditionalCost { get; init; }
}
