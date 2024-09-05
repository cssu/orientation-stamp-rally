import nodemailer from 'nodemailer'

export default nodemailer.createTransport({
    host: 'smtp.teach.cs.utoronto.ca',
    port: 25,
    secure: false,
})
