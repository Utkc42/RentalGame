using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Projectwerk.Domain.Models;

[Table("Rental")]
[Index("GameId", Name = "IX_Rental_GameID")]
[Index("UserId", Name = "IX_Rental_UserID")]
public partial class Rental : EntityBase
{
    [Key]
    [Column("RentalID")]
    public int RentalId { get; set; }

    [Column("UserID")]
    public int? UserId { get; set; }

    [Column("GameID")]
    public int? GameId { get; set; }

    public DateOnly StartRentalPeriod { get; set; }

    public DateOnly EndRentalPeriod { get; set; }

    public int? NumberOfExtensions { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? RentalPrice { get; set; }

    public bool? IsDeleted { get; set; }

    [ForeignKey("GameId")]
    [InverseProperty("Rentals")]
    public virtual Game? Game { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("Rentals")]
    public virtual User? User { get; set; }
}
