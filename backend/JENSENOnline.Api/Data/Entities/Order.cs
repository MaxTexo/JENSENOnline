namespace JENSENOnline.Api.Data.Entities;


public class Order
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public decimal TotalPrice { get; set; }

    public List<OrderItem> OrderItems { get; set; } = new();
}