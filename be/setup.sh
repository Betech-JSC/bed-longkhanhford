message () {
    echo "\033[0;32m$1\033[0m"
}

PROJECT_NAME=${PWD##*/}

message "1. Create .env"
echo "cp .env.example .env"
cp .env.example .env

sed -i '' "s/jam-boilerplate-monolith-v3/${PROJECT_NAME}/g" .env

message "2. Install Composer"
echo "composer install"
composer install

message "3. Setup Laravel"
php artisan storage:link
php artisan key:generate

message "4. Setup Database"
mysql -u root -proot -e "create database \`${PROJECT_NAME}\`;";
php artisan migrate:fresh --seed --force

message "5. Setup Frontend"
yarn && yarn build

message "6. Start server"
php artisan serve
