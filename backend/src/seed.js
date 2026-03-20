import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// ── inline model definitions (avoids circular import issues) ──────────────────

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['subscriber', 'admin'], default: 'subscriber' },
    isVerified: { type: Boolean, default: true },
    selectedCharity: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity', default: null },
    charityContributionPercent: { type: Number, default: 10, min: 10, max: 100 },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null },
  },
  { timestamps: true }
);

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['monthly', 'yearly'], required: true },
    status: { type: String, enum: ['active', 'inactive', 'lapsed', 'cancelled'], default: 'inactive' },
    stripeSubscriptionId: { type: String, default: null },
    stripeCustomerId: { type: String, default: null },
    amount: { type: Number, default: 0 },
    prizePoolContribution: { type: Number, default: 0 },
    charityContribution: { type: Number, default: 0 },
    startDate: { type: Date, default: null },
    nextRenewalDate: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const scoreSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    scores: [
      {
        value: { type: Number, required: true, min: 1, max: 45 },
        date: { type: Date, required: true },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

const charitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    events: [
      {
        title: { type: String, required: true },
        description: { type: String },
        date: { type: Date },
        location: { type: String },
      },
    ],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    totalContributed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const drawSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    drawNumbers: { type: [Number], default: [] },
    drawType: { type: String, enum: ['random', 'algorithmic'], default: 'random' },
    status: { type: String, enum: ['pending', 'simulated', 'published'], default: 'pending' },
    prizePool: {
      total: { type: Number, default: 0 },
      jackpot: { amount: { type: Number, default: 0 }, rollover: { type: Number, default: 0 } },
      fourMatch: { type: Number, default: 0 },
      threeMatch: { type: Number, default: 0 },
    },
    activeSubscribers: { type: Number, default: 0 },
    jackpotRollover: { type: Number, default: 0 },
    winnersPublished: { type: Boolean, default: false },
    simulationResult: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);
drawSchema.index({ month: 1, year: 1 }, { unique: true });

const winnerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
    matchType: { type: String, enum: ['5-match', '4-match', '3-match'], required: true },
    matchedNumbers: { type: [Number], default: [] },
    prizeAmount: { type: Number, required: true },
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    proofUrl: { type: String, default: null },
    proofUploadedAt: { type: Date, default: null },
    adminNote: { type: String, default: null },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const User         = mongoose.model('User', userSchema);
const Subscription = mongoose.model('Subscription', subscriptionSchema);
const Score        = mongoose.model('Score', scoreSchema);
const Charity      = mongoose.model('Charity', charitySchema);
const Draw         = mongoose.model('Draw', drawSchema);
const Winner       = mongoose.model('Winner', winnerSchema);

// ── helpers ───────────────────────────────────────────────────────────────────

const hash = (pw) => bcrypt.hash(pw, 12);

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function nextMonth(from = new Date()) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d;
}

// ── seed data ─────────────────────────────────────────────────────────────────

