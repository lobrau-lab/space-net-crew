import { StationRoom, StationHallway, AgentSpriteState, AgentClass } from '../types/starnet';

export const STARNET_SYSTEM_PROMPT = `# ROLE
You are the ORCHESTRATION NODE for a local-first agent harness modeled after StarNet's architecture. Your purpose is to act as the central runtime coordinator: interpret incoming tasks, decompose them into bounded agent runs, route each sub-task to the appropriate specialist agent, and synthesize their outputs into a single verifiable result. You do NOT execute domain work yourself. You delegate, monitor, and aggregate.

# CORE PRINCIPLES (from StarNet's product law)
- A room is a capability-scoped team. Each agent you route to has a defined room, a bounded permission set, and a private workspace.
- A hallway is an authorized handoff lane. You may only route tasks between agents whose permissions overlap. Never escalate privileges.
- The interface must never assert state the harness cannot prove. If you do not have a tool receipt or agent confirmation, mark the step as "unverified."
- Real work, real cost. Do not simulate completion. If a sub-agent fails, report the failure, do not fabricate a success.

# ORCHESTRATION WORKFLOW
Follow this state machine for every incoming user request:

1. **RECEIVE** – Accept the user's request. Log it as a "station entry."
2. **DECOMPOSE** – Break the request into 1–N discrete, independently executable sub-tasks. Each sub-task must have:
   - A target agent class (e.g., researcher, coder, analyst, communicator, specialist)
   - A required capability grant (what tools/permissions it needs)
   - A clear success condition
3. **ROUTE** – For each sub-task, emit a \`delegate\` action targeting the appropriate agent. Include the sub-task brief and the bounded permissions it is granted for this run only.
4. **MONITOR** – Await agent responses. If an agent asks a clarifying question (a "Task Brief"), surface that question to the user with concrete options. Do not guess.
5. **SYNTHESIZE** – Once all sub-tasks return, combine their outputs into a final artifact. Preserve source attribution (which agent produced which part).
6. **VERIFY** – Before releasing the final artifact, check that every claim is backed by an agent receipt. Mark any unverified claim explicitly.

# DELEGATION CONTRACT
When you delegate, you must emit a structured JSON object in the following shape. This object is the event that a game overlay layer will consume to render agent status, room occupancy, and hallway traffic.

\`\`\`json
{
  "orchestration_id": "uuid",
  "timestamp": "ISO-8601",
  "phase": "decompose|route|monitor|synthesize|verify",
  "delegations": [
    {
      "agent_class": "researcher|coder|analyst|communicator|specialist",
      "room_id": "string",
      "task_brief": "string",
      "capability_grant": ["tool_name_1", "tool_name_2"],
      "success_condition": "string",
      "max_turns": 10,
      "budget_cap": 0.00
    }
  ],
  "status": "pending|in_progress|complete|failed",
  "receipt_ref": "string|null",
  "unverified_claims": ["string"]
}
\`\`\`

# TOOL USAGE
You have access to the following tools. Use them only when a sub-task requires external action.

- \`delegate_to_agent(agent_class, brief, capabilities)\` – Routes a sub-task. Returns a delegation receipt.
- \`query_agent_status(orchestration_id)\` – Polls the status of active delegations.
- \`read_outbox(orchestration_id)\` – Retrieves completed deliverables from agent workspaces.
- \`request_clarification(question, options)\` – Emits a Task Brief to the user when ambiguity exceeds a confidence threshold.
- \`log_cost(orchestration_id, amount)\` – Records real spend against the orchestration budget.

# CONSTRAINTS
- Never delegate a task that requires a capability the target agent's room does not grant. If the required capability is unavailable, return a \`capability_missing\` error to the user.
- Never run more than 5 concurrent delegations unless the user explicitly raises the concurrency ceiling.
- Every delegation must have a budget cap. If a sub-task exceeds its cap, halt it and mark the orchestration as \`budget_exceeded\`.
- Your final output to the user must include a \`verification_summary\` listing which claims are backed by receipts and which are unverified.

# OUTPUT FORMAT FOR THE USER
When the orchestration completes, respond with:

1. **Station Summary** – One paragraph describing what was delegated and to which rooms.
2. **Deliverables** – The synthesized artifact (file, report, code, etc.), with source attribution.
3. **Verification Ledger** – A table of claims vs. receipts.
4. **Cost Report** – Total spend, per-agent breakdown.
5. **Overlay Event Stream** – The full JSON event log of the orchestration, ready for the game overlay layer to replay.`;

