'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

type Habit = { id: string; name: string; freq_type: 'daily'|'weekly'; freq_value: number; };
type Log = { habit_id: string; log_date: string; };

export default function HabitsPage() {
  const [name, setName] = useState('');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logsToday, setLogsToday] = useState<Set<string>>(new Set());
  const today = format(new Date(), 'yyyy-MM-dd');

  async function load() {
    const u = (await supabase.auth.getUser()).data.user;
    if (!u) return;

    const h = await supabase.from('habits').select('*').order('created_at');
    if (!h.error && h.data) setHabits(h.data as Habit[]);

    const l = await supabase.from('habit_logs').select('habit_id, log_date').eq('log_date', today);
    if (!l.error && l.data) setLogsToday(new Set(l.data.map(d => d.habit_id)));
  }

  useEffect(() => { load(); }, []);

  async function addHabit() {
    const u = (await supabase.auth.getUser()).data.user;
    if (!u) return;
    const { error } = await supabase.from('habits').insert({
      user_id: u.id, name, freq_type: 'daily', freq_value: 1
    });
    if (!error) { setName(''); load(); }
  }

  async function toggle(habitId: string) {
    if (logsToday.has(habitId)) {
      await supabase.from('habit_logs').delete().eq('habit_id', habitId).eq('log_date', today);
    } else {
      const u = (await supabase.auth.getUser()).data.user;
      if (!u) return;
      await supabase.from('habit_logs').insert({ user_id: u.id, habit_id: habitId, log_date: today, done: true });
    }
    load();
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <h2 className="font-semibold">習慣追加</h2>
        <div className="flex gap-2">
          <input className="input" placeholder="（例）30分学習" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn" onClick={addHabit}>追加</button>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">今日のチェック（{today}）</h2>
        <ul className="space-y-2">
          {habits.map(h => (
            <li key={h.id} className="flex items-center justify-between border rounded p-2">
              <div>{h.name}</div>
              <button className="btn" onClick={() => toggle(h.id)}>
                {logsToday.has(h.id) ? '◯ 済' : '□ 未'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
