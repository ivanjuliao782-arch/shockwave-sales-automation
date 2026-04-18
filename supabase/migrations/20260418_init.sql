-- =================================================================
-- Shockwave Sales Automation: Initial Database Schema
-- Purpose: Legal-grade lead tracking and workflow auditing.
-- =================================================================

-- 1. Leads Table (CRM Data)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cpf TEXT,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'EM TRIAGEM', -- 'TICKET ALTO', 'TICKET BAIXO', 'INELEGÍVEL'
    income NUMERIC,
    income_formatted TEXT,
    color TEXT DEFAULT '#a855f7',
    source TEXT DEFAULT 'WHATSAPP',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workflow Audit Logs (Agent Flow Tracking)
CREATE TABLE IF NOT EXISTS workflow_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    node_type TEXT NOT NULL,
    action_taken TEXT,
    status TEXT DEFAULT 'SUCCESS',
    payload JSONB,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow the service role (backend) to do everything
CREATE POLICY "Allow service role full access" ON leads
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow service role full access" ON workflow_audit_logs
    USING (true)
    WITH CHECK (true);

-- 4. Sample Data (Matching visual references)
INSERT INTO leads (name, cpf, phone, status, color, income_formatted)
VALUES 
('Ricardo Santos', '123.456.789-00', '+551199887766', 'Ticket ALTO', '#10b981', 'R$ 8.000,00'),
('Maria Oliveira', '456.789.012-00', '+552199123456', 'Ticket BAIXO', '#f59e0b', 'R$ 1.200,00'),
('Wagner Moura', '789.012.345-00', '+557199988776', 'Ticket ALTO', '#10b981', 'R$ 12.000,00')
ON CONFLICT DO NOTHING;
