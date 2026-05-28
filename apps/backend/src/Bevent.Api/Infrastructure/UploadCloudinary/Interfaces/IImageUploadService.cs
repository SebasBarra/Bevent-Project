// Application/Interfaces/IImageUploadService.cs

using Microsoft.AspNetCore.Http;
using Bevent.Api.Application.DTOs.Upload;

namespace Bevent.Api.Application.Interfaces;

public interface IImageUploadService
{
    Task<UploadImageResponseDto> UploadImageAsync(IFormFile file);
}