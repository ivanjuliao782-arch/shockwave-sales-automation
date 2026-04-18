import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store';
import { LayoutGrid, Users, Settings, ChevronLeft, ChevronRight, Zap, Bell, Search, Maximize, Minimize } from 'lucide-react';
import { cn } from '../../lib/utils';
export function Sidebar() {
const { currentView, setView, sidebarCollapsed, toggleSidebar, workflowSidebarOpen, setWorkflowSidebarOpen } = useStore();
const menuItems = [
{ id: 'crm', name: 'Leads / CRM', icon: Users },
{ id: 'flow', name: 'Fluxo do Agente', icon: Zap },
{ id: 'settings', name: 'Configurações', icon: Settings },
];
return (
<motion.aside
initial={false}
animate={{ width: sidebarCollapsed ? 80 : 280 }}
className="h-full bg-[#0a0a0c] border-r border-blue-900/50 relative z-50 flex flex-col shadow-2xl"
>
<div className="p-6 flex items-center justify-between border-bottom border-white/5">
{!sidebarCollapsed && (
<motion.h2
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase"
>
Navigation
</motion.h2>
)}
<button
onClick={toggleSidebar}
className="p-2 rounded-lg hover:bg-white/5 text-white/60 transition-colors"
>
{sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
</button>
</div>
<nav className="flex-1 px-4 py-4 space-y-2">
{menuItems.map((item) => {
const Icon = item.icon;
const isActive = currentView === item.id;
return (
<div key={item.id} className="space-y-1">
<button
onClick={() => setView(item.id as 'flow' | 'crm' | 'settings')}
className={cn(
"w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group relative overflow-hidden",
isActive
? "bg-brand-primary/20 text-white border border-brand-primary/50 shadow-[0_0_20px_rgba(10,10,255,0.2)]"
: "text-white/40 hover:text-white hover:bg-white/5"
)}
>
<Icon size={20} className={cn(isActive ? "text-brand-primary" : "group-hover:text-white")} />
{!sidebarCollapsed && (
<span className="text-sm font-medium tracking-wide">
{item.name}
</span>
)}
{isActive && (
<motion.div
layoutId="active-pill"
className="absolute left-0 w-1 h-6 bg-brand-primary rounded-full"
/>
)}
</button>
{isActive && item.id === 'flow' && !sidebarCollapsed && (
<motion.button
initial={{ opacity: 0, x: -10 }}
animate={{ opacity: 1, x: 0 }}
onClick={(e) => { e.stopPropagation(); setWorkflowSidebarOpen(!workflowSidebarOpen); }}
className="ml-12 py-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all group/sub"
>
<div className={cn(
"w-1.5 h-1.5 rounded-full transition-all shadow-lg",
workflowSidebarOpen
? "bg-brand-primary shadow-blue-500/50 scale-125"
: "bg-white/10 group-hover/sub:bg-white/30"
)} />
<span className={cn(
"transition-colors",
workflowSidebarOpen ? "text-white" : "text-white/40 group-hover/sub:text-white/60"
)}>
Bibliotecas
</span>
</motion.button>
)}
</div>
);
})}
</nav>
<div className="p-4 border-t border-white/5">
<div className={cn(
"flex items-center gap-3 p-3 rounded-xl bg-white/5",
sidebarCollapsed && "justify-center"
)}>
<div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-[10px] font-bold">
JD
</div>
{!sidebarCollapsed && (
<div className="flex-1 min-w-0">
<p className="text-sm font-medium text-white truncate">Diretor Jurídico</p>
<p className="text-[10px] text-white/40 uppercase tracking-wider">Premium Access</p>
</div>
)}
</div>
</div>
</motion.aside>
);
}
export function Header() {
const { immersionMode, setImmersionMode, currentView } = useStore();
const toggleFullscreen = () => {
// We use "Pseudo-Fullscreen" (Immersion Mode) which expands the UI within the page
// This is 100% reliable in sandbox environments/iframes.
setImmersionMode(!immersionMode);
};
return (
<header className="h-20 bg-[#0a0a0c] border-b border-blue-900/50 px-8 flex items-center justify-between gap-12 relative z-40 shadow-xl overflow-hidden">
<div className="flex flex-col flex-shrink-0">
<div className="flex items-center gap-1.5 mb-1">
<div className="w-0.5 h-2 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(10,10,255,0.4)]" />
<h1 className="text-[8px] font-black tracking-[0.3em] text-brand-primary uppercase whitespace-nowrap opacity-80">
SHOCKWAVE SALES AUTOMATION
</h1>
</div>
<div className="flex items-center gap-3">
<span className="text-base font-display font-bold text-white tracking-tighter uppercase whitespace-nowrap">
{currentView === 'crm' ? 'CRM LEADS' : currentView === 'flow' ? 'AGENT FLOW' : 'CONFIGURAÇÕES'}
</span>
<div className="h-3 w-[1px] bg-white/10 mx-1 flex-shrink-0" />
<span className={cn(
"text-[8px] font-bold uppercase tracking-[0.4em] whitespace-nowrap",
currentView === 'crm' ? "text-white" : "text-white/20"
)}>
{currentView === 'crm' ? 'BPC/LOAS' : currentView === 'flow' ? 'ORCHESTRATOR' : 'SYSTEM PARAMS'}
</span>
</div>
</div>
<div className="flex items-center gap-4">
<div className="relative group flex-shrink">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/10 group-hover:text-white/20 transition-colors" size={14} />
<input
type="text"
placeholder="PROCURAR LEAD..."
className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-[10px] tracking-widest text-white focus:outline-none focus:border-brand-primary transition-all w-48"
/>
</div>
<button
onClick={toggleFullscreen}
className={cn(
"h-9 px-3 rounded-lg transition-all flex items-center gap-2 border flex-shrink-0 group",
immersionMode
? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-blue-500/20"
: "hover:bg-white/5 text-white/40 border-white/10 hover:text-white"
)}
>
{immersionMode ? <Minimize size={16} /> : <Maximize size={16} />}
<span className="text-[9px] font-black uppercase tracking-tighter">MODO IMERSÃO</span>
</button>
<div className="h-8 w-[1px] bg-white/5 flex-shrink-0 mx-2" />
<button onClick={() => alert("Central de Notificações (Em breve)")} className="relative p-2 text-white/30 hover:text-white transition-colors flex-shrink-0">
<Bell size={18} />
<span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
</button>
<button
onClick={() => window.location.reload()}
className="text-[9px] font-bold text-white/20 hover:text-white transition-colors px-2 py-1 flex-shrink-0 uppercase"
>
Reset
</button>
</div>
</header>
);
}