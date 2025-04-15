import subprocess
import sys
import time
import signal
from threading import Thread

client_process = None
server_process = None

def run_client():
    global client_process
    try:
        print("Starting React client...")
        client_process = subprocess.Popen(
            ['npm', 'start'],
            cwd='shareme-client',  
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1, 
            universal_newlines=True
        )
        
        while True:
            output = client_process.stdout.readline()
            if output == '' and client_process.poll() is not None:
                break
            if output:
                print(f"[React] {output.strip()}")
        
        if client_process.poll() is not None:
            errors = client_process.stderr.read()
            if errors:
                print(f"[React Error] {errors.strip()}", file=sys.stderr)
                
    except Exception as e:
        print(f"Failed to start React client: {e}", file=sys.stderr)

def run_server():
    global server_process
    try:
        print("Starting Express server...")
        server_process = subprocess.Popen(
            ['node', 'server.js'],
            cwd='server',  
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        while True:
            output = server_process.stdout.readline()
            if output == '' and server_process.poll() is not None:
                break
            if output:
                print(f"[Express] {output.strip()}")
        
        if server_process.poll() is not None:
            errors = server_process.stderr.read()
            if errors:
                print(f"[Express Error] {errors.strip()}", file=sys.stderr)
                
    except Exception as e:
        print(f"Failed to start Express server: {e}", file=sys.stderr)

def signal_handler(sig, frame):
    print("\nShutting down processes...")
    if client_process:
        client_process.terminate()
    if server_process:
        server_process.terminate()
    sys.exit(0)

def application():
    signal.signal(signal.SIGINT, signal_handler)
    client_thread = Thread(target=run_client)
    server_thread = Thread(target=run_server)
    
    client_thread.daemon = True 
    server_thread.daemon = True
    
    client_thread.start()
    server_thread.start()
    
    print("Both client and server are running. Press Ctrl+C to stop.")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        signal_handler(None, None)

if __name__ == "__main__":
    application()