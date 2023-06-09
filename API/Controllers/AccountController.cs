﻿using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;

namespace API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private UserManager<AppUser> _userManger
        {
            get
            {
                return (UserManager<AppUser>)Request.HttpContext.RequestServices.GetService(typeof(UserManager<AppUser>));
            }
        }

        private TokenGenerator _tokenGenerator
        {
            get
            {
                return (TokenGenerator)Request.HttpContext.RequestServices.GetService(typeof(TokenGenerator));
            }
        }
        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(typeof(UserDto),(int)HttpStatusCode.OK)]
        public async Task<ActionResult<UserDto>> GetLoginUser(LoginDto loginUser)
        {
            var user = await _userManger.Users.Include(x=> x.Photos).FirstOrDefaultAsync(y => y.Email == loginUser.Email);

            if (user == null) return Unauthorized();

            var result = await _userManger.CheckPasswordAsync(user, loginUser.Password);

            if (result) return CreateUser(user);
            

            return Unauthorized();

        }
        [AllowAnonymous]
        [HttpPost("register")]
        [ProducesResponseType((typeof(UserDto)),(int)HttpStatusCode.OK)]
        public async Task<ActionResult<UserDto>> RegisterUser(RegisterDto registerDto)
        {
            if(await _userManger.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("Email", "Email taken");
                return ValidationProblem();
            }

            if (await _userManger.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("UserName", "User name taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                UserName = registerDto.UserName,
                Email = registerDto.Email,

            };

            var result = await _userManger.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUser(user);
            }

            return BadRequest(result.Errors);

        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType((typeof(UserDto)),(int)HttpStatusCode.OK)]
        public async Task<ActionResult<UserDto>> GetUser()
        {
            return CreateUser(await _userManger.Users.Include(x => x.Photos).FirstOrDefaultAsync(y => y.Email == User.FindFirstValue(ClaimTypes.Email)));
        }

        private UserDto CreateUser(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                UserName = user.UserName,
                Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token =_tokenGenerator.CreateToken(user)
            };
        }
    }
}
