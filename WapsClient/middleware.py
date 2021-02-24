from django.core.exceptions import PermissionDenied
from django.conf import settings
ALLOWED_IP=settings.ALLOWED_IP

class FilterIPMiddleware(object):
    # Check if client IP address is allowed
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        self.process_request(request)
        return self.get_response(request)

    def process_request(self, request):
        if ALLOWED_IP!=['*']:
            ip = request.META.get('REMOTE_ADDR') # Get client IP address
            if ip not in ALLOWED_IP:
                raise PermissionDenied
        else:
            return None