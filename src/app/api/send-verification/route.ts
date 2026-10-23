import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, code, name, orderNumber, items, total } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ success: false, message: 'Email and verification code are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_bubyu7f';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_699ocq4';
    const userId = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'LhFCNuXG5Ie0lkAig';

    const customerName = name?.trim() || 'Valued Customer';
    const cleanCode = String(code).trim();
    const cleanOrderNumber = orderNumber || `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsDescription = items || 'Handmade Scented Creations';
    const totalAmount = total || 'Rs. 2,000';

    // Dispatch via EmailJS with browser-safe Origin header
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Flamira/1.0',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: userId,
          template_params: {
            // Customer identity
            to_email: cleanEmail,
            user_email: cleanEmail,
            email: cleanEmail,
            reply_to: cleanEmail,
            to_name: customerName,
            user_name: customerName,
            name: customerName,
            customer_name: customerName,

            // All variations of verification code variables
            code: cleanCode,
            Code: cleanCode,
            CODE: cleanCode,
            verification_code: cleanCode,
            verificationCode: cleanCode,
            VerificationCode: cleanCode,
            verify_code: cleanCode,
            verifyCode: cleanCode,
            otp: cleanCode,
            Otp: cleanCode,
            OTP: cleanCode,
            otp_code: cleanCode,
            otpCode: cleanCode,
            passcode: cleanCode,
            Passcode: cleanCode,
            pin: cleanCode,
            PIN: cleanCode,
            pin_code: cleanCode,
            pinCode: cleanCode,
            token: cleanCode,
            Token: cleanCode,
            confirmation_code: cleanCode,
            confirmationCode: cleanCode,
            confirm_code: cleanCode,
            confirmCode: cleanCode,
            security_code: cleanCode,
            securityCode: cleanCode,
            auth_code: cleanCode,
            authCode: cleanCode,
            digits: cleanCode,
            six_digit_code: cleanCode,
            sixDigitCode: cleanCode,
            digit_code: cleanCode,
            v_code: cleanCode,
            vCode: cleanCode,
            user_code: cleanCode,
            userCode: cleanCode,
            number: cleanCode,
            verification: cleanCode,

            // Order details
            order: itemsDescription,
            order_id: cleanOrderNumber,
            orderId: cleanOrderNumber,
            order_number: cleanOrderNumber,
            orderNumber: cleanOrderNumber,
            order_name: itemsDescription,
            product: itemsDescription,
            products: itemsDescription,
            item: itemsDescription,
            items: itemsDescription,
            total: totalAmount,
            amount: totalAmount,
            order_total: totalAmount,
            orderTotal: totalAmount,

            // Subject and full text fallbacks
            subject: `Your Flamira Verification Code: ${cleanCode}`,
            message: cleanCode,
            body: cleanCode,
            content: `Your 6-digit verification code is: ${cleanCode}`,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('[Email Verification Route] EmailJS response status:', response.status, errorText);
      } else {
        console.log(`[Email Verification Route] Successfully dispatched verification code ${cleanCode} to ${cleanEmail}`);
      }
    } catch (dispatchErr) {
      console.warn('[Email Verification Route] Error in EmailJS dispatch:', dispatchErr);
    }

    return NextResponse.json({
      success: true,
      code: cleanCode,
      email: cleanEmail,
      message: `Verification code sent to ${cleanEmail}!`,
    });
  } catch (err: any) {
    console.error('[Email Verification Route] Fatal error:', err);
    return NextResponse.json({ success: false, message: err?.message || 'Failed to send code.' }, { status: 500 });
  }
}
