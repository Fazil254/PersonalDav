from django.db import models
from users.models import User


class JournalTag(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_tags')
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=20, default='#6366f1')

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ['user', 'name']


class JournalEntry(models.Model):
    MOOD_CHOICES = [
        (1, '😞 Very Bad'),
        (2, '😕 Bad'),
        (3, '😐 Neutral'),
        (4, '😊 Good'),
        (5, '😄 Excellent'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_entries')
    title = models.CharField(max_length=200)
    content = models.TextField()
    mood = models.PositiveSmallIntegerField(choices=MOOD_CHOICES, default=3)
    tags = models.ManyToManyField(JournalTag, blank=True, related_name='entries')
    is_private = models.BooleanField(default=True)
    word_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.word_count = len(self.content.split())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} — {self.user.email} ({self.created_at.date()})"

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Journal Entries'
