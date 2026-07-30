import { describe, expect, it } from 'vitest';
import { isTypingTarget } from '../../src/ui/EditorApp.js';

describe('AT-018 shortcut focus guard', () => {
  it('guards form and contenteditable targets', () => {
    expect(isTypingTarget({ tagName: 'INPUT' })).toBe(true);
    expect(isTypingTarget({ tagName: 'TEXTAREA' })).toBe(true);
    expect(isTypingTarget({ tagName: 'SELECT' })).toBe(true);
    expect(isTypingTarget({ tagName: 'DIV', isContentEditable: true })).toBe(true);
    expect(isTypingTarget({ tagName: 'CANVAS', isContentEditable: false })).toBe(false);
  });
});
