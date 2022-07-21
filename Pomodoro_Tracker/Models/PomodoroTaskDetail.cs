using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pomodoro_Tracker.Models
{
	public class PomodoroTaskDetail
	{
		public Guid Id { get; set; }
		public string Description { get; set; } = string.Empty;
		public int Duration { get; set; }
		public DateTime CreationDateUtc { get; set; }
	}
}
