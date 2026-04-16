// Demo data used as fallback while the Re:Earth CMS endpoints are empty.
// Remove or replace once live data is published.

export const SAMPLE_SPOTS = [
  {
    type: 'Feature',
    id: 'demo-spot-1',
    _demo: true,
    _type: 'spot',
    geometry: { type: 'Point', coordinates: [132.334, 34.674] },
    properties: {
      name: 'Kitahiroshima Town Library',
      name_ja: '北広島町立図書館',
      description: 'Public library with local history, agriculture, and traditional craft collections. Open to all ages.',
      category: 'Library',
      languages: ['Japanese'],
    },
  },
  {
    type: 'Feature',
    id: 'demo-spot-2',
    _demo: true,
    _type: 'spot',
    geometry: { type: 'Point', coordinates: [132.320, 34.700] },
    properties: {
      name: 'Sandankyo Nature Trail',
      name_ja: '三段峡 自然トレイル',
      description: 'Scenic gorge trail with guided nature walks through old-growth forest and crystal-clear streams.',
      category: 'Nature',
      languages: ['Japanese', 'English'],
    },
  },
  {
    type: 'Feature',
    id: 'demo-spot-3',
    _demo: true,
    _type: 'spot',
    geometry: { type: 'Point', coordinates: [132.350, 34.665] },
    properties: {
      name: 'Community Workshop Hall',
      name_ja: 'コミュニティ工房',
      description: 'Hands-on workshops in woodworking, natural dyeing, and traditional craft making.',
      category: 'Workshop',
      languages: ['Japanese'],
    },
  },
  {
    type: 'Feature',
    id: 'demo-spot-4',
    _demo: true,
    _type: 'spot',
    geometry: { type: 'Point', coordinates: [132.328, 34.660] },
    properties: {
      name: 'Kagura Cultural Center',
      name_ja: '神楽文化センター',
      description: 'Experience Hiroshima kagura (sacred dance) and local performing arts. Regular performances on weekends.',
      category: 'Culture',
      languages: ['Japanese'],
    },
  },
  {
    type: 'Feature',
    id: 'demo-spot-5',
    _demo: true,
    _type: 'spot',
    geometry: { type: 'Point', coordinates: [132.342, 34.680] },
    properties: {
      name: 'Kitahiroshima Sports Park',
      name_ja: '北広島スポーツ公園',
      description: 'Multi-use sports facility with fields and courts open to community groups and school teams.',
      category: 'Sports',
      languages: ['Japanese'],
    },
  },
]

export const SAMPLE_MENTORS = [
  {
    type: 'Feature',
    id: 'demo-mentor-1',
    _demo: true,
    _type: 'mentor',
    geometry: { type: 'Point', coordinates: [132.336, 34.676] },
    properties: {
      name: 'Tanaka Hiroshi',
      name_ja: '田中 弘',
      description: 'Local forest guide and naturalist with 20+ years exploring the Chugoku mountains. Leads seasonal walks for families.',
      category: 'Nature',
      languages: ['Japanese'],
    },
  },
  {
    type: 'Feature',
    id: 'demo-mentor-2',
    _demo: true,
    _type: 'mentor',
    geometry: { type: 'Point', coordinates: [132.345, 34.671] },
    properties: {
      name: 'Yamamoto Keiko',
      name_ja: '山本 恵子',
      description: 'Traditional indigo dyeing and weaving instructor. Teaches at the community hall on Saturdays.',
      category: 'Workshop',
      languages: ['Japanese', 'English'],
    },
  },
  {
    type: 'Feature',
    id: 'demo-mentor-3',
    _demo: true,
    _type: 'mentor',
    geometry: { type: 'Point', coordinates: [132.329, 34.678] },
    properties: {
      name: 'Suzuki Taro',
      name_ja: '鈴木 太郎',
      description: 'Kagura performer and cultural heritage ambassador. Available for school visits and community events.',
      category: 'Culture',
      languages: ['Japanese'],
    },
  },
]
