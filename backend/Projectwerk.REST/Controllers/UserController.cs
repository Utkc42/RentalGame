using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Projectwerk.Infrastructure.Models;
using Projectwerk.Infrastructure.Repositories;
using Projectwerk.REST.DTO;
using Projectwerk.REST.JWT;
using System.Security.Claims;

namespace Projectwerk.REST.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly UserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly TokenManager _tokenManager;
    private readonly IMapper _mapper;

    public UserController(ILogger<UserController> logger, UserRepository userRepository, IConfiguration config,
        TokenManager tokenManager, IMapper mapper)
    {
        _logger = logger;
        _userRepository = userRepository;
        _configuration = config;
        _tokenManager = tokenManager;
        _mapper = mapper;
    }

    // GET: api/users
    [HttpGet]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> GetUsers([FromQuery] bool includeDeleted)
    {
        var users = await _userRepository.GetAll();
        
        if (!includeDeleted)
            users = users.Where(user => !user.IsDeleted).ToList();

        if (!users.Any())
            return NoContent();

        var json = JsonConvert.SerializeObject(users, Formatting.Indented);
        return Ok(json);
    }

	// GET: api/users/{id}
	[HttpGet("{id}")]
	[Authorize]
	public async Task<IActionResult> GetUserById(int id) {
		// Get the user making the request
		var requestingUserId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (requestingUserId == null) {
			// User not authenticated
			return Unauthorized();
		}

		// Check if the requesting user is authorized to fetch the data
		if (!(User.IsInRole("Admin") || User.IsInRole("admin")) && requestingUserId != id.ToString()) {
			// Regular users can only fetch their own data
			return Forbid();
		}

		// Fetch the user data
		var user = await _userRepository.GetById(id);
		if (user == null || user.IsDeleted) {
			return NotFound();
		}

		// Serialize user object to JSON
		var json = JsonConvert.SerializeObject(user, Formatting.Indented);
		return Ok(json);
	}

	// PUT: api/users/{id}
	[HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserDTO? userDto)
    {
		// Get the current user's claims
		var currentUser = HttpContext.User;

		// Check if the current user is an admin
		bool isAdmin = currentUser.IsInRole("admin") || currentUser.IsInRole("Admin");

		// If the user is not an admin, ensure they can only update their own data
		if (!isAdmin && id.ToString() != currentUser.FindFirstValue(ClaimTypes.NameIdentifier)) {
			return Forbid(); // Return 403 Forbidden
		}

		if (userDto == null)
        {
            _logger.LogError("User object sent from client is null.");
            return BadRequest("Invalid object.");
        }

        if (!ModelState.IsValid)
        {
            _logger.LogError("Invalid object sent from client.");
            return BadRequest("Invalid object.");
        }

        if (string.IsNullOrWhiteSpace(userDto.Role))
        {
            userDto.Role = "User";
        }

        var existingUser = await _userRepository.GetById(id);
        if (existingUser == null)
            return NotFound();

        // Map properties from DTO to existing user entity using AutoMapper
        _mapper.Map(userDto, existingUser);

        // Re-hash the password if it's provided in the DTO
        if (!string.IsNullOrWhiteSpace(userDto.Password))
        {
            var salt = BCrypt.Net.BCrypt.GenerateSalt(12);
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password, salt);
            existingUser.Password = hashedPassword;
        }

        // Set UpdatedAt property to current UTC time
        existingUser.UpdatedAt = DateTime.UtcNow;

        await _userRepository.Update(existingUser);

        return Ok("User successfully updated.");
    }



    // DELETE: api/users/{id}
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var existingUser = await _userRepository.GetById(id);
        if (existingUser == null)
            return NotFound();

        existingUser.IsDeleted = true;
        await _userRepository.Update(existingUser);

        return NoContent();
    }

    // POST: api/users/register
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> CreateUser([FromBody] UserDTO? userDto)
    {
        if (userDto == null || !ModelState.IsValid)
        {
            _logger.LogError("User object sent from client is null.");
            return BadRequest("Invalid object.");
        }

        if (string.IsNullOrWhiteSpace(userDto.Role))
        {
            userDto.Role = "User";
        }
        else if (userDto.Role.ToLower() == "string")
        {
            userDto.Role = "User";
        }

        // Generate a salt for the password
        var salt = BCrypt.Net.BCrypt.GenerateSalt(12);
        // Hash the password using BCrypt
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password, salt);

        var user = new User
        {
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Password = hashedPassword, // Store hashed password
            Email = userDto.Email,
            PhoneNumber = userDto.PhoneNumber,
            UpdatedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            Role = userDto.Role
        };

        await _userRepository.Create(user);
        var token = _tokenManager.CreateToken(user);

        // Create an instance of AuthResponse containing the token
        var authResponse = new AuthResponse { Token = token };

        // Don't serialize and return the password in the response
        user.Password = null;

        // Serialize both user data and authentication token
        var responseJson = JsonConvert.SerializeObject(new { User = user, AuthResponse = authResponse }, Formatting.Indented);
    
        return Ok(responseJson);
    }

    // POST: api/users/login
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var user = await _userRepository.Login(loginDto.Email, loginDto.Password);

        if (user == null)
            // Login failed, return 401 Unauthorized
            return Unauthorized("Invalid credentials");
        // Generate token
        var token = _tokenManager.CreateToken(user);
        // Create an instance of AuthResponse containing the token
        var authResponse = new AuthResponse { Token = token };
        // Serialize
        var responseJson = JsonConvert.SerializeObject(new { User = user, AuthResponse = authResponse }, Formatting.Indented);

        return Ok(responseJson);
    }
}