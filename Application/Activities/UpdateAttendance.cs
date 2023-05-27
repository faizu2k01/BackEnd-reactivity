using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccess _userAccess;

            public Handler(DataContext context,IUserAccess userAccess)
            {
                _context = context;
                _userAccess = userAccess;
            }

            public  async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.Include(y => y.Attendees)
                    .ThenInclude(z => z.AppUser).FirstOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccess.GetUser());

                if (user == null) return null;

                var hostname = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                if (hostname == null) return null;

                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                //business cases
                if (attendance != null && hostname == user.UserName)
                    activity.IsCancelled = !activity.IsCancelled;

                if (attendance != null && hostname != user.UserName)
                    activity.Attendees.Remove(attendance);

                if(attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }

                var res = await _context.SaveChangesAsync() > 0;

                return res ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failure updating it");
            
            }
        }
    }
}
