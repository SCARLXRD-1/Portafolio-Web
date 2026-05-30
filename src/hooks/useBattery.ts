'use client';

import { useState, useEffect } from 'react';

interface BatteryState {
  level: number;
  charging: boolean;
  supported: boolean;
}

export function useBattery(): BatteryState {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    level: 1, // Por defecto 100%
    charging: false,
    supported: true, // Asumimos que sí hasta comprobarlo
  });

  useEffect(() => {
    let battery: any;

    const updateBatteryInfo = () => {
      if (battery) {
        setBatteryState({
          level: battery.level,
          charging: battery.charging,
          supported: true,
        });
      }
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((b: any) => {
        battery = b;
        updateBatteryInfo();

        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);
      });
    } else {
      setBatteryState(prev => ({ ...prev, supported: false }));
    }

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', updateBatteryInfo);
        battery.removeEventListener('chargingchange', updateBatteryInfo);
      }
    };
  }, []);

  return batteryState;
}
