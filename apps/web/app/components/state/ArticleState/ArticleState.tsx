"use client"; // Enable client-side rendering
import { useState } from "react";
import articleMachine from "../../../../../../packages/shared/machines/articleMachine";
import { Badge } from "@/components/ui/badge";
import { createActor } from "xstate";
import { Button } from "@/components/ui/button";
import { Article } from "@/types/common";

async function updateArticleState(articleId: string, action: string) {
  const response = await fetch(`/api/articles/${articleId}/state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });
  return response.json();
}

interface ArticleStateProps {
  article: Article;
  onStateChange: () => void;
}

export default function ArticleState({ article, onStateChange }: ArticleStateProps) {
  const persistedState = {
    status: "active",
    output: undefined,
    error: undefined,
    historyValue: {},
    children: {},
    value: article.state ?? "draft",
    context: { state: article.state ?? "draft" },
  } as any;

  // Initialize actor with the snapshot on the frontend
  const actor = createActor(articleMachine, { snapshot: persistedState });
  actor.start();

  const [state, setState] = useState(actor.getSnapshot().value);

  const handleTransition = async (action: "PUBLISH" | "ARCHIVE" | "EDIT") => {
    const updatedArticle = await updateArticleState(article.id, action);
    if (updatedArticle.success) {
      actor.send({ type: action }); // Explicitly pass an object with type
      setState(actor.getSnapshot().value);
      onStateChange();
    }
  };

  const renderButtons = () => {
    const availableEvents = ["PUBLISH", "ARCHIVE", "EDIT"].filter((event) =>
      actor.getSnapshot().can({ type: event as "PUBLISH" | "ARCHIVE" | "EDIT" })
    );

    return availableEvents.map((event) => (
      <Button key={event} onClick={() => handleTransition(event as "PUBLISH" | "ARCHIVE" | "EDIT")}>
        {event}
      </Button>
    ));
  };

  return (
    <div className="flex flex-row justify-between items-center align-middle pt-4 px-1">
      <Badge variant="default">{state}</Badge>
      <div className="flex flex-row gap-1">{renderButtons()}</div>
    </div>
  );
}
