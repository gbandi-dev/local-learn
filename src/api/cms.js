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
 *   Learning Logs:    name, role, spot-visited, date, what-i-learned, category, photo, language-written-in, teacher, location-point
 */

const BASE      = 'https://api.cms.reearth.io'
const TOKEN     = import.meta.env.VITE_REEARTH_API_TOKEN
const WORKSPACE = import.meta.env.VITE_REEARTH_WORKSPACE_ID
const PROJECT   = import.meta.env.VITE_REEARTH_PROJECT_ID

const MODEL_IDS = {
  spot:    import.meta.env.VITE_REEARTH_SPOTS_MODEL_ID,
  mentor:  import.meta.env.VITE_REEARTH_MENTORS_MODEL_ID,
  log:     import.meta.env.VITE_REEARTH_LOGS_MODEL_ID,
  comment: import.meta.env.VITE_REEARTH_COMMENTS_MODEL_ID,
}

export function isCmsConfigured() {
  return Boolean(TOKEN && WORKSPACE && PROJECT && MODEL_IDS.spot && MODEL_IDS.mentor)
}

function geoPoint(lat, lng) {
  return { type: 'Point', coordinates: [lng, lat] }
}

/**
 * Upload a file as a CMS asset and return its ID.
 * Returns null if upload fails (non-fatal).
 */
async function uploadAsset(file) {
  try {
    const body = new FormData()
    body.append('file', file)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30000)
    const res = await fetch(
      `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/assets`,
      { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` }, body, signal: controller.signal }
    )
    clearTimeout(timer)
    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText)
      throw new Error(`Photo upload failed (${res.status}): ${errText}`)
    }
    const data = await res.json()
    return { id: data.id ?? null, url: data.url ?? null }
  } catch (e) {
    throw new Error(`Photo upload failed: ${e.message}`)
  }
}

function buildFields(type, data) {
  const hasLocation = data.lat != null && data.lng != null

  if (type === 'spot') {
    return [
      { key: 'username',          value: data.username },
      { key: 'area-description',  value: data['area-description'] },
      { key: 'category',          value: data.category },
      { key: 'recommended-for',   value: data['recommended-for'] },
      data.photoAssetId ? { key: 'photo', value: data.photoAssetId } : null,
      hasLocation ? { key: 'location', value: geoPoint(data.lat, data.lng) } : null,
    ]
  }

  if (type === 'mentor') {
    return [
      { key: 'name',             value: data.name },
      { key: 'what-i-can-teach', value: data['what-i-can-teach'] },
      { key: 'languages',        value: data.languages },
      { key: 'available-when',   value: data['available-when'] },
      data.photoAssetId ? { key: 'photo', value: data.photoAssetId } : null,
      hasLocation ? { key: 'location', value: geoPoint(data.lat, data.lng) } : null,
    ]
  }

  if (type === 'log') {
    const dateVal = data.date
      ? new Date(data.date).toISOString()
      : new Date().toISOString()
    return [
      { key: 'name',                value: [data.name] },
      { key: 'role',                value: data.role },
      { key: 'spot-visited',        value: data['spot-visited'] },
      { key: 'date',                value: dateVal },
      { key: 'what-i-learned',      value: data['what-i-learned'] },
      { key: 'category',            value: data.category },
      { key: 'teacher',             value: data.teacher },
      { key: 'language-written-in', value: [data['language-written-in'] || 'Japanese'] },
      data.photoAssetId ? { key: 'photo', value: [data.photoAssetId] } : null,
      hasLocation ? { key: 'location-point', value: geoPoint(data.lat, data.lng) } : null,
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
  console.log('[CMS] createItem type:', type, '| modelId:', modelId)
  if (!modelId) throw new Error(`Unknown item type: ${type}`)

  // Upload photo file if present
  let enrichedData = data
  if (data.photoFile instanceof File) {
    const asset = await uploadAsset(data.photoFile)
    enrichedData = { ...data, photoAssetId: asset?.id ?? null }
  }

  const fields = buildFields(type, enrichedData)
    .filter(Boolean)
    .filter((f) => f.value !== '' && f.value !== undefined && f.value !== null)
    .filter((f) => !(Array.isArray(f.value) && f.value.length === 0))

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
    const msg = `CMS ${res.status}: ${text} | fields: ${JSON.stringify(fields)}`
    console.error('[CMS]', msg)
    throw new Error(msg)
  }

  const created = await res.json()

  // Auto-publish so it appears on the map immediately
  const pubRes = await fetch(
    `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/models/${modelId}/items/${created.id}/publish`,
    { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` } }
  ).catch((e) => { throw new Error(`Publish failed: ${e.message}`) })
  if (!pubRes.ok) {
    const t = await pubRes.text().catch(() => pubRes.statusText)
    throw new Error(`Publish failed (${pubRes.status}): ${t}`)
  }

  return created
}

