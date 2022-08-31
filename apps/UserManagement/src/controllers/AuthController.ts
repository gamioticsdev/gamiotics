import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { AuthService } from '../services/AuthService';
import { User } from '../validations/Users';

@JsonController()
export class AuthController {
  public authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }
  @Post('/auth/signup')
  async signUp(@Body() body: User): Promise<any> {
    return this.authService.registerUser(body);
  }

  @Post('/auth/signin')
  signin(@Body() body: { email: string; password: string }): Promise<any> {
    return this.authService.signIn(body);
  }
}
