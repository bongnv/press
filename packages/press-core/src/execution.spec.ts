import { Execution } from "./execution";

test("Execution should be constructed properly", () => {
  const execution = new Execution({ baseDir: "/" });
  expect(execution).toMatchSnapshot();
});
