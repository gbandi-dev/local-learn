/**
 * Re:Earth CMS write API client.
 *
 * Required environment variables (create a .env file in project root):
 *   VITE_REEARTH_API_TOKEN      — API token from Re:Earth CMS settings
 *   VITE_REEARTH_PROJECT_ID     — Project ID (UUID from CMS project settings)
 *   VITE_REEARTH_SPOTS_MODEL_ID   — Model ID for "learning-spots"
 *   VITE_REEARTH_MENTORS_MODEL_ID — Model ID for "community-mentors"
 *
 * How to find these values:
 *   1. Log in to your Re:Earth CMS instance
 *   2. Go to Settings → API → create or copy a token
 *   3. Project ID and Model IDs are shown in Settings → General
 */

const BASE    = 'https://api.cms.reearth.io'
const TOKEN   = import.meta.env.VITE_REEARTH_API_TOKEN
const PROJECT = import.meta.env.VITE_REEARTH_PROJECT_ID

const MODEL_IDS = {
  spot:   import.meta.env.VITE_REEARTH_SPOTS_MODEL_ID,
  mentor: import.meta.env.VITE_REEARTH_MENTORS_MODEL_ID,
}

export function isCmsConfigured() {
  return Boolean(TOKEN && PROJECT && MODEL_IDS.spot && MODEL_IDS.mentor)
}

/**
 * Create a new item in the Re:Earth CMS.
 *
 * @param {'spot' | 'mentor'} type
 * @param {{ name, name_ja, description, category, languages, lat, lng }} data
 */
export async function createCmsItem(type, data) {
  if (!isCmsConfigured()) {
    throw new Error(
      'CMS not configured. Add VITE_REEARTH_API_TOKEN, VITE_REEARTH_PROJECT_ID, ' +
      'VITE_REEARTH_SPOTS_MODEL_ID, and VITE_REEARTH_MENTORS_MODEL_ID to your .env file.'
    )
  }

  const modelId = MODEL_IDS[type]

  const fields = [
    { key: 'name',        value: data.name },
    { key: 'name_ja',     value: data.name_ja },
    { key: 'description', value: data.description },
    { key: 'category',    value: data.category },
    { key: 'languages',   value: data.languages },
    // GeoJSON point — Re:Earth CMS stores coordinates as a geo field
    { key: 'location', value: { type: 'Point', coordinates: [data.lng, data.lat] } },
  ].filter((f) => f.value !== '' && f.value !== undefined)

  const res = await fetch(
    `${BASE}/api/projects/${PROJECT}/models/${modelId}/items`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ fields }),
    }
  )

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`CMS responded with ${res.status}: ${text}`)
  }

  return res.json()
}
