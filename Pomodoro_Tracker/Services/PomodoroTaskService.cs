using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Pomodoro_Tracker.CustomExceptions;
using Pomodoro_Tracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pomodoro_Tracker.Services
{
	public class PomodoroTaskService : IPomodoroTaskService
	{
		private readonly PomodoroContext _pomodoroContext;
		private readonly IMapper _mapper;

		public PomodoroTaskService(PomodoroContext pomodoroContext, IMapper mapper)
		{
			_pomodoroContext = pomodoroContext;
			_mapper = mapper;
		}

		public async Task<PomodoroTaskDetail> CreateTask(PomodoroTaskForCreate task)
		{
			if (task is null)
				throw new ArgumentNullException(nameof(task));

			PomodoroTask taskForCreate = _mapper.Map<PomodoroTask>(task);
			_pomodoroContext.Add(taskForCreate);
			await _pomodoroContext.SaveChangesAsync();

			return await GetTask(taskForCreate.Id);
		}

		public async Task DeleteTask(Guid taskId)
		{
			PomodoroTask? taskFromDb = await _pomodoroContext
												.PomodoroTasks
												.FirstOrDefaultAsync(task => task.Id == taskId);

			if (taskFromDb is null)
				throw new EntityNotFoundException($"A task having id '{taskId}' could not be found");

			taskFromDb.IsDeleted = true;
			await _pomodoroContext.SaveChangesAsync();
		}

		public async Task<PomodoroTaskDetail> GetTask(Guid taskId)
		{
			PomodoroTask? taskFromDb = await _pomodoroContext
												.PomodoroTasks
												.FirstOrDefaultAsync(task => task.Id == taskId);

			return _mapper.Map<PomodoroTaskDetail>(taskFromDb);
		}

		public async Task<List<PomodoroTaskDetail>> GetTaskList()
		{
			List<PomodoroTask> tasks = await _pomodoroContext
							.PomodoroTasks
							.Where(task => !task.IsDeleted)
							.ToListAsync();

			return _mapper.Map<List<PomodoroTaskDetail>>(tasks);
		}

		public async Task UpdateTask(Guid taskId, PomodoroTaskForUpdate taskForUpdate)
		{
			if (taskForUpdate is null)
				throw new ArgumentNullException(nameof(taskForUpdate));

			PomodoroTask? taskFromDb = await _pomodoroContext
												.PomodoroTasks
												.FirstOrDefaultAsync(task => task.Id == taskId);

			taskFromDb!.Description = taskForUpdate.Description;
			taskFromDb.Duration = taskForUpdate.Duration;

			await _pomodoroContext.SaveChangesAsync();
		}
	}
}
