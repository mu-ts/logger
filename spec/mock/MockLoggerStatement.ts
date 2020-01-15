export class MockLoggerStatement {
  private type: string;
  private params: any[];

  constructor(type: string, ...params: any[]) {
    this.type = type;
    this.params = [];
    params.forEach((param: any) => this.params.push(param));
  }

  public getType(): string {
    return this.type;
  }

  public getParams(): any[] {
    return this.params;
  }
}
