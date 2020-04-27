/* eslint-env jest */
import { deviceParser } from './deviceParser';

const delay = (duration) => new Promise((res) => setTimeout(() => res(), duration));

describe('Device data parser', () => {
  it('splits the payload into byte segments', () => {
    expect(deviceParser('01030124092f017a000000')).toEqual([
      '0103',
      '01',
      '24',
      '09',
      '2f',
      '01',
      '7a',
      '00',
      '00',
      '00',
    ]);
  });
});
