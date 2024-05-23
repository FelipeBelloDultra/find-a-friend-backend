import nodemailer from "nodemailer";

import { env } from "~/config/env";

import type { Transporter } from "nodemailer";
import type { MailProvider, SendMailData } from "~/application/providers/mail/mail-provider";

export class NodemailerMailProvider implements MailProvider {
  private readonly transporter: Transporter;

  public constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: false,
      auth: {
        user: env.MAIL_USERNAME,
        pass: env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  public async sendMail(data: SendMailData) {
    await this.transporter.sendMail({
      from: env.MAIL_FROM_ADDRESS,
      subject: env.MAIL_FROM_NAME,
      to: data.to,
      text: data.content,
      html: data.content,
    });
  }
}
