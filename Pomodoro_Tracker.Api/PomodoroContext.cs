using Microsoft.EntityFrameworkCore;
using Pomodoro_Tracker.Api.Models;

namespace Pomodoro_Tracker.Api;

public class PomodoroContext : DbContext
{
	public PomodoroContext(DbContextOptions<PomodoroContext> options) : base(options) { }

	public DbSet<PomodoroTask> PomodoroTasks { get; set; } = null!;
}