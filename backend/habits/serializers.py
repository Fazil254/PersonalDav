from rest_framework import serializers
from .models import Habit, HabitLog
from django.utils import timezone


class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ['id', 'date', 'completed', 'note', 'created_at']
        read_only_fields = ['created_at']


class HabitSerializer(serializers.ModelSerializer):
    logs = HabitLogSerializer(many=True, read_only=True)
    today_completed = serializers.SerializerMethodField()
    completion_rate = serializers.SerializerMethodField()

    class Meta:
        model = Habit
        fields = ['id', 'name', 'description', 'icon', 'color', 'frequency',
                  'target_days', 'reminder_time', 'is_active', 'current_streak',
                  'longest_streak', 'total_completions', 'created_at',
                  'logs', 'today_completed', 'completion_rate']
        read_only_fields = ['current_streak', 'longest_streak', 'total_completions', 'created_at']

    def get_today_completed(self, obj):
        today = timezone.localdate()
        return obj.logs.filter(date=today, completed=True).exists()

    def get_completion_rate(self, obj):
        total = obj.logs.count()
        if total == 0:
            return 0
        completed = obj.logs.filter(completed=True).count()
        return round((completed / total) * 100, 1)


class HabitCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['name', 'description', 'icon', 'color', 'frequency',
                  'target_days', 'reminder_time', 'is_active']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
