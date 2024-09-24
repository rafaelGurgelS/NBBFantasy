# NBB Fantasy
The proposal is based on a 'fantasy game,' similar to Cartola FC by Globo, but focused on basketball, specifically the Novo Basquete Brasil (NBB) competition from the National Basketball League. Participants will have the opportunity to simulate matches and accumulate points based on the results of NBB games.
The data from players was fetched from this repository(https://github.com/vmussa/nbb-notebooks) and teams/matches data came from this one(https://github.com/GabrielPastorello/nbb_api/blob/main/API.md).



# How to use

##Install dependencies by checking package.json file



## Navigate to backend directory

```
 cd backend    

```

## Create database

On files create_tables.py, uploading_data.py and server.py, you may configure the information about your database. This project was tested with PostgreSQL, but should work on others compatible with SQLAlchemy.
  ## 

```
url = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    host="localhost",
    database="nbb",
    password=" ",
    port="5432"
)
 ```

```
python create_tables.py
 ```


```
python uploading_data.py
 ```
## Database

## Executar o projeto Expo

```npx expo start```

