from django.shortcuts import get_object_or_404
from ..models import Fee, Grade, Student, Term
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import FeeSerializer
from ..decorator import handle_exceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from typing import List, Dict, Any
from collections import defaultdict
from django.db.models import Count, Prefetch


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
    permission_classes = [AllowAny]
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
    def post(self, request: HttpRequest) -> Response:
        """
        Creates a new fee associated with a and assigns it to all students in that grade.

        Returns:
            Response: A response containing the serialized fee data if
            the creation is successful, or error details if validation fails.

        Raises:
            Http404: If the grade with the specified ID does not exist.
        """      
        
        fee_data = request.data.copy()
        
        fee_data.pop('grade_ids', None)
        
        if not fee_data:
            raise ValueError({"detail": "Fee details must be provided."})
        
        serializer = FeeSerializer(data=fee_data, partial=True)
        serializer.is_valid(raise_exception=True)
        print(fee_data, 2222222222)

        if fee_data.get("fee_type") == "ADMISSION":
            serializer.save()

            return Response(serializer.data, 201)
        
        grades = self.validate_grade_id(request)

        results = []
       
        for grade in grades:
    
            fee = serializer.save(grade=grade)
            grade_students = Student.objects.filter(grade=grade)
            fee.students.add(*grade_students)
            results.append(FeeSerializer(fee).data)

        return Response(results, status=status.HTTP_201_CREATED)
    
    def validate_grade_id(self, request) -> List[Grade]:
        """
        Validates the provided grade IDs and returns the corresponding Grade objects.

        Returns:
            List[Grade]: A list of Grade objects corresponding to the provided grade IDs.

        Raises:
            Http404: If any of the provided grade IDs are invalid.
        """

        grade_ids = request.data.get('grade_ids', [])
        if not grade_ids or not isinstance(grade_ids, list):
            raise ValueError({"detail": "Grade IDs must be provided as a list."})

        grades = Grade.objects.filter(id__in=grade_ids)

        if len(grades) != len(grade_ids):
            raise ValueError({"detail": "Some grade IDs are invalid."})
        
        return grades


class FeePercentageCollected(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest) -> Response:
        """
        Get the percentage of fees collected per grade, optimized for performance.
        """
        term_id = request.query_params.get('term_id')
        print(term_id,2222)
        fees_queryset = Fee.objects.filter(term=term_id)
        grades = Grade.objects.filter(fees__term=term_id
                                      ).prefetch_related(
                                          Prefetch('fees', queryset=fees_queryset)
                                          ).annotate(total_students=Count('students'),
                                                     ).values(
                                                         'id',
                                                        'name',
                                                        'total_students',
                                                        'fees__id',
                                                        'fees__total_amount',
                                                        'fees__name',
                                                        'fees__total_paid',)
        result = group_by_key(grades, 'name') if grades else {}

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
        results = []
        admission_fee = Fee.objects.filter(fee_type='ADMISSION').values('id', 'name', 'total_amount')

        if admission_status := request.query_params.get('admission_status'):
            results = [*admission_fee]
        else:
            grade = get_object_or_404(Grade, id=grade_id)
            fee = grade.fees.all().values('id', 'name', 'total_amount')
            results = [*fee, *admission_fee]
        return Response(results, 200)


class DailyFeeView(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest, grade_id) -> Response:
        """
        Handles GET requests to retrieve daily fee information for a specific grade.

        Args:
            request (HttpRequest): The HTTP request object.
            grade_id (int): The ID of the grade for which to retrieve daily fee information.

        Returns:
            Response: A Response object containing the daily fee details for the specified grade.
        """
        grade = get_object_or_404(Grade, id=grade_id)
        if date := request.query_params.get('created_at'):
            daily_fee = Fee.objects.filter(grade=grade_id, fee_type='DAILY', created_at__contains=date)
        else:
            daily_fee = Fee.objects.filter(grade=grade, fee_type='DAILY')
        daily_fee = daily_fee.values('id', 'name', 'total_amount', 'created_at')
        return Response(daily_fee, 200)

    


class FeePerTerm(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest, term_id) -> Response:
        term  = get_object_or_404(Term.objects.prefetch_related('fees'), id=term_id)
        fees = term.fees.all().values('id', 'name', 'total_amount','fee_type', 'is_active')
        return Response(fees, 200)