import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function TodosPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from('todos').select('*');

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Supabase Connection Test</h1>
      {error && (
        <div className="p-4 rounded bg-red-950/50 border border-red-800 text-red-200 text-sm">
          <p className="font-semibold">Query Status: Error</p>
          <p className="text-xs font-mono mt-1">{error.message}</p>
        </div>
      )}
      {!error && (
        <div className="p-4 rounded bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-sm">
          <p className="font-semibold">Supabase Connected: OK</p>
          <p className="text-xs font-mono mt-1">Target Project: yzlxhuafzmsnlbwgupqp</p>
        </div>
      )}
      <ul className="divide-y divide-zinc-800 border border-zinc-800 rounded">
        {todos?.map((todo: any) => (
          <li key={todo.id} className="p-3 text-sm text-zinc-300">
            {todo.name || todo.title || JSON.stringify(todo)}
          </li>
        ))}
        {(!todos || todos.length === 0) && (
          <li className="p-3 text-sm text-zinc-500 italic">
            Tiada rekod dalam jadual 'todos'. Hubungan Supabase berfungsi.
          </li>
        )}
      </ul>
    </div>
  );
}
