using System;
using System.ComponentModel.DataAnnotations;

namespace Projectwerk.REST.DTO
{
    public class ReservationDTO
    {
        public int ReservationId { get; set; }

        [Required(ErrorMessage = "User ID is required")]
        public int? UserId { get; set; }

        [Required(ErrorMessage = "Game ID is required")]
        public int? GameId { get; set; }

        [Required(ErrorMessage = "Pickup date is required")]
        [FutureDate(ErrorMessage = "Pickup date must be in the future")]
        public DateTime PickupDate { get; set; }
    }

    public class FutureDateAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value != null)
            {
                DateTime dateTime = (DateTime)value;
                if (dateTime.Date < DateTime.Now.Date)
                {
                    return new ValidationResult(ErrorMessage);
                }
            }
            return ValidationResult.Success;
        }
    }
}