from django.shortcuts import get_object_or_404
from ..models import Fee, Grade, Student
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import FeeSerializer


class FeeView(APIView):
    def get(self, request: HttpRequest, fee_id) -> Response:
        fee = get_object_or_404(Fee, id=fee_id)
        serializer = FeeSerializer(fee)
        return Response(serializer.data)
    
    def post(self, request: HttpRequest, grade_id) -> Response:
        grade = get_object_or_404(Grade, id=grade_id)
        serializer = FeeSerializer(data=request.data)

        if serializer.is_valid():
            fee = serializer.save(grade=grade)

            # Add the fee to all students in the grade
            grade_students = Student.objects.filter(grade=grade)
            fee.students.add(*grade_students)

            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
