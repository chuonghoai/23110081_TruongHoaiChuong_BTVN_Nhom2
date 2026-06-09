import { Controller, Post, Get, Body, Req, Res, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create_url')
  createPaymentUrl(@Body('amount') amount: number, @Req() req: Request) {
    const ipAddr = req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress || '127.0.0.1';
    
    const ipStr = Array.isArray(ipAddr) ? ipAddr[0] : ipAddr;
    // Xử lý IPv6 loopback
    const formattedIp = ipStr === '::1' ? '127.0.0.1' : ipStr;

    const url = this.paymentService.createPaymentUrl(amount, formattedIp);
    return { url };
  }

  @Get('vnpay_return')
  vnpayReturn(@Query() query: any, @Res() res: Response) {
    const isValid = this.paymentService.verifyReturnUrl(query);
    
    // Redirect về Frontend Result Page
    const frontendUrl = this.configService.get<string>('FE_URL') || 'http://localhost:5173';
    
    // Truyền tham số cho Frontend để hiển thị
    const redirectUrl = new URL(`${frontendUrl}/result`);
    Object.keys(query).forEach(key => {
      redirectUrl.searchParams.append(key, query[key]);
    });
    
    // Gửi thêm kết quả xác thực chữ ký
    redirectUrl.searchParams.append('isValidSignature', isValid ? 'true' : 'false');

    res.redirect(redirectUrl.toString());
  }
}
