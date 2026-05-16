set -e
echo "Waiting for Consul to be available at http://${CONSUL_HOST}:${CONSUL_PORT}..."

while ! curl --silent --fail
http://"${CONSUL_HOST}":"${CONSUL_PORT}"/v1/status/leader > /dev/null; do
 echo "Consul is not yet ready. Retrying in 1 second..."
 sleep 1
 done
 echo "Consul is now available. Registering service..."
 # JSON-дані для реєстрації сервісу в Consul
 # Зауважте, що адреса вказана як 'booking-service', що є ім'ям контейнера
 # у мережі Docker Compose.
 REGISTRATION_JSON='{
  "ID": "booking-service",
  "Name": "booking-service",
  "Address": "booking-service",
  "Port": 3000,
  "Check": {
  "HTTP": "http://booking-service:3000/health",
  "Interval": "10s",
  "Timeout": "5s"
  }
 }'
 # Відправлення POST-запиту на реєстрацію сервісу в Consul
 # Замість ручної реєстрації через curl у Dockerfile,
 # ми використовуємо більш надійний підхід.
 curl --request PUT --data "$REGISTRATION_JSON"
 http://${CONSUL_HOST}:${CONSUL_PORT}/v1/agent/service/register
 echo "Service registered with Consul. Starting NestJS application..."
 # Запуск скомпільован