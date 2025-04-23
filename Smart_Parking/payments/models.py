# payments/models.py
from datetime import datetime

def create_payment_document(session, intent):
    return {
        "reservationId": session.client_reference_id,
        "montant": intent.amount / 100,
        "devise": intent.currency.upper(),
        "status": intent.status,
        "methodePaiement": {
            "type": "stripe",
            "provider": "stripe",
            "sessionId": session.id,
            "paymentIntentId": intent.id,
            "customerId": session.customer,
            "metadata": intent.metadata or {}
        },
        "datePaiement": datetime.utcnow(),
        "dateCreation": datetime.utcnow(),
        "dateUpdate": datetime.utcnow(),
        "transactionId": intent.id,
        "refunds": []
    }
