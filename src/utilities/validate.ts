import { ValidatorAssertion } from "../interfaces";

export const Validators = {
  minChars: (
    htmlElement: HTMLInputElement,
    min: number,
    fieldName: string | null = null
  ): ValidatorAssertion => {
    const message = `Field '${
      fieldName || htmlElement.id
    }' should contain minimum ${min} chars.`;
    let isValid = true;
    isValid = htmlElement.value.length >= min;
    return { isValid, message, htmlElement };
  },
  maxChars: (
    htmlElement: HTMLInputElement,
    max: number,
    fieldName: string | null = null
  ): ValidatorAssertion => {
    const message = `Field '${
      fieldName || htmlElement.id
    }' should contain maximum ${max} chars.`;
    let isValid = true;
    isValid = htmlElement.value.length <= max;
    return { isValid, message, htmlElement };
  },
  validUrl: (
    htmlElement: HTMLInputElement,
    fieldName: string | null = null
  ): ValidatorAssertion => {
    const message = `Field '${
      fieldName || htmlElement.id
    }' should be a valid URL.`;
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol (optional)
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // or IP address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path (optional)
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // anchor (optional)
    const isValid = pattern.test(htmlElement.value);
    return { isValid, message, htmlElement };
  },
  isNotNullOrUndefined: (
    htmlElement: HTMLInputElement,
    fieldName: string | null = null
  ): ValidatorAssertion => {
    const message = `Field '${
      fieldName || htmlElement.id
    }' should not be null or undefined.`;
    const isValid =
      htmlElement.value !== null && htmlElement.value !== undefined;
    return { isValid, message, htmlElement };
  },
  isNot: (
    htmlElement: HTMLInputElement,
    value: any,
    fieldName: string | null = null
  ): ValidatorAssertion => {
    const message = `Field '${
      fieldName || htmlElement.id
    }' should not be ${value}.`;
    const isValid = htmlElement.value !== value;
    return { isValid, message, htmlElement };
  },
};

export function validateNotEmptyField(
  fieldName: string,
  input: HTMLInputElement
) {
  const assertions = [];
  assertions.push(Validators.minChars(input, 1, fieldName));
  createErrorMessages(assertions);
  return assertions.filter((a) => !a.isValid).length === 0;
}

export function createErrorMessages(assertions: ValidatorAssertion[]) {
  try {
    assertions.forEach((assertion: ValidatorAssertion, i: number) => {
      let { htmlElement } = assertion;
      htmlElement.classList.remove("input-error");
      htmlElement.classList.add("input-success");

      let oldErrorMessageElements = Array.from(
        document.getElementsByClassName("error-message")
      );
      oldErrorMessageElements.forEach((errorMessageElement) => {
        if (errorMessageElement.id === `${htmlElement.id}-error-${i + 1}`)
          errorMessageElement.remove();
      });
    });

    assertions
      .filter((a) => !a.isValid)
      .forEach((assertion: ValidatorAssertion, i: number) => {
        let { htmlElement, message } = assertion;
        htmlElement.classList.add("input-error");
        htmlElement.classList.remove("input-success");

        let errorMessageElement = document.createElement("small");
        errorMessageElement.id = `${htmlElement.id}-error-${i + 1}`;
        errorMessageElement.classList.add("error-message");

        errorMessageElement.textContent = message;
        htmlElement.parentNode?.insertBefore(errorMessageElement, htmlElement);
      });
  } catch (error: any) {
    throw error;
  }
}
