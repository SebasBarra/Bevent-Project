using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Bevent.Api.Web.Api.Configuration.Swagger;

internal sealed class SwaggerSecurityOperationFilter : IOperationFilter
{
    private const string AuthenticationScheme = "Bearer";

    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (
            context.ApiDescription.ActionDescriptor.EndpointMetadata.Any(attr =>
                attr is AllowAnonymousAttribute
            )
        )
        {
            return;
        }

        operation.Security =
        [
            new OpenApiSecurityRequirement
            {
                { new OpenApiSecuritySchemeReference(AuthenticationScheme, context.Document), [] },
            },
        ];
    }
}
