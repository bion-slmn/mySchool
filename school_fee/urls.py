from django.urls import path
from .views.school_view import SchoolView, CreateSchool
from .views.grade_view import GradeView, StudentInGradeView
from .views.fee_view import FeeView, FeePercentageCollected, GradeFeeView
from .views.student_view import StudentView, CreateStudent
from .views.payment_views import (PaymentonFee, CreatePaymentView,
                                   PaymentPerStudent)
from .views.search_view import GetDetailView, SearchView

urlpatterns = [
    # routes for school
    path('view-school/<str:school_id>/', SchoolView.as_view()),
    path('create-school/', CreateSchool.as_view()),

    # Route for Grades
    path('create-grade/', GradeView.as_view()),
    path('view-all-grades/', GradeView.as_view()),

    # Route For student
    path('register-student/', CreateStudent.as_view()),
    path('view-student/<str:student_id>/', StudentView.as_view()),
    path('students-in-grade/<str:grade_id>/', StudentInGradeView.as_view(), name="list 0f students in grade"),
    

    # Routes for fee
    path('create-fee/<str:grade_id>/', FeeView.as_view()),
    path('percentage-fee-per-grade/', FeePercentageCollected.as_view()),
    path('fees-in-grade/<str:grade_id>/', GradeFeeView.as_view()),

    # route for payments
    path('payment-on-fee/<str:fee_id>/', PaymentonFee.as_view()),
    path('create-payment/', CreatePaymentView.as_view(), name='create-payment'),
    path('payments-per-student/<str:fee_id>/', PaymentPerStudent.as_view()),

    # search routes
    path('search-student/', SearchView.as_view()),
    path('get-student-detail/', GetDetailView.as_view()),
]