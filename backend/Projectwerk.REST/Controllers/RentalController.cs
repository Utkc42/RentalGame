using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Projectwerk.Infrastructure.Repositories;
using Projectwerk.REST.DTO;
using AutoMapper;
using System.Security.Claims;

namespace Projectwerk.REST.Controllers;

[ApiController]
[Route("api/rentals")]
public class RentalController : ControllerBase
{
	private readonly ILogger<RentalController> _logger;
	private readonly RentalRepository _rentalRepository;
	private readonly UserRepository _userRepository;
	private readonly GameRepository _gameRepository;
	private readonly IMapper _mapper;

	public RentalController(ILogger<RentalController> logger, RentalRepository rentalRepository, UserRepository userRepository, GameRepository gameRepository, IMapper mapper)
	{
		_logger = logger;
		_rentalRepository = rentalRepository;
		_gameRepository = gameRepository;
		_userRepository = userRepository;
		_mapper = mapper;
	}

	// GET: api/rentals?includeDeleted=true&userId=1
	[HttpGet]
	[Authorize]
	public async Task<IActionResult> GetRentals([FromQuery] bool includeDeleted, [FromQuery] int? userId)
	{
		// Get the current user's ID
		string currentUserId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		int currentUserIntId = Convert.ToInt32(currentUserId);

		// Check if the current user is an admin
		bool isAdmin = User.IsInRole("admin") || User.IsInRole("Admin");

		// If a non-admin user tries to access rentals for another user, forbid the request
		if (!isAdmin && userId.HasValue && userId != currentUserIntId)
		{
			return Forbid();
		}

		// Retrieve rentals based on the determined userId
		IEnumerable<Infrastructure.Models.Rental> rentals;

		if (isAdmin)
		{
			if (userId.HasValue)
			{
				// Admin requests rentals for a specific user
				rentals = await _rentalRepository.GetRentalsForUser(userId.Value);
			}
			else
			{
				// Admin requests all rentals
				rentals = await _rentalRepository.GetAll();
			}
		}
		else
		{
			// Retrieve rentals for the current user
			rentals = await _rentalRepository.GetRentalsForUser(currentUserIntId);
		}

		// Filter out deleted rentals if includeDeleted is false
		if (!includeDeleted)
		{
			rentals = rentals.Where(r => !r.IsDeleted);
		}

		// Convert rentals to DTOs
		var rentalDTOs = rentals.Select(r => new RentalDTO
		{
			RentalId = r.RentalId,
			UserId = r.User.UserId,
			UserName = $"{r.User.FirstName} {r.User.LastName}",
			GameId = r.Game.GameId,
			GameName = r.Game.Name,
			StartRentalPeriod = r.StartRentalPeriod,
			EndRentalPeriod = r.EndRentalPeriod,
			NumberOfExtensions = r.NumberOfExtensions,
			RentalPrice = r.RentalPrice,
			IsDeleted = r.IsDeleted
		});

		if (!rentalDTOs.Any())
		{
			return NoContent();
		}

		// Return rentals as JSON
		var json = JsonConvert.SerializeObject(rentalDTOs, Formatting.Indented);
		return Ok(json);
	}

	[HttpGet("myRentals")]
	[Authorize]
	public async Task<IActionResult> GetMyRentals([FromQuery] bool includeDeleted = false)
	{
		// Get the current user's ID
		string currentUserId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		int currentUserIntId = Convert.ToInt32(currentUserId);

		// Retrieve rentals for the current user
		IEnumerable<Infrastructure.Models.Rental> rentals = await _rentalRepository.GetRentalsForUser(currentUserIntId);

		// Filter out deleted rentals if includeDeleted is false
		if (!includeDeleted)
		{
			rentals = rentals.Where(r => !r.IsDeleted);
		}

		// Convert rentals to DTOs
		var rentalDTOs = rentals.Select(r => new RentalDTO
		{
			RentalId = r.RentalId,
			UserId = r.User.UserId,
			UserName = $"{r.User.FirstName} {r.User.LastName}",
			GameId = r.Game.GameId,
			GameName = r.Game.Name,
			StartRentalPeriod = r.StartRentalPeriod,
			EndRentalPeriod = r.EndRentalPeriod,
			NumberOfExtensions = r.NumberOfExtensions,
			RentalPrice = r.RentalPrice,
			IsDeleted = r.IsDeleted
		});

		if (!rentalDTOs.Any())
		{
			return NoContent();
		}

		// Return rentals as JSON
		var json = JsonConvert.SerializeObject(rentalDTOs, Formatting.Indented);
		return Ok(json);
	}


	// GET: api/rentals/{id}
	[HttpGet("{id}")]
	[Authorize(Policy = "AdminOnly")]
	public async Task<IActionResult> GetRentalById(int id)
	{
		var RentalWithId = await _rentalRepository.GetById(id);
		if (RentalWithId == null)
			return NotFound();
		var json = JsonConvert.SerializeObject(RentalWithId, Formatting.Indented);

		return Ok(json);
	}

	// GET: api/rentals/bygame/{gameId}
	[HttpGet("bygame/{gameId}")]
	[Authorize]
	public async Task<IActionResult> GetRentalsByGameId(int gameId)
	{
		var (rental, game, user) = await _rentalRepository.GetRentalWithGameAndUserByGameId(gameId);

		if (rental == null)
			return NotFound("No rental found for the specified gameId.");

		var rentalWithDetails = new
		{
			Rental = rental,
			Game = game,
			User = user
		};

		var json = JsonConvert.SerializeObject(rentalWithDetails, Formatting.Indented);
		return Ok(json);
	}

