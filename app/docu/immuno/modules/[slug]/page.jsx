import { MODULES } from "@/data/modules";
import ModuleClient from "./ModuleClient";
import contentData from "@/data/content.json";
import flashcardsData from "@/data/flashcards.json";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export default async function ModulePage({ params }) {
  const { slug } = await params;
  const meta = MODULES.find((m) => m.slug === slug);
  if (!meta) notFound();

  const content = contentData[slug];
  const flashcards = flashcardsData[slug] || [];

  return <ModuleClient meta={meta} content={content} flashcards={flashcards} />;
}
