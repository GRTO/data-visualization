from flask import Flask,render_template
from sqlalchemy.dialects.mysql import DOUBLE,TIMESTAMP
from flask_sqlalchemy import SQLAlchemy
from forms import RegistrationForm #Importing class form forms.py file
app = Flask(__name__)

#Secret key to avoid some attacks 
app.config['SECRET_KEY']='ea32e980e61ef6f0e7094860ee64147e'

#Configuration for database,we're gonna use SQLAlchemy as ORM 
#Database given in class(earthquake.csv)
# URI FORMAT ----> postgresql://<user_name>:<password>@<host>:<port>/<database_name>
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:123456@localhost:5432/sismos'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db=SQLAlchemy(app)

#Creating the table as a class and columns as methods  
class Earthquake(db.Model):
	eventid=db.Column(db.CHAR,primary_key=True)
	latitude=db.Column(DOUBLE()) 
	longitude=db.Column(DOUBLE())
	datetime=db.Column(TIMESTAMP())

	def __repr__(self):
		return f"Earthquake('{self.eventid}','{self.latitude}','{self.longitude}')"


from_database={
	'author':'Brad Figueroa',
	'age' : '22',
	'sex' : 'Male'
} #Could be a dictionary or whatever, it's just a example. But it's supposed to come from database

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

@app.route('/earthquake')
def showingData():
	earthquake_result=Earthquake.query.first()
	return render_template('earthquake.html',data=earthquake_result)

if __name__ == '__main__':
	app.run(debug=True)