type errorNames = "COULD_NOT_GENERATE_TICKET";

export class TicketGenerationError extends Error {
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
