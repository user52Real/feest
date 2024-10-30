import { Event } from '@/app/types/events';

export default function EventDetails({ event }: { event: Event }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Event Details
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <DetailItem label="Date" value={new Date(event.date).toLocaleDateString()} />
          <DetailItem label="Time" value={event.time} />
          <DetailItem label="Location" value={event.location} />
          <DetailItem label="Description" value={event.description} span={2} />
        </dl>
      </div>
    </div>
  );
}

function DetailItem({ 
  label, 
  value, 
  span = 1 
}: { 
  label: string; 
  value: string; 
  span?: number; 
}) {
  return (
    <div className={`sm:col-span-${span}`}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  );
}