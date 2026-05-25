using Bevent.Api.SharedKernel;

namespace Bevent.Api.Infrastructure.Time;

internal sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}
