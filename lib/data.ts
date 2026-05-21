import type { User, Build, Part, Post, Comment, Tag } from '@/types'

// ─── Avatar URLs ────────────────────────────────────────────────────────────────

const AVATARS = {
  cappuccinomoto: '/avatars/cappuccinomoto.jpg',
  seven11moto:    '/avatars/seven11moto.jpg',
  thecrocodile:   '/avatars/thecrocodile.jpg',
  motozuc:        '/avatars/motozuc.jpg',
  investomoto:    '/avatars/investomoto.jpg',
  retroscrambler: '/avatars/retroscrambler_.jpg',
  moto_feelz:     '/avatars/moto_feelz.jpg',
  coldbrewmoto:   '/avatars/coldbrewmoto.jpg',
}

// ─── Raw Mock Data ─────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 'user_cappuccino',
    username: 'cappuccinomoto',
    displayName: 'Cappuccino Moto',
    bio: 'Pictures of my ride days. Videos on YouTube. Details on mods & gear below.',
    location: 'United States',
    instagramHandle: 'cappuccinomoto',
    youtubeHandle: 'cappuccinomoto',
    avatarUrl: AVATARS.cappuccinomoto,
    proTier: '1',
    affiliateDisclosureDismissed: '1',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'user_moto_mx',
    username: 'investomoto',
    displayName: 'Ryan | Motorcyclist',
    bio: 'Invest in the Journey. Currently: Texas. BMW RnineT · Ducati Desert Sled.',
    location: 'Texas',
    instagramHandle: 'investomoto',
    avatarUrl: AVATARS.investomoto,
    proTier: '0',
    affiliateDisclosureDismissed: '0',
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'user_blacktank',
    username: 'moto_feelz',
    displayName: 'Rob Hamilton',
    bio: 'South Australia 🇦🇺. @insta360 & @quadlock Global Ambassador. 120k+ on YouTube.',
    location: 'South Australia, AU',
    instagramHandle: 'moto_feelz',
    youtubeHandle: 'robhamilton',
    avatarUrl: AVATARS.moto_feelz,
    proTier: '0',
    affiliateDisclosureDismissed: '0',
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'user_ninet_builds',
    username: 'retroscrambler_',
    displayName: 'Fred Neves',
    bio: 'Motorcycle Enthusiast and Scrambler rider. Photography & Moto Lifestyle. Triumph Street Scrambler.',
    location: 'United States',
    instagramHandle: 'retroscrambler_',
    avatarUrl: AVATARS.retroscrambler,
    proTier: '0',
    affiliateDisclosureDismissed: '0',
    createdAt: new Date('2024-03-01').toISOString(),
  },
  {
    id: 'user_seven11moto',
    username: 'seven11moto',
    displayName: 'Seven11Moto',
    bio: 'Life on the road with my Yamaha XSR900 60th Anniversary. Camera: Sony A7. Partner: @quadlockcase @the_custom_motorcycle_club',
    location: 'United States',
    instagramHandle: 'seven11moto',
    avatarUrl: AVATARS.seven11moto,
    proTier: '0',
    affiliateDisclosureDismissed: '0',
    createdAt: new Date('2024-03-15').toISOString(),
  },
  {
    id: 'user_thecrocodile',
    username: 'thecrocodile',
    displayName: 'Chuck Schmidt',
    bio: '🐊',
    location: 'United States',
    instagramHandle: 'thecrocodile',
    avatarUrl: AVATARS.thecrocodile,
    proTier: '0',
    affiliateDisclosureDismissed: '0',
    createdAt: new Date('2024-03-20').toISOString(),
  },
  {
    id: 'user_motozuc',
    username: 'motozuc',
    displayName: 'Justin - Moto Zuc',
    bio: 'Fell in love with motorcycles at age 3 on a \'65 Triumph Thunderbird. New prints below.',
    location: 'United States',
    instagramHandle: 'motozuc',
    avatarUrl: AVATARS.motozuc,
    proTier: '0',
    affiliateDisclosureDismissed: '0',
    createdAt: new Date('2024-04-01').toISOString(),
  },
  {
    id: 'user_coldbrewmoto',
    username: 'coldbrewmoto',
    displayName: 'Cold Brew Moto',
    bio: '#coldbrewcrew. \'23 FTR Carbon R · \'04 F4 750 SPR · \'18 XSR700',
    location: 'United States',
    instagramHandle: 'coldbrewmoto',
    avatarUrl: AVATARS.coldbrewmoto,
    proTier: '0',
    affiliateDisclosureDismissed: '0',
    createdAt: new Date('2024-04-10').toISOString(),
  },
]

export const MOCK_TAGS: Tag[] = [
  { name: 'cafe-racer', description: 'Café racer style builds', followerCount: 1240, buildCount: 87 },
  { name: 'scrambler', description: 'Scrambler builds', followerCount: 890, buildCount: 62 },
  { name: 'yamaha', description: 'Yamaha builds', followerCount: 2100, buildCount: 143 },
  { name: 'xsr700', description: 'Yamaha XSR700 builds', followerCount: 340, buildCount: 28 },
  { name: 'xsr900', description: 'Yamaha XSR900 builds', followerCount: 520, buildCount: 44 },
  { name: 'bmw', description: 'BMW builds', followerCount: 1800, buildCount: 119 },
  { name: 'ninet', description: 'BMW R nineT builds', followerCount: 920, buildCount: 74 },
  { name: 'triumph', description: 'Triumph builds', followerCount: 1100, buildCount: 91 },
  { name: 'honda', description: 'Honda builds', followerCount: 1650, buildCount: 134 },
  { name: 'indian', description: 'Indian builds', followerCount: 740, buildCount: 58 },
  { name: 'tracker', description: 'Flat tracker style builds', followerCount: 560, buildCount: 41 },
  { name: 'bobber', description: 'Bobber style builds', followerCount: 730, buildCount: 55 },
  { name: 'moto-content', description: 'Motorcycle content creators', followerCount: 480, buildCount: 22 },
  { name: 'adventure', description: 'Adventure builds', followerCount: 1320, buildCount: 98 },
]

