using System.Security.Claims;
using JENSENOnline.Api.Data;
using JENSENOnline.Api.Data.Entities;
using JENSENOnline.Api.DTOs.Orders;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JENSENOnline.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAntiforgery _antiforgery;

    public OrdersController(
        AppDbContext context,
        IAntiforgery antiforgery)
    {
        _context = context;
        _antiforgery = antiforgery;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderDto dto)
    {
        await _antiforgery.ValidateRequestAsync(HttpContext);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Unauthorized();
        }

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow
        };

        foreach (var item in dto.Items)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == item.ProductId);

            if (product == null)
            {
                return BadRequest(new
                {
                    message = $"Product {item.ProductId} does not exist."
                });
            }

            if (product.StockQuantity < item.Quantity)
            {
                return BadRequest(new
                {
                    message = $"Not enough stock for product {product.Name}."
                });
            }

            product.StockQuantity -= item.Quantity;

            order.OrderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            });

            order.TotalPrice += product.Price * item.Quantity;
        }

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        return Created("", new
        {
            order.Id,
            order.OrderDate,
            order.TotalPrice
        });
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Unauthorized();
        }

        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Select(o => new
            {
                o.Id,
                o.OrderDate,
                o.TotalPrice,

                Items = o.OrderItems.Select(oi => new
                {
                    oi.ProductId,
                    ProductName = oi.Product.Name,
                    oi.Quantity,
                    oi.UnitPrice
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Select(o => new
            {
                o.Id,
                o.UserId,
                o.OrderDate,
                o.TotalPrice,

                Items = o.OrderItems.Select(oi => new
                {
                    oi.ProductId,
                    ProductName = oi.Product.Name,
                    oi.Quantity,
                    oi.UnitPrice
                })
            })
            .ToListAsync();

        return Ok(orders);
    }
}