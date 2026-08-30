import os
import re

def fix_more():
    path = r'c:\Users\ADMIN\Documents\learn-with-velmorth\src\app\(app)\community\page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # ensure '??' is replaced if needed, or leave it.
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_more()
print("done")
