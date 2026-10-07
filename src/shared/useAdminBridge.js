import { useSyncExternalStore } from 'react';
import { bridgeSnapshot, subscribeBridge } from './adminBridge.js';
export function useAdminBridge() { return useSyncExternalStore(subscribeBridge, bridgeSnapshot, bridgeSnapshot); }
