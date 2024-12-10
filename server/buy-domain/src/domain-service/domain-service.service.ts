import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DomainServiceService {
  constructor(private configService: ConfigService) {}

  private readonly API_KEY = this.configService.get<string>('API_KEY');
  private readonly API_SECRET = this.configService.get<string>('API_SECRET');
  private readonly END_POINT = this.configService.get<string>('END_POINT');

  async findOne(domain: string) {
    let response = {};
    await fetch(`${this.END_POINT}/available?domain=${domain}`,
      {
        method: 'GET',
        headers: {
          Authorization: `sso-key ${this.API_KEY}:${this.API_SECRET}`
        }
      }
    )
      .then(resp => resp.json())
      .then(data => {
        if(data.price){
          data.price = data.price;
        }
        response = {...data};
      })
      .catch(err => {
        console.log(err)
      })
    return response;
  }

  remove(email: string, domain: string) {
    return `This action removes a ${email} domainService`;
  }
}
