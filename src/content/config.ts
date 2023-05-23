import { z, defineCollection } from "astro:content";
const docs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    section_title: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = {
  docs: docs,
};
