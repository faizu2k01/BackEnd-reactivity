﻿using Application.Activities;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Runtime.CompilerServices;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        
        [HttpGet]
        public async Task<IActionResult> GetActivities([FromQuery] ActivityFilter parm)
        {
            return HandlePaginatedResult(await Mediator.Send(new List.Query { Params=parm}));
        }

       
        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivityById(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
           return  HandleResult( await Mediator.Send(new Create.Command { activity = activity }));

        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid Id,Activity activity)
        {
            activity.Id = Id;
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid Id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = Id}));
        }

        [HttpPost("{id}/attend")]

        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }
    }

}
