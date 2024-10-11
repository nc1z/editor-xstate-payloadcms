import { CollectionConfig } from "payload/types";

const Articles: CollectionConfig = {
  slug: "articles",
  labels: {
    singular: "Article",
    plural: "Articles",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title",
    },
    {
      name: "content",
      type: "richText",
      required: true,
      label: "Content",
    },
    {
      name: "state",
      type: "text",
      required: true,
      label: "State",
      defaultValue: "draft",
      admin: {
        position: "sidebar",
        description: "Current state of the article (e.g., draft, published, archived)",
      },
    },
  ],
};

export default Articles;
