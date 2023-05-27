﻿using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options):base(options) { }


        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(y => new { y.AppUserId, y.ActivityId }));
            builder.Entity<ActivityAttendee>()
               .HasOne(x => x.Activity)
               .WithMany(y => y.Attendees)
               .HasForeignKey(x => x.ActivityId);

            builder.Entity<ActivityAttendee>()
                .HasOne(x => x.AppUser)
                .WithMany(y => y.Activities)
                .HasForeignKey(z => z.AppUserId);



        }
    }
}
