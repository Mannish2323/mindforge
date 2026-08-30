import re
with open(r'c:\Users\ADMIN\Documents\learn-with-velmorth\src\app\(app)\quiz\page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
    print([c for c in text if ord(c) > 127])
