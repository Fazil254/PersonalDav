from django.urls import path
from .views import HabitListCreateView, HabitDetailView, HabitLogView, HabitStatsView, AdminHabitListView

urlpatterns = [
    path('', HabitListCreateView.as_view(), name='habit_list'),
    path('<int:pk>/', HabitDetailView.as_view(), name='habit_detail'),
    path('<int:habit_id>/log/', HabitLogView.as_view(), name='habit_log'),
    path('stats/weekly/', HabitStatsView.as_view(), name='habit_stats'),
    path('admin/all/', AdminHabitListView.as_view(), name='admin_habits'),
]
