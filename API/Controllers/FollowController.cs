using Application.Following;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow(string username)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command { TargetUserName = username }));
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetFollower(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new List.Query { UserName = username, Predicate = predicate }));
        }
    }
}
