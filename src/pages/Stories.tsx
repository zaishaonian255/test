import { type FormEvent, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Story = {
  id: string;
  author_name: string | null;
  content: string;
  created_at: string;
  cities?: { name?: string } | { name?: string }[] | null;
};

type City = {
  id: string;
  name: string;
};

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [cityId, setCityId] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      const [{ data: storiesData, error: storiesError }, { data: citiesData }] = await Promise.all([
        supabase
          .from('stories')
          .select('id, author_name, content, created_at, cities(name)')
          .order('created_at', { ascending: false }),
        supabase.from('cities').select('id, name')
      ]);

      if (storiesError) {
        setError(storiesError.message);
      } else {
        setStories(storiesData ?? []);
        setError(null);
      }

      setCities(citiesData ?? []);
      setLoading(false);
    }

    loadInitialData();
  }, []);

  const resolveCityName = (story: Story) => {
    if (!story.cities) return '未注明城市';
    if (Array.isArray(story.cities)) {
      return story.cities[0]?.name ?? '未注明城市';
    }
    return story.cities.name ?? '未注明城市';
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError('请填写留言内容');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const { data, error } = await supabase
      .from('stories')
      .insert([
        {
          author_name: authorName || '匿名访客',
          content,
          city_id: cityId || null
        }
      ])
      .select('id, author_name, content, created_at, cities(name)')
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setStories((prev) => [data, ...prev]);
      setAuthorName('');
      setCityId('');
      setContent('');
      setSuccess('留言已提交，感谢分享！');
    }

    setSubmitting(false);
  }

  return (
    <section>
      <div className="section-header">
        <div>
          <h2>游客故事 / 留言板</h2>
          <p className="section-subtitle">数据来自 Supabase stories 表，可在此分享城市体验。</p>
        </div>
      </div>

      <form className="story-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            昵称
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="可留空"
            />
          </label>
          <label>
            城市
            <select value={cityId} onChange={(e) => setCityId(e.target.value)}>
              <option value="">未指定</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          留言内容
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="分享你的城市体验或推荐"
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? '提交中...' : '提交留言'}
        </button>
        {error && <p className="status error">{error}</p>}
        {success && <p className="status success">{success}</p>}
      </form>

      {loading ? (
        <p className="status">加载留言中...</p>
      ) : (
        <div className="story-list">
          {stories.map((story) => (
            <article key={story.id} className="card story-card">
              <div className="story-meta">
                <strong>{story.author_name || '匿名'}</strong>
                <span>· {resolveCityName(story)}</span>
                <span>{new Date(story.created_at).toLocaleDateString()}</span>
              </div>
              <p>{story.content}</p>
            </article>
          ))}
          {stories.length === 0 && <p className="status">暂无留言，快来写第一条吧！</p>}
        </div>
      )}
    </section>
  );
}
