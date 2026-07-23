export interface OpsLoginParams {
  opsUser: string | undefined;
  opsApiHost: string | undefined;
  opsPassword: string | undefined;
}

export interface ValidatorAssertion {
  isValid: boolean;
  message: string;
  htmlElement: HTMLElement;
}
