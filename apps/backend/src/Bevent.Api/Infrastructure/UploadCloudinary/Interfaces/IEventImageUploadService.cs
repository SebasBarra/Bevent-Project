// Application/Interfaces/IEventImageUploadService.cs

using Microsoft.AspNetCore.Http;
using Bevent.Api.Application.DTOs.Upload;

namespace Bevent.Api.Application.Interfaces;

public interface IEventImageUploadService
{
    Task<EventUploadImageResponseDto> UploadEventImageAsync(IFormFile file);
}