using Microsoft.EntityFrameworkCore;
using Pomodoro_Tracker.Api.HostedServices;
using Pomodoro_Tracker.Api.HostedServices.Interfaces;

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

		builder.Services.AddCors(options => options.AddPolicy(name: "PomodoroTasksOrigins",
			policy =>
			{
				policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
			}));

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