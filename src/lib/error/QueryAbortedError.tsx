import ExtendableError from "/vendor/es6-error";

class QueryAbortedError extends ExtendableError {
  public original: Error | null;

  public constructor(error: Error) {
    super(error.name);
    this.original = error;
  }
}

export default QueryAbortedError;
