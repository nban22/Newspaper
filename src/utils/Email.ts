import nodemailer, { Transporter } from "nodemailer";

class Email {
    declare to: string;
    declare transporter: Transporter;

    constructor(recipientEmail: string) {
        this.to = recipientEmail;
        this.transporter = this.initTransport();
    }

    initTransport() {
        const transporter = nodemailer.createTransport({
            // host: "smtp.ethereal.email",
            service: "gmail",
            port: 587,
            // secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.EMAIL_NAME || "talenthive.website@gmail.com",
                pass: process.env.EMAIL_PASSWORD || "shpv ghgs jpfk zmrc",
            },
        });
        return transporter;
    }

    async sendEmail(subject: string, html?: string, text?: string) {
        const info = await this.transporter.sendMail({
            from: '"Newspaper" <your_email@gmail.com>', // sender address
            to: this.to,
            subject: subject,
            text: text,
            html: html, // html body
        });
        console.log("Message sent: %s", info.messageId);
    }

    async sendPasswordResetCode(resetCode: string) {
        await this.sendEmail(
            "Mã xác minh thay đổi mật khẩu - Newspaper",
            `
                <p>Chào bạn,</p>
                <p>Bạn đã yêu cầu thay đổi mật khẩu trên website <b>Newspaper</b>.</p>
                <p>Để xác nhận, hãy nhập mã xác minh bên dưới vào trang đặt lại mật khẩu:</p>
                <h2>${resetCode}</h2>
                <p>Mã này sẽ hết hạn sau <b>10 phút</b> kể từ khi email này được gửi.</p>
                <hr>
                <p><b>Tại sao bạn nhận được email này?</b></p>
                <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ Newspaper</p>
            `
        );
    }
}

export default Email;
