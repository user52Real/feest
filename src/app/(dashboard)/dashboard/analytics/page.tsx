import { getEventStats } from '@/app/lib/analytics';
import StatCard from '@/app/components/StatCard';

export default async function AnalyticsPage() {
  const stats = await getEventStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          trend={stats.eventsTrend}
        />
        <StatCard
          title="Total Attendees"
          value={stats.totalAttendees}
          trend={stats.attendeesTrend}
        />
        <StatCard
          title="Revenue"
          value={stats.totalRevenue}
          trend={stats.revenueTrend}
          format="currency"
        />
      </div>

      {/* You can add more sections here, such as charts or detailed statistics */}
    </div>
  );
}