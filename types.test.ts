import { assertNotType, assertType } from "./types.ts";
import type {
  AND,
  BitAnd,
  BitNand,
  BitNor,
  BitNot,
  BitOr,
  BitXnor,
  BitXor,
  CamelCase,
  Extends,
  IfElse,
  IsEvenLength,
  IsUnion,
  Join,
  KebabCase,
  Length,
  LogicFalse,
  LogicNull,
  LogicTrue,
  NAND,
  NarrowList,
  NOR,
  NOT,
  OR,
  PascalCase,
  ScreamingSnakeCase,
  SnakeCase,
  SplitAt,
  SplitEven,
  SplitString,
  Surround,
  TakeFirst,
  TakeLast,
  ToString,
  XNOR,
  XOR,
} from "./types.ts";

Deno.test("static type tests", () => {
  {
    const symA = Symbol("a");
    const symB = Symbol("b");
    type SymA = typeof symA;
    type SymB = typeof symB;

    assertType<number, number>();
    assertType<any, any>();
    assertType<unknown, unknown>();
    assertType<[string], [string]>();
    assertType<never, never>();
    assertType<SymA, SymA>();
    assertType<1, 1>();
    assertNotType<1, 2>();

    // @ts-expect-error
    assertType<number, any>();
    // @ts-expect-error
    assertType<any, number>();
    // @ts-expect-error
    assertType<unknown, any>();
    // @ts-expect-error
    assertType<unknown, string>();
    // @ts-expect-error
    assertType<string, unknown>();
    // @ts-expect-error
    assertType<string[], [string]>();
    // @ts-expect-error
    assertType<[string, number], [string, number?]>();
    // @ts-expect-error
    assertType<number, never>();
    // @ts-expect-error
    assertType<never, number>();
    // @ts-expect-error
    assertType<any, never>();
    // @ts-expect-error
    assertType<SymA, SymB>();
    // @ts-expect-error
    assertType<"foo", string>();
    // @ts-expect-error
    assertType<number, 1>();
    // @ts-expect-error
    assertType<2, 3>();
    // @ts-expect-error
    assertNotType<1, 1>();
  }

  {
    type Full = [string, number, boolean, null];

    assertType<[], TakeFirst<Full, 0>>();
    assertType<[string], TakeFirst<Full, 1>>();
    assertType<[string, number], TakeFirst<Full, 2>>();
    assertType<[string, number, boolean], TakeFirst<Full, 3>>();
    assertType<[string, number, boolean, null], TakeFirst<Full, 4>>();
    assertType<never, TakeFirst<Full, 5>>();
  }

  {
    type Full = [string, number, boolean, null];

    assertType<TakeLast<Full, 0>, []>();
    assertType<TakeLast<Full, 1>, [null]>();
    assertType<TakeLast<Full, 2>, [boolean, null]>();
    assertType<TakeLast<Full, 3>, [number, boolean, null]>();
    assertType<TakeLast<Full, 4>, [string, number, boolean, null]>();
    assertType<TakeLast<Full, 5>, never>();
  }

  {
    type Full = [string, number, boolean, null];

    assertType<SplitAt<Full, 4>, [[string, number, boolean, null], []]>();
    assertType<SplitAt<Full, 3>, [[string, number, boolean], [null]]>();
    assertType<SplitAt<Full, 2>, [[string, number], [boolean, null]]>();
    assertType<SplitAt<Full, 1>, [[string], [number, boolean, null]]>();
    assertType<SplitAt<Full, 0>, [[], [string, number, boolean, null]]>();
  }

  {
    type Strict = ["A" | "B", 1 | 2 | 3, number];

    assertType<
      NarrowList<Strict, [string, number, 5]>,
      ["A" | "B", 1 | 2 | 3, 5]
    >();
  }

  {
    assertType<CamelCase<"foo_bar">, "fooBar">();
    assertType<CamelCase<"foo-bar">, "fooBar">();
    assertType<CamelCase<"__foo_bar__baz__">, "__fooBar_Baz__">();
    assertType<CamelCase<"-_foo_bar-_baz_-">, "-_fooBar-Baz_-">();
    assertType<CamelCase<"FooBar">, "fooBar">();
  }

  {
    assertType<PascalCase<"foo_bar">, "FooBar">();
  }

  {
    assertType<SnakeCase<"fooBar">, "foo_bar">();
    assertType<SnakeCase<"FooBar">, "foo_bar">();
    assertType<SnakeCase<"fooBarABC0D">, "foo_bar_ABC0D">();
    assertType<SnakeCase<"fooBarABC0DfooBar">, "foo_bar_ABC0D_foo_bar">();
    assertType<SnakeCase<"foo_bar">, "foo_bar">();
    assertType<SnakeCase<"foo_Bar">, "foo_bar">();
    // @ts-expect-error
    assertType<SnakeCase<"fooBar">, "">();
    assertType<SnakeCase<"foo-bar">, "foo_bar">();
    assertType<SnakeCase<"foo-Bar">, "foo_bar">();
  }

  {
    assertType<ScreamingSnakeCase<"fooBar">, "FOO_BAR">();
  }

  {
    assertType<KebabCase<"fooBar">, "foo-bar">();
    assertType<KebabCase<"FooBar">, "foo-bar">();
    assertType<KebabCase<"fooBarABC0D">, "foo-bar-ABC0D">();
    assertType<KebabCase<"fooBarABC0DfooBar">, "foo-bar-ABC0D-foo-bar">();
    assertType<KebabCase<"foo_bar">, "foo-bar">();
    assertType<KebabCase<"foo_Bar">, "foo-bar">();
    // @ts-expect-error
    assertType<KebabCase<"fooBar">, "">();
    assertType<KebabCase<"foo-bar">, "foo-bar">();
    assertType<KebabCase<"foo-Bar">, "foo-bar">();
  }

  {
    assertType<IsEvenLength<"">, false>();
    assertType<IsEvenLength<"a">, false>();
    assertType<IsEvenLength<"ab">, true>();
    assertType<IsEvenLength<"abc">, false>();
    assertType<IsEvenLength<"abcd">, true>();
    assertType<IsEvenLength<"abcde">, false>();
  }

  {
    assertType<SplitString<"foobar">, ["f", "o", "o", "b", "a", "r"]>();
  }

  {
    assertType<Length<[]>, 0>();
    assertType<Length<[number]>, 1>();
    assertType<Length<[number?]>, 0 | 1>();
    assertType<Length<[number, ...string[]]>, number>();
    assertType<Length<unknown[]>, number>();
  }

  {
    assertType<IsUnion<1>, false>();
    assertType<IsUnion<1 | 2>, true>();
    assertType<IsUnion<1 | "a">, true>();
    assertType<IsUnion<number>, false>();
    assertType<IsUnion<number | string>, true>();
    assertType<IsUnion<1 | 1>, false>();
  }

  {
    type A = [string, number];
    type B = [string, string | number];
    type C = [null, any];

    assertType<Extends<A[0], A[1]>, A[0] extends A[1] ? true : false>();
    assertType<Extends<B[0], B[1]>, B[0] extends B[1] ? true : false>();
    assertType<Extends<B[1], B[0]>, B[1] extends B[0] ? true : false>();
    assertType<Extends<C[0], C[1]>, C[0] extends C[1] ? true : false>();
    assertType<Extends<C[1], C[0]>, C[1] extends C[0] ? true : false>();
  }

  {
    assertType<IfElse<true, "a", "b">, "a">();
    assertType<IfElse<false, "a", "b">, "b">();
    assertType<IfElse<boolean, "a", "b">, "a" | "b">();
    assertType<IfElse<any, "a", "b">, "a" | "b">();
  }

  {
    type _0 = false;
    type _1 = true;
    type _n = boolean;

    assertType<BitNot<_0>, _1>();
    assertType<BitNot<_1>, _0>();

    assertType<NOT<_0>, _1>();
    assertType<NOT<_1>, _0>();
    assertType<NOT<_n>, _n>();

    assertType<BitAnd<_0, _0>, _0>();
    assertType<BitAnd<_0, _1>, _0>();
    assertType<BitAnd<_1, _0>, _0>();
    assertType<BitAnd<_1, _1>, _1>();

    assertType<AND<_0, _0>, _0>();
    assertType<AND<_0, _1>, _0>();
    assertType<AND<_0, _n>, _0>();
    assertType<AND<_1, _0>, _0>();
    assertType<AND<_1, _1>, _1>();
    assertType<AND<_1, _n>, _n>();
    assertType<AND<_n, _0>, _0>();
    assertType<AND<_n, _1>, _n>();
    assertType<AND<_n, _n>, _n>();

    assertType<BitOr<_0, _0>, _0>();
    assertType<BitOr<_0, _1>, _1>();
    assertType<BitOr<_1, _0>, _1>();
    assertType<BitOr<_1, _1>, _1>();

    assertType<OR<_0, _0>, _0>();
    assertType<OR<_0, _1>, _1>();
    assertType<OR<_0, _n>, _n>();
    assertType<OR<_1, _0>, _1>();
    assertType<OR<_1, _1>, _1>();
    assertType<OR<_1, _n>, _1>();
    assertType<OR<_n, _0>, _n>();
    assertType<OR<_n, _1>, _1>();
    assertType<OR<_n, _n>, _n>();

    assertType<BitXor<_0, _0>, _0>();
    assertType<BitXor<_0, _1>, _1>();
    assertType<BitXor<_1, _0>, _1>();
    assertType<BitXor<_1, _1>, _0>();

    assertType<XOR<_0, _0>, _0>();
    assertType<XOR<_0, _1>, _1>();
    assertType<XOR<_0, _n>, _n>();
    assertType<XOR<_1, _0>, _1>();
    assertType<XOR<_1, _1>, _0>();
    assertType<XOR<_1, _n>, _n>();
    assertType<XOR<_n, _0>, _n>();
    assertType<XOR<_n, _1>, _n>();
    assertType<XOR<_n, _n>, _n>();

    assertType<BitXnor<_0, _0>, _1>();
    assertType<BitXnor<_0, _1>, _0>();
    assertType<BitXnor<_1, _0>, _0>();
    assertType<BitXnor<_1, _1>, _1>();

    assertType<XNOR<_0, _0>, _1>();
    assertType<XNOR<_0, _1>, _0>();
    assertType<XNOR<_0, _n>, _n>();
    assertType<XNOR<_1, _0>, _0>();
    assertType<XNOR<_1, _1>, _1>();
    assertType<XNOR<_1, _n>, _n>();
    assertType<XNOR<_n, _0>, _n>();
    assertType<XNOR<_n, _1>, _n>();
    assertType<XNOR<_n, _n>, _n>();

    assertType<BitNor<_0, _0>, _1>();
    assertType<BitNor<_0, _1>, _0>();
    assertType<BitNor<_1, _0>, _0>();
    assertType<BitNor<_1, _1>, _0>();

    assertType<NOR<_0, _0>, _1>();
    assertType<NOR<_0, _1>, _0>();
    assertType<NOR<_0, _n>, _n>();
    assertType<NOR<_1, _0>, _0>();
    assertType<NOR<_1, _1>, _0>();
    assertType<NOR<_1, _n>, _0>();
    assertType<NOR<_n, _0>, _n>();
    assertType<NOR<_n, _1>, _0>();
    assertType<NOR<_n, _n>, _n>();

    assertType<BitNand<_0, _0>, _1>();
    assertType<BitNand<_0, _1>, _1>();
    assertType<BitNand<_1, _0>, _1>();
    assertType<BitNand<_1, _1>, _0>();

    assertType<NAND<_0, _0>, _1>();
    assertType<NAND<_0, _1>, _1>();
    assertType<NAND<_0, _n>, _1>();
    assertType<NAND<_1, _0>, _1>();
    assertType<NAND<_1, _1>, _0>();
    assertType<NAND<_1, _n>, _n>();
    assertType<NAND<_n, _0>, _1>();
    assertType<NAND<_n, _1>, _n>();
    assertType<NAND<_n, _n>, _n>();
  }

  {
    assertType<LogicTrue<true>, true>();
    assertType<LogicTrue<false>, false>();
    assertType<LogicTrue<boolean>, false>();

    assertType<LogicFalse<true>, false>();
    assertType<LogicFalse<false>, true>();
    assertType<LogicFalse<boolean>, false>();

    assertType<LogicNull<true>, false>();
    assertType<LogicNull<false>, false>();
    assertType<LogicNull<boolean>, true>();
  }

  {
    type List1 = [
      undefined,
      "a",
      1,
      [2, [4, undefined, Record<never, never>, [5, 6]], 7],
      "b",
      null,
      Record<never, never>,
      [],
      8,
    ];

    assertType<
      Join<List1, "">,
      "a12,4,,[object Object],5,6,7b[object Object]8"
    >();

    assertType<
      Join<List1, " | ">,
      " | a | 1 | 2,4,,[object Object],5,6,7 | b |  | [object Object] |  | 8"
    >();

    assertType<Join<[123], "">, "123">();
    assertType<Join<[], ", ">, "">();

    type List2 = [Map<any, any>, Set<any>, Uint16Array, DataView];

    assertType<
      Join<List2, " ">,
      `[object Map] [object Set] ${string} [object DataView]`
    >();
  }

  {
    assertType<ToString<"foo">, "foo">();
    assertType<ToString<123>, "123">();
    assertType<ToString<true>, "true">();
    assertType<ToString<false>, "false">();
    assertType<ToString<Record<never, never>>, "[object Object]">();
    assertType<ToString<{ foo: 123 }>, "[object Object]">();
    assertType<ToString<[]>, "">();
    assertType<ToString<[1, 2, 3]>, "1,2,3">();
    assertType<ToString<[1, [2, [3, 4], 5]]>, "1,2,3,4,5">();
    assertType<ToString<WeakMap<any, any>>, "[object WeakMap]">();
    assertType<ToString<Int8Array>, string>();
    assertType<ToString<Float64Array>, string>();
    assertType<ToString<bigint>, string>();
    assertType<ToString<symbol>, string>();
    assertType<ToString<typeof globalThis>, string>();
    assertType<ToString<ArrayBuffer>, "[object ArrayBuffer]">();
    assertType<ToString<SharedArrayBuffer>, "[object SharedArrayBuffer]">();
    assertType<ToString<DataView>, "[object DataView]">();
    assertType<ToString<Promise<any>>, "[object Promise]">();
    assertType<ToString<() => 2>, string>();
    assertType<ToString<GeneratorFunction>, string>();
    assertType<ToString<Atomics>, "[object Atomics]">();
    assertType<ToString<Intl.Collator>, "[object Intl.Collator]">();
    assertType<ToString<Intl.NumberFormat>, string>();
    assertType<ToString<{ toString(): "foo" }>, "foo">();
  }

  {
    assertType<SplitEven<"ab">, ["a", "b"]>();
    assertType<SplitEven<"abcd">, ["ab", "cd"]>();
    assertType<SplitEven<"abcdef">, ["abc", "def"]>();
  }

  {
    assertType<Surround<"foo", "()">, "(foo)">();
    assertType<Surround<"foo", "([])">, "([foo])">();
    assertType<Surround<"foo", "([{}])">, "([{foo}])">();
  }
});
