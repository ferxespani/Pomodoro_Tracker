using Microsoft.AspNetCore.Mvc;
using Pomodoro_Tracker.Models;
using Pomodoro_Tracker.Services;

namespace Pomodoro_Tracker.Api.Controllers
{
    [Route("api/tasks")]
    [ApiController]
    public class PomodoroTasksController : ControllerBase
    {
        private readonly IPomodoroTaskService _pomodoroTaskService;

        public PomodoroTasksController(IPomodoroTaskService pomodoroTaskService)
        {
            _pomodoroTaskService = pomodoroTaskService ?? throw new ArgumentNullException(nameof(pomodoroTaskService));
        }

        [HttpGet(Name = nameof(GetTaskList))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTaskList()
        {
            List<PomodoroTaskDetail> tasks = await _pomodoroTaskService.GetTaskList();
            return Ok(tasks);
        }

        [HttpGet("{taskId:Guid}", Name = nameof(GetTaskById))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTaskById([FromRoute] Guid taskId)
        {
            PomodoroTaskDetail task = await _pomodoroTaskService.GetTask(taskId);

            if (task is null)
                return NotFound();

            return Ok(task);
        }

        [HttpPost(Name = nameof(CreateTask))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateTask([FromBody] PomodoroTaskForCreate taskForCreate)
        {
            PomodoroTaskDetail createdTask = await _pomodoroTaskService.CreateTask(taskForCreate);

            return CreatedAtAction(
                actionName: nameof(GetTaskById),
                routeValues: new { taskId = createdTask.Id },
                value: createdTask);
        }

        [HttpPut("{taskId:Guid}", Name = nameof(UpdateTask))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateTask([FromRoute] Guid taskId, [FromBody] PomodoroTaskForUpdate taskForUpdate)
        {
            await _pomodoroTaskService.UpdateTask(taskId, taskForUpdate);
            return NoContent();
        }

        [HttpDelete("{taskId:Guid}", Name = nameof(DeleteTask))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteTask([FromRoute] Guid taskId)
        {
	        await _pomodoroTaskService.DeleteTask(taskId);
            return NoContent();
        }
    }
}
