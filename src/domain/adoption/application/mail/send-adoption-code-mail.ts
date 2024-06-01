export interface SendAdoptionCodeMailData {
  petName: string;
  adopterName: string;
  adopterEmail: string;
  confirmationLink: string;
  codeExpiresAt: number;
}

export abstract class SendAdoptionCodeMail {
  public abstract send: (data: SendAdoptionCodeMailData) => Promise<void>;
}