	// POST: api/rentals
	[HttpPost]
	public async Task<IActionResult> CreateRental([FromBody] RentalDTO rentalDto)
	{
		if (rentalDto == null)
		{
			_logger.LogError("Rental object sent from client is null.");
			return BadRequest("Invalid object: Rental object is null.");
		}

		if (!ModelState.IsValid)
		{
			_logger.LogError("Invalid rental object sent from client.");

			// Collect all model state errors
			var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();

			return BadRequest(new { message = "Invalid object: Rental object is invalid.", errors });
		}

		try
		{
			// Retrieve the existing user from the repository
			var existingUser = await _userRepository.GetById(rentalDto.UserId);
			if (existingUser == null)
			{
				_logger.LogError($"User with ID {rentalDto.UserId} not found.");
				return NotFound($"User with ID {rentalDto.UserId} not found.");
			}

			// Retrieve the existing game from the repository
			var existingGame = await _gameRepository.GetById(rentalDto.GameId);
			if (existingGame == null)
			{
				_logger.LogError($"Game with ID {rentalDto.GameId} not found.");
				return NotFound($"Game with ID {rentalDto.GameId} not found.");
			}

			// Check if the game is available for rental
			if (existingGame.IsAvailable != true)
			{
				_logger.LogError($"Game with ID {rentalDto.GameId} is not available for rental.");
				return BadRequest($"Game with ID {rentalDto.GameId} is not available for rental.");
			}

			// Calculate the end rental period (max 1 weeks)
			var endRentalPeriod = rentalDto.StartRentalPeriod.AddDays(7);

			// Create a new Rental object
			var newRental = new Infrastructure.Models.Rental
			{
				User = existingUser,
				Game = existingGame,
				StartRentalPeriod = rentalDto.StartRentalPeriod,
				EndRentalPeriod = endRentalPeriod,
				NumberOfExtensions = 0, // Initial extensions set to 0
				RentalPrice = rentalDto.RentalPrice,
				IsDeleted = rentalDto.IsDeleted,
			};

			// Add the new rental to the repository
			await _rentalRepository.Create(newRental);

			// Update game availability to false
			existingGame.IsAvailable = false;
			await _gameRepository.Update(existingGame);

			// Return a response indicating successful creation of the rental
			return CreatedAtAction(nameof(GetRentalById), new { id = newRental.RentalId }, newRental);
		}
		catch (Exception ex)
		{
			_logger.LogError($"An error occurred while creating the rental: {ex.Message}");

			// Construct custom error response
			var errorResponse = new
			{
				message = "An error occurred while creating the rental.",
				error = ex.Message  // Include specific error message
			};

			return StatusCode(500, errorResponse);
		}
	}

	// PUT: api/rentals/checkin/{rentalId}
	[HttpPut("checkin/{rentalId}")]
	[Authorize(Policy = "AdminOnly")]
	public async Task<IActionResult> CheckInGame(int rentalId)
	{
		try
		{
			// Retrieve the rental from the repository
			var rental = await _rentalRepository.GetById(rentalId);
			if (rental == null)
			{
				return NotFound("Rental not found.");
			}

			// Check if the rental is already checked in
			if (rental.IsDeleted)
			{
				return BadRequest("The game has already been checked in.");
			}

			// Set the rental status to checked in
			rental.IsDeleted = true;
			rental = Helpers.RentalService.HandleLateReturn(rental);
			await _rentalRepository.Update(rental);

			// Retrieve the associated game from the repository
			var game = await _gameRepository.GetById((int)rental.GameId);
			if (game == null)
			{
				return NotFound("Associated game not found.");
			}

			// Update the game availability to true
			game.IsAvailable = true;
			await _gameRepository.Update(game);

			return NoContent();
		}
		catch (Exception ex)
		{
			_logger.LogError($"An error occurred while checking in the game: {ex.Message}");
			return StatusCode(500, "An error occurred while checking in the game.");
		}
	}

	// PUT: api/rentals/{id}
	[HttpPut("{id}")]
	[Authorize]
	public async Task<IActionResult> UpdateRental(int id, [FromBody] RentalDTO rentalDto)
	{
		if (rentalDto == null /*|| id != gameDTO.GameId*/) return BadRequest("Invalid input or ID mismatch");

		var existingRental = await _rentalRepository.GetById(id);
		if (existingRental == null) return NotFound("Game not found");

		// Update with automapper
		_mapper.Map(rentalDto, existingRental);

		await _rentalRepository.Update(existingRental);

		return NoContent();
	}

	// PUT: api/rentals/{id}/extend
	[HttpPut("{id}/extend")]
	[Authorize]
	public async Task<IActionResult> ExtendRental(int id) {
		try {
			// Retrieve the rental from the repository
			var rental = await _rentalRepository.GetById(id);
			if (rental == null) {
				return NotFound("Rental not found.");
			}

			// Implement rental extension logic (e.g., updating end rental period)
			rental.EndRentalPeriod = rental.EndRentalPeriod.AddDays(7); // Extending by 1 week

			// Update the rental in the repository
			await _rentalRepository.Update(rental);

			return Ok("Rental successfully extended.");
		} catch (Exception ex) {
			_logger.LogError($"An error occurred while extending the rental: {ex.Message}");
			return StatusCode(500, "An error occurred while extending the rental.");
		}
	}


	// DELETE: api/rentals/{id}
	[HttpDelete("{id}")]
	[Authorize(Policy = "AdminOnly")]
	public async Task<IActionResult> DeleteRental(int id)
	{
		var existingGame = await _rentalRepository.GetById(id);
		if (existingGame == null)
			return NotFound();

		existingGame.IsDeleted = true;
		await _rentalRepository.Update(existingGame);

		return NoContent();
	}
}