import { MODULES } from "@/data/modules";
import ModuleClient from "./ModuleClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export default async function ModulePage({ params }) {
  const { slug } = await params;
  const meta = MODULES.find((m) => m.slug === slug);

  if (!meta) notFound();

  let content = null;
  let flashcards = [];

  try {
    const contentModule = await import(`@/data/content/${slug}.json`);
    content = contentModule.default;

    const flashcardsModule = await import(`@/data/flashcards.json`);
    flashcards = flashcardsModule.default;
  } catch (error) {
    console.error(`Data not found for slug: ${slug}`, error);
  }

  if (!content) notFound();

  return <ModuleClient meta={meta} content={content} flashcards={flashcards} />;
}
