// Application/DTOs/Upload/EventUploadImageResponseDto.cs

namespace Bevent.Api.Application.DTOs.Upload;

public class EventUploadImageResponseDto
{
    public string SecureUrl { get; set; } = string.Empty;

    public string PublicId { get; set; } = string.Empty;
}