using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetDetails(string userName)
        {
            return HandleResult(await Mediator.Send(new Details.Query { UserName = userName }));
        }
    }
}
