from django.urls import path
from .views import UserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('register/', UserView.as_view(), name='register-user'),
    path('update/<str:user_id>/', UserView.as_view(), name='update-user'),
    path('view-user/<str:user_id>/', UserView.as_view(), name='view-user'),

    #obtain token
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]