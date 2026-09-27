type errorName =
  | "CPF_ALREADY_HAS_TICKET"
  | "INVOICE_ALREADY_EXISTS"
  | "TICKET_ALREADY_EXISTS"
  | "PAYMENT_INFO_IS_INVALID"
  | "INVOICE_NOT_FOUND"
  | "INVALID_PAYMENT_AMOUNT"
  | "USER_DOES_NOT_HAVE_PERMISSION";

export class appError extends Error {
  name: errorName;
  statusCode: number;

  constructor({
    name,
    message,
    statusCode,
  }: {
    name: errorName;
    message: string;
    statusCode: number;
  }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
