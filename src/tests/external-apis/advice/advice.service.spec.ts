import { Test, TestingModule } from '@nestjs/testing';
import { AdviceService } from '../../../modules/external-apis/advice/advice.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('AdviceService', () => {
  let service: AdviceService;

  // Create mock objects for HttpService and ConfigService
  const mockHttpService = {
    get: jest.fn(),
  };
  const mockConfigService = {
    get: jest.fn().mockReturnValue('https://api.adviceslip.com/advice'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdviceService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AdviceService>(AdviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch advice', async () => {
    // Prepare a fake response that simulates the API returning advice.
    const fakeAdvice = { slip: { advice: 'Always check your groceries!' } };
    // Set the HttpService.get() method to return an Observable that emits the fake response.
    mockHttpService.get.mockReturnValue(of({ data: fakeAdvice }));

    // Call getAdvice() and expect it to resolve to the advice string.
    const advice = await service.getAdvice();
    expect(advice).toEqual('Always check your groceries!');
  });
});
