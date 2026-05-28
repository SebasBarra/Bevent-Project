using System.ComponentModel.DataAnnotations;

namespace Bevent.Api.Application.Options;

public sealed class CloudinaryOptions
{
    public const string SectionName = "Cloudinary";

    [Required]
    public string CloudName { get; set; } = null!;

    [Required]
    public string ApiKey { get; set; } = null!;

    [Required]
    public string ApiSecret { get; set; } = null!;
}
