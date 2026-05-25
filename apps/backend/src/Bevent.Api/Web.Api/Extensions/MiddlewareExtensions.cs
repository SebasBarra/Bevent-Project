using Bevent.Api.Web.Api.Middlewares;

namespace Bevent.Api.Web.Api.Extensions;

internal static class MiddlewareExtensions
{
    public static IApplicationBuilder UseRequestContextLogging(this IApplicationBuilder app)
    {
        app.UseMiddleware<RequestContextLoggingMiddleware>();

        return app;
    }
}
