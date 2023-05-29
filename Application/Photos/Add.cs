using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.VisualBasic;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }

        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _dbContext;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccess _userAccess;

            public Handler(DataContext dbContext,IPhotoAccessor photoAccessor, IUserAccess userAccess)
            {
                _dbContext = dbContext;
                _photoAccessor = photoAccessor;
                _userAccess = userAccess;
            }
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dbContext.Users.Include(x => x.Photos).FirstOrDefaultAsync(y => y.UserName == _userAccess.GetUser());

                if (user == null) return null;

                var uploadOnCloudinary = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Id = uploadOnCloudinary.PublicId,
                    Url = uploadOnCloudinary.Url,
                    IsMain = user.Photos.Any(x => x.IsMain) ? false : true,
                };

                user.Photos.Add(photo);

                var res = await _dbContext.SaveChangesAsync() > 0;

                if (res) return Result<Photo>.Success(photo);

                return Result<Photo>.Failure("Photo not saved in Database");
            }
        }
    }
}
