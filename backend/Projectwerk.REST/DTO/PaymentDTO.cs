namespace Projectwerk.REST.DTO;

public class PaymentDTO
{
    public int AmountInCents { get; set; }
    public string CurrencyCode { get; set; }
    public string Description { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Country { get; set; }
    public string Locale { get; set; }
    public string Email { get; set; }
}