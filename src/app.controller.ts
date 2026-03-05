import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  find() {
    return 'Your app is running'
  }
}
