using System.ComponentModel.DataAnnotations;

namespace Projectwerk.REST.DTO;

public class GameDTO
{
    [Required(ErrorMessage = "ID is required")]
    public int GameId { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; }

    [Required(ErrorMessage = "Category is required")]
    public string Category { get; set; }

    [Range(1900, int.MaxValue, ErrorMessage = "Release year must be greater than or equal to 1900")]
    public int? ReleaseYear { get; set; }

    [Required(ErrorMessage = "Publisher is required")]
    public string Publisher { get; set; }

    [Required(ErrorMessage = "Console type is required")]
    public string ConsoleType { get; set; }

    public string CoverImage { get; set; }

    public string Description { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Rental price per day must be greater than or equal to 0")]
    public decimal? RentalPricePerWeek { get; set; }

    public bool IsAvailable { get; set; }

    public bool? IsDeleted { get; set; }
}