using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Pomodoro_Tracker.Api;

public class Program
{
	public static void Main(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);

		builder.Services.AddControllers();

		builder.Services.AddEndpointsApiExplorer();
		builder.Services.AddSwaggerGen();

		builder.Services.AddDbContext<PomodoroContext>(options =>
		{
			options.EnableSensitiveDataLogging();
			options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
		});

		var app = builder.Build();

		if (app.Environment.IsDevelopment())
		{
			app.UseSwagger();
			app.UseSwaggerUI();
		}

		app.MapControllers();

		app.Run();
	}
}