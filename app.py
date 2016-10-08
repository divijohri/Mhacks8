import os
import json
from flask import Flask, request, url_for, session, redirect, render_template, send_from_directory
from flask_oauth import OAuth
from werkzeug.contrib.fixers import ProxyFix
#import gevent.monkey
from time import time

app = Flask(__name__,
        static_folder="static",
        template_folder="templates/")

app.wsgi_app = ProxyFix(app.wsgi_app)

def config_app():
    app.debug = os.environ.get("DEBUGGING", 'false') == 'true'
    app.config['DEPLOYMENT_VERSION'] = str(int(time()))
    app.jinja_env.globals['url_for'] = url_for
    #gevent.monkey.patch_thread()
    app.config["SECRET_KEY"] = "a0a0b0.sa,dfm3ekljr3000x0y0z0"
    return app

FACEBOOK_APP_ID = '1134901306546069'
FACEBOOK_APP_SECRET = '7e096c3a6d34e9ffe65795b49f01b978'

oauth = OAuth()

facebook = oauth.remote_app('facebook',
    base_url='https://graph.facebook.com/',
    request_token_url=None,
    access_token_url='/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth',
    consumer_key=FACEBOOK_APP_ID,
    consumer_secret=FACEBOOK_APP_SECRET,
    request_token_params={'scope': ('email, ')}
)

@facebook.tokengetter
def get_facebook_token():
    return session.get('facebook_token')

def pop_login_session():
    session.pop('logged_in', None)
    session.pop('facebook_token', None)

@app.route('/')
def index():
    if get_facebook_token() == None:
        return "<a href='login'>Hello. Log in here.</a>"
    else:
        return "<a href='facebook/me'>You're logged in!</a>"

@app.route("/facebook_login")
def facebook_login():
    return facebook.authorize(callback=url_for('facebook_authorized',
        next=request.args.get('next'), _external=True))

@app.route("/facebook_authorized")
@facebook.authorized_handler
def facebook_authorized(resp):
    next_url = request.args.get('next') or url_for('index')
    if resp is None or 'access_token' not in resp:
        return redirect(next_url)

    session['logged_in'] = True
    session['facebook_token'] = (resp['access_token'], '')

    return redirect(next_url)

@app.route("/facebook/me")
def facebook_me():
    data = facebook.get('/me?fields=id,name,picture').data
    return json.dumps(data)

@app.route("/facebook/me/friends")
def facebook_me_friends():
    data = facebook.get('/me?fields=friends').data
    return json.dumps(data)

@app.route("/facebook/photos")
def facebook_photos():
    user_ids = request.args.get('user_ids').split(',')
    combined_photos = {}
    for user in user_ids:
        user_photos = facebook.get('/' + user + '?fields=id,name,picture').data
        combined_photos.update(user_photos)
    return json.dumps(combined_photos)

@app.route("/logout")
def logout():
    pop_login_session()
    return redirect(url_for('index'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')


print(app.url_map)
