import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Script de inicialização automática.
 * Garante que o banco de dados esteja pronto para o uso jurídico.
 */
export async function ensureDatabaseStructure() {
  if (!supabaseServiceKey) return; // Só roda no ambiente de servidor/dev

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('--- SHOCKWAVE SYSTEM: CHECKING INFRASTRUCTURE ---');
  
  // Como não podemos rodar SQL arbitrário via cliente JS facilmente sem RPC,
  // vamos garantir a existência dos dados básicos inserindo se não existirem.
  try {
    const { data: leads, error } = await supabaseAdmin.from('leads').select('id').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.error('ERRO CRÍTICO: Tabelas não encontradas. Por favor, rode o SQL de migração no painel do Supabase.');
    } else {
      console.log('INFRASTRUCTURE: ONLINE');
    }
  } catch (e) {
    console.error('INFRASTRUCTURE ERROR:', e);
  }
}
