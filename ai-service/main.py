from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="Nurse-D AI Service",
    description="AI-powered features for nurse delegation training",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "Nurse-D AI Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai-service"
    }

@app.post("/api/v1/generate")
async def generate_content(request: dict):
    return {
        "message": "Content generation endpoint - To be implemented",
        "request": request
    }

@app.post("/api/v1/assess")
async def assess_response(request: dict):
    return {
        "message": "Assessment endpoint - To be implemented",
        "request": request
    }

@app.post("/api/v1/chat")
async def chat(request: dict):
    return {
        "message": "Chat endpoint - To be implemented",
        "request": request
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
