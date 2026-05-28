// Infrastructure/Services/EventCloudinaryImageUploadService.cs

using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Bevent.Api.Application.DTOs.Upload;
using Bevent.Api.Application.Interfaces;

namespace Bevent.Api.Infrastructure.Services;

public class EventCloudinaryImageUploadService : IEventImageUploadService
{
    private readonly Cloudinary _cloudinary;

    public EventCloudinaryImageUploadService(IConfiguration configuration)
    {
        Account account = new(
            configuration["CLOUDINARY_CLOUD_NAME"],
            configuration["CLOUDINARY_API_KEY"],
            configuration["CLOUDINARY_API_SECRET"]
        );

        _cloudinary = new Cloudinary(account);
    }

    public async Task<EventUploadImageResponseDto> UploadEventImageAsync(
        IFormFile file
    )
    {
        if (file == null || file.Length == 0)
        {
            throw new Exception("Archivo inválido.");
        }

        using Stream stream = file.OpenReadStream();

        string publicId = Path.GetFileNameWithoutExtension(file.FileName);

        ImageUploadParams uploadParams = new()
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "event-halls",
            PublicId = publicId
        };

        ImageUploadResult result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
        {
            throw new Exception(result.Error.Message);
        }

        return new EventUploadImageResponseDto
        {
            SecureUrl = result.SecureUrl.ToString(),
            PublicId = result.PublicId
        };
    }
}