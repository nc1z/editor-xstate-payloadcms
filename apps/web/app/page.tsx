"use client";

import ArticleState from "./components/state/ArticleState/ArticleState";
import useArticles from "./hooks/useArticles";

export default function Home() {
  const { articles, loading, refetch } = useArticles();
  const article = articles?.[0];
  const title = article?.title ?? "Title";
  const content = article?.content?.[0]?.children?.[0]?.text ?? "Content";

  return (
    <div className="min-h-screen px-4 bg-gray-100 flex items-center justify-center">
      <main className="p-6 bg-white shadow-md rounded-md max-w-lg w-full">
        <>
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="text-gray-700 mb-4">{content}</p>
          {article && <ArticleState article={article} onStateChange={refetch} />}
        </>
      </main>
    </div>
  );
}
