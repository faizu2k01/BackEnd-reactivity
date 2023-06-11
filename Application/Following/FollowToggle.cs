using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Following
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUserName { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccess _userAccess;

            public Handler(DataContext dataContext,IUserAccess userAccess)
            {
                _dataContext = dataContext;
                _userAccess = userAccess;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _dataContext.Users.FirstOrDefaultAsync(x => x.UserName == _userAccess.GetUser());

                var target = await _dataContext.Users.FirstOrDefaultAsync(z => z.UserName == request.TargetUserName);

                if (target == null) return null;

                var following = await _dataContext.UserFollowing.FindAsync(observer.Id, target.Id);

                if(following == null)
                {
                    _dataContext.UserFollowing.Add(new UserFolloweings { Observer = observer, Target = target });

                }
                else
                {
                    _dataContext.UserFollowing.Remove(following);
                }

                return await _dataContext.SaveChangesAsync() > 0 ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("not saved");
            }
        }
    }
}
