import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type EventItem = {
  id: string;
  title: string;
  event_date: string;
  city_id: string;
  summary?: string;
};

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date, city_id, summary')
        .limit(3);

      if (error) {
        setError(error.message);
      } else {
        setEvents(data ?? []);
      }
      setLoading(false);
    }

    loadEvents();
  }, []);

  return (
    <section>
      <div className="hero">
        <h2>City Vibes 城市活动速览</h2>
        <p>精选城市活动与伴手礼灵感，帮助你快速完成作业要求。</p>
      </div>

      <h2>最新活动</h2>
      {loading && <p className="status">加载中...</p>}
      {error && <p className="status error">{error}</p>}

      <div className="card-grid">
        {events.map((event) => (
          <article key={event.id} className="card">
            <span className="badge">{event.city_id}</span>
            <h3>{event.title}</h3>
            <p>日期：{event.event_date}</p>
            {event.summary && <p>{event.summary}</p>}
          </article>
        ))}
        {!loading && events.length === 0 && <p className="status">暂无活动数据</p>}
      </div>
    </section>
  );
}
