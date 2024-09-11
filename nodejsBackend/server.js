const express = require('express');
const imaps = require('imap-simple');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const app = express();
const port = 3000;
app.use(express.json());
const imapConfig = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        tls: true,
        authTimeout: 10000,
        tlsOptions: { rejectUnauthorized: false },
    },
};

app.get('/fetch-emails', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    try {
        const connection = await imaps.connect(imapConfig);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false,
        };

        const results = await connection.search(searchCriteria, fetchOptions);

        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedResults = results.slice(start, end);

        const emails = paginatedResults
            .map(result => {
                const header = result.parts.find(part => part.which === 'HEADER');
                const body = result.parts.find(part => part.which === 'TEXT');

                const from = header?.body?.from?.[0] || 'Unknown Sender';
                const subject = header?.body?.subject?.[0] || 'No Subject';
                const text = (body?.body || '').toString(); // Ensure text is a string

                // Extract and format the required parts from the email text
                const creditMatch = text.match(/(\d+(\.\d+)?)\s+credited/i);
                const debitMatch = text.match(/(\d+(\.\d+)?)\s+debited/i);

                let amount = '';
                if (creditMatch) {
                    amount = `${creditMatch[1]} credited`;
                } else if (debitMatch) {
                    amount = `${debitMatch[1]} debited`;
                }

                return {
                    from,
                    subject,
                    amount,
                };
            })
            .filter(email => email.amount !== ''); // Filter out emails without credit or debit information

        connection.end();
        res.json({
            page,
            limit,
            totalEmails: emails.length,
            emails,
        });
    } catch (error) {
        console.error('Failed to fetch emails:', error);
        res.status(500).send('Failed to fetch emails');
    }
});
// app.post('/check-spam', async (req, res) => {
//     const emailContent = req.body.content;

//     try {
//         const response = await axios.post('http://localhost:5000/classify-email', {
//             content: emailContent
//         });

//         const isSpam = response.data.classification === 'spam';
//         res.json({ isSpam });
//     } catch (error) {
//         console.error('Error checking spam:', error);
//         res.status(500).send('Error checking spam');
//     }
// });
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
