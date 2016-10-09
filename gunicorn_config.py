from multiprocessing import cpu_count
import os

def max_workers():
    return cpu_count() * 2 + 1

debug = os.environ.get("DEBUGGING", 'false') == 'true'

#daemon = True
bind = "127.0.0.1:80"
workers = max_workers()
worker_class = "gevent"
worker_connections = 1000
preload_app = True
loglevel = "info"

if debug:
    loglevel = "debug"

def post_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def pre_exec(server):
    server.log.info("Forked child, re-executing.")

def when_ready(server):
    server.log.info("Server is ready. Spawning workers")

def worker_int(worker):
    worker.log.info("worker received INT or QUIT signal")
    ## get traceback info
    import threading, sys, traceback
    id2name = dict([(th.ident, th.name) for th in threading.enumerate()])
    code = []
    for threadId, stack in sys._current_frames().items():
        code.append("\n# Thread: %s(%d)" % (id2name.get(threadId,""), threadId))
        for filename, lineno, name, line in traceback.extract_stack(stack):
            code.append('File: "%s", line %d, in %s' % (filename, lineno, name))
            if line:
                code.append("  %s" % (line.strip()))
    worker.log.debug("\n".join(code))

def worker_exit(server, worker):
    server.log.debug("Worker exited - Closing connection pool")

def worker_abort(worker):
    worker.log.info("worker received SIGABRT signal")
