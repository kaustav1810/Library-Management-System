class MessageModel {
    id?:number;
  userEmail?: string;
  adminEmail?: string;
  title: string;
  question: string;
  response?: string;
  closed?: boolean;

  constructor(
    title: string,
    question: string,
  ) {
    this.title = title;
    this.question = question;
  }
}

export default MessageModel;
