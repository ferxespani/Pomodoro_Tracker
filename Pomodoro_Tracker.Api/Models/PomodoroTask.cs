using System.ComponentModel.DataAnnotations;

namespace Pomodoro_Tracker.Api.Models;

public class PomodoroTask
{
	public Guid Id { get; set; } = Guid.NewGuid();

	[Required]
	public string Description { get; set; } = string.Empty;

	[Range(1800, int.MaxValue)]
	public int Duration { get; set; }
	public bool IsDeleted { get; set; }
	public DateTime CreationDateUtc { get; set; } = DateTime.UtcNow;
}