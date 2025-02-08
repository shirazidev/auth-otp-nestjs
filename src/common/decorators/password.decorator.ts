import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from "class-validator";

export function ConfirmedPassword(
  property: string,
  validationOption?: ValidatorOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOption,
      constraints: [property],
      validator: ConfirmedPasswordConstraint,
    });
  };
}
@ValidatorConstraint({ name: "confirmedPassword", async: false })
export class ConfirmedPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const { object, constraints } = args;
    const [property] = constraints
    const relatedValue = (object as any)[property];
    return value === relatedValue;
  }
  defaultMessage(validationArguments: ValidationArguments) {
    return "passwords do not match";
  }
}
