/* eslint-disable @typescript-eslint/no-explicit-any */
export class InvalidPatientError extends Error {
  /* eslint-disable-next-line  */
  constructor(...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPatientError);
    }

    this.name = "InvalidPatientError";
  }
}
