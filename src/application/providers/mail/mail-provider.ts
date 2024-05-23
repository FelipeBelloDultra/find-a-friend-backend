export interface SendMailData {
  content: string;
  to: string;
}

export interface MailProvider {
  sendMail: (data: SendMailData) => Promise<void>;
}
