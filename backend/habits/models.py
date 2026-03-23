from django.db import models
from users.models import User


class Habit(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('custom', 'Custom'),
    ]
    COLOR_CHOICES = [
        ('#6366f1', 'Indigo'),
        ('#10b981', 'Emerald'),
        ('#f59e0b', 'Amber'),
        ('#ef4444', 'Red'),
        ('#3b82f6', 'Blue'),
        ('#8b5cf6', 'Purple'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=10, default='✅')
    color = models.CharField(max_length=20, choices=COLOR_CHOICES, default='#6366f1')
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, default='daily')
    target_days = models.PositiveIntegerField(default=1)  # times per week for weekly
    reminder_time = models.TimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    total_completions = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.icon} {self.name} — {self.user.email}"

    class Meta:
        ordering = ['-created_at']


class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    completed = models.BooleanField(default=False)
    note = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.habit.name} — {self.date} — {'✅' if self.completed else '❌'}"

    class Meta:
        unique_together = ['habit', 'date']
        ordering = ['-date']
