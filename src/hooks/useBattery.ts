'use client';

import { useState } from 'react';

interface BatteryState {
  level: number;
  charging: boolean;
  supported: boolean;
}

export function useBattery(): BatteryState {
  // Estado estático simulando 100% y cargando siempre
  const [batteryState] = useState<BatteryState>({
    level: 1, 
    charging: true,
    supported: true,
  });

  return batteryState;
}
