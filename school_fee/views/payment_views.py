from django.shortcuts import get_object_or_404
from ..models import Fee
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import PaymentSerializer
from ..decorator import handle_exceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from .fee_view import group_by_key


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

        fee = get_object_or_404(
            Fee.objects.prefetch_related('payments'), id=fee_id)
        results = fee.payments.all()
        serializer = PaymentSerializer(results, many=True)
        grouped_result = group_by_key(serializer.data, 'student_name')
        return Response(grouped_result, 200)


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
