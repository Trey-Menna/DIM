import { getResettableReputations } from 'app/destiny2/reputation';
import { profileResponseSelector } from 'app/inventory/selectors';
import { useD2Definitions } from 'app/manifest/selectors';
import { showNotification } from 'app/notifications/notifications';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function ReputationResetNotifier() {
  const defs = useD2Definitions();
  const profileInfo = useSelector(profileResponseSelector);
  const notificationShown = useRef(false);

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

    if (resettable.length > 0 && !notificationShown.current) {
      notificationShown.current = true;

      //Could show number of reputations that can be rest by replacing body with
      // `You have ${resettable.length} reputation track${resettable.length > 1 ? 's' : ''} ready to reset.`
      showNotification({
        type: 'warning',
        title: 'Reputation Reset Available',
        body: resettable.map((r) => r.name).join(', '),
        duration: 10000,
      });
    }
  }, [defs, progressions]);

  return null;
}
