import Shell from "./Shell";
export default function NotFound({ onBack }) {
  return (
    <Shell>
      <div className="flex flex-col items-center text-center py-24">
        <p className="font-(--font-display) text-2xl text-(--text) mb-2">Deck introuvable</p>
        <p className="text-sm text-(--text-muted) mb-8">Ce deck n'existe pas ou a été supprimé.</p>
        <button onClick={onBack} className="text-sm text-(--accent) underline underline-offset-4 hover:opacity-65 transition-opacity">
          ← Retour aux decks
        </button>
      </div>
    </Shell>
  );
}