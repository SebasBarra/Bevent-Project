using Bevent.Api.Application.Abstractions.DataTransfer;
using Bevent.Api.SharedKernel;

namespace Bevent.Api.Application.Services;

public interface IImageStorageService
{
    Task<Result<(Uri Url, string PublicId)>> UploadImageAsync(
        FileUpload imageFile,
        string? publicId = null,
        CancellationToken cancellationToken = default
    );

    Task<Result> DeleteImageAsync(string publicId, CancellationToken cancellationToken = default);
}
