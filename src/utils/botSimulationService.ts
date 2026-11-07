export interface SimulatedBotPlayer {
  id: string;
  name: string;
  currentTrophies: number;
  clanName?: string;
  lastIncrease?: number;
}

const DEFAULT_SIMULATED_BOTS: SimulatedBotPlayer[] = [
  { id: "bot-1", name: "CipherByte", currentTrophies: 340, clanName: "ByteKnights" },
  { id: "bot-2", name: "ApexCoder", currentTrophies: 310, clanName: "ByteKnights" },
  { id: "bot-3", name: "KaggleHero", currentTrophies: 285, clanName: "NeuralSentinels" },
  { id: "bot-4", name: "SyntaxSlayer", currentTrophies: 260, clanName: "QuantumVanguard" },
  { id: "bot-5", name: "DeepThinker", currentTrophies: 240, clanName: "ByteKnights" },
  { id: "bot-6", name: "TensorFlow_99", currentTrophies: 210, clanName: "NeuralSentinels" },
  { id: "bot-7", name: "RustEnthusiast", currentTrophies: 195, clanName: "CyberSamurai" },
  { id: "bot-8", name: "PromptWhisperer", currentTrophies: 175, clanName: "ByteKnights" },
  { id: "bot-9", name: "AlgoWizard", currentTrophies: 150, clanName: "QuantumVanguard" },
  { id: "bot-10", name: "ZeroDayNinja", currentTrophies: 125, clanName: "CyberSamurai" },
];

let simulatedBotsCache: SimulatedBotPlayer[] = [...DEFAULT_SIMULATED_BOTS];

export function getSimulatedLeagueBots(userTrophies: number = 200): SimulatedBotPlayer[] {
  const isBronze = userTrophies < 500;
  const isSilver = userTrophies >= 500 && userTrophies < 1000;

  return DEFAULT_SIMULATED_BOTS.map((bot, i) => {
    let t = bot.currentTrophies;
    if (isBronze) {
      t = 120 + ((i * 31) % 340); // Strictly Bronze (< 500)
    } else if (isSilver) {
      t = 520 + ((i * 45) % 450); // Strictly Silver (500 - 999)
    }
    return { ...bot, currentTrophies: t };
  });
}

export function tickBotSimulation(): SimulatedBotPlayer[] {
  simulatedBotsCache = simulatedBotsCache.map((bot) => {
    if (Math.random() > 0.6) {
      const delta = Math.floor(Math.random() * 15) + 2;
      return {
        ...bot,
        currentTrophies: bot.currentTrophies + delta,
        lastIncrease: delta,
      };
    }
    return { ...bot, lastIncrease: undefined };
  });

  return [...simulatedBotsCache];
}

export function tickClanXpSimulation(currentXp: number): number {
  const boost = Math.floor(Math.random() * 20) + 10;
  return currentXp + boost;
}
