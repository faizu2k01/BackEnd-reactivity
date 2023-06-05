using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public string Body { get; set; }

            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
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
            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {

                var activity = await _dataContext.Activities.FirstOrDefaultAsync(x => x.Id == request.ActivityId);
                if (activity == null) return null;
                var user = await _dataContext.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.UserName == _userAccess.GetUser());
                if (user == null) return null;

                var comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreateAt=DateTime.UtcNow
                };

                activity.Comments.Add(comment);

                var res = await _dataContext.SaveChangesAsync() > 0;

                return res ? Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment)) : Result<CommentDto>.Failure("Not saved");


            }
        }
    }
}
