from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    database_url: str = "sqlite:///./veridix.db"
    secret_key: str = "change_this_in_production"
    judge_provider: str = "openai"
    judge_model: str = "gpt-4o-mini"
    judge_api_key: str = ""
    cors_origins: List[str] = ["http://localhost:3000"]
    demo_mode_enabled: bool = True

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

settings = Settings()
