'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Task = {
  id: string; title: string; due_date: string | null; tag: string | null; done: boolean;
};

export default function TasksPage() {
  const [title, setTitle] = useState('');
  const [due, setDue] = useState<string>('');
  const [tag, setTag] = useState('');
  const [rows, setRows] = useState<Task[]>([]);

  async function load() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    const { data, error } = await supabase.from('tasks')
      .select('*').order('done', { ascending: true }).order('due_date', { ascending: true });
    if (!error && data) setRows(data);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    const { error } = await supabase.from('tasks').insert({
      user_id: user.id, title, due_date: due || null, tag: tag || null
    });
    if (!error) { setTitle(''); setDue(''); setTag(''); load(); }
  }

  async function toggle(id: string, done: boolean) {
    await supabase.from('tasks').update({ done: !done }).eq('id', id);
    load();
  }
  async function del(id: string) {
    await supabase.from('tasks').delete().eq('id', id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <h2 className="font-semibold">タスク追加</h2>
        <input className="input" placeholder="タイトル" value={title} onChange={e=>setTitle(e.target.value)} />
        <div className="flex gap-2">
          <input className="input" type="date" value={due} onChange={e=>setDue(e.target.value)} />
          <input className="input" placeholder="タグ（任意）" value={tag} onChange={e=>setTag(e.target.value)} />
          <button className="btn" onClick={add}>追加</button>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">タスク一覧</h2>
        <ul className="space-y-2">
          {rows.map(t => (
            <li key={t.id} className="flex items-center justify-between border rounded p-2">
              <div>
                <div className={t.done ? 'line-through text-gray-400' : ''}>{t.title}</div>
                <div className="text-xs text-gray-500">{t.due_date ?? '期限なし'} {t.tag ? ` / #${t.tag}` : ''}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={() => toggle(t.id, t.done)}>{t.done ? '未完了' : '完了'}</button>
                <button className="btn" onClick={() => del(t.id)}>削除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
