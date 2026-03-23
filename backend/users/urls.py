from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (RegisterView, LoginView, LogoutView, MeView,
                    ProfileView, ChangePasswordView,
                    AdminUserListView, AdminUserDetailView)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Admin endpoints
    path('admin/users/', AdminUserListView.as_view(), name='admin_users'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
]
