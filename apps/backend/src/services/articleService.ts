import { NotFoundError, ValidationError } from "../errors/errors";
import articleMachine from "../../../../packages/shared/machines/articleMachine";
import { createActor } from "xstate";

export const updateArticleState = async (payload, id: string, actionType: "PUBLISH" | "ARCHIVE" | "EDIT") => {
  const article = await payload.findByID({
    collection: "articles",
    id,
  });

  if (!article) {
    throw new NotFoundError("Article not found");
  }

  const persistedState = {
    status: "active",
    output: undefined,
    error: undefined,
    historyValue: {},
    children: {},
    value: article.state ?? "draft",
    context: { state: article.state ?? "draft" },
  } as any;

  const actor = createActor(articleMachine, {
    snapshot: persistedState,
  });

  actor.start();

  const initialState = actor.getSnapshot().value;

  actor.send({ type: actionType });

  const newState = actor.getSnapshot().value;

  if (newState === initialState) {
    throw new ValidationError(`Invalid transition from ${article.state} using action ${actionType}`);
  }

  await payload.update({
    collection: "articles",
    id,
    data: { state: newState },
  });

  return { success: true, state: newState };
};
