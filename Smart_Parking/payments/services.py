# payments/services.py
import stripe
from datetime import datetime
from django.conf import settings
from django.core.mail import send_mail
from .models import create_payment_document
from Smart_Parking.database import db

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(data):
    from bson import ObjectId
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
                'product_data': {'name': f"Reservation {reservation_id}"},
                'unit_amount': amount_cents,
            },
            'quantity': 1,
        }],
        success_url="https://i-park.com/checkout/success",
        cancel_url="https://i-park.com/checkout/cancel",
    )
    return {'checkout_url': session.url, 'session_id': session.id, 'reservationId': reservation_id}

def confirm_checkout_session(session_id):
    session = stripe.checkout.Session.retrieve(session_id)
    intent = stripe.PaymentIntent.retrieve(session.payment_intent)

    payment_doc = create_payment_document(session, intent)
    db.payments.insert_one(payment_doc)

    if session.customer_email:
        send_mail(
            "I-PARK Reservation Confirmation",
            f"Reservation ID: {payment_doc['reservationId']}\\n"
            f"Amount: {payment_doc['montant']} {payment_doc['devise']}",
            settings.DEFAULT_FROM_EMAIL,
            [session.customer_email],
            html_message=f"<b>Reservation Confirmed</b><br>Ref: {payment_doc['reservationId']}"
        )

    return {'payment_id': str(payment_doc['_id']), 'reservationId': payment_doc['reservationId'], 'status': payment_doc['status']}
