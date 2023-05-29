using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccess _userAccess;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext dataContext, IUserAccess userAccess, IPhotoAccessor photoAccessor)
            {
                _dataContext = dataContext;
                _userAccess = userAccess;
                _photoAccessor = photoAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.UserName == _userAccess.GetUser());

                if(user == null) return  null;

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null) return null;

                if (photo.IsMain) return Result<Unit>.Failure("You can't delete your main photo");

                var deleteOncloud = _photoAccessor.Delete(photo.Id);

                if (deleteOncloud == null) return Result<Unit>.Failure("Issue in image deletion from cloudinary");

                user.Photos.Remove(photo);

                return await _dataContext.SaveChangesAsync() > 0 ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Not deleted from db"); 

            }
        }
    }
}
