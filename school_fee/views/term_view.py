from ..models import Term
from rest_framework.response import Response
from django.http import HttpRequest
from ..decorator import handle_exceptions
from rest_framework.views import APIView
from ..serializers import TermSerializer



class TermView(APIView):
    @handle_exceptions
    def get(self, request: HttpRequest) -> Response:
        """
        Retrieves a list of all terms in the system.
        Args:
            request (HttpRequest): The HTTP request object.
        Returns:
            Response: A response containing the serialized term data.
        """
        status = request.query_params.get('status')
        if status:
            terms = Term.objects.filter(is_current=True)
        else:
            terms = Term.objects.all()
        serializer = TermSerializer(terms, many=True)
        return Response(serializer.data)
    
    @handle_exceptions
    def post(self, request: HttpRequest) -> Response:
        """
        Creates a new term record based on the provided request data.
        Args:
            request (HttpRequest): The HTTP request object containing term data.
        Returns:
            Response: A response containing the serialized term data if successful,
            or error details.
        """
        serializer = TermSerializer(data=request.data)
        school = request.user.schools
        serializer.is_valid(raise_exception=True)
        serializer.save(school=school)
        return Response(serializer.data, 201)
    
