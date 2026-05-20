import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.app.graph import workflow_app

def generate_graph():
    try:
        mermaid_graph = workflow_app.get_graph().draw_mermaid()
        with open('graph.mmd', 'w') as f:
            f.write(mermaid_graph)
        print("Mermaid graph saved to graph.mmd")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate_graph()
