import { useEffect, useState } from 'react'
import { SAMPLE_SPOTS, SAMPLE_MENTORS } from '../data/sample'

const SPOTS_URL =
  'https://api.cms.reearth.io/api/p/prototype-workspaces/local-learn/learning-spots.geojson'
const MENTORS_URL =
  'https://api.cms.reearth.io/api/p/prototype-workspaces/local-learn/community-mentors.geojson'

function enrich(features, type) {
  return features.map((f) => ({ ...f, _type: type }))
}

export function useGeoData() {
  const [spots, setSpots] = useState([])
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingDemo, setUsingDemo] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(SPOTS_URL).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(MENTORS_URL).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    ])
      .then(([spotsData, mentorsData]) => {
        const liveSpots = spotsData.features ?? []
        const liveMentors = mentorsData.features ?? []

        if (liveSpots.length === 0 && liveMentors.length === 0) {
          // CMS is published but empty — show demo data so the UI is usable
          setSpots(SAMPLE_SPOTS)
          setMentors(SAMPLE_MENTORS)
          setUsingDemo(true)
        } else {
          setSpots(enrich(liveSpots, 'spot'))
          setMentors(enrich(liveMentors, 'mentor'))
        }
      })
      .catch((err) => {
        setError(String(err))
        setSpots(SAMPLE_SPOTS)
        setMentors(SAMPLE_MENTORS)
        setUsingDemo(true)
      })
      .finally(() => setLoading(false))
  }, [])

  return { spots, mentors, loading, error, usingDemo }
}
