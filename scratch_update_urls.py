import os

search_dir = r'd:\resume genie\frontend\app'
for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if '"http://localhost:8000/' in content:
                new_content = content.replace('"http://localhost:8000/', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/')
                # But wait, replacing '"http://localhost:8000/' with '`${process.env...}/' means:
                # fetch("http://localhost:8000/api") -> fetch(`${process.env...}/api") (unmatched quotes!)
                
                # Correct way:
                # We need to replace "http://localhost:8000/api..." with `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api...`
                # So we replace '"http://localhost:8000/' with '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/'
                # And we need to make sure the end quote of the URL is also replaced by a backtick.
                
                pass

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    modified = False
    for i in range(len(lines)):
        if '"http://localhost:8000/' in lines[i]:
            # Replace start quote and url
            lines[i] = lines[i].replace('"http://localhost:8000/', '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/')
            # Now replace the ending quote of that string with a backtick
            # e.g., ...}/api/match", { -> ...}/api/match`, {
            # Let's just find the next double quote after our replacement and replace it.
            # A simpler way:
            parts = lines[i].split('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/')
            if len(parts) > 1:
                for j in range(1, len(parts)):
                    # find first double quote and replace with backtick
                    idx = parts[j].find('"')
                    if idx != -1:
                        parts[j] = parts[j][:idx] + '`' + parts[j][idx+1:]
                lines[i] = '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/'.join(parts)
                modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f'Updated {filepath}')

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
