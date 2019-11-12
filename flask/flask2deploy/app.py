from flask import Flask,request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import DOUBLE
import requests
import simplejson as json

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

@app.route('/transacciones/<string:parametro>',methods=['GET'])
def getting_transac(parametro):
	#One way to get the info without adding name parameter in route,but fronend needs to send us with that name parameter
	#data=request.args.get('parametro') 

	#Another way with adding name parameter in route
	transa_result=Transa.query.first()
	json_data=jsonify({'client_id':transa_result.client_id,
										'Longitud':str(transa_result.merchant_lon),
										'Latitude':str(transa_result.merchant_lat),
										'Parametro': parametro})
	geojson_data=jsonify({
    "type": "FeatureCollection",
    "features": [
    {
        "type": "Feature",
        "geometry" : {
            "type": "Point",
            "coordinates": [transa_result.merchant_lon, transa_result.merchant_lat]
            },
        "properties" : 'transa_result',
     }]
		})
	return geojson_data

if __name__ == '__main__':
	app.run(debug=True)