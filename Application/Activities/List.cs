using MediatR;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>> {
            public ActivityFilter Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccess _userAccess;

            public Handler(DataContext context, IMapper mapper, IUserAccess userAccess)
            {
                _context = context;
                _mapper = mapper;
                _userAccess = userAccess;
            }

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities.Where(x => x.Date >= request.Params.StartDate).OrderBy(x => x.Date).ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { username = _userAccess.GetUser() }).AsQueryable();

                if(request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(x => x.Attendees.Any(a => a.UserName == _userAccess.GetUser()));
                }

                if(request.Params.IsHost && !request.Params.IsGoing)
                {
                    query = query.Where(x => x.HostUserName == _userAccess.GetUser());
                }


                var res = await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize);
                
                
                if (res.Count == 0) return Result<PagedList<ActivityDto>>.Failure("Activities not present");
                
                return Result<PagedList<ActivityDto>>.Success(res);
            }

        }
    }
}
