from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

@dataclass
class ProviderResponse:
    raw_response: str
    latency_ms: int
    status: str
    token_usage: dict
    error_message: Optional[str] = None

class TargetProvider(ABC):
    @abstractmethod
    async def send(self, prompt: str, system_prompt: Optional[str] = None) -> ProviderResponse:
        pass
    
    @abstractmethod
    async def verify_connection(self) -> bool:
        pass
