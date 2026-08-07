import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  @Post('register')
  register(@Body() body:any) {
    return {
      success:true,
      email:body.email
    };
  }

  @Post('login')
  login() {
    return {
      token:'jwt-token'
    };
  }

}
