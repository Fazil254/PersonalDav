from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Habit, HabitLog
from .serializers import HabitSerializer, HabitCreateSerializer, HabitLogSerializer


class HabitListCreateView(generics.ListCreateAPIView):
    def get_queryset(self):
        qs = Habit.objects.filter(user=self.request.user).prefetch_related('logs')
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        return qs

    def get_serializer_class(self):
        return HabitCreateSerializer if self.request.method == 'POST' else HabitSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class HabitDetailView(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user).prefetch_related('logs')

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return HabitCreateSerializer
        return HabitSerializer


class HabitLogView(APIView):
    """Toggle habit completion for a given date."""

    def post(self, request, habit_id):
        try:
            habit = Habit.objects.get(id=habit_id, user=request.user)
        except Habit.DoesNotExist:
            return Response({'error': 'Habit not found.'}, status=status.HTTP_404_NOT_FOUND)

        date_str = request.data.get('date', str(timezone.localdate()))
        try:
            from datetime import date
            log_date = date.fromisoformat(date_str)
        except ValueError:
            return Response({'error': 'Invalid date format.'}, status=status.HTTP_400_BAD_REQUEST)

        log, created = HabitLog.objects.get_or_create(
            habit=habit, date=log_date,
            defaults={'completed': True, 'note': request.data.get('note', '')}
        )

        if not created:
            log.completed = not log.completed
            log.note = request.data.get('note', log.note)
            log.save()

        # Update streak & totals
        self._update_streak(habit)

        return Response({
            'log': HabitLogSerializer(log).data,
            'habit': HabitSerializer(habit).data,
        })

    def _update_streak(self, habit):
        from datetime import timedelta
        logs = habit.logs.filter(completed=True).order_by('-date')
        today = timezone.localdate()
        streak = 0
        check_date = today

        for log in logs:
            if log.date == check_date:
                streak += 1
                check_date -= timedelta(days=1)
            elif log.date < check_date:
                break

        habit.current_streak = streak
        habit.longest_streak = max(habit.longest_streak, streak)
        habit.total_completions = habit.logs.filter(completed=True).count()
        habit.save(update_fields=['current_streak', 'longest_streak', 'total_completions'])


class HabitStatsView(APIView):
    """Weekly habit completion data for chart."""

    def get(self, request):
        from datetime import timedelta
        today = timezone.localdate()
        week_start = today - timedelta(days=6)
        habits = Habit.objects.filter(user=request.user, is_active=True)

        stats = []
        for i in range(7):
            day = week_start + timedelta(days=i)
            completed = HabitLog.objects.filter(
                habit__in=habits, date=day, completed=True
            ).count()
            stats.append({
                'date': str(day),
                'day': day.strftime('%a'),
                'completed': completed,
                'total': habits.count(),
            })
        return Response(stats)


class AdminHabitListView(generics.ListAPIView):
    queryset = Habit.objects.all().select_related('user')
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields = ['name', 'user__email']
    filterset_fields = ['frequency', 'is_active']
