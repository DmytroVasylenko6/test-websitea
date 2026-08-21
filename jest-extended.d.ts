/// <reference types="jest-extended" />

declare module "expect" {
	interface Matchers<R> extends CustomMatchers<R> {}
	interface InverseAsymmetricMatchers extends CustomMatchers<any> {}
}
