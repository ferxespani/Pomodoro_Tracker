using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pomodoro_Tracker.Api.Models;

namespace Pomodoro_Tracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PomodoroTasksController : ControllerBase
    {
        private readonly PomodoroContext _context;

        public PomodoroTasksController(PomodoroContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PomodoroTask>>> Get()
        {
	        return await _context.PomodoroTasks
		        .Where(t => !t.IsDeleted)
		        .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PomodoroTask>> Get(Guid id)
        {
	        var pomodoroTask = await _context.PomodoroTasks.FindAsync(id);

            if (pomodoroTask == null)
            {
                return NotFound();
            }

            return pomodoroTask;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, PomodoroTask pomodoroTask)
        {
            if (id != pomodoroTask.Id)
            {
                return BadRequest();
            }

            _context.Entry(pomodoroTask).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<PomodoroTask>> Create(PomodoroTask pomodoroTask)
        {
	        await _context.PomodoroTasks.AddAsync(pomodoroTask);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Create), new { id = pomodoroTask.Id }, pomodoroTask);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(Guid id)
        {
	        var pomodoroTask = await _context.PomodoroTasks.FirstOrDefaultAsync(t => t.Id == id);
            if (pomodoroTask == null)
            {
                return NotFound();
            }

            pomodoroTask.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
