import stripe
import datetime
from django.conf import settings
from django.core.mail import send_mail
from bson import ObjectId
from .models import Payment, MethodePaiement

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_checkout_session(data):

    reservation_id = str(ObjectId())

    amount_cents = int(float(data['montant']) * 100)
    currency = data['devise'].lower()

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        mode='payment',
        customer_email=data.get('email'),
        client_reference_id=reservation_id,
        line_items=[{
            'price_data': {
                'currency': currency,
                'product_data': {
                    'name': f"Reservation {reservation_id}",
                },
                'unit_amount': amount_cents,
            },
            'quantity': 1,
        }],
        success_url="https://i-park.com/checkout/success",
        cancel_url="https://i-park.com/checkout/cancel",
    )

    return {
        'checkout_url': session.url,
        'session_id': session.id,
        'reservationId': reservation_id
    }


def confirm_checkout_session(session_id):

    session = stripe.checkout.Session.retrieve(session_id)
    intent = stripe.PaymentIntent.retrieve(session.payment_intent)

    payment = Payment(
        reservationId=session.client_reference_id,
        montant=intent.amount / 100,
        devise=intent.currency.upper(),
        status=intent.status,
        methodePaiement=MethodePaiement(
            type='stripe',
            provider='stripe',
            sessionId=session.id,
            paymentIntentId=intent.id,
            customerId=session.customer,
            metadata=intent.metadata or {}
        ),
        datePaiement=datetime.datetime.utcnow(),
        dateUpdate=datetime.datetime.utcnow(),
        transactionId=intent.id
    )
    payment.save()

    if session.customer_email:
        subject = "I-PARK Reservation Confirmation"
        plain_message = (
            f"Thank you for your reservation.\n\n"
            f"Reservation ID: {payment.reservationId}\n"
            f"Amount: {payment.montant} {payment.devise}\n"
            f"Payment Intent ID: {payment.methodePaiement.paymentIntentId}\n"
        )
        html_message = f"<p>Thank you for your reservation!</p><ul>" \
                       f"<li>Reservation ID: {payment.reservationId}</li>" \
                       f"<li>Amount: {payment.montant} {payment.devise}</li>" \
                       f"<li>Payment Intent ID: {payment.methodePaiement.paymentIntentId}</li>" \
                       f"</ul>"
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [session.customer_email],
            fail_silently=False,
            html_message=html_message
        )

    return {
        'payment_id': str(payment.id),
        'reservationId': payment.reservationId,
        'status': payment.status
    }