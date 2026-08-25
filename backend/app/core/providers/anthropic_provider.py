from app.core.providers.base import TargetProvider, ProviderResponse
from anthropic import AsyncAnthropic
import time

class AnthropicProvider(TargetProvider):
    def __init__(self, api_key: str, model: str):
        self.client = AsyncAnthropic(api_key=api_key)
        self.model = model

    async def send(self, prompt: str, system_prompt: str = None) -> ProviderResponse:
        start = time.time()
        try:
            kwargs = {"model": self.model, "messages": [{"role": "user", "content": prompt}], "max_tokens": 1024, "timeout": 30.0}
            if system_prompt:
                kwargs["system"] = system_prompt
                
            response = await self.client.messages.create(**kwargs)
            latency = int((time.time() - start) * 1000)
            return ProviderResponse(
                raw_response=response.content[0].text,
                latency_ms=latency,
                status="success",
                token_usage={"prompt": response.usage.input_tokens, "completion": response.usage.output_tokens}
            )
        except Exception as e:
            latency = int((time.time() - start) * 1000)
            status = "rate_limited" if "429" in str(e) else "error"
            return ProviderResponse(raw_response="", latency_ms=latency, status=status, token_usage={}, error_message=str(e))
    
    async def verify_connection(self) -> bool:
        try:
            # simple ping
            await self.send("Hello")
            return True
        except:
            return False
