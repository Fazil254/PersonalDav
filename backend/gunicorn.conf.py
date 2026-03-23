# Gunicorn configuration for Render free tier
workers    = 1
threads    = 2
timeout    = 120
keepalive  = 5
bind       = '0.0.0.0:10000'
worker_class = 'sync'
max_requests = 1000
max_requests_jitter = 50
preload_app = False