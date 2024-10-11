import { setup, assign } from "xstate";

const articleMachine = setup({
  types: {
    context: {} as { state: "draft" | "published" | "archived" },
    events: {} as { type: "PUBLISH" } | { type: "ARCHIVE" } | { type: "EDIT" },
  },
  actions: {
    setPublished: assign({
      state: (_) => "published" as const,
    }),
    setDraft: assign({
      state: (_) => "draft" as const,
    }),
    setArchived: assign({
      state: (_) => "archived" as const,
    }),
  },
  guards: {
    canPublish: ({ context }) => context.state === "draft",
    canArchive: ({ context }) => context.state === "published",
    canEdit: ({ context }) => context.state === "archived" || context.state === "published",
  },
}).createMachine({
  context: {
    state: "draft",
  },
  initial: "draft",
  states: {
    draft: {
      on: {
        PUBLISH: {
          target: "published",
          actions: "setPublished",
          guard: "canPublish",
        },
      },
    },
    published: {
      on: {
        ARCHIVE: {
          target: "archived",
          actions: "setArchived",
          guard: "canArchive",
        },
        EDIT: {
          target: "draft",
          actions: "setDraft",
          guard: "canEdit",
        },
      },
    },
    archived: {
      on: {
        EDIT: {
          target: "draft",
          actions: "setDraft",
          guard: "canEdit",
        },
      },
    },
  },
});

export default articleMachine;
