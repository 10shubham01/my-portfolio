// Run: npx tsx scripts/seed-reactions.ts
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

interface Comment {
  id: string
  name: string
  text: string
  ts: number
}

const DAY = 86400_000

const SEED: Record<string, { loves: number; comments: Comment[] }> = {
  slashslash: {
    loves: 247,
    comments: [
      { id: "s1", name: "Priya Sharma", text: "this replaced like 3 apps for me, genuinely can't go back", ts: Date.now() - 2 * DAY },
      { id: "s2", name: "Jake Miller", text: "the // trigger is so natural, feels like it should be built into chrome", ts: Date.now() - 5 * DAY },
      { id: "s3", name: "Ananya Reddy", text: "finally something that respects privacy. no account, no cloud, just works", ts: Date.now() - 8 * DAY },
      { id: "s4", name: "Marcus Chen", text: "smart variables are a game changer for support replies", ts: Date.now() - 12 * DAY },
      { id: "s5", name: "Riya Patel", text: "been using this daily for 3 months, super reliable", ts: Date.now() - 18 * DAY },
    ],
  },
  moneyunwrapped: {
    loves: 189,
    comments: [
      { id: "m1", name: "Arjun Mehta", text: "showed this to my friends and now everyone wants their own recap lol", ts: Date.now() - 1 * DAY },
      { id: "m2", name: "Sophie Turner", text: "the animations are so smooth, feels like an actual spotify wrapped", ts: Date.now() - 3 * DAY },
      { id: "m3", name: "Karan Gupta", text: "love that nothing gets uploaded, privacy first approach is rare these days", ts: Date.now() - 7 * DAY },
      { id: "m4", name: "Neha Singh", text: "waiting for hdfc statement support!", ts: Date.now() - 14 * DAY },
    ],
  },
  talentagr: {
    loves: 312,
    comments: [
      { id: "t1", name: "Deepak Verma", text: "clean ui, our hr team switched to this within a week", ts: Date.now() - 1 * DAY },
      { id: "t2", name: "Aisha Khan", text: "the job matching actually works, not just keyword spam", ts: Date.now() - 4 * DAY },
      { id: "t3", name: "Rahul Nair", text: "got my current job through this platform, solid experience", ts: Date.now() - 10 * DAY },
      { id: "t4", name: "Meera Joshi", text: "pan india coverage is impressive for a consultancy site", ts: Date.now() - 15 * DAY },
      { id: "t5", name: "Vikram Rao", text: "interview prep section is underrated, helped me a lot", ts: Date.now() - 20 * DAY },
    ],
  },
  dbspin: {
    loves: 134,
    comments: [
      { id: "d1", name: "Alex Rivera", text: "this should come preinstalled with postgres honestly", ts: Date.now() - 2 * DAY },
      { id: "d2", name: "Nisha Kapoor", text: "chart.js integration is such a nice touch, love visualizing queries", ts: Date.now() - 6 * DAY },
      { id: "d3", name: "Tom Kowalski", text: "replaced my entire db connection workflow with this one cli", ts: Date.now() - 11 * DAY },
    ],
  },
  "text-command-palette": {
    loves: 178,
    comments: [
      { id: "tc1", name: "Shruti Desai", text: "cmd+k on any page is genius, use it every single day", ts: Date.now() - 1 * DAY },
      { id: "tc2", name: "Daniel Park", text: "case conversion alone makes this worth installing", ts: Date.now() - 4 * DAY },
      { id: "tc3", name: "Kavya Iyer", text: "lightweight and offline, exactly what i needed", ts: Date.now() - 9 * DAY },
      { id: "tc4", name: "Ryan Mitchell", text: "feels like vscode but for the entire browser, really well done", ts: Date.now() - 16 * DAY },
    ],
  },
  spotlight: {
    loves: 203,
    comments: [
      { id: "sp1", name: "Aman Saxena", text: "mac spotlight but for chrome tabs? yes please", ts: Date.now() - 2 * DAY },
      { id: "sp2", name: "Lisa Wang", text: "i have 80+ tabs open at all times, this is a lifesaver", ts: Date.now() - 5 * DAY },
      { id: "sp3", name: "Rohan Das", text: "search history + bookmarks in one shortcut is so convenient", ts: Date.now() - 13 * DAY },
    ],
  },
  easybg: {
    loves: 267,
    comments: [
      { id: "e1", name: "Pooja Menon", text: "176 backgrounds?? bookmarked this immediately", ts: Date.now() - 1 * DAY },
      { id: "e2", name: "Chris Anderson", text: "the spider-man themed ones are hilarious, great personality in the project", ts: Date.now() - 3 * DAY },
      { id: "e3", name: "Sneha Kulkarni", text: "one click copy is clutch, saves so much time", ts: Date.now() - 8 * DAY },
      { id: "e4", name: "Michael Brown", text: "dark mode support is chef's kiss", ts: Date.now() - 14 * DAY },
      { id: "e5", name: "Tanvi Shah", text: "mesh gradients collection is my go-to now", ts: Date.now() - 22 * DAY },
    ],
  },
  "scut-cli": {
    loves: 112,
    comments: [
      { id: "sc1", name: "Nikhil Bhatt", text: "so simple but so useful, replaced all my bash aliases", ts: Date.now() - 3 * DAY },
      { id: "sc2", name: "Emma Wilson", text: "love that it works across shells, finally something cross-platform", ts: Date.now() - 7 * DAY },
      { id: "sc3", name: "Siddharth Jain", text: "json config file is way cleaner than scattered alias files", ts: Date.now() - 12 * DAY },
    ],
  },
}

async function seed() {
  for (const [projectId, data] of Object.entries(SEED)) {
    const loveKey = `project:${projectId}:loves`
    const commentsKey = `project:${projectId}:comments`

    await redis.set(loveKey, data.loves)
    await redis.del(commentsKey)

    if (data.comments.length > 0) {
      // lpush adds to the front, so push in reverse order to maintain chronological display
      for (const comment of [...data.comments].reverse()) {
        await redis.lpush(commentsKey, comment)
      }
    }

    console.log(`✓ ${projectId}: ${data.loves} loves, ${data.comments.length} comments`)
  }

  console.log("\nDone! All projects seeded.")
}

seed().catch(console.error)
