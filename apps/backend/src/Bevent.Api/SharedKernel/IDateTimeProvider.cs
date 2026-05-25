namespace Bevent.Api.SharedKernel;

public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
}
