import { RequiredStringValidator } from './required-string'
import { Validator } from './validator'

export class ValidationBuilder {
  private constructor(
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) { }

  static of(params: { value: string, fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName)
  }

  required(): this {
    this.validators.push(new RequiredStringValidator(this.value, this.fieldName))
    return this
  }

  build(): Validator[] {
    return this.validators
  }
}
