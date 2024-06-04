using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Projectwerk.Infrastructure.Models;

[Table("User")]
[Index(nameof(Email), IsUnique = true)]
[Index(nameof(PhoneNumber), IsUnique = true)]
public class User
{
    [Key] [Column("UserID")] public int UserId { get; set; }

    [StringLength(255)] public string FirstName { get; set; } = null!;

    [StringLength(255)] public string LastName { get; set; } = null!;

    [StringLength(255)] public string Password { get; set; } = null!;

    [StringLength(255)] public string Email { get; set; } = null!;

    [StringLength(20)] public string? PhoneNumber { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [StringLength(20)] public string? Role { get; set; }

    public bool IsDeleted { get; set; }

    [InverseProperty("User")] public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();

    [InverseProperty("User")]
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

    public int LateReturnCount { get; set; }

    [Column(TypeName = "decimal(10, 2)")] public decimal AccountBalance { get; set; }
}