from rest_framework import generics, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Count
from .models import JournalEntry, JournalTag
from .serializers import JournalEntrySerializer, JournalTagSerializer


class JournalTagListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalTagSerializer

    def get_queryset(self):
        return JournalTag.objects.filter(user=self.request.user)


class JournalTagDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JournalTagSerializer

    def get_queryset(self):
        return JournalTag.objects.filter(user=self.request.user)


class JournalEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalEntrySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['mood', 'is_private']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'mood', 'word_count']

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user).prefetch_related('tags')


class JournalEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JournalEntrySerializer

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user).prefetch_related('tags')


class JournalMoodStatsView(APIView):
    """Mood trend for the last 30 days."""

    def get(self, request):
        from datetime import timedelta
        from django.utils import timezone
        thirty_days_ago = timezone.now() - timedelta(days=30)

        entries = JournalEntry.objects.filter(
            user=request.user,
            created_at__gte=thirty_days_ago
        ).values('created_at__date').annotate(avg_mood=Avg('mood')).order_by('created_at__date')

        data = [{'date': str(e['created_at__date']), 'avg_mood': round(e['avg_mood'], 2)} for e in entries]
        total = JournalEntry.objects.filter(user=request.user).count()
        overall_avg = JournalEntry.objects.filter(user=request.user).aggregate(avg=Avg('mood'))['avg'] or 0

        return Response({
            'mood_trend': data,
            'total_entries': total,
            'overall_avg_mood': round(overall_avg, 2),
        })


class AdminJournalListView(generics.ListAPIView):
    queryset = JournalEntry.objects.all().select_related('user')
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields = ['title', 'user__email']
    filterset_fields = ['mood']
