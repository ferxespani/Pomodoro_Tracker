using Pomodoro_Tracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pomodoro_Tracker.Services
{
	public interface IPomodoroTaskService
	{
        Task<PomodoroTaskDetail> CreateTask(PomodoroTaskForCreate task);
        Task DeleteTask(Guid taskId);
        Task<PomodoroTaskDetail> GetTask(Guid taskId);
        Task<List<PomodoroTaskDetail>> GetTaskList();
        Task UpdateTask(Guid taskId, PomodoroTaskForUpdate taskForUpdate);
    }
}
