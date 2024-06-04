using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Projectwerk.Domain.Models;

[Table("Reservation")]
[Index("GameId", Name = "IX_Reservation_GameID")]
[Index("UserId", Name = "IX_Reservation_UserID")]
public class Reservation : EntityBase
{
    [Key] [Column("ReservationID")] public int ReservationId { get; set; }

    [Column("UserID")] public int? UserId { get; set; }

    [Column("GameID")] public int? GameId { get; set; }

    public DateOnly PickupDate { get; set; }

    public bool? IsDeleted { get; set; }

    [ForeignKey("GameId")]
    [InverseProperty("Reservations")]
    public virtual Game? Game { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("Reservations")]
    public virtual User? User { get; set; }
}