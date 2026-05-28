// Bevent.Api.Web.Api/Controllers/UploadController.cs

using Bevent.Api.Application.Interfaces;
using Bevent.Api.Application.DTOs.Upload;
using Bevent.Api.Application.DTOs.EventHallImages;
using Bevent.Api.Domain.EventHallImages;
using Bevent.Api.SharedKernel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bevent.Api.Application.Abstractions.Data;
using Bevent.Api.Domain.EventHalls;

namespace Bevent.Api.Web.Api.Controllers;

[ApiController]
[Route("api/upload")]
public sealed class UploadController(
    IImageUploadService imageUploadService,
    IEventImageUploadService eventImageUploadService,
    IApplicationDbContext context
) : ControllerBase
{
    /// <summary>
    /// Sube una imagen genérica a Cloudinary
    /// </summary>
    [HttpPost("image")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(UploadImageResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return Results.BadRequest("Debe enviar una imagen válida.");
        }

        UploadImageResponseDto result =
            await imageUploadService.UploadImageAsync(file);

        return Results.Ok(result);
    }

    /// <summary>
    /// Sube una imagen y la asocia a un EventHall
    /// </summary>
    [HttpPost("event-hall-image/{eventHallId:guid}")]
    [AllowAnonymous]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IResult> UploadEventHallImage(
        [FromRoute] Guid eventHallId,
        [FromForm] UploadEventHallImageRequest request,
        CancellationToken cancellationToken
    )
    {
        if (request.File == null || request.File.Length == 0)
        {
            return Results.BadRequest("Debe enviar una imagen válida.");
        }

        EventHall? eventHall = await context.EventHalls
            .FirstOrDefaultAsync(x => x.Id == eventHallId, cancellationToken);

        if (eventHall is null)
        {
            return Results.NotFound("El salón no existe.");
        }

        EventUploadImageResponseDto uploadResult =
            await eventImageUploadService.UploadEventImageAsync(request.File);

        EventHallImage image = new EventHallImage
        {
            EventHallId = eventHallId,
            Description = request.Description,
            ImageUrl = new Uri(uploadResult.SecureUrl),
            ImagePublicId = uploadResult.PublicId,
            CreatedOnUtc = DateTime.UtcNow
        };

        context.EventHallImages.Add(image);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new
        {
            image.Id,
            image.ImageUrl,
            image.Description,
            image.EventHallId
        });
    }
}