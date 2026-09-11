import test from "node:test";
import assert from "node:assert/strict";

import { fizzBuzzTdd } from "../tdd.js";

test("TDD - Red/Green: Fizz for multiples of 3", () => {
  assert.equal(fizzBuzzTdd(3), "Fizz");
});

test("TDD - Red/Green: Buzz for multiples of 5", () => {
  assert.equal(fizzBuzzTdd(5), "Buzz");
});

test("TDD - Red/Green: FizzBuzz for multiples of 15", () => {
  assert.equal(fizzBuzzTdd(15), "FizzBuzz");
});

test("TDD - Red/Green: number for non-multiples", () => {
  assert.equal(fizzBuzzTdd(1), "1");
});

test("TDD - Red/Green: number for 7", () => {
  assert.equal(fizzBuzzTdd(7), "7");
});