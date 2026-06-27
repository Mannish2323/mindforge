# Velmorth Premium Design System

## Overview

Learning Velmorth is a world-class, production-ready Japanese learning platform with a premium dark theme, glassmorphism effects, neon glows, and smooth micro-animations comparable to Duolingo, Notion, Discord, ChatGPT, Spotify, Supercell, Apple, Linear, and Raycast.

## Colors

### Primary Palette
- **Primary Purple**: `#7C3AED` - Main brand color
- **Accent Pink**: `#EC4899` - Secondary brand color
- **Background Dark**: `#09060F` - Main background
- **Cards**: `#110C1E` - Card backgrounds
- **Border Soft**: `rgba(139, 92, 246, 0.13)` - Subtle borders
- **Border Light**: `rgba(139, 92, 246, 0.25)` - Emphasized borders

### JLPT Level Colors
- **N5**: `#22c55e` (Green)
- **N4**: `#3b82f6` (Blue)
- **N3**: `#8b5cf6` (Purple)
- **N2**: `#ec4899` (Pink)
- **N1**: `#f59e0b` (Orange)

## Typography

- **Font Families**:
  - Headings: `Poppins` (bold, black weights)
  - Body: `Inter` (regular, medium, bold)
  - Japanese Text: `Noto Sans JP` (regular, bold, black)

- **Font Hierarchy**:
  - H1: 3xl - 4xl, font-black
  - H2: 2xl - 3xl, font-black
  - H3: xl - 2xl, font-bold
  - Body: sm - base, font-regular
  - Caption: xs, font-light

## Components

### Core Components

#### PremiumCard
Premium glassmorphic card with backdrop blur and neon borders.

```tsx
<PremiumCard variant="gradient" hover glow>
  Content here
</PremiumCard>
```

**Props**:
- `variant`: 'default' | 'gradient' | 'accent'
- `hover`: Enable hover scaling (default: true)
- `glow`: Add glow effect (default: false)

#### PremiumButton
Gradient buttons with smooth interactions.

```tsx
<PremiumButton variant="primary" size="lg" fullWidth>
  Click Me
</PremiumButton>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'glow'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: Boolean
- `disabled`: Boolean

#### AnimatedBackground
Floating sakura petals with gradient background.

```tsx
<AnimatedBackground />
```

#### SplashScreenPremium
Animated splash screen with logo animation.

```tsx
<SplashScreenPremium 
  onComplete={() => router.push('/home')}
  duration={3000}
/>
```

### Character Components

#### SakuraAI
Sakura AI character with multiple poses and animations.

```tsx
<SakuraAI 
  pose="wave"
  size="lg"
  animate
/>
```

**Available Poses**:
- smile, wave, point-left, point-right
- thinking, teaching, celebration, sad, victory, chat

**Sizes**: sm | md | lg | xl

### Layout Components

#### OnboardingFlow
Premium onboarding experience with 4-step wizard.

```tsx
<OnboardingFlow 
  onComplete={(data) => handleComplete(data)}
  isLoading={false}
/>
```

#### PremiumNavigation
Sidebar and topbar navigation with active states.

```tsx
<PremiumNavigation 
  items={navItems}
  variant="sidebar"
  onSelect={(href) => router.push(href)}
/>
```

### Content Components

#### VocabularyCard
Animated flashcard for vocabulary learning.

```tsx
<VocabularyCard
  japanese="学ぶ"
  romaji="manabu"
  meaning="To study/learn"
  example="毎日新しい言葉を学びます。"
  exampleTranslation="I study new words every day."
  jlptLevel="N5"
  isFavorite={false}
  onToggleFavorite={() => {}}
/>
```

#### KanjiStrokeViewer
Interactive kanji with animated stroke order.

```tsx
<KanjiStrokeViewer
  kanji="学"
  meaning="Study"
  pronunciation={{ on: "ガク", kun: "ま.なぶ" }}
  strokeCount={8}
  examples={[...]}
