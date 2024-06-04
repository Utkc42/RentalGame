using Projectwerk.Infrastructure.Models;

namespace Projectwerk.REST.Helpers;

public class RentalService
{
    public static decimal CalculateLateFee(DateTime returnDate, DateTime dueDate, int lateCount)
    {
        var lateDuration = returnDate - dueDate;
        var lateWeeks = (int)Math.Ceiling(lateDuration.TotalDays / 7) - 1; // Exclude the first week
        decimal lateFee = 0;

        if (lateWeeks > 0)
        {
            if (lateCount < 3)
                lateFee = 40 + lateWeeks * 0.4m * 40; // €40 base fee + 40% increase per extra week
            else
                lateFee = 50 + lateWeeks * 0.4m *
                    50; // €50 base fee after third late return + 40% increase per extra week
        }

        return lateFee;
    }

    public static Rental HandleLateReturn(Rental rental)
    {
        var returnDate = DateTime.Now;
        var dueDate = rental.EndRentalPeriod;
        var lateCount = rental.User.LateReturnCount;

        if (returnDate > dueDate)
        {
            var lateFee = CalculateLateFee(returnDate, dueDate, lateCount);

            // Apply late fee to user's account balance or store as outstanding amount
            rental.User.AccountBalance += lateFee;
            rental.User.LateReturnCount++; // Increment late return count for the user
            rental.IsLate = true;
        }

        return rental;
    }
}