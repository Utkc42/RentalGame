using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MultiSafepay;
using MultiSafepay.Model;
using Projectwerk.REST.DTO;

namespace Projectwerk.REST.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentController : ControllerBase
{
    private readonly MultiSafepayClient _client;
    private readonly ILogger<RentalController> _logger;
    private readonly IConfiguration _configuration;

    public PaymentController(ILogger<RentalController> logger, IConfiguration configuration)
    {
        // Initialize the MultiSafepayClient with the API key
        _configuration = configuration;
        // Retrieve MultiSafepay API key and URL from configuration
        var apiKey = _configuration.GetValue<string>("MultiSafepay:ApiKey");
        var apiUrl = _configuration.GetValue<string>("MultiSafepay:ApiUrl");
        _client = new MultiSafepayClient(apiKey, apiUrl);
        _logger = logger;
    }

    [HttpPost("process")]
    [Authorize]
    public IActionResult ProcessPayment([FromBody] PaymentDTO paymentRequest)
    {
        var baseUrl = _configuration["BaseUrl"];

        var successUrl = baseUrl + "payment/success";
        var failureUrl = baseUrl + "payment/failure";
        var notificationUrl = baseUrl + "payment/notification";

        try
        {
            // Construct the order object based on the payment request received
            var order = new Order
            {
                Type = OrderType.Redirect,
                OrderId = Guid.NewGuid().ToString(),
                AmountInCents = paymentRequest.AmountInCents,
                CurrencyCode = paymentRequest.CurrencyCode,
                Description = paymentRequest.Description,
                PaymentOptions = new PaymentOptions(notificationUrl, successUrl, failureUrl),
                Customer = new Customer
                {
                    FirstName = paymentRequest.FirstName,
                    LastName = paymentRequest.LastName,
                    Country = paymentRequest.Country,
                    Locale = paymentRequest.Locale,
                    Email = paymentRequest.Email
                }
            };

            // Call the MultiSafepayClient to create the order
            var result = _client.CustomOrder(order);

            // Return the payment URL to the client
            return Ok(new { result.PaymentUrl, result.OrderId });
        }
        catch (Exception ex)
        {
            // Log the error
            _logger.LogError(ex, "An error occurred while processing the payment.");
            // Return an appropriate error response
            return StatusCode(500, $"An error occurred while processing the payment. {ex.Message}");
        }
    }
}