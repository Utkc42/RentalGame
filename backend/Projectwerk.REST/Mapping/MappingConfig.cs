using AutoMapper;
using Projectwerk.Domain.Models;
using Projectwerk.REST.DTO;

namespace Projectwerk.REST.Mapping;

public class MappingConfig : Profile
{
    public MappingConfig()
    {
        // REST mapping
        CreateMap<GameDTO, Game>().ReverseMap();
        CreateMap<UserDTO, User>().ReverseMap();
        CreateMap<RentalDTO, Rental>().ReverseMap();
        CreateMap<ReservationDTO, Reservation>().ReverseMap();

        // EF mapping
        CreateMap<Infrastructure.Models.Game, GameDTO>().ReverseMap();
        CreateMap<Infrastructure.Models.User, UserDTO>().ReverseMap();
        CreateMap<Infrastructure.Models.Rental, RentalDTO>().ReverseMap();
        CreateMap<Infrastructure.Models.Reservation, ReservationDTO>().ReverseMap();
    }
}