from .config import Config

_config = None

def initialize_config(groq_api_key):
  global _config
  print("Initializing config")
  # print(f"groq_api_key: {groq_api_key}")
  _config = Config(groq_api_key)

def get_config():
  if _config is None:
      raise RuntimeError("Config not initialized. Call initialize_config first.")
  return _config