/**
 * Fetch a single item's photo URL, resolving the asset if needed.
 * Re:Earth CMS Integration API may return asset IDs instead of URLs,
 * so we make a second call to /assets/{id} when necessary.
 *
 * @param {'spot' | 'mentor'} type
 * @param {string} itemId
 * @returns {Promise<string|null>}
 */
export async function fetchItemPhotoUrl(type, itemId) {
  console.log('[photo] fetchItemPhotoUrl called:', type, itemId)
  if (!isCmsConfigured()) { console.log('[photo] CMS not configured'); return null }
  const modelId = MODEL_IDS[type]
  if (!modelId) { console.log('[photo] no modelId for type:', type); return null }

  const res = await fetch(
    `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/models/${modelId}/items/${itemId}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  )
  console.log('[photo] item fetch status:', res.status)
  if (!res.ok) return null
  const data = await res.json()

  const field = data.fields?.find((f) => f.key === 'photo')
  console.log('[photo] item fields:', data.fields?.map((f) => f.key), '| photo field:', field)
  if (!field?.value) return null
  const first = Array.isArray(field.value) ? field.value[0] : field.value
  if (!first) return null

  if (typeof first === 'string' && first.startsWith('http')) return first
  if (first?.url) return first.url

  if (typeof first === 'string') {
    console.log('[photo] fetching asset by ID:', first)
    const assetRes = await fetch(
      `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/assets/${first}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    )
    if (!assetRes.ok) {
      console.log('[photo] asset fetch failed:', assetRes.status)
      return null
    }
    const asset = await assetRes.json()
    console.log('[photo] asset response:', asset)
    return asset.url ?? null
  }
  return null
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

/**
 * Fetch all comments for a given item ID.
 *
 * @param {string} itemId — the spot or mentor item ID
 * @returns {Array} filtered comment items
 */
export async function fetchComments(itemId) {
  if (!isCmsConfigured() || !MODEL_IDS.comment) return []

  const res = await fetch(
    `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/models/${MODEL_IDS.comment}/items?page=1&perPage=100`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  )
  if (!res.ok) return []

  const data = await res.json()
  const items = data.items ?? []

  return items.filter((item) => {
    const field = item.fields?.find((f) => f.key === 'item-id')
    return field?.value === itemId
  })
}

/**
 * Create and auto-publish a comment.
 *
 * @param {string} itemType — 'spot' or 'mentor'
 * @param {string} itemId   — the parent item ID
 * @param {string} author   — commenter's name
 * @param {string} body     — comment text
 */
export async function createComment(itemType, itemId, author, body) {
  if (!isCmsConfigured() || !MODEL_IDS.comment) {
    throw new Error('Comments not configured.')
  }

  const fields = [
    { key: 'author',    value: author },
    { key: 'body',      value: body },
    { key: 'date',      value: new Date().toISOString().split('T')[0] },
    { key: 'item-id',   value: itemId },
    { key: 'item-type', value: itemType },
  ]

  const res = await fetch(
    `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/models/${MODEL_IDS.comment}/items`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ fields }),
    }
  )
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`CMS ${res.status}: ${text}`)
  }
  const created = await res.json()

  // Auto-publish so it's immediately visible
  await fetch(
    `${BASE}/api/${WORKSPACE}/projects/${PROJECT}/models/${MODEL_IDS.comment}/items/${created.id}/publish`,
    { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` } }
  ).catch(() => null)

  return created
}
