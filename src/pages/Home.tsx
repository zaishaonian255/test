import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type EventItem = {
  id: string;
  title: string;
  event_date: string;
  city_id: string;
  summary?: string;
};

type GiftItem = {
  id: string;
  name: string;
  price_range?: string;
  description?: string;
  city_id: string;
};

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [giftsLoading, setGiftsLoading] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
  const [giftError, setGiftError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date, city_id, summary')
        .order('event_date', { ascending: true })
        .limit(3);

      if (error) {
        setEventError(error.message);
      } else {
        setEvents(data ?? []);
      }
      setEventsLoading(false);
    }

    async function loadGifts() {
      const { data, error } = await supabase
        .from('gifts')
        .select('id, name, price_range, description, city_id')
        .limit(3);

      if (error) {
        setGiftError(error.message);
      } else {
        setGifts(data ?? []);
      }
      setGiftsLoading(false);
    }

    loadEvents();
    loadGifts();
  }, []);

  return (
    <section>
      <div className="hero">
        <h2>City Vibes 城市活动速览</h2>
        <p>精选城市活动与伴手礼灵感，帮助你快速完成作业要求。</p>
      </div>

      <h2>最新活动</h2>
      {eventsLoading && <p className="status">加载中...</p>}
      {eventError && <p className="status error">{eventError}</p>}

      <div className="card-grid">
        {events.map((event) => (
          <article key={event.id} className="card">
            <span className="badge">城市 ID：{event.city_id}</span>
            <h3>{event.title}</h3>
            <p>日期：{event.event_date}</p>
            {event.summary && <p>{event.summary}</p>}
          </article>
        ))}
        {!eventsLoading && events.length === 0 && <p className="status">暂无活动数据</p>}
      </div>

      <h2 style={{ marginTop: '2rem' }}>热门伴手礼</h2>
      <p className="section-subtitle">从 Supabase 的 gifts 表实时读取，展示 3 款热门伴手礼。</p>
      {giftsLoading && <p className="status">加载中...</p>}
      {giftError && <p className="status error">{giftError}</p>}

      <div className="card-grid">
        {gifts.map((gift) => (
          <article key={gift.id} className="card">
            <h3>{gift.name}</h3>
            <p>城市 ID：{gift.city_id}</p>
            {gift.price_range && <p>价格区间：{gift.price_range}</p>}
            {gift.description && <p>{gift.description}</p>}
          </article>
        ))}
        {!giftsLoading && gifts.length === 0 && <p className="status">暂无礼品数据</p>}
      </div>
    </section>
  );
}
