type errorNames = "TICKETS_NOT_FOUND";

export class DbError extends Error {
  name: errorNames;
  statusCode: number;

  constructor({
    name,
    message,
    statusCode,
  }: {
    name: errorNames;
    message: string;
    statusCode: number;
  }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
