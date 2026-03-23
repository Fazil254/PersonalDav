from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import timedelta
from goals.models import Goal
from habits.models import Habit, HabitLog
from journal.models import JournalEntry
from users.models import User


class UserDashboardView(APIView):
    def get(self, request):
        user = request.user
        today = timezone.localdate()
        week_ago = today - timedelta(days=7)

        # Goals summary
        goals = Goal.objects.filter(user=user)
        goals_summary = {
            'total': goals.count(),
            'completed': goals.filter(status='completed').count(),
            'in_progress': goals.filter(status='in_progress').count(),
            'not_started': goals.filter(status='not_started').count(),
            'avg_progress': round(goals.aggregate(avg=Avg('progress'))['avg'] or 0, 1),
        }

        # Habits summary
        habits = Habit.objects.filter(user=user, is_active=True)
        today_completed = HabitLog.objects.filter(
            habit__in=habits, date=today, completed=True
        ).count()
        habits_summary = {
            'total_active': habits.count(),
            'today_completed': today_completed,
            'today_total': habits.count(),
            'best_streak': habits.aggregate(best=Count('current_streak'))['best'] or 0,
        }

        # Journal summary
        journal_entries = JournalEntry.objects.filter(user=user)
        recent_mood = journal_entries.filter(
            created_at__date__gte=week_ago
        ).aggregate(avg=Avg('mood'))['avg'] or 0
        journal_summary = {
            'total_entries': journal_entries.count(),
            'this_week': journal_entries.filter(created_at__date__gte=week_ago).count(),
            'avg_mood_this_week': round(recent_mood, 1),
            'total_words': sum(e.word_count for e in journal_entries),
        }

        # Recent activity
        recent_goals = Goal.objects.filter(user=user).order_by('-updated_at')[:3]
        recent_journals = JournalEntry.objects.filter(user=user).order_by('-created_at')[:3]

        # Habit weekly chart data
        weekly_habit_data = []
        for i in range(7):
            day = today - timedelta(days=6 - i)
            completed = HabitLog.objects.filter(
                habit__in=habits, date=day, completed=True
            ).count()
            weekly_habit_data.append({
                'day': day.strftime('%a'),
                'date': str(day),
                'completed': completed,
                'total': habits.count(),
            })

        # Goal status chart data
        goal_status_chart = [
            {'name': 'Completed', 'value': goals_summary['completed'], 'color': '#10b981'},
            {'name': 'In Progress', 'value': goals_summary['in_progress'], 'color': '#6366f1'},
            {'name': 'Not Started', 'value': goals_summary['not_started'], 'color': '#94a3b8'},
            {'name': 'Paused', 'value': goals.filter(status='paused').count(), 'color': '#f59e0b'},
        ]

        return Response({
            'goals': goals_summary,
            'habits': habits_summary,
            'journal': journal_summary,
            'weekly_habit_chart': weekly_habit_data,
            'goal_status_chart': goal_status_chart,
            'recent_goals': [{'id': g.id, 'title': g.title, 'status': g.status, 'progress': g.progress} for g in recent_goals],
            'recent_journals': [{'id': j.id, 'title': j.title, 'mood': j.mood, 'created_at': str(j.created_at.date())} for j in recent_journals],
        })


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        total_goals = Goal.objects.count()
        completed_goals = Goal.objects.filter(status='completed').count()
        total_habits = Habit.objects.count()
        total_journals = JournalEntry.objects.count()

        # New users this week
        week_ago = timezone.now() - timedelta(days=7)
        new_users = User.objects.filter(date_joined__gte=week_ago).count()

        # Goals by status
        goals_by_status = list(Goal.objects.values('status').annotate(count=Count('id')))

        # Recent users
        recent_users = list(User.objects.order_by('-date_joined')[:5].values(
            'id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined'
        ))

        return Response({
            'stats': {
                'total_users': total_users,
                'active_users': active_users,
                'new_users_this_week': new_users,
                'total_goals': total_goals,
                'completed_goals': completed_goals,
                'total_habits': total_habits,
                'total_journals': total_journals,
            },
            'goals_by_status': goals_by_status,
            'recent_users': recent_users,
        })
