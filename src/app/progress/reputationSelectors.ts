import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import { unadvertisedResettableVendors } from 'app/search/d2-known-values';
import { sumBy } from 'app/utils/collections';
import { DestinyProfileResponse, DestinyProgression } from 'bungie-api-ts/destiny2';
import { getCharacterProgressions } from './selectors';

export interface ResettableReputation {
  progressionHash: number;
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

  return progress.currentProgress >= rankTotal;
}

export function getResettableReputations(
  profileInfo: DestinyProfileResponse,
  defs: D2ManifestDefinitions,
): ResettableReputation[] {
  const progressions = getCharacterProgressions(profileInfo)?.progressions ?? {};

  return Object.values(progressions)
    .filter((progress) => isReputationResetReady(progress, defs))
    .map((progress) => ({
      progressionHash: progress.progressionHash,
      progress,
    }));
}

export function hasResettableReputation(
  profileInfo: DestinyProfileResponse,
  defs: D2ManifestDefinitions,
) {
  return getResettableReputations(profileInfo, defs).length > 0;
}
