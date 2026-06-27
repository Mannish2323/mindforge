import os
import sys
from openai import OpenAI

# Support UTF-8 console output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import glob
import re

PROJECT_DIR = r"c:\Users\ADMIN\Documents\learn-with-velmorth"

# Find the most recently modified session directory containing task.md
BRAIN_DIR = r"C:\Users\ADMIN\.gemini\antigravity-ide\brain"
SESSION_DIR = None
try:
    if os.path.exists(BRAIN_DIR):
        dirs = [d for d in glob.glob(os.path.join(BRAIN_DIR, "*")) if os.path.isdir(d)]
        uuid_dirs = [d for d in dirs if re.match(r'^[a-f0-9\-]{36}$', os.path.basename(d))]
        uuid_dirs.sort(key=lambda x: os.path.getmtime(x), reverse=True)
        for d in uuid_dirs:
            if os.path.exists(os.path.join(d, "task.md")):
                SESSION_DIR = d
                break
except Exception:
    pass

if not SESSION_DIR:
    SESSION_DIR = r"C:\Users\ADMIN\.gemini\antigravity-ide\brain\6ba9e966-a445-458a-b62a-c5a431dfb7e1"

def get_project_context():
    context = []
    
    workspace_files = [
        ("package.json", os.path.join(PROJECT_DIR, "package.json")),
        ("postcss.config.mjs", os.path.join(PROJECT_DIR, "postcss.config.mjs")),
        ("pnpm-workspace.yaml", os.path.join(PROJECT_DIR, "pnpm-workspace.yaml")),
        ("master_build_tracker.md", os.path.join(PROJECT_DIR, "master_build_tracker.md"))
    ]
    
    session_files = [
        ("task.md", os.path.join(SESSION_DIR, "task.md")),
        ("implementation_plan.md", os.path.join(SESSION_DIR, "implementation_plan.md"))
    ]
    
    context.append("Here is the context and status of the current project:")
    for label, path in (workspace_files + session_files):
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                context.append(f"\n--- File: {label} ---\n{content}\n")
            except Exception as e:
                context.append(f"\n--- File: {label} (Error reading: {e}) ---")
                
    return "\n".join(context)

client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)

# Get query from arguments or prompt user
if len(sys.argv) > 1:
    prompt = " ".join(sys.argv[1:])
else:
    prompt = input("Enter your message for NVIDIA AI: ")

if not prompt.strip():
    print("Empty prompt. Exiting.")
    sys.exit(0)

# Build message payload with project context
messages = [
    {"role": "system", "content": "You are a helpful coding assistant. " + get_project_context()},
    {"role": "user", "content": prompt}
]

completion = client.chat.completions.create(
  model="nvidia/nemotron-3-ultra-550b-a55b",
  messages=messages,
  temperature=1,
  top_p=0.95,
  max_tokens=16384,
  extra_body={"chat_template_kwargs":{"enable_thinking":True},"reasoning_budget":16384},
  stream=True
)

for chunk in completion:
  if not chunk.choices:
    continue
  reasoning = getattr(chunk.choices[0].delta, "reasoning_content", None)
  if reasoning:
    print(reasoning, end="")
  if chunk.choices[0].delta.content is not None:
    print(chunk.choices[0].delta.content, end="")
