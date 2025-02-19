export function Validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    if (propertyKey === "updateEmail" && !target.isEmailValid(args[0])) {
      console.log(`Invalid email address: ${args[0]}`);
    }
    return originalMethod.apply(this, args);
  };
  return descriptor;
}
