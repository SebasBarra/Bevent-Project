using Bevent.Api.SharedKernel;

namespace Bevent.Api.Application.Services.Results;

public static class StorageErrors
{
    public static readonly Error InvalidFile = Error.Failure(
        "Storage.InvalidFile",
        "El archivo proporcionado es inválido o está vacío"
    );

    public static readonly Error DeleteFailed = Error.Problem(
        "Storage.DeleteFailed",
        "La eliminación de la imagen falló"
    );

    public static readonly Error ImageNotFound = Error.NotFound(
        "Storage.ImageNotFound",
        "La imagen no fue encontrada"
    );

    public static readonly Error NetworkError = Error.Problem(
        "Storage.NetworkError",
        "Ocurrió un error de red al comunicarse con el servicio de almacenamiento"
    );

    public static readonly Error Timeout = Error.Problem(
        "Storage.Timeout",
        "La operación de almacenamiento excedió el tiempo de espera"
    );

    public static Error NoUrl =>
        Error.Problem("Storage.NoUrl", "No se obtuvo URL de la imagen subida");

    public static readonly Error InvalidPublicId = Error.Failure(
        "Storage.InvalidPublicId",
        "El identificador público de la imagen es inválido"
    );

    public static Error ImageUploadFailed(string fileImageName) =>
        Error.Problem(
            "Storage.ImageUpload.Failed",
            $"La carga de la imagen '{fileImageName}' falló"
        );

    public static Error ImageUpdateFailed(string publicId) =>
        Error.Problem(
            "Storage.ImageUpdate.Failed",
            $"La actualización de la imagen con ID '{publicId}' falló"
        );

    public static Error ImageDeleteFailed(string publicId) =>
        Error.Problem(
            "Storage.ImageDelete.Failed",
            $"La eliminación de la imagen con ID '{publicId}' falló"
        );

    public static Error UploadFailedWithStatus(int statusCode, string? error) =>
        Error.Problem(
            "Storage.UploadFailed",
            $"La carga falló con estado [{statusCode}]: {error ?? "Error desconocido"}"
        );

    public static Error DeleteFailedWithReason(string reason) =>
        Error.Problem("Storage.DeleteFailed", $"La eliminación falló: {reason}");
}
