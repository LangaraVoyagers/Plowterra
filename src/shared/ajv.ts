import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
import addKeywords from "ajv-keywords";

const ajv = new Ajv({
  useDefaults: "empty",
  allErrors: true,
  coerceTypes: true,
});

addFormats(ajv, ["date", "email"]);
addErrors(ajv);
addKeywords(ajv, "transform");

const validateResolver = <T>(schema: Record<string, unknown>) => {
  return (data: T) => {
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    const errors = validate.errors ?? [];

    const errCount = errors.filter((err) => err.instancePath !== "").length;

    if (isValid || errCount === 0) {
      return {
        values: data,
        errors: {},
      };
    }

    const errorsFormatted = errors.reduce((prev, current) => {
      const nestedObject = buildObjectFromString(current.instancePath, current);
      mergeObjects(prev, nestedObject);
      return prev;
    }, {});

    return {
      values: data,
      errors: errorsFormatted,
    };
  };
};

function buildObjectFromString(str: string, value: any) {
  const keys = str.split("/").filter(Boolean); // Split the string and remove empty strings

  return keys.reduceRight((acc, key) => {
    return { [key]: acc };
  }, value);
}

function mergeObjects(obj1: any, obj2: any) {
  for (const key in obj2) {
    if (
      Object.prototype.hasOwnProperty.call(obj1, key) &&
      typeof obj1[key] === "object" &&
      typeof obj2[key] === "object"
    ) {
      mergeObjects(obj1[key], obj2[key]);
    } else {
      obj1[key] = obj2[key];
    }
  }
}

export { validateResolver };

export default ajv;
