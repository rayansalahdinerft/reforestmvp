import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  AreaSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts';
import { Loader2, Wifi, WifiOff, CandlestickChart, LineChart } from 'lucide-react';
import { useBinanceKlines, type Timeframe } from '@/hooks/useBinanceKlines';
import { Badge } from '@/components/ui/badge';

interface AdvancedChartProps {
  symbol: string;
  height?: number;
}

type ChartType = 'candles' | 'line';

const TIMEFRAMES: Timeframe[] = ['1H', '1D', '1W', '1M', '1Y', 'ALL'];

const AdvancedChart = ({ symbol, height = 360 }: AdvancedChartProps) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('candles');
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Area'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const { candles, loading, error, isLive } = useBinanceKlines(symbol, timeframe);

  // Init chart
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: 'hsl(0 0% 65%)',
        fontFamily: 'inherit',
      },
      grid: {
        vertLines: { color: 'hsl(0 0% 12%)' },
        horzLines: { color: 'hsl(0 0% 12%)' },
      },
      rightPriceScale: {
        borderColor: 'hsl(0 0% 15%)',
        scaleMargins: { top: 0.1, bottom: 0.25 },
      },
      timeScale: {
        borderColor: 'hsl(0 0% 15%)',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
      autoSize: true,
    });

    chartRef.current = chart;

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: 'hsl(145 85% 55% / 0.4)',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeriesRef.current = volumeSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      priceSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  // Swap price series on chart type change
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (priceSeriesRef.current) {
      chart.removeSeries(priceSeriesRef.current as ISeriesApi<'Candlestick' | 'Area'>);
      priceSeriesRef.current = null;
    }

    if (chartType === 'candles') {
      priceSeriesRef.current = chart.addSeries(CandlestickSeries, {
        upColor: 'hsl(145 85% 55%)',
        downColor: 'hsl(0 84% 60%)',
        borderVisible: false,
        wickUpColor: 'hsl(145 85% 55%)',
        wickDownColor: 'hsl(0 84% 60%)',
      });
    } else {
      priceSeriesRef.current = chart.addSeries(AreaSeries, {
        lineColor: 'hsl(145 85% 55%)',
        topColor: 'hsl(145 85% 55% / 0.4)',
        bottomColor: 'hsl(145 85% 55% / 0)',
        lineWidth: 2,
      });
    }
  }, [chartType]);

  // Feed data
  useEffect(() => {
    const priceSeries = priceSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!priceSeries || !volumeSeries || candles.length === 0) return;

    if (chartType === 'candles') {
      (priceSeries as ISeriesApi<'Candlestick'>).setData(
        candles.map((c) => ({
          time: c.time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }))
      );
    } else {
      (priceSeries as ISeriesApi<'Area'>).setData(
        candles.map((c) => ({
          time: c.time as UTCTimestamp,
          value: c.close,
        }))
      );
    }

    volumeSeries.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.close >= c.open ? 'hsl(145 85% 55% / 0.4)' : 'hsl(0 84% 60% / 0.4)',
      }))
    );

    chartRef.current?.timeScale().fitContent();
  }, [candles, chartType]);

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-secondary/50 p-1">
            <button
              onClick={() => setChartType('candles')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                chartType === 'candles'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CandlestickChart className="w-3.5 h-3.5" />
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                chartType === 'line'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              Line
            </button>
          </div>
          {isLive ? (
            <Badge variant="default" className="text-[10px] px-1.5 py-0.5 gap-1 bg-primary/80">
              <Wifi className="w-3 h-3" /> Live
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 gap-1">
              <WifiOff className="w-3 h-3" /> Offline
            </Badge>
          )}
        </div>

        <div className="inline-flex rounded-lg bg-secondary/50 p-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                timeframe === tf
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="relative rounded-lg overflow-hidden bg-background/40 border border-border/40" style={{ height }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 z-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        {error && !loading && candles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground z-10">
            {error === 'Not available on Binance'
              ? 'Bougies non disponibles pour ce token'
              : `Erreur: ${error}`}
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default AdvancedChart;