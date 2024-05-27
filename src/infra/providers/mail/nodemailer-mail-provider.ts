import { createReadStream, createWriteStream } from "node:fs";
import { join, resolve } from "node:path";
import { randomUUID } from "node:crypto";

import nodemailer, { Transporter } from "nodemailer";
import Handlebars from "handlebars";

import { env } from "~/config/env";
import { MailProvider, SendAdoptionCodeMailData, SendMailData } from "~/application/providers/mail/mail-provider";

enum MailTemplates {
  VerifyAdoptionCode = "verify-adoption-code.hbs.hbs",
}

export class NodemailerMailProvider implements MailProvider {
  private readonly transporter: Transporter | undefined = undefined;

  public constructor() {
    if (env.MAIL_DRIVER === "smtp") {
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
  }

  private async getEmailTemplate<VariablesToReplace>(emailTemplateName: string, variables?: VariablesToReplace) {
    const path = resolve(__dirname, "..", "templates", emailTemplateName);
    const templateStream = createReadStream(path, {
      encoding: "utf-8",
    });

    const chunks: Buffer[] = [];
    for await (const chunk of templateStream) {
      chunks.push(Buffer.from(chunk));
    }

    const fileContent = Buffer.concat(chunks).toString("utf-8");
    const parsedTemplate = Handlebars.compile(fileContent);

    return parsedTemplate(variables);
  }

  private createLocalFile({ html, to }: { to: string; html: string }) {
    const timestamp = Date.now();
    const uuid = randomUUID();
    const filename = `${timestamp}-${uuid}-${env.MAIL_FROM_ADDRESS}-${to}.html`;
    const path = join(__dirname, "..", "tmp", filename);

    const writableStream = createWriteStream(path, {
      encoding: "utf-8",
    });
    writableStream.write(html);
    writableStream.end();
  }

  public async sendMail(data: SendMailData) {
    if (this.transporter) {
      await this.transporter.sendMail({
        from: env.MAIL_FROM_ADDRESS,
        to: data.to,
        subject: data.content,
        html: data.html,
      });
      return;
    }

    this.createLocalFile({
      html: data.html,
      to: data.to,
    });
  }

  public async sendAdoptionCodeMail(data: SendAdoptionCodeMailData): Promise<void> {
    const html = await this.getEmailTemplate(MailTemplates.VerifyAdoptionCode, {
      name: data.adopterName,
      petName: data.petName,
      link: data.confirmationLink,
      expiresInMinutes: data.codeExpiresAt,
    });

    await this.sendMail({
      content: `Welcome, ${data.adopterName}!`,
      to: data.adopterEmail,
      html,
    });
  }
}
