import { useEffect, useState, useCallback } from 'react'
import { SAMPLE_SPOTS, SAMPLE_MENTORS } from '../data/sample'

const SPOTS_URL =
  'https://api.cms.reearth.io/api/p/prototype-workspaces/local-learn/learning-spots.geojson'
const MENTORS_URL =
  'https://api.cms.reearth.io/api/p/prototype-workspaces/local-learn/community-mentors.geojson'
const LOGS_URL =
  'https://api.cms.reearth.io/api/p/prototype-workspaces/local-learn/learning-logs.geojson'

function enrich(features, type) {
  return features.map((f) => ({ ...f, _type: type }))
}

export function useGeoData() {
  const [spots,   setSpots]   = useState([])
  const [mentors, setMentors] = useState([])
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [fetchKey, setFetchKey] = useState(0)

  const refresh = useCallback(() => setFetchKey((k) => k + 1), [])

  useEffect(() => {
    setLoading(true)
    setError(null)

    Promise.all([
      fetch(SPOTS_URL).then((r)   => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(MENTORS_URL).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(LOGS_URL).then((r)    => (r.ok ? r.json() : { features: [] })).catch(() => ({ features: [] })),
    ])
      .then(([spotsData, mentorsData, logsData]) => {
        const liveSpots   = spotsData.features   ?? []
        const liveMentors = mentorsData.features  ?? []
        const liveLogs    = (logsData.features    ?? []).filter(
          (f) => f.geometry?.coordinates?.length === 2
        )

        if (liveSpots.length === 0 && liveMentors.length === 0) {
          setSpots(SAMPLE_SPOTS)
          setMentors(SAMPLE_MENTORS)
        } else {
          setSpots(enrich(liveSpots, 'spot'))
          setMentors(enrich(liveMentors, 'mentor'))
        }
        setLogs(enrich(liveLogs, 'log'))
      })
      .catch((err) => {
        setError(String(err))
        setSpots(SAMPLE_SPOTS)
        setMentors(SAMPLE_MENTORS)
        setLogs([])
      })
      .finally(() => setLoading(false))
  }, [fetchKey])

  return { spots, mentors, logs, loading, error, refresh }
}
