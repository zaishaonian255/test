import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type EventItem = {
  id: string;
  title: string;
  event_date: string;
  city_id: string;
  summary?: string;
};

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase.from('events').select('*');
      if (error) {
        setError(error.message);
      } else {
        setEvents(data ?? []);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  return (
    <section>
      <h2>全部活动列表</h2>
      {loading && <p className="status">加载中...</p>}
      {error && <p className="status error">{error}</p>}

      <div className="card-grid">
        {events.map((event) => (
          <article key={event.id} className="card">
            <h3>{event.title}</h3>
            <p>日期：{event.event_date}</p>
            <p>城市 ID：{event.city_id}</p>
            {event.summary && <p>{event.summary}</p>}
          </article>
        ))}
        {!loading && events.length === 0 && <p className="status">暂无数据</p>}
      </div>
    </section>
  );
}
