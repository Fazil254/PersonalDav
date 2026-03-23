from rest_framework import serializers
from .models import JournalEntry, JournalTag


class JournalTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalTag
        fields = ['id', 'name', 'color']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class JournalEntrySerializer(serializers.ModelSerializer):
    tags = JournalTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=JournalTag.objects.all(), many=True, write_only=True, source='tags', required=False
    )
    mood_display = serializers.CharField(source='get_mood_display', read_only=True)

    class Meta:
        model = JournalEntry
        fields = ['id', 'title', 'content', 'mood', 'mood_display', 'tags', 'tag_ids',
                  'is_private', 'word_count', 'created_at', 'updated_at']
        read_only_fields = ['word_count', 'created_at', 'updated_at']

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        validated_data['user'] = self.context['request'].user
        entry = super().create(validated_data)
        entry.tags.set(tags)
        return entry

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        instance = super().update(instance, validated_data)
        if tags is not None:
            instance.tags.set(tags)
        return instance
