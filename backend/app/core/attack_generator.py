from app.core.intents.intent_library import SemanticIntent

async def generate_attack_variants(intent: SemanticIntent, languages: list[str], use_llm: bool = False, judge_provider_config: dict = None) -> list[dict]:
    variants = []
    for lang in languages:
        prompt = intent.base_prompt_en
        if lang == "hi":
            prompt = intent.hindi_template
        elif lang == "hinglish":
            prompt = intent.hinglish_template
            
        variants.append({
            "language": lang,
            "generated_prompt": prompt,
            "generation_method": "template",
            "attack_metadata": {"strategy": intent.attack_strategy}
        })
    return variants
