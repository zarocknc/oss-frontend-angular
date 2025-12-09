docker build -t frontend-app .

docker stop frontend
docker rm frontend

docker run -d --name frontend --network oss --restart always frontend-app