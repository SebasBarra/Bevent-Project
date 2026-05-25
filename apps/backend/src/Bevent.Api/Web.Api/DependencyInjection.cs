using Bevent.Api.Web.Api.Configuration.Swagger;
using Bevent.Api.Web.Api.Infrastructure;
using Microsoft.OpenApi;

namespace Bevent.Api.Web.Api;

internal static class DependencyInjection
{
    public static IServiceCollection AddPresentation(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddEndpointsApiExplorer();
        services.AddControllers();
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        return services.AddSecureCors(configuration).AddSwaggerGenWithAuth();
    }

    private static IServiceCollection AddSecureCors(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        string[] origins =
            configuration["AllowedOrigins"]
                ?.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            ?? [];

        services.AddCors(options =>
            options.AddDefaultPolicy(policy =>
                policy
                    .WithOrigins(origins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithExposedHeaders(
                        "Content-Type",
                        "Content-Range",
                        "Content-Disposition",
                        "Content-Description"
                    )
                    .SetPreflightMaxAge(TimeSpan.FromDays(20))
            )
        );

        return services;
    }

    public static IServiceCollection AddSwaggerGenWithAuth(this IServiceCollection services)
    {
        const string securityScheme = "Bearer";

        return services.AddSwaggerGen(o =>
        {
            o.SwaggerDoc("v1", new OpenApiInfo { Title = "Bevent API", Version = "v1" });

            o.CustomSchemaIds(id => id.FullName!.Replace('+', '-'));

            OpenApiSecurityScheme bearerScheme = new()
            {
                Name = "Authorization",
                Description = "Ingrese su token de Clerk en este campo (sin el prefijo 'Bearer')",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
            };

            o.AddSecurityDefinition(securityScheme, bearerScheme);

            o.OperationFilter<SwaggerSecurityOperationFilter>();
        });
    }
}
