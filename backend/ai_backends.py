"""
AI backend implementations for the Student AI Toolkit.
Provides both OpenAI and HuggingFace integration with a common interface.
"""

from openai import OpenAI
from abc import ABC, abstractmethod
from typing import Optional, Tuple
from config import config
from models import ActionType


class AIBackend(ABC):
    """Abstract base class for AI backends."""

    @abstractmethod
    def is_available(self) -> bool:
        """Check if the backend is available and properly configured."""
        pass

    @abstractmethod
    def process_text(
        self,
        action: ActionType,
        text: str,
        additional_instructions: Optional[str] = None,
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Process text using the AI backend.

        Returns:
            Tuple of (success, result, error_message)
        """
        pass


class OpenAIBackend(AIBackend):
    """OpenAI backend implementation."""

    def __init__(self):
        """Initialize the OpenAI backend with the new client."""
        if config.OPENAI_API_KEY:
            self.client = OpenAI(api_key=config.OPENAI_API_KEY)
        else:
            self.client = None

    def is_available(self) -> bool:
        return bool(config.OPENAI_API_KEY and self.client)

    def _get_system_prompt(self, action: ActionType) -> str:
        prompts = {
            ActionType.SUMMARIZE: (
                "You are an expert at creating clear, concise summaries of academic content. "
                "Create a well-structured summary that captures the main points, key concepts, "
                "and important details. Use bullet points or numbered lists when appropriate. "
                "Make the summary suitable for student review and study.\n\n"
                "**Format your response with proper markdown:**\n"
                "• Use ## for main sections\n"
                "• Use ### for subsections\n"
                "• Use bullet points (•) for key points\n"
                "• Use **bold** for emphasis on important concepts\n"
                "• Use `code` formatting for technical terms\n"
                "• Keep paragraphs concise and scannable\n"
                "• End with a brief conclusion or key takeaways"
            ),
            ActionType.GENERATE_QUESTIONS: (
                "You are an expert educator who creates thoughtful study questions. "
                "Generate a variety of questions (multiple choice, short answer, essay questions) "
                "that test understanding of the key concepts in the provided content. "
                "Include questions at different difficulty levels (basic recall, application, analysis). "
                "Provide 8-12 questions total.\n\n"
                "**Format your response with proper markdown:**\n"
                "## Study Questions\n\n"
                "### Multiple Choice Questions\n"
                "1. **Question text?**\n"
                "   A) Option A\n"
                "   B) Option B\n"
                "   C) Option C\n"
                "   D) Option D\n\n"
                "### Short Answer Questions\n"
                "1. **Question text?**\n"
                "   *Brief answer or explanation*\n\n"
                "### Essay Questions\n"
                "1. **Question text?**\n"
                "   *Detailed answer structure*\n\n"
                "Use **bold** for question numbers and key terms, and provide clear answer structures."
            ),
            ActionType.PLAN_STUDY: (
                "You are an expert study coach who creates personalized study plans. "
                "Based on the provided content, create a structured study plan that includes: "
                "1. Key topics to focus on, 2. Recommended study methods for each topic, "
                "3. Time allocation suggestions, 4. Practice activities, "
                "5. Review schedule recommendations. Make it practical and actionable.\n\n"
                "**Format your response with proper markdown:**\n"
                "## 📚 Study Plan\n\n"
                "### 🎯 Learning Objectives\n"
                "• Clear, measurable goals\n\n"
                "### 📅 Week-by-Week Schedule\n"
                "**Week 1: Foundation**\n"
                "• **Day 1-2:** Topic A (2-3 hours)\n"
                "• **Day 3-4:** Topic B (2-3 hours)\n"
                "• **Day 5-7:** Review and practice\n\n"
                "### 🛠️ Study Methods\n"
                "• **Active Recall:** [specific method]\n"
                "• **Spaced Repetition:** [schedule]\n"
                "• **Practice Tests:** [frequency]\n\n"
                "### 📊 Progress Tracking\n"
                "• Weekly self-assessments\n"
                "• Key milestones to achieve\n\n"
                "Use emojis, **bold text**, and clear structure to make the plan engaging and easy to follow."
            ),
            ActionType.FLASHCARDS: (
                "You are an expert at creating effective flashcards for learning. "
                "Generate flashcards that cover the key concepts, definitions, and important details "
                "from the provided content. Create cards that promote active recall and deep understanding.\n\n"
                "**Format your response with proper markdown:**\n"
                "## 🗂️ Flashcards\n\n"
                "### 📝 Card Format\n"
                "**Front:** Clear, concise question or concept\n"
                "**Back:** Detailed answer with examples\n\n"
                "### 🎯 Generated Cards\n\n"
                "**Card 1**\n"
                "**Front:** What is [concept]?\n"
                "**Back:** [Definition] with key points:\n"
                "• Point 1\n"
                "• Point 2\n"
                "• Example: [specific example]\n\n"
                "**Card 2**\n"
                "**Front:** [Question about key concept]\n"
                "**Back:** [Comprehensive answer]\n\n"
                "### 💡 Study Tips\n"
                "• Review cards daily for best retention\n"
                "• Use spaced repetition techniques\n"
                "• Test yourself before looking at answers\n\n"
                "Create 10-15 cards covering the most important concepts. Use **bold** for card numbers and key terms."
            ),
        }
        return prompts.get(action, "You are a helpful AI assistant.")

    def process_text(
        self,
        action: ActionType,
        text: str,
        additional_instructions: Optional[str] = None,
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        if not self.is_available():
            return False, None, "OpenAI backend not available"

        try:
            system_prompt = self._get_system_prompt(action)
            user_prompt = f"Content to process:\n\n{text}"
            if additional_instructions:
                user_prompt += f"\n\nAdditional instructions: {additional_instructions}"

            response = self.client.chat.completions.create(
                model="gpt-4.1-nano",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens=1500,
                temperature=0.7,
            )
            result = response.choices[0].message.content.strip()
            return True, result, None
        except Exception as e:
            return False, None, f"OpenAI API error: {str(e)}"


class HuggingFaceBackend(AIBackend):
    """HuggingFace backend implementation."""

    def __init__(self):
        """Initialize the HuggingFace backend."""
        self.api_token = config.HUGGINGFACE_API_TOKEN
        # For now, we'll use a mock implementation
        # In a real implementation, you would use the transformers library
        # or HuggingFace Inference API

    def is_available(self) -> bool:
        """Check if HuggingFace is available."""
        # For this MVP, we'll return True if token is provided
        # In a real implementation, you would test the actual connection
        return bool(self.api_token and self.api_token != "your_huggingface_token_here")

    def _get_mock_response(self, action: ActionType, text: str) -> str:
        """Generate a mock response for demonstration purposes."""
        responses = {
            ActionType.SUMMARIZE: (
                "**Summary (Generated by HuggingFace Backend)**\n\n"
                "This is a mock summary of the provided content. In a real implementation, "
                "this would be generated using a HuggingFace model like BART, T5, or similar. "
                f"The content appears to be about {len(text.split())} words long and covers "
                "various topics that would be summarized here.\n\n"
                "Key points would include:\n"
                "• Main concept 1\n"
                "• Main concept 2\n"
                "• Main concept 3\n"
                "• Conclusion or implications"
            ),
            ActionType.GENERATE_QUESTIONS: (
                "**Study Questions (Generated by HuggingFace Backend)**\n\n"
                "1. What are the main concepts discussed in this content?\n"
                "2. How do these concepts relate to each other?\n"
                "3. What are the practical applications of this information?\n"
                "4. What questions might appear on an exam about this topic?\n"
                "5. How would you explain this to someone unfamiliar with the subject?\n"
                "6. What are the strengths and limitations of the approaches discussed?\n"
                "7. How does this content connect to other topics in the field?\n"
                "8. What further research or study would be beneficial?\n\n"
                "*Note: This is a mock response. Real implementation would use models like T5 or GPT-2.*"
            ),
            ActionType.PLAN_STUDY: (
                "**Study Plan (Generated by HuggingFace Backend)**\n\n"
                "**Week 1: Foundation Building**\n"
                "• Review key concepts (2-3 hours)\n"
                "• Create concept maps\n"
                "• Practice basic problems\n\n"
                "**Week 2: Application & Practice**\n"
                "• Work through examples (3-4 hours)\n"
                "• Complete practice exercises\n"
                "• Form study group discussions\n\n"
                "**Week 3: Review & Assessment**\n"
                "• Review all materials (2-3 hours)\n"
                "• Take practice tests\n"
                "• Focus on weak areas\n\n"
                "*Note: This is a mock response. Real implementation would use specialized models.*"
            ),
            ActionType.FLASHCARDS: (
                "**🗂️ Flashcards (Generated by HuggingFace Backend)**\n\n"
                "**Card 1**\n"
                "**Front:** What is the main topic of this content?\n"
                "**Back:** The content covers [topic] with key points:\n"
                "• Point 1\n"
                "• Point 2\n"
                "• Example: [specific example]\n\n"
                "**Card 2**\n"
                "**Front:** What are the key concepts discussed?\n"
                "**Back:** The main concepts include:\n"
                "• Concept A: [definition]\n"
                "• Concept B: [definition]\n"
                "• Concept C: [definition]\n\n"
                "**Card 3**\n"
                "**Front:** How can this information be applied?\n"
                "**Back:** Practical applications include:\n"
                "• Application 1\n"
                "• Application 2\n"
                "• Real-world example\n\n"
                "*Note: This is a mock response. Real implementation would use specialized models.*"
            ),
        }
        return responses.get(action, "Mock response from HuggingFace backend.")

    def process_text(
        self,
        action: ActionType,
        text: str,
        additional_instructions: Optional[str] = None,
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        """Process text using HuggingFace (mock implementation)."""
        if not self.is_available():
            return False, None, "HuggingFace backend not available"

        try:
            # This is a mock implementation
            # In a real implementation, you would:
            # 1. Use the transformers library to load a model
            # 2. Or use the HuggingFace Inference API
            # 3. Process the text according to the action type

            result = self._get_mock_response(action, text)

            if additional_instructions:
                result += f"\n\n*Additional instructions were provided: {additional_instructions}*"

            return True, result, None

        except Exception as e:
            return False, None, f"HuggingFace backend error: {str(e)}"


def get_ai_backend() -> AIBackend:
    """Get the configured AI backend."""
    if config.AI_BACKEND == "openai":
        return OpenAIBackend()
    elif config.AI_BACKEND == "huggingface":
        return HuggingFaceBackend()
    else:
        raise ValueError(f"Unknown AI backend: {config.AI_BACKEND}")
