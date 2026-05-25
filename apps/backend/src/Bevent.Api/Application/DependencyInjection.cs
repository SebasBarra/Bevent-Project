using Bevent.Api.Application.Services.Auth;
using Bevent.Api.Application.Services.EventHalls;
using Bevent.Api.Application.Services.Reservations;

namespace Bevent.Api.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<AuthService>();
        services.AddScoped<EventHallService>();
        services.AddScoped<ReservationService>();

        return services;
    }
}
