using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Following
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccess _userAccess;

            public Handler(DataContext dataContext,IMapper mapper,IUserAccess userAccess)
            {
                _dataContext = dataContext;
                _mapper = mapper;
                _userAccess = userAccess;
            }
            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profile = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        profile =await  _dataContext.UserFollowing.Where(x => x.Target.UserName == request.UserName).Select(y => y.Observer)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { username = _userAccess.GetUser() }).ToListAsync();
                        break;
                    case "following":
                        profile = await _dataContext.UserFollowing.Where(x => x.Observer.UserName == request.UserName).Select(y => y.Target)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,new {username=_userAccess.GetUser() }).ToListAsync();
                        break;
                }


                return Result<List<Profiles.Profile>>.Success(profile);
            }
        }
    }
}
