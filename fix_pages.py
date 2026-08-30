import os
import re

def fix_profile():
    path = r'c:\Users\ADMIN\Documents\learn-with-velmorth\src\app\(app)\profile\page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix lessons done icon and color
    content = content.replace(
        "{ label: 'Lessons Completed', value: lessonsDone, iconName: 'learn' as const, color: 'text-lavender dark:text-lavender', bg: 'bg-lavender-light dark:bg-lavender-light border-lavender/40 dark:border-lavender/30' },",
        "{ label: 'Lessons Completed', value: lessonsDone, iconName: 'reading' as const, color: 'text-sakura dark:text-sakura', bg: 'bg-sakura-light dark:bg-sakura-light border-sakura/40 dark:border-sakura/30' },"
    )
    
    # Fix badges
    content = content.replace(
        'bg-lavender-light dark:bg-lavender-light border border-lavender/40 dark:border-lavender/30 text-xs font-bold text-lavender dark:text-lavender',
        'bg-sakura-light dark:bg-sakura-light border border-sakura/40 dark:border-sakura/30 text-xs font-bold text-sakura dark:text-sakura'
    )
    content = content.replace('name="shield"', 'name="jlpt"')
    
    # Check if we missed any purple
    content = content.replace('text-purple-', 'text-brand-')
    content = content.replace('bg-purple-', 'bg-brand-')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def fix_bookmarks():
    path = r'c:\Users\ADMIN\Documents\learn-with-velmorth\src\app\(app)\bookmarks\page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace lucide icons with MFIcon in bookmarks
    if 'MFIcon' not in content:
        content = content.replace("import { Card }", "import { MFIcon } from '@/components/ui/MFIcon';\nimport { Card }")
    
    content = content.replace("icon: Bookmark", "iconName: 'bookmarks'")
    content = content.replace("icon: BookOpen", "iconName: 'vocabulary'")
    content = content.replace("icon: FileText", "iconName: 'grammar'")
    content = content.replace("icon: PenTool", "iconName: 'kanji'")
    
    content = re.sub(r'<f\.icon className="[^"]*" />', r'<MFIcon name={f.iconName as any} size={14} />', content)
    content = re.sub(r'<Bookmark className="w-7 h-7 text-accent" />', r'<MFIcon name="bookmarks" size={28} />', content)
    content = re.sub(r'<Bookmark className="w-10 h-10 text-ink-secondary/20 mx-auto" />', r'<MFIcon name="bookmarks" size={40} />', content)
    
    content = content.replace("variant={bm.type === 'vocab' ? 'purple' : bm.type === 'grammar' ? 'pink' : 'amber'}", "variant={bm.type === 'vocab' ? 'brand' : bm.type === 'grammar' ? 'sakura' : 'yellow'}")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def fix_quiz():
    path = r'c:\Users\ADMIN\Documents\learn-with-velmorth\src\app\(app)\quiz\page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    content = content.replace('mf-quiz-option', 'mf-quiz-option-correct') # wait, use exact replacements
    
    content = content.replace(
        "let btnStyle = 'bg-card/[0.02] border-white/[0.08] hover:border-edge hover:bg-card/[0.04] text-ink-secondary';",
        "let btnStyle = 'mf-quiz-option';"
    )
    content = content.replace(
        "if (isCorrect) btnStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';",
        "if (isCorrect) btnStyle = 'mf-quiz-option-correct';"
    )
    content = content.replace(
        "else if (isSelected) btnStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-400';",
        "else if (isSelected) btnStyle = 'mf-quiz-option-wrong';"
    )
    
    content = content.replace(
        "let itemStyle = 'bg-card/[0.02] border-white/[0.08] hover:border-brand-purple/20 text-ink hover:bg-card/[0.05]';",
        "let itemStyle = 'mf-quiz-option';"
    )
    content = content.replace(
        "if (isMatched) itemStyle = 'opacity-30 border-emerald-500/20 text-emerald-400 bg-emerald-500/5 cursor-not-allowed';",
        "if (isMatched) itemStyle = 'mf-quiz-option-correct opacity-50 cursor-not-allowed';"
    )
    content = content.replace(
        "else if (isSelected) itemStyle = 'bg-brand-purple/20 border-brand-purple/40 text-brand-purple-light shadow-[0_0_10px_rgba(124,58,237,0.2)] scale-102';",
        "else if (isSelected) itemStyle = 'mf-quiz-option border-brand/40 scale-102 bg-brand/10';"
    )
    
    # other purples
    content = content.replace('brand-purple', 'brand')
    content = content.replace('purple-500', 'brand')
    content = content.replace('purple-400', 'brand-light')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def fix_ai_tutor():
    path = r'c:\Users\ADMIN\Documents\learn-with-velmorth\src\app\(app)\ai-tutor\page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix emojis
    content = content.replace('?? Try upgrading', 'Try upgrading')
    content = content.replace('?? vs ??', 'wa vs ga')
    content = content.replace('Particles: ? vs ?', 'Particles: wa vs ga')
    content = content.replace('AI TUTOR \ufffd ONLINE', 'AI TUTOR - ONLINE')
    content = content.replace('AI TUTOR  ONLINE', 'AI TUTOR - ONLINE')
    content = content.replace('strokes for ?', 'strokes for ?')
    
    # Fix chat bubbles & brand-purple
    content = content.replace('from-neon-purple to-neon-pink', 'from-brand to-sakura')
    content = content.replace('bg-[#1A1728] border-white/[0.06] text-purple-100 rounded-tl-sm', 'bg-cream dark:bg-card border-edge text-ink rounded-tl-sm')
    content = content.replace('text-purple-200/90', 'text-ink-muted')
    content = content.replace('text-purple-200', 'text-ink-muted')
    content = content.replace('placeholder-purple-300/30', 'placeholder-ink-light')
    content = content.replace('text-purple-100', 'text-ink')
    
    content = content.replace('bg-gradient-to-br from-brand-purple to-brand-purple-dark border-brand-purple/30 text-ink rounded-tr-sm', 'bg-brand/10 border-brand/30 text-ink rounded-tr-sm')
    content = content.replace('brand-purple', 'brand')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def fix_community():
    path = r'c:\Users\ADMIN\Documents\learn-with-velmorth\src\app\(app)\community\page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'import { Avatar }' not in content:
        content = content.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport { Avatar } from '@/components/ui/Avatar';")

    content = content.replace("label: '?? Discussion Feed'", "label: 'Discussion Feed'")
    content = content.replace("label: '?? Study Groups'", "label: 'Study Groups'")
    
    # use avatar component
    content = content.replace(
        '<div className="w-10 h-10 rounded-xl bg-warm-soft border border-edge flex items-center justify-center text-lg select-none">\n                        {post.avatar}\n                      </div>',
        '<Avatar name={post.author} size="md" />'
    )
    
    # replace purple
    content = content.replace('brand-purple', 'brand')
    content = content.replace('purple-100', 'ink')
    content = content.replace('purple-200', 'ink-muted')
    content = content.replace('placeholder-purple-300/30', 'placeholder-ink-light')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_profile()
fix_bookmarks()
fix_quiz()
fix_ai_tutor()
fix_community()
print('DONE')
