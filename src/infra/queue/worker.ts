import { NodemailerMailProvider } from "../providers/mail/nodemailer-mail-provider";

import { startSendAdoptionVerificationCode } from "./send-adoption-verification-code";

const mailProvider = new NodemailerMailProvider();

startSendAdoptionVerificationCode(mailProvider);