/>
```

#### StatsCard
Statistics display with animations and trends.

```tsx
<StatsCard
  icon={<Zap className="w-5 h-5" />}
  label="Total XP"
  value={5420}
  trend={{ value: 12, isPositive: true }}
  color="purple"
  size="md"
/>
```

#### ProgressRing
Circular progress indicator with animations.

```tsx
<ProgressRing
  percentage={68}
  label="Today's Goal"
  color="#7c3aed"
  size="lg"
  animated
/>
```

#### AchievementBadge
Badge system for achievements and milestones.

```tsx
<AchievementBadge
  title="First Steps"
  description="Complete your first lesson"
  icon="🎓"
  rarity="rare"
  unlocked={true}
  progress={10}
  maxProgress={10}
  size="md"
/>
```

**Rarities**: common | rare | epic | legendary

## Effects & Animations

### Glassmorphism
- `backdrop-blur-xl` for frosted glass effect
- Transparent backgrounds with rgba colors
- Subtle borders with low opacity

### Neon Glow
- `shadow-lg shadow-purple-500/40` for purple glow
- `shadow-lg shadow-pink-500/40` for pink glow
- Applied on hover for interactive elements

### Micro-Animations
- Spring transitions for interactive elements
- Smooth fades for page transitions
- Hover scaling: `1.05` for cards, `1.1` for buttons
- Page transitions use `fade-up` or `slide-in` variants

### Floating Elements
- Sakura petals with continuous rotation
- Floating cards with subtle y-offset
- Breathing animations on text shadows

## Layout Grid

- **Mobile First**: Base styles for small screens
- **Breakpoints**: xs(475), sm(640), md(768), lg(1024), xl(1280), 2xl(1536)
- **Spacing**: 4px base unit (p-1 = 0.25rem, p-4 = 1rem, etc.)
- **Container**: max-w-md, max-w-lg, max-w-4xl for sections

## Responsive Design

All components are fully responsive:
- **Mobile**: Single column, full width
- **Tablet**: Two column grids, optimized touch targets
- **Desktop**: Multi-column layouts with max widths
- **Large screens**: Wider layouts with better spacing

## Accessibility

- All buttons have proper hover/focus states
- Icons have aria-labels where needed
- Color contrast maintained for text
- Touch targets minimum 44px on mobile
- Semantic HTML structure

## Theme Configuration

### Tailwind Colors
- Extend theme with Velmorth colors in `tailwind.config.ts`
- Use CSS variables for dynamic theme switching
- Dark theme as default

### CSS Variables
```css
--color-primary: #7C3AED;
--color-accent: #EC4899;
--color-background: #09060F;
--color-cards: #110C1E;
```

## Usage Examples

### Login Page
```tsx
<AnimatedBackground />
<div className="flex gap-8">
  <div>
    <SakuraAI pose="smile" size="lg" />
  </div>
  <PremiumCard variant="gradient">
    {/* Login form */}
  </PremiumCard>
</div>
```

### Dashboard
```tsx
<div className="grid grid-cols-5 gap-4">
  <StatsCard icon={<Zap />} label="XP" value={5420} />
  <StatsCard icon={<Flame />} label="Streak" value={12} />
  {/* More stats */}
</div>

<div className="grid grid-cols-3 gap-4">
  <VocabularyCard {...cardProps} />
  <VocabularyCard {...cardProps} />
  <VocabularyCard {...cardProps} />
</div>
```

### Kanji Practice
```tsx
<PremiumCard>
  <KanjiStrokeViewer {...kanjiProps} />
</PremiumCard>
```

## Performance Tips

1. Use `motion.div` from Framer Motion only when needed
2. Lazy load heavy components (Sakura AI, KanjiStrokeViewer)
3. Cache animated SVGs
4. Use `will-change` CSS for frequently animated elements
5. Minimize blur effects on lower-end devices

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 15+, Chrome Android 90+

---

**Built with**: Next.js 14, Tailwind CSS, Framer Motion, Radix UI, Lucide Icons

