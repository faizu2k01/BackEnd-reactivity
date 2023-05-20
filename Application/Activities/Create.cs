using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
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

            public Handler(DataContext context) 
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                await _context.Activities.AddAsync(request.activity);

                var save = await _context.SaveChangesAsync() > 0;

                if (!save) return Result<Unit>.Failure("Activity not saved");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
