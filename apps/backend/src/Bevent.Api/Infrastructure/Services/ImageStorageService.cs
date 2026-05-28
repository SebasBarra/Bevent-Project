using System.Net;
using Bevent.Api.Application.Abstractions.DataTransfer;
using Bevent.Api.Application.Options;
using Bevent.Api.Application.Services;
using Bevent.Api.Application.Services.Results;
using Bevent.Api.SharedKernel;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;


namespace Bevent.Api.Infrastructure.Services;

internal sealed class ImageStorageService(
    IOptions<CloudinaryOptions> opts,
    ILogger<ImageStorageService> logger
) : IImageStorageService
{
    private readonly Cloudinary _cloudinary = new(
        new Account(opts.Value.CloudName, opts.Value.ApiKey, opts.Value.ApiSecret)
    );

    public async Task<Result<(Uri Url, string PublicId)>> UploadImageAsync(
        FileUpload imageFile,
        string? publicId = null,
        CancellationToken cancellationToken = default
    )
    {
        Result validationResult = ValidateImageFile(imageFile, publicId);
        if (validationResult.IsFailure)
        {
            return Result.Failure<(Uri Url, string PublicId)>(validationResult.Error);
        }

        bool isUpdate = !string.IsNullOrWhiteSpace(publicId);
        string operationType = isUpdate ? "actualización" : "carga";
        string targetPublicId = publicId ?? Guid.NewGuid().ToString();

        logger.LogInformation(
            "📤 Iniciando {Operation} de imagen '{FileName}' con ID: {PublicId}",
            operationType,
            imageFile.Name,
            targetPublicId
        );

        try
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(targetPublicId, imageFile.Content),
                PublicId = targetPublicId,
                UseFilename = false,
                Overwrite = isUpdate,
                UniqueFilename = !isUpdate,
                Invalidate = isUpdate,
            };

            ImageUploadResult? result = await _cloudinary.UploadAsync(
                uploadParams,
                cancellationToken
            );

            return ValidateUploadResult(result, imageFile.Name, targetPublicId, isUpdate);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(
                ex,
                "❌ Error de red al realizar {Operation} de imagen '{FileName}'",
                operationType,
                imageFile.Name
            );
            return Result.Failure<(Uri Url, string PublicId)>(StorageErrors.NetworkError);
        }
        catch (TaskCanceledException ex) when (ex.InnerException is TimeoutException)
        {
            logger.LogError(
                ex,
                "⏰ Timeout al realizar {Operation} de imagen '{FileName}'",
                operationType,
                imageFile.Name
            );
            return Result.Failure<(Uri Url, string PublicId)>(StorageErrors.Timeout);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "💥 Error inesperado al realizar {Operation} de imagen '{FileName}'",
                operationType,
                imageFile.Name
            );
            return Result.Failure<(Uri Url, string PublicId)>(
                isUpdate
                    ? StorageErrors.ImageUpdateFailed(targetPublicId)
                    : StorageErrors.ImageUploadFailed(imageFile.Name)
            );
        }
    }

    public async Task<Result> DeleteImageAsync(
        string publicId,
        CancellationToken cancellationToken = default
    )
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return Result.Failure(StorageErrors.InvalidPublicId);
        }

        logger.LogInformation("🗑️ Eliminando imagen con ID: {PublicId}", publicId);

        try
        {
            var deletionParams = new DeletionParams(publicId);

            DeletionResult? result = await _cloudinary.DestroyAsync(deletionParams);

            return ValidateDeletionResult(result, publicId);
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "❌ Error de red al eliminar imagen con ID: {PublicId}", publicId);
            return Result.Failure(StorageErrors.NetworkError);
        }
        catch (TaskCanceledException ex) when (ex.InnerException is TimeoutException)
        {
            logger.LogError(ex, "⏰ Timeout al eliminar imagen con ID: {PublicId}", publicId);
            return Result.Failure(StorageErrors.Timeout);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "💥 Error inesperado al eliminar imagen con ID: {PublicId}",
                publicId
            );
            return Result.Failure(StorageErrors.ImageDeleteFailed(publicId));
        }
    }

    private Result ValidateImageFile(FileUpload imageFile, string? publicId)
    {
        if (imageFile.Content.Length == 0)
        {
            return Result.Failure(StorageErrors.InvalidFile);
        }

        if (!string.IsNullOrWhiteSpace(publicId) && publicId.Length > 255)
        {
            return Result.Failure(StorageErrors.InvalidPublicId);
        }

        return Result.Success();
    }

    private Result<(Uri Url, string PublicId)> ValidateUploadResult(
        ImageUploadResult? result,
        string fileName,
        string publicId,
        bool isUpdate
    )
    {
        if (result == null)
        {
            logger.LogError("⚠️ Cloudinary retornó resultado nulo para '{FileName}'", fileName);
            return Result.Failure<(Uri Url, string PublicId)>(
                isUpdate
                    ? StorageErrors.ImageUpdateFailed(publicId)
                    : StorageErrors.ImageUploadFailed(fileName)
            );
        }

        if (result.StatusCode != HttpStatusCode.OK)
        {
            logger.LogError(
                "❌ Cloudinary retornó estado {StatusCode}: {Error}",
                result.StatusCode,
                result.Error?.Message ?? "Sin mensaje de error"
            );

            return Result.Failure<(Uri Url, string PublicId)>(
                StorageErrors.UploadFailedWithStatus((int)result.StatusCode, result.Error?.Message)
            );
        }

        if (result.SecureUrl == null)
        {
            logger.LogError("⚠️ Cloudinary no retornó URL para '{FileName}'", fileName);
            return Result.Failure<(Uri Url, string PublicId)>(StorageErrors.NoUrl);
        }

        string operationType = isUpdate ? "actualizada" : "cargada";
        logger.LogInformation(
            "✅ Imagen {Operation} exitosamente - URL: {Url}, PublicId: {PublicId}",
            operationType,
            result.SecureUrl,
            result.PublicId
        );

        return Result.Success((result.SecureUrl, result.PublicId));
    }

    private Result ValidateDeletionResult(DeletionResult? result, string publicId)
    {
        if (result == null)
        {
            logger.LogError("⚠️ Cloudinary retornó resultado nulo para eliminación");
            return Result.Failure(StorageErrors.DeleteFailed);
        }

        return result.Result switch
        {
            "ok" => LogAndReturnSuccess(publicId),
            "not found" => LogAndReturnNotFound(publicId),
            _ => LogAndReturnFailure(result.Result, publicId),
        };
    }

    private Result LogAndReturnSuccess(string publicId)
    {
        logger.LogInformation("✅ Imagen eliminada exitosamente - PublicId: {PublicId}", publicId);
        return Result.Success();
    }

    private Result LogAndReturnNotFound(string publicId)
    {
        logger.LogWarning("⚠️ Imagen no encontrada - PublicId: {PublicId}", publicId);
        return Result.Failure(StorageErrors.ImageNotFound);
    }

    private Result LogAndReturnFailure(string reason, string publicId)
    {
        logger.LogError(
            "❌ Falló eliminación de imagen - PublicId: {PublicId}, Razón: {Reason}",
            publicId,
            reason
        );
        return Result.Failure(StorageErrors.DeleteFailedWithReason(reason));
    }
}
