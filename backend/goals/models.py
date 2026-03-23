from django.db import models
from users.models import User


class GoalCategory(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, default='🎯')
    color = models.CharField(max_length=20, default='#6366f1')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Goal Categories'
        ordering = ['name']


class Goal(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    category = models.ForeignKey(GoalCategory, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    progress = models.PositiveIntegerField(default=0)  # 0–100 %
    target_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='goal_images/', blank=True, null=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} — {self.user.email}"

    class Meta:
        ordering = ['-created_at']


class GoalMilestone(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    is_completed = models.BooleanField(default=False)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.goal.title})"

    class Meta:
        ordering = ['created_at']


class GoalNote(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='notes')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note for {self.goal.title}"

    class Meta:
        ordering = ['-created_at']
