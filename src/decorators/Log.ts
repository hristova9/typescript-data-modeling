export function Log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) { 
    const result = originalMethod.apply(this, args);  
    console.log(`${propertyKey} returned: ${result}`);
    return result;
  };
  return descriptor;
}
