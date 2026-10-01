// Injecte un bloc de données structurées schema.org (JSON-LD) dans la page.
// Composant serveur — aucune interactivité, pas de 'use client' nécessaire.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}