from app.core.providers.base import TargetProvider
from app.models.db_models import LanguageVariant

async def execute_variant(variant: LanguageVariant, provider: TargetProvider, system_prompt: str = None) -> dict:
    response = await provider.send(variant.generated_prompt, system_prompt)
    return {
        "raw_response": response.raw_response,
        "latency_ms": response.latency_ms,
        "status": response.status,
        "token_usage": response.token_usage,
        "error_message": response.error_message
    }
