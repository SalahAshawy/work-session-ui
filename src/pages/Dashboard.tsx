import { useEffect, useState } from 'react';
import { getWorkSessions } from '../services/api';
import WorkSessionForm from '../components/WorkSessionForm';
import WorkSessionCard from '../components/WorkSessionCard';
import type { WorkSession } from '../types/work-session';

export default function Dashboard() {
  const [sessions, setSessions] = useState<WorkSession[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getWorkSessions();
      setSessions(data);
    })();
  }, []);

  return (
    <div className="p-8">
      <WorkSessionForm />
      <h2 className="text-xl mt-10 mb-4 font-semibold">Existing Work Sessions</h2>
      <div className="grid gap-4">
        {sessions.map((s) => (
          <WorkSessionCard key={s._id} session={s} />
        ))}
      </div>
    </div>
  );
}
