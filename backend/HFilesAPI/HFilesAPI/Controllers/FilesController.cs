using HFilesAPI.Data;
using HFilesAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HFilesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FilesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public FilesController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] string fileType,
            [FromForm] string fileName, IFormFile file)
        {
            var allowed = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
            var ext = Path.GetExtension(file.FileName).ToLower();
            if (!allowed.Contains(ext))
                return BadRequest("Invalid file type. Only PDF and images allowed.");

            var uploads = Path.Combine(_env.WebRootPath, "uploads", "medical");
            Directory.CreateDirectory(uploads);
            var storedName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploads, storedName);
            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            var record = new MedicalFile
            {
                UserId = GetUserId(),
                FileType = fileType,
                FileName = fileName,
                FilePath = $"/uploads/medical/{storedName}"
            };

            _db.MedicalFiles.Add(record);
            await _db.SaveChangesAsync();
            return Ok(new { message = "File uploaded.", record.Id });
        }

        [HttpGet]
        public async Task<IActionResult> GetFiles()
        {
            var files = await _db.MedicalFiles
                .Where(f => f.UserId == GetUserId())
                .Select(f => new {
                    f.Id,
                    f.FileType,
                    f.FileName,
                    f.FilePath,
                    f.UploadedAt
                }).ToListAsync();
            return Ok(files);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var file = await _db.MedicalFiles
                .FirstOrDefaultAsync(f => f.Id == id && f.UserId == GetUserId());
            if (file == null) return NotFound();

            var fullPath = Path.Combine(_env.WebRootPath, file.FilePath.TrimStart('/'));
            if (System.IO.File.Exists(fullPath))
                System.IO.File.Delete(fullPath);

            _db.MedicalFiles.Remove(file);
            await _db.SaveChangesAsync();
            return Ok(new { message = "File deleted." });
        }
    }
}