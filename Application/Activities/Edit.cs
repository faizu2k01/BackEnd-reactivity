﻿
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {

        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context,IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async  Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var existedActivity = await _context.Activities.FindAsync(request.Activity.Id);

                if(existedActivity != null)
                {
                    _mapper.Map(request.Activity, existedActivity);

                    var res = await _context.SaveChangesAsync()>0;

                    if (res!) Result<Unit>.Failure("Not saved");

                }

                if (existedActivity == null) return Result<Unit>.Failure("Activity not Found");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