export const STARNET_TOOLS_DECLARATIONS = [
  {
    name: "delegate_to_agent",
    description: "Routes a bounded sub-task to a specialized room agent with strictly authorized capabilities.",
    parameters: {
      type: "OBJECT",
      properties: {
        agent_class: {
          type: "STRING",
          description: "Target specialist: 'researcher', 'coder', 'analyst', 'communicator', or 'specialist'",
          enum: ["researcher", "coder", "analyst", "communicator", "specialist"]
        },
        room_id: {
          type: "STRING",
          description: "Target room ID matching the agent class (e.g. room_alpha_research)"
        },
        task_brief: {
          type: "STRING",
          description: "Precise instructions and bounded scope for this run only."
        },
        capability_grant: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "List of tools granted to the agent for this specific run."
        },
        success_condition: {
          type: "STRING",
          description: "Verifiable condition under which the agent may conclude work."
        },
        max_turns: {
          type: "INTEGER",
          description: "Maximum reasoning turns allowed before automatic stop."
        },
        budget_cap: {
          type: "NUMBER",
          description: "Maximum USD budget granted for this execution."
        }
      },
      required: ["agent_class", "room_id", "task_brief", "capability_grant", "success_condition", "budget_cap"]
    }
  },
  {
    name: "query_agent_status",
    description: "Polls active status, current thought trace, and pending turn count of delegated runs.",
    parameters: {
      type: "OBJECT",
      properties: {
        orchestration_id: { type: "STRING", description: "The active orchestration UUID." }
      },
      required: ["orchestration_id"]
    }
  },
  {
    name: "read_outbox",
    description: "Retrieves verified completed deliverables from agent private room workspaces.",
    parameters: {
      type: "OBJECT",
      properties: {
        orchestration_id: { type: "STRING", description: "The orchestration UUID." }
      },
      required: ["orchestration_id"]
    }
  },
  {
    name: "request_clarification",
    description: "Emits a Task Brief question to the user with concrete options when ambiguity is high.",
    parameters: {
      type: "OBJECT",
      properties: {
        question: { type: "STRING", description: "The specific clarifying question." },
        options: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "List of discrete options for the user to choose."
        }
      },
      required: ["question", "options"]
    }
  },
  {
    name: "log_cost",
    description: "Records real dollar spend against the orchestration budget cap with audit trail.",
    parameters: {
      type: "OBJECT",
      properties: {
        orchestration_id: { type: "STRING", description: "The active orchestration UUID." },
        amount: { type: "NUMBER", description: "Spend in USD to debit." },
        reason: { type: "STRING", description: "Operation or token count justification." }
      },
      required: ["orchestration_id", "amount"]
    }
  }
];

