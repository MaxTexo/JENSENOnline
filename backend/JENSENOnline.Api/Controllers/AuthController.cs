using System.Security.Claims;
using JENSENOnline.Api.Data.Entities;
using JENSENOnline.Api.DTOs.Auth;
using JENSENOnline.Api.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace JENSENOnline.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly IAntiforgery _antiforgery;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        TokenService tokenService,
        IAntiforgery antiforgery)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _antiforgery = antiforgery;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        await _antiforgery.ValidateRequestAsync(HttpContext);

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email
        };

        var result = await _userManager.CreateAsync(
            user,
            dto.Password
        );

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _userManager.AddToRoleAsync(
            user,
            "Customer"
        );

        return Ok(new
        {
            message = "User registered successfully."
        });
    }

    [HttpPost("login")]
    [EnableRateLimiting("api")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        await _antiforgery.ValidateRequestAsync(HttpContext);

        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        if (await _userManager.IsLockedOutAsync(user))
        {
            return Unauthorized(new
            {
                message = "Account is temporarily locked."
            });
        }

        var passwordIsCorrect =
            await _userManager.CheckPasswordAsync(
                user,
                dto.Password
            );

        if (!passwordIsCorrect)
        {
            await _userManager.AccessFailedAsync(user);

            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        await _userManager.ResetAccessFailedCountAsync(user);

        var token =
            await _tokenService.CreateTokenAsync(user);

        Response.Cookies.Append(
            "access_token",
            token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddHours(1)
            }
        );

        return Ok(new
        {
            message = "Login successful."
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Unauthorized();
        }

        var user =
            await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Unauthorized();
        }

        var roles =
            await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Email,
            Roles = roles
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _antiforgery.ValidateRequestAsync(HttpContext);

        Response.Cookies.Delete(
            "access_token",
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            }
        );

        return Ok(new
        {
            message = "Logged out successfully."
        });
    }
}