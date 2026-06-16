'use client';

import React, { useState } from 'react';
import { Story, StoryScene, StoryDialogueLine, StoryChoice } from '@evlo/types';
import { cn } from '@evlo/utils';

interface StoriesViewProps {
  stories: Story[];
  onBack: () => void;
  onCompleteStory: (storyId: string, xpReward: number) => void;
  onPlayTTS: (text: string) => void;
}

const difficultyColors: Record<string, string> = {
  N5: 'var(--green-400)',
  N4: 'var(--blue)',
  N3: 'var(--amber)',
  N2: 'var(--orange)',
  N1: 'var(--red)',
};

export function StoriesView({ stories, onBack, onCompleteStory, onPlayTTS }: StoriesViewProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [choiceAnswered, setChoiceAnswered] = useState(false);
  const [storyDone, setStoryDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const startStory = (story: Story) => {
    setActiveStory(story);
    setSceneIndex(0);
    setDialogueIndex(0);
    setSelectedChoice(null);
    setChoiceAnswered(false);
    setStoryDone(false);
    setXpEarned(0);
  };

  const handleNext = () => {
    if (!activeStory) return;
    const scene = activeStory.scenes[sceneIndex];

    // If still reading dialogue
    if (dialogueIndex < scene.dialogue.length - 1) {
      setDialogueIndex(d => d + 1);
      return;
    }

    // If scene has choices and not answered yet
    if (scene.choices && scene.choices.length > 0 && !choiceAnswered) return;

    // Move to next scene
    const nextIndex = sceneIndex + 1;
    if (nextIndex >= activeStory.scenes.length || scene.is_end) {
      setStoryDone(true);
      setXpEarned(activeStory.xp_reward);
      onCompleteStory(activeStory.story_id, activeStory.xp_reward);
    } else {
      setSceneIndex(nextIndex);
      setDialogueIndex(0);
      setSelectedChoice(null);
      setChoiceAnswered(false);
    }
  };

  const handleChoiceSelect = (choice: StoryChoice) => {
    if (choiceAnswered) return;
    setSelectedChoice(choice.choice_id);
    setChoiceAnswered(true);
    if (choice.xp_bonus > 0) setXpEarned(xp => xp + choice.xp_bonus);
  };

  // -- Story Player --
  if (activeStory) {
    if (storyDone) {
      return (
        <div className="story-done-screen page-enter">
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>📖</div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            Story Complete!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            {activeStory.title}
          </p>
          <div className="story-done-reward">
            <span>⚡ +{xpEarned} XP earned</span>
          </div>
          <button
            className="btn btn-primary btn-lg"
            style={{ marginTop: 'var(--space-6)' }}
            onClick={() => setActiveStory(null)}
          >
            Back to Stories
          </button>
        </div>
      );
    }

    const scene = activeStory.scenes[sceneIndex];
    const line = scene.dialogue[dialogueIndex];
    const isLastDialogue = dialogueIndex === scene.dialogue.length - 1;
    const hasChoices = scene.choices && scene.choices.length > 0;
    const showChoices = isLastDialogue && hasChoices;

    return (
      <div className="story-player page-enter">
        {/* Story header */}
        <div className="story-player-header">
          <button className="btn btn-ghost btn-sm" onClick={() => setActiveStory(null)}>✕ Exit</button>
          <div className="story-progress">
            <div className="story-progress-bar">
              <div
                className="story-progress-fill"
                style={{ width: `${((sceneIndex) / activeStory.scenes.length) * 100}%` }}
              />
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Scene {sceneIndex + 1}/{activeStory.scenes.length}
            </span>
          </div>
        </div>

        {/* Scene background tag */}
        <div className="story-scene-bg" style={{ background: 'var(--grad-hero)' }}>
          <span className="story-bg-label">{scene.background}</span>
        </div>

        {/* Dialogue bubble */}
        <div className="story-dialogue-area">
          <div className={`story-dialogue-bubble ${line.speaker === 'You' ? 'player' : 'npc'}`}>
            <div className="story-speaker-row">
              <span className="story-speaker-avatar">{line.avatar}</span>
              <span className="story-speaker-name">{line.speaker}</span>
              <button
                className="btn btn-ghost btn-sm story-tts-btn"
                onClick={() => onPlayTTS(line.japanese)}
                title="Listen"
              >🔊</button>
            </div>
            <div className="story-line-ja">{line.japanese}</div>
            <div className="story-line-romaji">{line.romaji}</div>
            <div className="story-line-en">{line.english}</div>
          </div>

          {/* Dialogue counter dots */}
          {scene.dialogue.length > 1 && (
            <div className="story-dialogue-dots">
              {scene.dialogue.map((_, i) => (
                <div key={i} className={`story-dot${i === dialogueIndex ? ' active' : i < dialogueIndex ? ' done' : ''}`} />
              ))}
            </div>
          )}
        </div>

        {/* Choices */}
        {showChoices && (
          <div className="story-choices">
            <div className="story-choices-label">Choose your response:</div>
            {scene.choices!.map(choice => (
              <button
                key={choice.choice_id}
                className={cn('story-choice-btn', {
                  correct: choiceAnswered && choice.is_correct,
                  selected: selectedChoice === choice.choice_id && !choice.is_correct,
                })}
                onClick={() => handleChoiceSelect(choice)}
                disabled={choiceAnswered}
              >
                <span className="story-choice-ja">{choice.text_ja}</span>
                <span className="story-choice-en">{choice.text_en}</span>
                {choice.xp_bonus > 0 && (
                  <span className="story-choice-bonus">+{choice.xp_bonus} XP</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Continue button */}
        <div className="story-continue-area">
          {(!showChoices || choiceAnswered) && (
            <button
              className="btn btn-primary btn-full"
              onClick={handleNext}
              id="story-next-btn"
            >
              {isLastDialogue && !hasChoices && sceneIndex === activeStory.scenes.length - 1
                ? '🎉 Finish Story'
                : isLastDialogue ? 'Next Scene →' : 'Continue →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // -- Story browser --
  return (
    <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} id="stories-back-btn">← Back</button>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>📖 Stories</h2>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
        Interactive dialogues to practice real Japanese conversation
      </p>

      <div className="story-grid">
        {stories.map(story => (
          <div
            key={story.story_id}
            className={`story-card${story.is_locked ? ' locked' : ''}${story.completed ? ' completed' : ''}`}
            onClick={() => !story.is_locked && startStory(story)}
            id={`story-${story.story_id}`}
          >
            <div className="story-card-thumb">{story.thumbnail}</div>
            <div className="story-card-body">
              <div className="story-card-top-row">
                <span
                  className="story-difficulty-badge"
                  style={{ color: difficultyColors[story.difficulty] }}
                >
                  {story.difficulty}
                </span>
                {story.completed && <span className="story-done-check">✅</span>}
                {story.is_locked && <span className="story-lock">🔒</span>}
              </div>
              <div className="story-card-title">{story.title}</div>
              <div className="story-card-desc">{story.description}</div>
              <div className="story-card-meta">
                <span>⏱ {story.estimated_minutes} min</span>
                <span>⚡ +{story.xp_reward} XP</span>
              </div>
              <div className="story-tags">
                {story.tags.map(tag => (
                  <span key={tag} className="story-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
