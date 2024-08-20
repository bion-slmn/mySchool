from django.urls import path
from .views.school_view import SchoolView, CreateSchool
from .views.grade_view import GradeView
from .views.fee_view import FeeView

urlpatterns = [
    # routes for school
    path('view-school/<str:school_id>/', SchoolView.as_view()),
    path('create-school/', CreateSchool.as_view()),

    # Route for Grades
    path('create-grade/', GradeView.as_view()),

    # Routes for fee
    path('create-fee/<str:grade_id>/', FeeView.as_view()),
]