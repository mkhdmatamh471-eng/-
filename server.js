const express = require('express');
const path = require('path');
const axios = require('axios'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// التعديل: التأكد من تحديد مسار المجلد الحالي بوضوح
const publicPath = path.resolve(__dirname);
app.use(express.static(publicPath)); 

// ملاحظة: يُفضل وضع المفتاح في متغيرات البيئة (Environment Variables) لتجنب الحظر
const GROQ_API_KEY = "ضع_مفتاحك_هنا_في_جهازك_الخاص";

app.get('/', (req, res) => {
    // التعديل: استخدام path.join لضمان الوصول للملف بشكل صحيح
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "أنت مساعد ذكي لعيادة الرحمن لطب الأسنان للدكتور مالك عبد الرحمن. أجب باختصار باللغة العربية." },
                { role: "user", content: message }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ reply: "عذراً، حدث خطأ في النظام." });
    }
});

app.post('/api/book', (req, res) => {
    res.json({ message: 'تم استلام طلب الحجز بنجاح!' });
});

app.listen(PORT, () => {
    console.log(`✅ السيرفر يعمل على الرابط: http://localhost:${PORT}`);
});
