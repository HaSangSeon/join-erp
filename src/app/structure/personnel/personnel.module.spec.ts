import { TestModule } from './personnel.module';

describe('TestModule', () => {
  let testModule: TestModule;

  beforeEach(() => {
    testModule = new TestModule();
  });

  it('should create an instance', () => {
    expect(testModule).toBeTruthy();
  });
});
