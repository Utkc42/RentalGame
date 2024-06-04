using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Projectwerk.Infrastructure.Models;

[Table("Game")]
public class Game
{
    [Key] [Column("GameID")] public int GameId { get; set; }

    [StringLength(255)] public string Name { get; set; } = null!;

    [StringLength(255)] public string? Category { get; set; }

    public int? ReleaseYear { get; set; }

    [StringLength(255)] public string Publisher { get; set; } = null!;

    [StringLength(255)] public string ConsoleType { get; set; } = null!;

    [StringLength(255)] public string CoverImage { get; set; } = null!;

    public string Description { get; set; } = null!;

    [Column(TypeName = "decimal(10, 2)")] public decimal? RentalPricePerWeek { get; set; }

    public bool IsAvailable { get; set; }

    public bool IsDeleted { get; set; }

    [InverseProperty("Game")] public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();

    [InverseProperty("Game")]
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}