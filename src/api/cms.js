/**
 * Re:Earth CMS Integration API client.
 *
 * Environment variables (in .env locally, GitHub Secrets in CI):
 *   VITE_REEARTH_API_TOKEN        — Integration token (secret_…)
 *   VITE_REEARTH_WORKSPACE_ID     — Workspace ID
 *   VITE_REEARTH_PROJECT_ID       — Project ID
 *   VITE_REEARTH_SPOTS_MODEL_ID   — Model ID for "learning-spots"
 *   VITE_REEARTH_MENTORS_MODEL_ID — Model ID for "community-mentors"
 *   VITE_REEARTH_LOGS_MODEL_ID    — Model ID for "learning-logs"
 *
 * Actual CMS field keys (from schema):
 *   Learning Spots:   username, area-description, category, photo, location, recommended-for, submitted-by-user
 *   Community Mentors: name, what-i-can-teach, languages, available-when, location
 *   Learning Logs:    name, role, spot-visited, date, what-i-learned, photo, language-written-in, teacher
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

function geoPoint(lat, lng) {
  return { type: 'Point', coordinates: [lng, lat] }
}

function buildFields(type, data) {
  const hasLocation = data.lat != null && data.lng != null

  if (type === 'spot') {
    return [
      { key: 'username',          value: data.username },
      { key: 'area-description',  value: data['area-description'] },
      { key: 'category',          value: data.category },
      { key: 'recommended-for',   value: data['recommended-for'] },
      hasLocation ? { key: 'location', value: geoPoint(data.lat, data.lng) } : null,
    ]
  }

  if (type === 'mentor') {
    return [
      { key: 'name',             value: data.name },
      { key: 'what-i-can-teach', value: data['what-i-can-teach'] },
      { key: 'languages',        value: data.languages },
      { key: 'available-when',   value: data['available-when'] },
      hasLocation ? { key: 'location', value: geoPoint(data.lat, data.lng) } : null,
    ]
  }

  if (type === 'log') {
    return [
      { key: 'name',                value: data.name },
      { key: 'role',                value: data.role },
      { key: 'spot-visited',        value: data['spot-visited'] },
      { key: 'date',                value: data.date },
      { key: 'what-i-learned',      value: data['what-i-learned'] },
      { key: 'language-written-in', value: data['language-written-in'] },
      { key: 'teacher',             value: data.teacher },
    ]
  }

  return []
}

/**
 * Create a new item via the Re:Earth CMS Integration API.
 *
 * @param {'spot' | 'mentor' | 'log'} type
 * @param {object} data — field values (lat/lng for location)
 */
export async function createCmsItem(type, data) {
  if (!isCmsConfigured()) {
    throw new Error('CMS not configured — check your .env file.')
  }

  const modelId = MODEL_IDS[type]
  if (!modelId) throw new Error(`Unknown item type: ${type}`)

  const fields = buildFields(type, data)
    .filter(Boolean)
    .filter((f) => f.value !== '' && f.value !== undefined && f.value !== null)

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

/**
 * Fetch all items for a given model type.
 *
 * @param {'spot' | 'mentor' | 'log'} type
 * @returns {{ items: object[], totalCount: number }}
 */
export async function fetchCmsItems(type) {
  if (!isCmsConfigured()) {
    throw new Error('CMS not configured — check your .env file.')
  }

  const modelId = MODEL_IDS[type]
  if (!modelId) throw new Error(`Unknown item type: ${type}`)

  const res = await fetch(
    `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/models/${modelId}/items`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  )

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`CMS ${res.status}: ${text}`)
  }

  return res.json()
}

/**
 * Delete an item from the CMS.
 *
 * @param {'spot' | 'mentor' | 'log'} type
 * @param {string} itemId
 */
export async function deleteCmsItem(type, itemId) {
  if (!isCmsConfigured()) {
    throw new Error('CMS not configured — check your .env file.')
  }

  const modelId = MODEL_IDS[type]
  if (!modelId) throw new Error(`Unknown item type: ${type}`)

  const res = await fetch(
    `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/models/${modelId}/items/${itemId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  )

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`CMS ${res.status}: ${text}`)
  }
}

/**
 * Publish an item so it appears in the public GeoJSON feed.
 *
 * @param {'spot' | 'mentor' | 'log'} type
 * @param {string} itemId
 */
export async function publishCmsItem(type, itemId) {
  if (!isCmsConfigured()) {
    throw new Error('CMS not configured — check your .env file.')
  }

  const modelId = MODEL_IDS[type]
  if (!modelId) throw new Error(`Unknown item type: ${type}`)

  const res = await fetch(
    `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/models/${modelId}/items/${itemId}/publish`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  )

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`CMS ${res.status}: ${text}`)
  }

  return res.json().catch(() => null)
}
