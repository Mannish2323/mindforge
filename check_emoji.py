import os
import re
for f in [r'c:\Users\ADMIN\Documents\learn-with-velmorth\src\app\(app)\profile\page.tsx', r'c:\Users\ADMIN\Documents\learn-with-velmorth\src\app\(app)\community\page.tsx', r'c:\Users\ADMIN\Documents\learn-with-velmorth\src\app\(app)\quiz\page.tsx']:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        emojis = re.findall(r'[^\x00-\x7F]+', content)
        # filter out japanese kanji/hiragana/katakana
        emojis = [e for e in emojis if not re.match(r'[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uF900-\uFAFF\uFF66-\uFF9F]+', e)]
        if emojis:
            print(f, set(emojis))
