## 4yearDegree Backend

1. Run npm install
2. Run npm start or npm run start-dev to run with nodemon
3. Use [localhost:3001/api](http://localhost:3001/api) for base use.

This project is build with Node.js, Express.js and MongoDB. Node is required to install
all node dependencies. The database will be populated from start but feel free
to mess with it. Also any new keys added will be duplicated so keep that in mind
and run delete request to start as a new database.

Make sure you give enough time for the database to fetch data as it will take a long time.

##Notes:
Run this in any way to make request to either populate database and delete database:

<strong>Delete all:delete request to:</strong>

http://localhost:3001/api/delete

<strong>Populate Database: Post requests to:</strong>

http://localhost:3001/api/faculty     -> fetch and populate faculty database

http://localhost:3001/api/department -> fetch and populate department database

http://localhost:3001/api/major -> fetch and populate major database

http://localhost:3001/api/course -> fetch and populate course database

<strong>Get a specific database: Get requests to:</strong>

http://localhost:3001/api/faculty   -> get all faculty data

http://localhost:3001/api/:facultyID -> get all department data given faculty 

http://localhost:3001/api/:facultyID/:departmentID -> get all major data given department

http://localhost:3001/api/:facultyID/:departmentID/:majorID -> get all course data given major

