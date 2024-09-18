from django.shortcuts import get_object_or_404
from ..models import Fee, Payment, Student
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import PaymentSerializer
from ..decorator import handle_exceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from .fee_view import group_by_key
from typing import List, Dict, Any
from collections import defaultdict


class PaymentonFee(APIView):
    permission_classes = [AllowAny]

    def get(self, request: HttpRequest, fee_id: str) -> Response:
        """
        Handles GET requests to retrieve payment information for a specific fee.
        This method fetches the fee object, retrieves associated payments,
        and groups them by student name before returning the results.

        Args:
            self:
            request (HttpRequest): The HTTP request object containing metadata about the request.
            fee_id: The identifier of the fee for which payments are being retrieved.

        Returns:
            Response: A response object containing the grouped payment data organized by student name.
        """
    
        all_payment = self.get_payment_per_student(fee_id)
        return Response(all_payment, 200)
    
    def get_payment_per_student(self, fee_id):
    # Fetch the fee and related students and their payments in a single optimized query
        fee = get_object_or_404(Fee.objects.prefetch_related("students__payments"), id=fee_id)
        
        results = {}
        for student in fee.students.all():
            student_payments = student.payments.all()
            
            if len(student_payments) == 0:
                results[student.name] = {'student_id': student.id, 'amount': 0}
            else:
                total_payment = self.get_total_payments(student_payments)
                results[student.name] = {'student_id': student.id, 'amount': total_payment}
        
        return results

    def get_total_payments(self, student_payments):
        return sum(payment.amount for payment in student_payments)




    
    def get_total_paid_per_student(self, source: List[Dict[str, Any]]) -> List[Dict[str, int]]:
        """
        Calculate the total amount paid by each student based on a list of payment records.

        Args:
            source (List[Dict[str, Any]]): A list of dictionaries where each
              dictionary contains 
            payment details, including 'student_name', 'id', and 'amount'.

        Returns:
            List[Dict[str, int]]: A list of dictionaries, each containing 
            'id' and 'amount' for each student, representing the total amount paid.
        """

        if not source:
            return []
        
        results = {}
        for item in source:
            key = item.get('student_name')
            if key not in results:
                results[key] = {'student_id': item.get('student'), 'amount': float(item.get('amount', 0))}
            else:
                results[key]['amount'] += float(item.get('amount'))

        return results





class CreatePaymentView(APIView):
    permission_classes = [AllowAny]

    @handle_exceptions
    def post(self, request: HttpRequest) -> Response:
        """
        Create a new payment record for a student.
        """
        serializer = PaymentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentPerStudent(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest, fee_id: str) -> Response:
        """
        Retrieve payment records for a specific student based on the provided fee ID. 
        This method checks for the student ID in the request parameters and returns the
          associated payment records in a structured format.

        Args:
            request (HttpRequest): The HTTP request object containing query parameters.
            fee_id (str): The ID of the fee for which payments are being retrieved.

        Returns:
            Response: A response object containing the payment records in JSON format
            or an error message if the student ID is missing.

        Raises:
            ValueError: If the student ID is not provided in the request parameters.
        """

        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response('Student id must be passed', 400)
        payments = Payment.objects.filter(fee=fee_id, student=student_id)
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, 200)
    