import { useState, useEffect, useCallback, useRef } from 'react';

export type Timeframe = '1H' | '1D' | '1W' | '1M' | '1Y' | 'ALL';

export interface Candle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Symbol -> Binance pair (USDT quoted). null = not on Binance.
const BINANCE_SYMBOL_MAP: Record<string, string | null> = {
  BTC: 'BTCUSDT', ETH: 'ETHUSDT', BNB: 'BNBUSDT', SOL: 'SOLUSDT',
  XRP: 'XRPUSDT', ADA: 'ADAUSDT', DOGE: 'DOGEUSDT', AVAX: 'AVAXUSDT',
  TRX: 'TRXUSDT', LINK: 'LINKUSDT', DOT: 'DOTUSDT', MATIC: 'MATICUSDT',
  POL: 'POLUSDT', SHIB: 'SHIBUSDT', UNI: 'UNIUSDT', LTC: 'LTCUSDT',
  PEPE: 'PEPEUSDT', AAVE: 'AAVEUSDT', RNDR: 'RNDRUSDT', ARB: 'ARBUSDT',
  FET: 'FETUSDT', MKR: 'MKRUSDT', OP: 'OPUSDT', GRT: 'GRTUSDT',
  STRK: 'STRKUSDT', LDO: 'LDOUSDT', WLD: 'WLDUSDT', PENDLE: 'PENDLEUSDT',
  CRV: 'CRVUSDT', BONK: 'BONKUSDT', WIF: 'WIFUSDT', FLOKI: 'FLOKIUSDT',
  JUP: 'JUPUSDT', PYTH: 'PYTHUSDT', ENA: 'ENAUSDT', ETHFI: 'ETHFIUSDT',
  USDC: null, USDT: null, DAI: null, // stables: skip candles
};

// Fallback: try SYMBOLUSDT
const resolveBinanceSymbol = (symbol: string): string | null => {
  const s = symbol.toUpperCase();
  if (s in BINANCE_SYMBOL_MAP) return BINANCE_SYMBOL_MAP[s];
  return `${s}USDT`;
};

interface IntervalConfig {
  interval: string;
  limit: number;
}

const TIMEFRAME_CONFIG: Record<Timeframe, IntervalConfig> = {
  '1H': { interval: '1m', limit: 60 },
  '1D': { interval: '15m', limit: 96 },
  '1W': { interval: '1h', limit: 168 },
  '1M': { interval: '4h', limit: 180 },
  '1Y': { interval: '1d', limit: 365 },
  'ALL': { interval: '1w', limit: 1000 },
};

interface Result {
  candles: Candle[];
  loading: boolean;
  error: string | null;
  isLive: boolean;
  refetch: () => void;
}

export const useBinanceKlines = (symbol: string, timeframe: Timeframe): Result => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const pair = resolveBinanceSymbol(symbol);
  const { interval, limit } = TIMEFRAME_CONFIG[timeframe];

  const fetchKlines = useCallback(async () => {
    if (!pair) {
      setError('Not available on Binance');
      setCandles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Binance ${res.status}`);
      const raw = await res.json();

      const parsed: Candle[] = raw.map((k: any[]) => ({
        time: Math.floor(k[0] / 1000),
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
      }));

      setCandles(parsed);
    } catch (err) {
      console.error('Binance klines error:', err);
      setError(err instanceof Error ? err.message : 'Fetch failed');
      setCandles([]);
    } finally {
      setLoading(false);
    }
  }, [pair, interval, limit]);

  useEffect(() => {
    fetchKlines();
  }, [fetchKlines]);

  // Live WebSocket updates for the current interval
  useEffect(() => {
    if (!pair) {
      setIsLive(false);
      return;
    }

    const stream = `${pair.toLowerCase()}@kline_${interval}`;
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);
    wsRef.current = ws;

    ws.onopen = () => setIsLive(true);
    ws.onclose = () => setIsLive(false);
    ws.onerror = () => setIsLive(false);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const k = msg.k;
        if (!k) return;
        const updated: Candle = {
          time: Math.floor(k.t / 1000),
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
        };

        setCandles((prev) => {
          if (prev.length === 0) return [updated];
          const last = prev[prev.length - 1];
          if (last.time === updated.time) {
            const next = [...prev];
            next[next.length - 1] = updated;
            return next;
          }
          if (updated.time > last.time) {
            return [...prev.slice(-999), updated];
          }
          return prev;
        });
      } catch {
        // ignore
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [pair, interval]);

  return { candles, loading, error, isLive, refetch: fetchKlines };
};

export default useBinanceKlines;