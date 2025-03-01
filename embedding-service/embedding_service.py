import numpy
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

# Initialize the Flask app
app = Flask(__name__)

# Load the pre-trained transformer model for generating embeddings.
# 'all-MiniLM-L6-v2' is lightweight and effective.
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed_text():
    """
    API endpoint to generate embeddings for provided text.
    Expects JSON payload: { "text": "Your resume text here" }
    Returns: { "embedding": [0.123, 0.456, ...] }
    """
    try:
        # Parse JSON payload; force=True handles cases when MIME type isn't set correctly.
        data = request.get_json(force=True)
        text = data.get('text', '').strip()

        if not text:
            return jsonify({'error': 'No text provided.'}), 400

        # Generate the embedding using the transformer model
        embedding = model.encode(text).tolist()  # Convert numpy array to list for JSON serialization

        return jsonify({'embedding': embedding}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app on all interfaces, port 5001
    app.run(host='0.0.0.0', port=5001)
