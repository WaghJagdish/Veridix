from app.core.providers.base import TargetProvider, ProviderResponse
import google.generativeai as genai
import time
import asyncio

class GeminiProvider(TargetProvider):
    def __init__(self, api_key: str, model: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model)

    async def send(self, prompt: str, system_prompt: str = None) -> ProviderResponse:
        start = time.time()
        try:
            model = self.model
            if system_prompt:
                model = genai.GenerativeModel(self.model.model_name, system_instruction=system_prompt)
            # SDK is sync, so run in executor if needed, but for MVP we wrap it
            response = await asyncio.to_thread(model.generate_content, prompt)
            latency = int((time.time() - start) * 1000)
            
            return ProviderResponse(
                raw_response=response.text,
                latency_ms=latency,
                status="success",
                token_usage={} # Gemini SDK doesn't consistently expose tokens easily in standard format
            )
        except Exception as e:
            latency = int((time.time() - start) * 1000)
            status = "rate_limited" if "429" in str(e) else "error"
            return ProviderResponse(raw_response="", latency_ms=latency, status=status, token_usage={}, error_message=str(e))
    
    async def verify_connection(self) -> bool:
        try:
            await self.send("Hello")
            return True
        except:
            return False
