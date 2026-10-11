/**
 * StarNet Agentic Orchestration Node & Game Overlay Type Definitions
 * Modeled after StarNet Product Architecture & Google AI Studio System Instructions.
 */

export type AgentClass = 'researcher' | 'coder' | 'analyst' | 'communicator' | 'specialist';

export type OrchestrationPhase = 
  | 'receive'
  | 'decompose'
  | 'route'
  | 'monitor'
  | 'synthesize'
  | 'verify';

export type OrchestrationStatus = 
  | 'pending'
  | 'in_progress'
  | 'complete'
  | 'failed'
  | 'budget_exceeded';

export interface Delegation {
  agent_class: AgentClass;
  room_id: string;
  task_brief: string;
  capability_grant: string[];
  success_condition: string;
  max_turns: number;
  budget_cap: number;
  // Execution runtime extensions
  id?: string;
  status?: 'waiting' | 'in_transit' | 'executing' | 'completed' | 'failed';
  current_turn?: number;
  current_thought?: string;
  logs?: string[];
  output?: string;
  receipt_ref?: string | null;
  cost_accumulated?: number;
}

export interface DelegationContractEvent {
  orchestration_id: string;
  timestamp: string;
  phase: OrchestrationPhase;
  delegations: Delegation[];
  status: OrchestrationStatus;
  receipt_ref: string | null;
  unverified_claims: string[];
  // Overlay augmentation
  event_description?: string;
  active_hallway?: { from: string; to: string; agent_class: AgentClass };
}

export interface ToolReceipt {
  receipt_id: string;
  orchestration_id: string;
  agent_class: AgentClass;
  room_id: string;
  tool_name: string;
  timestamp: string;
  parameters: Record<string, unknown>;
  output_summary: string;
  sha256_hash: string;
  cost_usd: number;
  verified: boolean;
}

export interface ClaimVerification {
  claim_id: string;
  claim: string;
  source_agent: AgentClass;
  room_id: string;
  receipt_ref: string | null;
  verified: boolean;
  notes?: string;
}

export interface DeliverableFile {
  name: string;
  type: string;
  author: AgentClass;
  room_id: string;
  receipt_ref: string;
  content: string;
}

export interface OrchestrationResult {
  orchestration_id: string;
  task_input: string;
  timestamp: string;
  station_summary: string;
  deliverables: string;
  deliverable_files: DeliverableFile[];
  verification_ledger: ClaimVerification[];
  cost_report: {
    total_spend: number;
    budget_cap: number;
    per_agent_breakdown: Record<string, number>;
  };
  overlay_event_stream: DelegationContractEvent[];
  receipts: ToolReceipt[];
  unverified_claims: string[];
}

export interface StationRoom {
  id: string;
  name: string;
  role: string;
  agent_class: AgentClass;
  x: number; // percentage or grid position
  y: number;
  width: number;
  height: number;
  color: string;
  accent: string;
  bgRgba: string;
  allowed_capabilities: string[];
  active_agent?: AgentClass | null;
  activity_state: 'idle' | 'receiving' | 'working' | 'transmitting' | 'alert';
  current_thought?: string;
  progress?: number;
  workspace_files: { name: string; size: string; hash: string }[];
}

export interface StationHallway {
  id: string;
  from_room_id: string;
  to_room_id: string;
  label: string;
  authorized_overlap: string[];
  active: boolean;
  agent_in_transit?: AgentClass | null;
  transit_progress?: number; // 0 to 100
}

export interface AgentSpriteState {
  agent_class: AgentClass;
  name: string;
  title: string;
  color: string;
  current_location: string; // 'orchestrator_hub' | room_id | hallway_id
  target_location?: string;
  position: { x: number; y: number };
  state: 'idle' | 'walking' | 'working' | 'thinking' | 'reporting';
  thought?: string;
  progress?: number;
}
