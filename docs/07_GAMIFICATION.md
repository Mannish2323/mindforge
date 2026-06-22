# LEARN WITH VELMORTH — ADVANCED GAMIFICATION
## Section 7: Gamification Architecture

---

## 7.1 GAMIFICATION PHILOSOPHY

Learn with Velmorth leverages gamified learning to keep students motivated and consistent:
- **XP Progression**: Actions award experience points to track daily study milestones.
- **Milestone Rewards**: Reaching levels and maintaining streaks unlocks badges and achievements.
- **Competitive Rankings**: Opt-in leaderboards encourage healthy competition.

---

## 7.2 XP SYSTEM

Learners earn Experience Points (XP) through various study activities:
- **Lesson XP**: Completing interactive lessons (+50 XP base, +50 XP perfect bonus).
- **Quiz XP**: Completing MCQ, fill-in-the-blanks, or listening tests (+15 XP per correct answer).
- **Daily XP**: Logging in and reaching daily minutes goal (+20 XP).

### Database Model (Supabase Integration)
XP stats are stored in the `public.user_stats` table:
```sql
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp_total          INT NOT NULL DEFAULT 0,
  xp_today          INT NOT NULL DEFAULT 0,
  gems_balance      INT NOT NULL DEFAULT 0,
  lessons_done      INT NOT NULL DEFAULT 0,
  words_learned     INT NOT NULL DEFAULT 0,
  reviews_done      INT NOT NULL DEFAULT 0,
  kanji_learned     INT NOT NULL DEFAULT 0,
  speak_sessions    INT NOT NULL DEFAULT 0,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 7.3 ACHIEVEMENTS SYSTEM

Achievements reward consistent behavior and learning milestones:
- **Streak Badges**: 3-day, 7-day, 30-day, and 100-day streak milestones.
- **Course Completion**: Badges awarded upon finishing a target CEFR level or curriculum module.
- **Vocabulary Master**: Badges awarded for learning 50, 200, or 1000 vocabulary words.

### Badge Tables
Badges and active user unlocks are defined in `badges` and `user_badges`:
```sql
CREATE TABLE IF NOT EXISTS public.badges (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL,
  rarity      TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  condition   JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id   TEXT NOT NULL REFERENCES public.badges(id),
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, badge_id)
);
```

---

## 7.4 LEADERBOARD SYSTEM

Leaderboards reset weekly and group learners into competitive cohorts of 50:
- **Weekly Rankings**: Based on XP accumulated during the current week.
- **Global Rankings**: Shows the overall top learners worldwide.
- **League Progression**:
  - Top 10 users in a cohort are promoted to the next league tier.
  - Bottom 5 are demoted (unless in the starting Bronze tier).
  - Tiers: Bronze → Silver → Gold → Platinum → Diamond.
