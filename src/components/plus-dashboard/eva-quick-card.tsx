import { EvaEntryCard } from "@/src/components/eva/eva-entry-card"

export function EvaQuickCard() {
  return (
    <div id="eva-quick">
      <EvaEntryCard
        title="Hablar con EVA"
        description="Orientación emocional cuando la necesites."
        placeholder="¿Qué querés contarle a EVA?"
        submitLabel="Abrir EVA"
        variant="button"
      />
    </div>
  )
}
