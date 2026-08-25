import { getPlusEntitlement } from "@/src/lib/plus/entitlement"
import { MensajesClient } from "./mensajes-client"

export default async function MensajesPage() {
  const entitlement = await getPlusEntitlement()
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Mensajes</h1>
      <MensajesClient userId={entitlement.userId!} />
    </main>
  )
}
