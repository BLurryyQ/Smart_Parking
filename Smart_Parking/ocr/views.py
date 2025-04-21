import os
import traceback
from PIL import Image
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .predict import predict_plate

@csrf_exempt
def recognize_plate(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Only POST allowed'}, status=405)

    try:
        image_file = request.FILES.get('image')
        if not image_file:
            return JsonResponse({'success': False, 'error': 'No image provided'}, status=400)

        # Save the uploaded image temporarily
        temp_path = 'ocr/temp_plate.jpg'
        with open(temp_path, 'wb+') as destination:
            for chunk in image_file.chunks():
                destination.write(chunk)

        # Run CRNN prediction
        predicted = predict_plate(temp_path)

        os.remove(temp_path)  # clean up temp file

        if predicted:
            import re
            match = re.match(r"(\d+)([ء-ي])(\d+)", predicted)
            if match:
                number, letter, region = match.groups()
                return JsonResponse({
                    'success': True,
                    'plate': {
                        'number': number,
                        'letter': letter,
                        'region': region
                    },
                    'rawText': f"{number}-{letter}-{region}"
                })
            else:
                return JsonResponse({
                    'success': True,
                    'plate': None,
                    'rawText': predicted,
                    'message': "Format not matched"
                })

        return JsonResponse({
            'success': True,
            'plate': None,
            'rawText': '',
            'message': 'Empty prediction'
        })

    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
