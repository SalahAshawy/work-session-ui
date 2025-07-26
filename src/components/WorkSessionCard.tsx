import type { WorkSession } from '../types/work-session';

export default function WorkSessionCard({ session }: { session: WorkSession }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow-md space-y-1">
      <p><strong>Type:</strong> {session.type}</p>
      <p><strong>Days/Week:</strong> {session.daysPerWeek}</p>
      <p><strong>Hours/Day:</strong> {session.hoursPerDay}</p>
      <p><strong>Start Date:</strong> {new Date(session.startDate!).toLocaleDateString()}</p>
      {session.logs?.length && (
        <p><strong>Logs:</strong> {session.logs.length} entries</p>
      )}
    </div>
  );
}
