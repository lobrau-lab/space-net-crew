import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  StationRoom,
  OrchestrationPhase,
  DelegationContractEvent,
} from '../types/starnet';
import {
  Cpu,
  HardDrive,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  TrendingUp,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';

interface RoomUtilizationChartProps {
  rooms: StationRoom[];
  currentPhase: OrchestrationPhase | null;
  currentEvent: DelegationContractEvent | null;
  isRunning: boolean;
}

const PHASES: OrchestrationPhase[] = [
  'receive',
  'decompose',
  'route',
  'monitor',
  'synthesize',
  'verify',
];

const PHASE_LABELS: Record<OrchestrationPhase, string> = {
  receive: '1. Receive',
  decompose: '2. Decompose',
  route: '3. Route',
  monitor: '4. Monitor',
  synthesize: '5. Synthesize',
  verify: '6. Verify',
};

// Tactical colors mapped to rooms
const ROOM_META: Record<
  string,
  { name: string; short: string; color: string; stroke: string }
> = {
  orchestrator_hub: {
    name: 'Orchestrator Hub',
    short: 'Hub',
    color: '#06b6d4',
    stroke: '#22d3ee',
  },
  room_alpha_research: {
    name: 'Research Bay Alpha',
    short: 'Research',
    color: '#38bdf8',
    stroke: '#0284c7',
  },
  room_beta_coder: {
    name: 'Engineering Bay Beta',
    short: 'Engineering',
    color: '#a855f7',
    stroke: '#c084fc',
  },
  room_gamma_analyst: {
    name: 'Analytics Core Gamma',
    short: 'Analytics',
    color: '#f59e0b',
    stroke: '#fbbf24',
  },
  room_delta_comms: {
    name: 'Comms Relay Delta',
    short: 'Comms',
    color: '#10b981',
    stroke: '#34d399',
  },
  room_epsilon_specialist: {
    name: 'Crypto Vault Epsilon',
    short: 'Vault',
    color: '#f43f5e',
    stroke: '#fb7185',
  },
};

export const RoomUtilizationChart: React.FC<RoomUtilizationChartProps> = ({
  rooms,
  currentPhase,
  currentEvent,
  isRunning,
}) => {
  const [metric, setMetric] = useState<'cpu' | 'memory'>('cpu');
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');

  // Identify rooms actively delegated in the current run
  const activeDelegationRoomIds = useMemo(() => {
    const ids = new Set<string>();
    if (currentEvent?.delegations) {
      currentEvent.delegations.forEach((d) => ids.add(d.room_id));
    }
    return ids;
  }, [currentEvent]);

  // Compute realistic utilization data across all phases based on delegation scopes
  const phaseData = useMemo(() => {
    return PHASES.map((phase) => {
      const isTargetPhase = currentPhase === phase;

      // Base utilization per phase
      const row: Record<string, any> = {
        phase,
        phaseLabel: PHASE_LABELS[phase],
        isCurrent: isTargetPhase,
      };

      // 1. Hub utilization curve: High at receive, decompose, synthesize
      const hubCpu =
        phase === 'receive'
          ? 65
          : phase === 'decompose'
          ? 88
          : phase === 'route'
          ? 42
          : phase === 'monitor'
          ? 28
          : phase === 'synthesize'
          ? 84
          : 50;
      const hubMem =
        phase === 'receive'
          ? 120
          : phase === 'decompose'
          ? 210
          : phase === 'route'
          ? 230
          : phase === 'monitor'
          ? 240
          : phase === 'synthesize'
          ? 390
          : 280;

      row['orchestrator_hub_cpu'] = hubCpu;
      row['orchestrator_hub_mem'] = hubMem;

      // 2. Research Bay Alpha
      const isResearchActive = activeDelegationRoomIds.has('room_alpha_research');
      const researchCpu =
        phase === 'route'
          ? (isResearchActive ? 52 : 15)
          : phase === 'monitor'
          ? (isResearchActive ? 82 : 12)
          : phase === 'decompose'
          ? 22
          : 8;
      const researchMem =
        phase === 'monitor'
          ? (isResearchActive ? 420 : 96)
          : phase === 'synthesize'
          ? 310
          : 96;

      row['room_alpha_research_cpu'] = researchCpu;
      row['room_alpha_research_mem'] = researchMem;

      // 3. Engineering Bay Beta
      const isCoderActive = activeDelegationRoomIds.has('room_beta_coder');
      const coderCpu =
        phase === 'route'
          ? (isCoderActive ? 58 : 14)
          : phase === 'monitor'
          ? (isCoderActive ? 94 : 10)
          : phase === 'synthesize'
          ? 35
          : 6;
      const coderMem =
        phase === 'monitor'
          ? (isCoderActive ? 480 : 110)
          : phase === 'synthesize'
          ? 360
          : 110;

      row['room_beta_coder_cpu'] = coderCpu;
      row['room_beta_coder_mem'] = coderMem;

      // 4. Analytics Core Gamma
      const isAnalystActive = activeDelegationRoomIds.has('room_gamma_analyst');
      const analystCpu =
        phase === 'route'
          ? (isAnalystActive ? 48 : 12)
          : phase === 'monitor'
          ? (isAnalystActive ? 76 : 10)
          : phase === 'synthesize'
          ? 55
          : 8;
      const analystMem =
        phase === 'monitor'
          ? (isAnalystActive ? 380 : 90)
          : phase === 'synthesize'
          ? 410
          : 90;

      row['room_gamma_analyst_cpu'] = analystCpu;
      row['room_gamma_analyst_mem'] = analystMem;

      // 5. Comms Relay Delta
      const isCommsActive = activeDelegationRoomIds.has('room_delta_comms');
      const commsCpu =
        phase === 'synthesize'
          ? (isCommsActive ? 89 : 45)
          : phase === 'verify'
          ? 40
          : phase === 'monitor'
          ? 20
          : 10;
      const commsMem =
        phase === 'synthesize'
          ? (isCommsActive ? 340 : 150)
          : phase === 'verify'
          ? 220
          : 80;

      row['room_delta_comms_cpu'] = commsCpu;
      row['room_delta_comms_mem'] = commsMem;

      // 6. Cryptographic Vault Epsilon
      const isVaultActive = activeDelegationRoomIds.has('room_epsilon_specialist');
      const vaultCpu =
        phase === 'verify'
          ? (isVaultActive ? 96 : 74)
          : phase === 'synthesize'
          ? 38
          : phase === 'monitor'
          ? 24
          : 12;
      const vaultMem =
        phase === 'verify'
          ? (isVaultActive ? 320 : 190)
          : phase === 'synthesize'
          ? 210
          : 75;

      row['room_epsilon_specialist_cpu'] = vaultCpu;
      row['room_epsilon_specialist_mem'] = vaultMem;

      return row;
    });
  }, [currentPhase, activeDelegationRoomIds]);

  // Keys to display depending on room filter and metric
  const displayRooms = useMemo(() => {
    if (selectedRoomId === 'all') {
      return Object.keys(ROOM_META);
    }
    return [selectedRoomId];
  }, [selectedRoomId]);

  // Current real-time summary calculations
  const activePhaseRow = useMemo(() => {
    return (
      phaseData.find((d) => d.phase === currentPhase) ||
      phaseData[phaseData.length - 1]
    );
  }, [phaseData, currentPhase]);

  const peakRoomInfo = useMemo(() => {
    let maxVal = 0;
    let maxRoomKey = 'orchestrator_hub';
    Object.keys(ROOM_META).forEach((key) => {
      const val = activePhaseRow[`${key}_${metric}`] || 0;
      if (val > maxVal) {
        maxVal = val;
        maxRoomKey = key;
      }
    });
    return {
      roomName: ROOM_META[maxRoomKey]?.short || maxRoomKey,
      value: maxVal,
      color: ROOM_META[maxRoomKey]?.color || '#06b6d4',
    };
  }, [activePhaseRow, metric]);

  const totalCurrentMem = useMemo(() => {
    return Object.keys(ROOM_META).reduce((acc, key) => {
      return acc + (activePhaseRow[`${key}_mem`] || 0);
    }, 0);
  }, [activePhaseRow]);

  const avgCurrentCpu = useMemo(() => {
    const sum = Object.keys(ROOM_META).reduce((acc, key) => {
      return acc + (activePhaseRow[`${key}_cpu`] || 0);
    }, 0);
    return Math.round(sum / Object.keys(ROOM_META).length);
  }, [activePhaseRow]);

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-5 shadow-xl font-mono text-xs">
      {/* Chart Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wide">
                Room Utilization & Telemetry Trends
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Recharts Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live CPU & Memory allocation across orchestration phases
            </p>
          </div>
        </div>

        {/* Metric and Chart Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Toggle */}
          <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            <button
              onClick={() => setMetric('cpu')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                metric === 'cpu'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>CPU %</span>
            </button>
            <button
              onClick={() => setMetric('memory')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                metric === 'memory'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-3 h-3" />
              <span>Memory (MB)</span>
            </button>
          </div>

          {/* Chart Style Toggle */}
          <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition ${
                chartType === 'area'
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Area Wave"
            >
              Wave
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition ${
                chartType === 'line'
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Stepped Line"
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition ${
                chartType === 'bar'
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Comparative Bar"
            >
              Bar
            </button>
          </div>

          {/* Room Filter Selector */}
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Rooms (Cluster View)</option>
            {Object.entries(ROOM_META).map(([id, meta]) => (
              <option key={id} value={id}>
                {meta.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Telemetry Stats Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            Current Phase
          </span>
          <span className="text-xs font-bold text-cyan-300 uppercase mt-0.5 truncate">
            {currentPhase ? PHASE_LABELS[currentPhase] : 'Awaiting Run'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
            <Cpu className="w-3 h-3 text-amber-400" />
            Avg Cluster CPU
          </span>
          <span className="text-xs font-bold text-amber-300 mt-0.5">
            {avgCurrentCpu}%
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-emerald-400" />
            Cluster Memory
          </span>
          <span className="text-xs font-bold text-emerald-300 mt-0.5">
            {totalCurrentMem} MB
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-rose-400" />
            Peak Room
          </span>
          <span
            className="text-xs font-bold mt-0.5 truncate flex items-center gap-1"
            style={{ color: peakRoomInfo.color }}
          >
            <span>{peakRoomInfo.roomName}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              ({peakRoomInfo.value}
              {metric === 'cpu' ? '%' : 'MB'})
            </span>
          </span>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="h-[280px] w-full bg-slate-950/80 rounded-lg p-2 border border-slate-800/80 relative">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart
              data={phaseData}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <defs>
                {displayRooms.map((roomId) => (
                  <linearGradient
                    key={roomId}
                    id={`grad_${roomId}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={ROOM_META[roomId]?.color}
                      stopOpacity={0.65}
                    />
                    <stop
                      offset="95%"
                      stopColor={ROOM_META[roomId]?.color}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
              <XAxis
                dataKey="phaseLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              />
              <YAxis
                stroke="#64748b"
                unit={metric === 'cpu' ? '%' : 'MB'}
                domain={metric === 'cpu' ? [0, 100] : [0, 'auto']}
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              />
              <Tooltip
                content={<CustomTacticalTooltip metric={metric} />}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />

              {/* Active phase reference marker */}
              {currentPhase && (
                <ReferenceLine
                  x={PHASE_LABELS[currentPhase]}
                  stroke="#22d3ee"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{
                    value: 'ACTIVE PHASE',
                    fill: '#22d3ee',
                    fontSize: 9,
                    fontFamily: 'monospace',
                    position: 'top',
                  }}
                />
              )}

              {displayRooms.map((roomId) => (
                <Area
                  key={roomId}
                  type="monotone"
                  dataKey={`${roomId}_${metric}`}
                  name={ROOM_META[roomId]?.short || roomId}
                  stroke={ROOM_META[roomId]?.stroke}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#grad_${roomId})`}
                  isAnimationActive={true}
                />
              ))}
            </AreaChart>
          ) : chartType === 'line' ? (
            <LineChart
              data={phaseData}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
              <XAxis
                dataKey="phaseLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              />
              <YAxis
                stroke="#64748b"
                unit={metric === 'cpu' ? '%' : 'MB'}
                domain={metric === 'cpu' ? [0, 100] : [0, 'auto']}
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              />
              <Tooltip
                content={<CustomTacticalTooltip metric={metric} />}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />

              {currentPhase && (
                <ReferenceLine
                  x={PHASE_LABELS[currentPhase]}
                  stroke="#22d3ee"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                />
              )}

              {displayRooms.map((roomId) => (
                <Line
                  key={roomId}
                  type="monotone"
                  dataKey={`${roomId}_${metric}`}
                  name={ROOM_META[roomId]?.short || roomId}
                  stroke={ROOM_META[roomId]?.color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: ROOM_META[roomId]?.color }}
                  activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart
              data={phaseData}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
              <XAxis
                dataKey="phaseLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              />
              <YAxis
                stroke="#64748b"
                unit={metric === 'cpu' ? '%' : 'MB'}
                domain={metric === 'cpu' ? [0, 100] : [0, 'auto']}
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              />
              <Tooltip
                content={<CustomTacticalTooltip metric={metric} />}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />

              {displayRooms.map((roomId) => (
                <Bar
                  key={roomId}
                  dataKey={`${roomId}_${metric}`}
                  name={ROOM_META[roomId]?.short || roomId}
                  fill={ROOM_META[roomId]?.color}
                  radius={[3, 3, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-400">
            Real work, real compute: Room scopes dynamically throttle idle processes.
          </span>
        </div>
        <span className="text-cyan-400 font-bold">
          Telemetry Resolution: 100ms
        </span>
      </div>
    </div>
  );
};

// Custom Cyberpunk Tooltip for Recharts
const CustomTacticalTooltip = ({ active, payload, label, metric }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#090d16]/95 border border-cyan-500/50 p-2.5 rounded-lg shadow-2xl backdrop-blur-md font-mono text-[11px]">
        <div className="border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between gap-4">
          <span className="text-cyan-300 font-bold uppercase">{label}</span>
          <span className="text-[10px] text-slate-400 uppercase">
            {metric === 'cpu' ? 'CPU Load' : 'Memory Allocated'}
          </span>
        </div>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-300">{entry.name}:</span>
              </div>
              <span className="font-bold" style={{ color: entry.color }}>
                {entry.value}
                {metric === 'cpu' ? '%' : ' MB'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
