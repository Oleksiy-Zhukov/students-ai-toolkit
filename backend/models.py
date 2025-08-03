"""
Data models for the Student AI Toolkit API.
Defines request and response schemas using Pydantic.
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum

class ActionType(str, Enum):
    """Available AI actions."""
    SUMMARIZE = "summarize"
    GENERATE_QUESTIONS = "generate_questions"
    PLAN_STUDY = "plan_study"
    FLASHCARDS = "flashcards"

class ProcessRequest(BaseModel):
    """Request model for processing text or file content."""
    action: ActionType = Field(..., description="The AI action to perform")
    text_content: Optional[str] = Field(None, description="Direct text input")
    additional_instructions: Optional[str] = Field(None, description="Additional user instructions")
    recaptcha_token: Optional[str] = Field(None, description="Optional reCAPTCHA token for verification")

class ProcessResponse(BaseModel):
    """Response model for AI processing results."""
    success: bool = Field(..., description="Whether the processing was successful")
    result: Optional[str] = Field(None, description="The AI-generated result")
    error: Optional[str] = Field(None, description="Error message if processing failed")
    action: ActionType = Field(..., description="The action that was performed")
    backend_used: Literal["openai", "huggingface"] = Field(..., description="Which AI backend was used")

class FileUploadResponse(BaseModel):
    """Response model for file upload."""
    success: bool = Field(..., description="Whether the upload was successful")
    filename: str = Field(..., description="Name of the uploaded file")
    content: Optional[str] = Field(None, description="Extracted text content from the file")
    error: Optional[str] = Field(None, description="Error message if upload failed")

class HealthResponse(BaseModel):
    """Response model for health check."""
    status: str = Field(..., description="Service status")
    backend: str = Field(..., description="Current AI backend")
    backend_available: bool = Field(..., description="Whether the AI backend is available")

