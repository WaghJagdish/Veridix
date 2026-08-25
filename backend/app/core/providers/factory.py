"""
VERIDIX Provider Factory — routes to the correct TargetProvider based on target config.
"""
from app.models.db_models import Target
from app.core.providers.base import TargetProvider


def get_provider(target: Target) -> TargetProvider:
    """Factory: return the correct provider for a given target."""
    provider = (target.provider or "openai").lower()
    api_key = target.api_key_encrypted or ""

    if provider == "openai":
        from app.core.providers.openai_provider import OpenAIProvider
        return OpenAIProvider(api_key=api_key, model=target.model)

    elif provider == "anthropic":
        from app.core.providers.anthropic_provider import AnthropicProvider
        return AnthropicProvider(api_key=api_key, model=target.model)

    elif provider == "gemini":
        from app.core.providers.gemini_provider import GeminiProvider
        return GeminiProvider(api_key=api_key, model=target.model)

    elif provider == "groq":
        from app.core.providers.groq_provider import GroqProvider
        return GroqProvider(api_key=api_key, model=target.model)

    elif provider in ("custom", "openai_compatible"):
        from app.core.providers.custom_provider import CustomProvider
        return CustomProvider(
            api_key=api_key,
            model=target.model,
            endpoint=target.endpoint or "",
        )

    else:
        # Fallback to OpenAI
        from app.core.providers.openai_provider import OpenAIProvider
        return OpenAIProvider(api_key=api_key, model=target.model)
