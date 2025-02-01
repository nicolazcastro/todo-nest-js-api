import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdviceService {
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Retrieve the external API URL from environment variables
    this.apiUrl =
      this.configService.get<string>('ADVICE_API_URL') || 'default_api_url';
  }

  /**
   * Fetches a random piece of advice from the external API.
   * The Advice Slip API returns data in the format:
   * { "slip": { "advice": "Your advice here" } }
   *
   * @returns A Promise resolving to a string containing the advice.
   */
  async getAdvice(): Promise<string> {
    const response = await firstValueFrom(this.httpService.get(this.apiUrl));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return response.data.slip.advice;
  }
}
