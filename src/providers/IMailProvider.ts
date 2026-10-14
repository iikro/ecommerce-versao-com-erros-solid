export interface ISendMailDTO {
  to: string;
  subject: string;
  body?: string;
  text?: string;
  html: string;
  from?: string;
}

export interface IMailResponse {
  messageId?: string;
  previewUrl?: string | false;
}

export interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<IMailResponse>;
}
