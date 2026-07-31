from fastapi import FastAPI
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

app = FastAPI(
    title="BugMind AI API",
    description="Core API Gateway for BugMind AI",
    version="1.0.0"
)

# OpenTelemetry Instrumentation
FastAPIInstrumentor.instrument_app(app)

@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok", "service": "api-gateway"}

# Mount routers here as they are developed
from .routers import projects, ingestion, search, documentation, chat, investigation, telemetry, validation, patch_plans, pull_requests, analytics, ebpf_receiver
app.include_router(projects.router, prefix="/api/v1")
app.include_router(ingestion.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(documentation.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(investigation.router, prefix="/api/v1")
app.include_router(telemetry.router, prefix="/api/v1")
app.include_router(validation.router, prefix="/api/v1")
app.include_router(patch_plans.router, prefix="/api/v1")
app.include_router(pull_requests.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(ebpf_receiver.router, prefix="/api/v1")
