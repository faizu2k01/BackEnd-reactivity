using Application.Activities;
using Application.Profiles;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUserName,
                o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
              

            CreateMap<ActivityAttendee,AttendeeDTO>()
                .ForMember(x => x.DisplayName, y => y.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(x => x.UserName, y => y.MapFrom(s => s.AppUser.UserName))
                .ForMember(x => x.Bio, y => y.MapFrom(s => s.AppUser.Bio))
                .ForMember(x => x.Image , y => y.MapFrom(s => s.AppUser.Photos.FirstOrDefault(a => a.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(x => x.Image, y => y.MapFrom(z => z.Photos.FirstOrDefault(x => x.IsMain).Url));
              
            
        }
    }
}
