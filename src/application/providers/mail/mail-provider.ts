export interface SendMailData {
  to: string;
  html: string;
  content: string;
}

export interface SendAdoptionCodeMailData {
  petName: string;
  adopterName: string;
  adopterEmail: string;
  confirmationLink: string;
  codeExpiresAt: number;
}

export interface MailProvider {
  sendMail: (data: SendMailData) => Promise<void>;
  sendAdoptionCodeMail: (data: SendAdoptionCodeMailData) => Promise<void>;
}
