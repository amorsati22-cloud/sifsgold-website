declare module "argon2-browser" {
  export enum ArgonType {
    Argon2d = 0,
    Argon2i = 1,
    Argon2id = 2,
  }

  export function hash(params: {
    pass: string | Uint8Array;
    salt: Uint8Array;
    time?: number;
    mem?: number;
    hashLen?: number;
    type?: ArgonType;
  }): Promise<{ encoded: string; hash: Uint8Array }>;

  export function verify(params: { pass: string | Uint8Array; encoded: string }): Promise<undefined>;
}
