'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demodemo');
  const [msg, setMsg] = useState('');

  async function signup() {
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : 'Sign up OK. Check email if required.');
  }
  async function signin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : 'Signed in.');
  }
  async function signout() {
    await supabase.auth.signOut();
    setMsg('Signed out.');
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Login</h2>
      <input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div className="flex gap-2">
        <button className="btn" onClick={signup}>Sign up</button>
        <button className="btn" onClick={signin}>Sign in</button>
        <button className="btn" onClick={signout}>Sign out</button>
      </div>
      <p className="text-sm text-gray-600">{msg}</p>
    </div>
  );
}
