FROM python:3.12.13-alpine3.24

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    OUTPUT_DIRECTORY=/tmp/pmo-export

WORKDIR /app

COPY requirements.txt .
RUN python -m pip install --no-cache-dir --requirement requirements.txt

COPY src/exporter/ ./

RUN addgroup -S -g 10001 pmo \
    && adduser -S -D -H -u 10001 -G pmo pmo \
    && mkdir -p "${OUTPUT_DIRECTORY}" \
    && chown -R pmo:pmo /app "${OUTPUT_DIRECTORY}"

USER 10001:10001

CMD ["python", "app.py"]
