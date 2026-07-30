FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    OUTPUT_DIRECTORY=/tmp/pmo-export

WORKDIR /app

COPY requirements.txt .
RUN python -m pip install --no-cache-dir --requirement requirements.txt

COPY src/exporter/ ./

RUN groupadd --system --gid 10001 pmo \
    && useradd --system --uid 10001 --gid pmo pmo \
    && mkdir -p "${OUTPUT_DIRECTORY}" \
    && chown -R pmo:pmo /app "${OUTPUT_DIRECTORY}"

USER 10001:10001

CMD ["python", "app.py"]
