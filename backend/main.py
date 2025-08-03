"""
Main FastAPI application for the Student AI Toolkit backend.
Provides REST API endpoints for file upload and AI processing.
"""

import os
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from recaptcha import recaptcha_verifier

from config import config
from models import (
    ProcessRequest,
    ProcessResponse,
    FileUploadResponse,
    HealthResponse,
    ActionType,
)
from file_processor import FileProcessor
from ai_backends import get_ai_backend

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["2/hour"])

# Initialize FastAPI app
app = FastAPI(
    title="Student AI Toolkit API",
    description="Backend API for the Student AI Toolkit - providing AI-powered study assistance",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add middleware for rate limiting and CORS
# IMPORTANT: The SlowAPIMiddleware must be added before the CORS middleware
# for the rate limiter to function correctly with cross-origin requests.
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach limiter to app state
app.state.limiter = limiter


# Custom rate limit exception handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """
    Custom handler for when a rate limit is exceeded.
    Returns a JSON response with a 429 status code.
    """
    return JSONResponse(
        status_code=429,
        content={"error": f"Rate limit exceeded: {exc.detail}"},
    )


# Initialize processors
file_processor = FileProcessor()
ai_backend = get_ai_backend()


@app.get("/", response_model=dict, include_in_schema=False)
async def root():
    """
    Root endpoint providing basic API information.
    """
    return {
        "message": "Welcome to the Student AI Toolkit API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_check_url": "/health",
    }


@app.get("/health", response_model=HealthResponse, tags=["Status"])
async def health_check():
    """
    Performs a health check of the API and its backend services.
    """
    backend_available = ai_backend.is_available()
    return HealthResponse(
        status="healthy" if backend_available else "degraded",
        backend=config.AI_BACKEND,
        backend_available=backend_available,
    )


@app.post("/upload", response_model=FileUploadResponse, tags=["File Handling"])
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file and extract its text content.
    Supports PDF, TXT, and DOCX files.
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        if not file_processor.is_allowed_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Supported types: {', '.join(config.ALLOWED_EXTENSIONS)}",
            )

        # Check file size
        file_content = await file.read()
        if len(file_content) > config.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: {config.MAX_FILE_SIZE / (1024 * 1024):.1f}MB",
            )

        # Save file
        success, file_path, error = file_processor.save_uploaded_file(
            file_content, file.filename
        )
        if not success:
            raise HTTPException(status_code=500, detail=error)

        # Extract text
        success, text_content, error = file_processor.extract_text_from_file(file_path)

        # Clean up uploaded file
        try:
            os.remove(file_path)
        except:
            pass  # Ignore cleanup errors

        if not success:
            raise HTTPException(status_code=422, detail=error)

        return FileUploadResponse(
            success=True, filename=file.filename, content=text_content, error=None
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.post("/process", response_model=ProcessResponse, tags=["AI Processing"])
@limiter.limit("20/hour")  # Increased for development
async def process_content(
    body: ProcessRequest,
    request: Request,
):
    recaptcha_success = True  # ✅ default to True
    recaptcha_error = None

    try:
        # Only validate if recaptcha is enabled and token is provided
        if (
            recaptcha_verifier.is_enabled()
            and hasattr(body, "recaptcha_token")
            and body.recaptcha_token
        ):
            client_ip = request.client.host if request.client else None
            recaptcha_success, recaptcha_error = recaptcha_verifier.verify_token(
                body.recaptcha_token, client_ip, action="submit"
            )

            if not recaptcha_success:
                # Log the error but don't fail the request for now
                print(f"reCAPTCHA verification failed: {recaptcha_error}")
                # Uncomment the line below to enforce reCAPTCHA verification
                # raise HTTPException(status_code=400, detail=f"reCAPTCHA verification failed: {recaptcha_error}")
        elif recaptcha_verifier.is_enabled():
            # If reCAPTCHA is enabled but no token provided, log but don't fail
            print("reCAPTCHA is enabled but no token provided")

        # Validate input
        if not body.text_content or not body.text_content.strip():
            raise HTTPException(status_code=400, detail="No text content provided")

        # Check if AI backend is available
        if not ai_backend.is_available():
            raise HTTPException(
                status_code=503,
                detail=f"AI backend ({config.AI_BACKEND}) is not available. Please check configuration.",
            )

        # Process with AI
        success, result, error = ai_backend.process_text(
            action=body.action,
            text=body.text_content,
            additional_instructions=body.additional_instructions,
        )

        if not success:
            raise HTTPException(status_code=500, detail=error)

        return ProcessResponse(
            success=True,
            result=result,
            error=None,
            action=body.action,
            backend_used=config.AI_BACKEND,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@app.post("/parse-file", response_model=dict, tags=["AI Processing"])
@limiter.limit("20/hour")  # Increased for development
async def parse_file(
    request: Request,
    file: UploadFile = File(...),
    summarize_background: bool = Form(False),
    recaptcha_token: Optional[str] = Form(None),
):
    """
    Parse a file and extract text content, with optional background summarization.
    Returns extracted text and optionally a summary for user review.
    Includes reCAPTCHA v3 verification for security.
    """
    try:
        # reCAPTCHA verification
        recaptcha_success = True
        recaptcha_error = None

        # Only validate if recaptcha is enabled and token is provided
        if recaptcha_verifier.is_enabled() and recaptcha_token:
            client_ip = request.client.host if request.client else None
            recaptcha_success, recaptcha_error = recaptcha_verifier.verify_token(
                recaptcha_token, client_ip, action="file_upload"
            )

            if not recaptcha_success:
                # Log the error but don't fail the request for now
                print(
                    f"reCAPTCHA verification failed for file upload: {recaptcha_error}"
                )
                # Uncomment the line below to enforce reCAPTCHA verification
                # raise HTTPException(
                #     status_code=400,
                #     detail=f"reCAPTCHA verification failed: {recaptcha_error}",
                # )
        elif recaptcha_verifier.is_enabled() and not recaptcha_token:
            # If reCAPTCHA is enabled but no token provided, log but don't fail
            print("reCAPTCHA is enabled for file upload but no token provided")
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        if not file_processor.is_allowed_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Supported types: {', '.join(config.ALLOWED_EXTENSIONS)}",
            )

        # Check file size
        file_content = await file.read()
        if len(file_content) > config.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: {config.MAX_FILE_SIZE / (1024 * 1024):.1f}MB",
            )

        # Save file
        success, file_path, error = file_processor.save_uploaded_file(
            file_content, file.filename
        )
        if not success:
            raise HTTPException(status_code=500, detail=error)

        # Extract text
        success, text_content, error = file_processor.extract_text_from_file(file_path)

        # Clean up uploaded file
        try:
            os.remove(file_path)
        except:
            pass  # Ignore cleanup errors

        if not success:
            raise HTTPException(status_code=422, detail=error)

        response = {
            "success": True,
            "filename": file.filename,
            "extracted_text": text_content,
            "text_length": len(text_content),
            "error": None,
        }

        # Optional background summarization
        if summarize_background and ai_backend.is_available():
            try:
                summary_success, summary_result, summary_error = (
                    ai_backend.process_text(
                        action=ActionType.SUMMARIZE,
                        text=text_content,
                        additional_instructions="Provide a concise summary for user review before further processing.",
                    )
                )

                if summary_success:
                    response["background_summary"] = summary_result
                    response["summary_available"] = True
                else:
                    response["background_summary"] = None
                    response["summary_available"] = False
                    response["summary_error"] = summary_error
            except Exception as e:
                response["background_summary"] = None
                response["summary_available"] = False
                response["summary_error"] = f"Background summarization failed: {str(e)}"
        else:
            response["background_summary"] = None
            response["summary_available"] = False
            if summarize_background:
                response["summary_error"] = (
                    "AI backend not available for background summarization"
                )

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File parsing failed: {str(e)}")


@app.post("/process-file", response_model=ProcessResponse, tags=["AI Processing"])
@limiter.limit("20/hour")  # Increased for development
async def process_file(
    request: Request,
    file: UploadFile = File(...),
    action: ActionType = Form(...),
    additional_instructions: Optional[str] = Form(None),
):
    """
    Upload a file and process its content with AI in one step.
    Combines file upload and AI processing for convenience.
    """
    try:
        # Upload and extract text
        upload_response = await upload_file(file)
        if not upload_response.success:
            raise HTTPException(status_code=422, detail=upload_response.error)

        # Process with AI
        process_request = ProcessRequest(
            action=action,
            text_content=upload_response.content,
            additional_instructions=additional_instructions,
        )

        return await process_content(body=process_request, request=request)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")


@app.get("/actions", response_model=dict, tags=["Configuration"])
async def get_available_actions():
    """
    Returns a list of available AI actions that the backend can perform.
    """
    return {
        "actions": [
            {
                "id": ActionType.SUMMARIZE.value,
                "name": "Summarize",
                "description": "Create a concise summary of the provided text content.",
            },
            {
                "id": ActionType.GENERATE_QUESTIONS.value,
                "name": "Generate Questions",
                "description": "Generate potential study questions based on the text.",
            },
            {
                "id": ActionType.PLAN_STUDY.value,
                "name": "Plan Study",
                "description": "Create a structured study plan from the content.",
            },
            {
                "id": ActionType.FLASHCARDS.value,
                "name": "Generate Flashcards",
                "description": "Create flashcards for active recall learning.",
            },
        ]
    }


if __name__ == "__main__":
    if not config.validate_config():
        print("❌ Configuration validation failed!")
        print(f"   Current AI Backend: {config.AI_BACKEND}")
        if config.AI_BACKEND == "openai" and not config.OPENAI_API_KEY:
            print(
                "   Error: OpenAI API key is required but not found in environment variables (OPENAI_API_KEY)."
            )
        elif config.AI_BACKEND == "huggingface" and not config.HUGGINGFACE_API_TOKEN:
            print(
                "   Error: HuggingFace API token is required but not found in environment variables (HUGGINGFACE_API_TOKEN)."
            )
        exit(1)

    print("🚀 Starting Student AI Toolkit API...")
    print(f"   - AI Backend: {config.AI_BACKEND}")
    print(f"   - Server URL: http://{config.HOST}:{config.PORT}")
    print(f"   - API Docs: http://{config.HOST}:{config.PORT}/docs")
    print(f"   - Debug Mode: {'On' if config.DEBUG else 'Off'}")

    uvicorn.run(
        "main:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.DEBUG,
        log_level="info",
    )
