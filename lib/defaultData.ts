import { ScheduleItem } from './types';

export const initialData: ScheduleItem[] = [
  // Day 1: 2026-09-08
  { 
    id: '1', date: '2026-09-08', title: 'シンガポール・チャンギ国際空港', startTime: '15:00', endTime: '15:00', locationName: 'Changi Airport', lat: 1.3644, lng: 103.9915, 
    address: 'Airport Blvd., シンガポール', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3644,103.9915', placeId: 'ChIJX9rU2m892jER85F6Y-Fvj7g', openingHours: { open: '00:00', close: '23:59' },
    category: 'Flight', priority: 'High', order: 0, transport: { type: '徒歩', durationMin: 10 }, stayDurationMin: 0, highlights: ['スタート！'], warnings: [] 
  },
  { 
    id: '2', date: '2026-09-08', title: 'ジュエル チャンギ エアポート', startTime: '15:10', endTime: '16:30', locationName: 'Jewel Changi Airport', lat: 1.3602, lng: 103.9897, 
    address: '78 Airport Blvd., シンガポール 819666', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3602,103.9897', openingHours: { open: '10:00', close: '22:00' },
    category: 'Sightseeing', priority: 'High', order: 1, transport: { type: '電車／MRT', durationMin: 50, route: 'チャンギ・エアポート駅(CG2) → エキスポ駅(CG1/DT35)でダウンタウン線乗換 → ベイフロント駅(DT16/CE1)' }, stayDurationMin: 80, highlights: ['ビル7階相当の高さから落ちる世界最大級 of 屋内滝。様々な階層から異なるアングルで表情を楽しめます。'], warnings: ['滝（レイン・ボルテックス）の稼働時間は月〜木11:00〜22:00です。'] 
  },
  { 
    id: '3', date: '2026-09-08', title: 'マリーナベイ・サンズ', startTime: '17:20', endTime: '18:00', locationName: 'Marina Bay Sands', lat: 1.2834, lng: 103.8607, 
    address: '10 Bayfront Ave, シンガポール 018956', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2834,103.8607', openingHours: { open: '00:00', close: '23:59' },
    category: 'Hotel', priority: 'High', order: 2, transport: { type: '徒歩／エレベーター', durationMin: 10 }, stayDurationMin: 40, highlights: ['1泊目ホテルチェックイン・部屋で休憩'], warnings: [] 
  },
  { 
    id: '4', date: '2026-09-08', title: 'Infinity Pool Marina Bay Sands', startTime: '18:10', endTime: '19:10', locationName: 'Infinity Pool Marina Bay Sands', lat: 1.2834, lng: 103.8607, 
    address: '10 Bayfront Ave, シンガポール 018956', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2834,103.8607', openingHours: { open: '06:00', close: '23:59' },
    category: 'Sightseeing', priority: 'High', order: 3, transport: { type: '徒歩／エレベーター', durationMin: 10 }, stayDurationMin: 60, highlights: ['夕暮れから夜景へと変わるマジックアワーの絶景。温水ジャグジーもあります。'], warnings: [] 
  },
  { 
    id: '5', date: '2026-09-08', title: 'SkyPark Observation Deck', startTime: '19:20', endTime: '19:50', locationName: 'SkyPark Observation Deck', lat: 1.2834, lng: 103.8607, 
    address: '10 Bayfront Ave, シンガポール 018956', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2834,103.8607', openingHours: { open: '11:00', close: '21:00' },
    category: 'Sightseeing', priority: 'High', order: 4, transport: { type: '徒歩／エレベーター', durationMin: 10, route: '1階イベントプラザへ' }, stayDurationMin: 30, highlights: ['地上200mからシンガポール海峡やガーデンズ・バイ・ザ・ベイを見下ろす360度のパノラマビュー。'], warnings: [] 
  },
  { 
    id: '6', date: '2026-09-08', title: 'スペクトラ', startTime: '20:00', endTime: '20:15', locationName: 'Spectra - A Light & Water Show', lat: 1.2842, lng: 103.8587, 
    address: '2 Bayfront Ave, シンガポール 018972', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2842,103.8587', openingHours: { open: '20:00', close: '21:00' },
    category: 'Sightseeing', priority: 'High', order: 5, transport: { type: '徒歩', durationMin: 15, route: 'マリーナベイサンズを抜け連絡橋を渡ってスーパーツリーグローブへ' }, stayDurationMin: 15, highlights: ['最前列は水しぶきがかかるほどの臨場感！光と水のダイナミックなショーを楽しみます。'], warnings: [] 
  },
  { 
    id: '7', date: '2026-09-08', title: 'ガーデン・ラプソディ', startTime: '20:45', endTime: '21:00', locationName: 'Supertree Grove', lat: 1.2820, lng: 103.8637, 
    address: '18 Marina Gardens Dr, シンガポール 018953', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2820,103.8637', openingHours: { open: '19:45', close: '20:45' },
    category: 'Sightseeing', priority: 'Low', order: 6, transport: { type: 'タクシー', durationMin: 15 }, stayDurationMin: 15, highlights: ['光と音楽が連動する幻想的なショー。地面に寝転がって巨大なツリーを真上に見上げるのが定番の楽しみ方です。（少し早めに着いて場所を確保します）'], warnings: ['毎日19:45と20:45の2回開催（約15分間）。'] 
  },
  { 
    id: '8', date: '2026-09-08', title: 'ジャンボ シーフード リバーサイドポイント店', startTime: '21:15', endTime: '22:45', locationName: 'Jumbo Seafood Riverside Point', lat: 1.2894, lng: 103.8459, 
    address: '30 Merchant Rd, #01-01/02 Riverside Point, シンガポール 058282', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2894,103.8459', openingHours: { open: '11:30', close: '23:00' },
    category: 'Food', priority: 'High', order: 7, transport: { type: 'タクシー', durationMin: 15 }, stayDurationMin: 90, highlights: ['名物チリクラブ'], warnings: [] 
  },

  // Day 2: 2026-09-09
  { 
    id: '10', date: '2026-09-09', title: 'マリーナベイ・サンズ 出発', startTime: '08:25', endTime: '08:25', locationName: 'Marina Bay Sands', lat: 1.2834, lng: 103.8607, 
    address: '10 Bayfront Ave, シンガポール 018956', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2834,103.8607', openingHours: { open: '00:00', close: '23:59' },
    category: 'Hotel', priority: 'Low', order: 0, transport: { type: '徒歩', durationMin: 15 }, stayDurationMin: 0, highlights: ['2日目スタート！'], warnings: [] 
  },
  {  
    id: '11', date: '2026-09-09', title: 'ガーデンズ・バイ・ザ・ベイ ＆ OCBC Skyway', startTime: '08:40', endTime: '09:40', locationName: 'Gardens by the Bay', lat: 1.2816, lng: 103.8636, 
    address: '18 Marina Gardens Dr, シンガポール 018953', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2816,103.8636', openingHours: { open: '05:00', close: '02:00' },
    category: 'Sightseeing', priority: 'High', order: 1, transport: { type: '徒歩', durationMin: 15 }, stayDurationMin: 60, highlights: ['前日の夜に見上げたスーパーツリーを、今度は地上22mの空中散歩で間近に観察します。'], warnings: ['吊り橋（OCBC Skyway）は9:00オープン。'] 
  },
  { 
    id: '12', date: '2026-09-09', title: 'TWG Tea on the Bay at Marina Bay Sands', startTime: '09:55', endTime: '10:40', locationName: 'TWG Tea at Marina Bay Sands', lat: 1.2840, lng: 103.8587, 
    address: '2 Bayfront Ave, B2-65/68A, シンガポール 018972', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2840,103.8587', openingHours: { open: '10:00', close: '22:00' },
    category: 'Food', priority: 'Medium', order: 2, transport: { type: '徒歩', durationMin: 5 }, stayDurationMin: 45, highlights: ['10:00オープン。紅茶の茶葉を練り込んだマカロンやスイーツで優雅な朝 of ティータイム。'], warnings: [] 
  },
  { 
    id: '13', date: '2026-09-09', title: 'マリーナベイ・サンズ（チェックアウト）', startTime: '10:45', endTime: '11:05', locationName: 'Marina Bay Sands', lat: 1.2834, lng: 103.8607, 
    address: '10 Bayfront Ave, シンガポール 018956', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2834,103.8607', openingHours: { open: '00:00', close: '23:59' },
    category: 'Hotel', priority: 'High', order: 3, transport: { type: 'タクシー', durationMin: 10 }, stayDurationMin: 20, highlights: ['ホテルチェックアウト'], warnings: [] 
  },
  { 
    id: '14', date: '2026-09-09', title: 'Hotel Mi Rochor', startTime: '11:15', endTime: '11:25', locationName: 'Hotel Mi Rochor', lat: 1.3015, lng: 103.8526, 
    address: '225 Bencoolen St, シンガポール 189675', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3015,103.8526', openingHours: { open: '00:00', close: '23:59' },
    category: 'Hotel', priority: 'High', order: 4, transport: { type: 'タクシー', durationMin: 15, route: 'チャイナタウンへ移動' }, stayDurationMin: 10, highlights: ['2泊目ホテルに荷物を預ける'], warnings: [] 
  },
  { 
    id: '15', date: '2026-09-09', title: 'チャイナタウン散策', startTime: '11:40', endTime: '12:40', locationName: 'Chinatown Singapore', lat: 1.2848, lng: 103.8423, 
    address: 'Chinatown, シンガポール', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2848,103.8423', openingHours: { open: '00:00', close: '23:59' },
    category: 'Sightseeing', priority: 'High', order: 5, transport: { type: '徒歩', durationMin: 5 }, stayDurationMin: 60, highlights: ['ヒンドゥー教の極彩色の神々の彫刻と、純金420kgで作られた巨大な仏塔は必見。'], warnings: ['まず「スリ・マリアマン寺院」へ（12:00〜18:00は中休み）。その後「Buddha Tooth Relic Temple」へ。肌の露出NGです。'] 
  },
  { 
    id: '16', date: '2026-09-09', title: '天天海南鶏飯', startTime: '12:45', endTime: '13:45', locationName: 'Tian Tian Hainanese Chicken Rice', lat: 1.2801, lng: 103.8447, 
    address: '1 Kadayanallur St, #01-10/11 Maxwell Food Centre, シンガポール 069184', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2801,103.8447', openingHours: { open: '10:00', close: '19:30' },
    category: 'Food', priority: 'High', order: 6, transport: { type: '徒歩', durationMin: 10 }, stayDurationMin: 60, highlights: ['ふっくらジューシーなチキンと、鶏出汁ライスの相性が抜群。'], warnings: ['マックスウェル・フードセンター内。行列必至。先にポケットティッシュ等で席を確保するのが鉄則。'] 
  },
  { 
    id: '17', date: '2026-09-09', title: 'Ya Kun Kaya Toast Far East Square本店', startTime: '13:55', endTime: '14:40', locationName: 'Ya Kun Kaya Toast Far East Square', lat: 1.2835, lng: 103.8479, 
    address: '18 China St, #01-01, シンガポール 049560', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2835,103.8479', openingHours: { open: '07:30', close: '15:30' },
    category: 'Food', priority: 'Medium', order: 7, transport: { type: '徒歩', durationMin: 5 }, stayDurationMin: 45, highlights: ['半熟卵にダークソイソースをかけ、本店限定の炭火焼きトーストをディップするローカル流おやつ。'], warnings: [] 
  },
  { 
    id: '18', date: '2026-09-09', title: 'カピタスプリング（CapitaSpring）のスカイ・ガーデン', startTime: '14:45', endTime: '15:15', locationName: 'CapitaSpring', lat: 1.2843, lng: 103.8497, 
    address: '88 Market St, シンガポール 048948', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2843,103.8497', openingHours: { open: '08:30', close: '18:00' },
    category: 'Sightseeing', priority: 'Low', order: 8, transport: { type: '徒歩', durationMin: 15 }, stayDurationMin: 30, highlights: ['地上280mからマリーナベイを一望できる最新の超高層絶景スポット。緑豊かな屋内庭園の散策も楽しめます。'], warnings: ['月〜金の平日限定で一般無料開放（午後は14:30〜18:00）。'] 
  },
  { 
    id: '19', date: '2026-09-09', title: 'マーライオン公園', startTime: '15:30', endTime: '16:05', locationName: 'Merlion Park', lat: 1.2868, lng: 103.8545, 
    address: '1 Fullerton Rd, シンガポール 049213', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2868,103.8545', openingHours: { open: '00:00', close: '23:59' },
    category: 'Sightseeing', priority: 'High', order: 9, transport: { type: 'タクシー', durationMin: 15, route: 'ホテル（Hotel Mi Rochor）へ移動' }, stayDurationMin: 35, highlights: ['手乗りの遠近法トリック写真など定番の撮影を。'], warnings: [] 
  },
  { 
    id: '20', date: '2026-09-09', title: 'Hotel Mi Rochor（帰館）', startTime: '16:20', endTime: '18:35', locationName: 'Hotel Mi Rochor', lat: 1.3015, lng: 103.8526, 
    address: '225 Bencoolen St, シンガポール 189675', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3015,103.8526', openingHours: { open: '00:00', close: '23:59' },
    category: 'Hotel', priority: 'High', order: 10, transport: { type: 'タクシー', durationMin: 40, route: 'ナイトサファリへ向けて出発。タクシーで約40分。' }, stayDurationMin: 135, highlights: ['ホテルに戻してチェックイン。お疲れ様でした。少し休んでから、夜のナイトサファリへ備えましょう。'], warnings: [] 
  },
  { 
    id: '21', date: '2026-09-09', title: 'ナイトサファリ', startTime: '19:15', endTime: '22:15', locationName: 'Night Safari', lat: 1.4022, lng: 103.7880, 
    address: '80 Mandai Lake Rd, シンガポール 729826', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.4022,103.7880', openingHours: { open: '19:15', close: '00:00' },
    category: 'Sightseeing', priority: 'High', order: 11, transport: { type: 'タクシー', durationMin: 40, route: 'タクシーでホテル（Hotel Mi Rochor）へ戻ります' }, stayDurationMin: 180, 
    highlights: ['夜の暗闇の中で活動する動物たちをトラムから観察。', '日本語音声トラムの予約（19:45）を忘れずに！', 'クリーチャーズ・オブ・ザ・ナイト・ショー（動物ショー）も見逃せません。'], 
    warnings: ['フラッシュ撮影は禁止です。', '蚊が多いので虫除けスプレー必須。'],
    notes: '★日本語トラム予約済み（19:45発）。eチケット（QRコード）が保存されています。',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-NIGHTSAFARI-2026'
  },

  // Day 3: 2026-09-10
  { 
    id: '41', date: '2026-09-10', title: 'Hotel Mi Rochor 出発', locationName: 'Hotel Mi Rochor', lat: 1.3015, lng: 103.8526, 
    address: '225 Bencoolen St, シンガポール 189675', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3015,103.8526', openingHours: { open: '00:00', close: '23:59' },
    category: 'Hotel', priority: 'Low', order: 0, transport: { type: '徒歩', durationMin: 10 }, stayDurationMin: 0, highlights: ['3日目スタート！'], startTime: '08:30', endTime: '08:30', warnings: [] 
  },
  { 
    id: '23', date: '2026-09-10', title: 'リトルインディア散策', startTime: '08:40', endTime: '09:40', locationName: 'Little India', lat: 1.3068, lng: 103.8496, 
    address: 'Little India, シンガポール', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3068,103.8496', openingHours: { open: '00:00', close: '23:59' },
    category: 'Sightseeing', priority: 'Low', order: 1, transport: { type: '徒歩', durationMin: 10 }, stayDurationMin: 60, highlights: ['スパイスの香りが漂うカラフルな街並みで異国情緒あふれる写真撮影。'], warnings: [] 
  },
  { 
    id: '24', date: '2026-09-10', title: 'ブギス ストリート', startTime: '09:50', endTime: '10:20', locationName: 'Bugis Street', lat: 1.3010, lng: 103.8558, 
    address: '3 New Bugis Street, シンガポール 188867', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3010,103.8558', openingHours: { open: '10:00', close: '22:00' },
    category: 'Sightseeing', priority: 'Medium', order: 2, transport: { type: '徒歩', durationMin: 5 }, stayDurationMin: 30, highlights: ['バラマキ土産が所狭しと並ぶローカルなアーケード街散策。スリに注意。'], warnings: [] 
  },
  { 
    id: '25', date: '2026-09-10', title: 'アラブストリート周辺散策', startTime: '10:25', endTime: '11:25', locationName: 'Arab Street', lat: 1.3023, lng: 103.8588, 
    address: 'Arab St, シンガポール', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3023,103.8588', openingHours: { open: '00:00', close: '23:59' },
    category: 'Sightseeing', priority: 'High', order: 3, transport: { type: 'タクシー', durationMin: 10 }, stayDurationMin: 60, highlights: ['Haji Lnのポップなウォールアート撮影とエキゾチックな雑貨探し。'], warnings: ['サルタン・モスク見学は10:00〜12:00。肌の露出NG。'] 
  },
  { 
    id: '26', date: '2026-09-10', title: 'Orchard Rd', startTime: '11:35', endTime: '12:35', locationName: 'Orchard Road', lat: 1.3048, lng: 103.8318, 
    address: 'Orchard Rd, シンガポール', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3048,103.8318', openingHours: { open: '10:00', close: '22:00' },
    category: 'Sightseeing', priority: 'Medium', order: 4, transport: { type: 'タクシー', durationMin: 10, route: 'クラークキー方面へ' }, stayDurationMin: 60, highlights: ['シンガポール最大のショッピングストリートでウィンドウショッピング。'], warnings: [] 
  },
  { 
    id: '27', date: '2026-09-10', title: '松發肉骨茶 (Song Fa Bak Kut Teh) クラークキー本店', startTime: '12:50', endTime: '13:50', locationName: 'Song Fa Bak Kut Teh', lat: 1.2887, lng: 103.8471, 
    address: '11 New Bridge Rd, #01-01, シンガポール 059383', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2887,103.8471', openingHours: { open: '09:00', close: '21:15' },
    category: 'Food', priority: 'High', order: 5, transport: { type: '徒歩', durationMin: 5 }, stayDurationMin: 60, highlights: ['胡椒とニンニクが効いた絶品スープは何度でもおかわり無料。油条（揚げパン）を浸して食べます。'], warnings: [] 
  },
  { 
    id: '28', date: '2026-09-10', title: 'オールド・ヒル・ストリート警察署', startTime: '13:55', endTime: '14:15', locationName: 'Old Hill Street Police Station', lat: 1.2909, lng: 103.8474, 
    address: '140 Hill St, シンガポール 179369', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2909,103.8474', openingHours: { open: '00:00', close: '23:59' },
    category: 'Sightseeing', priority: 'Low', order: 6, transport: { type: 'タクシー', durationMin: 10 }, stayDurationMin: 20, highlights: ['927枚もの窓枠がレインボーカラーに塗られた歴史的建築。昼間の青空に映えるカラフルな色彩は絶行の写真スポットです。'], warnings: ['現在は官公庁として使用されているため、外観のみの撮影となります。道路の交通量が多いので撮影時は注意。'] 
  },
  { 
    id: '29', date: '2026-09-10', title: '富の泉', startTime: '14:25', endTime: '14:55', locationName: 'Fountain of Wealth', lat: 1.2946, lng: 103.8599, 
    address: '3 Temasek Blvd, シンガポール 038983', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.2946,103.8599', openingHours: { open: '10:00', close: '22:00' },
    category: 'Sightseeing', priority: 'Medium', order: 7, transport: { type: 'タクシー', durationMin: 10 }, stayDurationMin: 30, highlights: ['右手で水に触れながら、願い事を念じて泉の周りを時計回りに3周すると願いが叶うと言われています。'], warnings: [] 
  },
  { 
    id: '30', date: '2026-09-10', title: 'Hotel Mi Rochor', startTime: '15:05', endTime: '15:20', locationName: 'Hotel Mi Rochor', lat: 1.3015, lng: 103.8526, 
    address: '225 Bencoolen St, シンガポール 189675', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3015,103.8526', openingHours: { open: '00:00', close: '23:59' },
    category: 'Hotel', priority: 'High', order: 8, transport: { type: 'タクシー', durationMin: 15 }, stayDurationMin: 15, highlights: ['預けた荷物をピックアップ'], warnings: [] 
  },
  { 
    id: '31', date: '2026-09-10', title: 'プラナカン・ハウス', startTime: '15:35', endTime: '16:15', locationName: 'Koon Seng Road', lat: 1.3054, lng: 103.9022, 
    address: 'Koon Seng Rd, シンガポール', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3054,103.9022', openingHours: { open: '00:00', close: '23:59' },
    category: 'Sightseeing', priority: 'Medium', order: 9, transport: { type: '徒歩', durationMin: 5 }, stayDurationMin: 40, highlights: ['パステルカラーの美しい伝統建築を背景にした写真撮影。'], warnings: ['一般住宅なので敷地内に入ったり大声を出さないようマナー厳守。'] 
  },
  { 
    id: '32', date: '2026-09-10', title: '328 Katong Laksa', startTime: '16:20', endTime: '17:05', locationName: '328 Katong Laksa', lat: 1.3053, lng: 103.9027, 
    address: '51 E Coast Rd, シンガポール 428770', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3053,103.9027', openingHours: { open: '09:30', close: '21:30' },
    category: 'Food', priority: 'High', order: 10, transport: { type: 'タクシー', durationMin: 20 }, stayDurationMin: 45, highlights: ['箸を使わず「レンゲのみ」でスープと一緒に短く切られた麺をすくって食べるのがカトンラクサの伝統スタイル。'], warnings: [] 
  },
  { 
    id: '33', date: '2026-09-10', title: 'シンガポール・チャンギ国際空港', startTime: '17:25', endTime: '18:00', locationName: 'Changi Airport', lat: 1.3644, lng: 103.9915, 
    address: 'Airport Blvd., シンガポール', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=1.3644,103.9915', openingHours: { open: '00:00', close: '23:59' },
    category: 'Flight', priority: 'High', order: 11, transport: { type: '飛行機', durationMin: 420, route: 'チャンギ空港 → 日本の主要空港' }, stayDurationMin: 35, highlights: ['最後のお土産購入など'], warnings: [] 
  },
  { 
    id: '34', date: '2026-09-10', title: '日本（羽田空港／成田空港）に帰国', startTime: '18:10', endTime: '18:10', locationName: 'Haneda / Narita Airport', lat: 35.5494, lng: 139.7798, 
    address: '日本、東京都大田区羽田空港', googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=35.5494,139.7798', openingHours: { open: '00:00', close: '23:59' },
    category: 'Flight', priority: 'High', order: 12, transport: { type: 'なし', durationMin: 0 }, stayDurationMin: 0, highlights: ['無事日本に帰国！3日間のシンガポール旅行、お疲れ様でした。'], warnings: [] 
  },
];
