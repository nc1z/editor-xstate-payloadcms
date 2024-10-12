import { Badge } from "./components/ui/badge";

async function getArticles() {
  const res = await fetch(`${process.env.BACKEND_URL}/api/articles`, { cache: "no-store" });
  const { docs } = await res.json();
  return docs;
}

export default async function Home() {
  const articles = await getArticles();

  const title = articles?.[0]?.title;
  const content = articles?.[0]?.content?.[0]?.children?.[0]?.text;
  const state = articles?.[0]?.state;

  const stateVariant = state === "published" ? "default" : state === "draft" ? "secondary" : "destructive";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <main className="p-6 bg-white shadow-md rounded-md max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">{title ?? "Title"}</h1>
        <p className="text-gray-700 mb-4">{content ?? "Content"}</p>
        <div className="mt-4">
          <Badge variant={stateVariant}>{state}</Badge>
        </div>
      </main>
    </div>
  );
}
