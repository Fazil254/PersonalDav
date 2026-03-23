from django.urls import path
from .views import (JournalEntryListCreateView, JournalEntryDetailView,
                    JournalTagListCreateView, JournalTagDetailView,
                    JournalMoodStatsView, AdminJournalListView)

urlpatterns = [
    path('', JournalEntryListCreateView.as_view(), name='journal_list'),
    path('<int:pk>/', JournalEntryDetailView.as_view(), name='journal_detail'),
    path('tags/', JournalTagListCreateView.as_view(), name='journal_tags'),
    path('tags/<int:pk>/', JournalTagDetailView.as_view(), name='journal_tag_detail'),
    path('stats/mood/', JournalMoodStatsView.as_view(), name='mood_stats'),
    path('admin/all/', AdminJournalListView.as_view(), name='admin_journal'),
]
