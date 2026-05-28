namespace Bevent.Api.Application.DTOs.Upload;

public class UploadEventHallImageRequest
{
    public IFormFile File { get; set; } = default!;
    public string Description { get; set; } = string.Empty;
}