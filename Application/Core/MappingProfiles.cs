using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUserName,
                o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(x => x.DisplayName, y => y.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(x => x.UserName, y => y.MapFrom(s => s.AppUser.UserName))
                .ForMember(x => x.Bio, y => y.MapFrom(s => s.AppUser.Bio));
            
        }
    }
}
