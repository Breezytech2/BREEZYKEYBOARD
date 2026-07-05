import re

with open("src/components/DashboardApp.tsx", "r") as f:
    content = f.read()

content = content.replace('import {', 'import { BreezyKeyboard } from "./BreezyKeyboard";\nimport {', 1)

with open("src/components/DashboardApp.tsx", "w") as f:
    f.write(content)
