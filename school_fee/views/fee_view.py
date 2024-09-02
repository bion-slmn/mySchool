from django.shortcuts import get_object_or_404
from ..models import Fee, Grade, Student
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import FeeSerializer
from ..decorator import handle_exceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from typing import List, Dict, Any
from collections import defaultdict
from django.db.models import Count
from rest_framework.permissions import AllowAny

def group_by_key(source: List[Dict[str, Any]],
                 group_by: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Groups a list of dictionaries by a specified key.

    Args:
        source (List[Dict[str, Any]]): A list of dictionaries to be grouped.
        group_by (str): The key by which to group the dictionaries.

    Returns:
        Dict[str, List[Dict[str, Any]]]: A dictionary where each key is a value from the specified key,
                                         and each value is a list of dictionaries that have that key value.
    """

    if not source:
        return {}

    result = defaultdict(list)

    for item in source:
        key_value = item.get(group_by, 'Unknown')
        result[key_value].append(item)

    return dict(result)


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

    #@handle_exceptions
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
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest) -> Response:
        """
        Get the percentage of fees collected per grade, optimized for performance.
        """
        grades = Grade.objects.prefetch_related('fees').annotate(
            total_students=Count('students'),
        ).exclude(
            fees__isnull=True).values(
            'id',
            'name',
            'total_students',
            'fees__id',
            'fees__total_amount',
            'fees__name',
            'fees__total_paid')
        result = group_by_key(grades, 'name')

        return Response(result, status=status.HTTP_200_OK)


class GradeFeeView(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest, grade_id) -> Response:
        """
        Handles GET requests to retrieve fee information for a specific grade.

        Args:
            request (HttpRequest): The HTTP request object.
            grade_id (int): The ID of the grade for which to retrieve fee information.

        Returns:
            Response: A Response object containing the fee details for the specified grade.
        """

        grade = get_object_or_404(Grade, id=grade_id)
        fee = grade.fees.all().values('id', 'name', 'total_amount')
        return Response(fee, 200)
