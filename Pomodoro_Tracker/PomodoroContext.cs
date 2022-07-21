using Microsoft.EntityFrameworkCore;
using Pomodoro_Tracker.Models;

namespace Pomodoro_Tracker;

public class PomodoroContext : DbContext
{
	public PomodoroContext(DbContextOptions<PomodoroContext> options) : base(options) { }

	public DbSet<PomodoroTask> PomodoroTasks { get; set; } = null!;
}