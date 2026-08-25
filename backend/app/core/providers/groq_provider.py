from app.core.providers.base import TargetProvider, ProviderResponse
from openai import AsyncOpenAI
import time

class GroqProvider(TargetProvider):
    def __init__(self, api_key: str, model: str):
        self.client = AsyncOpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
        self.model = model

    async def send(self, prompt: str, system_prompt: str = None) -> ProviderResponse:
        start = time.time()
        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                timeout=30.0
            )
            latency = int((time.time() - start) * 1000)
            return ProviderResponse(
                raw_response=response.choices[0].message.content,
                latency_ms=latency,
                status="success",
                token_usage={"prompt": response.usage.prompt_tokens, "completion": response.usage.completion_tokens}
            )
        except Exception as e:
            latency = int((time.time() - start) * 1000)
            status = "rate_limited" if "429" in str(e) else "error"
            return ProviderResponse(raw_response="", latency_ms=latency, status=status, token_usage={}, error_message=str(e))
    
    async def verify_connection(self) -> bool:
        try:
            await self.client.models.list(timeout=10.0)
            return True
        except:
            return False
