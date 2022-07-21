using Microsoft.EntityFrameworkCore;
using Pomodoro_Tracker.Api.HostedServices;
using Pomodoro_Tracker.Api.HostedServices.Interfaces;
using Pomodoro_Tracker.Mappers;
using Pomodoro_Tracker.Services;

namespace Pomodoro_Tracker.Api;

public class Program
{
	public static async Task Main(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);

		builder.Services.AddControllers();

		builder.Services.AddEndpointsApiExplorer();
		builder.Services.AddSwaggerGen();

		builder.Services.AddDbContext<PomodoroContext>(options =>
		{
			options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
		});

		builder.Services.AddHostedService<SeedDataHostedService>();
		builder.Services.AddScoped<ISeedProcessingService, SeedProcessingService>();
		builder.Services.AddTransient<IPomodoroTaskService, PomodoroTaskService>();

		builder.Services.AddCors(options => options.AddPolicy(name: "PomodoroTasksOrigins",
			policy =>
			{
				string origin = builder.Configuration.GetSection("Origin").Value;
				policy.WithOrigins(origin).AllowAnyMethod().AllowAnyHeader();
			}));
		builder.Services.AddAutoMapper(typeof(TaskProfile));

		var app = builder.Build();

		if (app.Environment.IsDevelopment())
		{
			app.UseSwagger();
			app.UseSwaggerUI();
		}

		app.UseCors("PomodoroTasksOrigins");

		app.MapControllers();

		await app.RunAsync();
	}
}