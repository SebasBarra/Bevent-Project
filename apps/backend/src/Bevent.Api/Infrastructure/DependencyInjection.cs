using Bevent.Api.Application.Abstractions.Authentication;
using Bevent.Api.Application.Abstractions.Data;
using Bevent.Api.Infrastructure.Authentication;
using Bevent.Api.Infrastructure.Database;
using Bevent.Api.Infrastructure.Time;
using Bevent.Api.SharedKernel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Bevent.Api.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration
    ) =>
        services
            .AddServices()
            .AddDatabase(configuration)
            .AddHealthChecks(configuration)
            .AddAuthenticationInternal(configuration)
            .AddAuthorization();

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();

        return services;
    }

    private static IServiceCollection AddDatabase(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        string? connectionString = configuration.GetConnectionString("Database");

        services.AddDbContext<ApplicationDbContext>(options =>
            options
                .UseNpgsql(
                    connectionString,
                    npgsqlOptions =>
                        npgsqlOptions.MigrationsHistoryTable(
                            HistoryRepository.DefaultTableName,
                            Schemas.Default
                        )
                )
                .UseSnakeCaseNamingConvention()
        );

        services.AddScoped<IApplicationDbContext>(sp =>
            sp.GetRequiredService<ApplicationDbContext>()
        );

        return services;
    }

    private static IServiceCollection AddHealthChecks(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        IHealthChecksBuilder healthChecksBuilder = services.AddHealthChecks();

        string? dbConnectionString = configuration.GetConnectionString("Database");

        if (!string.IsNullOrEmpty(dbConnectionString))
        {
            healthChecksBuilder.AddNpgSql(dbConnectionString);
        }

        return services;
    }

    private static IServiceCollection AddAuthenticationInternal(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.Configure<ClerkAuthenticationOptions>(options =>
        {
            options.SecretKey = configuration["Clerk:SecretKey"] ?? string.Empty;
            options.AllowedOrigins =
                configuration["AllowedOrigins"]
                    ?.Split(
                        ';',
                        StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries
                    ) ?? [];
        });

        services
            .AddAuthentication("Clerk")
            .AddScheme<ClerkAuthenticationOptions, ClerkAuthenticationHandler>(
                "Clerk",
                options =>
                {
                    options.SecretKey = configuration["Clerk:SecretKey"];
                    options.AllowedOrigins =
                        configuration["AllowedOrigins"]
                            ?.Split(
                                ';',
                                StringSplitOptions.RemoveEmptyEntries
                                    | StringSplitOptions.TrimEntries
                            ) ?? [];
                }
            );

        services.AddHttpContextAccessor();
        services.AddScoped<IUserContext, UserContext>();

        return services;
    }
}
