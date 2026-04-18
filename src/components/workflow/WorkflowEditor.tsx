import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Play, Database, Cpu, Zap, MessageSquare, Briefcase,
  Cloud, Layers, Webhook, Code, Layout, Search,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store';

interface NodeProps {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
  onDrag: (id: string, dx: number, dy: number) => void;
}

const WorkflowNode = ({ id, type, title, subtitle, x, y, icon, color, highlight, onDrag }: NodeProps) => {
  const setSelectedNode = useStore(state => state.setSelectedNode);

  const handleNodeClick = () => {
    const mockCode = `// n8n Node: ${title}\n// Type: ${type.toUpperCase()}\n\nexport default {\n  displayName: '${title}',\n  name: '${id}',\n  icon: 'fa:${type}',\n  group: ['transform'],\n  version: 1,\n  description: '${subtitle}',\n  defaults: {\n    name: '${title}',\n  },\n  inputs: ['main'],\n  outputs: ['main'],\n  properties: [\n    {\n      displayName: 'Resource',\n      name: 'resource',\n      type: 'options',\n      options: [],\n      default: 'user',\n    },\n  ],\n};`;
    setSelectedNode({ id, code: mockCode });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onPan={(e, info) => onDrag(id, info.delta.x, info.delta.y)}
      onClick={handleNodeClick}
      className={cn(
        "absolute p-4 rounded-xl border-2 transition-colors cursor-grab active:cursor-grabbing select-none",
        "bg-[#1a1b26]/90 backdrop-blur-md shadow-lg",
        highlight ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "border-white/5 hover:border-white/20"
      )}
      style={{
        left: x,
        top: y,
        width: 240,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="p-3 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{title}</h4>
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono mt-1 font-semibold">{type}</p>
          <p className="text-[11px] text-white/60 truncate mt-1">{subtitle}</p>
        </div>
      </div>
      {/* Connection points */}
      <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#1a1b26]" />
      <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#1a1b26]" />
    </motion.div>
  );
};

const Connection = ({ start, end, dashed = false, color = "#3b82f6" }: { start: [number, number], end: [number, number], dashed?: boolean, color?: string }) => {
  const [x1, y1] = start;
  const [x2, y2] = end;

  // Control points for the curve
  const dx = Math.abs(x2 - x1);
  const cx1 = x1 + dx / 2;
  const cy1 = y1;
  const cx2 = x2 - dx / 2;
  const cy2 = y2;

  const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={color} />
        </marker>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={dashed ? "5,5" : "none"}
        className={cn(!dashed && "animate-pulse")}
        style={{ opacity: 0.2 }}
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray={dashed ? "5,5" : "none"}
      />
    </svg>
  );
};

export const WorkflowEditor = () => {
  const { workflowSidebarOpen: isSidebarOpen, setWorkflowSidebarOpen: setIsSidebarOpen } = useStore();
  const [showHUD, setShowHUD] = useState(true);

  // Define nodes in state so they can be moved
  const [nodes, setNodes] = useState([
    { id: '1', type: 'trigger', title: 'On Create User Form', subtitle: 'Webhook reception', x: 300, y: 200, icon: <Play size={18} />, color: '#ef4444' },
    { id: '2', type: 'ai_agent', title: 'Shockwave Sales AI', subtitle: 'Core decision engine', x: 630, y: 200, icon: <Cpu size={18} />, color: '#8b5cf6', highlight: true },
    { id: '3', type: 'branch', title: 'If High Potential?', subtitle: 'Lead scoring branch', x: 960, y: 200, icon: <Layers size={18} />, color: '#f59e0b' },
    { id: '4', type: 'slack', title: 'Slack Notify', subtitle: 'Operations channel', x: 1290, y: 100, icon: <MessageSquare size={18} />, color: '#e01e5a' },
    { id: '5', type: 'jira', title: 'Jira Create Issue', subtitle: 'Sales follow-up', x: 1290, y: 300, icon: <Briefcase size={18} />, color: '#0052cc' },
    { id: 'r1', type: 'database', title: 'Anthropic Claude 3.5', subtitle: 'LLM Resource', x: 530, y: 450, icon: <Cloud size={16} />, color: '#10b981' },
    { id: 'r2', type: 'database', title: 'PostgreSQL Memory', subtitle: 'Thread storage', x: 730, y: 450, icon: <Database size={16} />, color: '#10b981' },
    { id: 'r3', type: 'audio', title: 'Whisper Audio Transcriber', subtitle: 'Audio to text logic', x: 450, y: 600, icon: <Webhook size={16} />, color: '#06b6d4' },
  ]);

  const onDragNode = (id: string, dx: number, dy: number) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, x: node.x + dx, y: node.y + dy } : node
    ));
  };

  const getNodePos = (id: string, type: 'start' | 'end'): [number, number] => {
    const node = nodes.find(n => n.id === id);
    if (!node) return [0, 0];
    // connection points: left side is start (input), right side is end (output)
    if (type === 'end') {
      return [node.x + 240, node.y + 40]; // right middle
    } else {
      return [node.x, node.y + 40]; // left middle
    }
  };

  return (
    <div className="w-full h-full bg-[#11121d] relative overflow-hidden font-sans flex text-white">
      {/* Node Library Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isSidebarOpen ? 256 : 0,
          opacity: isSidebarOpen ? 1 : 0,
          marginRight: isSidebarOpen ? 0 : -256
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="border-r border-white/5 bg-[#1a1b26]/50 backdrop-blur-md flex flex-col z-20 overflow-hidden relative"
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between min-w-[256px]">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Bibliotecas</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 min-w-[256px]">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-widest mb-3 block">Principais</span>
            <div className="space-y-1">
              {['Trigger', 'AI Agent', 'Branch', 'HTTP Request', 'Webhook'].map((item, i) => (
                <div key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer text-sm text-white/60 hover:text-white transition-all">
                  <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                    <Zap size={12} className={i === 1 ? "text-purple-400" : "text-blue-400"} />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-green-400 tracking-widest mb-3 block">Integrações</span>
            <div className="space-y-1">
              {['Slack', 'Jira', 'Postgres', 'Anthropic', 'WhatsApp'].map((item) => (
                <div key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer text-sm text-white/60 hover:text-white transition-all">
                  <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                    <Webhook size={12} className="text-green-400" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toggle Button */}
      {!isSidebarOpen && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsSidebarOpen(true)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-3 bg-[#1a1b26] border border-blue-500/30 rounded-full text-blue-400 hover:text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] group overflow-hidden"
        >
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <ChevronRight size={24} />
        </motion.button>
      )}

      {/* Workflow Canvas */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* Shockwave Trademark Headline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: showHUD ? 1 : 0,
            y: showHUD ? 0 : -20,
            scale: showHUD ? 1 : 0.95
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center pointer-events-none select-none text-center"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Systems Architecture</span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/20" />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tighter text-white leading-none shadow-2xl">
            SHOCKWAVE<span className="text-white/20">™</span>
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/10">Sales Automation</span>
            <div className="h-0.5 w-0.5 rounded-full bg-white/10" />
            <span className="text-[10px] font-mono text-white/5 uppercase tracking-widest leading-none">V2.4.9-Stable</span>
          </div>
        </motion.div>

        {/* Background Dots */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #4a4d6d 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />

        <div
          className="absolute inset-0 p-20 overflow-auto"
          onScroll={(e) => {
            const scrollTop = e.currentTarget.scrollTop;
            if (scrollTop > 50 && showHUD) setShowHUD(false);
            if (scrollTop <= 50 && !showHUD) setShowHUD(true);
          }}
        >
          <div className="relative min-w-[2000px] min-h-[1000px]">
            {/* Connections */}
            <Connection start={getNodePos('1', 'end')} end={getNodePos('2', 'start')} color="#4a4d6d" />
            <Connection start={getNodePos('2', 'end')} end={getNodePos('3', 'start')} color="#4a4d6d" />
            <Connection start={getNodePos('3', 'end')} end={getNodePos('4', 'start')} color="#4a4d6d" />
            <Connection start={getNodePos('3', 'end')} end={getNodePos('5', 'start')} color="#4a4d6d" />
            
            {/* Resource Connections */}
            <Connection start={getNodePos('r1', 'end')} end={[getNodePos('2', 'start')[0] + 60, getNodePos('2', 'start')[1] + 40]} color="#10b981" dashed />
            <Connection start={getNodePos('r2', 'end')} end={[getNodePos('2', 'start')[0] + 120, getNodePos('2', 'start')[1] + 40]} color="#10b981" dashed />
            <Connection start={getNodePos('r3', 'end')} end={[getNodePos('2', 'start')[0] + 0, getNodePos('2', 'start')[1] + 40]} color="#06b6d4" dashed />

            {/* Nodes */}
            {nodes.map(node => (
              <WorkflowNode key={node.id} {...node} onDrag={onDragNode} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};