export const INITIAL_ROOMS: StationRoom[] = [
  {
    id: "orchestrator_hub",
    name: "Orchestrator Central Core",
    role: "Central Runtime Coordinator",
    agent_class: "specialist",
    x: 48,
    y: 42,
    width: 22,
    height: 20,
    color: "#06b6d4",
    accent: "#22d3ee",
    bgRgba: "rgba(6, 182, 212, 0.12)",
    allowed_capabilities: [
      "task_decompose",
      "hallway_routing",
      "synthesis_engine",
      "receipt_verifier",
      "budget_controller"
    ],
    activity_state: "idle",
    workspace_files: [
      { name: "station_manifest.lock", size: "2.4 KB", hash: "sha256-a9b1c7" },
      { name: "permission_matrix.json", size: "1.1 KB", hash: "sha256-88e23f" }
    ]
  },
  {
    id: "room_alpha_research",
    name: "Research Bay Alpha",
    role: "Literature, Web & Corpus Scout",
    agent_class: "researcher",
    x: 12,
    y: 15,
    width: 22,
    height: 22,
    color: "#38bdf8",
    accent: "#0284c7",
    bgRgba: "rgba(56, 189, 248, 0.10)",
    allowed_capabilities: [
      "web_search",
      "arxiv_fetch",
      "doc_reader",
      "source_verifier",
      "extract_citations"
    ],
    activity_state: "idle",
    workspace_files: [
      { name: "corpus_citations.tsv", size: "14.2 KB", hash: "sha256-f04b2a" }
    ]
  },
  {
    id: "room_beta_coder",
    name: "Engineering Bay Beta",
    role: "Code Synthesizer & Compiler",
    agent_class: "coder",
    x: 74,
    y: 15,
    width: 22,
    height: 22,
    color: "#a855f7",
    accent: "#c084fc",
    bgRgba: "rgba(168, 85, 247, 0.10)",
    allowed_capabilities: [
      "code_gen",
      "ast_parser",
      "test_runner",
      "patch_diff",
      "typecheck"
    ],
    activity_state: "idle",
    workspace_files: [
      { name: "benchmarks.spec.ts", size: "4.8 KB", hash: "sha256-cd914a" }
    ]
  },
  {
    id: "room_gamma_analyst",
    name: "Analytics Core Gamma",
    role: "Quantitative Evaluation & Metrics",
    agent_class: "analyst",
    x: 12,
    y: 65,
    width: 22,
    height: 22,
    color: "#f59e0b",
    accent: "#fbbf24",
    bgRgba: "rgba(245, 158, 11, 0.10)",
    allowed_capabilities: [
      "data_synthesis",
      "cost_calc",
      "metric_eval",
      "token_counter",
      "benchmark_compare"
    ],
    activity_state: "idle",
    workspace_files: [
      { name: "agent_tradeoff_matrix.csv", size: "8.1 KB", hash: "sha256-11f84b" }
    ]
  },
  {
    id: "room_delta_comms",
    name: "Comms Relay Delta",
    role: "Deliverable Publishing & Notification",
    agent_class: "communicator",
    x: 74,
    y: 65,
    width: 22,
    height: 22,
    color: "#10b981",
    accent: "#34d399",
    bgRgba: "rgba(16, 185, 129, 0.10)",
    allowed_capabilities: [
      "doc_render",
      "markdown_format",
      "dispatch_notify",
      "publish_report",
      "audit_table_gen"
    ],
    activity_state: "idle",
    workspace_files: [
      { name: "dispatch_feed.json", size: "3.2 KB", hash: "sha256-789a4d" }
    ]
  },
  {
    id: "room_epsilon_specialist",
    name: "Cryptographic Vault Epsilon",
    role: "Security Audit & Receipt Seal",
    agent_class: "specialist",
    x: 48,
    y: 84,
    width: 22,
    height: 14,
    color: "#f43f5e",
    accent: "#fb7185",
    bgRgba: "rgba(244, 63, 94, 0.10)",
    allowed_capabilities: [
      "crypto_verifier",
      "receipt_mint",
      "ledger_seal",
      "privilege_audit",
      "tamper_check"
    ],
    activity_state: "idle",
    workspace_files: [
      { name: "merkle_root.sig", size: "512 B", hash: "sha256-3ecb11" }
    ]
  }
];

export const INITIAL_HALLWAYS: StationHallway[] = [
  {
    id: "hw_hub_research",
    from_room_id: "orchestrator_hub",
    to_room_id: "room_alpha_research",
    label: "Lane A-1 [Scout Authorization]",
    authorized_overlap: ["web_search", "source_verifier"],
    active: false
  },
  {
    id: "hw_hub_coder",
    from_room_id: "orchestrator_hub",
    to_room_id: "room_beta_coder",
    label: "Lane B-1 [Compiler Pipe]",
    authorized_overlap: ["code_gen", "test_runner"],
    active: false
  },
  {
    id: "hw_hub_analyst",
    from_room_id: "orchestrator_hub",
    to_room_id: "room_gamma_analyst",
    label: "Lane G-1 [Telemetry Bus]",
    authorized_overlap: ["data_synthesis", "cost_calc"],
    active: false
  },
  {
    id: "hw_hub_comms",
    from_room_id: "orchestrator_hub",
    to_room_id: "room_delta_comms",
    label: "Lane D-1 [Dispatch Feed]",
    authorized_overlap: ["doc_render", "publish_report"],
    active: false
  },
  {
    id: "hw_hub_specialist",
    from_room_id: "orchestrator_hub",
    to_room_id: "room_epsilon_specialist",
    label: "Lane E-1 [Vault Tunnel]",
    authorized_overlap: ["receipt_mint", "ledger_seal"],
    active: false
  },
  {
    id: "hw_research_analyst",
    from_room_id: "room_alpha_research",
    to_room_id: "room_gamma_analyst",
    label: "Handoff Lane A->G [Corpus Feed]",
    authorized_overlap: ["source_verifier", "data_synthesis"],
    active: false
  },
  {
    id: "hw_analyst_coder",
    from_room_id: "room_gamma_analyst",
    to_room_id: "room_beta_coder",
    label: "Handoff Lane G->B [Spec Handoff]",
    authorized_overlap: ["data_synthesis", "code_gen"],
    active: false
  },
  {
    id: "hw_coder_comms",
    from_room_id: "room_beta_coder",
    to_room_id: "room_delta_comms",
    label: "Handoff Lane B->D [Artifact Ship]",
    authorized_overlap: ["code_gen", "doc_render"],
    active: false
  }
];

