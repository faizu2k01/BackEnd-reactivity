using Application.Core;
using Domain;
using MediatR;
using Microsoft.Extensions.Logging.Abstractions;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var exitedActivity = await _context.Activities.FindAsync(request.Id);

                

                if (exitedActivity != null)
                {
                    _context.Activities.Remove(exitedActivity);
                    var res =  await _context.SaveChangesAsync() > 0;
                    if(res) return Result<Unit>.Success(Unit.Value);
                    if (!res) return Result<Unit>.Failure("Not saved");
                }

               if (exitedActivity == null) return Result<Unit>.Failure("This activity is not present");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
