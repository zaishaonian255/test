import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type GiftItem = {
  id: string;
  name: string;
  price_range?: string;
  city_id: string;
  description?: string;
  image_url?: string;
  cities?: { name?: string } | { name?: string }[] | null;
};

export default function Gifts() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGifts() {
      const { data, error } = await supabase
        .from('gifts')
        .select('id, name, price_range, description, image_url, city_id, cities(name)')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setGifts(data ?? []);
      }
      setLoading(false);
    }

    fetchGifts();
  }, []);

  const resolveCityName = (gift: GiftItem) => {
    if (!gift.cities) return '未知城市';
    if (Array.isArray(gift.cities)) {
      return gift.cities[0]?.name ?? '未知城市';
    }
    return gift.cities.name ?? '未知城市';
  };

  return (
    <section>
      <div className="section-header">
        <div>
          <h2>城市伴手礼推荐</h2>
          <p className="section-subtitle">展示 Supabase gifts 表中的礼品，并联表显示所属城市。</p>
        </div>
      </div>
      {loading && <p className="status">加载中...</p>}
      {error && <p className="status error">{error}</p>}

      <div className="card-grid">
        {gifts.map((gift) => (
          <article key={gift.id} className="card gift-card">
            {gift.image_url && (
              <img src={gift.image_url} alt={gift.name} className="gift-cover" />
            )}
            <div>
              <span className="badge">{resolveCityName(gift)}</span>
              <h3>{gift.name}</h3>
              {gift.price_range && <p>价格区间：{gift.price_range}</p>}
              {gift.description && <p>{gift.description}</p>}
            </div>
          </article>
        ))}
        {!loading && gifts.length === 0 && <p className="status">暂无礼品数据</p>}
      </div>
    </section>
  );
}
