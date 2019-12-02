from flask import Flask,request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import DOUBLE
from sqlalchemy import Date, cast,and_,select,text
from datetime import date
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

@app.route('/transactions/<start_date>/<end_date>/<merchant_types>',methods=['GET'])
#style start_date: YYYY-MM-DD
def getting_transactions(start_date,end_date,merchant_types):
	#One way to get the info without adding name parameter in route,but fronend needs to send us with that name parameter
	#data=request.args.get('parametro') 

	#Another way with adding name parameter in route
	result=Transa.query.filter(
		cast(Transa.date,Date).between(start_date,end_date),
		Transa.merchant_type==merchant_types
		).all()
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
@app.route('/home')
def showingData():
	#Function which has to be called at beginning to get data to show in every combobox
	
	#Check if we need to show ID's merchant_type as well 
	merchant_type_sql=text('select DISTINCT merchant_type from transa')
	merchant_types_result=db.engine.execute(merchant_type_sql)
	merchant_types=[row[0] for row in merchant_types_result]
	merchant_types.insert(0,'Todo')

	#Check if we need to consult DB coz it just 2 different values
	#We can hardcode it like macro_option right here or frontend 
	debit_type_sql=text('select distinct debit_type from transa')
	debit_type_result=db.engine.execute(debit_type_sql)
	debit_type=[row[0] for row in debit_type_result]
	
	return jsonify({
		'results':{
			'merchant_types':merchant_types,
			'debit_type':debit_type,
			'macro_option':['Cantidad de transacciones','Monto consumido'],
			'gender':['Masculino','Femenino']
			}
		})

@app.route('/consult/<merchant_type>/<card_type>/<gender>/<vista>',methods=['GET'])
def consultMacro(merchant_type,card_type,gender,vista):	
	resultados={}
	merchant_type=merchant_type.replace('"',"'")
	vista_type='amount_sol' if vista=='Montos' else 'nb_transaction'
	base_sql_consult=f'select sum({vista_type}) from transa where 1=1'
	merchant_type_sql_filter=f' and merchant_type={merchant_type}'
	card_type_sql_filter=f' and debit_type={card_type}'
	gender_sql_filter=f' and client_gender={gender}'
	distritos={'Lince':'150116','SJL':'150132'}#El primero es de Lince, el segundo es de san juan de lurigancho
	if merchant_type != 'all':
		base_sql_consult= base_sql_consult + merchant_type_sql_filter
	if card_type != 'all':
		base_sql_consult= base_sql_consult + card_type_sql_filter
	if gender != 'all':
		base_sql_consult= base_sql_consult + gender_sql_filter

	for distrito in distritos:
		new_query= base_sql_consult + f" and merchant_geoid='{distritos[distrito]}'"
		result=db.engine.execute(text(new_query))
		resultados[distrito]=[row[0] for row in result]

	return jsonify({'result':{key:value for key,value in resultados.items()}})


if __name__ == '__main__':
	app.run(debug=True)