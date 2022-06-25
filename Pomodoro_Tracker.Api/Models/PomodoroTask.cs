namespace Pomodoro_Tracker.Api.Models;

public class PomodoroTask
{
	public Guid Id { get; set; }
	public string Description { get; set; } = string.Empty;
	public int Duration { get; set; }
	public bool IsDeleted { get; set; }
	public DateTime CreationDateUtc { get; set; }
}