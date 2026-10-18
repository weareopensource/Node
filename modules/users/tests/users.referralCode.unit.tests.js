/**
 * Module dependencies.
 */
import { describe, test, expect } from '@jest/globals';

import { encodeReferralCode, decodeReferralCode } from '../utils/referralCode.js';

/**
 * Unit tests — referralCode.js (#4212): the code is the user id encoded, derived not stored.
 */
describe('referralCode', () => {
  const id = '507f1f77bcf86cd799439011';

  test('round-trips an ObjectId through a 16-char url-safe code', () => {
    const code = encodeReferralCode(id);
    expect(code).toMatch(/^[A-Za-z0-9_-]{16}$/);
    expect(decodeReferralCode(code)).toBe(id);
  });

  test('encode rejects anything that is not an ObjectId hex', () => {
    expect(encodeReferralCode('nope')).toBeNull();
    expect(encodeReferralCode(undefined)).toBeNull();
  });

  test.each([undefined, null, 42, '', 'short', 'x'.repeat(17), 'bad chars here!!!', {}])('decode rejects %p', (bad) => {
    expect(decodeReferralCode(bad)).toBeNull();
  });

  test('decode rejects a non-canonical encoding of the same bytes', () => {
    const code = encodeReferralCode(id);
    // base64url of 12 bytes has no padding bits, so any other 16-char string decodes to other bytes
    expect(decodeReferralCode(code.replace(/.$/, code.endsWith('A') ? 'B' : 'A'))).not.toBe(id);
  });
});
