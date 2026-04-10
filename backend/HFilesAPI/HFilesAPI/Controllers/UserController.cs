using HFilesAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HFilesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public UserController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _db.Users.FindAsync(GetUserId());
            if (user == null) return NotFound();
            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Gender,
                user.PhoneNumber,
                user.ProfileImagePath
            });
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] string? email,
            [FromForm] string? gender, [FromForm] string? phoneNumber,
            IFormFile? profileImage)
        {
            var user = await _db.Users.FindAsync(GetUserId());
            if (user == null) return NotFound();

            if (email != null) user.Email = email;
            if (gender != null) user.Gender = gender;
            if (phoneNumber != null) user.PhoneNumber = phoneNumber;

            if (profileImage != null)
            {
                var uploads = Path.Combine(_env.WebRootPath, "uploads", "profiles");
                Directory.CreateDirectory(uploads);
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(profileImage.FileName)}";
                var filePath = Path.Combine(uploads, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await profileImage.CopyToAsync(stream);
                user.ProfileImagePath = $"/uploads/profiles/{fileName}";
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Profile updated." });
        }
    }
}