(() => {
  "use strict";

  const SAVE_KEY = "crumb-capital-save-v2";
  const LEGACY_KEY_V1 = "crumb-capital-save-v1";
  const LEGACY_KEY_V0 = "neon-nectar-save-v1";
  const TICK_MS = 100;
  const BULK_OPTIONS = ["1", "10", "100", "max"];
  const ADMIN_CODE = "98234519";

  const BUILDINGS = [
    { id: "cursor", name: "Cursor", baseCost: 15, cps: 0.1, desc: "Autoclicks basic dough flow." },
    { id: "grandma", name: "Grandma", baseCost: 100, cps: 1, desc: "Friendly grandmas baking nonstop." },
    { id: "farm", name: "Farm", baseCost: 1100, cps: 8, desc: "Rows of cookie crops." },
    { id: "mine", name: "Mine", baseCost: 12000, cps: 47, desc: "Mines chocolate chips underground." },
    { id: "factory", name: "Factory", baseCost: 130000, cps: 260, desc: "Industrial cookie manufacturing." },
    { id: "bank", name: "Bank", baseCost: 1400000, cps: 1400, desc: "Cookie-backed financial products." },
    { id: "temple", name: "Temple", baseCost: 20000000, cps: 7800, desc: "Sacred rituals for stronger dough." },
    { id: "shipment", name: "Shipment", baseCost: 330000000, cps: 44000, desc: "Import cookies from orbit." },
    { id: "alchemy", name: "Alchemy Lab", baseCost: 5100000000, cps: 260000, desc: "Transmute matter into cookies." },
    { id: "portal", name: "Portal", baseCost: 76000000000, cps: 1600000, desc: "Summon cookies from other worlds." }
  ];

  const RUN_UPGRADES = [
    { id: "click1", tier: 1, name: "Reinforced Finger", cost: 100, type: "click", value: 2, desc: "Click output x2", unlock: { runCookies: 60 } },
    { id: "global1", tier: 1, name: "Greased Trays", cost: 500, type: "global", value: 1.15, desc: "All output +15%", unlock: { runCookies: 200 } },
    { id: "cursor1", tier: 1, name: "Plastic Cursors", cost: 600, type: "building", target: "cursor", value: 2, desc: "Cursor output x2", unlock: { building: { id: "cursor", count: 10 } } },
    { id: "grandma1", tier: 1, name: "Grandma Emails", cost: 1200, type: "building", target: "grandma", value: 2, desc: "Grandma output x2", unlock: { building: { id: "grandma", count: 5 } } },

    { id: "click2", tier: 2, name: "Carpal Cream", cost: 2000, type: "click", value: 2, desc: "Click output x2", requires: ["click1"], unlock: { runCookies: 1500 } },
    { id: "farm1", tier: 2, name: "Fertilized Dough", cost: 9000, type: "building", target: "farm", value: 2, desc: "Farm output x2", unlock: { building: { id: "farm", count: 5 } } },
    { id: "global2", tier: 2, name: "Sugar Compression", cost: 14000, type: "global", value: 1.2, desc: "All output +20%", requires: ["global1"], unlock: { runCookies: 12000 } },
    { id: "cursor2", tier: 2, name: "Titanium Cursors", cost: 8000, type: "building", target: "cursor", value: 2, desc: "Cursor output x2", requires: ["cursor1"], unlock: { building: { id: "cursor", count: 25 } } },

    { id: "mine1", tier: 3, name: "Core Drills", cost: 110000, type: "building", target: "mine", value: 2, desc: "Mine output x2", unlock: { building: { id: "mine", count: 5 } } },
    { id: "factory1", tier: 3, name: "Quality Control", cost: 280000, type: "building", target: "factory", value: 2, desc: "Factory output x2", unlock: { building: { id: "factory", count: 3 } } },
    { id: "click3", tier: 3, name: "Cybernetic Hands", cost: 75000, type: "click", value: 2, desc: "Click output x2", requires: ["click2"], unlock: { runCookies: 90000 } },
    { id: "synergy1", tier: 3, name: "Family Assembly", cost: 160000, type: "global", value: 1.18, desc: "All output +18%", requires: ["grandma1", "factory1"], unlock: { building: { id: "grandma", count: 20 } } },

    { id: "bank1", tier: 4, name: "Cookie Derivatives", cost: 1700000, type: "building", target: "bank", value: 2, desc: "Bank output x2", unlock: { building: { id: "bank", count: 3 } } },
    { id: "temple1", tier: 4, name: "Sacred Flour", cost: 24000000, type: "building", target: "temple", value: 2, desc: "Temple output x2", unlock: { building: { id: "temple", count: 1 } } },
    { id: "global3", tier: 4, name: "Orbital Ovens", cost: 8500000, type: "global", value: 1.3, desc: "All output +30%", requires: ["global2"], unlock: { allTimeCookies: 1200000 } },

    { id: "shipment1", tier: 5, name: "Hyper Freight", cost: 440000000, type: "building", target: "shipment", value: 2, desc: "Shipment output x2", unlock: { building: { id: "shipment", count: 1 } } },
    { id: "alchemy1", tier: 5, name: "Gold Flour", cost: 6000000000, type: "building", target: "alchemy", value: 2, desc: "Alchemy output x2", unlock: { building: { id: "alchemy", count: 1 } } },
    { id: "portal1", tier: 6, name: "Gate Stabilizers", cost: 88000000000, type: "building", target: "portal", value: 2, desc: "Portal output x2", unlock: { building: { id: "portal", count: 1 } } },
    { id: "global4", tier: 6, name: "Infinite Starter", cost: 120000000000, type: "global", value: 1.45, desc: "All output +45%", requires: ["global3"], unlock: { prestige: 10 } }
  ];

  // Expansion update: 100 additional run upgrades, generated as a balanced progression ladder.
  // They use the same purchase/effect system as the original upgrades and are save-compatible.
  const EXPANSION_BUILDING_TARGETS = ["cursor", "grandma", "farm", "mine", "factory", "bank", "temple", "shipment", "alchemy", "portal"];
  const EXPANSION_UPGRADE_NAMES = [
    "Copper Whisk", "Double-Rack Ovens", "Sugar Circuit", "Precision Crumbs", "Turbo Trays",
    "Polished Rolling Pins", "Infinite Batter", "Molecular Sprinkles", "Cloud Bakery", "Chrono Mixer"
  ];
  for (let i = 0; i < 100; i += 1) {
    const target = EXPANSION_BUILDING_TARGETS[i % EXPANSION_BUILDING_TARGETS.length];
    const kind = i % 3;
    const cost = Math.min(8.5e15, Math.round(12000 * Math.pow(1.29, i)));
    const tier = 7 + Math.floor(i / 5);
    const label = EXPANSION_UPGRADE_NAMES[i % EXPANSION_UPGRADE_NAMES.length];
    let upgrade;
    if (kind === 0) {
      const value = 1.12 + (i % 5) * 0.045;
      upgrade = { id: "exp_click_" + (i + 1), tier, name: label + " " + (i + 1), cost, type: "click", value, desc: "Click output x" + value.toFixed(3), unlock: { runCookies: Math.max(1000, Math.floor(cost * 0.22)) } };
    } else if (kind === 1) {
      const value = 1.04 + (i % 5) * 0.018;
      upgrade = { id: "exp_global_" + (i + 1), tier, name: label + " " + (i + 1), cost, type: "global", value, desc: "All output x" + value.toFixed(3), unlock: { runCookies: Math.max(1000, Math.floor(cost * 0.22)) } };
    } else {
      const value = 1.25 + (i % 5) * 0.15;
      upgrade = { id: "exp_building_" + (i + 1), tier, name: label + " " + (i + 1), cost, type: "building", target, value, desc: target.charAt(0).toUpperCase() + target.slice(1) + " output x" + value.toFixed(2), unlock: { runCookies: Math.max(1000, Math.floor(cost * 0.22)), building: { id: target, count: 1 + Math.floor(i / 18) } } };
    }
    RUN_UPGRADES.push(upgrade);
  }

  const RESEARCH = [
    { id: "research_cookie_theory", name: "Cookie Theory", cost: 2, duration: 45, desc: "Passive output +10%." },
    { id: "research_precision_tools", name: "Precision Tools", cost: 2, duration: 50, desc: "Click output +20%." },
    { id: "research_leech_lab", name: "Leech Lab", cost: 4, duration: 90, desc: "Unlock cookie leeches." },
    { id: "research_market_maker", name: "Market Maker", cost: 5, duration: 100, desc: "Lower market volatility." },
    { id: "research_autobuyer", name: "Autobuyer Core", cost: 5, duration: 120, desc: "Unlock automation toggles." },
    { id: "research_almanac", name: "Season Almanac", cost: 6, duration: 120, desc: "Allow manual season cycling." },
    { id: "research_leech_press", name: "Leech Press", cost: 7, duration: 150, desc: "More leeches and better pop value.", requires: ["research_leech_lab"] },
    { id: "research_quantum_oven", name: "Quantum Oven", cost: 8, duration: 180, desc: "Global output +25%." },
    { id: "research_parallel_thought", name: "Parallel Thought", cost: 10, duration: 220, desc: "Building base output +15%.", requires: ["research_quantum_oven"] },
    { id: "research_omega", name: "Omega Protocol", cost: 14, duration: 300, desc: "Golden cookies are stronger.", requires: ["research_parallel_thought"] }
  ];

  const HEAVENLY = [
    { id: "hv_eternal_oven", name: "Eternal Oven", cost: 5, desc: "Permanent output +20%." },
    { id: "hv_nimble_fingers", name: "Nimble Fingers", cost: 5, desc: "Permanent click +25%." },
    { id: "hv_golden_radar", name: "Golden Radar", cost: 6, desc: "Golden cookies appear faster." },
    { id: "hv_lump_growth", name: "Lump Growth", cost: 6, desc: "Sugar lumps grow faster." },
    { id: "hv_leech_shield", name: "Leech Shield", cost: 7, desc: "Leeches steal less and spawn one extra." },
    { id: "hv_autopilot", name: "Autopilot", cost: 8, desc: "Enable automation permanently." },
    { id: "hv_contract_network", name: "Contract Network", cost: 8, desc: "Contracts grant +1 extra tech point." },
    { id: "hv_transcendent_cost", name: "Transcendent Pricing", cost: 10, desc: "Building prices are 8% cheaper." }
  ];

  const CONTRACTS = [
    { id: "contract_clicks", name: "Click Sprint", desc: "Make 250 clicks this run.", kind: "runClicks", goal: 250, reward: { cookies: 3000, tech: 1 } },
    { id: "contract_bake_10k", name: "Warm Start", desc: "Bake 10K cookies this run.", kind: "runCookies", goal: 10000, reward: { cookies: 5000, tech: 1 } },
    { id: "contract_build_20", name: "Neighborhood", desc: "Own 20 total buildings.", kind: "totalBuildings", goal: 20, reward: { cookies: 12000, tech: 2 } },
    { id: "contract_golden", name: "Lucky Day", desc: "Click 3 golden cookies.", kind: "goldenClicks", goal: 3, reward: { tech: 3, lumps: 1 } },
    { id: "contract_market", name: "Day Trader", desc: "Execute 15 market trades.", kind: "marketTrades", goal: 15, reward: { tech: 2, cookies: 24000 } },
    { id: "contract_leech", name: "Pest Control", desc: "Pop 5 leeches.", kind: "leechPops", goal: 5, reward: { tech: 2, lumps: 1 } },
    { id: "contract_research", name: "Lab Week", desc: "Complete 2 research nodes.", kind: "researchDone", goal: 2, reward: { tech: 3, cookies: 60000 } },
    { id: "contract_cps", name: "Throughput", desc: "Reach 500 CPS.", kind: "cps", goal: 500, reward: { tech: 3, cookies: 80000 } },
    { id: "contract_bake_1m", name: "Factory Shift", desc: "Bake 1M cookies this run.", kind: "runCookies", goal: 1000000, reward: { tech: 4, lumps: 2 } },
    { id: "contract_ascend", name: "Skybound", desc: "Ascend at least once.", kind: "ascensions", goal: 1, reward: { tech: 5, chips: 2 } }
  ];

  const ACHIEVEMENTS = [
    { id: "a_first_click", name: "First Batch", desc: "Click once.", kind: "allTimeClicks", target: 1 },
    { id: "a_100_clicks", name: "Finger Workout", desc: "Click 100 times.", kind: "allTimeClicks", target: 100 },
    { id: "a_10k_clicks", name: "Mechanical Wrist", desc: "Click 10K times.", kind: "allTimeClicks", target: 10000 },
    { id: "a_1k_run", name: "Starter Oven", desc: "Bake 1K in a run.", kind: "runCookies", target: 1000 },
    { id: "a_1m_run", name: "Baker Boss", desc: "Bake 1M in a run.", kind: "runCookies", target: 1000000 },
    { id: "a_1b_all", name: "Cookie Legacy", desc: "Bake 1B all-time.", kind: "allTimeCookies", target: 1000000000 },
    { id: "a_build_1", name: "Property Owner", desc: "Own one building.", kind: "totalBuildings", target: 1 },
    { id: "a_build_100", name: "City Planner", desc: "Own 100 buildings.", kind: "totalBuildings", target: 100 },
    { id: "a_golden_1", name: "Lucky Break", desc: "Click one golden cookie.", kind: "goldenClicks", target: 1 },
    { id: "a_golden_50", name: "Golden Hunter", desc: "Click 50 golden cookies.", kind: "goldenClicks", target: 50 },
    { id: "a_cps_1k", name: "Production Line", desc: "Reach 1K CPS.", kind: "cps", target: 1000 },
    { id: "a_cps_1m", name: "Planetary Oven", desc: "Reach 1M CPS.", kind: "cps", target: 1000000 },
    { id: "a_prestige_1", name: "Second Life", desc: "Reach prestige 1.", kind: "prestigeLevel", target: 1 },
    { id: "a_prestige_25", name: "Immortal Baker", desc: "Reach prestige 25.", kind: "prestigeLevel", target: 25 },
    { id: "a_ascend_10", name: "Sky Ladder", desc: "Ascend 10 times.", kind: "ascensions", target: 10 },
    { id: "a_research_3", name: "Lab Rat", desc: "Complete 3 research nodes.", kind: "researchDoneCount", target: 3 },
    { id: "a_research_all", name: "Think Tank", desc: "Complete all research nodes.", kind: "researchDoneCount", target: RESEARCH.length },
    { id: "a_contract_10", name: "Freelancer", desc: "Complete 10 contracts.", kind: "contractsCompleted", target: 10 },
    { id: "a_contract_50", name: "Enterprise", desc: "Complete 50 contracts.", kind: "contractsCompleted", target: 50 },
    { id: "a_market_50", name: "Market Shark", desc: "Make 50 trades.", kind: "marketTrades", target: 50 },
    { id: "a_lumps_10", name: "Sweet Tooth", desc: "Collect 10 sugar lumps.", kind: "lumpsSpentOrOwned", target: 10 },
    { id: "a_lumps_50", name: "Sugar Baron", desc: "Collect 50 sugar lumps.", kind: "lumpsSpentOrOwned", target: 50 },
    { id: "a_leech_20", name: "Exterminator", desc: "Pop 20 leeches.", kind: "leechPops", target: 20 },
    { id: "a_heavenly_5", name: "Divine Shopper", desc: "Buy 5 heavenly upgrades.", kind: "heavenlyBoughtCount", target: 5 },
    { id: "a_challenge_3", name: "Mode Master", desc: "Win 3 challenge runs.", kind: "challengeWins", target: 3 },
    { id: "a_boss_1", name: "Crumb Slayer", desc: "Defeat 1 boss.", kind: "bossesDefeated", target: 1 },
    { id: "a_boss_20", name: "Boss Breaker", desc: "Defeat 20 bosses.", kind: "bossesDefeated", target: 20 },
    { id: "a_dungeon_5", name: "Cavern Runner", desc: "Clear 5 dungeons.", kind: "dungeonWins", target: 5 },
    { id: "a_relic_2", name: "Relic Smith", desc: "Craft 2 relics.", kind: "craftedRelicsCount", target: 2 },
    { id: "a_skill_6", name: "Skill Architect", desc: "Unlock 6 skills.", kind: "skillsBoughtCount", target: 6 }
  ];

  // Expansion update: 100 additional achievements across ten long-term progression tracks.
  const EXPANSION_ACHIEVEMENT_TRACKS = [
    { kind: "allTimeClicks", name: "Click Cartographer", desc: "total clicks", targets: [250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000] },
    { kind: "runCookies", name: "Fresh Batch", desc: "cookies baked in one run", targets: [5000, 25000, 100000, 500000, 1e6, 5e6, 1e7, 5e7, 1e8, 1e9] },
    { kind: "allTimeCookies", name: "Cookie Empire", desc: "all-time cookies baked", targets: [1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e15] },
    { kind: "totalBuildings", name: "District Developer", desc: "buildings owned at once", targets: [5, 10, 25, 50, 100, 150, 200, 300, 500, 1000] },
    { kind: "goldenClicks", name: "Golden Gourmet", desc: "golden cookies clicked", targets: [2, 5, 10, 20, 35, 50, 75, 100, 250, 500] },
    { kind: "cps", name: "Production Planet", desc: "cookies per second reached", targets: [100, 500, 1000, 10000, 1e5, 1e6, 1e7, 1e8, 1e9, 1e12] },
    { kind: "prestigeLevel", name: "Prestige Pioneer", desc: "prestige level reached", targets: [2, 3, 5, 8, 10, 15, 20, 30, 50, 100] },
    { kind: "ascensions", name: "Ascension Atlas", desc: "ascensions completed", targets: [2, 3, 5, 8, 10, 15, 20, 30, 50, 100] },
    { kind: "contractsCompleted", name: "Contract Commander", desc: "contracts completed", targets: [2, 5, 10, 15, 20, 30, 40, 50, 75, 100] },
    { kind: "marketTrades", name: "Market Mogul", desc: "market trades completed", targets: [2, 5, 10, 20, 35, 50, 75, 100, 250, 500] }
  ];
  for (const track of EXPANSION_ACHIEVEMENT_TRACKS) {
    track.targets.forEach((target, index) => {
      ACHIEVEMENTS.push({
        id: "exp_achievement_" + track.kind + "_" + (index + 1),
        name: track.name + " " + (index + 1),
        desc: "Reach " + target.toLocaleString("en-US") + " " + track.desc + ".",
        kind: track.kind,
        target
      });
    });
  }

  const CHALLENGES = [
    { id: "none", name: "Normal", desc: "No modifiers.", clickMult: 1, cpsMult: 1, noBuildings: false, goldenBadChance: 0.15, chaos: false, goal: 0, reward: null },
    { id: "handmade", name: "Handmade", desc: "Clicks stronger but buildings disabled.", clickMult: 2.6, cpsMult: 0.22, noBuildings: true, goldenBadChance: 0.12, chaos: false, goal: 500000, reward: { tech: 5, chips: 2 } },
    { id: "idleverse", name: "Idleverse", desc: "Clicks weak but passive output boosted.", clickMult: 0.25, cpsMult: 2.2, noBuildings: false, goldenBadChance: 0.2, chaos: false, goal: 1500000, reward: { tech: 7, chips: 3 } },
    { id: "chaos", name: "Chaos Bakery", desc: "Wild fluctuations and harsher golden outcomes.", clickMult: 1, cpsMult: 1, noBuildings: false, goldenBadChance: 0.45, chaos: true, goal: 2500000, reward: { tech: 8, chips: 4 } }
  ];

  const SEASONS = [
    { id: "none", name: "None", cps: 1, click: 1, goldenRate: 1 },
    { id: "harvest", name: "Harvest", cps: 1.15, click: 1, goldenRate: 0.95 },
    { id: "frost", name: "Frost", cps: 0.95, click: 1.15, goldenRate: 0.82 },
    { id: "bloom", name: "Bloom", cps: 1.08, click: 1.05, goldenRate: 0.75 },
    { id: "eclipse", name: "Eclipse", cps: 1.2, click: 0.9, goldenRate: 1.1 }
  ];

  const MARKET_ASSETS = [
    { id: "cocoa", name: "Cocoa", base: 30, vol: 0.05 },
    { id: "butter", name: "Butter", base: 85, vol: 0.055 },
    { id: "vanilla", name: "Vanilla", base: 210, vol: 0.065 },
    { id: "sugar", name: "Sugar", base: 430, vol: 0.075 }
  ];

  const SYNERGIES = [
    { id: "syn_cursor_grandma", name: "Needle and Apron", a: "cursor", b: "grandma", reqA: 25, reqB: 25, mult: 1.08, desc: "Cursors and Grandmas coordinate shifts." },
    { id: "syn_farm_mine", name: "Field Drills", a: "farm", b: "mine", reqA: 20, reqB: 15, mult: 1.1, desc: "Farms feed mines with better ingredient maps." },
    { id: "syn_factory_bank", name: "Industrial Credit", a: "factory", b: "bank", reqA: 15, reqB: 12, mult: 1.12, desc: "Factories receive instant financing." },
    { id: "syn_temple_portal", name: "Ritual Gate", a: "temple", b: "portal", reqA: 10, reqB: 6, mult: 1.16, desc: "Temples stabilize portal output." }
  ];

  const SKILLS = [
    { id: "skill_click_mastery", name: "Click Mastery", cost: 1, desc: "+25% click power.", effects: { click: 1.25 } },
    { id: "skill_bulk_baking", name: "Bulk Baking", cost: 1, desc: "+18% passive output.", effects: { cps: 1.18 } },
    { id: "skill_lucky_hands", name: "Lucky Hands", cost: 2, desc: "Golden cookies appear 12% faster.", requires: ["skill_click_mastery"], effects: { goldenRate: 0.88 } },
    { id: "skill_boss_slayer", name: "Boss Slayer", cost: 2, desc: "+45% boss damage.", requires: ["skill_bulk_baking"], effects: { bossDamage: 1.45 } },
    { id: "skill_arcane_market", name: "Arcane Market", cost: 2, desc: "Market trades grant +1 dust.", requires: ["skill_bulk_baking"], effects: { marketDustFlat: 1 } },
    { id: "skill_time_bend", name: "Time Bend", cost: 3, desc: "Events last 20% longer.", requires: ["skill_lucky_hands"], effects: { eventDuration: 1.2 } },
    { id: "skill_pack_alpha", name: "Pack Alpha", cost: 3, desc: "Pet effects are 30% stronger.", requires: ["skill_boss_slayer"], effects: { petPower: 1.3 } },
    { id: "skill_ascended_oven", name: "Ascended Oven", cost: 4, desc: "Global output +22%.", requires: ["skill_time_bend", "skill_pack_alpha"], effects: { global: 1.22 } }
  ];

  const PETS = [
    { id: "pet_cat", name: "Baker Cat", unlockLumps: 2, feedLumps: 1, desc: "Each level grants +2% click power.", effectsPerLevel: { click: 0.02 } },
    { id: "pet_hound", name: "Oven Hound", unlockLumps: 3, feedLumps: 1, desc: "Each level grants +2.5% passive output.", effectsPerLevel: { cps: 0.025 } },
    { id: "pet_sprite", name: "Sugar Sprite", unlockLumps: 4, feedLumps: 2, desc: "Each level grants +3% boss damage.", effectsPerLevel: { bossDamage: 0.03 } }
  ];

  const DUNGEONS = [
    { id: "cellar", name: "Crumb Cellar", duration: 40, costLumps: 0, reward: { cookiesMult: 180, tech: 1, dust: 8, shards: 2 } },
    { id: "catacomb", name: "Butter Catacomb", duration: 65, costLumps: 1, reward: { cookiesMult: 340, tech: 2, dust: 14, shards: 4 } },
    { id: "rift", name: "Rift Oven", duration: 95, costLumps: 2, reward: { cookiesMult: 520, tech: 3, dust: 22, shards: 7, essence: 1 } }
  ];

  const RECIPES = [
    {
      id: "relic_click_sigil",
      name: "Click Sigil",
      desc: "Permanent +15% click power.",
      cost: { dust: 16, shards: 4, tech: 3 },
      effects: { click: 1.15 }
    },
    {
      id: "relic_oven_core",
      name: "Oven Core",
      desc: "Permanent +14% passive output.",
      cost: { dust: 20, essence: 2, tech: 4 },
      effects: { cps: 1.14 }
    },
    {
      id: "relic_gilded_compass",
      name: "Gilded Compass",
      desc: "Golden cookies stronger and more frequent.",
      cost: { dust: 24, shards: 8, essence: 2, lumps: 2, tech: 6 },
      effects: { goldenPower: 1.2, goldenRate: 0.9 }
    },
    {
      id: "relic_paragon_stamp",
      name: "Paragon Stamp",
      desc: "Global output +10% and boss damage +25%.",
      cost: { dust: 35, shards: 12, essence: 4, lumps: 3, tech: 9 },
      effects: { global: 1.1, bossDamage: 1.25 }
    }
  ];

  const EVENTS = [
    { id: "event_sugar_storm", name: "Sugar Storm", desc: "Sweet winds boost all output.", duration: 55, effects: { cps: 1.3, click: 1.18 } },
    { id: "event_work_surge", name: "Work Surge", desc: "Buildings run hot.", duration: 45, effects: { cps: 1.4 } },
    { id: "event_lucky_hour", name: "Lucky Hour", desc: "Golden cookies spike.", duration: 40, effects: { goldenRate: 0.75, goldenPower: 1.22 } },
    { id: "event_supply_crunch", name: "Supply Crunch", desc: "Ingredient shortage slows output.", duration: 42, effects: { cps: 0.78, click: 0.9 } },
    { id: "event_overheat", name: "Oven Overheat", desc: "Clicks weaken while systems cool.", duration: 35, effects: { click: 0.72 } }
  ];

  const BOSSES = [
    { id: "boss_dough_worm", name: "Dough Worm", hpBase: 60000, hpScale: 1.2, rewardMult: 180 },
    { id: "boss_chip_hydra", name: "Chip Hydra", hpBase: 220000, hpScale: 1.35, rewardMult: 250 },
    { id: "boss_oven_titan", name: "Oven Titan", hpBase: 900000, hpScale: 1.5, rewardMult: 340 }
  ];

  const THEMES = [
    {
      id: "classic",
      name: "Classic",
      unlockAchievements: 0,
      vars: {
        "--bg": "#f1e0bf",
        "--bg-2": "#d6b88a",
        "--panel": "#f8eed8",
        "--panel-2": "#f3e2bf",
        "--edge": "#8f6b38",
        "--edge-soft": "#a98a57",
        "--text": "#3a2813",
        "--text-soft": "#6d4e27",
        "--accent": "#b35f2b",
        "--accent-2": "#4d7d30"
      }
    },
    {
      id: "mint",
      name: "Mint Workshop",
      unlockAchievements: 15,
      vars: {
        "--bg": "#d9efe4",
        "--bg-2": "#9ec7b1",
        "--panel": "#ecfaf2",
        "--panel-2": "#d9efe4",
        "--edge": "#356654",
        "--edge-soft": "#5e8f7b",
        "--text": "#1d3a31",
        "--text-soft": "#2d5a4b",
        "--accent": "#2f8a63",
        "--accent-2": "#5d6b2f"
      }
    },
    {
      id: "ember",
      name: "Ember Forge",
      unlockAchievements: 30,
      vars: {
        "--bg": "#f3d7bd",
        "--bg-2": "#cd8f67",
        "--panel": "#fff0df",
        "--panel-2": "#f2d4ba",
        "--edge": "#7f3e27",
        "--edge-soft": "#a5603f",
        "--text": "#3d1f12",
        "--text-soft": "#704128",
        "--accent": "#c05323",
        "--accent-2": "#5f7a29"
      }
    },
    {
      id: "night",
      name: "Midnight Lab",
      unlockAchievements: 45,
      vars: {
        "--bg": "#d5d8e6",
        "--bg-2": "#8a93b0",
        "--panel": "#eef1fb",
        "--panel-2": "#dce2f5",
        "--edge": "#4a5474",
        "--edge-soft": "#6f7898",
        "--text": "#1f2742",
        "--text-soft": "#3a466f",
        "--accent": "#3f5ea2",
        "--accent-2": "#3e7c5e"
      }
    }
  ];

  const BUILDING_BY_ID = new Map(BUILDINGS.map((item) => [item.id, item]));
  const UPGRADE_BY_ID = new Map(RUN_UPGRADES.map((item) => [item.id, item]));
  const RESEARCH_BY_ID = new Map(RESEARCH.map((item) => [item.id, item]));
  const HEAVENLY_BY_ID = new Map(HEAVENLY.map((item) => [item.id, item]));
  const CONTRACT_BY_ID = new Map(CONTRACTS.map((item) => [item.id, item]));
  const CHALLENGE_BY_ID = new Map(CHALLENGES.map((item) => [item.id, item]));
  const SEASON_BY_ID = new Map(SEASONS.map((item) => [item.id, item]));
  const SKILL_BY_ID = new Map(SKILLS.map((item) => [item.id, item]));
  const PET_BY_ID = new Map(PETS.map((item) => [item.id, item]));
  const DUNGEON_BY_ID = new Map(DUNGEONS.map((item) => [item.id, item]));
  const RECIPE_BY_ID = new Map(RECIPES.map((item) => [item.id, item]));
  const EVENT_BY_ID = new Map(EVENTS.map((item) => [item.id, item]));
  const BOSS_BY_ID = new Map(BOSSES.map((item) => [item.id, item]));
  const THEME_BY_ID = new Map(THEMES.map((item) => [item.id, item]));

  const defaultBuildings = Object.fromEntries(BUILDINGS.map((item) => [item.id, 0]));
  const defaultBuildingMults = Object.fromEntries(BUILDINGS.map((item) => [item.id, 1]));
  const defaultMarketPrices = Object.fromEntries(MARKET_ASSETS.map((item) => [item.id, item.base]));
  const defaultMarketHoldings = Object.fromEntries(MARKET_ASSETS.map((item) => [item.id, 0]));
  const defaultPetLevels = Object.fromEntries(PETS.map((item) => [item.id, 0]));
  const defaultPetUnlocked = Object.fromEntries(PETS.map((item) => [item.id, false]));

  const defaults = {
    cookies: 0,
    runCookies: 0,
    allTimeCookies: 0,
    runClicks: 0,
    allTimeClicks: 0,
    goldenClicks: 0,
    marketTrades: 0,
    leechPops: 0,
    clickMult: 1,
    globalMult: 1,
    buildings: { ...defaultBuildings },
    buildingMults: { ...defaultBuildingMults },
    boughtUpgrades: [],
    researchDone: [],
    researchActive: null,
    techPoints: 0,
    currentContractId: null,
    contractsCompleted: 0,
    contractRerolls: 0,
    dailyClaimDay: "",
    dailyStreak: 0,
    sugarLumps: 0,
    lumpClickBoost: 0,
    lumpCpsBoost: 0,
    lumpsSpent: 0,
    lastLumpAt: Date.now(),
    prestigeLevel: 0,
    heavenlyChips: 0,
    heavenlyBought: [],
    ascensions: 0,
    challenge: "none",
    challengeClaimReady: false,
    challengeWins: {},
    bulkMode: "1",
    season: "none",
    seasonUntil: 0,
    frenzyUntil: 0,
    frenzyMult: 1,
    clickFrenzyUntil: 0,
    clickFrenzyMult: 1,
    chaosSwing: 1,
    chaosUntil: 0,
    leeches: [],
    nextLeechAt: Date.now() + 70000,
    marketPrices: { ...defaultMarketPrices },
    marketHoldings: { ...defaultMarketHoldings },
    auto: { buildings: false, upgrades: false, research: false },
    adminUnlocked: false,
    adminGodMode: false,
    unlockedAchievements: [],
    skillPoints: 0,
    boughtSkills: [],
    petLevels: { ...defaultPetLevels },
    petUnlocked: { ...defaultPetUnlocked },
    bossActive: null,
    bossesDefeated: 0,
    nextBossAt: Date.now() + 180000,
    eventActive: null,
    nextEventAt: Date.now() + 90000,
    dungeonActive: null,
    dungeonPendingReward: null,
    dungeonCooldownUntil: 0,
    dungeonWins: 0,
    arcaneDust: 0,
    bossEssence: 0,
    crystalShards: 0,
    craftedRelics: [],
    leaderboard: [],
    unlockedThemes: ["classic"],
    selectedTheme: "classic",
    audio: { enabled: false, music: false },
    stats: { largestClick: 0, bestCps: 0, bossesDefeated: 0 },
    nextGoldenAt: Date.now() + 32000,
    lastSeen: Date.now()
  };

  const state = loadState();

  const refs = {
    cookieCount: byId("cookieCount"),
    cpsCount: byId("cpsCount"),
    clickCount: byId("clickCount"),
    prestigeCount: byId("prestigeCount"),
    seasonCount: byId("seasonCount"),
    lumpCount: byId("lumpCount"),
    cookieStage: byId("cookieStage"),
    mainCookie: byId("mainCookie"),
    goldenLayer: byId("goldenLayer"),
    helperText: byId("helperText"),
    activeBuffs: byId("activeBuffs"),
    dailyBtn: byId("dailyBtn"),
    exportBtn: byId("exportBtn"),
    importBtn: byId("importBtn"),
    hardResetBtn: byId("hardResetBtn"),
    saveData: byId("saveData"),
    adminStatus: byId("adminStatus"),
    adminCodeInput: byId("adminCodeInput"),
    adminUnlockBtn: byId("adminUnlockBtn"),
    adminCookieAmountInput: byId("adminCookieAmountInput"),
    adminCookiesBtn: byId("adminCookiesBtn"),
    adminLumpsBtn: byId("adminLumpsBtn"),
    adminTechBtn: byId("adminTechBtn"),
    adminUnlockAllBtn: byId("adminUnlockAllBtn"),
    adminGodModeBtn: byId("adminGodModeBtn"),
    newsTicker: byId("newsTicker"),
    sessionMeta: byId("sessionMeta"),
    contractTitle: byId("contractTitle"),
    contractMeta: byId("contractMeta"),
    contractClaimBtn: byId("contractClaimBtn"),
    contractRerollBtn: byId("contractRerollBtn"),
    spellConjureBtn: byId("spellConjureBtn"),
    spellWarpBtn: byId("spellWarpBtn"),
    spellLeechBtn: byId("spellLeechBtn"),
    bossMeta: byId("bossMeta"),
    bossBar: byId("bossBar"),
    bossAttackBtn: byId("bossAttackBtn"),
    bossSummonBtn: byId("bossSummonBtn"),
    eventMeta: byId("eventMeta"),
    eventRerollBtn: byId("eventRerollBtn"),
    skillPointsMeta: byId("skillPointsMeta"),
    skillList: byId("skillList"),
    petMeta: byId("petMeta"),
    petList: byId("petList"),
    researchPoints: byId("researchPoints"),
    researchActiveMeta: byId("researchActiveMeta"),
    researchList: byId("researchList"),
    challengeSelect: byId("challengeSelect"),
    challengeStartBtn: byId("challengeStartBtn"),
    challengeMeta: byId("challengeMeta"),
    challengeClaimBtn: byId("challengeClaimBtn"),
    achievementSummary: byId("achievementSummary"),
    achievementList: byId("achievementList"),
    dungeonMeta: byId("dungeonMeta"),
    dungeonSelect: byId("dungeonSelect"),
    dungeonStartBtn: byId("dungeonStartBtn"),
    dungeonClaimBtn: byId("dungeonClaimBtn"),
    craftMeta: byId("craftMeta"),
    craftList: byId("craftList"),
    leaderboardMeta: byId("leaderboardMeta"),
    leaderboardList: byId("leaderboardList"),
    buyModeGroup: byId("buyModeGroup"),
    buildingList: byId("buildingList"),
    upgradeList: byId("upgradeList"),
    synergyList: byId("synergyList"),
    heavenlyChips: byId("heavenlyChips"),
    heavenlyList: byId("heavenlyList"),
    autoBuilding: byId("autoBuilding"),
    autoUpgrade: byId("autoUpgrade"),
    autoResearch: byId("autoResearch"),
    leechMeta: byId("leechMeta"),
    popLeechesBtn: byId("popLeechesBtn"),
    marketMeta: byId("marketMeta"),
    marketList: byId("marketList"),
    lumpMeta: byId("lumpMeta"),
    lumpSpendClickBtn: byId("lumpSpendClickBtn"),
    lumpSpendCpsBtn: byId("lumpSpendCpsBtn"),
    lumpSpendRerollBtn: byId("lumpSpendRerollBtn"),
    ascensionMeta: byId("ascensionMeta"),
    ascendBtn: byId("ascendBtn"),
    seasonBtn: byId("seasonBtn"),
    themeMeta: byId("themeMeta"),
    themeSelect: byId("themeSelect"),
    themeApplyBtn: byId("themeApplyBtn"),
    audioEnabled: byId("audioEnabled"),
    musicEnabled: byId("musicEnabled"),
    musicTestBtn: byId("musicTestBtn")
  };

  const newsPool = [
    "Dough throughput stable across all districts.",
    "Grandma cooperative requests more ovens.",
    "Orbital flour lanes open for expansion.",
    "Chocolate futures closing at all-time highs.",
    "Engineers report leech containment success.",
    "Your bakery now visible from low orbit."
  ];

  let goldenNode = null;
  let uiTick = 0;
  let saveTick = 0;
  let newsTick = 0;
  let autoTick = 0;
  let marketTick = 0;
  let achievementTick = 0;
  let eventTick = 0;
  let dungeonTick = 0;
  let musicPulseAt = 0;
  let audioContext = null;

  init();

  function init() {
    bindEvents();
    populateChallengeSelect();
    populateDungeonSelect();
    populateThemeSelect();
    ensureContract();
    ensureThemeUnlocks();
    applySelectedTheme();
    applyOfflineProgress();
    renderAll();

    setInterval(gameLoop, TICK_MS);

    window.addEventListener("beforeunload", () => {
      state.lastSeen = Date.now();
      saveState();
    });
  }

  function bindEvents() {
    refs.mainCookie.addEventListener("click", onMainCookieClick);
    refs.dailyBtn.addEventListener("click", claimDailyReward);
    refs.exportBtn.addEventListener("click", exportSave);
    refs.importBtn.addEventListener("click", importSave);
    refs.hardResetBtn.addEventListener("click", hardReset);

    refs.adminUnlockBtn.addEventListener("click", unlockAdminFromCode);
    refs.adminCodeInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        unlockAdminFromCode();
      }
    });
    refs.adminCookieAmountInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        adminGiveCookies();
      }
    });
    refs.adminCookiesBtn.addEventListener("click", adminGiveCookies);
    refs.adminLumpsBtn.addEventListener("click", adminGiveLumps);
    refs.adminTechBtn.addEventListener("click", adminGiveTech);
    refs.adminUnlockAllBtn.addEventListener("click", adminUnlockEverything);
    refs.adminGodModeBtn.addEventListener("click", adminToggleGodMode);

    refs.contractClaimBtn.addEventListener("click", claimContract);
    refs.contractRerollBtn.addEventListener("click", rerollContractWithLump);

    refs.spellConjureBtn.addEventListener("click", castConjureSpell);
    refs.spellWarpBtn.addEventListener("click", castTimeWarpSpell);
    refs.spellLeechBtn.addEventListener("click", popAllLeeches);

    refs.bossAttackBtn.addEventListener("click", bossAttack);
    refs.bossSummonBtn.addEventListener("click", summonBossWithLump);
    refs.eventRerollBtn.addEventListener("click", rerollWorldEvent);

    refs.skillList.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-buy-skill]");
      if (!target) return;
      buySkill(target.dataset.buySkill);
    });

    refs.petList.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-pet-action]");
      if (!target) return;
      const petId = target.dataset.petId;
      const action = target.dataset.petAction;
      if (!petId || !action) return;
      if (action === "unlock") {
        unlockPet(petId);
      } else if (action === "feed") {
        feedPet(petId);
      }
    });

    refs.challengeStartBtn.addEventListener("click", startChallengeFromSelect);
    refs.challengeClaimBtn.addEventListener("click", claimChallengeReward);

    refs.buyModeGroup.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-mode]");
      if (!target) return;
      const mode = target.dataset.mode;
      if (!BULK_OPTIONS.includes(mode)) return;
      state.bulkMode = mode;
      setHelper("Buy mode set to x" + mode + ".");
      renderBuyModes();
      renderBuildings();
      saveState();
    });

    refs.buildingList.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-buy-building]");
      if (!target) return;
      buyBuilding(target.dataset.buyBuilding);
    });

    refs.upgradeList.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-buy-upgrade]");
      if (!target) return;
      buyRunUpgrade(target.dataset.buyUpgrade);
    });

    refs.researchList.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-start-research]");
      if (!target) return;
      startResearch(target.dataset.startResearch);
    });

    refs.heavenlyList.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-buy-heavenly]");
      if (!target) return;
      buyHeavenlyUpgrade(target.dataset.buyHeavenly);
    });

    refs.marketList.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-market-action]");
      if (!target) return;
      const action = target.dataset.marketAction;
      const asset = target.dataset.asset;
      const qty = Number(target.dataset.qty || 1);
      if (!asset || qty <= 0) return;
      if (action === "buy") {
        tradeMarket(asset, qty, true);
      } else if (action === "sell") {
        tradeMarket(asset, qty, false);
      }
    });

    refs.autoBuilding.addEventListener("change", () => {
      state.auto.buildings = refs.autoBuilding.checked;
      saveState();
    });

    refs.autoUpgrade.addEventListener("change", () => {
      state.auto.upgrades = refs.autoUpgrade.checked;
      saveState();
    });

    refs.autoResearch.addEventListener("change", () => {
      state.auto.research = refs.autoResearch.checked;
      saveState();
    });

    refs.popLeechesBtn.addEventListener("click", popAllLeeches);
    refs.lumpSpendClickBtn.addEventListener("click", spendLumpOnClick);
    refs.lumpSpendCpsBtn.addEventListener("click", spendLumpOnCps);
    refs.lumpSpendRerollBtn.addEventListener("click", rerollContractWithThreeLumps);

    refs.dungeonStartBtn.addEventListener("click", startDungeonRun);
    refs.dungeonClaimBtn.addEventListener("click", claimDungeonLoot);
    refs.dungeonSelect.addEventListener("change", renderDungeons);

    refs.craftList.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-craft-id]");
      if (!target) return;
      craftRecipe(target.dataset.craftId);
    });

    refs.themeApplyBtn.addEventListener("click", applyThemeFromSelect);
    refs.themeSelect.addEventListener("change", renderThemePanel);

    refs.audioEnabled.addEventListener("change", () => {
      state.audio.enabled = refs.audioEnabled.checked;
      if (state.audio.enabled) {
        ensureAudioContext();
        playSound(420, 0.07, 0.04, "square");
      } else {
        state.audio.music = false;
      }
      renderAudioPanel();
      saveState();
    });

    refs.musicEnabled.addEventListener("change", () => {
      if (!state.audio.enabled) {
        state.audio.music = false;
        renderAudioPanel();
        saveState();
        return;
      }

      state.audio.music = refs.musicEnabled.checked;
      if (state.audio.music) {
        ensureAudioContext();
        musicPulseAt = 0;
      }
      saveState();
    });

    refs.musicTestBtn.addEventListener("click", () => {
      ensureAudioContext();
      playSound(392, 0.09, 0.05, "triangle", true);
      setTimeout(() => playSound(523, 0.1, 0.05, "triangle", true), 70);
      setTimeout(() => playSound(659, 0.12, 0.05, "triangle", true), 140);
    });

    refs.ascendBtn.addEventListener("click", ascend);
    refs.seasonBtn.addEventListener("click", cycleSeasonManually);

    // Best-effort: prevent browser zoom gestures/shortcuts (not guaranteed in all browsers).
    window.addEventListener("wheel", (event) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    }, { passive: false });

    window.addEventListener("keydown", (event) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = event.key;
      const code = event.code;
      const isZoomKey =
        key === "+" || key === "-" || key === "=" || key === "_" || key === "0" ||
        code === "NumpadAdd" || code === "NumpadSubtract" || code === "Numpad0";
      if (isZoomKey) {
        event.preventDefault();
      }
    });

    const preventZoom = (event) => event.preventDefault();
    window.addEventListener("gesturestart", preventZoom, { passive: false });
    window.addEventListener("gesturechange", preventZoom, { passive: false });
    window.addEventListener("gestureend", preventZoom, { passive: false });

    document.addEventListener("touchmove", (event) => {
      if (event.touches && event.touches.length > 1) {
        event.preventDefault();
      }
    }, { passive: false });
  }

  function gameLoop() {
    const now = Date.now();

    updateBuffTimers(now);
    updateChaosSwing(now);
    updateSeason(now);
    updateWorldEvent(now);
    updateLumpGrowth(now);
    updateResearch(now);
    updateDungeonState(now);
    maybeSpawnBoss(now);
    applyPassiveIncome();
    applyBossPassiveDamage();
    maybeSpawnGoldenCookie(now);
    maybeSpawnLeech(now);
    updateMusicPulse(now);

    marketTick += 1;
    autoTick += 1;
    achievementTick += 1;
    eventTick += 1;
    dungeonTick += 1;
    uiTick += 1;
    saveTick += 1;
    newsTick += 1;

    if (marketTick >= 10) {
      updateMarketPrices();
      marketTick = 0;
    }

    if (autoTick >= 20) {
      runAutomation();
      autoTick = 0;
    }

    updateChallengeState();

    if (eventTick >= 20) {
      maybeAwardEventDust();
      eventTick = 0;
    }

    if (achievementTick >= 10) {
      checkAchievements();
      ensureThemeUnlocks();
      achievementTick = 0;
    }

    if (dungeonTick >= 10) {
      dungeonTick = 0;
    }

    if (uiTick >= 2) {
      renderAll();
      uiTick = 0;
    }

    if (saveTick >= 30) {
      saveState();
      saveTick = 0;
    }

    if (newsTick >= 50) {
      rotateNews();
      newsTick = 0;
    }
  }

  function onMainCookieClick(event) {
    const gain = cookiesPerClick();
    addCookies(gain);
    state.runClicks += 1;
    state.allTimeClicks += 1;
    state.stats.largestClick = Math.max(state.stats.largestClick || 0, gain);

    if (state.bossActive) {
      const chip = Math.max(1, gain * 0.18 * bossDamageMultiplier());
      damageBoss(chip, true);
    }

    playSound(220 + Math.min(500, gain * 5), 0.02, 0.018, "sine");

    const rect = refs.cookieStage.getBoundingClientRect();
    spawnPop("+" + formatCompact(gain), event.clientX - rect.left, event.clientY - rect.top);

    if (state.allTimeClicks === 1) {
      setHelper("First click landed. Dough flow online.");
    }
  }

  function addCookies(amount) {
    if (!Number.isFinite(amount) || amount <= 0) return;
    state.cookies += amount;
    state.runCookies += amount;
    state.allTimeCookies += amount;
  }

  function spendCookies(amount) {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    if (state.cookies < amount) return false;
    state.cookies -= amount;
    return true;
  }

  function applyPassiveIncome() {
    let gain = cookiesPerSecond() / 10;
    if (gain <= 0) return;

    if (state.leeches.length > 0) {
      const drain = Math.min(0.85, leechDrainPerUnit() * state.leeches.length);
      const stolen = gain * drain;
      gain -= stolen;
      const each = stolen / state.leeches.length;
      for (let i = 0; i < state.leeches.length; i += 1) {
        state.leeches[i] += each;
      }
    }

    addCookies(gain);
  }

  function buildingBaseCps() {
    let total = 0;
    for (const building of BUILDINGS) {
      const count = state.buildings[building.id] || 0;
      const mult = state.buildingMults[building.id] || 1;
      total += count * building.cps * mult;
    }

    if (hasResearch("research_parallel_thought")) {
      total *= 1.15;
    }

    return total;
  }

  function globalSharedMultiplier() {
    let mult = state.globalMult;
    mult *= 1 + state.prestigeLevel * 0.02;

    if (hasHeavenly("hv_eternal_oven")) mult *= 1.2;
    if (hasResearch("research_cookie_theory")) mult *= 1.1;
    if (hasResearch("research_quantum_oven")) mult *= 1.25;
    if (state.adminGodMode) mult *= 100;

    mult *= skillEffectMultiplier("global");
    mult *= relicEffectMultiplier("global");
    mult *= synergyGlobalMultiplier();

    if (state.challenge === "chaos") {
      mult *= state.chaosSwing;
    }

    return mult;
  }

  function activeFrenzyMultiplier() {
    return state.frenzyUntil > Date.now() ? state.frenzyMult : 1;
  }

  function activeClickFrenzyMultiplier() {
    return state.clickFrenzyUntil > Date.now() ? state.clickFrenzyMult : 1;
  }

  function challengeConfig() {
    return CHALLENGE_BY_ID.get(state.challenge) || CHALLENGE_BY_ID.get("none");
  }

  function seasonConfig() {
    return SEASON_BY_ID.get(state.season) || SEASON_BY_ID.get("none");
  }

  function eventConfig() {
    if (!state.eventActive || !state.eventActive.id) return null;
    return EVENT_BY_ID.get(state.eventActive.id) || null;
  }

  function eventEffectMultiplier(key) {
    const event = eventConfig();
    if (!event || !event.effects) return 1;
    const value = event.effects[key];
    return Number.isFinite(value) ? Math.max(0.1, value) : 1;
  }

  function skillEffectMultiplier(key) {
    let mult = 1;
    for (const skillId of state.boughtSkills || []) {
      const skill = SKILL_BY_ID.get(skillId);
      if (!skill || !skill.effects || !Number.isFinite(skill.effects[key])) continue;
      mult *= skill.effects[key];
    }
    return mult;
  }

  function skillFlatBonus(key) {
    let total = 0;
    for (const skillId of state.boughtSkills || []) {
      const skill = SKILL_BY_ID.get(skillId);
      if (!skill || !skill.effects || !Number.isFinite(skill.effects[key])) continue;
      total += skill.effects[key];
    }
    return total;
  }

  function relicEffectMultiplier(key) {
    let mult = 1;
    for (const relicId of state.craftedRelics || []) {
      const relic = RECIPE_BY_ID.get(relicId);
      if (!relic || !relic.effects || !Number.isFinite(relic.effects[key])) continue;
      mult *= relic.effects[key];
    }
    return mult;
  }

  function petPowerScalar() {
    return skillEffectMultiplier("petPower");
  }

  function petEffectMultiplier(key) {
    let bonus = 0;
    const scalar = petPowerScalar();
    for (const pet of PETS) {
      if (!(state.petUnlocked && state.petUnlocked[pet.id])) continue;
      const levels = state.petLevels && state.petLevels[pet.id] ? state.petLevels[pet.id] : 0;
      const perLevel = pet.effectsPerLevel && Number(pet.effectsPerLevel[key]);
      if (!Number.isFinite(perLevel) || levels <= 0) continue;
      bonus += perLevel * levels;
    }
    return Math.max(0.1, 1 + bonus * scalar);
  }

  function activeSynergies() {
    return SYNERGIES.filter((synergy) => {
      return (state.buildings[synergy.a] || 0) >= synergy.reqA && (state.buildings[synergy.b] || 0) >= synergy.reqB;
    });
  }

  function synergyGlobalMultiplier() {
    let mult = 1;
    for (const synergy of activeSynergies()) {
      mult *= synergy.mult;
    }
    return mult;
  }

  function bossDamageMultiplier() {
    return skillEffectMultiplier("bossDamage") * relicEffectMultiplier("bossDamage") * petEffectMultiplier("bossDamage");
  }

  function goldenRateMultiplier() {
    return skillEffectMultiplier("goldenRate") * relicEffectMultiplier("goldenRate") * eventEffectMultiplier("goldenRate");
  }

  function goldenPowerMultiplier() {
    return relicEffectMultiplier("goldenPower") * eventEffectMultiplier("goldenPower");
  }

  function cookiesPerSecond() {
    const challenge = challengeConfig();
    const season = seasonConfig();

    let cps = buildingBaseCps();
    cps *= globalSharedMultiplier();
    cps *= activeFrenzyMultiplier();
    cps *= season.cps;
    cps *= challenge.cpsMult;
    cps *= eventEffectMultiplier("cps");
    cps *= petEffectMultiplier("cps");
    cps *= relicEffectMultiplier("cps");
    cps *= 1 + state.lumpCpsBoost * 0.05;

    state.stats.bestCps = Math.max(state.stats.bestCps || 0, cps);
    return Math.max(0, cps);
  }

  function cookiesPerClick() {
    const challenge = challengeConfig();
    const season = seasonConfig();

    let click = 1;
    click *= state.clickMult;
    click *= globalSharedMultiplier();
    click *= activeFrenzyMultiplier();
    click *= activeClickFrenzyMultiplier();
    click *= season.click;
    click *= challenge.clickMult;
    click *= eventEffectMultiplier("click");
    click *= skillEffectMultiplier("click");
    click *= petEffectMultiplier("click");
    click *= relicEffectMultiplier("click");
    click *= 1 + state.lumpClickBoost * 0.05;

    if (hasHeavenly("hv_nimble_fingers")) click *= 1.25;
    if (hasResearch("research_precision_tools")) click *= 1.2;

    return Math.max(0.1, click);
  }

  function updateBuffTimers(now) {
    if (state.frenzyUntil && now >= state.frenzyUntil) {
      state.frenzyUntil = 0;
      state.frenzyMult = 1;
      setHelper("Frenzy expired.");
    }

    if (state.clickFrenzyUntil && now >= state.clickFrenzyUntil) {
      state.clickFrenzyUntil = 0;
      state.clickFrenzyMult = 1;
      setHelper("Click frenzy expired.");
    }
  }

  function updateChaosSwing(now) {
    if (state.challenge !== "chaos") {
      state.chaosSwing = 1;
      state.chaosUntil = 0;
      return;
    }

    if (!state.chaosUntil || now >= state.chaosUntil) {
      state.chaosSwing = randomFloat(0.7, 1.35);
      state.chaosUntil = now + 12000;
    }
  }

  function updateSeason(now) {
    if (!state.seasonUntil || now >= state.seasonUntil) {
      autoCycleSeason(now);
    }
  }

  function autoCycleSeason(now) {
    const next = SEASONS[randomInt(0, SEASONS.length - 1)];
    state.season = next.id;
    state.seasonUntil = now + 4 * 60 * 1000;
  }

  function cycleSeasonManually() {
    if (!hasResearch("research_almanac")) {
      setHelper("Research Season Almanac first.");
      return;
    }

    if (state.sugarLumps < 1) {
      setHelper("Need 1 sugar lump to force a season.");
      return;
    }

    state.sugarLumps -= 1;
    state.lumpsSpent += 1;
    const currentIndex = SEASONS.findIndex((item) => item.id === state.season);
    const next = SEASONS[(currentIndex + 1) % SEASONS.length];
    state.season = next.id;
    state.seasonUntil = Date.now() + 4 * 60 * 1000;
    setHelper("Season shifted to " + next.name + ".");
    saveState();
  }

  function updateLumpGrowth(now) {
    let interval = 6 * 60 * 1000;
    if (hasHeavenly("hv_lump_growth")) {
      interval = Math.floor(interval * 0.82);
    }

    const elapsed = now - state.lastLumpAt;
    if (elapsed < interval) return;

    const gained = Math.floor(elapsed / interval);
    state.sugarLumps += gained;
    state.lastLumpAt += gained * interval;

    if (gained > 0) {
      setHelper("Sugar lump grown: +" + gained + ".");
    }
  }

  function updateWorldEvent(now) {
    if (state.eventActive && now >= state.eventActive.endsAt) {
      const ended = EVENT_BY_ID.get(state.eventActive.id);
      state.eventActive = null;
      state.nextEventAt = now + randomInt(55000, 105000);
      if (ended) {
        setHelper("Event ended: " + ended.name + ".");
      }
    }

    if (!state.eventActive && now >= state.nextEventAt) {
      startWorldEvent(rollRandomEvent().id, now);
    }
  }

  function rollRandomEvent() {
    const pool = EVENTS.slice();
    return pool[randomInt(0, pool.length - 1)];
  }

  function startWorldEvent(eventId, now) {
    const event = EVENT_BY_ID.get(eventId);
    if (!event) return false;

    const durationScale = skillEffectMultiplier("eventDuration");
    state.eventActive = {
      id: event.id,
      endsAt: now + Math.floor(event.duration * 1000 * durationScale)
    };
    state.nextEventAt = state.eventActive.endsAt + randomInt(60000, 120000);
    setHelper("World event started: " + event.name + ".");
    playSound(310, 0.08, 0.04, "triangle", true);
    return true;
  }

  function rerollWorldEvent() {
    if (state.sugarLumps < 2) {
      setHelper("Need 2 sugar lumps to reroll event.");
      return;
    }

    state.sugarLumps -= 2;
    state.lumpsSpent += 2;
    const picked = rollRandomEvent();
    startWorldEvent(picked.id, Date.now());
  }

  function maybeAwardEventDust() {
    if (!state.eventActive) return;
    const event = EVENT_BY_ID.get(state.eventActive.id);
    if (!event) return;
    if (Math.random() < 0.35) {
      state.arcaneDust += 1;
    }
  }

  function bossTemplateByProgress() {
    const weight = state.prestigeLevel + sumArray(Object.values(state.challengeWins || {}));
    if (weight < 20) return BOSSES[0];
    if (weight < 60) return BOSSES[Math.min(1, BOSSES.length - 1)];
    return BOSSES[Math.min(2, BOSSES.length - 1)];
  }

  function spawnBossByTemplate(template, now) {
    const scale = 1 + state.prestigeLevel * 0.06 + state.ascensions * 0.04 + (state.bossesDefeated || 0) * 0.03;
    const hp = Math.max(2000, template.hpBase * Math.pow(template.hpScale, state.bossesDefeated || 0) * scale);
    state.bossActive = {
      id: template.id,
      name: template.name,
      hp,
      maxHp: hp,
      rewardMult: template.rewardMult,
      spawnedAt: now
    };
    setHelper("Boss appeared: " + template.name + ". Break it for rewards.");
    playSound(165, 0.14, 0.06, "sawtooth", true);
  }

  function maybeSpawnBoss(now) {
    if (state.bossActive) return;
    if (now < state.nextBossAt) return;
    spawnBossByTemplate(bossTemplateByProgress(), now);
  }

  function summonBossWithLump() {
    if (state.bossActive) {
      setHelper("A boss is already active.");
      return;
    }

    if (state.sugarLumps < 1) {
      setHelper("Need 1 sugar lump to summon a boss.");
      return;
    }

    state.sugarLumps -= 1;
    state.lumpsSpent += 1;
    spawnBossByTemplate(bossTemplateByProgress(), Date.now());
  }

  function bossAttack() {
    if (!state.bossActive) {
      setHelper("No boss active.");
      return;
    }

    const base = cookiesPerClick() * 7 + totalBuildings() * 0.6;
    const damage = Math.max(1, base * bossDamageMultiplier());
    damageBoss(damage, false);
    playSound(170, 0.045, 0.03, "square", true);
  }

  function applyBossPassiveDamage() {
    if (!state.bossActive) return;
    const passive = cookiesPerSecond() * 0.0045;
    if (passive <= 0) return;
    damageBoss(passive, false, true);
  }

  function damageBoss(amount, fromClick, silent) {
    if (!state.bossActive || !Number.isFinite(amount) || amount <= 0) return;
    state.bossActive.hp -= amount;

    if (fromClick && !silent) {
      const rect = refs.cookieStage.getBoundingClientRect();
      spawnPop("-" + formatCompact(amount), rect.width * 0.5, rect.height * 0.12);
    }

    if (state.bossActive.hp <= 0) {
      const defeated = { ...state.bossActive };
      state.bossActive = null;
      defeatBoss(defeated);
    }
  }

  function defeatBoss(boss) {
    const cookieReward = Math.max(boss.maxHp * 0.2, cookiesPerSecond() * boss.rewardMult);
    const techReward = Math.max(1, Math.floor(state.prestigeLevel / 20) + 1);
    const dustReward = Math.max(4, Math.floor(Math.log10(Math.max(10, boss.maxHp)) * 3));
    const essenceReward = Math.max(1, Math.floor((state.prestigeLevel + 10) / 30));

    addCookies(cookieReward);
    state.techPoints += techReward;
    state.arcaneDust += dustReward;
    state.bossEssence += essenceReward;
    state.bossesDefeated += 1;
    state.stats.bossesDefeated = (state.stats.bossesDefeated || 0) + 1;

    if (Math.random() < 0.22) {
      state.sugarLumps += 1;
    }

    state.nextBossAt = Date.now() + randomInt(120000, 240000);
    playSound(520, 0.12, 0.07, "square", true);
    setHelper(
      "Boss defeated: " + boss.name + " | +" + formatCompact(cookieReward) +
      " cookies, +" + techReward + " tech, +" + dustReward + " dust, +" + essenceReward + " essence."
    );
    pushLeaderboardSnapshot("Boss " + boss.name);
  }

  function populateDungeonSelect() {
    refs.dungeonSelect.innerHTML = DUNGEONS.map((dungeon) => {
      return "<option value=\"" + dungeon.id + "\">" + escapeHtml(dungeon.name) + "</option>";
    }).join("");

    if (!DUNGEON_BY_ID.has(refs.dungeonSelect.value)) {
      refs.dungeonSelect.value = DUNGEONS[0].id;
    }
  }

  function startDungeonRun() {
    if (state.dungeonActive) {
      setHelper("A dungeon run is already active.");
      return;
    }

    if (state.dungeonPendingReward) {
      setHelper("Claim your current dungeon loot first.");
      return;
    }

    const now = Date.now();
    if (state.dungeonCooldownUntil && now < state.dungeonCooldownUntil) {
      setHelper("Dungeon is cooling down.");
      return;
    }

    const dungeon = DUNGEON_BY_ID.get(refs.dungeonSelect.value);
    if (!dungeon) return;

    if (state.sugarLumps < dungeon.costLumps) {
      setHelper("Need " + dungeon.costLumps + " lump(s) for this dungeon.");
      return;
    }

    if (dungeon.costLumps > 0) {
      state.sugarLumps -= dungeon.costLumps;
      state.lumpsSpent += dungeon.costLumps;
    }

    state.dungeonActive = {
      id: dungeon.id,
      startedAt: now,
      endsAt: now + dungeon.duration * 1000
    };
    setHelper("Dungeon run started: " + dungeon.name + ".");
    playSound(260, 0.08, 0.045, "triangle", true);
  }

  function dungeonRewardFor(run) {
    const dungeon = DUNGEON_BY_ID.get(run.id);
    if (!dungeon) return null;

    const cookies = Math.max(150, cookiesPerSecond() * dungeon.reward.cookiesMult, cookiesPerClick() * 250);
    return {
      dungeonId: dungeon.id,
      dungeonName: dungeon.name,
      cookies,
      tech: dungeon.reward.tech,
      dust: dungeon.reward.dust,
      shards: dungeon.reward.shards,
      essence: dungeon.reward.essence || 0
    };
  }

  function updateDungeonState(now) {
    if (!state.dungeonActive) return;
    if (now < state.dungeonActive.endsAt) return;

    const reward = dungeonRewardFor(state.dungeonActive);
    if (reward) {
      state.dungeonPendingReward = reward;
      setHelper("Dungeon complete: " + reward.dungeonName + ". Claim your loot.");
      playSound(430, 0.1, 0.05, "square", true);
    }

    state.dungeonActive = null;
  }

  function claimDungeonLoot() {
    if (!state.dungeonPendingReward) {
      setHelper("No dungeon loot ready.");
      return;
    }

    const reward = state.dungeonPendingReward;
    addCookies(reward.cookies);
    state.techPoints += reward.tech;
    state.arcaneDust += reward.dust;
    state.crystalShards += reward.shards;
    state.bossEssence += reward.essence;
    state.dungeonWins += 1;
    state.dungeonCooldownUntil = Date.now() + randomInt(55000, 90000);
    state.dungeonPendingReward = null;

    setHelper(
      "Dungeon loot claimed: +" + formatCompact(reward.cookies) + " cookies, +" + reward.tech + " tech, +" +
      reward.dust + " dust, +" + reward.shards + " shards."
    );

    pushLeaderboardSnapshot("Dungeon " + reward.dungeonName);
  }

  function skillPrereqsMet(skill) {
    const reqs = skill.requires || [];
    return reqs.every((id) => state.boughtSkills.includes(id));
  }

  function skillStatus(skill) {
    if (state.boughtSkills.includes(skill.id)) return "owned";
    if (!skillPrereqsMet(skill)) return "locked";
    if (state.skillPoints < skill.cost) return "available";
    return "ready";
  }

  function buySkill(skillId) {
    const skill = SKILL_BY_ID.get(skillId);
    if (!skill) return;

    const status = skillStatus(skill);
    if (status === "owned") return;
    if (status === "locked") {
      setHelper("Skill prerequisites not met.");
      return;
    }
    if (status !== "ready") {
      setHelper("Not enough skill points.");
      return;
    }

    state.skillPoints -= skill.cost;
    state.boughtSkills.push(skill.id);
    setHelper("Skill unlocked: " + skill.name + ".");
    renderSkills();
  }

  function unlockPet(petId) {
    const pet = PET_BY_ID.get(petId);
    if (!pet) return;
    if (state.petUnlocked[pet.id]) return;

    if (state.sugarLumps < pet.unlockLumps) {
      setHelper("Need " + pet.unlockLumps + " lumps to unlock " + pet.name + ".");
      return;
    }

    state.sugarLumps -= pet.unlockLumps;
    state.lumpsSpent += pet.unlockLumps;
    state.petUnlocked[pet.id] = true;
    setHelper("Pet unlocked: " + pet.name + ".");
    playSound(350, 0.08, 0.045, "triangle", true);
  }

  function feedPet(petId) {
    const pet = PET_BY_ID.get(petId);
    if (!pet) return;
    if (!state.petUnlocked[pet.id]) return;

    if (state.sugarLumps < pet.feedLumps) {
      setHelper("Need " + pet.feedLumps + " lumps to feed " + pet.name + ".");
      return;
    }

    state.sugarLumps -= pet.feedLumps;
    state.lumpsSpent += pet.feedLumps;
    state.petLevels[pet.id] = (state.petLevels[pet.id] || 0) + 1;
    setHelper(pet.name + " leveled up to " + state.petLevels[pet.id] + ".");
  }

  function hasRelic(id) {
    return state.craftedRelics.includes(id);
  }

  function canCraftRecipe(recipe) {
    if (!recipe || hasRelic(recipe.id)) return false;
    const cost = recipe.cost || {};
    if ((cost.dust || 0) > state.arcaneDust) return false;
    if ((cost.essence || 0) > state.bossEssence) return false;
    if ((cost.shards || 0) > state.crystalShards) return false;
    if ((cost.tech || 0) > state.techPoints) return false;
    if ((cost.lumps || 0) > state.sugarLumps) return false;
    return true;
  }

  function craftRecipe(recipeId) {
    const recipe = RECIPE_BY_ID.get(recipeId);
    if (!recipe) return;

    if (!canCraftRecipe(recipe)) {
      setHelper("Not enough resources to craft " + recipe.name + ".");
      return;
    }

    const cost = recipe.cost || {};
    state.arcaneDust -= cost.dust || 0;
    state.bossEssence -= cost.essence || 0;
    state.crystalShards -= cost.shards || 0;
    state.techPoints -= cost.tech || 0;
    state.sugarLumps -= cost.lumps || 0;
    if (cost.lumps) state.lumpsSpent += cost.lumps;

    state.craftedRelics.push(recipe.id);
    setHelper("Crafted relic: " + recipe.name + ".");
    playSound(610, 0.08, 0.06, "square", true);
  }

  function pushLeaderboardSnapshot(label) {
    const entry = {
      label: label || "Run Snapshot",
      at: Date.now(),
      runCookies: state.runCookies,
      allTimeCookies: state.allTimeCookies,
      prestige: state.prestigeLevel,
      bestCps: state.stats.bestCps || 0,
      bosses: state.bossesDefeated || 0
    };

    if (!Array.isArray(state.leaderboard)) {
      state.leaderboard = [];
    }

    state.leaderboard.push(entry);
    state.leaderboard = state.leaderboard
      .sort((a, b) => (b.runCookies - a.runCookies) || (b.bestCps - a.bestCps) || (b.at - a.at))
      .slice(0, 12);
  }

  function ensureThemeUnlocks() {
    if (!Array.isArray(state.unlockedThemes)) {
      state.unlockedThemes = ["classic"];
    }

    const unlocked = new Set(state.unlockedThemes);
    const achieved = state.unlockedAchievements.length;

    for (const theme of THEMES) {
      if (achieved >= theme.unlockAchievements) {
        unlocked.add(theme.id);
      }
    }

    if (!unlocked.has("classic")) {
      unlocked.add("classic");
    }

    state.unlockedThemes = Array.from(unlocked);

    if (!state.selectedTheme || !unlocked.has(state.selectedTheme)) {
      state.selectedTheme = "classic";
    }
  }

  function populateThemeSelect() {
    ensureThemeUnlocks();
    const previous = refs.themeSelect.value;

    refs.themeSelect.innerHTML = THEMES.map((theme) => {
      const unlocked = state.unlockedThemes.includes(theme.id);
      const label = theme.name + (unlocked ? "" : " (locked)");
      return "<option value=\"" + theme.id + "\" " + (unlocked ? "" : "disabled") + ">" + escapeHtml(label) + "</option>";
    }).join("");

    if (state.unlockedThemes.includes(previous)) {
      refs.themeSelect.value = previous;
    } else if (state.unlockedThemes.includes(state.selectedTheme)) {
      refs.themeSelect.value = state.selectedTheme;
    } else {
      refs.themeSelect.value = "classic";
    }
  }

  function applySelectedTheme() {
    const theme = THEME_BY_ID.get(state.selectedTheme) || THEME_BY_ID.get("classic");
    if (!theme) return;
    for (const [key, value] of Object.entries(theme.vars || {})) {
      document.documentElement.style.setProperty(key, value);
    }
  }

  function applyThemeFromSelect() {
    const themeId = refs.themeSelect.value;
    if (!state.unlockedThemes.includes(themeId)) {
      setHelper("Theme is locked.");
      return;
    }

    state.selectedTheme = themeId;
    applySelectedTheme();
    renderThemePanel();
    setHelper("Theme applied: " + (THEME_BY_ID.get(themeId)?.name || themeId) + ".");
    saveState();
  }

  function ensureAudioContext() {
    if (audioContext) return audioContext;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;

    try {
      audioContext = new Ctx();
      return audioContext;
    } catch (err) {
      return null;
    }
  }

  function playSound(freq, duration, volume, wave, force) {
    const shouldPlay = force ? (state.audio.enabled || state.audio.music) : state.audio.enabled;
    if (!shouldPlay) return;

    const ctx = ensureAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = wave || "sine";
    oscillator.frequency.value = Math.max(40, Math.min(2000, freq || 220));
    gain.gain.value = Math.max(0, Math.min(0.15, volume || 0.03));
    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    oscillator.start(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.02, duration || 0.06));
    oscillator.stop(now + Math.max(0.02, duration || 0.06));
  }

  function updateMusicPulse(now) {
    if (!state.audio.music) return;
    if (now < musicPulseAt) return;

    const base = 120 + (state.season === "eclipse" ? -18 : 0) + (state.eventActive ? 26 : 0);
    playSound(base, 0.22, 0.018, "triangle", true);
    musicPulseAt = now + 700;
  }

  function maybeSpawnGoldenCookie(now) {
    if (goldenNode) return;
    if (now < state.nextGoldenAt) return;

    goldenNode = document.createElement("button");
    goldenNode.className = "golden";
    goldenNode.type = "button";
    goldenNode.setAttribute("aria-label", "Golden cookie");

    const width = refs.cookieStage.clientWidth;
    const height = refs.cookieStage.clientHeight;
    goldenNode.style.left = randomInt(16, Math.max(18, width - 88)) + "px";
    goldenNode.style.top = randomInt(20, Math.max(22, height - 96)) + "px";

    goldenNode.addEventListener("click", () => {
      onGoldenCookieClick();
    });

    refs.goldenLayer.appendChild(goldenNode);

    setTimeout(() => {
      if (goldenNode) {
        despawnGoldenCookie();
      }
    }, 9000);
  }

  function onGoldenCookieClick() {
    state.goldenClicks += 1;

    const challenge = challengeConfig();
    const badChance = challenge.goldenBadChance;
    const roll = Math.random();
    const power = goldenPowerMultiplier();

    playSound(880, 0.08, 0.06, "triangle", true);

    if (roll < badChance) {
      const loss = state.cookies * randomFloat(0.08, 0.18);
      state.cookies = Math.max(0, state.cookies - loss);
      setHelper("Golden backfire: -" + formatCompact(loss) + " cookies.");
    } else if (roll < 0.45) {
      let lucky = Math.max(77, cookiesPerSecond() * 120, cookiesPerClick() * 40);
      if (hasResearch("research_omega")) lucky *= 1.3;
      lucky *= power;
      addCookies(lucky);
      setHelper("Lucky payout: +" + formatCompact(lucky) + " cookies.");
    } else if (roll < 0.72) {
      state.frenzyMult = 7 * power;
      state.frenzyUntil = Date.now() + 30000;
      setHelper("Golden frenzy: x" + trimNumber(state.frenzyMult) + " output for 30s.");
    } else if (roll < 0.92) {
      state.clickFrenzyMult = 25 * power;
      state.clickFrenzyUntil = Date.now() + 15000;
      setHelper("Click frenzy: x" + trimNumber(state.clickFrenzyMult) + " click power for 15s.");
    } else {
      let chain = 0;
      for (let i = 0; i < 6; i += 1) {
        chain += Math.max(13, cookiesPerClick() * (1 + i * 0.35) * power);
      }
      addCookies(chain);
      setHelper("Cookie chain: +" + formatCompact(chain) + " cookies.");
    }

    despawnGoldenCookie();
    checkAchievements();
  }

  function despawnGoldenCookie() {
    if (goldenNode && goldenNode.parentNode) {
      goldenNode.parentNode.removeChild(goldenNode);
    }
    goldenNode = null;
    scheduleNextGolden();
  }

  function scheduleNextGolden() {
    const season = seasonConfig();
    let interval = randomInt(22000, 52000);
    interval *= season.goldenRate;
    interval *= goldenRateMultiplier();

    if (hasHeavenly("hv_golden_radar")) {
      interval *= 0.85;
    }

    if (hasResearch("research_omega")) {
      interval *= 0.9;
    }

    state.nextGoldenAt = Date.now() + Math.max(3500, Math.floor(interval));
  }

  function maxLeeches() {
    let count = 0;
    if (hasResearch("research_leech_lab")) count += 1;
    if (hasResearch("research_leech_press")) count += 1;
    if (hasHeavenly("hv_leech_shield")) count += 1;
    return count;
  }

  function leechDrainPerUnit() {
    let rate = 0.045;
    if (hasHeavenly("hv_leech_shield")) {
      rate = 0.032;
    }
    return rate;
  }

  function maybeSpawnLeech(now) {
    if (maxLeeches() <= 0) {
      state.leeches = [];
      return;
    }

    if (now < state.nextLeechAt) return;

    state.nextLeechAt = now + randomInt(50000, 90000);

    if (state.leeches.length >= maxLeeches()) return;
    if (Math.random() > 0.72) return;

    state.leeches.push(0);
    setHelper("A leech latched on and started siphoning cookies.");
  }

  function popAllLeeches() {
    if (!state.leeches.length) {
      setHelper("No leeches to pop.");
      return;
    }

    const banked = sumArray(state.leeches);
    const bonusMult = hasResearch("research_leech_press") ? 1.35 : 1.15;
    const payout = banked * bonusMult;

    addCookies(payout);
    state.leechPops += state.leeches.length;
    state.leeches = [];

    setHelper("Leeches popped: +" + formatCompact(payout) + " cookies.");
    checkAchievements();
    renderLeeches();
  }

  function updateMarketPrices() {
    for (const asset of MARKET_ASSETS) {
      const current = state.marketPrices[asset.id] || asset.base;
      const challenge = challengeConfig();
      const volMod = hasResearch("research_market_maker") ? 0.72 : 1;
      const chaosVol = challenge.chaos ? 1.5 : 1;
      const delta = randomFloat(-asset.vol, asset.vol) * volMod * chaosVol;
      const next = Math.max(asset.base * 0.15, current * (1 + delta));
      state.marketPrices[asset.id] = next;
    }
  }

  function tradeMarket(assetId, qty, isBuy) {
    const price = state.marketPrices[assetId] || 0;
    if (price <= 0) return;

    const holding = state.marketHoldings[assetId] || 0;
    const total = price * qty;

    if (isBuy) {
      if (state.cookies < total) {
        setHelper("Not enough cookies for that trade.");
        return;
      }
      state.cookies -= total;
      state.marketHoldings[assetId] = holding + qty;
      state.marketTrades += qty;
      setHelper("Bought " + qty + " " + assetId + " shares.");
    } else {
      if (holding < qty) {
        setHelper("Not enough holdings to sell.");
        return;
      }
      state.marketHoldings[assetId] = holding - qty;
      addCookies(total);
      state.marketTrades += qty;
      setHelper("Sold " + qty + " " + assetId + " shares.");
    }

    const dustGain = qty + skillFlatBonus("marketDustFlat") * qty;
    state.arcaneDust += Math.max(0, Math.floor(dustGain));

    checkAchievements();
    renderMarket();
  }

  function rotateNews() {
    const dynamic = [
      "CPS stabilizing at " + formatCompact(cookiesPerSecond()) + ".",
      "Contracts completed: " + state.contractsCompleted + ".",
      "Active leeches: " + state.leeches.length + ".",
      "Market trades executed: " + state.marketTrades + ".",
      "Arcane dust stock: " + state.arcaneDust + ".",
      "Bosses defeated: " + (state.bossesDefeated || 0) + ".",
      "Dungeon clears: " + (state.dungeonWins || 0) + ".",
      "Next ascension would grant +" + ascensionGain() + " prestige."
    ];
    const all = newsPool.concat(dynamic);
    refs.newsTicker.textContent = all[randomInt(0, all.length - 1)];
  }

  function buildingUnitCost(building, ownedCount) {
    const discount = hasHeavenly("hv_transcendent_cost") ? 0.92 : 1;
    return Math.ceil(building.baseCost * Math.pow(1.15, ownedCount) * discount);
  }

  function buildingBulkQuantity(building) {
    if (state.bulkMode !== "max") {
      return Number(state.bulkMode);
    }

    let quantity = 0;
    let total = 0;
    const owned = state.buildings[building.id] || 0;

    for (let i = 0; i < 5000; i += 1) {
      const cost = buildingUnitCost(building, owned + i);
      if (total + cost > state.cookies) break;
      total += cost;
      quantity += 1;
    }

    return Math.max(1, quantity);
  }

  function buildingCostForQuantity(building, quantity) {
    const owned = state.buildings[building.id] || 0;
    let total = 0;
    for (let i = 0; i < quantity; i += 1) {
      total += buildingUnitCost(building, owned + i);
    }
    return total;
  }

  function buyBuilding(buildingId) {
    const building = BUILDING_BY_ID.get(buildingId);
    if (!building) return;

    const challenge = challengeConfig();
    if (challenge.noBuildings) {
      setHelper("Current challenge disables buildings.");
      return;
    }

    const quantity = buildingBulkQuantity(building);
    const cost = buildingCostForQuantity(building, quantity);
    if (!spendCookies(cost)) {
      setHelper("Not enough cookies.");
      return;
    }

    state.buildings[building.id] = (state.buildings[building.id] || 0) + quantity;
    setHelper("Bought " + quantity + "x " + building.name + ".");
    checkAchievements();
    renderBuildings();
  }

  function runUpgradeStatus(upgrade) {
    if (state.boughtUpgrades.includes(upgrade.id)) return "owned";
    if (!runUpgradePrereqsMet(upgrade)) return "locked";
    if (!runUpgradeUnlockMet(upgrade)) return "locked";
    if (state.cookies < upgrade.cost) return "available";
    return "ready";
  }

  function runUpgradePrereqsMet(upgrade) {
    const reqs = upgrade.requires || [];
    return reqs.every((id) => state.boughtUpgrades.includes(id));
  }

  function runUpgradeUnlockMet(upgrade) {
    const unlock = upgrade.unlock || {};
    if (unlock.runCookies && state.runCookies < unlock.runCookies) return false;
    if (unlock.allTimeCookies && state.allTimeCookies < unlock.allTimeCookies) return false;
    if (unlock.prestige && state.prestigeLevel < unlock.prestige) return false;
    if (unlock.research && !state.researchDone.includes(unlock.research)) return false;

    if (unlock.building) {
      const owned = state.buildings[unlock.building.id] || 0;
      if (owned < unlock.building.count) return false;
    }

    return true;
  }

  function buyRunUpgrade(upgradeId) {
    const upgrade = UPGRADE_BY_ID.get(upgradeId);
    if (!upgrade) return;

    const status = runUpgradeStatus(upgrade);
    if (status === "owned") return;
    if (status === "locked") {
      setHelper("Upgrade is still locked.");
      return;
    }

    if (!spendCookies(upgrade.cost)) {
      setHelper("Not enough cookies for that upgrade.");
      return;
    }

    state.boughtUpgrades.push(upgrade.id);

    if (upgrade.type === "click") {
      state.clickMult *= upgrade.value;
    } else if (upgrade.type === "global") {
      state.globalMult *= upgrade.value;
    } else if (upgrade.type === "building") {
      state.buildingMults[upgrade.target] = (state.buildingMults[upgrade.target] || 1) * upgrade.value;
    }

    setHelper("Upgrade purchased: " + upgrade.name + ".");
    checkAchievements();
    renderUpgrades();
    renderBuildings();
  }

  function researchStatus(node) {
    if (state.researchDone.includes(node.id)) return "done";
    if (state.researchActive && state.researchActive.id === node.id) return "active";
    if (!researchPrereqsMet(node)) return "locked";
    if (state.techPoints < node.cost) return "available";
    return "ready";
  }

  function researchPrereqsMet(node) {
    const reqs = node.requires || [];
    return reqs.every((id) => state.researchDone.includes(id));
  }

  function startResearch(researchId) {
    const node = RESEARCH_BY_ID.get(researchId);
    if (!node) return;
    if (state.researchDone.includes(node.id)) return;
    if (state.researchActive) {
      setHelper("Another research project is already active.");
      return;
    }
    if (!researchPrereqsMet(node)) {
      setHelper("Research prerequisites not met.");
      return;
    }
    if (state.techPoints < node.cost) {
      setHelper("Not enough tech points.");
      return;
    }

    state.techPoints -= node.cost;
    state.researchActive = {
      id: node.id,
      endsAt: Date.now() + node.duration * 1000
    };

    setHelper("Research started: " + node.name + ".");
    renderResearch();
  }

  function updateResearch(now) {
    if (!state.researchActive) return;
    if (now < state.researchActive.endsAt) return;

    const node = RESEARCH_BY_ID.get(state.researchActive.id);
    if (node && !state.researchDone.includes(node.id)) {
      state.researchDone.push(node.id);
      setHelper("Research complete: " + node.name + ".");
      checkAchievements();
    }

    state.researchActive = null;
  }

  function heavenlyStatus(upgrade) {
    if (state.heavenlyBought.includes(upgrade.id)) return "owned";
    if (state.heavenlyChips < upgrade.cost) return "available";
    return "ready";
  }

  function buyHeavenlyUpgrade(upgradeId) {
    const upgrade = HEAVENLY_BY_ID.get(upgradeId);
    if (!upgrade) return;
    if (state.heavenlyBought.includes(upgrade.id)) return;
    if (state.heavenlyChips < upgrade.cost) {
      setHelper("Not enough heavenly chips.");
      return;
    }

    state.heavenlyChips -= upgrade.cost;
    state.heavenlyBought.push(upgrade.id);
    setHelper("Heavenly upgrade purchased: " + upgrade.name + ".");
    checkAchievements();
    renderHeavenly();
  }

  function hasResearch(id) {
    return state.researchDone.includes(id);
  }

  function hasHeavenly(id) {
    return state.heavenlyBought.includes(id);
  }

  function ensureContract() {
    if (state.currentContractId && CONTRACT_BY_ID.has(state.currentContractId)) {
      return;
    }

    const fallback = CONTRACTS[randomInt(0, CONTRACTS.length - 1)];
    state.currentContractId = fallback.id;
  }

  function currentContract() {
    return CONTRACT_BY_ID.get(state.currentContractId) || CONTRACTS[0];
  }

  function contractProgress(contract) {
    switch (contract.kind) {
      case "runClicks":
        return state.runClicks;
      case "runCookies":
        return state.runCookies;
      case "totalBuildings":
        return totalBuildings();
      case "goldenClicks":
        return state.goldenClicks;
      case "marketTrades":
        return state.marketTrades;
      case "leechPops":
        return state.leechPops;
      case "researchDone":
        return state.researchDone.length;
      case "cps":
        return cookiesPerSecond();
      case "ascensions":
        return state.ascensions;
      default:
        return 0;
    }
  }

  function isContractComplete(contract) {
    return contractProgress(contract) >= contract.goal;
  }

  function applyReward(reward) {
    if (!reward) return;

    if (reward.cookies) addCookies(reward.cookies);
    if (reward.tech) {
      let tech = reward.tech;
      if (hasHeavenly("hv_contract_network")) tech += 1;
      state.techPoints += tech;
    }
    if (reward.lumps) state.sugarLumps += reward.lumps;
    if (reward.chips) state.heavenlyChips += reward.chips;
    if (reward.dust) state.arcaneDust += reward.dust;
    if (reward.essence) state.bossEssence += reward.essence;
    if (reward.shards) state.crystalShards += reward.shards;
    if (reward.skillPoints) state.skillPoints += reward.skillPoints;
  }

  function claimContract() {
    const contract = currentContract();
    if (!contract) return;

    if (!isContractComplete(contract)) {
      setHelper("Contract goal not reached yet.");
      return;
    }

    applyReward(contract.reward);
    state.contractsCompleted += 1;
    state.currentContractId = pickRandomContractId(contract.id);
    setHelper("Contract complete: " + contract.name + ".");
    checkAchievements();
    renderContracts();
  }

  function pickRandomContractId(excludeId) {
    const pool = CONTRACTS.filter((contract) => contract.id !== excludeId);
    return pool[randomInt(0, pool.length - 1)].id;
  }

  function rerollContractWithLump() {
    if (state.sugarLumps < 1) {
      setHelper("Need 1 sugar lump to reroll.");
      return;
    }
    state.sugarLumps -= 1;
    state.lumpsSpent += 1;
    state.contractRerolls += 1;
    state.currentContractId = pickRandomContractId(state.currentContractId);
    setHelper("Contract rerolled.");
    renderContracts();
  }

  function rerollContractWithThreeLumps() {
    if (state.sugarLumps < 3) {
      setHelper("Need 3 sugar lumps for premium reroll.");
      return;
    }
    state.sugarLumps -= 3;
    state.lumpsSpent += 3;
    state.contractRerolls += 1;
    state.currentContractId = pickRandomContractId(state.currentContractId);
    setHelper("Premium reroll used.");
    renderContracts();
  }

  function claimDailyReward() {
    const today = dayKey(Date.now());
    if (state.dailyClaimDay === today) {
      setHelper("Daily reward already claimed today.");
      return;
    }

    const yesterday = dayKey(Date.now() - 24 * 60 * 60 * 1000);
    if (state.dailyClaimDay === yesterday) {
      state.dailyStreak += 1;
    } else {
      state.dailyStreak = 1;
    }

    state.dailyClaimDay = today;

    const reward = Math.max(700, cookiesPerSecond() * 300 + state.dailyStreak * 250);
    addCookies(reward);
    if (state.dailyStreak >= 3) state.techPoints += 1;
    if (state.dailyStreak % 7 === 0) state.sugarLumps += 1;

    setHelper("Daily reward claimed: +" + formatCompact(reward) + " cookies (streak " + state.dailyStreak + ").");
  }

  function castConjureSpell() {
    if (state.frenzyUntil > Date.now()) {
      setHelper("Conjure is blocked while frenzy is active.");
      return;
    }

    const gain = Math.max(100, cookiesPerSecond() * 45, cookiesPerClick() * 25);
    addCookies(gain);
    state.frenzyMult = 2.5;
    state.frenzyUntil = Date.now() + 12000;
    setHelper("Conjure cast: +" + formatCompact(gain) + " cookies and mini frenzy.");
  }

  function castTimeWarpSpell() {
    const gain = cookiesPerSecond() * 60;
    if (gain <= 0) {
      setHelper("Time Warp needs some passive output first.");
      return;
    }

    addCookies(gain);
    setHelper("Time Warp cast: +60s of passive output.");
  }

  function updateChallengeState() {
    if (state.challenge === "none") {
      state.challengeClaimReady = false;
      return;
    }

    const config = challengeConfig();
    if (config.goal <= 0) {
      state.challengeClaimReady = false;
      return;
    }

    if (!state.challengeClaimReady && state.runCookies >= config.goal) {
      state.challengeClaimReady = true;
      setHelper("Challenge goal reached. Claim your reward.");
    }
  }

  function startChallengeFromSelect() {
    const challengeId = refs.challengeSelect.value;
    if (!CHALLENGE_BY_ID.has(challengeId)) return;

    if (challengeId === "none") {
      state.challenge = "none";
      state.challengeClaimReady = false;
      refs.challengeSelect.value = "none";
      setHelper("Challenge mode disabled.");
      renderChallenges();
      return;
    }

    const chosen = CHALLENGE_BY_ID.get(challengeId);
    const ok = window.confirm(
      "Start challenge '" + chosen.name + "'?\n" +
      "This resets current run progress (buildings/upgrades)."
    );
    if (!ok) return;

    resetRunProgress(false);
    state.challenge = chosen.id;
    state.challengeClaimReady = false;
    refs.challengeSelect.value = chosen.id;
    setHelper("Challenge started: " + chosen.name + ".");
    renderChallenges();
  }

  function claimChallengeReward() {
    if (state.challenge === "none") {
      setHelper("No active challenge.");
      return;
    }

    if (!state.challengeClaimReady) {
      setHelper("Challenge goal not reached yet.");
      return;
    }

    const challenge = challengeConfig();
    if (challenge.reward) {
      applyReward(challenge.reward);
    }

    state.skillPoints += 1;
    state.challengeWins[challenge.id] = (state.challengeWins[challenge.id] || 0) + 1;
    state.challenge = "none";
    state.challengeClaimReady = false;
    refs.challengeSelect.value = "none";
    setHelper("Challenge completed: " + challenge.name + ". +1 skill point.");
    playSound(700, 0.09, 0.05, "triangle", true);
    pushLeaderboardSnapshot("Challenge " + challenge.name);
    checkAchievements();
    renderChallenges();
  }

  function ascensionGain() {
    const total = Math.floor(Math.sqrt(Math.max(0, state.allTimeCookies) / 1000000));
    return Math.max(0, total - state.prestigeLevel);
  }

  function ascend() {
    const gain = ascensionGain();
    if (gain < 1) {
      setHelper("Ascension requires more all-time cookies.");
      return;
    }

    const after = state.prestigeLevel + gain;
    const ok = window.confirm(
      "Ascend for +" + gain + " prestige and +" + gain + " heavenly chips?\n" +
      "Current run progress will reset."
    );
    if (!ok) return;

    pushLeaderboardSnapshot("Ascension");

    state.prestigeLevel = after;
    state.heavenlyChips += gain;
    state.ascensions += 1;
    state.skillPoints += Math.max(1, Math.floor(gain / 2));

    resetRunProgress(true);
    setHelper("Ascended. Prestige is now " + state.prestigeLevel + ". Skill points awarded.");
    checkAchievements();
    renderAll();
  }

  function resetRunProgress(clearChallenge) {
    state.cookies = 0;
    state.runCookies = 0;
    state.runClicks = 0;
    state.clickMult = 1;
    state.globalMult = 1;
    state.buildings = { ...defaultBuildings };
    state.buildingMults = { ...defaultBuildingMults };
    state.boughtUpgrades = [];
    state.leeches = [];
    state.nextLeechAt = Date.now() + 70000;
    state.frenzyUntil = 0;
    state.frenzyMult = 1;
    state.clickFrenzyUntil = 0;
    state.clickFrenzyMult = 1;
    state.bulkMode = "1";
    state.currentContractId = null;
    state.bossActive = null;
    state.nextBossAt = Date.now() + randomInt(90000, 150000);
    state.eventActive = null;
    state.nextEventAt = Date.now() + randomInt(70000, 120000);
    state.dungeonActive = null;
    state.dungeonPendingReward = null;
    state.dungeonCooldownUntil = 0;
    ensureContract();

    if (clearChallenge) {
      state.challenge = "none";
      state.challengeClaimReady = false;
    }

    scheduleNextGolden();
  }

  function hardReset() {
    const ok = window.confirm("Hard reset all progress, including prestige and research?");
    if (!ok) return;

    const clean = deepClone(defaults);
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, clean);

    goldenNode = null;
    refs.goldenLayer.innerHTML = "";

    populateChallengeSelect();
    populateDungeonSelect();
    populateThemeSelect();
    applySelectedTheme();
    setHelper("All progress erased. Fresh run initialized.");
    renderAll();
    saveState();
  }

  function unlockAdminFromCode() {
    const entered = String(refs.adminCodeInput.value || "").trim();
    if (entered !== ADMIN_CODE) {
      setHelper("Invalid admin code.");
      refs.adminCodeInput.value = "";
      return;
    }

    state.adminUnlocked = true;
    refs.adminCodeInput.value = "";
    setHelper("Admin mode unlocked.");
    renderAdmin();
    saveState();
  }

  function adminGuard() {
    if (state.adminUnlocked) return true;
    setHelper("Admin panel is locked.");
    return false;
  }

  function parseAdminCookieAmount(raw) {
    const text = String(raw || "").trim().replace(/,/g, "");
    if (!text) return NaN;

    const match = text.match(/^([0-9]+(?:\.[0-9]+)?)([a-zA-Z]*)$/);
    if (!match) return NaN;

    const value = Number(match[1]);
    if (!Number.isFinite(value) || value <= 0) return NaN;

    const suffix = String(match[2] || "").toLowerCase();
    const multipliers = {
      "": 1,
      k: 1e3,
      m: 1e6,
      b: 1e9,
      t: 1e12,
      qa: 1e15,
      qi: 1e18,
      sx: 1e21,
      sp: 1e24
    };

    if (!Object.prototype.hasOwnProperty.call(multipliers, suffix)) {
      return NaN;
    }

    return value * multipliers[suffix];
  }

  function adminGiveCookies() {
    if (!adminGuard()) return;

    const amount = parseAdminCookieAmount(refs.adminCookieAmountInput.value);
    if (!Number.isFinite(amount) || amount <= 0) {
      setHelper("Enter a valid cookie amount (example: 500000, 2m, 1.5b).");
      return;
    }

    const safeAmount = Math.min(amount, Number.MAX_SAFE_INTEGER);
    addCookies(safeAmount);
    refs.adminCookieAmountInput.value = "";
    setHelper("Admin: +" + formatCompact(safeAmount) + " cookies granted.");
    renderTopStats();
    saveState();
  }

  function adminGiveLumps() {
    if (!adminGuard()) return;
    state.sugarLumps += 100;
    setHelper("Admin: +100 sugar lumps granted.");
    renderLumps();
    renderTopStats();
    saveState();
  }

  function adminGiveTech() {
    if (!adminGuard()) return;
    state.techPoints += 100;
    setHelper("Admin: +100 tech points granted.");
    renderResearch();
    saveState();
  }

  function recalculateRunUpgradeEffectsFromOwned() {
    state.clickMult = 1;
    state.globalMult = 1;
    state.buildingMults = { ...defaultBuildingMults };

    for (const upgradeId of state.boughtUpgrades) {
      const upgrade = UPGRADE_BY_ID.get(upgradeId);
      if (!upgrade) continue;

      if (upgrade.type === "click") {
        state.clickMult *= upgrade.value;
      } else if (upgrade.type === "global") {
        state.globalMult *= upgrade.value;
      } else if (upgrade.type === "building") {
        state.buildingMults[upgrade.target] = (state.buildingMults[upgrade.target] || 1) * upgrade.value;
      }
    }
  }

  function adminUnlockEverything() {
    if (!adminGuard()) return;

    state.boughtUpgrades = RUN_UPGRADES.map((item) => item.id);
    state.researchDone = RESEARCH.map((item) => item.id);
    state.researchActive = null;
    state.heavenlyBought = HEAVENLY.map((item) => item.id);
    state.boughtSkills = SKILLS.map((item) => item.id);
    state.skillPoints += 200;
    state.techPoints += 1000;
    state.heavenlyChips += 1000;
    state.sugarLumps += 250;
    state.arcaneDust += 1000;
    state.bossEssence += 200;
    state.crystalShards += 400;
    state.craftedRelics = RECIPES.map((item) => item.id);
    state.challengeClaimReady = true;

    for (const pet of PETS) {
      state.petUnlocked[pet.id] = true;
      state.petLevels[pet.id] = Math.max(10, state.petLevels[pet.id] || 0);
    }

    state.unlockedThemes = THEMES.map((item) => item.id);
    state.selectedTheme = THEMES[THEMES.length - 1].id;

    recalculateRunUpgradeEffectsFromOwned();
    populateThemeSelect();
    applySelectedTheme();

    setHelper("Admin: everything unlocked.");
    checkAchievements();
    renderAll();
    saveState();
  }

  function adminToggleGodMode() {
    if (!adminGuard()) return;

    state.adminGodMode = !state.adminGodMode;
    setHelper("Admin: God Mode " + (state.adminGodMode ? "enabled" : "disabled") + ".");
    renderAdmin();
    renderTopStats();
    saveState();
  }

  function runAutomation() {
    const unlocked = hasResearch("research_autobuyer") || hasHeavenly("hv_autopilot");
    if (!unlocked) {
      state.auto.buildings = false;
      state.auto.upgrades = false;
      state.auto.research = false;
      return;
    }

    if (state.auto.buildings) {
      autoBuyBuilding();
    }

    if (state.auto.upgrades) {
      autoBuyUpgrade();
    }

    if (state.auto.research) {
      autoStartResearch();
    }
  }

  function autoBuyBuilding() {
    const challenge = challengeConfig();
    if (challenge.noBuildings) return;

    let best = null;
    let bestScore = 0;

    for (const building of BUILDINGS) {
      const cost = buildingCostForQuantity(building, 1);
      if (cost <= 0 || state.cookies < cost) continue;
      const cpsGain = building.cps * (state.buildingMults[building.id] || 1);
      const score = cpsGain / cost;
      if (score > bestScore) {
        bestScore = score;
        best = building;
      }
    }

    if (best) {
      buyBuilding(best.id);
    }
  }

  function autoBuyUpgrade() {
    const candidates = RUN_UPGRADES
      .filter((upgrade) => runUpgradeStatus(upgrade) === "ready")
      .sort((a, b) => a.cost - b.cost);

    if (candidates.length > 0) {
      buyRunUpgrade(candidates[0].id);
    }
  }

  function autoStartResearch() {
    if (state.researchActive) return;

    const candidates = RESEARCH
      .filter((node) => researchStatus(node) === "ready")
      .sort((a, b) => a.cost - b.cost);

    if (candidates.length > 0) {
      startResearch(candidates[0].id);
    }
  }

  function spendLumpOnClick() {
    if (state.sugarLumps < 1) {
      setHelper("Need 1 sugar lump.");
      return;
    }

    state.sugarLumps -= 1;
    state.lumpsSpent += 1;
    state.lumpClickBoost += 1;
    setHelper("Click boost upgraded by +5%.");
    checkAchievements();
    renderLumps();
  }

  function spendLumpOnCps() {
    if (state.sugarLumps < 1) {
      setHelper("Need 1 sugar lump.");
      return;
    }

    state.sugarLumps -= 1;
    state.lumpsSpent += 1;
    state.lumpCpsBoost += 1;
    setHelper("Passive output boost upgraded by +5%.");
    checkAchievements();
    renderLumps();
  }

  function totalBuildings() {
    return BUILDINGS.reduce((sum, building) => sum + (state.buildings[building.id] || 0), 0);
  }

  function checkAchievements() {
    const unlocked = new Set(state.unlockedAchievements);
    const beforeCount = unlocked.size;
    const newly = [];

    for (const achievement of ACHIEVEMENTS) {
      if (unlocked.has(achievement.id)) continue;
      const current = achievementValue(achievement.kind);
      if (current >= achievement.target) {
        unlocked.add(achievement.id);
        newly.push(achievement);
      }
    }

    if (newly.length > 0) {
      state.unlockedAchievements = Array.from(unlocked);
      const tierBefore = Math.floor(beforeCount / 5);
      const tierAfter = Math.floor(state.unlockedAchievements.length / 5);
      if (tierAfter > tierBefore) {
        state.techPoints += tierAfter - tierBefore;
      }

      const skillTierBefore = Math.floor(beforeCount / 10);
      const skillTierAfter = Math.floor(state.unlockedAchievements.length / 10);
      if (skillTierAfter > skillTierBefore) {
        state.skillPoints += skillTierAfter - skillTierBefore;
      }

      ensureThemeUnlocks();
      populateThemeSelect();
      const names = newly.map((item) => item.name).join(", ");
      setHelper("Achievements unlocked: " + names + ".");
    }
  }

  function achievementValue(kind) {
    switch (kind) {
      case "allTimeClicks":
        return state.allTimeClicks;
      case "runCookies":
        return state.runCookies;
      case "allTimeCookies":
        return state.allTimeCookies;
      case "totalBuildings":
        return totalBuildings();
      case "goldenClicks":
        return state.goldenClicks;
      case "cps":
        return cookiesPerSecond();
      case "prestigeLevel":
        return state.prestigeLevel;
      case "ascensions":
        return state.ascensions;
      case "researchDoneCount":
        return state.researchDone.length;
      case "contractsCompleted":
        return state.contractsCompleted;
      case "marketTrades":
        return state.marketTrades;
      case "lumpsSpentOrOwned":
        return state.sugarLumps + state.lumpsSpent;
      case "leechPops":
        return state.leechPops;
      case "heavenlyBoughtCount":
        return state.heavenlyBought.length;
      case "challengeWins":
        return sumArray(Object.values(state.challengeWins || {}));
      case "bossesDefeated":
        return state.bossesDefeated || 0;
      case "dungeonWins":
        return state.dungeonWins || 0;
      case "craftedRelicsCount":
        return (state.craftedRelics || []).length;
      case "skillsBoughtCount":
        return (state.boughtSkills || []).length;
      default:
        return 0;
    }
  }

  function populateChallengeSelect() {
    refs.challengeSelect.innerHTML = CHALLENGES.map((challenge) => {
      return "<option value=\"" + challenge.id + "\">" + escapeHtml(challenge.name) + "</option>";
    }).join("");

    refs.challengeSelect.value = CHALLENGE_BY_ID.has(state.challenge) ? state.challenge : "none";
  }

  function renderAll() {
    renderTopStats();
    renderSession();
    renderBuffs();
    renderDaily();
    renderAdmin();
    renderContracts();
    renderSpells();
    renderBoss();
    renderEvents();
    renderSkills();
    renderPets();
    renderResearch();
    renderChallenges();
    renderAchievements();
    renderDungeons();
    renderCrafting();
    renderLeaderboard();
    renderBuyModes();
    renderBuildings();
    renderUpgrades();
    renderSynergies();
    renderHeavenly();
    renderAutomation();
    renderLeeches();
    renderMarket();
    renderLumps();
    renderAscension();
    renderThemePanel();
    renderAudioPanel();
  }

  function renderTopStats() {
    const season = seasonConfig();
    const seasonLeft = Math.max(0, Math.ceil((state.seasonUntil - Date.now()) / 1000));

    refs.cookieCount.textContent = formatCompact(state.cookies) + " cookies";
    refs.cpsCount.textContent = formatCompact(cookiesPerSecond()) + " per second";
    refs.clickCount.textContent = formatCompact(cookiesPerClick()) + " per click";
    refs.prestigeCount.textContent = "Prestige " + state.prestigeLevel + " | Chips " + state.heavenlyChips;
    refs.seasonCount.textContent = "Season: " + season.name + " (" + seasonLeft + "s)";
    refs.lumpCount.textContent = "Lumps: " + state.sugarLumps;
  }

  function renderSession() {
    refs.sessionMeta.textContent =
      "Run cookies: " + formatCompact(state.runCookies) + "\n" +
      "All-time cookies: " + formatCompact(state.allTimeCookies) + "\n" +
      "Run clicks: " + formatCompact(state.runClicks) + "\n" +
      "Largest click: " + formatCompact(state.stats.largestClick || 0) + "\n" +
      "Best CPS: " + formatCompact(state.stats.bestCps || 0) + "\n" +
      "Bosses defeated: " + (state.bossesDefeated || 0) + " | Dungeons: " + (state.dungeonWins || 0) + "\n" +
      "Research done: " + state.researchDone.length + " / " + RESEARCH.length;
  }

  function renderBuffs() {
    const now = Date.now();
    const buffs = [];

    if (state.frenzyUntil > now) {
      buffs.push("Frenzy x" + trimNumber(state.frenzyMult) + " (" + Math.ceil((state.frenzyUntil - now) / 1000) + "s)");
    }

    if (state.clickFrenzyUntil > now) {
      buffs.push("Click Frenzy x" + trimNumber(state.clickFrenzyMult) + " (" + Math.ceil((state.clickFrenzyUntil - now) / 1000) + "s)");
    }

    if (state.challenge === "chaos") {
      buffs.push("Chaos swing x" + trimNumber(state.chaosSwing));
    }

    const event = eventConfig();
    if (event && state.eventActive) {
      buffs.push(event.name + " (" + Math.max(0, Math.ceil((state.eventActive.endsAt - now) / 1000)) + "s)");
    }

    if (state.bossActive) {
      buffs.push("Boss active: " + state.bossActive.name);
    }

    refs.activeBuffs.textContent = buffs.length ? buffs.join(" | ") : "No active buffs.";
  }

  function renderDaily() {
    const today = dayKey(Date.now());
    const canClaim = state.dailyClaimDay !== today;
    refs.dailyBtn.disabled = !canClaim;
    refs.dailyBtn.textContent = canClaim
      ? "Claim Daily (streak " + state.dailyStreak + ")"
      : "Daily Claimed (streak " + state.dailyStreak + ")";
  }

  function renderAdmin() {
    refs.adminStatus.textContent = state.adminUnlocked
      ? "Unlocked. Admin controls are live."
      : "Locked. Enter admin code.";

    refs.adminCodeInput.disabled = state.adminUnlocked;
    refs.adminUnlockBtn.disabled = state.adminUnlocked;

    const disabled = !state.adminUnlocked;
    refs.adminCookieAmountInput.disabled = disabled;
    refs.adminCookiesBtn.disabled = disabled;
    refs.adminLumpsBtn.disabled = disabled;
    refs.adminTechBtn.disabled = disabled;
    refs.adminUnlockAllBtn.disabled = disabled;
    refs.adminGodModeBtn.disabled = disabled;
    refs.adminGodModeBtn.textContent = "God Mode: " + (state.adminGodMode ? "On" : "Off");
  }

  function renderContracts() {
    const contract = currentContract();
    const progress = contractProgress(contract);

    refs.contractTitle.textContent = contract.name + " - " + contract.desc;
    refs.contractMeta.textContent =
      "Progress: " + formatCompact(progress) + " / " + formatCompact(contract.goal) + "\n" +
      "Reward: " + rewardText(contract.reward) + "\n" +
      "Completed contracts: " + state.contractsCompleted;

    refs.contractClaimBtn.disabled = !isContractComplete(contract);
    refs.contractRerollBtn.disabled = state.sugarLumps < 1;
  }

  function renderSpells() {
    const cps = cookiesPerSecond();
    refs.spellConjureBtn.disabled = cps <= 0;
    refs.spellWarpBtn.disabled = cps <= 0;
    refs.spellLeechBtn.disabled = state.leeches.length === 0;
  }

  function renderBoss() {
    const boss = state.bossActive;
    if (!boss) {
      const left = Math.max(0, Math.ceil((state.nextBossAt - Date.now()) / 1000));
      refs.bossMeta.textContent = "No boss active. Next spawn in ~" + left + "s.";
      refs.bossBar.style.width = "0%";
      refs.bossAttackBtn.disabled = true;
      refs.bossSummonBtn.disabled = state.sugarLumps < 1;
      return;
    }

    const pct = Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100));
    refs.bossBar.style.width = pct + "%";
    refs.bossMeta.textContent =
      boss.name + "\n" +
      "HP: " + formatCompact(boss.hp) + " / " + formatCompact(boss.maxHp) + "\n" +
      "Boss damage multiplier: x" + trimNumber(bossDamageMultiplier());
    refs.bossAttackBtn.disabled = false;
    refs.bossSummonBtn.disabled = true;
  }

  function renderEvents() {
    const active = eventConfig();
    if (!active || !state.eventActive) {
      const left = Math.max(0, Math.ceil((state.nextEventAt - Date.now()) / 1000));
      refs.eventMeta.textContent = "No active event. Next event in ~" + left + "s.";
    } else {
      const remaining = Math.max(0, Math.ceil((state.eventActive.endsAt - Date.now()) / 1000));
      refs.eventMeta.textContent =
        "Active: " + active.name + "\n" +
        active.desc + "\n" +
        "Remaining: " + remaining + "s";
    }

    refs.eventRerollBtn.disabled = state.sugarLumps < 2;
  }

  function renderSkills() {
    refs.skillPointsMeta.textContent = "Skill points: " + state.skillPoints;

    refs.skillList.innerHTML = SKILLS.map((skill) => {
      const status = skillStatus(skill);
      const canBuy = status === "ready";
      const label = status === "owned"
        ? "Owned"
        : "Buy (" + skill.cost + " SP)";
      const reqNames = (skill.requires || []).map((id) => SKILL_BY_ID.get(id)?.name || id).join(", ");
      const reqText = reqNames ? "Prereq: " + reqNames : "No prereq";

      return "<article class=\"item " + (status === "locked" ? "locked" : "") + "\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">" + escapeHtml(skill.name) + "</p>" +
          "<p class=\"item-sub\">" + escapeHtml(skill.desc) + "</p>" +
          "<p class=\"item-meta\">" + escapeHtml(reqText) + "</p>" +
        "</div>" +
        "<button class=\"buy\" data-buy-skill=\"" + skill.id + "\" " + (canBuy ? "" : "disabled") + ">" + label + "</button>" +
      "</article>";
    }).join("");
  }

  function renderPets() {
    let unlockedCount = 0;
    for (const pet of PETS) {
      if (state.petUnlocked[pet.id]) unlockedCount += 1;
    }

    refs.petMeta.textContent =
      "Unlocked: " + unlockedCount + " / " + PETS.length + "\n" +
      "Pet power scalar: x" + trimNumber(petPowerScalar());

    refs.petList.innerHTML = PETS.map((pet) => {
      const unlocked = state.petUnlocked[pet.id];
      const level = state.petLevels[pet.id] || 0;
      const actionLabel = unlocked
        ? "Feed (" + pet.feedLumps + " Lump)"
        : "Unlock (" + pet.unlockLumps + " Lump)";
      const disabled = unlocked ? state.sugarLumps < pet.feedLumps : state.sugarLumps < pet.unlockLumps;
      const action = unlocked ? "feed" : "unlock";

      return "<article class=\"item\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">" + escapeHtml(pet.name) + " " + (unlocked ? "<span class=\"tag\">Lv " + level + "</span>" : "") + "</p>" +
          "<p class=\"item-sub\">" + escapeHtml(pet.desc) + "</p>" +
        "</div>" +
        "<button class=\"buy\" data-pet-id=\"" + pet.id + "\" data-pet-action=\"" + action + "\" " + (disabled ? "disabled" : "") + ">" + actionLabel + "</button>" +
      "</article>";
    }).join("");
  }

  function renderResearch() {
    refs.researchPoints.textContent = "Tech Points: " + state.techPoints;

    if (state.researchActive) {
      const node = RESEARCH_BY_ID.get(state.researchActive.id);
      const remaining = Math.max(0, Math.ceil((state.researchActive.endsAt - Date.now()) / 1000));
      refs.researchActiveMeta.textContent = "Active: " + (node ? node.name : state.researchActive.id) + " (" + remaining + "s)";
    } else {
      refs.researchActiveMeta.textContent = "No active research.";
    }

    refs.researchList.innerHTML = RESEARCH.map((node) => {
      const status = researchStatus(node);
      const canStart = status === "ready";
      const button = status === "done"
        ? "Done"
        : status === "active"
          ? "Running"
          : "Start (" + node.cost + " TP)";

      return "<article class=\"item " + (status === "locked" ? "locked" : "") + "\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">" + escapeHtml(node.name) + "</p>" +
          "<p class=\"item-sub\">" + escapeHtml(node.desc) + "</p>" +
          "<p class=\"item-meta\">Cost " + node.cost + " TP | " + node.duration + "s</p>" +
        "</div>" +
        "<button class=\"buy\" data-start-research=\"" + node.id + "\" " + (canStart ? "" : "disabled") + ">" + button + "</button>" +
      "</article>";
    }).join("");
  }

  function renderChallenges() {
    const active = challengeConfig();
    const goalText = active.goal > 0
      ? formatCompact(state.runCookies) + " / " + formatCompact(active.goal)
      : "No goal";

    refs.challengeMeta.textContent =
      "Active: " + active.name + "\n" +
      active.desc + "\n" +
      "Goal progress: " + goalText + "\n" +
      "Reward: " + (active.reward ? rewardText(active.reward) : "None") + "\n" +
      "Wins: " + (state.challengeWins[active.id] || 0);

    refs.challengeClaimBtn.disabled = !state.challengeClaimReady;
  }

  function renderAchievements() {
    const unlocked = new Set(state.unlockedAchievements);
    refs.achievementSummary.textContent = unlocked.size + " / " + ACHIEVEMENTS.length + " unlocked";

    refs.achievementList.innerHTML = ACHIEVEMENTS.map((achievement) => {
      const isUnlocked = unlocked.has(achievement.id);
      return "<article class=\"item " + (isUnlocked ? "" : "locked") + "\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">" + escapeHtml(achievement.name) + (isUnlocked ? " <span class=\"unlocked-badge\">Unlocked</span>" : "") + "</p>" +
          "<p class=\"item-sub\">" + escapeHtml(achievement.desc) + "</p>" +
        "</div>" +
      "</article>";
    }).join("");
  }

  function renderDungeons() {
    const now = Date.now();
    if (state.dungeonActive) {
      const active = DUNGEON_BY_ID.get(state.dungeonActive.id);
      const left = Math.max(0, Math.ceil((state.dungeonActive.endsAt - now) / 1000));
      refs.dungeonMeta.textContent = "Active: " + (active ? active.name : state.dungeonActive.id) + " | " + left + "s remaining";
    } else if (state.dungeonPendingReward) {
      const loot = state.dungeonPendingReward;
      refs.dungeonMeta.textContent = "Loot ready from " + loot.dungeonName + ": " +
        "+" + formatCompact(loot.cookies) + " cookies, +" + loot.tech + " tech, +" + loot.dust + " dust.";
    } else {
      const coolLeft = Math.max(0, Math.ceil((state.dungeonCooldownUntil - now) / 1000));
      refs.dungeonMeta.textContent =
        "No dungeon run active. " +
        (coolLeft > 0 ? "Cooldown: " + coolLeft + "s." : "Ready to start.");
    }

    const selected = DUNGEON_BY_ID.get(refs.dungeonSelect.value);
    const lockedByCooldown = state.dungeonCooldownUntil > now;
    const lockedByRun = Boolean(state.dungeonActive || state.dungeonPendingReward);
    const lackLumps = selected ? state.sugarLumps < selected.costLumps : false;

    refs.dungeonStartBtn.disabled = lockedByCooldown || lockedByRun || lackLumps;
    refs.dungeonClaimBtn.disabled = !state.dungeonPendingReward;
  }

  function renderCrafting() {
    refs.craftMeta.textContent =
      "Dust: " + state.arcaneDust + " | Essence: " + state.bossEssence + " | Shards: " + state.crystalShards + "\n" +
      "Relics crafted: " + state.craftedRelics.length + " / " + RECIPES.length;

    refs.craftList.innerHTML = RECIPES.map((recipe) => {
      const owned = hasRelic(recipe.id);
      const canCraft = canCraftRecipe(recipe);
      const cost = recipe.cost || {};
      const costParts = [];
      if (cost.dust) costParts.push(cost.dust + " dust");
      if (cost.essence) costParts.push(cost.essence + " essence");
      if (cost.shards) costParts.push(cost.shards + " shards");
      if (cost.tech) costParts.push(cost.tech + " tech");
      if (cost.lumps) costParts.push(cost.lumps + " lumps");

      return "<article class=\"item " + (owned ? "" : (canCraft ? "" : "locked")) + "\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">" + escapeHtml(recipe.name) + (owned ? " <span class=\"unlocked-badge\">Crafted</span>" : "") + "</p>" +
          "<p class=\"item-sub\">" + escapeHtml(recipe.desc) + "</p>" +
          "<p class=\"item-meta\">Cost: " + escapeHtml(costParts.join(", ") || "Free") + "</p>" +
        "</div>" +
        "<button class=\"buy\" data-craft-id=\"" + recipe.id + "\" " + (!owned && canCraft ? "" : "disabled") + ">" + (owned ? "Crafted" : "Craft") + "</button>" +
      "</article>";
    }).join("");
  }

  function renderLeaderboard() {
    const entries = Array.isArray(state.leaderboard) ? state.leaderboard.slice(0, 10) : [];
    refs.leaderboardMeta.textContent = "Top " + entries.length + " snapshots on this browser.";

    if (entries.length === 0) {
      refs.leaderboardList.innerHTML = "<article class=\"item\"><div class=\"item-main\"><p class=\"item-sub\">No snapshots yet. Ascend, defeat bosses, or finish dungeons.</p></div></article>";
      return;
    }

    refs.leaderboardList.innerHTML = entries.map((entry, index) => {
      const date = new Date(entry.at || Date.now());
      return "<article class=\"item\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">#" + (index + 1) + " " + escapeHtml(entry.label || "Snapshot") + "</p>" +
          "<p class=\"item-sub\">Run: " + formatCompact(entry.runCookies || 0) + " | Best CPS: " + formatCompact(entry.bestCps || 0) + "</p>" +
          "<p class=\"item-meta\">" + date.toLocaleString() + " | Prestige " + (entry.prestige || 0) + " | Bosses " + (entry.bosses || 0) + "</p>" +
        "</div>" +
      "</article>";
    }).join("");
  }

  function renderBuyModes() {
    for (const button of refs.buyModeGroup.querySelectorAll("button[data-mode]")) {
      button.classList.toggle("active", button.dataset.mode === state.bulkMode);
    }
  }

  function renderBuildings() {
    const challenge = challengeConfig();

    refs.buildingList.innerHTML = BUILDINGS.map((building) => {
      const quantity = buildingBulkQuantity(building);
      const cost = buildingCostForQuantity(building, quantity);
      const owned = state.buildings[building.id] || 0;
      const disabled = challenge.noBuildings || state.cookies < cost;
      const perBuilding = building.cps * (state.buildingMults[building.id] || 1);

      return "<article class=\"item\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">" + escapeHtml(building.name) + " (x" + owned + ")</p>" +
          "<p class=\"item-sub\">" + escapeHtml(building.desc) + "</p>" +
          "<p class=\"item-meta\">Each: " + trimNumber(perBuilding) + " CPS</p>" +
        "</div>" +
        "<button class=\"buy\" data-buy-building=\"" + building.id + "\" " + (disabled ? "disabled" : "") + ">Buy x" + quantity + "\n" + formatCompact(cost) + "</button>" +
      "</article>";
    }).join("");
  }

  function renderUpgrades() {
    const ordered = RUN_UPGRADES.slice().sort((a, b) => (a.tier - b.tier) || (a.cost - b.cost));

    refs.upgradeList.innerHTML = ordered.map((upgrade) => {
      const status = runUpgradeStatus(upgrade);
      const canBuy = status === "ready";
      const label = status === "owned" ? "Owned" : "Buy\n" + formatCompact(upgrade.cost);
      const req = runUpgradeRequirementText(upgrade);

      return "<article class=\"item " + (status === "locked" ? "locked" : "") + "\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">T" + upgrade.tier + " " + escapeHtml(upgrade.name) + "</p>" +
          "<p class=\"item-sub\">" + escapeHtml(upgrade.desc) + "</p>" +
          "<p class=\"item-meta\">" + escapeHtml(req) + "</p>" +
        "</div>" +
        "<button class=\"buy\" data-buy-upgrade=\"" + upgrade.id + "\" " + (canBuy ? "" : "disabled") + ">" + label + "</button>" +
      "</article>";
    }).join("");
  }

  function runUpgradeRequirementText(upgrade) {
    const pieces = [];
    const unlock = upgrade.unlock || {};

    if (unlock.runCookies) pieces.push("Run " + formatCompact(unlock.runCookies));
    if (unlock.allTimeCookies) pieces.push("All-time " + formatCompact(unlock.allTimeCookies));
    if (unlock.prestige) pieces.push("Prestige " + unlock.prestige);
    if (unlock.research) {
      const node = RESEARCH_BY_ID.get(unlock.research);
      pieces.push("Needs " + (node ? node.name : unlock.research));
    }
    if (unlock.building) {
      const b = BUILDING_BY_ID.get(unlock.building.id);
      pieces.push((b ? b.name : unlock.building.id) + " x" + unlock.building.count);
    }

    if ((upgrade.requires || []).length) {
      const names = upgrade.requires.map((id) => UPGRADE_BY_ID.get(id)?.name || id);
      pieces.push("Prereq: " + names.join(", "));
    }

    return pieces.length ? pieces.join(" | ") : "No requirement";
  }

  function renderSynergies() {
    const activeIds = new Set(activeSynergies().map((item) => item.id));

    refs.synergyList.innerHTML = SYNERGIES.map((synergy) => {
      const aCount = state.buildings[synergy.a] || 0;
      const bCount = state.buildings[synergy.b] || 0;
      const active = activeIds.has(synergy.id);
      const aName = BUILDING_BY_ID.get(synergy.a)?.name || synergy.a;
      const bName = BUILDING_BY_ID.get(synergy.b)?.name || synergy.b;

      return "<article class=\"item " + (active ? "" : "locked") + "\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">" + escapeHtml(synergy.name) + (active ? " <span class=\"unlocked-badge\">Active</span>" : "") + "</p>" +
          "<p class=\"item-sub\">" + escapeHtml(synergy.desc) + "</p>" +
          "<p class=\"item-meta\">" +
            escapeHtml(aName) + " " + aCount + "/" + synergy.reqA + " | " +
            escapeHtml(bName) + " " + bCount + "/" + synergy.reqB +
            " | x" + trimNumber(synergy.mult) +
          "</p>" +
        "</div>" +
      "</article>";
    }).join("");
  }

  function renderHeavenly() {
    refs.heavenlyChips.textContent = "Heavenly Chips: " + state.heavenlyChips;

    refs.heavenlyList.innerHTML = HEAVENLY.map((upgrade) => {
      const status = heavenlyStatus(upgrade);
      const canBuy = status === "ready";
      const label = status === "owned" ? "Owned" : "Buy\n" + upgrade.cost;

      return "<article class=\"item " + (status === "available" ? "locked" : "") + "\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">" + escapeHtml(upgrade.name) + "</p>" +
          "<p class=\"item-sub\">" + escapeHtml(upgrade.desc) + "</p>" +
        "</div>" +
        "<button class=\"buy\" data-buy-heavenly=\"" + upgrade.id + "\" " + (canBuy ? "" : "disabled") + ">" + label + "</button>" +
      "</article>";
    }).join("");
  }

  function renderAutomation() {
    const unlocked = hasResearch("research_autobuyer") || hasHeavenly("hv_autopilot");

    refs.autoBuilding.disabled = !unlocked;
    refs.autoUpgrade.disabled = !unlocked;
    refs.autoResearch.disabled = !unlocked;

    refs.autoBuilding.checked = unlocked && state.auto.buildings;
    refs.autoUpgrade.checked = unlocked && state.auto.upgrades;
    refs.autoResearch.checked = unlocked && state.auto.research;
  }

  function renderLeeches() {
    const banked = sumArray(state.leeches);
    const drainPct = Math.round(leechDrainPerUnit() * state.leeches.length * 1000) / 10;

    refs.leechMeta.textContent =
      "Active leeches: " + state.leeches.length + " / " + maxLeeches() + "\n" +
      "Banked in leeches: " + formatCompact(banked) + " cookies\n" +
      "Current drain: " + trimNumber(drainPct) + "% of passive output";

    refs.popLeechesBtn.disabled = state.leeches.length === 0;
  }

  function renderMarket() {
    refs.marketMeta.textContent =
      "Trade volume: " + state.marketTrades + "\n" +
      "Arcane dust: " + state.arcaneDust + "\n" +
      "Cookies available for trading: " + formatCompact(state.cookies);

    refs.marketList.innerHTML = MARKET_ASSETS.map((asset) => {
      const price = state.marketPrices[asset.id] || asset.base;
      const held = state.marketHoldings[asset.id] || 0;
      const canBuy1 = state.cookies >= price;
      const canBuy10 = state.cookies >= price * 10;
      const canSell1 = held >= 1;
      const canSell10 = held >= 10;

      return "<article class=\"item\">" +
        "<div class=\"item-main\">" +
          "<p class=\"item-title\">" + escapeHtml(asset.name) + "</p>" +
          "<p class=\"item-sub\">Price: " + formatCompact(price) + " | Held: " + held + "</p>" +
        "</div>" +
        "<div class=\"controls controls-left\">" +
          "<button class=\"buy\" data-market-action=\"buy\" data-asset=\"" + asset.id + "\" data-qty=\"1\" " + (canBuy1 ? "" : "disabled") + ">B1</button>" +
          "<button class=\"buy\" data-market-action=\"buy\" data-asset=\"" + asset.id + "\" data-qty=\"10\" " + (canBuy10 ? "" : "disabled") + ">B10</button>" +
          "<button class=\"buy\" data-market-action=\"sell\" data-asset=\"" + asset.id + "\" data-qty=\"1\" " + (canSell1 ? "" : "disabled") + ">S1</button>" +
          "<button class=\"buy\" data-market-action=\"sell\" data-asset=\"" + asset.id + "\" data-qty=\"10\" " + (canSell10 ? "" : "disabled") + ">S10</button>" +
        "</div>" +
      "</article>";
    }).join("");
  }

  function renderLumps() {
    refs.lumpMeta.textContent =
      "Lumps: " + state.sugarLumps + "\n" +
      "Click boost: +" + (state.lumpClickBoost * 5) + "%\n" +
      "CPS boost: +" + (state.lumpCpsBoost * 5) + "%\n" +
      "Lumps spent: " + state.lumpsSpent;

    refs.lumpSpendClickBtn.disabled = state.sugarLumps < 1;
    refs.lumpSpendCpsBtn.disabled = state.sugarLumps < 1;
    refs.lumpSpendRerollBtn.disabled = state.sugarLumps < 3;
  }

  function renderAscension() {
    const gain = ascensionGain();
    refs.ascensionMeta.textContent =
      "Ascensions: " + state.ascensions + "\n" +
      "Current prestige: " + state.prestigeLevel + "\n" +
      "Heavenly chips: " + state.heavenlyChips + "\n" +
      "Skill points: " + state.skillPoints + "\n" +
      "Ascend now for: +" + gain + " prestige/chips";

    refs.ascendBtn.disabled = gain < 1;

    const canCycle = hasResearch("research_almanac") && state.sugarLumps >= 1;
    refs.seasonBtn.disabled = !canCycle;
  }

  function renderThemePanel() {
    ensureThemeUnlocks();

    const selected = THEME_BY_ID.get(state.selectedTheme) || THEME_BY_ID.get("classic");
    refs.themeMeta.textContent =
      "Unlocked themes: " + state.unlockedThemes.length + " / " + THEMES.length + "\n" +
      "Current: " + (selected ? selected.name : "Classic");

    refs.themeApplyBtn.disabled = !state.unlockedThemes.includes(refs.themeSelect.value);
  }

  function renderAudioPanel() {
    refs.audioEnabled.checked = Boolean(state.audio && state.audio.enabled);
    refs.musicEnabled.checked = Boolean(state.audio && state.audio.music);
    refs.musicEnabled.disabled = !refs.audioEnabled.checked;
    refs.musicTestBtn.disabled = !refs.audioEnabled.checked;
  }

  function rewardText(reward) {
    if (!reward) return "None";
    const parts = [];
    if (reward.cookies) parts.push(formatCompact(reward.cookies) + " cookies");
    if (reward.tech) parts.push(reward.tech + " tech");
    if (reward.lumps) parts.push(reward.lumps + " lump" + (reward.lumps > 1 ? "s" : ""));
    if (reward.chips) parts.push(reward.chips + " chips");
    if (reward.dust) parts.push(reward.dust + " dust");
    if (reward.essence) parts.push(reward.essence + " essence");
    if (reward.shards) parts.push(reward.shards + " shards");
    if (reward.skillPoints) parts.push(reward.skillPoints + " skill points");
    return parts.join(", ");
  }

  function setHelper(message) {
    refs.helperText.textContent = message;
  }

  function spawnPop(text, x, y) {
    const node = document.createElement("span");
    node.className = "pop";
    node.textContent = text;
    node.style.left = x + "px";
    node.style.top = y + "px";
    refs.cookieStage.appendChild(node);
    setTimeout(() => {
      if (node.parentNode) node.parentNode.removeChild(node);
    }, 900);
  }

  function exportSave() {
    try {
      const encoded = encodeSave(state);
      refs.saveData.value = encoded;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(encoded).catch(() => {});
      }
      setHelper("Save exported.");
    } catch (err) {
      setHelper("Failed to export save.");
    }
  }

  function importSave() {
    const raw = (refs.saveData.value || "").trim() || window.prompt("Paste save string:", "");
    if (!raw) return;

    try {
      const parsed = decodeSave(raw);
      const normalized = normalizeState(parsed);
      Object.keys(state).forEach((key) => delete state[key]);
      Object.assign(state, normalized);

      refs.goldenLayer.innerHTML = "";
      goldenNode = null;

      populateChallengeSelect();
      populateDungeonSelect();
      populateThemeSelect();
      ensureContract();
      ensureThemeUnlocks();
      applySelectedTheme();
      renderAll();
      saveState();
      setHelper("Save imported successfully.");
    } catch (err) {
      setHelper("Import failed. Invalid save data.");
    }
  }

  function applyOfflineProgress() {
    const now = Date.now();
    const secondsAway = Math.max(0, Math.min((now - (state.lastSeen || now)) / 1000, 8 * 60 * 60));
    if (secondsAway < 1) {
      scheduleNextGolden();
      return;
    }

    const previousFrenzy = state.frenzyUntil > now;
    if (previousFrenzy) {
      state.frenzyUntil = 0;
      state.frenzyMult = 1;
    }
    if (state.clickFrenzyUntil > now) {
      state.clickFrenzyUntil = 0;
      state.clickFrenzyMult = 1;
    }

    const estimate = buildingBaseCps() * globalSharedMultiplier() * seasonConfig().cps * challengeConfig().cpsMult * eventEffectMultiplier("cps") * petEffectMultiplier("cps") * relicEffectMultiplier("cps") * (1 + state.lumpCpsBoost * 0.05);
    const gain = estimate * secondsAway;

    if (gain > 0) {
      addCookies(gain);
      setHelper("Welcome back. Offline gain: " + formatCompact(gain) + " cookies.");
    }

    scheduleNextGolden();
  }

  function saveState() {
    state.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  function loadState() {
    try {
      const current = localStorage.getItem(SAVE_KEY);
      if (current) {
        return normalizeState(JSON.parse(current));
      }
    } catch (err) {
      // Ignore malformed save and continue to migration.
    }

    const migrated = migrateLegacyState();
    if (migrated) {
      const normalized = normalizeState(migrated);
      localStorage.setItem(SAVE_KEY, JSON.stringify(normalized));
      return normalized;
    }

    return normalizeState({});
  }

  function migrateLegacyState() {
    try {
      const v1Raw = localStorage.getItem(LEGACY_KEY_V1);
      if (v1Raw) {
        const old = JSON.parse(v1Raw);
        return {
          cookies: old.cookies || 0,
          runCookies: old.lifetimeCookies || 0,
          allTimeCookies: old.allTimeCookies || old.lifetimeCookies || 0,
          runClicks: old.totalClicks || 0,
          allTimeClicks: old.allTimeClicks || old.totalClicks || 0,
          goldenClicks: old.goldenClicks || 0,
          clickMult: old.clickMult || 1,
          globalMult: old.globalMult || 1,
          buildings: old.buildings || {},
          buildingMults: old.buildingMults || {},
          boughtUpgrades: old.boughtUpgrades || [],
          unlockedAchievements: old.unlockedAchievements || [],
          bulkMode: old.bulkBuy ? String(old.bulkBuy) : "1",
          prestigeLevel: old.prestigeLevel || 0,
          heavenlyChips: old.prestigeLevel || 0,
          ascensions: old.ascensions || 0,
          season: "none",
          seasonUntil: Date.now() + 4 * 60 * 1000,
          nextGoldenAt: Date.now() + 25000,
          lastSeen: old.lastSeen || Date.now()
        };
      }

      const v0Raw = localStorage.getItem(LEGACY_KEY_V0);
      if (v0Raw) {
        const old = JSON.parse(v0Raw);
        if (typeof old.nectar !== "number") return null;
        return {
          cookies: old.nectar || 0,
          runCookies: old.lifetime || old.nectar || 0,
          allTimeCookies: old.lifetime || old.nectar || 0,
          runClicks: 0,
          allTimeClicks: 0,
          clickMult: Math.max(1, (old.clickPower || 1) * 0.5),
          globalMult: old.multiplier || 1,
          buildings: {
            cursor: Math.floor(old.fingerLevel || 0),
            grandma: Math.floor(old.dripLevel || 0)
          },
          prestigeLevel: 0,
          heavenlyChips: 0,
          season: "none",
          seasonUntil: Date.now() + 4 * 60 * 1000,
          nextGoldenAt: Date.now() + 25000,
          lastSeen: Date.now()
        };
      }
    } catch (err) {
      return null;
    }

    return null;
  }

  function normalizeState(source) {
    const merged = {
      ...deepClone(defaults),
      ...(source || {})
    };

    merged.cookies = clampNumber(merged.cookies, 0, Number.MAX_SAFE_INTEGER);
    merged.runCookies = clampNumber(merged.runCookies, 0, Number.MAX_SAFE_INTEGER);
    merged.allTimeCookies = clampNumber(merged.allTimeCookies, merged.runCookies, Number.MAX_SAFE_INTEGER);

    merged.runClicks = Math.floor(clampNumber(merged.runClicks, 0, Number.MAX_SAFE_INTEGER));
    merged.allTimeClicks = Math.floor(clampNumber(merged.allTimeClicks || merged.runClicks, 0, Number.MAX_SAFE_INTEGER));
    merged.goldenClicks = Math.floor(clampNumber(merged.goldenClicks, 0, Number.MAX_SAFE_INTEGER));
    merged.marketTrades = Math.floor(clampNumber(merged.marketTrades, 0, Number.MAX_SAFE_INTEGER));
    merged.leechPops = Math.floor(clampNumber(merged.leechPops, 0, Number.MAX_SAFE_INTEGER));
    merged.skillPoints = Math.floor(clampNumber(merged.skillPoints, 0, Number.MAX_SAFE_INTEGER));

    merged.clickMult = clampNumber(merged.clickMult, 1, Number.MAX_SAFE_INTEGER);
    merged.globalMult = clampNumber(merged.globalMult, 1, Number.MAX_SAFE_INTEGER);

    merged.techPoints = Math.floor(clampNumber(merged.techPoints, 0, Number.MAX_SAFE_INTEGER));
    merged.sugarLumps = Math.floor(clampNumber(merged.sugarLumps, 0, Number.MAX_SAFE_INTEGER));
    merged.lumpClickBoost = Math.floor(clampNumber(merged.lumpClickBoost, 0, Number.MAX_SAFE_INTEGER));
    merged.lumpCpsBoost = Math.floor(clampNumber(merged.lumpCpsBoost, 0, Number.MAX_SAFE_INTEGER));
    merged.lumpsSpent = Math.floor(clampNumber(merged.lumpsSpent, 0, Number.MAX_SAFE_INTEGER));

    merged.prestigeLevel = Math.floor(clampNumber(merged.prestigeLevel, 0, Number.MAX_SAFE_INTEGER));
    merged.heavenlyChips = Math.floor(clampNumber(merged.heavenlyChips, 0, Number.MAX_SAFE_INTEGER));
    merged.ascensions = Math.floor(clampNumber(merged.ascensions, 0, Number.MAX_SAFE_INTEGER));
    merged.bossesDefeated = Math.floor(clampNumber(merged.bossesDefeated, 0, Number.MAX_SAFE_INTEGER));
    merged.dungeonWins = Math.floor(clampNumber(merged.dungeonWins, 0, Number.MAX_SAFE_INTEGER));
    merged.arcaneDust = Math.floor(clampNumber(merged.arcaneDust, 0, Number.MAX_SAFE_INTEGER));
    merged.bossEssence = Math.floor(clampNumber(merged.bossEssence, 0, Number.MAX_SAFE_INTEGER));
    merged.crystalShards = Math.floor(clampNumber(merged.crystalShards, 0, Number.MAX_SAFE_INTEGER));

    merged.bulkMode = BULK_OPTIONS.includes(merged.bulkMode) ? merged.bulkMode : "1";
    merged.adminUnlocked = Boolean(merged.adminUnlocked);
    merged.adminGodMode = Boolean(merged.adminGodMode && merged.adminUnlocked);
    merged.challenge = CHALLENGE_BY_ID.has(merged.challenge) ? merged.challenge : "none";
    merged.season = SEASON_BY_ID.has(merged.season) ? merged.season : "none";

    merged.seasonUntil = Math.floor(clampNumber(merged.seasonUntil, 0, Number.MAX_SAFE_INTEGER));
    merged.frenzyUntil = Math.floor(clampNumber(merged.frenzyUntil, 0, Number.MAX_SAFE_INTEGER));
    merged.clickFrenzyUntil = Math.floor(clampNumber(merged.clickFrenzyUntil, 0, Number.MAX_SAFE_INTEGER));
    merged.frenzyMult = clampNumber(merged.frenzyMult, 1, Number.MAX_SAFE_INTEGER);
    merged.clickFrenzyMult = clampNumber(merged.clickFrenzyMult, 1, Number.MAX_SAFE_INTEGER);

    merged.chaosSwing = clampNumber(merged.chaosSwing, 0.2, 3);
    merged.chaosUntil = Math.floor(clampNumber(merged.chaosUntil, 0, Number.MAX_SAFE_INTEGER));

    merged.nextGoldenAt = Math.floor(clampNumber(merged.nextGoldenAt, 0, Number.MAX_SAFE_INTEGER));
    merged.nextLeechAt = Math.floor(clampNumber(merged.nextLeechAt, 0, Number.MAX_SAFE_INTEGER));
    merged.nextBossAt = Math.floor(clampNumber(merged.nextBossAt, 0, Number.MAX_SAFE_INTEGER));
    merged.nextEventAt = Math.floor(clampNumber(merged.nextEventAt, 0, Number.MAX_SAFE_INTEGER));
    merged.dungeonCooldownUntil = Math.floor(clampNumber(merged.dungeonCooldownUntil, 0, Number.MAX_SAFE_INTEGER));
    merged.lastSeen = Math.floor(clampNumber(merged.lastSeen, 0, Date.now()));
    merged.lastLumpAt = Math.floor(clampNumber(merged.lastLumpAt, 0, Date.now()));

    merged.buildings = { ...defaultBuildings, ...(source && source.buildings ? source.buildings : {}) };
    merged.buildingMults = { ...defaultBuildingMults, ...(source && source.buildingMults ? source.buildingMults : {}) };

    for (const building of BUILDINGS) {
      merged.buildings[building.id] = Math.floor(clampNumber(merged.buildings[building.id], 0, Number.MAX_SAFE_INTEGER));
      merged.buildingMults[building.id] = clampNumber(merged.buildingMults[building.id], 1, Number.MAX_SAFE_INTEGER);
    }

    merged.marketPrices = { ...defaultMarketPrices, ...(source && source.marketPrices ? source.marketPrices : {}) };
    merged.marketHoldings = { ...defaultMarketHoldings, ...(source && source.marketHoldings ? source.marketHoldings : {}) };

    for (const asset of MARKET_ASSETS) {
      merged.marketPrices[asset.id] = clampNumber(merged.marketPrices[asset.id], asset.base * 0.1, Number.MAX_SAFE_INTEGER);
      merged.marketHoldings[asset.id] = Math.floor(clampNumber(merged.marketHoldings[asset.id], 0, Number.MAX_SAFE_INTEGER));
    }

    merged.boughtUpgrades = Array.isArray(merged.boughtUpgrades)
      ? Array.from(new Set(merged.boughtUpgrades.filter((id) => typeof id === "string" && UPGRADE_BY_ID.has(id))))
      : [];

    merged.researchDone = Array.isArray(merged.researchDone)
      ? Array.from(new Set(merged.researchDone.filter((id) => typeof id === "string" && RESEARCH_BY_ID.has(id))))
      : [];

    if (merged.researchActive && (!merged.researchActive.id || !RESEARCH_BY_ID.has(merged.researchActive.id))) {
      merged.researchActive = null;
    }

    merged.heavenlyBought = Array.isArray(merged.heavenlyBought)
      ? Array.from(new Set(merged.heavenlyBought.filter((id) => typeof id === "string" && HEAVENLY_BY_ID.has(id))))
      : [];

    merged.unlockedAchievements = Array.isArray(merged.unlockedAchievements)
      ? Array.from(new Set(merged.unlockedAchievements.filter((id) => typeof id === "string" && ACHIEVEMENTS.some((a) => a.id === id))))
      : [];

    merged.boughtSkills = Array.isArray(merged.boughtSkills)
      ? Array.from(new Set(merged.boughtSkills.filter((id) => typeof id === "string" && SKILL_BY_ID.has(id))))
      : [];

    merged.craftedRelics = Array.isArray(merged.craftedRelics)
      ? Array.from(new Set(merged.craftedRelics.filter((id) => typeof id === "string" && RECIPE_BY_ID.has(id))))
      : [];

    merged.unlockedThemes = Array.isArray(merged.unlockedThemes)
      ? Array.from(new Set(merged.unlockedThemes.filter((id) => typeof id === "string" && THEME_BY_ID.has(id))))
      : ["classic"];

    if (!merged.unlockedThemes.includes("classic")) {
      merged.unlockedThemes.push("classic");
    }

    merged.selectedTheme = THEME_BY_ID.has(merged.selectedTheme) ? merged.selectedTheme : "classic";
    if (!merged.unlockedThemes.includes(merged.selectedTheme)) {
      merged.selectedTheme = "classic";
    }

    merged.petLevels = { ...defaultPetLevels, ...(source && source.petLevels ? source.petLevels : {}) };
    merged.petUnlocked = { ...defaultPetUnlocked, ...(source && source.petUnlocked ? source.petUnlocked : {}) };
    for (const pet of PETS) {
      merged.petLevels[pet.id] = Math.floor(clampNumber(merged.petLevels[pet.id], 0, Number.MAX_SAFE_INTEGER));
      merged.petUnlocked[pet.id] = Boolean(merged.petUnlocked[pet.id]);
    }

    if (!merged.bossActive || !BOSS_BY_ID.has(merged.bossActive.id)) {
      merged.bossActive = null;
    } else {
      merged.bossActive = {
        ...merged.bossActive,
        hp: clampNumber(merged.bossActive.hp, 0, Number.MAX_SAFE_INTEGER),
        maxHp: clampNumber(merged.bossActive.maxHp, 1, Number.MAX_SAFE_INTEGER),
        rewardMult: clampNumber(merged.bossActive.rewardMult, 1, Number.MAX_SAFE_INTEGER)
      };
      if (merged.bossActive.hp <= 0) {
        merged.bossActive = null;
      }
    }

    if (!merged.eventActive || !EVENT_BY_ID.has(merged.eventActive.id)) {
      merged.eventActive = null;
    } else {
      merged.eventActive = {
        id: merged.eventActive.id,
        endsAt: Math.floor(clampNumber(merged.eventActive.endsAt, 0, Number.MAX_SAFE_INTEGER))
      };
    }

    if (!merged.dungeonActive || !DUNGEON_BY_ID.has(merged.dungeonActive.id)) {
      merged.dungeonActive = null;
    } else {
      merged.dungeonActive = {
        id: merged.dungeonActive.id,
        startedAt: Math.floor(clampNumber(merged.dungeonActive.startedAt, 0, Number.MAX_SAFE_INTEGER)),
        endsAt: Math.floor(clampNumber(merged.dungeonActive.endsAt, 0, Number.MAX_SAFE_INTEGER))
      };
    }

    if (!merged.dungeonPendingReward || !DUNGEON_BY_ID.has(merged.dungeonPendingReward.dungeonId)) {
      merged.dungeonPendingReward = null;
    }

    merged.leaderboard = Array.isArray(merged.leaderboard)
      ? merged.leaderboard
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          label: String(entry.label || "Snapshot"),
          at: Math.floor(clampNumber(entry.at, 0, Number.MAX_SAFE_INTEGER)),
          runCookies: clampNumber(entry.runCookies, 0, Number.MAX_SAFE_INTEGER),
          allTimeCookies: clampNumber(entry.allTimeCookies, 0, Number.MAX_SAFE_INTEGER),
          prestige: Math.floor(clampNumber(entry.prestige, 0, Number.MAX_SAFE_INTEGER)),
          bestCps: clampNumber(entry.bestCps, 0, Number.MAX_SAFE_INTEGER),
          bosses: Math.floor(clampNumber(entry.bosses, 0, Number.MAX_SAFE_INTEGER))
        }))
        .sort((a, b) => (b.runCookies - a.runCookies) || (b.bestCps - a.bestCps) || (b.at - a.at))
        .slice(0, 20)
      : [];

    merged.leeches = Array.isArray(merged.leeches)
      ? merged.leeches.map((value) => clampNumber(value, 0, Number.MAX_SAFE_INTEGER))
      : [];

    merged.auto = {
      buildings: Boolean(merged.auto && merged.auto.buildings),
      upgrades: Boolean(merged.auto && merged.auto.upgrades),
      research: Boolean(merged.auto && merged.auto.research)
    };

    merged.audio = {
      enabled: Boolean(merged.audio && merged.audio.enabled),
      music: Boolean(merged.audio && merged.audio.music)
    };
    if (!merged.audio.enabled) {
      merged.audio.music = false;
    }

    merged.challengeWins = (merged.challengeWins && typeof merged.challengeWins === "object")
      ? { ...merged.challengeWins }
      : {};

    for (const challenge of CHALLENGES) {
      merged.challengeWins[challenge.id] = Math.floor(clampNumber(merged.challengeWins[challenge.id], 0, Number.MAX_SAFE_INTEGER));
    }

    merged.stats = merged.stats && typeof merged.stats === "object" ? merged.stats : { largestClick: 0, bestCps: 0, bossesDefeated: 0 };
    merged.stats.largestClick = clampNumber(merged.stats.largestClick, 0, Number.MAX_SAFE_INTEGER);
    merged.stats.bestCps = clampNumber(merged.stats.bestCps, 0, Number.MAX_SAFE_INTEGER);
    merged.stats.bossesDefeated = Math.floor(clampNumber(merged.stats.bossesDefeated, 0, Number.MAX_SAFE_INTEGER));

    if (!CONTRACT_BY_ID.has(merged.currentContractId)) {
      merged.currentContractId = null;
    }

    if (merged.nextGoldenAt <= Date.now()) {
      merged.nextGoldenAt = Date.now() + randomInt(15000, 30000);
    }

    if (merged.nextLeechAt <= Date.now()) {
      merged.nextLeechAt = Date.now() + randomInt(30000, 60000);
    }

    if (merged.nextBossAt <= Date.now()) {
      merged.nextBossAt = Date.now() + randomInt(120000, 240000);
    }

    if (merged.nextEventAt <= Date.now()) {
      merged.nextEventAt = Date.now() + randomInt(50000, 110000);
    }

    if (merged.seasonUntil <= Date.now()) {
      merged.seasonUntil = Date.now() + 4 * 60 * 1000;
    }

    if (merged.challenge === "none") {
      merged.challengeClaimReady = false;
    }

    return merged;
  }
  function encodeSave(data) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  }

  function decodeSave(raw) {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(raw))));
    } catch (err) {
      return JSON.parse(raw);
    }
  }

  function byId(id) {
    const node = document.getElementById(id);
    if (!node) {
      throw new Error("Missing required element: " + id);
    }
    return node;
  }

  function formatCompact(num) {
    if (!Number.isFinite(num)) return "0";
    const abs = Math.abs(num);
    if (abs < 1000) {
      return abs >= 100 || num % 1 === 0 ? String(Math.floor(num)) : trimNumber(num);
    }

    const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];
    let value = num;
    let unit = "";
    for (let i = 0; i < units.length; i += 1) {
      value /= 1000;
      unit = units[i];
      if (Math.abs(value) < 1000) break;
    }

    return trimNumber(value) + unit;
  }

  function trimNumber(value) {
    if (!Number.isFinite(value)) return "0";
    const abs = Math.abs(value);
    let fixed = 0;
    if (abs < 10) fixed = 2;
    else if (abs < 100) fixed = 1;
    return Number(value.toFixed(fixed)).toString();
  }

  function clampNumber(value, min, max) {
    const num = Number(value);
    if (!Number.isFinite(num)) return min;
    if (num < min) return min;
    if (num > max) return max;
    return num;
  }

  function sumArray(values) {
    let total = 0;
    for (const value of values) {
      total += Number(value) || 0;
    }
    return total;
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  function dayKey(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();




































































