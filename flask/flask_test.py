from flask import Flask,render_template
from forms import RegistrationForm #Importing class form forms.py file
app = Flask(__name__)

#Secret key to avoid some attacks 
app.config['SECRET_KEY']='ea32e980e61ef6f0e7094860ee64147e'


from_database={
	'author':'Brad Figueroa',
	'age' : '22',
	'sex' : 'Male'
} #Could be a dictionary or whatever, it's just a example. But it's supposed to come from data base

@app.route('/')
@app.route('/home') #URL extension
def home():
	#All HTML files have to be in TEMPLATES folder, render_template function loads HTML file.
	#FLASK uses JINJA2 to insert data obtained from backend into HTML files(frontend) 
	#DATA parameter is variable's name which we want to pass to HTML file and FROM_DATABASE is its value.
	return render_template('home.html',data=from_database) 

@app.route('/register')
def register():
	form=RegistrationForm() #Instance of RegistrationForm class
	return render_template('register.html',title='Register',form=form)


if __name__ == '__main__':
	app.run(debug=True)