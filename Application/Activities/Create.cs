using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.Activities
{
    public  class Create 
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity activity { get; set; }

        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler :  IRequestHandler<Command,Result<Unit>> 
        {
            private readonly DataContext _context;
            private readonly IUserAccess _userAccess;

            public Handler(DataContext context,IUserAccess userAccess) 
            {
                _context = context;
                _userAccess = userAccess;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccess.GetUser());

                request.activity.Attendees.Add(new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.activity,
                    IsHost = true
                });


                await _context.Activities.AddAsync(request.activity);

                var save = await _context.SaveChangesAsync() > 0;

                if (!save) return Result<Unit>.Failure("Activity not saved");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
