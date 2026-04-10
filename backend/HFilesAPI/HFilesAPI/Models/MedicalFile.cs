namespace HFilesAPI.Models
{
    public class MedicalFile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FileType { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public User? User { get; set; }
    }
}