import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Utility function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

type News = {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
};

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <span className="inline-block w-8 h-8 bg-blue-600 text-white text-2xl rounded-xl flex items-center justify-center font-black shadow">
              T
            </span>
            <span className="font-extrabold text-xl text-blue-900 tracking-tight">True.News.Daily</span>
          </div>
          <a href="/admin" className="text-sm px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-100 transition">Admin</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-2 py-10">
        {/* Loader */}
        {loading ? (
          <div>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="mb-8 animate-pulse bg-white rounded-2xl shadow h-48 w-full"
              ></div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-gray-400 py-16">No news published yet.</div>
        ) : (
          <section className="space-y-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition-shadow border border-blue-100 overflow-hidden"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-60 object-cover"
                    style={{ objectPosition: "center" }}
                  />
                )}
                <div className="p-6 flex flex-col gap-2">
                  <h2 className="font-bold text-xl text-blue-900">{item.title}</h2>
                  <p className="text-gray-700 whitespace-pre-line text-base">{item.content}</p>
                  {item.video_url && (
                    <video controls src={item.video_url} className="rounded-lg mt-2 w-full max-h-72 mx-auto" />
                  )}
                  <div className="flex justify-end mt-2">
                    <time className="text-xs text-gray-400">{formatDate(item.created_at)}</time>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-10">
        &copy; {new Date().getFullYear()} True.News.Daily
      </footer>
    </div>
  );
}
