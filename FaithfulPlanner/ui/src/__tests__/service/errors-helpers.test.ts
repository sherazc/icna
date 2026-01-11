import { toScErrorResponses } from "../../service/errors-helpers";

describe('errors-helper', () => {
  test("toScErrorResponses null error", () => {
    const errors = toScErrorResponses(null, "abc")
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("abc");
  });

  test("toScErrorResponses undefined error", () => {
    const errors = toScErrorResponses(undefined, "abc")
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("abc");
  });

  test("toScErrorResponses string error", () => {
    const errors = toScErrorResponses("abc", "xyz")
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("abc");
  });

  test("toScErrorResponses bad Object error", () => {

    const badError = {
      key1: "abc"
    };

    const errors = toScErrorResponses(badError, "xyz")
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("xyz");
  });


  test("toScErrorResponses single ScErrorResponse error", () => {

    const error = {
      message: "abc",
      field: "def"
    };

    const errors = toScErrorResponses(error, "xyz")
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("abc");
    expect(errors[0].field).toBe("def");
  });

  test("toScErrorResponses single ScErrorResponse array error", () => {

    const error = [{
      message: "abc",
      field: "def"
    }];

    const errors = toScErrorResponses(error, "xyz")
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("abc");
    expect(errors[0].field).toBe("def");
  });
});
