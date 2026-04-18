import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://svzxysonleqjtwsvmfzl.supabase.co';
const SUPABASE_SECRET_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'CHAVE_REMOVIDA_POR_SEGURANCA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function testConnection() {
    console.log("Testando conexão real com o Supabase...");
    const { data, error } = await supabase.from('leads').select('count', { count: 'exact', head: true });
    
    if (error) {
        console.error("Erro na conexão:", error.message);
    } else {
        console.log("CONEXÃO ESTABELECIDA COM SUCESSO! Banco de dados respondendo.");
    }
}

testConnection();