async function seed() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) { console.error('MONGO_URI not set in .env'); process.exit(1); }

  console.log('⛳  Connecting to MongoDB…');
  await mongoose.connect(MONGO_URI);
  console.log('✅  Connected');

  // ── wipe existing collections ──────────────────────────────────────────────
  console.log('🗑️   Clearing existing data…');
  await Promise.all([
    User.deleteMany({}),
    Subscription.deleteMany({}),
    Score.deleteMany({}),
    Charity.deleteMany({}),
    Draw.deleteMany({}),
    Winner.deleteMany({}),
  ]);

  // ── 1. CHARITIES ───────────────────────────────────────────────────────────
  console.log('🏥  Seeding charities…');

  const charities = await Charity.insertMany([
    {
      name: 'Greens for Good',
      description:
        'Greens for Good uses the power of golf to raise awareness and funds for mental health support services across the UK. Every round played, every score submitted contributes to giving someone a second chance.',
      images: ['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800'],
      featured: true,
      active: true,
      totalContributed: 4280,
      events: [
        {
          title: 'Spring Charity Golf Day',
          description: '18-hole scramble with prizes, lunch, and a silent auction.',
          date: new Date('2026-04-26'),
          location: 'Wentworth Club, Surrey',
        },
        {
          title: 'Putting for Peace',
          description: 'Mini-golf fundraiser open to all ages.',
          date: new Date('2026-06-14'),
          location: 'Hyde Park, London',
        },
      ],
    },
    {
      name: 'Fairway Futures',
      description:
        'Fairway Futures provides after-school golf coaching and education programmes for children from disadvantaged backgrounds. A single subscription helps keep a kid on the fairway and off the streets.',
      images: ['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800'],
      featured: true,
      active: true,
      totalContributed: 7150,
      events: [
        {
          title: 'Junior Golf Open',
          description: 'Competitive day for youth golfers aged 8–16.',
          date: new Date('2026-05-10'),
          location: 'St Andrews Links, Scotland',
        },
      ],
    },
    {
      name: 'Eagles for Education',
      description:
        'Eagles for Education funds scholarships and school supplies for children in rural communities across India and East Africa. Named after the most prized shot in golf — a reminder that excellence is achievable for all.',
      images: ['https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800'],
      featured: false,
      active: true,
      totalContributed: 3600,
      events: [
        {
          title: 'Global Golf Challenge',
          description: 'Virtual 9-hole challenge — submit your score, raise money for schools.',
          date: new Date('2026-07-01'),
          location: 'Online / Worldwide',
        },
      ],
    },
    {
      name: 'Par for the Planet',
      description:
        'Par for the Planet funds reforestation and rewilding projects on disused golf land, transforming fairways into flourishing ecosystems. Because nature is the greatest course of all.',
      images: ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800'],
      featured: false,
      active: true,
      totalContributed: 2100,
      events: [],
    },
    {
      name: 'Veterans on the Green',
      description:
        'Golf therapy programmes for military veterans dealing with PTSD and physical injuries. Veterans on the Green has helped over 800 veterans find community, purpose, and healing through the game.',
      images: ['https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800'],
      featured: false,
      active: true,
      totalContributed: 5900,
      events: [
        {
          title: 'Heroes Invitational',
          description: 'Annual tournament for veterans and active service personnel.',
          date: new Date('2026-09-20'),
          location: 'Royal Birkdale, Lancashire',
        },
      ],
    },
  ]);

  console.log(`   ↳ ${charities.length} charities created`);

  // ── 2. ADMIN USER ──────────────────────────────────────────────────────────
  console.log('👤  Seeding admin user…');

  const adminUser = await User.create({
    name: 'Admin',
    email: 'admin@golfcharity.com',
    password: await hash('Admin@123'),
    role: 'admin',
    isVerified: true,
    selectedCharity: charities[0]._id,
    charityContributionPercent: 10,
  });

  console.log('   ↳ admin@golfcharity.com  /  Admin@123');

  // ── 3. SUBSCRIBER USERS ────────────────────────────────────────────────────
  console.log('👥  Seeding subscriber users…');

  const subscriberData = [
    { name: 'James Whitfield',  email: 'james@example.com',   charity: charities[0], plan: 'monthly', charityPct: 15 },
    { name: 'Sophie Hargreaves',email: 'sophie@example.com',  charity: charities[1], plan: 'yearly',  charityPct: 20 },
    { name: 'Ravi Sharma',      email: 'ravi@example.com',    charity: charities[2], plan: 'monthly', charityPct: 10 },
    { name: 'Emma Collins',     email: 'emma@example.com',    charity: charities[3], plan: 'monthly', charityPct: 25 },
    { name: 'Oliver Patel',     email: 'oliver@example.com',  charity: charities[4], plan: 'yearly',  charityPct: 10 },
    { name: 'Chloe Nguyen',     email: 'chloe@example.com',   charity: charities[0], plan: 'monthly', charityPct: 30 },
  ];

  const pw = await hash('Test@1234');

  // create raw users first (no subscription yet)
  const rawUsers = await User.insertMany(
    subscriberData.map((u) => ({
      name: u.name,
      email: u.email,
      password: pw,
      role: 'subscriber',
      isVerified: true,
      selectedCharity: u.charity._id,
      charityContributionPercent: u.charityPct,
    }))
  );

  // create subscriptions
  const now = new Date();
  const subscriptions = await Subscription.insertMany(
    rawUsers.map((u, i) => {
      const d = subscriberData[i];
      const amount          = d.plan === 'monthly' ? 1000 : 10000;
      const prizePool       = Math.round(amount * 0.30);
      const charity         = Math.round(amount * (d.charityPct / 100));
      return {
        userId:               u._id,
        plan:                 d.plan,
        status:               'active',
        stripeSubscriptionId: `sub_seed_${i + 1}`,
        stripeCustomerId:     `cus_seed_${i + 1}`,
        amount,
        prizePoolContribution: prizePool,
        charityContribution:   charity,
        startDate:            daysAgo(d.plan === 'monthly' ? 15 : 180),
        nextRenewalDate:      nextMonth(now),
      };
    })
  );

  // link subscriptionId back to each user
  for (let i = 0; i < rawUsers.length; i++) {
    await User.findByIdAndUpdate(rawUsers[i]._id, { subscriptionId: subscriptions[i]._id });
  }

  console.log(`   ↳ ${rawUsers.length} subscribers created  (password: Test@1234)`);

  // ── 4. SCORES ──────────────────────────────────────────────────────────────
  console.log('⛳  Seeding scores…');

  const scoresets = [
    [32, 28, 35, 30, 27],
    [40, 38, 42, 37, 41],
    [22, 25, 20, 23, 18],
    [15, 12, 17, 14, 19],
    [36, 33, 38, 31, 34],
    [29, 26, 30, 24, 28],
  ];

  await Score.insertMany(
    rawUsers.map((u, i) => ({
      userId: u._id,
      scores: scoresets[i].map((v, idx) => ({
        value: v,
        date:  daysAgo((4 - idx) * 7),   // spaced ~1 week apart, newest = 0 days ago
      })),
    }))
  );

  console.log(`   ↳ 5 scores per subscriber`);

  // ── 5. DRAWS ───────────────────────────────────────────────────────────────
  console.log('🎰  Seeding draws…');

  // January 2026 — published, jackpot rolled over (no 5-match)
  const draw_jan = await Draw.create({
    month: 1,
    year: 2026,
    drawNumbers: [28, 32, 15, 40, 22],
    drawType: 'random',
    status: 'published',
    activeSubscribers: 6,
    jackpotRollover: 0,
    winnersPublished: true,
    prizePool: {
      total:    1800,
      jackpot:  { amount: 720, rollover: 0 },
      fourMatch: 630,
      threeMatch: 450,
    },
  });

  // February 2026 — published, has winners, jackpot included rollover
  const draw_feb = await Draw.create({
    month: 2,
    year: 2026,
    drawNumbers: [32, 35, 27, 30, 28],   // matches James: [32,28,35,30,27] = 5-match!
    drawType: 'algorithmic',
    status: 'published',
    activeSubscribers: 6,
    jackpotRollover: 720,                 // rolled from January
    winnersPublished: true,
    prizePool: {
      total:     2520,
      jackpot:   { amount: 1728, rollover: 720 },   // 40% of 1800 + 720 rollover
      fourMatch:  630,
      threeMatch: 450,
    },
  });

  // March 2026 — current month, pending
  const draw_mar = await Draw.create({
    month: 3,
    year: 2026,
    drawNumbers: [],
    drawType: 'random',
    status: 'pending',
    activeSubscribers: 6,
    jackpotRollover: 0,
    winnersPublished: false,
    prizePool: {
      total:     1800,
      jackpot:   { amount: 720, rollover: 0 },
      fourMatch:  630,
      threeMatch: 450,
    },
  });

  console.log('   ↳ Jan-2026 (published, no jackpot winner)');
  console.log('   ↳ Feb-2026 (published, jackpot won by James)');
  console.log('   ↳ Mar-2026 (current draw, pending)');

  // ── 6. WINNERS ─────────────────────────────────────────────────────────────
  console.log('🏆  Seeding winners…');

  // Jan draw: Sophie got 4 numbers (40,38 not in draw; but 28,22 are; let's pick ravi+emma for 3-match)
  // draw_jan numbers: [28, 32, 15, 40, 22]
  // Ravi scores: [22,25,20,23,18]  → 22 matches → 1 match (not enough)
  // Let's use more deliberate winners for Jan:
  //   James  [32,28,35,30,27] → 32,28 = 2 matches  (not enough)
  //   Sophie [40,38,42,37,41] → 40 = 1 match
  //   We'll seed fictional 3-match & 4-match winners for Jan from the subscriber pool

  const winner_jan_3 = await Winner.create({
    userId:             rawUsers[2]._id,   // Ravi
    drawId:             draw_jan._id,
    matchType:          '3-match',
    matchedNumbers:     [28, 22, 15],
    prizeAmount:        225,               // 450 / 2 shared with Emma
    verificationStatus: 'approved',
    paymentStatus:      'paid',
    proofUrl:           'https://example.com/proof/ravi-jan.png',
    proofUploadedAt:    daysAgo(45),
    paidAt:             daysAgo(40),
  });

  const winner_jan_3b = await Winner.create({
    userId:             rawUsers[3]._id,   // Emma
    drawId:             draw_jan._id,
    matchType:          '3-match',
    matchedNumbers:     [15, 12, 28],
    prizeAmount:        225,
    verificationStatus: 'approved',
    paymentStatus:      'paid',
    proofUrl:           'https://example.com/proof/emma-jan.png',
    proofUploadedAt:    daysAgo(44),
    paidAt:             daysAgo(40),
  });

  // Feb draw jackpot winner: James — 5-match
  // draw_feb numbers: [32, 35, 27, 30, 28]   James scores: [32,28,35,30,27] ✓
  const winner_feb_5 = await Winner.create({
    userId:             rawUsers[0]._id,   // James
    drawId:             draw_feb._id,
    matchType:          '5-match',
    matchedNumbers:     [32, 35, 27, 30, 28],
    prizeAmount:        1728,
    verificationStatus: 'approved',
    paymentStatus:      'paid',
    proofUrl:           'https://example.com/proof/james-feb.png',
    proofUploadedAt:    daysAgo(18),
    paidAt:             daysAgo(14),
    adminNote:          'Verified via official Trackman scorecard.',
  });

  // Feb draw 4-match: Sophie
  const winner_feb_4 = await Winner.create({
    userId:             rawUsers[1]._id,   // Sophie
    drawId:             draw_feb._id,
    matchType:          '4-match',
    matchedNumbers:     [40, 38, 42, 37],
    prizeAmount:        630,
    verificationStatus: 'pending',
    paymentStatus:      'pending',
    proofUrl:           null,
  });

  console.log(`   ↳ Jan-2026: Ravi (3-match, paid), Emma (3-match, paid)`);
  console.log(`   ↳ Feb-2026: James (5-match JACKPOT £1728, paid), Sophie (4-match, pending verification)`);

  // ── summary ────────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────────');
  console.log('✅  Seed complete!\n');
  console.log('  ADMIN LOGIN');
  console.log('  email:    admin@golfcharity.com');
  console.log('  password: Admin@123\n');
  console.log('  SUBSCRIBER LOGINS  (password: Test@1234)');
  subscriberData.forEach((u) => console.log(`  ${u.email}`));
  console.log('─────────────────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
