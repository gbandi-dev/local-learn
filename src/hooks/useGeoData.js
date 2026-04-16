import { useEffect, useState, useCallback } from 'react'
import { SAMPLE_SPOTS, SAMPLE_MENTORS } from '../data/sample'

const SPOTS_URL =
  'https://api.cms.reearth.io/api/p/prototype-workspaces/local-learn/learning-spots.geojson'
const MENTORS_URL =
  'https://api.cms.reearth.io/api/p/prototype-workspaces/local-learn/community-mentors.geojson'

function enrich(features, type) {
  return features.map((f) => ({ ...f, _type: type }))
}

export function useGeoData() {
  const [spots, setSpots]       = useState([])
  const [mentors, setMentors]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [usingDemo, setUsingDemo] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)

  // Call refresh() after a successful CMS write to re-fetch live data
  const refresh = useCallback(() => setFetchKey((k) => k + 1), [])

  useEffect(() => {
    setLoading(true)
    setError(null)

    Promise.all([
      fetch(SPOTS_URL).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(MENTORS_URL).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    ])
      .then(([spotsData, mentorsData]) => {
        const liveSpots   = spotsData.features ?? []
        const liveMentors = mentorsData.features ?? []

        if (liveSpots.length === 0 && liveMentors.length === 0) {
          setSpots(SAMPLE_SPOTS)
          setMentors(SAMPLE_MENTORS)
          setUsingDemo(true)
        } else {
          setSpots(enrich(liveSpots, 'spot'))
          setMentors(enrich(liveMentors, 'mentor'))
          setUsingDemo(false)
        }
      })
      .catch((err) => {
        setError(String(err))
        setSpots(SAMPLE_SPOTS)
        setMentors(SAMPLE_MENTORS)
        setUsingDemo(true)
      })
      .finally(() => setLoading(false))
  }, [fetchKey])

  return { spots, mentors, loading, error, usingDemo, refresh }
}
