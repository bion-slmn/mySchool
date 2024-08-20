from django.shortcuts import get_object_or_404
from ..models import School
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import SchoolSerializer



class SchoolView(APIView):
    def get(self, request: HttpRequest, school_id: str) -> Response:
        school = get_object_or_404(School, id = school_id)
        serializer = SchoolSerializer(school)
        return Response(serializer.data)
    
class CreateSchool(APIView):
    def post(self, request: HttpRequest) ->Response:
        serializer = SchoolSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, 201)
        return Response(serializer.errors)