import datetime
from bson import ObjectId
from mongoengine import Document, EmbeddedDocument, fields


class MethodePaiement(EmbeddedDocument):
    type = fields.StringField(choices=['carte', 'paypal', 'stripe'], required=True)
    provider = fields.StringField(choices=['stripe', 'paypal'], required=True)
    paymentIntentId = fields.StringField()
    sessionId = fields.StringField()
    customerId = fields.StringField()
    paymentMethodId = fields.StringField()
    metadata = fields.DictField()


class Refund(EmbeddedDocument):
    montant = fields.FloatField(required=True)
    raison = fields.StringField(required=True)
    date = fields.DateTimeField(default=datetime.datetime.utcnow)
    status = fields.StringField(choices=['pending', 'succeeded', 'failed'], required=True)


class ErrorDetails(EmbeddedDocument):
    code = fields.StringField()
    message = fields.StringField()
    declineCode = fields.StringField()


class Payment(Document):
    reservationId = fields.StringField(default=lambda: str(ObjectId()), required=True)
    montant = fields.FloatField(required=True)
    devise = fields.StringField(choices=['EUR', 'USD', 'MAD'], required=True)
    methodePaiement = fields.EmbeddedDocumentField(MethodePaiement, required=True)
    status = fields.StringField(choices=[
        'created', 'processing', 'requires_action', 'succeeded',
        'failed', 'cancelled', 'refunded', 'partially_refunded'
    ], required=True)
    errorDetails = fields.EmbeddedDocumentField(ErrorDetails)
    datePaiement = fields.DateTimeField()
    dateCreation = fields.DateTimeField(default=datetime.datetime.utcnow)
    dateUpdate = fields.DateTimeField(default=datetime.datetime.utcnow)
    transactionId = fields.StringField()
    refunds = fields.EmbeddedDocumentListField(Refund)

    meta = {
        'collection': 'payments'
    }