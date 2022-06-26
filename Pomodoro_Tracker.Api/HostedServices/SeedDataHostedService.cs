using Pomodoro_Tracker.Api.HostedServices.Interfaces;

namespace Pomodoro_Tracker.Api.HostedServices;

public class SeedDataHostedService : IHostedService
{
	private readonly IServiceProvider _serviceProvider;

	public SeedDataHostedService(IServiceProvider serviceProvider)
	{
		_serviceProvider = serviceProvider;
	}

	public async Task StartAsync(CancellationToken cancellationToken)
	{
		using IServiceScope scope = _serviceProvider.CreateScope();
		ISeedProcessingService scopedProcessingService = scope.ServiceProvider.GetRequiredService<ISeedProcessingService>();

		await scopedProcessingService.SeedData(cancellationToken);
	}

	public async Task StopAsync(CancellationToken cancellationToken)
	{
		await Task.CompletedTask;
	}
}