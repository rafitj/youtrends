# Youtube Trends
UW 2020 - CS348 Project

The database for this project is hosted on Google Cloud Platform, no loading of a sample required.
The database uses this dataset https://www.kaggle.com/datasnaek/youtube-new as well as Youtube's API to get more current data.

The code to get data from the Youtube API is in the following file under the code directory `code/youtube-trends-backend/app/youtube_api.py`

# Location of Files That Implement Features
### Backend
- Updating the database with Youtube API - `code/youtube-trends-backend/app/youtube_api.py`
- Backend API for getting filtered data - `code/youtube-trends-backend/app/routes.py`
- Login with Google (/login and /authorize routes) - `code/youtube-trends-backend/app/routes.py` 
- Playlists - `code/youtube-trends-backend/app/routes.py` 

### Frontend
- User interface for interacting with Backend - `code/youtube-trends-web/src/App.jsx`

## How to Use
You will need the `npm` command to run the project.
<br/>
`cd` into the directory of this project
<br/>
Run the command `chmod +x install.sh` and `chmod +x run.sh`
<br/>
Followed by `./install.sh`
then run with `./run.sh`

This will start the frontend on localhost:3000, we have the backend deployed at https://cs348-project-279101.uc.r.appspot.com/, so you should be able to view videos and use all features directly.

If you want to run the backend:
Open two new tabs for a total of 3.
Starting the backend requires logging into our cloud SQL proxy then starting the backend. First cd into `code/youtube-trends-backend/` in your second tab and run `./start_proxy.sh` assuming you have given it execute permissions. In the 3rd tab cd into `code/youtube-trends-backend/` and run `./run_app.sh`. Now the backend should be running. Refresh the frontend and videos should be displaying. 
If something does not work, we recommend viewing the provided video, m2demo.mov to see a demonstration.
