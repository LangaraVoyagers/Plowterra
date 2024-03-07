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

    const errorsFormatted = errors.reduce(
      (prev, current) => ({
        ...prev,
        [current.instancePath.replace("/", "")]: current,
      }),
      {}
    );

    return {
      values: data,
      errors: errorsFormatted,
    };
  };
};

export { validateResolver };

export default ajv;
