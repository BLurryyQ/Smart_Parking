from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ParkingLot, ParkingSpace
from .serializers import ParkingLotSerializer, ParkingSpaceSerializer

# --------------------
# ParkingLot CRUD
# --------------------
class ParkingLotList(APIView):
    def get(self, request):
        lots = ParkingLot.objects.all()
        serializer = ParkingLotSerializer(lots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ParkingLotSerializer(data=request.data)
        if serializer.is_valid():
            lot = serializer.save()
            return Response(ParkingLotSerializer(lot).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ParkingLotDetail(APIView):
    def get_object(self, pk):
        try:
            return ParkingLot.objects.get(id=pk)
        except ParkingLot.DoesNotExist:
            return None

    def get(self, request, pk):
        lot = self.get_object(pk)
        if not lot:
            return Response({'error': 'ParkingLot not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ParkingLotSerializer(lot)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        lot = self.get_object(pk)
        if not lot:
            return Response({'error': 'ParkingLot not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ParkingLotSerializer(lot, data=request.data, partial=True)
        if serializer.is_valid():
            lot = serializer.save()
            return Response(ParkingLotSerializer(lot).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        lot = self.get_object(pk)
        if not lot:
            return Response({'error': 'ParkingLot not found'}, status=status.HTTP_404_NOT_FOUND)
        lot.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --------------------
# ParkingSpace CRUD
# --------------------
class ParkingSpaceList(APIView):
    def get(self, request):
        spaces = ParkingSpace.objects.all()
        serializer = ParkingSpaceSerializer(spaces, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ParkingSpaceSerializer(data=request.data)
        if serializer.is_valid():
            space = serializer.save()
            return Response(ParkingSpaceSerializer(space).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ParkingSpaceDetail(APIView):
    def get_object(self, pk):
        try:
            return ParkingSpace.objects.get(id=pk)
        except ParkingSpace.DoesNotExist:
            return None

    def get(self, request, pk):
        space = self.get_object(pk)
        if not space:
            return Response({'error': 'ParkingSpace not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ParkingSpaceSerializer(space)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        space = self.get_object(pk)
        if not space:
            return Response({'error': 'ParkingSpace not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ParkingSpaceSerializer(space, data=request.data, partial=True)
        if serializer.is_valid():
            space = serializer.save()
            return Response(ParkingSpaceSerializer(space).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        space = self.get_object(pk)
        if not space:
            return Response({'error': 'ParkingSpace not found'}, status=status.HTTP_404_NOT_FOUND)
        space.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
