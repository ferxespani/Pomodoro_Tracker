namespace Pomodoro_Tracker.Api.HostedServices.Interfaces
{
	public interface ISeedProcessingService
	{
		Task SeedData(CancellationToken cancellationToken);
	}
}
