export class OutpostInjectiveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OutpostInjective";
  }
}
