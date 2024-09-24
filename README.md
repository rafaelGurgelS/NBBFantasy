# NBB Fantasy
The proposal is based on a 'fantasy game,' similar to Cartola FC by Globo, but focused on basketball, specifically the Novo Basquete Brasil (NBB) competition from the National Basketball League. Participants will have the opportunity to simulate matches and accumulate points based on the results of NBB games.
The data from players was fetched from this repository(https://github.com/vmussa/nbb-notebooks) and teams/matches data came from this one(https://github.com/GabrielPastorello/nbb_api/blob/main/API.md).



# How to use

## Install dependencies by checking package.json file



## Navigate to backend directory

```
 cd backend    

```

## Create database

On files create_tables.py, uploading_data.py and server.py, you may configure the information about your database. This project was tested with PostgreSQL, but should work on others compatible with SQLAlchemy.
  ## 

<pre>
 url = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    host="localhost",
    database="nbb",
    password=" ",
    port="5432"
) 
</pre>


```
python create_tables.py
 ```


```
python uploading_data.py
 ```
## Backend server

```
python server.py
 ```

## IP address

Navigate to app\globalcontext.js and put the addres of your flask server.

```
cd app

 ```


<pre>

 const [ip, setIP] = useState(' ');
 
</pre>

## Run the project

This will generate an QR Code and you can read it with the Expo app on your smartphone.
```
npx expo start

 ```
