using Bevent.Api.SharedKernel;

namespace Bevent.Api.Web.Api.Infrastructure;

internal static class ProblemResultFactory
{
    public static IResult Problem(Result result)
    {
        if (result.IsSuccess)
        {
            throw new InvalidOperationException();
        }

        return Results.Problem(
            title: GetTitle(result.Error),
            detail: GetDetail(result.Error),
            type: GetType(result.Error.Type),
            statusCode: GetStatusCode(result.Error.Type)
        );

        static string GetTitle(Error error) =>
            error.Type switch
            {
                ErrorType.Problem => error.Code,
                ErrorType.Unauthorized => error.Code,
                ErrorType.Forbidden => error.Code,
                ErrorType.NotFound => error.Code,
                ErrorType.Conflict => error.Code,
                _ => "Error Interno del Servidor",
            };

        static string GetDetail(Error error) =>
            error.Type switch
            {
                ErrorType.Problem => error.Description,
                ErrorType.Unauthorized => error.Description,
                ErrorType.Forbidden => error.Description,
                ErrorType.NotFound => error.Description,
                ErrorType.Conflict => error.Description,
                _ => "Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.",
            };

        static string GetType(ErrorType errorType) =>
            errorType switch
            {
                ErrorType.Problem => "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                ErrorType.Unauthorized => "https://tools.ietf.org/html/rfc7235#section-3.1",
                ErrorType.Forbidden => "https://tools.ietf.org/html/rfc7231#section-6.5.3",
                ErrorType.NotFound => "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                ErrorType.Conflict => "https://tools.ietf.org/html/rfc7231#section-6.5.8",
                _ => "https://tools.ietf.org/html/rfc7231#section-6.6.1",
            };

        static int GetStatusCode(ErrorType errorType) =>
            errorType switch
            {
                ErrorType.Problem => StatusCodes.Status400BadRequest,
                ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
                ErrorType.Forbidden => StatusCodes.Status403Forbidden,
                ErrorType.NotFound => StatusCodes.Status404NotFound,
                ErrorType.Conflict => StatusCodes.Status409Conflict,
                _ => StatusCodes.Status500InternalServerError,
            };
    }
}
