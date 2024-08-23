from django.urls import path
from .views.school_view import SchoolView, CreateSchool
from .views.grade_view import GradeView
from .views.fee_view import FeeView
from .views.student_view import StudentView, CreateStudent

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
    

    # Routes for fee
    path('create-fee/<str:grade_id>/', FeeView.as_view()),
]