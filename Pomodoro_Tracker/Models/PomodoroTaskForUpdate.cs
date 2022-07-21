using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pomodoro_Tracker.Models
{
	public class PomodoroTaskForUpdate
	{
		public string Description { get; set; } = string.Empty;
		public int Duration { get; set; }
	}
}
