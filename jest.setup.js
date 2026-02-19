import "@testing-library/jest-dom";

// Mock Headers
class MockHeaders {
  constructor(init) {
    this._headers = new Map();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this._headers.set(key.toLowerCase(), value);
      });
    }
  }

  get(name) {
    return this._headers.get(name.toLowerCase()) || null;
  }

  set(name, value) {
    this._headers.set(name.toLowerCase(), value);
  }

  has(name) {
    return this._headers.has(name.toLowerCase());
  }

  append(name, value) {
    const existing = this.get(name);
    if (existing) {
      this.set(name, `${existing}, ${value}`);
    } else {
      this.set(name, value);
    }
  }

  delete(name) {
    this._headers.delete(name.toLowerCase());
  }

  *entries() {
    for (const [key, value] of this._headers.entries()) {
      yield [key, value];
    }
  }

  *keys() {
    for (const key of this._headers.keys()) {
      yield key;
    }
  }

  *values() {
    for (const value of this._headers.values()) {
      yield value;
    }
  }

  [Symbol.iterator]() {
    return this.entries();
  }

  forEach(callback, thisArg) {
    for (const [key, value] of this._headers.entries()) {
      callback.call(thisArg, value, key, this);
    }
  }
}

// Mock Response
class MockResponse {
  constructor(body, init) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = "OK";
    this.headers = new MockHeaders(init?.headers);
    this.ok = this.status >= 200 && this.status < 300;
  }

  static json(data, init) {
    const response = new MockResponse(JSON.stringify(data), {
      ...init,
      headers: {
        ...(init?.headers || {}),
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  async json() {
    if (typeof this.body === "string") {
      return JSON.parse(this.body);
    }
    return this.body;
  }

  async text() {
    return typeof this.body === "string"
      ? this.body
      : JSON.stringify(this.body);
  }

  clone() {
    return new MockResponse(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: Object.fromEntries(this.headers.entries()),
    });
  }
}

// Mock NextResponse
class MockNextResponse extends MockResponse {
  static json(data, init) {
    return MockResponse.json(data, init);
  }

  static error() {
    return new MockNextResponse(null, { status: 500 });
  }

  static redirect(url, status = 307) {
    const response = new MockNextResponse(null, { status });
    response.headers.set("Location", url);
    return response;
  }
}

// Mock Request
class MockRequest {
  constructor(input, init) {
    this.url = typeof input === "string" ? input : input?.url || "";
    this.method = init?.method || "GET";
    this.headers = new MockHeaders(init?.headers);
    this.body = init?.body || null;
  }

  async json() {
    if (typeof this.body === "string") {
      return JSON.parse(this.body);
    }
    return this.body;
  }

  async text() {
    return typeof this.body === "string"
      ? this.body
      : JSON.stringify(this.body);
  }

  clone() {
    return new MockRequest(this.url, {
      method: this.method,
      headers: Object.fromEntries(this.headers.entries()),
      body: this.body,
    });
  }
}

// Mock NextRequest
class MockNextRequest extends MockRequest {
  constructor(input, init) {
    super(input, init);
    const url = typeof input === "string" ? input : input?.url || "";
    try {
      this.nextUrl = new URL(url);
    } catch {
      this.nextUrl = { searchParams: new URLSearchParams("") };
    }
  }
}

// Assign to global
global.Response = MockResponse;
global.Request = MockRequest;
global.NextResponse = MockNextResponse;
global.NextRequest = MockNextRequest;
