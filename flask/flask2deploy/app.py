from flask import Flask,request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import DOUBLE
from sqlalchemy import Date, cast
from datetime import date
import requests
import simplejson as json
from sqlalchemy import select

# initialize the flask app
app = Flask(__name__)

#Configuration for database,we're gonna use SQLAlchemy as ORM 
#Database given in class(earthquake.csv)
# URI FORMAT ----> postgresql://<user_name>:<password>@<host>:<port>/<database_name>
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:123456@localhost:5432/transacciones'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db=SQLAlchemy(app)	

#Creating the table as a class and columns as methods  
class Transa(db.Model):
	client_id=db.Column(db.Text,primary_key=True)
	date=db.Column(db.Date)
	mcc=db.Column(db.Text)
	amount_sol=db.Column(DOUBLE())
	amount_usd=db.Column(DOUBLE())
	nb_transaction=db.Column(db.Integer)
	client_age=db.Column(DOUBLE())
	client_gender=db.Column(db.Text)
	debit_type=db.Column(db.Text)
	merchant_id=db.Column(db.Text)
	merchant_name=db.Column(db.Text)
	merchant_type=db.Column(db.Text)
	merchant_geoid=db.Column(db.Text)
	merchant_district=db.Column(db.Text)
	merchant_lon=db.Column(DOUBLE())
	merchant_lat=db.Column(DOUBLE())
	Year=db.Column(db.Integer)
	Month=db.Column(db.Integer)
	Day=db.Column(db.Integer)
	Hour=db.Column(db.Integer)
	Minute=db.Column(db.Integer)
	Second=db.Column(db.Integer)

	def __repr__(self):
		return f"Transa('{self.client_id}','{self.date}','{self.merchant_id}')"

@app.route('/')
def index():
	return 'Hello World!'

@app.route('/transactions/<start_date>/<end_date>',methods=['GET'])
#style start_date: YYYY-MM-DD
def getting_transactions(start_date,end_date):
	#One way to get the info without adding name parameter in route,but fronend needs to send us with that name parameter
	#data=request.args.get('parametro') 

	#Another way with adding name parameter in route
	result=Transa.query.filter( cast(Transa.date,Date).between(start_date,end_date)).all()
	geojson_data=jsonify({
    "type": "FeatureCollection",
    "features": [
    {
        "type": "Feature",
        "geometry" : {
            "type": "Point",
            "coordinates": [row.merchant_lon,row.merchant_lat]
            },
        "properties" : row.client_id,
     }for row in result]
		})
	
	return geojson_data

if __name__ == '__main__':
	app.run(debug=True)