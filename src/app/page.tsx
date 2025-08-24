'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { startOfWeek, endOfWeek, formatISO } from 'date-fns';

type Row = { count: number };

export default function Home() {
  const [doneThisWeek, setDone] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const from = formatISO(startOfWeek(new Date(), { weekStartsOn: 1 }));
      const to   = formatISO(endOfWeek(new Date(), { weekStartsOn: 1 }));

      const { data, error } = await supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('done', true)
        .gte('created_at', from)
        .lte('created_at', to);

      if (error) console.error(error);
      setDone((data as unknown as Row)?.count ?? 0);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="font-semibold mb-2">今週の達成数</h2>
        <div className="text-3xl">{doneThisWeek ?? '-'}</div>
      </div>
      <div className="card">
        <p>まずは <a className="underline" href="/tasks">Tasks</a> と <a className="underline" href="/habits">Habits</a> を使ってみてください。<a className="underline" href="/login">Login</a> が必要です。</p>
      </div>
    </div>
  );
}
