using System.ComponentModel.DataAnnotations;

namespace JENSENOnline.Api.DTOs.Orders;

public class CreateOrderDto
{
    [Required]
    [MinLength(1)]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}