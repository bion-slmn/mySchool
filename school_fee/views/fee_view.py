from django.shortcuts import get_object_or_404
from ..models import Fee, Grade, Student
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import FeeSerializer
from ..decorator import handle_exceptions
from django.db.models import Count, Sum, F, FloatField
from rest_framework import status


class FeeView(APIView):
    @handle_exceptions
    def get(self, request: HttpRequest, fee_id) -> Response:
        """
        Retrieves a specific fee object and returns its serialized data.
        Args:
            request (HttpRequest): The HTTP request object.
            fee_id (int): The ID of the fee to retrieve.

        Returns:
            Response: A response containing the serialized fee data.

        Raises:
            Http404: If the fee with the specified ID does not exist.
        """

        fee = get_object_or_404(Fee, id=fee_id)
        serializer = FeeSerializer(fee)
        return Response(serializer.data)
    
    @handle_exceptions
    def post(self, request: HttpRequest, grade_id) -> Response:
        """
        Creates a new fee associated with a specific grade and assigns it to all students in that grade.

        Args:
            request (HttpRequest): The HTTP request object containing the fee data.
            grade_id (int): The ID of the grade to which the fee will be associated.

        Returns:
            Response: A response containing the serialized fee data if 
            the creation is successful, or error details if validation fails.

        Raises:
            Http404: If the grade with the specified ID does not exist.
        """

        grade = get_object_or_404(Grade, id=grade_id)
        serializer = FeeSerializer(data=request.data)

        if serializer.is_valid():
            fee = serializer.save(grade=grade)

            # Add the fee to all students in the grade
            grade_students = Student.objects.filter(grade=grade)
            fee.students.add(*grade_students)

            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)



class FeePercentageCollected(APIView):

    @handle_exceptions
    def get(self, request: HttpRequest) -> Response:
        """
        Get the percentage of fees collected per grade, optimized for performance.
        """
        grades = Grade.objects.annotate(
            num_students=Count('students'),
            total_fee=Sum(F('fees__total_amount') * F('num_students'), output_field=FloatField()),
            total_amount_paid=Sum(F('fees__total_paid') * F('num_students'), output_field=FloatField()),
            
        ).prefetch_related('fees')

        results = [
            {
                'grade_name': grade.name,
                'total_fee': grade.total_fee or 0,
                'total_amount_paid': grade.total_amount_paid or 0,
            }
            for grade in grades
        ]

        return Response(results, status=status.HTTP_200_OK)

            


class GradeFeeView(APIView):
    def get(self, request: HttpRequest, grade_id) -> Response:
        """Get the fee for each grade"""
        grade = get_object_or_404(Grade, id=grade_id)
        fee = grade.fees.all().values('name', 'total_amount')
        return Response(fee, 200)
