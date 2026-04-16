import dynamic from "next/dynamic";


const IgDiagram = dynamic(() => import("@/components/IgDiagram"), {
  ssr: false,
});
const ComplementDiagram = dynamic(
  () => import("@/components/ComplementDiagram"),
  { ssr: false }
);
const HLADiagram = dynamic(() => import("@/components/HLADiagram"), {
  ssr: false,
});
const PhagocytosisDiagram = dynamic(
  () => import("@/components/PhagocytosisDiagram"),
  { ssr: false }
);
const CytokineDiagram = dynamic(() => import("@/components/CytokineDiagram"), {
  ssr: false,
});
const ImmuneResponseDiagram = dynamic(
  () => import("@/components/ImmuneResponseDiagram"),
  { ssr: false }
);

export const DIAGRAMS = {
  immunoglobulines: IgDiagram,
  complement: ComplementDiagram,
  hla: HLADiagram,
  innee: PhagocytosisDiagram,
  cytokines: CytokineDiagram,
  reponse: ImmuneResponseDiagram,
  acquise: ImmuneResponseDiagram,
};

export const TABS = [
  { id: "cours", label: "📖 Cours" },
  { id: "schema", label: "🔬 Schéma" },
  { id: "fiches", label: "🃏 Fiches" },
];

