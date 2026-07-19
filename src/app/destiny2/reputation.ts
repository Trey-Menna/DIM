import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import { unadvertisedResettableVendors } from 'app/search/d2-known-values';
import { sumBy } from 'app/utils/collections';
import { DestinyProgression } from 'bungie-api-ts/destiny2';

export interface ResettableReputation {
  progressionHash: number;
  name: string;
  icon?: string;
  progress: DestinyProgression;
}

export function isReputationResetReady(progress: DestinyProgression, defs: D2ManifestDefinitions) {
  const progressionDef = defs.Progression.get(progress.progressionHash);

  if (!progressionDef?.steps?.length) {
    return false;
  }

  const canReset =
    typeof progress.currentResetCount === 'number' ||
    unadvertisedResettableVendors.includes(progress.progressionHash);

  if (!canReset) {
    return false;
  }

  const rankTotal = sumBy(progressionDef.steps, (step) => step.progressTotal);

  console.log({
    vendor: progressionDef.displayProperties.name,
    level: progress.level,
    currentProgress: progress.currentProgress,
    progressToNextLevel: progress.progressToNextLevel,
    nextLevelAt: progress.nextLevelAt,
    currentResetCount: progress.currentResetCount,
  });

  return progress.currentProgress >= rankTotal;
}

export function getResettableReputations(
  progressions: Record<number, DestinyProgression>,
  defs: D2ManifestDefinitions,
): ResettableReputation[] {
  return Object.values(progressions)
    .filter((progress) => isReputationResetReady(progress, defs))
    .map((progress) => {
      const progressionDef = defs.Progression.get(progress.progressionHash);

      return {
        progressionHash: progress.progressionHash,
        name: progressionDef.displayProperties.name,
        icon: progressionDef.displayProperties.icon,
        progress,
      };
    });
}
