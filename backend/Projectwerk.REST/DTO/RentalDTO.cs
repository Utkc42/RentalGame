using System;
using System.ComponentModel.DataAnnotations;

namespace Projectwerk.REST.DTO
{
    public class RentalDTO
    {
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Game ID is required")]
        public int GameId { get; set; }

        [Required(ErrorMessage = "Start rental period is required")]
        public DateTime StartRentalPeriod { get; set; }

        [Required(ErrorMessage = "End rental period is required")]
        public DateTime EndRentalPeriod { get; set; }

        [Range(0, 1, ErrorMessage = "Number of extensions must be between 0 and 1")]
        public int? NumberOfExtensions { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Rental price must be greater than or equal to 0")]
        public decimal? RentalPrice { get; set; }

        public bool IsDeleted { get; set; }
		public string? UserName { get; internal set; }
		public string? GameName { get; internal set; }
		public int? RentalId { get; internal set; }
	}
}