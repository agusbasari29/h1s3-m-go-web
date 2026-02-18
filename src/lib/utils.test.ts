import {
  cn,
  formatDate,
  formatDateTime,
  formatBytes,
  formatUptime,
  debounce,
} from "./utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatDate", () => {
  it("formats date string correctly", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("2024");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
  });

  it("handles Date object", () => {
    const result = formatDate(new Date("2024-01-15"));
    expect(result).toContain("2024");
  });
});

describe("formatDateTime", () => {
  it("formats datetime string correctly", () => {
    const result = formatDateTime("2024-01-15T10:30:00Z");
    expect(result).toContain("2024");
    expect(result).toContain("Jan");
  });
});

describe("formatBytes", () => {
  it("formats bytes correctly", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1048576)).toBe("1 MB");
    expect(formatBytes(1073741824)).toBe("1 GB");
  });

  it("handles decimal values", () => {
    expect(formatBytes(1536)).toBe("1.5 KB");
  });
});

describe("formatUptime", () => {
  it("formats seconds correctly", () => {
    expect(formatUptime(0)).toBe("< 1m");
    expect(formatUptime(60)).toBe("1m");
    expect(formatUptime(3600)).toBe("1h");
    expect(formatUptime(86400)).toBe("1d");
    expect(formatUptime(90060)).toBe("1d 1h 1m");
  });
});

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("delays function execution", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("only calls function once for multiple rapid calls", () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
  });
});
