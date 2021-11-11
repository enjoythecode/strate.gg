# Downloads all dependencies and sets configuration for running a production server

# install nginx
sudo apt install nginx -y

# config nginx
sudo cat ./src/nginx.conf.txt > /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

# install npm
sudo apt -y install npm

# Common Format
. ./src/format_common.sh