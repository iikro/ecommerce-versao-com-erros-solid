import nodemailer from 'nodemailer';
import logger from '../lib/logger';
import { IMailProvider, ISendMailDTO, IMailResponse } from './IMailProvider';

export class EtherealMailProvider implements IMailProvider {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    logger.info(`Ethereal Mail configurado: ${testAccount.user}`);
    return this.transporter;
  }

  async sendMail(data: ISendMailDTO): Promise<IMailResponse> {
    const client = await this.getTransporter();

    const info = await client.sendMail({
      from: data.from || '"DevStore" <noreply@devstore.com>',
      to: data.to,
      subject: data.subject,
      text: data.text || data.body,
      html: data.html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info(`Email enviado: ${previewUrl}`);
    }

    return {
      messageId: info.messageId,
      previewUrl: previewUrl || undefined,
    };
  }
}
