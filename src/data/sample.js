// Beta data — shown while CMS is being populated. Replace with real entries.

export const SAMPLE_SPOTS = [
  {
    type: 'Feature',
    id: 'demo-spot-1',
    _demo: true,
    _type: 'spot',
    geometry: { type: 'Point', coordinates: [132.334, 34.674] },
    properties: {
      name: '北広島町立図書館（Kitahiroshima Town Library）',
      description: '地元の歴史・農業・伝統工芸の資料が充実した公立図書館。全年齢対応。',
      category: 'Library',
      'recommended-for': ['Children', 'Students', 'Adults'],
    },
  },
  {
    type: 'Feature',
    id: 'demo-spot-2',
    _demo: true,
    _type: 'spot',
    geometry: { type: 'Point', coordinates: [132.320, 34.700] },
    properties: {
      name: '三段峡 自然トレイル（Sandankyo Gorge Trail）',
      description: '原生林と清流が続く渓谷。季節ごとのガイドウォークも開催中。',
      category: 'Nature',
      'recommended-for': ['Families', 'Adults'],
    },
  },
  {
    type: 'Feature',
    id: 'demo-spot-3',
    _demo: true,
    _type: 'spot',
    geometry: { type: 'Point', coordinates: [132.350, 34.665] },
    properties: {
      name: 'コミュニティ工房（Community Workshop Hall）',
      description: '木工・草木染め・伝統工芸の体験ができる町の工房。',
      category: 'Workshop',
      'recommended-for': ['Everyone'],
    },
  },
  {
    type: 'Feature',
    id: 'demo-spot-4',
    _demo: true,
    _type: 'spot',
    geometry: { type: 'Point', coordinates: [132.328, 34.660] },
    properties: {
      name: '神楽文化センター（Kagura Cultural Center）',
      description: '広島神楽の上演と伝統芸能を体験できる施設。週末に定期公演あり。',
      category: 'Culture',
      'recommended-for': ['Everyone'],
    },
  },
  {
    type: 'Feature',
    id: 'demo-spot-5',
    _demo: true,
    _type: 'spot',
    geometry: { type: 'Point', coordinates: [132.342, 34.680] },
    properties: {
      name: '北広島スポーツ公園（Kitahiroshima Sports Park）',
      description: '地域チームや学校にも開放されている多目的スポーツ施設。',
      category: 'Sports',
      'recommended-for': ['Children', 'Students', 'Adults'],
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
      name: '田中ひろし',
      'what-i-can-teach': '中国山地を20年以上歩いてきた地元の森案内人。家族向けの季節の散策を定期開催。',
      category: 'Nature',
      languages: 'Japanese',
      'available-when': '週末・午前中',
    },
  },
  {
    type: 'Feature',
    id: 'demo-mentor-2',
    _demo: true,
    _type: 'mentor',
    geometry: { type: 'Point', coordinates: [132.345, 34.671] },
    properties: {
      name: '山本けいこ',
      'what-i-can-teach': '伝統的な藍染めと機織りの先生。毎週土曜日に町の集会所で教室を開いています。',
      category: 'Workshop',
      languages: 'Japanese',
      'available-when': '毎週土曜日',
    },
  },
  {
    type: 'Feature',
    id: 'demo-mentor-3',
    _demo: true,
    _type: 'mentor',
    geometry: { type: 'Point', coordinates: [132.329, 34.678] },
    properties: {
      name: '鈴木たろう',
      'what-i-can-teach': '神楽の舞い手・文化遺産アンバサダー。学校訪問や地域イベントにも対応可能。',
      category: 'Culture',
      languages: 'Japanese',
      'available-when': '要相談',
    },
  },
  {
    type: 'Feature',
    id: 'demo-mentor-4',
    _demo: true,
    _type: 'mentor',
    geometry: { type: 'Point', coordinates: [132.338, 34.669] },
    properties: {
      name: '吉田おばあちゃん',
      'what-i-can-teach': '北広島の餅つき・梅干し・漬物の作り方を教えてくれます。昔ながらの知恵が聞けます。',
      category: 'Culture',
      languages: 'Japanese',
      'available-when': '午後なら大抵いるよ',
    },
  },
]
