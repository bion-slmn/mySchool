from django.shortcuts import get_object_or_404
from ..models import Grade, School
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import GradeSerializer

class GradeView(APIView):
    def get(self, request: HttpRequest, grade_id: str) -> Response:
        grade = get_object_or_404(Grade, id = grade_id)
        serializer = GradeSerializer(grade)
        return Response(serializer.data)
    
    def post(self,  request: HttpRequest) ->Response:
        serializer = GradeSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(school = request.user.schools)
            return Response(serializer.data, 201)
        return Response(serializer.errors)