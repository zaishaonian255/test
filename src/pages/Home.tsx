import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type EventItem = {
  id: string;
  title: string;
  event_date: string;
  city_id: string;
  summary?: string;
  cover_image_url?: string | null;
};

type GiftItem = {
  id: string;
  name: string;
  price_range?: string;
  description?: string;
  city_id: string;
  image_url?: string | null;
};

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [giftsLoading, setGiftsLoading] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
  const [giftError, setGiftError] = useState<string | null>(null);

  const eventFallbacks = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=60'
  ];

  const giftFallbacks = [
    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1503602642458-ba4b4a7a0e8c?auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=60'
  ];

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date, city_id, summary, cover_image_url')
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
        .select('id, name, price_range, description, city_id, image_url')
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
        {events.map((event, index) => (
          <article key={event.id} className="card card-with-image">
            <div className="card-media">
              <img
                src={event.cover_image_url || eventFallbacks[index % eventFallbacks.length]}
                alt={event.title}
              />
            </div>
            <div className="card-content">
              <span className="badge">城市 ID：{event.city_id}</span>
              <h3>{event.title}</h3>
              <p>日期：{event.event_date}</p>
              {event.summary && <p>{event.summary}</p>}
            </div>
          </article>
        ))}
        {!eventsLoading && events.length === 0 && <p className="status">暂无活动数据</p>}
      </div>

      <h2 style={{ marginTop: '2rem' }}>热门伴手礼</h2>
      <p className="section-subtitle">从 Supabase 的 gifts 表实时读取，展示 3 款热门伴手礼。</p>
      {giftsLoading && <p className="status">加载中...</p>}
      {giftError && <p className="status error">{giftError}</p>}

      <div className="card-grid">
        {gifts.map((gift, index) => (
          <article key={gift.id} className="card card-with-image">
            <div className="card-media">
              <img
                src={gift.image_url || giftFallbacks[index % giftFallbacks.length]}
                alt={gift.name}
              />
            </div>
            <div className="card-content">
              <span className="badge">城市 ID：{gift.city_id}</span>
              <h3>{gift.name}</h3>
              {gift.price_range && <p>价格区间：{gift.price_range}</p>}
              {gift.description && <p>{gift.description}</p>}
            </div>
          </article>
        ))}
        {!giftsLoading && gifts.length === 0 && <p className="status">暂无礼品数据</p>}
      </div>
    </section>
  );
}
