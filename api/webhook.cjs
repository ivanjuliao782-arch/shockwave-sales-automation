const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { remoteJid, pushName, text } = req.body;

    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

        if (!supabaseUrl || !supabaseKey || !geminiKey) {
            return res.status(500).json({ error: 'Faltam chaves de API na Vercel.' });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const genAI = new GoogleGenerativeAI(geminiKey);

        // 1. IA Pensa
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Você é o Ivan Julião, SDR de elite da advocacia previdenciária.
        O cliente se chama ${pushName}. Mensagem: "${text}".
        Objetivo: Ser profissional e pedir o CPF se não informado.
        Responda apenas com o texto da mensagem.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 2. Registra Lead
        await supabase.from('leads').upsert({
            phone: remoteJid.replace('@s.whatsapp.net', ''),
            name: pushName || 'Lead WhatsApp',
            status: 'Em triagem',
            color: '#a855f7',
            last_message: text,
            updated_at: new Date().toISOString()
        }, { onConflict: 'phone' });

        // 3. Salva Resposta na Fila
        await supabase.from('pending_messages').insert({
            to_jid: remoteJid,
            message_text: responseText
        });

        res.status(200).json({ success: true });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
