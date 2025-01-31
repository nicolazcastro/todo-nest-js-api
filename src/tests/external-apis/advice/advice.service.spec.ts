import { Test, TestingModule } from '@nestjs/testing';
import { AdviceService } from '../../../modules/external-apis/advice/advice.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

describe('AdviceService', () => {
  let service: AdviceService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdviceService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdviceService>(AdviceService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should fetch advice', async () => {
    const advice = { slip: { advice: 'Always be learning.' } };

    // Mock AxiosHeaders
    const mockHeaders = new AxiosHeaders();

    // Mock InternalAxiosRequestConfig with valid headers
    const mockConfig: InternalAxiosRequestConfig = {
      url: '',
      method: 'get',
      headers: mockHeaders, // Use AxiosHeaders instance
      params: {},
      transformRequest: [],
      transformResponse: [],
      timeout: 0,
    };

    // Mock AxiosResponse object with proper types
    const axiosResponse: AxiosResponse = {
      data: advice,
      status: 200,
      statusText: 'OK',
      headers: mockHeaders,
      config: mockConfig,
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

    const result: string = await service.getAdvice();
    expect(result).toBe('Always be learning.');
  });
});
