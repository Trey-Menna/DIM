import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { profileResponseSelector } from 'app/inventory/selectors';
import { useD2Definitions } from 'app/manifest/selectors';

import { getResettableReputations } from 'app/destiny2/reputation';

export default function ReputationResetNotifier() {
  const defs = useD2Definitions();
  const profileInfo = useSelector(profileResponseSelector);

  const characterId = profileInfo?.characterProgressions?.data
    ? Object.keys(profileInfo.characterProgressions.data)[0]
    : undefined;

  const progressions =
    characterId && profileInfo?.characterProgressions?.data?.[characterId]
      ? profileInfo.characterProgressions.data[characterId].progressions
      : {};

  useEffect(() => {
    if (!defs) {
      return;
    }

    const resettable = getResettableReputations(progressions, defs);

    console.log('Resettable reputations:', resettable);
  }, [defs, progressions]);

  return null;
}
