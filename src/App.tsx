import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from './store';
import { Sidebar, Header } from './components/layout/Shell';
import { WorkflowEditor } from './components/workflow/WorkflowEditor';
import { Filter, Minimize, X, Code2, Cpu, UserCheck, AlertCircle, TrendingUp, ShieldAlert, Hourglass, MessageCircle, Settings } from 'lucide-react';
import { cn } from './lib/utils';
export default function App() {
const { currentView, immersionMode, setImmersionMode, selectedNode, setSelectedNode } = useStore();
const [systemLogs, setSystemLogs] = useState<string[]>([]);
const [crmFilter, setCrmFilter] = useState<'all' | 'alto' | 'baixo' | 'inelegivel' | 'triagem'>('all');
useEffect(() => {
const logInterval = setInterval(() => {
const logs = [
'[SEC] DATA ENCRYPTION: ACTIVE',
'[SYS] BPC/LOAS SYNC: SUCCESS',
'[AI] REASONING ENGINE: ONLINE',
'[NET] LATENCY: 14MS',
'[CRM] LEADS INGESTED: 42',
'[AUTH] ELITE ACCESS GRANTED'
];
setSystemLogs(prev => [...prev.slice(-3), logs[Math.floor(Math.random() * logs.length)]]);
}, 1500);
return () => {
clearInterval(logInterval);
};
}, []);
return (
<div className="flex h-screen w-screen bg-[#020205] text-white">
<Sidebar />
<main className="flex-1 flex flex-col relative overflow-hidden bg-[#020205]">
<Header />
<div className={cn(
"flex-1 relative bg-[#020205]",
immersionMode && "fixed inset-0 z-[9999] w-screen h-screen"
)}>
{immersionMode && (
<button
onClick={() => setImmersionMode(false)}
className="absolute top-8 right-8 z-[10000] p-4 bg-blue-600 hover:bg-blue-700 rounded-full text-white shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all animate-pulse"
title="Sair da Imersão"
>
<Minimize size={28} />
</button>
)}
<div className="absolute inset-0 w-full h-full">
{/* Professional Background Gradient */}
<div className="absolute inset-0 bg-[#020205] bg-[radial-gradient(circle_at_50%_50%,#0a0a25_0%,#020205_100%)] z-0" />
<div className="relative w-full h-full z-10 flex flex-col">
{currentView === 'flow' ? (
<div className="flex-1 relative h-full w-full">
<div className="flex-1 relative h-full w-full bg-[#11121d] overflow-hidden">
<WorkflowEditor />
</div>
{/* Node Code Inspection Overlay */}
<AnimatePresence>
{selectedNode && (
<motion.div
initial={{ opacity: 0, scale: 0.9, x: 100 }}
animate={{ opacity: 1, scale: 1, x: 0 }}
exit={{ opacity: 0, scale: 0.9, x: 100 }}
className="fixed right-10 top-24 bottom-24 w-[500px] z-[10001] bg-[#0c0c15] border border-blue-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
>
<div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
<div className="flex items-center gap-3">
<div className="p-2 bg-blue-500/20 rounded-lg">
<Code2 size={24} className="text-blue-400" />
</div>
<div>
<h4 className="text-sm font-bold tracking-widest uppercase">Node Inspector</h4>
<p className="text-[10px] text-white/40 font-mono">ID: {selectedNode.id}</p>
</div>
</div>
<button
onClick={() => setSelectedNode(null)}
className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
>
<X size={20} />
</button>
</div>
<div className="flex-1 p-8 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-blue-100/90">
<div className="flex items-center gap-3 mb-6 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
<Cpu size={16} className="text-blue-400" />
<span className="text-[10px] uppercase font-bold text-blue-400">Execution Logic</span>
</div>
<code>{selectedNode.code}</code>
</div>
<div className="p-6 border-t border-white/10 bg-black/40">
<button
onClick={() => setSelectedNode(null)}
className="w-full py-4 bg-brand-primary hover:bg-brand-primary/80 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-500/40 transform active:scale-95"
>
Fechar Inspeção
</button>
</div>
</motion.div>
)}
</AnimatePresence>
</div>
) : currentView === 'crm' ? (
<div className="flex-1 w-full h-full relative overflow-hidden bg-[#020205]">
<div className="absolute inset-0 overflow-y-auto custom-scrollbar scrollbar-left">
<div className="p-4 md:p-8 scrollbar-left-content max-w-full mx-auto">
{/* Header Section from Print */}
<div className="mb-8">
<h3 className="text-3xl font-bold text-white mb-2">Leads / CRM de Triagem</h3>
<p className="text-sm text-white/30 font-medium">Atualiza em tempo real conforme chegam novas sessões</p>
</div>
{/* Filter Tabs from Print */}
<div className="flex flex-wrap gap-2.5 mb-8">
<button
onClick={() => setCrmFilter('all')}
className={cn(
"px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all shadow-lg",
crmFilter === 'all' ? "bg-brand-primary text-white shadow-indigo-500/20" : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
)}
>
Todos
</button>
<button
onClick={() => setCrmFilter('alto')}
className={cn(
"px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all",
crmFilter === 'alto' ? "bg-green-500/20 text-green-400 border border-green-500/50" : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
)}
>
<div className={cn("w-2.5 h-2.5 rounded-full bg-green-500", crmFilter !== 'alto' && "opacity-50")} /> Ticket Alto
</button>
<button
onClick={() => setCrmFilter('baixo')}
className={cn(
"px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all",
crmFilter === 'baixo' ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
)}
>
<div className={cn("w-2.5 h-2.5 rounded-full bg-yellow-500", crmFilter !== 'baixo' && "opacity-50")} /> Ticket Baixo
</button>
<button
onClick={() => setCrmFilter('triagem')}
className={cn(
"px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all",
crmFilter === 'triagem' ? "bg-purple-500/20 text-purple-400 border border-purple-500/50" : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
)}
>
<Hourglass size={15} className={cn("text-purple-400", crmFilter !== 'triagem' && "opacity-50")} /> Em triagem
</button>
<button
onClick={() => setCrmFilter('inelegivel')}
className={cn(
"px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all",
crmFilter === 'inelegivel' ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
)}
>
<ShieldAlert size={15} className={cn("text-red-500", crmFilter !== 'inelegivel' && "opacity-50")} /> Inelegíveis
</button>
</div>
{/* Sub-header Stats */}
<div className="flex items-center justify-between mb-6 px-1">
<div className="flex items-center gap-2.5 px-4 py-2 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
<TrendingUp size={14} className="text-brand-primary" />
<span className="text-[11px] font-bold text-brand-primary uppercase tracking-widest">
Filtro Ativo: {crmFilter === 'all' ? 'Todos' : crmFilter === 'alto' ? 'Ticket Alto' : crmFilter === 'baixo' ? 'Ticket Baixo' : crmFilter === 'triagem' ? 'Em triagem' : 'Inelegíveis'}
</span>
</div>
<span className="text-xs text-white/20 font-bold uppercase tracking-widest">10 leads exibidos</span>
</div>
{/* Header Labels - Alinhamento Rigoroso */}
<div className="grid grid-cols-12 gap-0 px-8 py-4 text-[10px] font-black text-white/10 uppercase tracking-[0.2em] border-b border-white/5 bg-white/[0.01]">
<div className="col-span-3">Identificação</div>
<div className="col-span-2 text-center">Ticket</div>
<div className="col-span-2 text-center">Renda</div>
<div className="col-span-2 text-center">Data</div>
<div className="col-span-2 text-center">Hora</div>
<div className="col-span-1 text-right">Ação</div>
</div>
{/* Card List */}
<div className="space-y-2 mt-4">
{[
{ name: 'Aguardando consulta', phone: '+7078549027', cpf: '---.---.---', status: 'Em triagem', color: '#a855f7', income: '---', date: '16/04/2026', time: '13:39:08' },
{ name: 'Aguardando consulta', phone: '+1242579505', cpf: '---.---.---', status: 'Em triagem', color: '#a855f7', income: '---', date: '16/04/2026', time: '13:14:37' },
{ name: 'Ricardo Santos', phone: '+5511998877', cpf: '123.456.789', status: 'Ticket ALTO', color: '#10b981', income: 'R$ 8.000,00', date: '16/04/2026', time: '11:45:30' },
{ name: 'Maria Oliveira', phone: '+5521991234', cpf: '456.789.012', status: 'Ticket BAIXO', color: '#f59e0b', income: 'R$ 1.200,00', date: '16/04/2026', time: '10:15:44' },
{ name: 'João Pereira', phone: '+5531988123', cpf: '---.---.---', status: 'Inelegível', color: '#ef4444', income: '---', date: '16/04/2026', time: '09:44:12' },
{ name: 'Wagner Moura', phone: '+5571999887', cpf: '789.012.345', status: 'Ticket ALTO', color: '#10b981', income: 'R$ 12.000,00', date: '15/04/2026', time: '21:30:45' },
{ name: 'Tais Araújo', phone: '+5571988776', cpf: '321.654.987', status: 'Ticket ALTO', color: '#10b981', income: 'R$ 7.500,00', date: '15/04/2026', time: '20:15:33' },
{ name: 'Roberto Carlos', phone: '+5511912345', cpf: '111.000.111', status: 'Ticket ALTO', color: '#10b981', income: 'R$ 45.000,00', date: '15/04/2026', time: '19:44:55' },
].filter(lead => {
if (crmFilter === 'all') return true;
if (crmFilter === 'alto') return lead.status === 'Ticket ALTO';
if (crmFilter === 'baixo') return lead.status === 'Ticket BAIXO';
if (crmFilter === 'inelegivel') return lead.status === 'Inelegível';
if (crmFilter === 'triagem') return lead.status === 'Em triagem';
return true;
}).map((lead, i) => (
<motion.div
key={i}
initial={{ opacity: 0, x: -10 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: i * 0.03 }}
className={cn(
"bg-white/[0.02] border border-white/5 rounded-xl px-8 py-3 hover:bg-white/[0.05] hover:border-white/10 transition-all group relative overflow-hidden",
lead.status === 'Ticket ALTO' && "border-green-500/40 bg-green-500/[0.03]"
)}
>
{/* Pulse Effect for Ticket Alto */}
{lead.status === 'Ticket ALTO' && (
<motion.div
animate={{
opacity: [0.1, 0.4, 0.1],
scale: [1, 1.02, 1],
}}
transition={{
repeat: Infinity,
duration: 2,
ease: "easeInOut"
}}
className="absolute inset-0 bg-green-500/10 pointer-events-none"
/>
)}
<div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom, ${lead.color}, transparent)` }} />
<div className="grid grid-cols-12 gap-0 items-center relative z-10">
{/* Identificação (Nome + CPF) */}
<div className="col-span-3 flex items-center gap-3 overflow-hidden">
<div className="min-w-0">
<p className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors truncate">{lead.name}</p>
<p className="text-[10px] text-white/20 font-mono flex items-center gap-1.5">
<span className="opacity-50">CPF:</span> {lead.cpf}
</p>
</div>
</div>
{/* Ticket Status */}
<div className="col-span-2 flex justify-center">
<span
className="px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-2"
style={{ backgroundColor: `${lead.color}15`, color: lead.color, border: `1px solid ${lead.color}25` }}
>
<div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: lead.color }} />
{lead.status === 'Ticket ALTO' ? 'ALTO' : lead.status === 'Ticket BAIXO' ? 'BAIXO' : lead.status.toUpperCase()}
</span>
</div>
{/* Renda */}
<div className="col-span-2 text-center">
<span className="text-xs font-bold text-white/40 font-mono tracking-tighter">{lead.income}</span>
</div>
{/* Data */}
<div className="col-span-2 text-center text-[10px] font-bold text-white/30 whitespace-nowrap">
{lead.date}
</div>
{/* Hora */}
<div className="col-span-2 text-center text-[10px] text-white/10 font-mono">
{lead.time}
</div>
{/* WhatsApp Button */}
<div className="col-span-1 text-right flex justify-end">
<button 
  onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`, '_blank')}
  className="p-2 bg-[#25d366]/5 border border-[#25d366]/10 rounded-lg text-[#25d366] hover:bg-[#25d366] hover:text-white transition-all shadow-lg active:scale-95 group-hover:shadow-[#25d366]/20"
>
<MessageCircle size={14} className="fill-current" />
</button>
</div>
</div>
</motion.div>
))}
</div>
</div>
</div>
</div>
) : (
<div className="flex-1 w-full h-full relative overflow-hidden bg-[#020205] flex items-center justify-center p-20">
<div className="max-w-2xl w-full bg-white/[0.03] border border-white/5 rounded-3xl p-12 text-center">
<div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-primary/30">
<Settings size={32} className="text-brand-primary" />
</div>
<h2 className="text-2xl font-bold mb-4">Parâmetros do Sistema</h2>
<p className="text-white/40 text-sm leading-relaxed mb-8">
Aqui você poderá configurar os limites de processamento, chaves de API do agente Shockwave e parâmetros globais do CRM BPC/LOAS.
</p>
<div className="grid grid-cols-2 gap-4">
<div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/30 text-left relative overflow-hidden hover:border-green-500/50 transition-colors">
<div className="absolute top-6 right-6 flex items-center gap-2">
<span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Ativo</span>
<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
</div>
<span className="text-[10px] uppercase font-black text-green-400 tracking-widest mb-2 block">Agent AI</span>
<p className="text-xs text-white/60 pr-12">Configurações de raciocínio e temperatura dos modelos LLM.</p>
</div>
<div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/30 text-left relative overflow-hidden hover:border-green-500/50 transition-colors">
<div className="absolute top-6 right-6 flex items-center gap-2">
<span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Ativo</span>
<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
</div>
<span className="text-[10px] uppercase font-black text-green-400 tracking-widest mb-2 block">CRM Sync</span>
<p className="text-xs text-white/60 pr-12">Integração de Webhooks e notificações do WhatsApp.</p>
</div>
</div>
</div>
</div>
)}
</div>
</div>
</div>
{/* Global Footer Status Bar */}
<footer className="h-10 px-8 flex items-center justify-between border-t border-white/5 glass-panel z-40">
<div className="flex items-center gap-6">
<div className="flex items-center gap-2">
<span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Latency</span>
<span className="text-[10px] text-brand-primary font-mono">24ms</span>
</div>
<div className="flex items-center gap-2">
<span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Throughput</span>
<span className="text-[10px] text-white/60 font-mono">1.2GB/s</span>
</div>
</div>
<div className="flex items-center gap-4">
<div className="flex flex-col items-end">
<AnimatePresence mode="popLayout">
{systemLogs.map((log, i) => (
<motion.span
key={log + i}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1 - i * 0.3, y: 0 }}
exit={{ opacity: 0 }}
className="text-[8px] font-mono text-brand-primary/60 leading-tight uppercase tracking-tighter"
>
{log}
</motion.span>
))}
</AnimatePresence>
</div>
<div className="h-4 w-[1px] bg-white/10" />
<div className="flex items-center gap-2">
<span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Live Feed</span>
<div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_5px_#0a0aff]" />
</div>
</div>
</footer>
</main>
</div>
);
}