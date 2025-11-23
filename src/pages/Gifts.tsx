import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type GiftItem = {
  id: string;
  name: string;
  price_range?: string;
  city_id: string;
  description?: string;
};

export default function Gifts() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGifts() {
      const { data, error } = await supabase.from('gifts').select('*');
      if (error) {
        setError(error.message);
      } else {
        setGifts(data ?? []);
      }
      setLoading(false);
    }

    fetchGifts();
  }, []);

  return (
    <section>
      <h2>城市伴手礼推荐</h2>
      {loading && <p className="status">加载中...</p>}
      {error && <p className="status error">{error}</p>}

      <div className="card-grid">
        {gifts.map((gift) => (
          <article key={gift.id} className="card">
            <h3>{gift.name}</h3>
            <p>城市 ID：{gift.city_id}</p>
            {gift.price_range && <p>价格区间：{gift.price_range}</p>}
            {gift.description && <p>{gift.description}</p>}
          </article>
        ))}
        {!loading && gifts.length === 0 && <p className="status">暂无礼品数据</p>}
      </div>
    </section>
  );
}
