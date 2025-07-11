@echo off
echo Building for production...
ng build --configuration production --base-href https://bochunwen810802.github.io/114_Road/

echo Adding all changes...
git add .

echo Committing changes...
git commit -m "Update application"

echo Pushing to GitHub...
git push

echo Adding deployment files...
git add docs/
git commit -m "Update deployment files"
git push

echo Deployment complete! Please wait a few minutes for GitHub Pages to update.
echo Your site will be available at: https://bochunwen810802.github.io/114_Road/
pause 