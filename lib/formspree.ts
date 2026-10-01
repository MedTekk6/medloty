// Configuration Formspree — reçoit les commandes envoyées depuis le site
export const FORMSPREE_ID = 'xjgqwrvg'
export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`

export interface FormResponse {
  ok: boolean
  error?: string
}

export async function submitForm<T extends Record<string, unknown>>(
  data: T
): Promise<FormResponse> {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        ok: false,
        error: result?.errors?.[0]?.message || 'Une erreur est survenue',
      }
    }

    return { ok: true }
  } catch {
    return {
      ok: false,
      error: 'Erreur de connexion. Vérifiez votre réseau.',
    }
  }
}