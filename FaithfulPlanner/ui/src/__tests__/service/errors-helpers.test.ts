import { toScErrorResponses } from "../../service/errors-helpers";

describe('errors-helper', () => {
  test("toScErrorResponses null error", () => {
    const errors = toScErrorResponses(null, "abc")
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe("abc")
  });

  test("toScErrorResponses undefined error", () => {
    const errors = toScErrorResponses(undefined, "abc")
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe("abc")
  });

  test("toScErrorResponses string error", () => {
    const errors = toScErrorResponses("abc", "xyz")
    expect(Array.isArray(errors)).toBeTruthy();
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe("abc")
  });

  test("toScErrorResponses bad Object error", () => {

    const badError = {
      key1: "abc"
    }

    const errors = toScErrorResponses(badError, "xyz")
    console.log(errors)
    // expect(Array.isArray(errors)).toBeTruthy();
    // expect(errors.length).toBe(1)
    // expect(errors[0].message).toBe("abc")
  });


});
