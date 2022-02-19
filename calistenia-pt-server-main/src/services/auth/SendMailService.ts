import fs from 'fs'

import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';

export default new class SendMailService {
  private client: Transporter;

  constructor() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'of.calisteniaportugal@gmail.com',
        pass: 'Alphamon04'
      }
    });

    this.client = transporter;
  };


  async execute(to: string, subject: string, variables: object, path: string) {
    const templateFileContent = fs.readFileSync(path).toString('utf8');

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: 'Calistenia Portugal <noreply@calistenia-portugal.pt>'
    });

    console.log('Email enviado: %s', message.messageId);
    console.log('Pré-visualização: %s', nodemailer.getTestMessageUrl(message));
  }
}