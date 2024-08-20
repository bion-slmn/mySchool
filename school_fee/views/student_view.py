from django.shortcuts import get_object_or_404
from ..models import Student, School, Grade
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import StudentSerializer


class StudentView(APIView):
    def get(self, request: HttpRequest, student_id: str) -> Response:
        student = get_object_or_404(Student, id=student_id)
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    
class CreateStudent(APIView):
    def post(self, request: HttpRequest) ->Response:
        school_id = request.data.get('school_id')
        school = get_object_or_404(School, id=school_id)

        grade_id = request.data.get('grade_id')
        grade = get_object_or_404(Grade, id=grade_id)

        data =  {
            'name': request.data.get('name'),
            'date_of_birth': request.data.get('date_of_birth '),
            'gender': request.data.get('gender')
        }
        
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(school=school, grade=grade)
            return Response(serializer.data, 201)
        return Response(serializer.errors)
