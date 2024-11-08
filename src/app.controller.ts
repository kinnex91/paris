import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('/')
  getLoginPage(@Res() res: Response) {
    res.render('login');
  }

  @Get('/about')
  getAboutPage(@Res() res: Response) {
    res.render('about');
  }

  @Post('/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response
  ) {
    try {
      // Envoyer une requête au backend paris_api pour l'authentification
      const response = await axios.post(
        `${process.env.API_BASE_URL}/login`,
        { email, password }
      );

      if (response.status === 200) {
        return res.redirect('/dashboard');
      }
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.UNAUTHORIZED).send('Invalid credentials');
    }
  }
}
