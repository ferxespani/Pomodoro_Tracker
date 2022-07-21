using AutoMapper;
using Pomodoro_Tracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pomodoro_Tracker.Mappers
{
	public sealed class TaskProfile : Profile
	{
		public TaskProfile()
		{
			CreateMap<PomodoroTask, PomodoroTaskDetail>();
			CreateMap<PomodoroTaskForCreate, PomodoroTask>();
		}
	}
}
