using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;


namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            _cloudinary = new Cloudinary(new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret));
            
        }
        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if(file.Length > 0)
            {
               await using var stream = file.OpenReadStream();
                var upload = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill")

                };

                var uploadImg = await _cloudinary.UploadAsync(upload);
                if(uploadImg.Error != null)
                {
                    throw new Exception(uploadImg.Error.Message);
                }

                return new PhotoUploadResult
                {
                    PublicId = uploadImg.PublicId,
                    Url = uploadImg.SecureUrl.ToString()
                };

            }

            return null;
        }

        public async Task<string> Delete(string publicId)
        {
            var deletePhotoParam = new DeletionParams(publicId);
            var result =await _cloudinary.DestroyAsync(deletePhotoParam);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}
