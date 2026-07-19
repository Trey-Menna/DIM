import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { profileResponseSelector } from 'app/inventory/selectors';
import { useD2Definitions } from 'app/manifest/selectors';
import { showNotification } from 'app/notifications/notifications';

import { getResettableReputations } from 'app/progress/reputationSelectors';

export default function ReputationResetNotifier() {
  const defs = useD2Definitions();
  const profileInfo = useSelector(profileResponseSelector);

  const hasShown = useRef(false);

  useEffect(() => {
    if (!defs || !profileInfo) {
      return;
    }

    const resettable = getResettableReputations(profileInfo, defs);

    if (!hasShown.current && resettable.length > 0) {
      hasShown.current = true;

      showNotification({
        type: 'warning',
        title: 'Reputation Reset Available',
        body: resettable.map((r) => r.name).join(', '),
        duration: 10000,
      });
    }
  }, [defs, profileInfo]);

  return null;
}
