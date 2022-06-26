using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
			options.EnableSensitiveDataLogging();
			options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
		});

		builder.Services.AddHostedService<SeedDataHostedService>();
		builder.Services.AddScoped<ISeedProcessingService, SeedProcessingService>();

		var app = builder.Build();

		if (app.Environment.IsDevelopment())
		{
			app.UseSwagger();
			app.UseSwaggerUI();
		}

		app.MapControllers();

		await app.RunAsync();
	}
}