import { create } from 'zustand';
type View = 'flow' | 'crm' | 'settings';
interface NodeCode {
id: string;
code: string;
}
interface AppState {
currentView: View;
setView: (view: View) => void;
sidebarCollapsed: boolean;
toggleSidebar: () => void;
immersionMode: boolean;
setImmersionMode: (active: boolean) => void;
selectedNode: NodeCode | null;
setSelectedNode: (node: NodeCode | null) => void;
workflowSidebarOpen: boolean;
setWorkflowSidebarOpen: (open: boolean) => void;
}
export const useStore = create<AppState>((set) => ({
currentView: 'crm',
setView: (view) => set({ currentView: view }),
sidebarCollapsed: false,
toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
immersionMode: false,
setImmersionMode: (active) => set({ immersionMode: active }),
selectedNode: null,
setSelectedNode: (node) => set({ selectedNode: node }),
workflowSidebarOpen: false,
setWorkflowSidebarOpen: (open) => set({ workflowSidebarOpen: open }),
}));