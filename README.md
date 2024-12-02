allow users to create a profile, log in 
allow users to view a certain set of info as a visitor
sort by character, phase, etc 
mark off which movies they have seen
have a list of movies they'd like to see, which can be automatically or manually sorted (auto sorting would have a "watch list" input)
rate movies
create their own watch order 
rate others' watch order 
comment on movies 
add spoiler warnings to movie comments
input what movie you'd like to watch, which then shows you a breakdown of all the relevant backstory media (shows, movies, etc.)
  - keywords?
  - could other users add this? (IE add a hashtag to a movie)
  - relational database where keywords connect to another

Backend: 
  - Database featuring *entire* MCU catalog 
  - API that will communicate with frontend
    - Routes: 
      - /get all movies
      - /get specific movies by character, phase, etc
      - /get list of movies a particular user has watched
      - //add more here

Frontend: 
  - Login/Register page
  - Catalog page 
    - Additional details / summary of movie clicked / hide spoilers (extend)
  - Watch List Options page
  - Community page? (this might populate a list of recently commented on movies, recent ratings, etc.)
  - What to Watch page (see line 11)

