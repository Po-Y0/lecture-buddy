import test from "node:test";
import assert from "node:assert/strict";
import { fizzBuzz } from "../fizzbuzz.js";

test("TDD - Red/Green: Fizz for multiples of 3", () => {
  assert.equal(fizzBuzz(3), "Fizz");
});

test("TDD - Red/Green: Buzz for multiples of 5", () => {
  assert.equal(fizzBuzz(5), "Buzz");
});

test("TDD - Red/Green: FizzBuzz for multiples of 15", () => {
  assert.equal(fizzBuzz(15), "FizzBuzz");
});

test("TDD - Red/Green: number for non-multiples", () => {
  assert.equal(fizzBuzz(1), "1");
});

test("TDD - Red/Green: number for 7", () => {
  assert.equal(fizzBuzz(7), "7");
});