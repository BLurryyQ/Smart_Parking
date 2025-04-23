# payments/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from bson import ObjectId
from Smart_Parking.database import db
from .services import create_checkout_session, confirm_checkout_session

class PaymentViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'], url_path='create-checkout-session')
    def create_checkout_session(self, request):
        try:
            session_info = create_checkout_session(request.data)
            return Response(session_info, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='confirm')
    def confirm(self, request):
        session_id = request.data.get('session_id')
        if not session_id:
            return Response({'error': 'session_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            result = confirm_checkout_session(session_id)
            return Response(result, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request):
        payments = list(db.payments.find())
        for p in payments:
            p['id'] = str(p['_id'])
            del p['_id']
        return Response(payments)

    def retrieve(self, request, pk=None):
        payment = db.payments.find_one({'_id': ObjectId(pk)})
        if not payment:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
        payment['id'] = str(payment['_id'])
        del payment['_id']
        return Response(payment)
