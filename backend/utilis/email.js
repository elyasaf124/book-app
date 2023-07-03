import nodemailer from 'nodemailer'

export const sendEmail = async (options) => {
    console.log(options)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.USERNAME_EMAIL,
            pass: process.env.PASSWORD_EMAIL
        }
    })
    const mailOptions = {
        from: '"elyasaf", "elyasaf124@walla.com"',
        to: options.to,
        subject: options.subject,
        text: options.msg
    }
    await transporter.sendMail(mailOptions)
}



