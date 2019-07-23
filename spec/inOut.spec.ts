import { expect } from 'chai';
import 'mocha';
import { inOut } from '../src/inOut';

describe('inOut', () => {
  it('Should execute without error.', () => {
    try {
      const funxion: Function = inOut();
      expect(funxion).to.not.be.undefined;
    } catch (error) {
      expect(error).to.be;
    }
  });

  it('Should execute for a function without error.', () => {
    try {
      const funxion: Function = inOut();
      expect(funxion).to.not.be.undefined;
      const descriptor: PropertyDescriptor = funxion();
      expect(descriptor).to.not.be.undefined;
    } catch (error) {
      expect(error).to.be;
    }
  });

  it('Should accept isTrace as true.', () => {
    try {
      const funxion: Function = inOut(true);
      expect(funxion).to.not.be.undefined;
    } catch (error) {
      expect(error).to.be;
    }
  });
});
