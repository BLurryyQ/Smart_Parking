# payments/services.py
import stripe
import datetime
from django.conf import settings
from django.core.mail import send_mail
from .models import Payment, MethodePaiement

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_payment_intent(data):
    try:
        amount_cents = int(float(data['montant']) * 100)
    except Exception as e:
        raise Exception(f"Error converting montant: {data.get('montant')} - {e}")

    currency = data['devise'].lower()

    try:
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=currency,
            automatic_payment_methods={"enabled": True},
            metadata={"reservationId": str(data['reservationId'])}
        )
    except Exception as e:
        raise Exception(f"Stripe PaymentIntent creation error: {e}")

    try:
        payment = Payment(
            reservationId=data['reservationId'],
            montant=float(data['montant']),
            devise=data['devise'],
            status="created",
            methodePaiement=MethodePaiement(
                type='carte',
                provider='stripe',
                paymentIntentId=intent.id,
                metadata=intent.metadata
            )

        )
        payment.save()
    except Exception as e:
        raise Exception(f"MongoEngine Payment saving error: {e}")

    if data.get('email'):
        try:
            send_confirmation_email(data['email'], payment)
        except Exception as e:
            print("Email sending error:", e)

    return {
        "payment_id": str(payment.id),
        "client_secret": intent.client_secret,
        "paymentIntentId": intent.id
    }
def get_payment_status(payment_id):
    payment = Payment.objects.get(id=payment_id)
    return {
        "status": payment.status,
        "paymentIntentId": payment.methodePaiement.paymentIntentId,
        "amount": payment.montant,
        "currency": payment.devise
    }


import datetime
from django.core.mail import send_mail
from django.conf import settings


def send_confirmation_email(email, payment):
    subject = "I-PARK Reservation Confirmation"


    html_message = f"""
    <html>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8;">
         <div style="padding: 20px;">
           <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
             <div style="background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center;">
               <h1 style="margin: 0; font-size: 24px;">I-PARK Reservation</h1>
             </div>
             <div style="padding: 20px;">
               <p style="font-size: 16px; margin: 0 0 10px;">Dear Customer,</p>
               <p style="font-size: 16px; margin: 0 0 20px;">Thank you for your reservation! Here are your details:</p>
               <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                 <tr>
                   <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Reservation ID:</td>
                   <td style="padding: 8px; border: 1px solid #ddd;">{payment.reservationId}</td>
                 </tr>
                 <tr>
                   <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Amount:</td>
                   <td style="padding: 8px; border: 1px solid #ddd;">{payment.montant} {payment.devise}</td>
                 </tr>
                 <tr>
                   <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Payment Intent ID:</td>
                   <td style="padding: 8px; border: 1px solid #ddd;">{payment.methodePaiement.paymentIntentId}</td>
                 </tr>
               </table>
               <p style="font-size: 16px;">We appreciate your business and look forward to serving you again!</p>
             </div>
             <div style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #555;">
               &copy; {datetime.datetime.now().year} I-PARK. All Rights Reserved.
             </div>
           </div>
         </div>
      </body>
    </html>
    """
    plain_message = (
        "Thank you for your reservation.\n\n"
        f"Reservation ID: {payment.reservationId}\n"
        f"Amount: {payment.montant} {payment.devise}\n"
        f"Payment Intent ID: {payment.methodePaiement.paymentIntentId}\n\n"
        "We look forward to serving you again!"
    )

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
        html_message=html_message
    )

