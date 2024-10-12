import { Article } from "@/types/common";
import { useState, useEffect, useCallback } from "react";

function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`, { cache: "no-store" });
    const { docs } = await res.json();
    setArticles(docs);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, refetch: fetchArticles };
}

export default useArticles;
