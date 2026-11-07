export interface SimulatedBotPlayer {
  id: string;
  name: string;
  currentTrophies: number;
  clanName?: string;
  lastIncrease?: number;
}

const DEFAULT_SIMULATED_BOTS: SimulatedBotPlayer[] = [
  { id: "bot-1", name: "CipherByte", currentTrophies: 3420, clanName: "ByteKnights" },
  { id: "bot-2", name: "ApexCoder", currentTrophies: 3180, clanName: "ByteKnights" },
  { id: "bot-3", name: "KaggleHero", currentTrophies: 2890, clanName: "NeuralSentinels" },
  { id: "bot-4", name: "SyntaxSlayer", currentTrophies: 2650, clanName: "QuantumVanguard" },
  { id: "bot-5", name: "DeepThinker", currentTrophies: 2420, clanName: "ByteKnights" },
  { id: "bot-6", name: "TensorFlow_99", currentTrophies: 2190, clanName: "NeuralSentinels" },
  { id: "bot-7", name: "RustEnthusiast", currentTrophies: 1980, clanName: "CyberSamurai" },
  { id: "bot-8", name: "PromptWhisperer", currentTrophies: 1750, clanName: "ByteKnights" },
  { id: "bot-9", name: "AlgoWizard", currentTrophies: 1540, clanName: "QuantumVanguard" },
  { id: "bot-10", name: "ZeroDayNinja", currentTrophies: 1320, clanName: "CyberSamurai" },
];

let simulatedBotsCache: SimulatedBotPlayer[] = [...DEFAULT_SIMULATED_BOTS];

export function getSimulatedLeagueBots(): SimulatedBotPlayer[] {
  return [...simulatedBotsCache];
}

export function tickBotSimulation(): SimulatedBotPlayer[] {
  simulatedBotsCache = simulatedBotsCache.map((bot) => {
    // Random occasional small trophy increase
    if (Math.random() > 0.6) {
      const delta = Math.floor(Math.random() * 25) + 5;
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
