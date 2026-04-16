/**
 * Re:Earth CMS Integration API client.
 *
 * Environment variables (in .env locally, GitHub Secrets in CI):
 *   VITE_REEARTH_API_TOKEN        — Integration token (secret_…)
 *   VITE_REEARTH_PROJECT_ID       — Project ID
 *   VITE_REEARTH_SPOTS_MODEL_ID   — Model ID for "learning-spots"
 *   VITE_REEARTH_MENTORS_MODEL_ID — Model ID for "community-mentors"
 *   VITE_REEARTH_LOGS_MODEL_ID    — Model ID for "learning-logs"
 */

const BASE      = 'https://api.cms.reearth.io'
const TOKEN     = import.meta.env.VITE_REEARTH_API_TOKEN
const WORKSPACE = import.meta.env.VITE_REEARTH_WORKSPACE_ID
const PROJECT   = import.meta.env.VITE_REEARTH_PROJECT_ID

const MODEL_IDS = {
  spot:   import.meta.env.VITE_REEARTH_SPOTS_MODEL_ID,
  mentor: import.meta.env.VITE_REEARTH_MENTORS_MODEL_ID,
  log:    import.meta.env.VITE_REEARTH_LOGS_MODEL_ID,
}

export function isCmsConfigured() {
  return Boolean(TOKEN && WORKSPACE && PROJECT && MODEL_IDS.spot && MODEL_IDS.mentor)
}

/**
 * Create a new item via the Re:Earth CMS Integration API.
 *
 * @param {'spot' | 'mentor' | 'log'} type
 * @param {object} data  — field values; lat/lng used for the location geo field
 */
export async function createCmsItem(type, data) {
  if (!isCmsConfigured()) {
    throw new Error('CMS not configured — check your .env file.')
  }

  const modelId = MODEL_IDS[type]
  if (!modelId) throw new Error(`Unknown item type: ${type}`)

  // Build fields array — skip empty values
  const fields = [
    { key: 'name',        value: data.name },
    { key: 'name_ja',     value: data.name_ja },
    { key: 'description', value: data.description },
    { key: 'category',    value: data.category },
    { key: 'languages',   value: data.languages },
    // Geo point — Re:Earth CMS geo field expects GeoJSON Point
    data.lat != null && data.lng != null
      ? { key: 'location', value: { type: 'Point', coordinates: [data.lng, data.lat] } }
      : null,
    // Learning log extras
    data.spot_id   ? { key: 'spot_id',   value: data.spot_id }   : null,
    data.notes     ? { key: 'notes',     value: data.notes }     : null,
    data.rating    ? { key: 'rating',    value: data.rating }    : null,
    data.visited_at ? { key: 'visited_at', value: data.visited_at } : null,
  ].filter(Boolean).filter((f) => f.value !== '' && f.value !== undefined)

  const res = await fetch(
    `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/models/${modelId}/items`,
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
    throw new Error(`CMS ${res.status}: ${text}`)
  }

  return res.json()
}