export const MOCK_BUILDS: Build[] = [
  // Cappuccino Moto — 2018 Yamaha XSR700
  {
    id: 'build_cappuccino_xsr',
    userId: 'user_cappuccino',
    year: 2018,
    make: 'Yamaha',
    model: 'XSR700',
    nickname: 'Crema',
    slug: 'crema',
    coverPhotoUrl: '/builds/cappuccino-main.jpg',
    tags: JSON.stringify(['cafe-racer', 'yamaha', 'xsr700', 'moto-content']),
    followerCount: 847,
    tagVisibility: JSON.stringify({}),
    status: 'active',
    archivedPublic: '0',
    buildType: 'moto',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  // Cappuccino Moto — 2015 Ducati Scrambler
  {
    id: 'build_cappuccino_duc',
    userId: 'user_cappuccino',
    year: 2015,
    make: 'Ducati',
    model: 'Scrambler',
    nickname: 'Scarlett',
    slug: 'scarlett',
    coverPhotoUrl: '/builds/scarlett/DSC00995.jpg',
    tags: JSON.stringify(['scrambler', 'ducati', 'cafe-racer', 'moto-content']),
    followerCount: 391,
    tagVisibility: JSON.stringify({}),
    status: 'active',
    archivedPublic: '0',
    buildType: 'moto',
    createdAt: new Date('2024-06-01').toISOString(),
  },
  // investomoto — 2020 BMW R nineT
  {
    id: 'build_moto_mx_ninet',
    userId: 'user_moto_mx',
    year: 2020,
    make: 'BMW',
    model: 'R nineT',
    nickname: 'Desert Rat',
    slug: 'desert-rat',
    coverPhotoUrl: '/builds/investomoto/01.png',
    tags: JSON.stringify(['scrambler', 'bmw', 'ninet', 'adventure']),
    followerCount: 412,
    tagVisibility: JSON.stringify({}),
    status: 'active',
    archivedPublic: '0',
    buildType: 'moto',
    createdAt: new Date('2024-02-01').toISOString(),
  },
  // moto_feelz — 1977 Honda CB750
  {
    id: 'build_blacktank_cb750',
    userId: 'user_blacktank',
    year: 1977,
    make: 'Honda',
    model: 'CB750',
    nickname: 'The Black Tank',
    slug: 'the-black-tank',
    coverPhotoUrl: '/builds/moto_feelz/01.png',
    tags: JSON.stringify(['bobber', 'honda', 'tracker']),
    followerCount: 1893,
    tagVisibility: JSON.stringify({}),
    status: 'active',
    archivedPublic: '0',
    buildType: 'moto',
    createdAt: new Date('2024-02-10').toISOString(),
  },
  // retroscrambler_ — 2019 Triumph Street Scrambler
  {
    id: 'build_ninet_cafe',
    userId: 'user_ninet_builds',
    year: 2019,
    make: 'Triumph',
    model: 'Street Scrambler',
    nickname: 'The Retro',
    slug: 'the-retro',
    coverPhotoUrl: '/builds/retroscrambler_/01.png',
    tags: JSON.stringify(['scrambler', 'triumph']),
    followerCount: 289,
    tagVisibility: JSON.stringify({}),
    status: 'active',
    archivedPublic: '0',
    buildType: 'moto',
    createdAt: new Date('2024-03-01').toISOString(),
  },
  // seven11moto — 2022 Yamaha XSR900 60th Anniversary
  {
    id: 'build_seven11moto_xsr900',
    userId: 'user_seven11moto',
    year: 2022,
    make: 'Yamaha',
    model: 'XSR900',
    nickname: 'The Anniversary',
    slug: 'the-anniversary',
    coverPhotoUrl: '/builds/seven11moto/01.png',
    tags: JSON.stringify(['cafe-racer', 'yamaha', 'xsr900']),
    followerCount: 634,
    tagVisibility: JSON.stringify({}),
    status: 'active',
    archivedPublic: '0',
    buildType: 'moto',
    createdAt: new Date('2024-03-15').toISOString(),
  },
  // coldbrewmoto — 2023 Indian FTR Carbon R
  {
    id: 'build_coldbrewmoto_ftr',
    userId: 'user_coldbrewmoto',
    year: 2023,
    make: 'Indian',
    model: 'FTR Carbon R',
    nickname: 'Cold Brew',
    slug: 'cold-brew',
    coverPhotoUrl: '/builds/coldbrewmoto/01.png',
    tags: JSON.stringify(['tracker', 'indian']),
    followerCount: 217,
    tagVisibility: JSON.stringify({}),
    status: 'active',
    archivedPublic: '0',
    buildType: 'moto',
    createdAt: new Date('2024-04-10').toISOString(),
  },
  // thecrocodile — 2021 Ducati Scrambler 1100
  {
    id: 'build_thecrocodile_ducati',
    userId: 'user_thecrocodile',
    year: 2021,
    make: 'Ducati',
    model: 'Scrambler 1100',
    nickname: 'The Croc',
    slug: 'the-croc',
    coverPhotoUrl: '/builds/thecrocodile/01.png',
    tags: JSON.stringify(['scrambler', 'cafe-racer']),
    followerCount: 4210,
    tagVisibility: JSON.stringify({}),
    status: 'active',
    archivedPublic: '0',
    buildType: 'moto',
    createdAt: new Date('2024-03-20').toISOString(),
  },
  // motozuc — 2020 Triumph Bonneville T120
  {
    id: 'build_motozuc_bonneville',
    userId: 'user_motozuc',
    year: 2020,
    make: 'Triumph',
    model: 'Bonneville T120',
    nickname: 'The Thunderbird Jr.',
    slug: 'the-thunderbird-jr',
    coverPhotoUrl: '/builds/motozuc/01.png',
    tags: JSON.stringify(['cafe-racer', 'triumph']),
    followerCount: 388,
    tagVisibility: JSON.stringify({}),
    status: 'active',
    archivedPublic: '0',
    buildType: 'moto',
    createdAt: new Date('2024-04-01').toISOString(),
  },
]

export const MOCK_PARTS: Part[] = [
  // ── Cappuccino Moto — XSR700 ──────────────────────────────────────────────────
  { id: 'part_cap_01', buildId: 'build_cappuccino_xsr', name: 'J.W. Speaker 8790 LED Headlight', category: 'Front End', type: 'linkable', sourceUrl: 'https://www.jwspeaker.com/', notes: 'Massive visibility upgrade with DRL.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_02', buildId: 'build_cappuccino_xsr', name: 'Motogadget m-Blaze Pin Turn Signals', category: 'Front End', type: 'linkable', sourceUrl: 'https://www.motogadget.com/', notes: 'Bar-end mounted. Incredibly minimal.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_03', buildId: 'build_cappuccino_xsr', name: 'Gilles GTO Aluminum Handlebars', category: 'Front End', type: 'linkable', sourceUrl: 'https://www.gilles-tooling.com/', notes: 'Clip-on style. Aggressive but comfortable.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_04', buildId: 'build_cappuccino_xsr', name: 'Lowbrow Customs 7/8" GT Grips', category: 'Front End', type: 'linkable', sourceUrl: 'https://www.lowbrowcustoms.com/', notes: 'Classic pull-on style. Great feel.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_05', buildId: 'build_cappuccino_xsr', name: 'KiWAV Eclipse 10mm Round Mirrors', category: 'Front End', type: 'linkable', sourceUrl: 'https://www.amazon.com/', notes: 'Round bar-end mirrors. Clean look.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_06', buildId: 'build_cappuccino_xsr', name: 'JvB Moto Fork Gaiters', category: 'Front End', type: 'linkable', sourceUrl: 'https://jvbmoto.com/', notes: 'Rubber fork boots. Transforms the front end completely.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_07', buildId: 'build_cappuccino_xsr', name: 'SW-MOTECH Aluminum Front Fender', category: 'Front End', type: 'linkable', sourceUrl: 'https://sw-motech.com/', notes: 'Alloy unit. Cleaner than stock plastic.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_08', buildId: 'build_cappuccino_xsr', name: "SC Project 2-1 Conic '70s Exhaust", category: 'Exhaust', type: 'linkable', sourceUrl: 'https://www.sc-project.com/', notes: 'Required the ECU flash. Sound is incredible.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_09', buildId: 'build_cappuccino_xsr', name: 'Urbano Bruni Side Panels & Chain Guard', category: 'Frame', type: 'reference', notes: 'Custom Italian bodywork. Replaced stock plastic panels.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_10', buildId: 'build_cappuccino_xsr', name: 'Evotech Tail Tidy Fender Eliminator', category: 'Frame', type: 'linkable', sourceUrl: 'https://www.evotech-rc.com/', notes: 'Clean tail section. Relocates the license plate.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_11', buildId: 'build_cappuccino_xsr', name: 'Evotech Rear Axle Spool Sliders', category: 'Frame', type: 'linkable', sourceUrl: 'https://www.evotech-rc.com/', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_12', buildId: 'build_cappuccino_xsr', name: 'Rizoma Rear Brake Reservoir', category: 'Controls', type: 'linkable', sourceUrl: 'https://www.rizoma.com/', notes: 'Billet aluminum. Replaces the ugly stock reservoir.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_13', buildId: 'build_cappuccino_xsr', name: 'Gilles Tooling Billet Levers', category: 'Controls', type: 'linkable', sourceUrl: 'https://www.gilles-tooling.com/', notes: 'Adjustable reach. Much better feel than stock.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_14', buildId: 'build_cappuccino_xsr', name: 'Pirelli Scorpion Rally STR', category: 'Wheels & Tires', type: 'reference', notes: '180/55x17 rear / 120/70x17 front.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_15', buildId: 'build_cappuccino_xsr', name: '2WDW ECU Flash', category: 'Electrical', type: 'service', notes: 'Mandatory with the SC Project exhaust.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_16', buildId: 'build_cappuccino_xsr', name: 'Off-White Aluminum Tank Sides', category: 'Paint', type: 'reference', notes: 'Factory XSR700 colorway. Warm cream on black frame.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  { id: 'part_cap_17', buildId: 'build_cappuccino_xsr', name: 'Brogue Motorcycles Slim Seat', category: 'Paint', type: 'linkable', sourceUrl: 'https://www.broguemotorcycles.com/', notes: 'Custom leather. Lowers seat height ~0.5". Brown leather is perfect.', isCurrent: '1', createdAt: new Date('2024-01-15').toISOString() },
  // Cappuccino Moto — 2015 Ducati Scrambler (Crimson)
  { id: 'part_duc_01', buildId: 'build_cappuccino_duc', name: 'Arrow 2-1 Full System Exhaust', category: 'Exhaust', type: 'linkable', sourceUrl: 'https://www.arrowexhausts.com/', notes: 'Massive weight savings. The sound character completely transforms the bike.', isCurrent: '1', createdAt: new Date('2024-06-01').toISOString() },
  { id: 'part_duc_02', buildId: 'build_cappuccino_duc', name: 'Rizoma Retrogrdo Bar-End Mirrors', category: 'Front End', type: 'linkable', sourceUrl: 'https://www.rizoma.com/', notes: 'Clean, minimal look. Wide enough field of view for highway riding.', isCurrent: '1', createdAt: new Date('2024-06-01').toISOString() },
  { id: 'part_duc_03', buildId: 'build_cappuccino_duc', name: 'Touratech Crash Bar Set', category: 'Frame', type: 'linkable', sourceUrl: 'https://www.touratech.com/', notes: 'Stainless steel. Protected the engine on a gravel tip-over already.', isCurrent: '1', createdAt: new Date('2024-06-15').toISOString() },
  { id: 'part_duc_04', buildId: 'build_cappuccino_duc', name: 'Unit Garage Aluminum Front Fender', category: 'Front End', type: 'linkable', sourceUrl: 'https://www.unitgarage.com/', notes: 'Replaces the stock plastic unit. Much cleaner scrambler silhouette.', isCurrent: '1', createdAt: new Date('2024-06-15').toISOString() },
  { id: 'part_duc_05', buildId: 'build_cappuccino_duc', name: 'Heidenau K60 Scout Tires', category: 'Wheels & Tires', type: 'reference', notes: '180/55x17 rear / 110/80x18 front. Great on dirt and confident on tarmac.', isCurrent: '1', createdAt: new Date('2024-06-01').toISOString() },
  { id: 'part_duc_06', buildId: 'build_cappuccino_duc', name: 'Öhlins STX 36 Twin Rear Shock', category: 'Suspension', type: 'linkable', sourceUrl: 'https://www.ohlins.com/', notes: 'Night and day over stock. Fully adjustable preload and rebound.', isCurrent: '1', createdAt: new Date('2024-07-01').toISOString() },
  { id: 'part_duc_07', buildId: 'build_cappuccino_duc', name: 'Rizoma Footpeg System', category: 'Controls', type: 'linkable', sourceUrl: 'https://www.rizoma.com/', notes: 'Billet aluminum. Wider platform and better grip than stock rubber pegs.', isCurrent: '1', createdAt: new Date('2024-06-01').toISOString() },
  { id: 'part_duc_08', buildId: 'build_cappuccino_duc', name: 'Barkbusters VPS Hand Guards', category: 'Front End', type: 'linkable', sourceUrl: 'https://www.barkbusters.net/', notes: 'Aluminum backbone. Saved the levers twice on gravel already.', isCurrent: '1', createdAt: new Date('2024-06-15').toISOString() },
  { id: 'part_duc_09', buildId: 'build_cappuccino_duc', name: 'Corbin Smuggler Custom Seat', category: 'Frame', type: 'reference', notes: 'Solo seat configuration. Lower and firmer than stock — better all-day support.', isCurrent: '1', createdAt: new Date('2024-08-01').toISOString() },
  { id: 'part_duc_10', buildId: 'build_cappuccino_duc', name: 'Ducati Red / Crimson Vermillion', category: 'Paint', type: 'reference', notes: 'Factory Icon colorway. Kept stock — the red is too good to change.', isCurrent: '1', createdAt: new Date('2024-06-01').toISOString() },
  // ── investomoto — BMW R nineT ─────────────────────────────────────────────────
  { id: 'part_mx_01', buildId: 'build_moto_mx_ninet', name: 'Touratech Rallye Evo Suspension', category: 'Suspension', type: 'linkable', sourceUrl: 'https://www.touratech.com/', notes: 'Long travel for light off-road use.', isCurrent: '1', createdAt: new Date('2024-02-01').toISOString() },
  { id: 'part_mx_02', buildId: 'build_moto_mx_ninet', name: 'Heidenau K60 Scout Tires', category: 'Wheels & Tires', type: 'linkable', sourceUrl: 'https://www.heidenau.com/', notes: '70/30 street/dirt. Perfect scrambler balance.', isCurrent: '1', createdAt: new Date('2024-02-01').toISOString() },
  { id: 'part_mx_03', buildId: 'build_moto_mx_ninet', name: 'Wunderlich Enduro Handlebar Kit', category: 'Controls', type: 'linkable', sourceUrl: 'https://www.wunderlich.de/', isCurrent: '1', createdAt: new Date('2024-02-01').toISOString() },
  { id: 'part_mx_04', buildId: 'build_moto_mx_ninet', name: 'Titanium Grey Paint (custom)', category: 'Paint', type: 'reference', notes: 'Three coats, clear coat. Surprisingly durable.', isCurrent: '1', createdAt: new Date('2024-02-01').toISOString() },
  { id: 'part_mx_05', buildId: 'build_moto_mx_ninet', name: 'Quad Lock RAM Mount', category: 'Controls', type: 'linkable', sourceUrl: 'https://www.quadlockcase.com/', notes: 'For the Sony A7 and phone mount. Solid vibration damping.', isCurrent: '1', createdAt: new Date('2024-02-10').toISOString() },
  // ── moto_feelz — 1977 Honda CB750 ────────────────────────────────────────────
  { id: 'part_bt_01', buildId: 'build_blacktank_cb750', name: 'Paughco Bobber Fender', category: 'Frame', type: 'linkable', sourceUrl: 'https://www.paughco.com/', notes: 'Short rear bobber fender. Classic look.', isCurrent: '1', createdAt: new Date('2024-02-10').toISOString() },
  { id: 'part_bt_02', buildId: 'build_blacktank_cb750', name: 'Drag Specialties 2" Lowering Kit', category: 'Suspension', type: 'linkable', sourceUrl: 'https://www.dragspecialties.com/', isCurrent: '1', createdAt: new Date('2024-02-10').toISOString() },
  { id: 'part_bt_03', buildId: 'build_blacktank_cb750', name: 'Flat Black Paint & Clear Coat', category: 'Paint', type: 'reference', notes: 'Shot by a local shop. Matte finish — every fingerprint shows but it looks mean.', isCurrent: '1', createdAt: new Date('2024-02-10').toISOString() },
  { id: 'part_bt_04', buildId: 'build_blacktank_cb750', name: 'Accel Super Coil Kit', category: 'Electrical', type: 'linkable', sourceUrl: 'https://www.accel-ignition.com/', notes: 'Significant idle improvement on the old CB motor.', isCurrent: '1', createdAt: new Date('2024-02-10').toISOString() },
  { id: 'part_bt_05', buildId: 'build_blacktank_cb750', name: 'Insta360 X3 Mount Kit', category: 'Controls', type: 'linkable', sourceUrl: 'https://www.insta360.com/', notes: 'Handlebar mount + magnetic quick release for content creation.', isCurrent: '1', createdAt: new Date('2024-02-15').toISOString() },
  // ── retroscrambler_ — 2019 Triumph Street Scrambler ──────────────────────────
  { id: 'part_nt_01', buildId: 'build_ninet_cafe', name: 'Arrow Exhaust Slip-On', category: 'Exhaust', type: 'linkable', sourceUrl: 'https://www.arrowexhausts.com/', notes: 'Titanium canister. The sound is exactly what a Triumph should sound like.', isCurrent: '1', createdAt: new Date('2024-03-01').toISOString() },
  { id: 'part_nt_02', buildId: 'build_ninet_cafe', name: 'Barkbusters Storm Hand Guards', category: 'Controls', type: 'linkable', sourceUrl: 'https://www.barkbusters.net/', notes: 'Full wrap aluminum guards. Essential for any scrambler.', isCurrent: '1', createdAt: new Date('2024-03-01').toISOString() },
  { id: 'part_nt_03', buildId: 'build_ninet_cafe', name: 'Continental TKC70 Tires', category: 'Wheels & Tires', type: 'linkable', sourceUrl: 'https://www.continental-tires.com/', notes: '50/50 road/off-road. Better traction than the stock Metzeler.', isCurrent: '1', createdAt: new Date('2024-03-01').toISOString() },
  { id: 'part_nt_04', buildId: 'build_ninet_cafe', name: 'Öhlins S36 Rear Shock', category: 'Suspension', type: 'linkable', sourceUrl: 'https://www.ohlins.com/', notes: 'Immediate improvement in cornering confidence.', isCurrent: '1', createdAt: new Date('2024-03-01').toISOString() },
  { id: 'part_nt_05', buildId: 'build_ninet_cafe', name: 'Triumph Scrambler Seat (genuine accessory)', category: 'Frame', type: 'linkable', sourceUrl: 'https://www.triumphmotorcycles.com/', notes: 'Tuck-and-roll stitching. Proper retro touch.', isCurrent: '1', createdAt: new Date('2024-03-10').toISOString() },
  // ── seven11moto — 2022 Yamaha XSR900 ─────────────────────────────────────────
  { id: 'part_s11_01', buildId: 'build_seven11moto_xsr900', name: 'Quad Lock Pro Handlebar Mount', category: 'Controls', type: 'linkable', sourceUrl: 'https://www.quadlockcase.com/', notes: 'For the Sony A7. Rock solid at highway speeds.', isCurrent: '1', createdAt: new Date('2024-03-15').toISOString() },
  { id: 'part_s11_02', buildId: 'build_seven11moto_xsr900', name: 'SW-MOTECH Crash Bars', category: 'Frame', type: 'linkable', sourceUrl: 'https://sw-motech.com/', notes: 'Saved the bike once already. Worth every cent.', isCurrent: '1', createdAt: new Date('2024-03-15').toISOString() },
  { id: 'part_s11_03', buildId: 'build_seven11moto_xsr900', name: 'Rizoma bar-end mirrors', category: 'Front End', type: 'linkable', sourceUrl: 'https://www.rizoma.com/', notes: 'Clean look, surprisingly good visibility.', isCurrent: '1', createdAt: new Date('2024-03-20').toISOString() },
  { id: 'part_s11_04', buildId: 'build_seven11moto_xsr900', name: 'SC Project Oval Slip-On', category: 'Exhaust', type: 'linkable', sourceUrl: 'https://www.sc-project.com/', notes: 'The CP2 engine with this exhaust is a completely different beast.', isCurrent: '1', createdAt: new Date('2024-03-20').toISOString() },
  { id: 'part_s11_05', buildId: 'build_seven11moto_xsr900', name: '60th Anniversary Cowl Kit', category: 'Frame', type: 'reference', notes: 'Factory accessory from Yamaha. The heritage colorway is everything.', isCurrent: '1', createdAt: new Date('2024-04-01').toISOString() },
  // ── coldbrewmoto — 2023 Indian FTR Carbon R ───────────────────────────────────
  { id: 'part_cb_01', buildId: 'build_coldbrewmoto_ftr', name: 'S&S Powerplus Slip-On Exhaust', category: 'Exhaust', type: 'linkable', sourceUrl: 'https://www.sscycle.com/', notes: 'Deeper note without the rasp. No remapping needed.', isCurrent: '1', createdAt: new Date('2024-04-10').toISOString() },
  { id: 'part_cb_02', buildId: 'build_coldbrewmoto_ftr', name: 'Öhlins Front Fork Cartridge Kit', category: 'Suspension', type: 'linkable', sourceUrl: 'https://www.ohlins.com/', notes: 'Significant improvement over stock. Night and day on twisties.', isCurrent: '1', createdAt: new Date('2024-04-10').toISOString() },
  { id: 'part_cb_03', buildId: 'build_coldbrewmoto_ftr', name: 'Arlen Ness Beveled Mirrors', category: 'Front End', type: 'linkable', sourceUrl: 'https://www.arlenness.com/', notes: 'Fits the tracker aesthetic perfectly.', isCurrent: '1', createdAt: new Date('2024-04-15').toISOString() },
  { id: 'part_cb_04', buildId: 'build_coldbrewmoto_ftr', name: 'Sprint Filter P08 Air Filter', category: 'Electrical', type: 'linkable', sourceUrl: 'https://www.sprintfilter.com/', notes: 'Washable and reusable. Noticeable improvement in throttle response.', isCurrent: '1', createdAt: new Date('2024-04-15').toISOString() },
  { id: 'part_cb_05', buildId: 'build_coldbrewmoto_ftr', name: 'FTR Carbon Fiber Tank Shrouds', category: 'Frame', type: 'reference', notes: 'Factory Carbon R spec. The real carbon weave under the sun is insane.', isCurrent: '1', createdAt: new Date('2024-04-10').toISOString() },
]

const _RAW_POSTS = [
  // ── cappuccinomoto — Crema (XSR700) ──────────────────────────────────────────
  { id: 'post_cap_01', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC00193.jpg']), caption: 'Saturday is for the motos\n\n#quadlock #custommirror #fastersons #phonemount #motorcycle #caferacer #motorbike #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_01', 'part_cap_05']), likeCount: 2974, commentCount: 12, createdAt: new Date('2020-08-08T23:04:50.000Z').toISOString() },
  { id: 'post_cap_02', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC02128.jpg']), caption: 'Too much black a thing?\n\n#redwing #uglybros #ridinggear #motorcyclejeans #motorcycle #caferacer #bikelife #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_08', 'part_cap_15']), likeCount: 2677, commentCount: 31, createdAt: new Date('2020-08-13T01:39:34.000Z').toISOString() },
  { id: 'post_cap_03', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC02406.jpg']), caption: 'You know me\n\n#mountup #agvx3000 #fastersons #retrohelmet #motorcycle #caferacer #bikelife #modernclassic #flattracker #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_17']), likeCount: 4314, commentCount: 15, createdAt: new Date('2020-07-30T17:44:45.000Z').toISOString() },
  { id: 'post_cap_04', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC04027.jpg']), caption: 'JvB fork gaiters changed everything about the front end.\n\n#jvbmoto #forkgaiters #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_06']), likeCount: 3102, commentCount: 8, createdAt: new Date('2020-09-01T11:20:00.000Z').toISOString() },
  { id: 'post_cap_05', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC04077.jpg']), caption: 'Pirelli Scorpion Rally STRs front and rear. Keeps it honest.\n\n#pirelli #scorpion #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_14']), likeCount: 1893, commentCount: 6, createdAt: new Date('2020-09-14T09:45:00.000Z').toISOString() },
  { id: 'post_cap_06', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC04085.jpg']), caption: 'Urbano Bruni side panels — the Italian touch this build needed.\n\n#urbanbruni #custompanels #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_09']), likeCount: 2451, commentCount: 19, createdAt: new Date('2020-10-05T16:30:00.000Z').toISOString() },
  { id: 'post_cap_07', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC04677.jpg']), caption: 'Sunday morning light.\n\n#xsr700 #caferacer #moto #yamaha #cappuccinomoto', taggedPartIds: JSON.stringify([]), likeCount: 3788, commentCount: 22, createdAt: new Date('2020-11-22T08:10:00.000Z').toISOString() },
  { id: 'post_cap_08', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC08200.jpg']), caption: 'Gilles GTO clip-ons. Everything starts here.\n\n#gilles #clipons #bars #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_03']), likeCount: 2109, commentCount: 11, createdAt: new Date('2021-02-14T14:00:00.000Z').toISOString() },
  { id: 'post_cap_09', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC08303.jpg']), caption: 'After the ECU flash the SC Project really opened up.\n\n#ecuflash #scproject #exhaust #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_08', 'part_cap_15']), likeCount: 3341, commentCount: 27, createdAt: new Date('2021-04-03T18:55:00.000Z').toISOString() },
  { id: 'post_cap_10', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC08318.jpg']), caption: 'Brogue slim seat — the last piece.\n\n#broguemotorcycles #seat #leather #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_17']), likeCount: 2862, commentCount: 14, createdAt: new Date('2021-06-19T10:22:00.000Z').toISOString() },
  { id: 'post_cap_11', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC08327.jpg']), caption: 'KiWAV Eclipse bar-end mirrors. Round is right.\n\n#kiwav #mirrors #barend #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_05']), likeCount: 1744, commentCount: 9, createdAt: new Date('2021-08-07T15:40:00.000Z').toISOString() },
  { id: 'post_cap_12', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC08542.jpg']), caption: 'Evotech tail tidy — clean tail section is non-negotiable.\n\n#evotech #tailtidy #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_10']), likeCount: 2198, commentCount: 7, createdAt: new Date('2021-10-31T12:00:00.000Z').toISOString() },
  { id: 'post_cap_13', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC08591.jpg']), caption: 'Motogadget m-Blaze pins — the most minimal turn signals money can buy.\n\n#motogadget #mblaze #turnsignals #xsr700 #cappuccinomoto', taggedPartIds: JSON.stringify(['part_cap_02']), likeCount: 2533, commentCount: 18, createdAt: new Date('2022-03-15T09:30:00.000Z').toISOString() },
  { id: 'post_cap_14', buildId: 'build_cappuccino_xsr', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/crema/DSC08677.jpg']), caption: 'Crema. Done.\n\n#xsr700 #caferacer #yamaha #custommoto #cappuccinomoto', taggedPartIds: JSON.stringify([]), likeCount: 5127, commentCount: 43, createdAt: new Date('2022-08-20T20:00:00.000Z').toISOString() },
  // ── cappuccinomoto — Scarlett (Ducati Scrambler) ──────────────────────────────
  { id: 'post_duc_01', buildId: 'build_cappuccino_duc', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/scarlett/DSC00995.jpg']), caption: 'First ride on Scarlett. Different in every way from the XSR — but it already feels like home.\n\n#ducati #scrambler #ducatiscrambler #icon #moto #caferacer #cappuccinomoto', taggedPartIds: JSON.stringify(['part_duc_01', 'part_duc_05']), likeCount: 1847, commentCount: 24, createdAt: new Date('2024-06-10T14:22:00.000Z').toISOString() },
  { id: 'post_duc_02', buildId: 'build_cappuccino_duc', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/scarlett/DSC01097.jpg']), caption: 'Arrow exhaust is in. The character change is unreal — Italian bikes do sound different.\n\n#ducati #scrambler #arrowexhaust #exhaust #moto #cappuccinomoto', taggedPartIds: JSON.stringify(['part_duc_01', 'part_duc_02']), likeCount: 2103, commentCount: 18, createdAt: new Date('2024-07-05T10:14:00.000Z').toISOString() },
  { id: 'post_duc_03', buildId: 'build_cappuccino_duc', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/scarlett/DSC01528.jpg']), caption: 'Rizoma mirrors and clean tail. The details are everything.\n\n#rizoma #ducatiscrambler #custommoto #cappuccinomoto', taggedPartIds: JSON.stringify(['part_duc_02', 'part_duc_04']), likeCount: 1562, commentCount: 11, createdAt: new Date('2024-07-18T16:40:00.000Z').toISOString() },
  { id: 'post_duc_04', buildId: 'build_cappuccino_duc', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/scarlett/DSC01731.jpg']), caption: 'Heidenau K60s front and rear. Perfect for what this bike is.\n\n#heidenau #k60 #ducatiscrambler #cappuccinomoto', taggedPartIds: JSON.stringify(['part_duc_05']), likeCount: 1294, commentCount: 8, createdAt: new Date('2024-08-02T11:00:00.000Z').toISOString() },
  { id: 'post_duc_05', buildId: 'build_cappuccino_duc', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/scarlett/DSC02384.jpg']), caption: "That Ducati red doesn't get old.\n\n#ducatirosso #icon #scarlett #ducatiscrambler #cappuccinomoto", taggedPartIds: JSON.stringify(['part_duc_10']), likeCount: 3214, commentCount: 31, createdAt: new Date('2024-08-20T08:30:00.000Z').toISOString() },
  { id: 'post_duc_06', buildId: 'build_cappuccino_duc', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/scarlett/DSC04274.jpg']), caption: "Touratech crash bars — because this one's going off-road eventually.\n\n#touratech #crashbars #ducatiscrambler #cappuccinomoto", taggedPartIds: JSON.stringify(['part_duc_03']), likeCount: 1788, commentCount: 14, createdAt: new Date('2024-09-08T13:15:00.000Z').toISOString() },
  { id: 'post_duc_07', buildId: 'build_cappuccino_duc', userId: 'user_cappuccino', photos: JSON.stringify(['/builds/scarlett/DSC07521.jpg']), caption: 'Scarlett and Crema. Both cappuccinos.\n\n#ducati #yamaha #xsr700 #scrambler #garage #twobikes #cappuccinomoto', taggedPartIds: JSON.stringify([]), likeCount: 4891, commentCount: 52, createdAt: new Date('2024-10-01T19:45:00.000Z').toISOString() },
  // ── investomoto ───────────────────────────────────────────────────────────────
  {
    id: 'post_mx_01',
    buildId: 'build_moto_mx_ninet',
    userId: 'user_moto_mx',
    photos: JSON.stringify(['/builds/investomoto/01.png']),
    caption: 'A work in progress... 🏍️💨\n\nHandguards: @barkbustershandguards\nMirrors: Rottweiler Performance\nPhone mount: @quadlockmoto\nFull exhaust: @unitgarage\nCrash bars: SW Motech\nTail tidy: Daedalus Design\nFoot pegs: Pivot Pegz\nForks: BMW F800GS\nFront wheel: BMW F850GS\nRear wheel: BMW R1200GSA\nFork springs: Touratech\nRear suspension: Wilbers\nTires: Motoz\n\n#rninetscrambler #bmwmotorrad #scrambler #getlost #adventurebike #rninet #urbangs #offthebeatenpath #makelifearide',
    taggedPartIds: JSON.stringify(['part_mx_01', 'part_mx_03', 'part_mx_05']),
    likeCount: 1796,
    commentCount: 21,
    createdAt: new Date('2023-04-27T12:37:28.000Z').toISOString(),
  },
  {
    id: 'post_mx_02',
    buildId: 'build_moto_mx_ninet',
    userId: 'user_moto_mx',
    photos: JSON.stringify(['/builds/investomoto/02.png']),
    caption: "The Project Bike Returns - R9T Rural G/S\nThere's still plenty of work needed but it's time to ride.\n\nGloves: @fogy_garage\nJacket: @fuelmotorcycles\n\nHandguards: Barkbusters\nMirrors: Rottweiler Performance\nPhone mount: Quad Lock\nFull exhaust: Unit Garage\nCrash bars: SW Motech\nTires: Motoz\n\n#rninet #urbangs #offthebeatenpath #makelifearide #getoutandexplore #rninetscrambler #bmwmotorrad #scrambler",
    taggedPartIds: JSON.stringify(['part_mx_02', 'part_mx_04']),
    likeCount: 1819,
    commentCount: 13,
    createdAt: new Date('2023-04-10T12:28:02.000Z').toISOString(),
  },
  // ── moto_feelz ────────────────────────────────────────────────────────────────
  {
    id: 'post_bt_01',
    buildId: 'build_blacktank_cb750',
    userId: 'user_blacktank',
    photos: JSON.stringify(['/builds/moto_feelz/01.png']),
    caption: '💥The @insta360 GPS Preview Remote with Microphone has to be one of THE most underrated Insta360 accessories.\n\nIt acts as a remote control so you can start/stop recording without reaching for the camera, shows a preview of what you\'re capturing (even in 360), logs GPS data for GPS overlay AND records stunning audio of your exhaust 🎙️🏍️👌\n\n#insta360motorcycle #insta360',
    taggedPartIds: JSON.stringify(['part_bt_05']),
    likeCount: 2693,
    commentCount: 74,
    createdAt: new Date('2026-03-04T09:51:27.000Z').toISOString(),
  },
  {
    id: 'post_bt_02',
    buildId: 'build_blacktank_cb750',
    userId: 'user_blacktank',
    photos: JSON.stringify(['/builds/moto_feelz/02.png']),
    caption: 'My favorite kind of therapy 🌅',
    taggedPartIds: JSON.stringify(['part_bt_03']),
    likeCount: 1814,
    commentCount: 27,
    createdAt: new Date('2026-05-10T10:30:00.000Z').toISOString(),
  },
  // ── retroscrambler_ ───────────────────────────────────────────────────────────
  {
    id: 'post_nt_01',
    buildId: 'build_ninet_cafe',
    userId: 'user_ninet_builds',
    photos: JSON.stringify(['/builds/retroscrambler_/01.png']),
    caption: "Escaping to the outskirts, where open roads and fields stretch far and wide, the sky's a brilliant blue, and the only sounds are nature's symphony and the rumble of my exhaust. My weekly reset button, activated.\n\n#triumphscrambler #scrambler900 #triumphbonneville #triumphvanceandhines",
    taggedPartIds: JSON.stringify(['part_nt_01', 'part_nt_03']),
    likeCount: 77,
    commentCount: 17,
    createdAt: new Date('2026-04-27T13:11:52.000Z').toISOString(),
  },
  {
    id: 'post_nt_02',
    buildId: 'build_ninet_cafe',
    userId: 'user_ninet_builds',
    photos: JSON.stringify(['/builds/retroscrambler_/02.png']),
    caption: 'Gotta love the industrial environments - something about the clean lines, minimal color palette and architecture wise.\n\nAlso, this one specifically lets me shoot alone without an awkward audience.\n\n#moto2triumph #triumphscrambler #scrambler900 #scramblertriumph #twowheellife #twowheelsmovethesoul',
    taggedPartIds: JSON.stringify(['part_nt_02', 'part_nt_04']),
    likeCount: 202,
    commentCount: 9,
    createdAt: new Date('2025-10-29T21:30:09.000Z').toISOString(),
  },
  // ── seven11moto ───────────────────────────────────────────────────────────────
  {
    id: 'post_s11_01',
    buildId: 'build_seven11moto_xsr900',
    userId: 'user_seven11moto',
    photos: JSON.stringify(['/builds/seven11moto/01.png']),
    caption: "View from behind 🍑 I'm hoping that this will be one of the last as I'm working on another tail tidy 🤫\n\n#Motorcycleofinstagram #instamotorcycles #xsr900 #fastersons #bikersfromeurope #motorbikelife #motorcyclephotography #yamahabikes",
    taggedPartIds: JSON.stringify(['part_s11_04', 'part_s11_05']),
    likeCount: 6187,
    commentCount: 43,
    createdAt: new Date('2020-06-15T11:25:43.000Z').toISOString(),
  },
  {
    id: 'post_s11_02',
    buildId: 'build_seven11moto_xsr900',
    userId: 'user_seven11moto',
    photos: JSON.stringify(['/builds/seven11moto/02.png']),
    caption: 'Making the most of the late evenings and riding when I can! 🖤⚡\n\n#Motorcycleofinstagram #xsr900 #fastersons #bikersfromeurope #motorbikelife #motorcyclephotography #yamahabikes',
    taggedPartIds: JSON.stringify(['part_s11_01', 'part_s11_03']),
    likeCount: 1291,
    commentCount: 8,
    createdAt: new Date('2020-07-07T10:46:59.000Z').toISOString(),
  },
  // ── coldbrewmoto ──────────────────────────────────────────────────────────────
  {
    id: 'post_cb_01',
    buildId: 'build_coldbrewmoto_ftr',
    userId: 'user_coldbrewmoto',
    photos: JSON.stringify(['/builds/coldbrewmoto/01.png']),
    caption: "It's been a minute since I've updated this page- but it deserves a solid shout out. A little cold brew life update.. the build is rounding third in the project. It's definitely the bolt on king 😆… I've pretty much run out of things to modify.. except wheels… maybe slipper clutch…\n\nHere's a few of the parts I've modified recently:\n- New front master cylinder from @brembo, a really lovely upgrade\n- Rear sets from @woodcrafttechnologies\n- @brogue_motorcycles parts still look amazing\n- @racetorx was an amazing little upgrade - highly recommend!\n- Cut and repainted all of the side panels\n\n#neocafe #xsr700 #fastersonsfans #coldbrewmoto #caferacer #minneapolis #motosota",
    taggedPartIds: JSON.stringify(['part_cb_02', 'part_cb_03']),
    likeCount: 109,
    commentCount: 3,
    createdAt: new Date('2024-05-01T02:56:41.000Z').toISOString(),
  },
  {
    id: 'post_cb_02',
    buildId: 'build_coldbrewmoto_ftr',
    userId: 'user_coldbrewmoto',
    photos: JSON.stringify(['/builds/coldbrewmoto/02.png']),
    caption: "New seat update. My next few posts will all be dedicated to @hurleycustomseats. Absolutely stunning craftsmanship. I'm beyond thrilled on how this seat turned out.\n\nThere's so much to highlight about this new seat that it needs more than one post to share all the details. I also included last year's silhouette shot so you can see the difference…\n\nGo give @hurleycustomseats a follow 👏🏻\n\n#neocafe #instabike #xsr700 #fastersonsfans #coldbrewmoto #caferacer #minneapolis #motosota",
    taggedPartIds: JSON.stringify(['part_cb_05']),
    likeCount: 161,
    commentCount: 18,
    createdAt: new Date('2022-08-22T14:33:43.000Z').toISOString(),
  },
  // ── motozuc ───────────────────────────────────────────────────────────────────
  {
    id: 'post_mz_01',
    buildId: 'build_motozuc_bonneville',
    userId: 'user_motozuc',
    photos: JSON.stringify(['/builds/motozuc/01.png']),
    caption: 'Dirt roads 🏍',
    taggedPartIds: JSON.stringify([]),
    likeCount: 5911,
    commentCount: 11,
    createdAt: new Date('2021-10-22T20:07:19.000Z').toISOString(),
  },
  {
    id: 'post_mz_02',
    buildId: 'build_motozuc_bonneville',
    userId: 'user_motozuc',
    photos: JSON.stringify(['/builds/motozuc/02.png']),
    caption: "Another autumn fav on the Scrambler 🍂",
    taggedPartIds: JSON.stringify([]),
    likeCount: 187,
    commentCount: 9,
    createdAt: new Date('2021-11-29T21:14:09.000Z').toISOString(),
  },
  // ── thecrocodile ─────────────────────────────────────────────────────────────
  {
    id: 'post_croc_01',
    buildId: 'build_thecrocodile_ducati',
    userId: 'user_thecrocodile',
    photos: JSON.stringify(['/builds/thecrocodile/01.png']),
    caption: 'Still a Ducati boi or whatever 🐊💨🏍️',
    taggedPartIds: JSON.stringify([]),
    likeCount: 132,
    commentCount: 11,
    createdAt: new Date('2026-04-17T17:40:45.000Z').toISOString(),
  },
  {
    id: 'post_croc_02',
    buildId: 'build_thecrocodile_ducati',
    userId: 'user_thecrocodile',
    photos: JSON.stringify(['/builds/thecrocodile/02.png']),
    caption: '🐊💨MOTOPHOTO🏍️',
    taggedPartIds: JSON.stringify([]),
    likeCount: 458,
    commentCount: 15,
    createdAt: new Date('2026-05-03T05:14:51.000Z').toISOString(),
  },
]

function _joinPosts(raw: typeof _RAW_POSTS): Post[] {
  const userMap = Object.fromEntries(MOCK_USERS.map(u => [u.id, u]))
  const buildMap = Object.fromEntries(MOCK_BUILDS.map(b => [b.id, b]))
  return raw.map(post => {
    const user = userMap[post.userId]
    const build = buildMap[post.buildId]
    return {
      ...post,
      username: user?.username,
      displayName: user?.displayName,
      avatarUrl: user?.avatarUrl,
      buildNickname: build?.nickname,
      buildSlug: build?.slug,
      buildYear: build?.year,
      buildMake: build?.make,
      buildModel: build?.model,
      buildCoverPhotoUrl: build?.coverPhotoUrl,
      buildType: build?.buildType,
    }
  })
}

export const MOCK_POSTS: Post[] = _joinPosts(_RAW_POSTS)

export const MOCK_COMMENTS: Comment[] = [
  // post_cap_01 — Saturday is for the motos
  { id: 'cmt_01', body: 'Quad Lock setup on the XSR looks cleaner than stock. Which mount are you running?', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_cap_01', likes: 14, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  { id: 'cmt_02', body: 'Always the best day of the week. 🤘', authorUserId: 'user_blacktank', targetType: 'post', targetId: 'post_cap_01', likes: 6, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), username: 'moto_feelz', displayName: 'Rob Hamilton', avatarUrl: AVATARS.moto_feelz },
  { id: 'cmt_03', body: 'Those bar-end mirrors look so much better than stock.', authorUserId: 'user_ninet_builds', targetType: 'post', targetId: 'post_cap_01', likes: 3, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), username: 'retroscrambler_', displayName: 'Fred Neves', avatarUrl: AVATARS.retroscrambler },
  { id: 'cmt_04', body: 'Felt like a different bike once those were on.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_cap_01', likes: 9, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  // post_cap_02 — Too much black a thing?
  { id: 'cmt_05', body: 'Never too much black. Ever.', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_cap_02', likes: 22, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  { id: 'cmt_06', body: 'Red Wing boots on a moto build — respect.', authorUserId: 'user_ninet_builds', targetType: 'post', targetId: 'post_cap_02', likes: 8, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), username: 'retroscrambler_', displayName: 'Fred Neves', avatarUrl: AVATARS.retroscrambler },
  { id: 'cmt_07', body: 'That all-black kit is everything. How\'s comfort on the Ugly Bros jeans?', authorUserId: 'user_blacktank', targetType: 'post', targetId: 'post_cap_02', likes: 41, isPinned: '1', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), username: 'moto_feelz', displayName: 'Rob Hamilton', avatarUrl: AVATARS.moto_feelz },
  { id: 'cmt_08', body: 'Surprisingly good. Wore them for 4 hours with zero complaints.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_cap_02', likes: 17, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  // post_duc_01 — First ride on the Crimson
  { id: 'cmt_duc_01', body: 'Two bikes, two completely different souls. The Ducati personality is something else entirely.', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_duc_01', likes: 18, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  { id: 'cmt_duc_02', body: 'That red against literally any background is ridiculous. The Icon colorway is peak Ducati.', authorUserId: 'user_blacktank', targetType: 'post', targetId: 'post_duc_01', likes: 11, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), username: 'moto_feelz', displayName: 'Rob Hamilton', avatarUrl: AVATARS.moto_feelz },
  { id: 'cmt_duc_03', body: 'Heidenau K60s on a Scrambler — perfect spec. How are they on tarmac at speed?', authorUserId: 'user_ninet_builds', targetType: 'post', targetId: 'post_duc_01', likes: 6, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), username: 'retroscrambler_', displayName: 'Fred Neves', avatarUrl: AVATARS.retroscrambler },
  { id: 'cmt_duc_04', body: 'Confident up to about 90mph, then they start to feel their limits. For anything under that they\'re great.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_duc_01', likes: 7, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  // post_duc_02 — Arrow exhaust
  { id: 'cmt_duc_05', body: 'Arrow on a Scrambler is the move. That mid-range bark is insane.', authorUserId: 'user_seven11moto', targetType: 'post', targetId: 'post_duc_02', likes: 22, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), username: 'seven11moto', displayName: 'Seven11Moto', avatarUrl: AVATARS.seven11moto },
  { id: 'cmt_duc_06', body: 'The Rizoma mirrors with that Arrow — perfection. What\'s next for it?', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_duc_02', likes: 9, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  { id: 'cmt_duc_07', body: 'Öhlins rear shock is going on next. Then it\'ll be pretty much where I want it.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_duc_02', likes: 14, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  // post_cap_03 — You know me
  { id: 'cmt_09', body: 'XSR silhouette at dusk never gets old.', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_cap_03', likes: 11, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  { id: 'cmt_10', body: 'You and your evening rides. Every single time.', authorUserId: 'user_blacktank', targetType: 'post', targetId: 'post_cap_03', likes: 5, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(), username: 'moto_feelz', displayName: 'Rob Hamilton', avatarUrl: AVATARS.moto_feelz },
  // post_mx_01 — A work in progress
  { id: 'cmt_11', body: 'That front end conversion is insane. F800 forks on an nineT must completely change the character of the bike.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_mx_01', likes: 7, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  { id: 'cmt_12', body: 'Unit Garage exhaust and luggage combo is peak scrambler. What does the sound note like with the Termignoni tune?', authorUserId: 'user_ninet_builds', targetType: 'post', targetId: 'post_mx_01', likes: 4, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(), username: 'retroscrambler_', displayName: 'Fred Neves', avatarUrl: AVATARS.retroscrambler },
  { id: 'cmt_21', body: 'The Wilbers rear shock alone is worth the investment. That bike must corner on rails now.', authorUserId: 'user_seven11moto', targetType: 'post', targetId: 'post_mx_01', likes: 9, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), username: 'seven11moto', displayName: 'Seven11Moto', avatarUrl: AVATARS.seven11moto },
  // post_mx_02 — The Project Bike Returns
  { id: 'cmt_24', body: 'That thing looks mean as hell. Ready for the dirt.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_mx_02', likes: 11, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  { id: 'cmt_25', body: 'R9T Rural G/S has such a great ring to it. How does it handle compared to before the fork swap?', authorUserId: 'user_blacktank', targetType: 'post', targetId: 'post_mx_02', likes: 6, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), username: 'moto_feelz', displayName: 'Rob Hamilton', avatarUrl: AVATARS.moto_feelz },
  // post_bt_01 — Insta360 GPS remote
  { id: 'cmt_13', body: 'The GPS overlay on these is underrated. Does the audio actually hold up at highway speeds?', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_bt_01', likes: 19, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  { id: 'cmt_14', body: 'Been on the fence about this. The preview LCD changes everything for solo riding — no more stopping to check framing.', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_bt_01', likes: 8, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  { id: 'cmt_15', body: 'Rob never does anything halfway with the content setup. 🎙️', authorUserId: 'user_ninet_builds', targetType: 'post', targetId: 'post_bt_01', likes: 12, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 35).toISOString(), username: 'retroscrambler_', displayName: 'Fred Neves', avatarUrl: AVATARS.retroscrambler },
  // post_bt_02 — My favorite kind of therapy
  { id: 'cmt_26', body: 'This. Every single time.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_bt_02', likes: 14, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  { id: 'cmt_27', body: 'Golden hour + two wheels = the only therapy that actually works.', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_bt_02', likes: 21, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  // post_nt_01 — Escaping to the outskirts
  { id: 'cmt_16', body: 'Weekly reset button is exactly right. Nothing else resets me like this.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_nt_01', likes: 25, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  { id: 'cmt_17', body: 'That exhaust note on an open road... Triumph just gets it right.', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_nt_01', likes: 31, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  { id: 'cmt_18', body: 'The Triumph twin on open roads is genuinely one of the best sounds in motorcycling.', authorUserId: 'user_blacktank', targetType: 'post', targetId: 'post_nt_01', likes: 3, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), username: 'moto_feelz', displayName: 'Rob Hamilton', avatarUrl: AVATARS.moto_feelz },
  // post_nt_02 — Industrial environments
  { id: 'cmt_28', body: 'The light in that environment is unreal. The Triumph photographs so well against concrete.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_nt_02', likes: 8, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  { id: 'cmt_29', body: 'Love how the industrial location frames the scrambler aesthetic. What lens are you shooting with?', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_nt_02', likes: 5, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  // post_s11_01 — View from behind
  { id: 'cmt_19', body: "That tail section is genuinely one of the cleanest on any XSR900. Working on another tail tidy? 👀", authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_s11_01', likes: 18, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  { id: 'cmt_20', body: 'That rear end 🤌 The clean lines on the XSR900 are everything.', authorUserId: 'user_coldbrewmoto', targetType: 'post', targetId: 'post_s11_01', likes: 12, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(), username: 'coldbrewmoto', displayName: 'Cold Brew Moto', avatarUrl: AVATARS.coldbrewmoto },
  // post_s11_02 — Making the most of late evenings
  { id: 'cmt_30', body: 'Late evening rides are a different world. The light always hits better.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_s11_02', likes: 7, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  { id: 'cmt_31', body: 'XSR900 in this light looks absolutely mean. 🖤', authorUserId: 'user_blacktank', targetType: 'post', targetId: 'post_s11_02', likes: 4, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), username: 'moto_feelz', displayName: 'Rob Hamilton', avatarUrl: AVATARS.moto_feelz },
  // post_cb_01 — Build update
  { id: 'cmt_22', body: 'The Brembo master cylinder upgrade is seriously underrated. Night and day feel at the lever.', authorUserId: 'user_seven11moto', targetType: 'post', targetId: 'post_cb_01', likes: 6, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(), username: 'seven11moto', displayName: 'Seven11Moto', avatarUrl: AVATARS.seven11moto },
  { id: 'cmt_23', body: 'Brogue Motorcycles parts looking 🔥. The JVB side panels cut and repainted — what did you finish them with?', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_cb_01', likes: 4, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  // post_cb_02 — New seat
  { id: 'cmt_32', body: 'Hurley seats are incredible. The way he nails the fit without a single fitting session is unreal.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_cb_02', likes: 9, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  { id: 'cmt_33', body: 'The seat completely transforms the side profile. Going straight on my list.', authorUserId: 'user_ninet_builds', targetType: 'post', targetId: 'post_cb_02', likes: 5, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(), username: 'retroscrambler_', displayName: 'Fred Neves', avatarUrl: AVATARS.retroscrambler },
  // post_mz_01 — Dirt roads
  { id: 'cmt_34', body: 'This is the caption. Nothing else needed.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_mz_01', likes: 22, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  { id: 'cmt_35', body: 'Dirt roads or nothing. 🤜', authorUserId: 'user_blacktank', targetType: 'post', targetId: 'post_mz_01', likes: 15, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 62).toISOString(), username: 'moto_feelz', displayName: 'Rob Hamilton', avatarUrl: AVATARS.moto_feelz },
  // post_mz_02 — Autumn Scrambler
  { id: 'cmt_36', body: 'Scrambler + autumn colors is the most satisfying combo in moto photography.', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_mz_02', likes: 10, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  { id: 'cmt_37', body: 'Those fall colors go perfectly with the Triumph color palette.', authorUserId: 'user_ninet_builds', targetType: 'post', targetId: 'post_mz_02', likes: 7, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 82).toISOString(), username: 'retroscrambler_', displayName: 'Fred Neves', avatarUrl: AVATARS.retroscrambler },
  // post_croc_01 — Still a Ducati boi
  { id: 'cmt_38', body: 'Always a Ducati boi 🐊', authorUserId: 'user_coldbrewmoto', targetType: 'post', targetId: 'post_croc_01', likes: 8, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), username: 'coldbrewmoto', displayName: 'Cold Brew Moto', avatarUrl: AVATARS.coldbrewmoto },
  { id: 'cmt_39', body: '"Or whatever" 😂 Valid though.', authorUserId: 'user_cappuccino', targetType: 'post', targetId: 'post_croc_01', likes: 19, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(), username: 'cappuccinomoto', displayName: 'Cappuccino Moto', avatarUrl: AVATARS.cappuccinomoto },
  // post_croc_02 — MOTOPHOTO
  { id: 'cmt_40', body: 'Say less 📸', authorUserId: 'user_moto_mx', targetType: 'post', targetId: 'post_croc_02', likes: 12, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), username: 'investomoto', displayName: 'Ryan | Motorcyclist', avatarUrl: AVATARS.investomoto },
  { id: 'cmt_41', body: 'The lighting in this shot is unreal.', authorUserId: 'user_seven11moto', targetType: 'post', targetId: 'post_croc_02', likes: 6, isPinned: '0', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), username: 'seven11moto', displayName: 'Seven11Moto', avatarUrl: AVATARS.seven11moto },
]

const _localBuildComments: Comment[] = []

export function isProUser(username?: string | null): boolean {
  if (!username) return false
  const user = MOCK_USERS.find(u => u.username === username)
  return !!user && parseInt(user.proTier as string) >= 1
}

// ─── Query Helpers ─────────────────────────────────────────────────────────────

export async function getUser(id: string): Promise<User | null> {
  return MOCK_USERS.find(u => u.id === id) ?? null
}

export async function getPost(id: string): Promise<Post | null> {
  return MOCK_POSTS.find(p => p.id === id) ?? null
}

export async function listUsers(): Promise<User[]> {
  return MOCK_USERS
}

export async function listBuilds(where?: {
  userId?: string
  slug?: string
  username?: string
  status?: string
}): Promise<Build[]> {
  let builds = MOCK_BUILDS
  if (where?.userId) builds = builds.filter(b => b.userId === where.userId)
  if (where?.slug) builds = builds.filter(b => b.slug === where.slug)
  if (where?.status) builds = builds.filter(b => b.status === where.status)
  if (where?.username) {
    const user = MOCK_USERS.find(u => u.username === where.username)
    if (user) builds = builds.filter(b => b.userId === user.id)
    else builds = []
  }
  return builds
}

export async function getBuild(id: string): Promise<Build | null> {
  return MOCK_BUILDS.find(b => b.id === id) ?? null
}

export async function listPosts(opts?: { limit?: number; buildId?: string; userId?: string }): Promise<Post[]> {
  let posts = [...MOCK_POSTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  if (opts?.buildId) posts = posts.filter(p => p.buildId === opts.buildId)
  if (opts?.userId) posts = posts.filter(p => p.userId === opts.userId)
  if (opts?.limit) return posts.slice(0, opts.limit)
  return posts
}

export async function listParts(where?: {
  buildId?: string | { in: string[] }
}): Promise<Part[]> {
  let parts = MOCK_PARTS
  if (where?.buildId) {
    if (typeof where.buildId === 'string') {
      parts = parts.filter(p => p.buildId === where.buildId)
    } else if (where.buildId.in) {
      const ids = where.buildId.in
      parts = parts.filter(p => ids.includes(p.buildId))
    }
  }
  return parts
}

export async function listComments(where?: {
  authorUserId?: string
  targetId?: string
}): Promise<Comment[]> {
  let comments = [...MOCK_COMMENTS, ..._localBuildComments]
  if (where?.authorUserId) comments = comments.filter(c => c.authorUserId === where.authorUserId)
  if (where?.targetId) comments = comments.filter(c => c.targetId === where.targetId)
  return comments
}

export function getTopPostComments(postId: string, limit = 3): Comment[] {
  return [...MOCK_COMMENTS, ..._localBuildComments]
    .filter(c => c.targetId === postId && !c.parentId)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit)
}

export function getPostComments(postId: string): Comment[] {
  return [...MOCK_COMMENTS, ..._localBuildComments]
    .filter(c => c.targetId === postId && !c.parentId)
}

export async function addComment(targetId: string, body: string, parentId?: string): Promise<Comment> {
  const user = MOCK_USERS.find(u => u.id === 'user_cappuccino')
  const comment: Comment = {
    id: `cmt_local_${Date.now()}`,
    body,
    authorUserId: 'user_cappuccino',
    targetType: 'build',
    targetId,
    parentId,
    likes: 0,
    isPinned: '0',
    createdAt: new Date().toISOString(),
    username: user?.username ?? 'cappuccinomoto',
    displayName: user?.displayName ?? 'Cappuccino Moto',
    avatarUrl: user?.avatarUrl,
  }
  _localBuildComments.push(comment)
  return comment
}

export async function getPart(id: string): Promise<Part | null> {
  return MOCK_PARTS.find(p => p.id === id) ?? null
}

export async function listTags(): Promise<Tag[]> {
  return MOCK_TAGS
}

export async function getTag(name: string): Promise<Tag | null> {
  return MOCK_TAGS.find(t => t.name === name) ?? null
}

// ─── Follow Data ──────────────────────────────────────────────────────────────

// { userId, buildId } — who follows which build
const MOCK_BUILD_FOLLOWS: { userId: string; buildId: string }[] = [
  // cappuccinomoto follows these builds
  { userId: 'user_cappuccino', buildId: 'build_moto_mx_ninet' },
  { userId: 'user_cappuccino', buildId: 'build_blacktank_cb750' },
  { userId: 'user_cappuccino', buildId: 'build_ninet_cafe' },
  { userId: 'user_cappuccino', buildId: 'build_seven11moto_xsr900' },
  { userId: 'user_cappuccino', buildId: 'build_thecrocodile_ducati' },
  // followers of the cappuccino build
  { userId: 'user_moto_mx',       buildId: 'build_cappuccino_xsr' },
  { userId: 'user_blacktank',     buildId: 'build_cappuccino_xsr' },
  { userId: 'user_ninet_builds',  buildId: 'build_cappuccino_xsr' },
  { userId: 'user_seven11moto',   buildId: 'build_cappuccino_xsr' },
  { userId: 'user_thecrocodile',  buildId: 'build_cappuccino_xsr' },
  { userId: 'user_motozuc',       buildId: 'build_cappuccino_xsr' },
  { userId: 'user_coldbrewmoto',  buildId: 'build_cappuccino_xsr' },
  // cross-follows
  { userId: 'user_cappuccino',    buildId: 'build_coldbrewmoto_ftr' },
  { userId: 'user_blacktank',     buildId: 'build_moto_mx_ninet' },
  { userId: 'user_moto_mx',       buildId: 'build_blacktank_cb750' },
  { userId: 'user_ninet_builds',  buildId: 'build_seven11moto_xsr900' },
  { userId: 'user_seven11moto',   buildId: 'build_ninet_cafe' },
  { userId: 'user_motozuc',       buildId: 'build_seven11moto_xsr900' },
  { userId: 'user_thecrocodile',  buildId: 'build_moto_mx_ninet' },
]

export async function listBuildFollowers(buildId: string): Promise<User[]> {
  const userIds = MOCK_BUILD_FOLLOWS
    .filter(f => f.buildId === buildId)
    .map(f => f.userId)
  return MOCK_USERS.filter(u => userIds.includes(u.id))
}

export async function listFollowingBuilds(userId: string): Promise<Build[]> {
  const buildIds = MOCK_BUILD_FOLLOWS
    .filter(f => f.userId === userId)
    .map(f => f.buildId)
  const builds = MOCK_BUILDS.filter(b => buildIds.includes(b.id))
  return builds.map(b => {
    const owner = MOCK_USERS.find(u => u.id === b.userId)
    return { ...b, username: owner?.username, displayName: owner?.displayName, avatarUrl: owner?.avatarUrl, ownerIsPro: parseInt(owner?.proTier as string) >= 1 }
  })
}

export function getFollowingCount(userId: string): number {
  return MOCK_BUILD_FOLLOWS.filter(f => f.userId === userId).length
}

const _userTopBuildIds: Record<string, string[]> = {}

export function getUserTopBuildIds(userId: string): string[] | null {
  return _userTopBuildIds[userId] ?? null
}

export function setUserTopBuildIds(userId: string, ids: string[]) {
  _userTopBuildIds[userId] = ids
}

export function getTopBuilds(limit = 10, excludeUserId?: string): Build[] {
  const userMap = Object.fromEntries(MOCK_USERS.map(u => [u.id, u]))
  // If the profile owner has explicit selections, use those
  if (excludeUserId) {
    const selectedIds = getUserTopBuildIds(excludeUserId)
    if (selectedIds !== null) {
      const buildMap = Object.fromEntries(MOCK_BUILDS.map(b => [b.id, b]))
      return selectedIds
        .map(id => buildMap[id])
        .filter(Boolean)
        .filter(b => b.userId !== excludeUserId)
        .map(b => ({ ...b, username: userMap[b.userId]?.username, avatarUrl: userMap[b.userId]?.avatarUrl, ownerIsPro: parseInt(userMap[b.userId]?.proTier as string) >= 1 }))
    }
  }
  let builds = MOCK_BUILDS.filter(b => b.status === 'active')
  if (excludeUserId) builds = builds.filter(b => b.userId !== excludeUserId)
  return [...builds]
    .sort((a, b) => b.followerCount - a.followerCount)
    .slice(0, limit)
    .map(b => ({ ...b, username: userMap[b.userId]?.username, avatarUrl: userMap[b.userId]?.avatarUrl, ownerIsPro: parseInt(userMap[b.userId]?.proTier as string) >= 1 }))
}

// ─── Horsepower Score ─────────────────────────────────────────────────────────
// Engagement metric ranked within same-make peer group, scaled 100–1000.
// Signals: build followers, post likes (passive), comments (active),
// tagged-part mentions per post (proxy for tag-click engagement).
// Formula: 60% within-make rank + 40% global rank → avoids ties at 1000.

function _computeHorsepowerMap(): Map<string, number> {
  function rawScore(build: Build): number {
    const posts = _RAW_POSTS.filter(p => p.buildId === build.id)
    const totalLikes    = posts.reduce((s, p) => s + p.likeCount, 0)
    const totalComments = posts.reduce((s, p) => s + p.commentCount, 0)
    const totalTagged   = posts.reduce((s, p) => {
      try { return s + (JSON.parse(p.taggedPartIds) as string[]).length } catch { return s }
    }, 0)
    return build.followerCount * 1.0 + totalLikes * 0.3 + totalComments * 3.0 + totalTagged * 8.0
  }

  const scores = new Map(MOCK_BUILDS.map(b => [b.id, rawScore(b)]))

  // Group by make
  const byMake = new Map<string, Build[]>()
  for (const b of MOCK_BUILDS) {
    if (!byMake.has(b.make)) byMake.set(b.make, [])
    byMake.get(b.make)!.push(b)
  }

  // Global rank (1 = lowest raw score)
  const globalSorted = [...MOCK_BUILDS].sort((a, b) => scores.get(a.id)! - scores.get(b.id)!)
  const globalRankMap = new Map(globalSorted.map((b, i) => [b.id, i + 1]))
  const G = MOCK_BUILDS.length

  const hp = new Map<string, number>()
  for (const builds of byMake.values()) {
    const grouped = builds.length >= 2
    const groupSorted = [...builds].sort((a, b) => scores.get(a.id)! - scores.get(b.id)!)
    const N = groupSorted.length

    groupSorted.forEach((b, i) => {
      const groupPct  = N > 1 ? i / (N - 1) : 0
      const globalPct = (globalRankMap.get(b.id)! - 1) / Math.max(G - 1, 1)
      const blended   = grouped ? 0.6 * groupPct + 0.4 * globalPct : globalPct
      hp.set(b.id, Math.round(100 + blended * 900))
    })
  }

  return hp
}

const _HP_MAP = _computeHorsepowerMap()

export function getUserHorsepower(userId: string): number {
  const userBuilds = MOCK_BUILDS.filter(b => b.userId === userId)
  if (userBuilds.length === 0) return 100
  const scores = userBuilds.map(b => _HP_MAP.get(b.id) ?? 100)
  return Math.max(...scores)
}

// ─── Store ───────────────────────────────────────────────────────────────────────

export interface StoreItem {
  id: string
  userId: string
  title: string
  imageUrl?: string
  price: number
  link: string
  source: 'facebook' | 'tagged' | 'personal'
  description?: string
}

const MOCK_STORE_ITEMS: StoreItem[] = [
  // cappuccinomoto — tagged parts + merch
  { id: 'store_cap_01', userId: 'user_cappuccino', title: 'SC-Project Slip-On Exhaust', price: 599, link: 'https://www.sc-project.com/en/products/', source: 'tagged', description: 'XSR900 specific. Massive tone upgrade, -2 kg.' },
  { id: 'store_cap_02', userId: 'user_cappuccino', title: 'JvB Moto Fork Gaiters', price: 149, link: 'https://www.jvb-moto.com/shop', source: 'tagged', description: 'Transforms the front end. Bolt-on, no mods.' },
  { id: 'store_cap_03', userId: 'user_cappuccino', title: 'Quad Lock Stem Mount', price: 79, link: 'https://www.quadlockcase.com/collections/motorcycle', source: 'tagged', description: 'Best phone mount I\'ve used. Vibration dampener included.' },
  { id: 'store_cap_04', userId: 'user_cappuccino', title: 'Cappuccinomoto Tee', price: 35, link: 'https://www.facebook.com/marketplace/cappuccinomoto/shop', source: 'facebook', description: 'Classic logo tee. Black on black.' },
  { id: 'store_cap_05', userId: 'user_cappuccino', title: 'Cappuccinomoto Hoodie', price: 65, link: 'https://www.facebook.com/marketplace/cappuccinomoto/shop', source: 'facebook', description: 'Heavyweight pullover. Limited run.' },

  // thecrocodile — photography prints + merch
  { id: 'store_croc_01', userId: 'user_thecrocodile', title: 'Ducati Panigale Print', price: 45, link: 'https://www.facebook.com/marketplace/thecrocodile/shop', source: 'facebook', description: '12×18 matte. Canyon shot from last season.' },
  { id: 'store_croc_02', userId: 'user_thecrocodile', title: 'The Crocodile Tee', price: 42, link: 'https://www.facebook.com/marketplace/thecrocodile/shop', source: 'facebook', description: 'Moto lifestyle brand. Heavyweight 100% cotton.' },
  { id: 'store_croc_03', userId: 'user_thecrocodile', title: 'Akrapovic Slip-On — V4', price: 849, link: 'https://www.akrapovic.com/en/product/titan/', source: 'tagged', description: 'Running on my V4S. Full titanium, 2 kg savings.' },
  { id: 'store_croc_04', userId: 'user_thecrocodile', title: 'Croc Moto Cap', price: 28, link: 'https://www.facebook.com/marketplace/thecrocodile/shop', source: 'facebook', description: '6-panel structured cap. Embroidered logo.' },

  // investomoto — tagged parts + personal recs
  { id: 'store_inv_01', userId: 'user_moto_mx', title: 'Quad Lock Phone Mount', price: 89, link: 'https://www.quadlockcase.com/collections/motorcycle', source: 'tagged', description: 'The one I use daily. Vibration dampener is a must.' },
  { id: 'store_inv_02', userId: 'user_moto_mx', title: 'SW-Motech Bar Bag', price: 64, link: 'https://www.sw-motech.com/en/products/luggage/', source: 'tagged', description: 'Canyon runs and weekend rides. 1L, waterproof.' },
  { id: 'store_inv_03', userId: 'user_moto_mx', title: 'Investomoto Tee', price: 38, link: 'https://www.facebook.com/marketplace/investomoto/shop', source: 'facebook', description: 'Rider lifestyle brand. Limited first run.' },

  // moto_feelz — merch
  { id: 'store_feelz_01', userId: 'user_blacktank', title: 'Throttle Haus Hoodie', price: 65, link: 'https://www.facebook.com/marketplace/motofleez/shop', source: 'facebook', description: 'Moto Gang OG design. Heavyweight fleece.' },
  { id: 'store_feelz_02', userId: 'user_blacktank', title: 'Throttle Haus Tee', price: 38, link: 'https://www.facebook.com/marketplace/motofleez/shop', source: 'facebook', description: 'Everyday rider tee. Super soft 60/40 blend.' },

  // seven11moto — tagged parts
  { id: 'store_s11_01', userId: 'user_seven11moto', title: 'Akrapovic Full System — XSR', price: 1249, link: 'https://www.akrapovic.com/en/product/', source: 'tagged', description: 'Full stainless system. Deep tone with the map.' },
  { id: 'store_s11_02', userId: 'user_seven11moto', title: 'Seven11Moto Tee', price: 32, link: 'https://www.facebook.com/marketplace/seven11moto/shop', source: 'facebook', description: 'Rider lifestyle. First drop, small run.' },
]

// Mutable per-user store (initialized from mock on first read)
const _userStoreItems: Record<string, StoreItem[]> = {}

function _initUserStore(userId: string): StoreItem[] {
  if (!_userStoreItems[userId]) {
    _userStoreItems[userId] = MOCK_STORE_ITEMS.filter(i => i.userId === userId)
  }
  return _userStoreItems[userId]
}

export function getUserStoreItems(userId: string): StoreItem[] {
  return _initUserStore(userId).slice(0, 20)
}

export function setUserStoreItems(userId: string, items: StoreItem[]) {
  _userStoreItems[userId] = items.slice(0, 20)
}

// Store visibility (pro feature, per-user)
const _storeVisible: Record<string, boolean> = {
  user_cappuccino:   true,
  user_thecrocodile: true,
  user_moto_mx:      true,
  user_seven11moto:  true,
}

export function isStoreVisible(userId: string): boolean {
  return _storeVisible[userId] ?? false
}

export function setStoreVisible(userId: string, v: boolean) {
  _storeVisible[userId] = v
}

// Build display order (mutable per-user)
const _buildOrder: Record<string, string[]> = {}

export function getUserBuildOrder(userId: string): string[] {
  if (!_buildOrder[userId]) {
    _buildOrder[userId] = MOCK_BUILDS.filter(b => b.userId === userId).map(b => b.id)
  }
  return _buildOrder[userId]
}

export function setUserBuildOrder(userId: string, ids: string[]) {
  _buildOrder[userId] = ids
}

// All parts across a user's builds (for adding to store)
export function getUserParts(userId: string): Part[] {
  const ids = new Set(MOCK_BUILDS.filter(b => b.userId === userId).map(b => b.id))
  return MOCK_PARTS.filter(p => ids.has(p.buildId) && p.sourceUrl)
}

// Store position: index in build list where store appears (0 = before first build)
const _storePosition: Record<string, number> = {}

export function getStorePosition(userId: string): number {
  return _storePosition[userId] ?? Number.MAX_SAFE_INTEGER
}

export function setStorePosition(userId: string, pos: number) {
  _storePosition[userId] = pos
}

// Top builds section position (same pattern as store position)
const _topBuildsPosition: Record<string, number> = {}

export function getTopBuildsPosition(userId: string): number {
  return _topBuildsPosition[userId] ?? Number.MAX_SAFE_INTEGER
}

export function setTopBuildsPosition(userId: string, pos: number) {
  _topBuildsPosition[userId] = pos
}
