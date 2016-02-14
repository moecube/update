cd ygopro
git add .
git reset --hard $2
bash ../gitdiff.sh $1 $2 | tar Jcvf ../ygopro-update-win32-$2.tar.xz -T -