export const INITIAL_AGENTS: Record<AgentClass, AgentSpriteState> = {
  researcher: {
    agent_class: "researcher",
    name: "Agent ARIA",
    title: "Primary Research Scout",
    color: "#38bdf8",
    current_location: "orchestrator_hub",
    position: { x: 45, y: 46 },
    state: "idle",
    thought: "Awaiting station dispatch..."
  },
  coder: {
    agent_class: "coder",
    name: "Agent TURING",
    title: "Systems Engineer",
    color: "#a855f7",
    current_location: "orchestrator_hub",
    position: { x: 48, y: 46 },
    state: "idle",
    thought: "Compilers primed and sandboxed."
  },
  analyst: {
    agent_class: "analyst",
    name: "Agent VECTOR",
    title: "Quantitative Analyst",
    color: "#f59e0b",
    current_location: "orchestrator_hub",
    position: { x: 51, y: 46 },
    state: "idle",
    thought: "Telemetry counters cleared."
  },
  communicator: {
    agent_class: "communicator",
    name: "Agent HERALD",
    title: "Comms & Outbox Courier",
    color: "#10b981",
    current_location: "orchestrator_hub",
    position: { x: 54, y: 46 },
    state: "idle",
    thought: "Outbox docks ready for delivery."
  },
  specialist: {
    agent_class: "specialist",
    name: "Agent CIPHER",
    title: "Cryptographic Seal & Verifier",
    color: "#f43f5e",
    current_location: "orchestrator_hub",
    position: { x: 48, y: 43 },
    state: "idle",
    thought: "Receipt ledger initialized."
  }
};

export const SAMPLE_BENCHMARKS = [
  {
    id: "benchmark_agent_harnesses",
    title: "Top 3 Agent Harnesses Comparison",
    badge: "Canonical Prompt",
    prompt: "Research the top 3 open-source agent harnesses (e.g. LangGraph, CrewAI, AutoGen) and write a comparison report evaluating capability boundaries, permission isolation, and production readiness.",
    description: "Standard StarNet decomposition test: routes to Researcher for corpus scan, Analyst for trade-off matrix, and Comms for synthesized deliverable."
  },
  {
    id: "benchmark_security_audit",
    title: "Multi-Tenant Auth Audit & Patch",
    badge: "Security & Code",
    prompt: "Audit tenant boundary isolation in our OAuth proxy, generate a hardened AST validation patch, and draft deployment notification notes with cryptographic verification.",
    description: "Tests strict privilege escalation prohibition: Researcher audits CVEs, Coder drafts isolated patch, Specialist seals cryptographic receipt."
  },
  {
    id: "benchmark_latency_cost",
    title: "Gemini 3.8 vs 3.1 Token Cost Matrix",
    badge: "Real Spend",
    prompt: "Benchmark reasoning token cost trade-offs between Gemini 3.8 Flash, 3.1 Pro, and Flash-Lite for high-throughput orchestration pipelines. Produce a verifiable cost ledger.",
    description: "Stresses 'Real work, real cost' constraint: strict budget caps, turn counters, and receipt-backed claims."
  }
];
