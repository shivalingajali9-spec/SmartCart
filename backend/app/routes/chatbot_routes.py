from flask import Blueprint, request, jsonify
import re

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/ask', methods=['POST'])
def ask_chatbot():
    data = request.json
    message = data.get('message', '').strip().lower()

    if not message:
        return jsonify({"reply": "I'm sorry, I didn't catch that. How can I help you today?", "action": None})

    # Rule-based NLP Mock
    
    # 1. Product Search Intent
    search_match = re.search(r'(find|search for|looking for|show me|recommend) (?:some |a )?(.+)', message)
    if search_match:
        query = search_match.group(2).replace('please', '').strip()
        # Clean up question marks
        query = query.rstrip('?')
        return jsonify({
            "reply": f"Sure! I can help you find '{query}'. Let me pull up some options for you right now.",
            "action": {"type": "SEARCH", "payload": query}
        })

    # 2. Greeting
    if any(greet in message for greet in ['hello', 'hi', 'hey', 'greetings']):
        return jsonify({
            "reply": "Hello there! I'm your SmartCart AI Assistant. I can help you find products, compare prices, or explain how our fake review detection works. What do you need?",
            "action": None
        })

    # 3. Explain Fake Review Detection
    if 'fake' in message or 'review' in message or 'how' in message:
        return jsonify({
            "reply": "SmartCart uses a Scikit-Learn Logistic Regression NLP model to analyze the text of reviews across platforms like Amazon and Flipkart. We cross-reference the sentiment and vocabulary to assign a Trust Score, automatically filtering out fake spam!",
            "action": None
        })

    # 4. Explain SmartCart
    if 'what is smartcart' in message or 'about' in message:
        return jsonify({
            "reply": "SmartCart is an advanced e-commerce aggregator. We combine product comparison, AI fake review detection, and smart analytics into a single seamless experience.",
            "action": None
        })

    # Fallback
    return jsonify({
        "reply": "I'm still learning, but I'm here to assist you with shopping! Try asking me to 'find a gaming laptop' or 'show me wireless earbuds'.",
        "action": None
    })
