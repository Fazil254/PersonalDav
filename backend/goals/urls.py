from django.urls import path
from .views import (GoalListCreateView, GoalDetailView,
                    GoalCategoryListCreateView, GoalCategoryDetailView,
                    MilestoneListCreateView, MilestoneDetailView,
                    GoalNoteListCreateView, GoalPDFExportView,
                    AdminGoalListView)

urlpatterns = [
    path('', GoalListCreateView.as_view(), name='goal_list_create'),
    path('<int:pk>/', GoalDetailView.as_view(), name='goal_detail'),
    path('<int:goal_id>/milestones/', MilestoneListCreateView.as_view(), name='milestones'),
    path('milestones/<int:pk>/', MilestoneDetailView.as_view(), name='milestone_detail'),
    path('<int:goal_id>/notes/', GoalNoteListCreateView.as_view(), name='goal_notes'),
    path('export/pdf/', GoalPDFExportView.as_view(), name='goal_pdf_export'),
    path('categories/', GoalCategoryListCreateView.as_view(), name='categories'),
    path('categories/<int:pk>/', GoalCategoryDetailView.as_view(), name='category_detail'),
    path('admin/all/', AdminGoalListView.as_view(), name='admin_goal_list'),
]
