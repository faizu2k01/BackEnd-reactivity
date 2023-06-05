using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Application.Comments
{
    public class List
    {
        public class Query : IRequest<Result<List<CommentDto>>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccess _userAccess;

            public Handler(DataContext dataContext, IMapper mapper, IUserAccess userAccess)
            {
                _dataContext = dataContext;
                _mapper = mapper;
                _userAccess = userAccess;
            }
                
            public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comment = await _dataContext.Comments.Where(x => x.Activity.Id == request.ActivityId).OrderBy(y => y.CreateAt)
                .ProjectTo<CommentDto>(_mapper.ConfigurationProvider).ToListAsync();

                return comment.Count() > 0 ? Result<List<CommentDto>>.Success(comment) : Result<List<CommentDto>>.Success(new List<CommentDto>());
                                        
            }
        }
    }
}
