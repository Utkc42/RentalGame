using System.ComponentModel.DataAnnotations;

namespace Projectwerk.REST.DTO;

public class UserDTO
{
    [Required(ErrorMessage = "First name is required")]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "Last name is required")]
    public string LastName { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format or email already used")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Phone number is required")]
    [RegularExpression(@"^\+32\d{8,9}$",
        ErrorMessage = "Phone number must be in the format +32xxxxxxxxx or phone number already used")]
    public string PhoneNumber { get; set; }

    [Required(ErrorMessage = "Role is required")]
    public string Role { get; set; }

    public int LateReturnCount { get; set; }
    public decimal AccountBalance { get; set; }
}

public class LoginDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; }
}