import { transporter } from '../config/mailer.config.js';

export const sendTicketConfirmationEmail = async ({ to, userName, eventTitle, ticketCode }) => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject: 'Confirmación de inscripción',
            html: `
                <h1>Inscripción confirmada</h1>
                <p>Hola ${userName}, tu inscripción al evento ${eventTitle} fue confirmada.</p>
                <p>Código de reserva: <strong>${ticketCode}</strong></p>
            `
        });
    } catch (error) {
        console.error('Error al enviar email de confirmación:', error);
    }
};