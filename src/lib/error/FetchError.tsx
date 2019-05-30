import ExtendableError from "/vendor/es6-error";

export default class FetchError extends ExtendableError {
  public statusCode: number;

  public input: RequestInfo;

  public original: Error | null;

  public response: Response | null;

  public constructor(
    status: number,
    input: RequestInfo,
    response: Response | null = null,
    error: Error | null = null,
  ) {
    super(`${status}`);

    if (this.constructor === FetchError) {
      throw new TypeError("Can't initiate an abstract class.");
    }

    this.statusCode = status;
    this.input = input;
    this.response = response;
    this.original = error;
  }
}

export class FailedError extends FetchError {}

export class ServerError extends FetchError {
  public constructor(status: number, input: RequestInfo, response?: Response) {
    super(status, input, response, null);
  }
}

export class ClientError extends FetchError {
  public constructor(status: number, input: RequestInfo, response?: Response) {
    super(status, input, response, null);
  }
}

export class UnauthorizedError extends ClientError {}
