import { Alias } from "./alias";

describe("Alias", () => {
  it("should be able to create a new alias from text", () => {
    const sut = Alias.createFromText("Example question title");

    expect(sut.value).toBe("example-question-title");
  });
});
