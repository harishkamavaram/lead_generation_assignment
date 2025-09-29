import logging

def setup_logging():
  # Create a logger for your application
  app_logger = logging.getLogger('Backend')
  app_logger.setLevel(logging.DEBUG)
  app_logger.propagate = False  # Prevent the logger from propagating messages to the root logger

  # Check if handlers are already configured
  if not app_logger.handlers:
      # Create a handler that outputs logs to the console
      console_handler = logging.StreamHandler()
      console_handler.setLevel(logging.DEBUG)

      # Create a formatter
      formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
      console_handler.setFormatter(formatter)

      # Add the handler to the logger
      app_logger.addHandler(console_handler)

  # Configure the logger for 'hpack' to suppress DEBUG logs
  hpack_logger = logging.getLogger('hpack')
  hpack_logger.setLevel(logging.WARNING)

  # Configure the logger for 'watchfiles.main' to suppress DEBUG logs
  watchfiles_logger = logging.getLogger('watchfiles.main')
  watchfiles_logger.setLevel(logging.WARNING)

  return app_logger