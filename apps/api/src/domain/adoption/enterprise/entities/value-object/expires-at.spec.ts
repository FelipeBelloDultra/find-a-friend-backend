import { ExpiresAt } from "./expires-at";

describe("ExpiresAt", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  it("should create new ExpiresAt instance", () => {
    const date = new Date("2000-01-01T08:00:00");
    vi.setSystemTime(date);

    const sut = ExpiresAt.create(date);

    expect(sut.value).toEqual(date);
  });

  it("should create new ExpiresAt instance in the future (15 min)", () => {
    const date = new Date("2000-01-01T08:00:00");
    vi.setSystemTime(date);

    const sut = ExpiresAt.create();
    date.setMinutes(date.getMinutes() + 15);

    expect(sut.value).toEqual(date);
  });

  it("should verify if the expires at is expired", () => {
    const date = new Date("2000-01-01T08:00:00");
    vi.setSystemTime(date);

    const sut = ExpiresAt.create();

    expect(sut.isExpired()).toBeFalsy();

    date.setMinutes(date.getMinutes() + 20);
    vi.setSystemTime(date);

    expect(sut.isExpired()).toBeTruthy();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });
});
