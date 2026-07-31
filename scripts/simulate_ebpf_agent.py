import time
import json
import random
import requests
import argparse

# Usage: python scripts/simulate_ebpf_agent.py --url http://localhost:8000/api/v1/ebpf/stream

def generate_mock_metrics(spike=False):
    timestamp = int(time.time() * 1000)
    
    # Simulate CPU usage
    cpu_val = random.uniform(96.0, 99.9) if spike else random.uniform(20.0, 85.0)
    
    # Simulate Memory usage
    mem_val = random.uniform(40.0, 95.0)
    
    # Simulate Network latency
    lat_val = random.uniform(10.0, 150.0)
    
    return [
        {
            "timestamp": timestamp,
            "metric_name": "system.cpu.utilization",
            "value": cpu_val,
            "labels": {"pid": "1234", "process_name": "node"}
        },
        {
            "timestamp": timestamp,
            "metric_name": "system.memory.usage",
            "value": mem_val,
            "labels": {"pid": "1234", "process_name": "node"}
        },
        {
            "timestamp": timestamp,
            "metric_name": "network.tcp.latency",
            "value": lat_val,
            "labels": {"dest_ip": "10.0.0.5", "port": "443"}
        }
    ]

def main():
    parser = argparse.ArgumentParser(description="Simulate an eBPF Telemetry Agent")
    parser.add_argument("--url", default="http://localhost:8000/api/v1/ebpf/stream", help="API endpoint URL")
    parser.add_argument("--interval", type=float, default=1.0, help="Interval between requests in seconds")
    parser.add_argument("--spike", action="store_true", help="Force a CPU anomaly spike")
    args = parser.parse_args()
    
    print(f"Starting eBPF Agent Simulator...")
    if args.spike:
        print("WARNING: --spike flag active. Simulating CPU > 95% anomaly.")
    print(f"Streaming metrics to {args.url} every {args.interval} seconds.")
    
    try:
        while True:
            metrics = generate_mock_metrics(spike=args.spike)
            payload = {
                "agent_id": "ebpf-agent-node-01",
                "host": "prod-web-eu-west-1",
                "metrics": metrics
            }
            
            try:
                response = requests.post(args.url, json=payload, timeout=2)
                if response.status_code == 202:
                    print(f"[{time.strftime('%H:%M:%S')}] Sent {len(metrics)} metrics. Status: 202 Accepted")
                else:
                    print(f"[{time.strftime('%H:%M:%S')}] Error: {response.status_code} - {response.text}")
            except requests.exceptions.RequestException as e:
                print(f"[{time.strftime('%H:%M:%S')}] Connection failed: {e}")
                
            time.sleep(args.interval)
            
    except KeyboardInterrupt:
        print("\nStopping eBPF Simulator.")

if __name__ == "__main__":
    main()
