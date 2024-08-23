from django.shortcuts import get_object_or_404
from ..models import Student, School, Grade
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import StudentSerializer
from .grade_view import check_has_school
from ..decorator import handle_exceptions

class StudentView(APIView):
    def get(self, request: HttpRequest, student_id: str) -> Response:
        """
        Retrieves a student's information based on the provided student ID.
        Args:
            request (HttpRequest): The HTTP request object.
            student_id (str): The ID of the student to retrieve.

        Returns:
            Response: A response containing the serialized student data.
        """

        student = get_object_or_404(Student, id=student_id)
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    
class CreateStudent(APIView):
    @handle_exceptions
    def post(self, request: HttpRequest) ->Response:
        """
        Creates a new student record based on the provided request data.

        Args:
            request (HttpRequest): The HTTP request object containing student data.

        Returns:
            Response: A response containing the serialized student data if successful,
              or error details

        Raises:
            Http404: If the specified grade does not exist.
        """

        school = check_has_school(request)
        if not school:
            return Response('User has no School', 400)

        grade_id = request.data.get('grade')
        grade = get_object_or_404(Grade, id=grade_id)

        data =  {
            'name': request.data.get('name'),
            'date_of_birth': request.data.get('date_of_birth '),
            'gender': request.data.get('gender')
        }
        
        serializer = StudentSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(school=school, grade=grade)
            return Response(serializer.data, 201)
        return Response(serializer.errors, 400)
