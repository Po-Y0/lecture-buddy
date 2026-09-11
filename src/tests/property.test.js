import test from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { fizzBuzz } from "../fizzbuzz.js";

test("Property - fizzBuzz always returns a string", () => {
  fc.assert(
    fc.property(fc.integer(), (number) => {
      const result = fizzBuzz(number);

      assert.equal(typeof result, "string");
    })
  );
});