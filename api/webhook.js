import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(express.json());

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

app.post('/api/webhook', async (req, res) => {
    const { remoteJid, pushName, text } = req.body;
    
    try {
        if (!supabaseUrl || !supabaseKey || !geminiKey) {
            return res.status(500).json({ error: 'Faltam chaves de API na Vercel.' });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const genAI = new GoogleGenerativeAI(geminiKey);

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Você é o Ivan Julião, SDR de elite da advocacia previdenciária.
        O cliente se chama ${pushName}. Mensagem: "${text}".
        Objetivo: Ser profissional e pedir o CPF se não informado.
        Responda apenas com o texto da mensagem.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        await supabase.from('leads').upsert({
            phone: remoteJid.replace('@s.whatsapp.net', ''),
            name: pushName || 'Lead WhatsApp',
            status: 'Em triagem',
            color: '#a855f7',
            last_message: text,
            updated_at: new Date().toISOString()
        }, { onConflict: 'phone' });

        await supabase.from('pending_messages').insert({
            to_jid: remoteJid,
            message_text: responseText
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default app;
