using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Projectwerk.Infrastructure.Models;
using Projectwerk.Infrastructure.Repositories;
using Projectwerk.REST.DTO;

namespace Projectwerk.REST.Controllers;

[ApiController]
[Route("api/games")]
public class GameController : ControllerBase
{
    private readonly ILogger<GameController> _logger;
    private readonly GameRepository _gameRepository;
    private readonly IMapper _mapper;

    public GameController(ILogger<GameController> logger, GameRepository gameRepository,IMapper mapper)
    {
        _logger = logger;
        _gameRepository = gameRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllActiveGames()
    {
        var games = await _gameRepository.GetAll();

        // Filter out deleted games
        var activeGames = games.Where(game => !game.IsDeleted).ToList();
        if (activeGames.Count == 0)
        {
            return NoContent();
        }

        var json = JsonConvert.SerializeObject(activeGames, Formatting.Indented);

        return Ok(json);
    }
    
    [HttpGet("all")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> GetGames()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized("No user ID claim present in token.");
        }
    
        var games = await _gameRepository.GetAll();

        if (!games.Any())
        {
            return NoContent();
        }

        var json = JsonConvert.SerializeObject(games, Formatting.Indented);
        return Ok(json);
    }
    
    // GET: api/games/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetGameById(int id)
    {
        var gameWithId = await _gameRepository.GetById(id);
        if (gameWithId == null || gameWithId.IsDeleted)
            return NotFound();
        var json = JsonConvert.SerializeObject(gameWithId, Formatting.Indented);
        return Ok(json);
    }

    // POST: api/games
    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> CreateGame([FromBody] GameDTO gamedto)
    {
        if (gamedto == null)
        {
            _logger.LogError("Game object sent from client is null.");
            return BadRequest("Invalid object.");
        }

        if (!ModelState.IsValid)
        {
            _logger.LogError("Invalid object sent from client.");
            return BadRequest("Invalid object.");
        }

        // Create a new Game object with automapper
        var game = _mapper.Map<Game>(gamedto);

        await _gameRepository.Create(game);
        game.GameId = game.GameId;
        var json = JsonConvert.SerializeObject(game, Formatting.Indented);


        return CreatedAtAction(nameof(GetGameById), new { id = game.GameId }, json);
    }

    // PUT: api/games/{id}
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> UpdateGame(int id, [FromBody] GameDTO gameDTO)
    {
        if (gameDTO == null /*|| id != gameDTO.GameId*/) return BadRequest("Invalid input or ID mismatch");

        var existingGame = await _gameRepository.GetById(id);
        if (existingGame == null) return NotFound("Game not found");

        // Update with automapper
        _mapper.Map(gameDTO, existingGame);

        await _gameRepository.Update(existingGame);

        return NoContent();
    }


    // DELETE: api/games/{id}
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        var existingGame = await _gameRepository.GetById(id);
        if (existingGame == null)
            return NotFound();

        existingGame.IsDeleted = true;
        await _gameRepository.Update(existingGame);

        return NoContent();
    }
}