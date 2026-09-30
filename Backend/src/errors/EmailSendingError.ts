type errorNames = "EMAIL_COULD_NOT_BE_SENT";

export class EmailSendingError extends Error {
  name: errorNames;
  statusCode: number;

  constructor({
    name,
    statusCode,
    message,
  }: {
    name: errorNames;
    statusCode: number;
    message: string;
  }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
