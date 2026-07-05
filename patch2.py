import re

with open("src/components/DashboardApp.tsx", "r") as f:
    content = f.read()

with open("/tmp/tab3_content_real.tsx", "r") as f:
    tab3_content = f.read()

# I need to insert it right before {/* TAB 4: GLASS PROTECT */}
# but since the old TAB 3 content was deleted by sed, the file only has TAB 4.
content = re.sub(r'(\s*{\/\* TAB 4: GLASS PROTECT \*\/})', f'\n{tab3_content}\n\\1', content)

with open("src/components/DashboardApp.tsx", "w") as f:
    f.write(content)
