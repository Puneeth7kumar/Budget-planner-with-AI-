const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const corsOptions = {
    origin: 'http://localhost:4200', // Replace with your Angular app URL
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: '"Your Company" <puneethpandith@gmail.com>',
            to: to,
            subject: subject,
            text: text,
        });

        res.status(200).json({ message: 'Email sent', info });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('SMTP server running on port 3000');
});
