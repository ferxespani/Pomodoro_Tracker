﻿using Pomodoro_Tracker.Api.HostedServices.Interfaces;
using Pomodoro_Tracker.Api.Models;
using System.Threading;

namespace Pomodoro_Tracker.Api.HostedServices
{
	public class SeedProcessingService : ISeedProcessingService
	{
		private readonly PomodoroContext _context;

		public SeedProcessingService(PomodoroContext context)
		{
			_context = context;
		}
		public async Task SeedData(CancellationToken cancellationToken)
		{
			await _context.Database.EnsureCreatedAsync(cancellationToken);

			if (cancellationToken.IsCancellationRequested) await Task.CompletedTask;

			if (_context.PomodoroTasks.Any()) await Task.CompletedTask;

			var pomodoroTask = new PomodoroTask
			{
				Id = Guid.Parse("1A4F5482-743A-4327-AFD8-0B187EB3ACBC"),
				Description = "Test task",
				Duration = 1800,
				CreationDateUtc = DateTime.UtcNow
			};

			await _context.PomodoroTasks.AddAsync(pomodoroTask, cancellationToken);
			await _context.SaveChangesAsync(cancellationToken);
		}
	}
}
