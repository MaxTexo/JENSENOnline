using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Antiforgery;

namespace JENSENOnline.Api.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AntiforgeryValidationException ex)
        {
            _logger.LogWarning(
                ex,
                "Antiforgery validation failed."
            );

            context.Response.StatusCode =
                (int)HttpStatusCode.Forbidden;

            context.Response.ContentType = "application/json";

            var response = new
            {
                message = "Invalid or missing CSRF token."
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response)
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "An unexpected error occurred."
            );

            context.Response.StatusCode =
                (int)HttpStatusCode.InternalServerError;

            context.Response.ContentType = "application/json";

            var response = new
            {
                message = "An unexpected error occurred."
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response)
            );
        }
    }
}