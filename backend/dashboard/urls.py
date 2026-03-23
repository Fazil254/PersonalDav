from django.urls import path
from .views import UserDashboardView, AdminDashboardView

urlpatterns = [
    path('', UserDashboardView.as_view(), name='user_dashboard'),
    path('admin/', AdminDashboardView.as_view(), name='admin_dashboard'),
]
