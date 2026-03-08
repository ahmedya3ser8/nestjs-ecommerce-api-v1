import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  public find() {
    return 'Your app is running'
  }
}
