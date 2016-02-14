git diff --ignore-submodules=all --name-only --diff-filter=ACMR $1
  
git diff --submodule=log $1 | awk 'match($0, /Submodule \w+ (\w+)..(\w+):/, m) { system("cd "$2"; git add .; git reset --hard "m[2]" >/dev/null; git diff --name-only --diff-filter=ACMR "m[1]" | sed \"s/^/"$2"\\/&/g\"") }' 
