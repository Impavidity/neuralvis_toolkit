from flask import Flask, jsonify, request, json, render_template, Blueprint, abort
from flask import make_response
from flask_cors import CORS
from jinja2 import TemplateNotFound

host = '0.0.0.0'
port = 10013



simple_page = Blueprint('simple_page', __name__,
                        template_folder='templates')
@simple_page.route('/', defaults={'page': 'index'})
@simple_page.route('/<page>')
def show(page):
    try:
        return render_template('pages/%s.html' % page)
    except TemplateNotFound:
        abort(404)

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.register_blueprint(simple_page)

if __name__ == '__main__':
    app.run(host=host, port=port, debug=True)