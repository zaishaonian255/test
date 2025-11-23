import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type EventItem = {
  id: string;
  title: string;
  event_date: string;
  city_id: string;
  summary?: string;
  registration_url?: string;
};

type City = {
  id: string;
  name: string;
};

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cityNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    cities.forEach((city) => {
      map[city.id] = city.name;
    });
    return map;
  }, [cities]);

  useEffect(() => {
    async function fetchCities() {
      const { data } = await supabase.from('cities').select('id, name');
      setCities(data ?? []);
    }

    fetchCities();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      let query = supabase
        .from('events')
        .select('id, title, event_date, city_id, summary, registration_url')
        .order('event_date', { ascending: true });

      if (selectedCity) {
        query = query.eq('city_id', selectedCity);
      }

      const { data, error } = await query;
      if (error) {
        setError(error.message);
      } else {
        setEvents(data ?? []);
        setError(null);
      }
      setLoading(false);
    }

    fetchEvents();
  }, [selectedCity]);

  return (
    <section>
      <div className="section-header">
        <div>
          <h2>全部活动列表</h2>
          <p className="section-subtitle">支持根据城市筛选，数据来自 Supabase events 表。</p>
        </div>
        <div className="filter-bar">
          <label htmlFor="city-filter">按城市查看：</label>
          <select
            id="city-filter"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">全部城市</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="status">加载中...</p>}
      {error && <p className="status error">{error}</p>}

      <div className="card-grid">
        {events.map((event) => (
          <article key={event.id} className="card">
            <span className="badge">{cityNameMap[event.city_id] ?? '未知城市'}</span>
            <h3>{event.title}</h3>
            <p>日期：{event.event_date}</p>
            {event.summary && <p>{event.summary}</p>}
            {event.registration_url && (
              <a className="link" href={event.registration_url} target="_blank" rel="noreferrer">
                报名链接
              </a>
            )}
          </article>
        ))}
        {!loading && events.length === 0 && <p className="status">暂无数据</p>}
      </div>
    </section>
  );
}
